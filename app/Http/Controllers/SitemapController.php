<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Motorcycle;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $appUrl = config('app.url');
        $baseUrl = ($appUrl && $appUrl !== 'http://localhost') ? rtrim($appUrl, '/') : $request->getSchemeAndHttpHost();

        $primaryRoutes = [
            '/' => '1.0',
            '/produk' => '0.9',
            '/lokasi-dealer' => '0.9',
            '/tentang-kami' => '0.9',
            '/layanan' => '0.9',
            '/artikel' => '0.9',
            '/simulasi-cicilan' => '0.8',
            '/sparepart' => '0.8',
            '/promo' => '0.8',
            '/galeri-aktifitas' => '0.7',
            '/karir' => '0.7',
            '/testimoni' => '0.7',
        ];

        $motorcycles = Motorcycle::active()->select(['slug', 'updated_at'])->get();
        $articles = Article::published()->select(['slug', 'updated_at'])->get();
        $promotions = Promotion::active()->select(['slug', 'updated_at'])->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($primaryRoutes as $route => $priority) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . $route) . '</loc>';
            $xml .= '<lastmod>' . date('Y-m-d') . '</lastmod>';
            $xml .= '<changefreq>' . ($route === '/' ? 'daily' : 'weekly') . '</changefreq>';
            $xml .= '<priority>' . $priority . '</priority>';
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
            $xml .= '<priority>0.8</priority>';
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
