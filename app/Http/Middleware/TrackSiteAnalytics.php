<?php

namespace App\Http\Middleware;

use App\Models\SearchLog;
use App\Models\SiteVisit;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class TrackSiteAnalytics
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only track successful GET requests on public facing pages
        if ($request->isMethod('GET') && $response->getStatusCode() === 200 && !$request->is('admin*') && !$request->is('api*')) {
            try {
                $today = now()->toDateString();
                $userAgent = $request->userAgent() ?? '';
                $isMobile = preg_match('/(android|iphone|ipad|mobile|touch)/i', $userAgent) ? 1 : 0;
                $ipHash = md5($request->ip() . '_' . $today);

                $cacheKey = "visited_{$today}_{$ipHash}";
                $isUnique = !Cache::has($cacheKey);
                if ($isUnique) {
                    Cache::put($cacheKey, true, now()->endOfDay());
                }

                // Update or create site visit record
                SiteVisit::updateOrCreate(
                    ['visit_date' => $today],
                    []
                );

                // Increment counts using DB raw
                $updateData = [
                    'page_views' => DB::raw('page_views + 1'),
                ];
                if ($isMobile) {
                    $updateData['mobile_views'] = DB::raw('mobile_views + 1');
                } else {
                    $updateData['desktop_views'] = DB::raw('desktop_views + 1');
                }
                if ($isUnique) {
                    $updateData['unique_visitors'] = DB::raw('unique_visitors + 1');
                }

                SiteVisit::where('visit_date', $today)->update($updateData);

                // Check for search queries
                $searchQuery = $request->query('q') ?? $request->query('search') ?? $request->query('keyword');
                if ($searchQuery) {
                    SearchLog::recordSearch($searchQuery);
                }
            } catch (\Throwable $e) {
                // Silently ignore tracking errors to avoid breaking requests
            }
        }

        return $response;
    }
}

