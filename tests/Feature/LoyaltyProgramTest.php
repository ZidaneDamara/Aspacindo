<?php

namespace Tests\Feature;

use App\Models\LoyaltyMember;
use App\Models\LoyaltyPointTransaction;
use App\Models\LoyaltyReward;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoyaltyProgramTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_loyalty_landing_page_renders_successfully(): void
    {
        $response = $this->get('/loyalty');
        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_redirected_from_loyalty_dashboard(): void
    {
        $response = $this->get('/loyalty/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_loyalty_dashboard_renders_for_authenticated_member(): void
    {
        $user = User::where('role', 'customer')->first();

        $response = $this->actingAs($user)->get('/loyalty/dashboard');
        $response->assertStatus(200);
    }

    public function test_atomic_point_redemption_deducts_points_correctly(): void
    {
        $user = User::where('role', 'customer')->first();
        $member = $user->loyaltyMember;
        $member->update(['points_balance' => 1000]);

        $reward = LoyaltyReward::where('points_cost', '<=', 500)->first();

        $response = $this->actingAs($user)->post('/loyalty/redeem', [
            'reward_id' => $reward->id,
        ]);

        $response->assertRedirect();
        $this->assertEquals(1000 - $reward->points_cost, $member->fresh()->points_balance);
        $this->assertDatabaseHas('loyalty_redemptions', [
            'loyalty_member_id' => $member->id,
            'loyalty_reward_id' => $reward->id,
        ]);
    }

    public function test_point_redemption_fails_when_points_insufficient(): void
    {
        $user = User::where('role', 'customer')->first();
        $member = $user->loyaltyMember;
        $member->update(['points_balance' => 10]);

        $reward = LoyaltyReward::where('points_cost', '>=', 200)->first();

        $response = $this->actingAs($user)->post('/loyalty/redeem', [
            'reward_id' => $reward->id,
        ]);

        $response->assertRedirect();
        $this->assertEquals(10, $member->fresh()->points_balance);
    }

    public function test_loyalty_tier_recalculation_command(): void
    {
        $user = User::where('role', 'customer')->first();
        $member = $user->loyaltyMember;

        LoyaltyPointTransaction::create([
            'loyalty_member_id' => $member->id,
            'type' => 'earn',
            'source' => 'motor_purchase',
            'points' => 6000,
            'description' => 'Pembelian NMAX Turbo',
            'created_at' => now(),
        ]);

        $this->artisan('loyalty:recalculate-tiers')->assertExitCode(0);
        $this->assertEquals('Platinum', $member->fresh()->tier);
    }

    public function test_point_expiry_command(): void
    {
        $user = User::where('role', 'customer')->first();
        $member = $user->loyaltyMember;
        $member->update(['points_balance' => 500]);

        $tx = new LoyaltyPointTransaction([
            'loyalty_member_id' => $member->id,
            'type' => 'earn',
            'source' => 'service',
            'points' => 200,
            'description' => 'Servis lama',
        ]);
        $tx->created_at = now()->subMonths(13);
        $tx->save();

        $this->artisan('loyalty:expire-points')->assertExitCode(0);
        $this->assertEquals(300, $member->fresh()->points_balance);
    }
}
