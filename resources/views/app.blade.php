<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Dealer Resmi Yamaha | Aspacindo Kedaton Motor') }}</title>

        <!-- Base SEO & Indexing Directives (No noindex, allow indexing) -->
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        <meta name="author" content="PT. Aspacindo Kedaton Motor">
        <meta name="geo.region" content="ID-RI">
        <meta name="geo.placename" content="Pekanbaru, Riau, Indonesia">

        <!-- Favicon -->
        <link rel="icon" type="image/png" href="/favicon.png">
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/favicon.png">

        <!-- Corporate Sans-Serif Fonts (Plus Jakarta Sans & Inter) -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

        <style>
            body, button, input, select, textarea {
                font-family: 'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            }
        </style>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-slate-50 text-slate-900">
        @inertia
    </body>
</html>
