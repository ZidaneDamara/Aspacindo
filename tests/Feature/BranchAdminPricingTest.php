<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Motorcycle;
use App\Models\User;
use Database\Seeders\BranchSeeder;
use Database\Seeders\MotorcycleSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BranchAdminPricingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(BranchSeeder::class);
        $this->seed(MotorcycleSeeder::class);
        $this->seed(UserSeeder::class);
    }

    public function test_exactly_seven_designated_branch_admins_exist(): void
    {
        $designatedEmails = [
            'admin.pekanbaru@aspacindo.com',
            'admin.pelalawan@aspacindo.com',
            'admin.kampar@aspacindo.com',
            'admin.inhu@aspacindo.com',
            'admin.siak@aspacindo.com',
            'admin.inhil@aspacindo.com',
            'admin.medan@aspacindo.com',
        ];

        $branchAdmins = User::where('role', 'branch_admin')->get();
        $this->assertCount(7, $branchAdmins);

        foreach ($designatedEmails as $email) {
            $admin = User::where('email', $email)->first();
            $this->assertNotNull($admin, "Admin {$email} must exist.");
            $this->assertTrue($admin->isBranchAdmin());
            $this->assertNotNull($admin->branch_id);
        }
    }

    public function test_seeded_branches_are_all_dealer_3s(): void
    {
        $branches = Branch::all();
        $this->assertCount(7, $branches);

        foreach ($branches as $branch) {
            $this->assertEquals('3S', $branch->dealer_type);
            $this->assertTrue($branch->is3S());
            $this->assertTrue($branch->has_service_center);
        }
    }

    public function test_branch_admin_can_input_cabang_kecil_in_their_region(): void
    {
        $siakAdmin = User::where('email', 'admin.siak@aspacindo.com')->first();
        $this->assertNotNull($siakAdmin);

        // Siak admin inputs a small 1S branch
        $response = $this->actingAs($siakAdmin)->post('/admin/branches', [
            'name' => 'Aspacindo Pos Minas (1S)',
            'dealer_type' => '1S',
            'region' => 'Siak',
            'full_address' => 'Jl. Yos Sudarso Km. 28, Minas, Siak',
            'whatsapp_number' => '6281270008888',
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.branches.index'));

        $newBranch = Branch::where('name', 'Aspacindo Pos Minas (1S)')->first();
        $this->assertNotNull($newBranch);
        $this->assertEquals('1S', $newBranch->dealer_type);
        $this->assertEquals('Siak', $newBranch->region);
        $this->assertFalse($newBranch->has_service_center);
    }

    public function test_branch_admin_can_access_branch_prices_for_their_region(): void
    {
        $siakAdmin = User::where('email', 'admin.siak@aspacindo.com')->first();
        $this->assertNotNull($siakAdmin);

        $response = $this->actingAs($siakAdmin)->get('/admin/branch-prices');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/BranchPrices/Index')
            ->where('selectedBranch.id', $siakAdmin->branch_id)
            ->where('isBranchAdmin', true)
        );
    }

    public function test_branch_admin_updates_otr_price_for_entire_region_and_branches(): void
    {
        $siakAdmin = User::where('email', 'admin.siak@aspacindo.com')->first();
        $siakBranch = Branch::find($siakAdmin->branch_id);
        $motorcycle = Motorcycle::first();

        // Add a cabang kecil in Siak
        $posBranch = Branch::create([
            'name' => 'Aspacindo Pos Perawang (2S)',
            'slug' => 'aspacindo-pos-perawang-2s',
            'region' => 'Siak',
            'dealer_type' => '2S',
            'full_address' => 'Jl. Raya Perawang, Siak',
            'whatsapp_number' => '6281270009999',
            'has_service_center' => true,
            'is_active' => true,
        ]);

        $newPrice = 44500000;

        $response = $this->actingAs($siakAdmin)->put("/admin/branch-prices/{$siakBranch->id}/motorcycles/{$motorcycle->id}", [
            'price_otr' => $newPrice,
        ]);

        $response->assertRedirect();
        $motorcycle->refresh();

        // Verifies regional price is updated
        $this->assertEquals($newPrice, $motorcycle->getPriceForRegion('Siak'));
        // Verifies main 3S dealer branch price is updated
        $this->assertEquals($newPrice, $motorcycle->getPriceForBranch($siakBranch));
        // Verifies cabang kecil in Siak also inherits the updated price!
        $this->assertEquals($newPrice, $motorcycle->getPriceForBranch($posBranch));
    }

    public function test_branch_admin_cannot_update_otr_price_for_another_region(): void
    {
        $siakAdmin = User::where('email', 'admin.siak@aspacindo.com')->first();
        $pekanbaruBranch = Branch::where('region', 'Pekanbaru')->first();

        $motorcycle = Motorcycle::first();

        // Siak admin attempts to update Pekanbaru branch/region price -> MUST FAIL with 403 Forbidden
        $response = $this->actingAs($siakAdmin)->put("/admin/branch-prices/{$pekanbaruBranch->id}/motorcycles/{$motorcycle->id}", [
            'price_otr' => 50000000,
        ]);

        $response->assertStatus(403);
    }

    public function test_super_admin_can_update_otr_price_for_any_region(): void
    {
        $superAdmin = User::where('email', 'admin@aspacindo.com')->first();
        $medanBranch = Branch::where('region', 'Medan')->first();
        $motorcycle = Motorcycle::first();

        $newPrice = 46500000;

        $response = $this->actingAs($superAdmin)->put("/admin/branch-prices/{$medanBranch->id}/motorcycles/{$motorcycle->id}", [
            'price_otr' => $newPrice,
        ]);

        $response->assertRedirect();
        $motorcycle->refresh();
        $this->assertEquals($newPrice, $motorcycle->getPriceForRegion('Medan'));
        $this->assertEquals($newPrice, $motorcycle->getPriceForBranch($medanBranch));
    }
}
