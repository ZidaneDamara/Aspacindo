<?php

namespace Tests\Feature;

use App\Models\LoyaltyMember;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_unauthenticated_user_redirected_from_admin(): void
    {
        $response = $this->get('/admin');
        $response->assertRedirect('/login');
    }

    public function test_customer_role_user_forbidden_from_admin(): void
    {
        $customer = User::where('role', 'customer')->first();

        $response = $this->actingAs($customer)->get('/admin');
        $response->assertRedirect('/loyalty/dashboard');
    }

    public function test_admin_user_can_access_admin_dashboard(): void
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)->get('/admin');
        $response->assertStatus(200);
    }

    public function test_staff_user_can_access_admin_dashboard(): void
    {
        $staff = User::where('role', 'staff')->first();

        $response = $this->actingAs($staff)->get('/admin');
        $response->assertStatus(200);
    }

    public function test_staff_offline_point_input_tool_creates_transaction_and_updates_member_points(): void
    {
        $staff = User::where('role', 'staff')->first();
        $member = LoyaltyMember::first();
        $initialBalance = $member->points_balance;

        // Transaction Rp 1.000.000 service = 1.000 points
        $response = $this->actingAs($staff)->post('/admin/loyalty/point-input', [
            'member_id' => $member->id,
            'source' => 'service',
            'transaction_amount' => 1000000,
            'reference_number' => 'INV-TEST-001',
        ]);

        $response->assertRedirect('/admin/loyalty/point-input');
        $this->assertEquals($initialBalance + 1000, $member->fresh()->points_balance);
        $this->assertDatabaseHas('loyalty_point_transactions', [
            'loyalty_member_id' => $member->id,
            'points' => 1000,
            'related_reference' => 'INV-TEST-001',
        ]);
    }

    public function test_admin_can_update_loyalty_settings(): void
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)->post('/admin/loyalty/settings', [
            'service_ratio' => 500,
            'motor_ratio' => 40000,
            'sparepart_ratio' => 1500,
            'referral_points' => 100,
            'expiry_months' => 24,
            'gold_threshold' => 1500,
            'platinum_threshold' => 6000,
        ]);

        $response->assertRedirect();
    }

    public function test_admin_can_access_spareparts_and_create_sparepart(): void
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)->get('/admin/spareparts');
        $response->assertStatus(200);

        $createResponse = $this->actingAs($admin)->post('/admin/spareparts', [
            'name' => 'Oli Yamalube Test',
            'category' => 'Pelumas',
            'price' => 55000,
            'description' => 'Deskripsi oli tes',
            'is_new' => true,
            'is_active' => true,
        ]);

        $createResponse->assertRedirect('/admin/spareparts');
        $this->assertDatabaseHas('spareparts', [
            'name' => 'Oli Yamalube Test',
            'price' => 55000,
        ]);
    }
}
