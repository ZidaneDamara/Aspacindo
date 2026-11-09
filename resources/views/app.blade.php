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

        <!-- Google Fonts: Play & Noto Sans -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Play:wght@400;700&display=swap" rel="stylesheet">

        <style>
            /* Local font declarations ensuring 100% offline & local server reliability */
            @font-face {
                font-family: 'Play';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url('/fonts/Play-Regular.ttf') format('truetype'),
                     url('https://fonts.gstatic.com/s/play/v21/6aez4K2oVqwIjtI.ttf') format('truetype');
            }
            @font-face {
                font-family: 'Play';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url('/fonts/Play-Bold.ttf') format('truetype'),
                     url('https://fonts.gstatic.com/s/play/v21/6ae84K2oVqwItm4TOpc.ttf') format('truetype');
            }
            @font-face {
                font-family: 'Play-Bold';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url('/fonts/Play-Bold.ttf') format('truetype'),
                     url('https://fonts.gstatic.com/s/play/v21/6ae84K2oVqwItm4TOpc.ttf') format('truetype');
            }
            @font-face {
                font-family: 'Noto Sans';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url('/fonts/NotoSans-Regular.ttf') format('truetype'),
                     url('https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99d.ttf') format('truetype');
            }
            @font-face {
                font-family: 'NotoSans-Regular';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url('/fonts/NotoSans-Regular.ttf') format('truetype'),
                     url('https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99d.ttf') format('truetype');
            }

            /* GLOBAL FONT & COLOR SPECIFICATIONS - ALL PAGES */
            html, body {
                font-family: 'Noto Sans', 'NotoSans-Regular', system-ui, -apple-system, sans-serif !important;
                background-color: #ffffff !important;
                color: #707070 !important;
                font-size: 14px;
                font-weight: 400;
                line-height: 21px;
            }

            /* Body dan semua teks isi web */
            p, li, input, select, textarea, label, td, th {
                font-family: 'Noto Sans', 'NotoSans-Regular', sans-serif;
                font-size: 14px;
                font-weight: 400;
                line-height: 21px;
                color: #707070;
            }

            /* Navbar & SEMUA H1 */
            h1, .h1 {
                font-family: 'Play-Bold', 'Play', sans-serif !important;
                font-size: 18px !important;
                font-weight: 700 !important;
                line-height: 27px !important;
                color: #ffffff;
            }

            /* Navbar Top-Level Nav Links & Texts: Play-bold, 15px (18px on XL), Black by default */
            header nav .nav-link-item,
            header nav .nav-link-item span,
            header nav .nav-link-text,
            .nav-play {
                font-family: 'Play-Bold', 'Play', sans-serif !important;
                font-size: 15px !important;
                font-weight: 700 !important;
                line-height: 27px !important;
                color: #000000 !important;
            }

            @media (min-width: 1280px) {
                header nav .nav-link-item,
                header nav .nav-link-item span,
                header nav .nav-link-text,
                .nav-play {
                    font-size: 18px !important;
                }
            }

            /* Navbar Top-Level Nav Links: White on Hover and Active */
            header nav .nav-link-item:hover,
            header nav .nav-link-item:hover span,
            header nav .group:hover .nav-link-item,
            header nav .group:hover .nav-link-item span,
            header nav .group:hover .nav-link-text,
            header nav .nav-link-item.active,
            header nav .nav-link-item.active span {
                color: #ffffff !important;
            }

            /* Navbar Chevron Icon: Black before hover, White on hover/active */
            header nav .nav-link-item svg {
                color: #000000;
                stroke: #000000;
                transition: stroke 0.2s ease, color 0.2s ease;
            }
            header nav .nav-link-item:hover svg,
            header nav .group:hover .nav-link-item svg,
            header nav .nav-link-item.active svg {
                color: #ffffff !important;
                stroke: #ffffff !important;
            }

            /* Dropdown Sub-links stay readable as regular menu items */
            header nav .group .absolute a,
            header nav .group .absolute a span,
            header nav .dropdown a,
            header nav .dropdown a span {
                font-family: 'Noto Sans', 'NotoSans-Regular', sans-serif !important;
                font-size: 14px !important;
                font-weight: 400 !important;
                line-height: 21px !important;
                text-transform: none !important;
                color: #334155 !important;
            }
            header nav .group .absolute a:hover,
            header nav .group .absolute a:hover span {
                color: #0d47a1 !important;
            }

            /* All Heading levels use Play font family for cohesive corporate look */
            h2, h3, h4, h5, h6 {
                font-family: 'Play-Bold', 'Play', sans-serif !important;
            }

            /* SEMUA BUTTON - Font Family Play, 17px, line-height 26px */
            button, .btn, a.btn, input[type="submit"], input[type="button"] {
                font-family: 'Play', 'Play-Bold', sans-serif !important;
                font-size: 17px;
                font-weight: 400;
                line-height: 26px;
            }

            /* Action / CTA / Primary Buttons: white text */
            button:not([class*="text-slate"]):not([class*="text-gray"]):not([class*="text-neutral"]):not([class*="text-blue"]):not([class*="bg-transparent"]):not([class*="bg-slate-100"]):not([class*="bg-slate-200"]),
            .btn-primary,
            .btn-yamaha,
            a[class*="rounded-full"][class*="shadow"][class*="text-white"],
            a[class*="rounded-2xl"][class*="shadow"][class*="text-white"],
            a[class*="rounded-xl"][class*="shadow"][class*="text-white"],
            input[type="submit"] {
                color: #ffffff !important;
                font-size: 17px !important;
                font-weight: 400 !important;
                line-height: 26px !important;
            }

            /* Dark sections & Visi Misi: text and li must be white */
            .bg-slate-900 li,
            .bg-slate-950 li,
            .bg-slate-900 p,
            .bg-slate-950 p,
            li.text-white,
            p.text-white {
                color: #ffffff !important;
            }

            /* FOOTER - All text elements in footer MUST be pure white */
            footer,
            footer p,
            footer li,
            footer a,
            footer strong,
            footer div,
            footer span:not([class*="bg-red"]):not([class*="text-emerald"]) {
                color: #ffffff !important;
            }
            footer a:hover {
                color: #93c5fd !important;
            }
        </style>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-white text-[#707070]">
        @inertia
    </body>
</html>
