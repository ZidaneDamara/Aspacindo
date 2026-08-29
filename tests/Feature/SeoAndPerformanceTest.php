<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schedule;
use Tests\TestCase;

class SeoAndPerformanceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_sitemap_xml_returns_valid_xml_response(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/xml; charset=UTF-8');
        $this->assertStringContainsString('<?xml version="1.0" encoding="UTF-8"?>', $response->getContent());
        $this->assertStringContainsString('<urlset', $response->getContent());
    }

    public function test_robots_txt_file_exists_and_is_accessible(): void
    {
        $this->assertFileExists(public_path('robots.txt'));
        $content = file_get_contents(public_path('robots.txt'));
        $this->assertStringContainsString('User-agent: *', $content);
        $this->assertStringContainsString('Sitemap:', $content);
    }

    public function test_scheduled_console_commands_are_registered(): void
    {
        $events = collect(Schedule::events());

        $hasTierRecalculate = $events->contains(function ($event) {
            return str_contains($event->command, 'loyalty:recalculate-tiers');
        });

        $hasPointExpiry = $events->contains(function ($event) {
            return str_contains($event->command, 'loyalty:expire-points');
        });

        $this->assertTrue($hasTierRecalculate, 'loyalty:recalculate-tiers command should be scheduled.');
        $this->assertTrue($hasPointExpiry, 'loyalty:expire-points command should be scheduled.');
    }
}
