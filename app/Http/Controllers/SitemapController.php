<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Motorcycle;
use App\Models\Promotion;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $baseUrl = config('app.url', 'http://localhost');

        $staticRoutes = [
            '/',
            '/produk',
            '/simulasi-cicilan',
            '/layanan',
            '/lokasi-dealer',
            '/tentang-kami',
            '/galeri-aktifitas',
            '/karir',
            '/artikel',
            '/promo',
            '/testimoni',
            '/loyalty',
        ];

        $motorcycles = Motorcycle::active()->select(['slug', 'updated_at'])->get();
        $articles = Article::published()->select(['slug', 'updated_at'])->get();
        $promotions = Promotion::active()->select(['slug', 'updated_at'])->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($staticRoutes as $route) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . $route) . '</loc>';
            $xml .= '<lastmod>' . date('Y-m-d') . '</lastmod>';
            $xml .= '<changefreq>daily</changefreq>';
            $xml .= '<priority>0.8</priority>';
            $xml .= '</url>';
        }

        foreach ($motorcycles as $bike) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . '/produk/' . $bike->slug) . '</loc>';
            $xml .= '<lastmod>' . $bike->updated_at->format('Y-m-d') . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.9</priority>';
            $xml .= '</url>';
        }

        foreach ($articles as $art) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . '/artikel/' . $art->slug) . '</loc>';
            $xml .= '<lastmod>' . $art->updated_at->format('Y-m-d') . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.7</priority>';
            $xml .= '</url>';
        }

        foreach ($promotions as $promo) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . '/promo/' . $promo->slug) . '</loc>';
            $xml .= '<lastmod>' . $promo->updated_at->format('Y-m-d') . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.8</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'text/xml']);
    }
}
