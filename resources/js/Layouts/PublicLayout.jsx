import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import FloatingWhatsApp from '@/Components/FloatingWhatsApp';

export default function PublicLayout({
    title = 'Dealer Resmi Yamaha | Aspacindo Kedaton Motor',
    description = 'PT. Aspacindo Kedaton Motor - Dealer Resmi Yamaha dengan 20+ cabang di Riau & Sumatera Utara. Jual motor baru Yamaha, sparepart original Yamalube, dan servis bergaransi.',
    canonical = null,
    image = '/images/logo-aspacindo.png',
    type = 'website',
    categoryBar = null,
    children
}) {
    const { props } = usePage();

    // Clean page title without redundant suffix duplication
    const defaultBrand = 'Aspacindo Kedaton Motor';
    const cleanTitle = title
        ? (title.includes(defaultBrand) ? title : `${title} | ${defaultBrand}`)
        : `Dealer Resmi Yamaha | ${defaultBrand}`;

    // Ensure site URL and Canonical URL always point to current site, never old domains
    const baseSiteUrl = props.siteUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://aspacindo.com');
    const canonicalLink = canonical || props.canonicalUrl || (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : baseSiteUrl);
    const metaImage = image.startsWith('http') ? image : `${baseSiteUrl}${image.startsWith('/') ? '' : '/'}${image}`;

    // Schema.org Structured Data optimized for Google Sitelinks & Local Business
    const schemaOrgData = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${baseSiteUrl}/#website`,
            'name': 'Aspacindo Kedaton Motor',
            'alternateName': [
                'Dealer Resmi Yamaha – Aspacindo Kedaton Motor',
                'Dealer Resmi Yamaha | Aspacindo Kedaton Motor',
                'PT. Aspacindo Kedaton Motor',
                'Yamaha Aspacindo'
            ],
            'url': baseSiteUrl,
            'potentialAction': {
                '@type': 'SearchAction',
                'target': `${baseSiteUrl}/produk?search={search_term_string}`,
                'query-input': 'required name=search_term_string'
            }
        },
        {
            '@context': 'https://schema.org',
            '@type': 'AutoDealer',
            '@id': `${baseSiteUrl}/#autodealer`,
            'name': 'PT. Aspacindo Kedaton Motor',
            'alternateName': 'Dealer Resmi Yamaha Aspacindo Kedaton Motor',
            'url': baseSiteUrl,
            'logo': `${baseSiteUrl}/images/logo-aspacindo.png`,
            'image': `${baseSiteUrl}/assets/images/promos/hero_banner_yamaha.webp`,
            'description': 'Dealer Resmi Yamaha terpercaya di Provinsi Riau dan Sumatera Utara dengan 20+ jaringan cabang. Melayani penjualan motor baru Yamaha (Sales), bengkel resmi servis berkala bersertifikasi (Service), dan suku cadang asli Yamalube (Sparepart).',
            'telephone': '+6281262241100',
            'priceRange': '$$',
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Jl. Riau Ujung No 88 A-E',
                'addressLocality': 'Pekanbaru',
                'addressRegion': 'Riau',
                'postalCode': '28292',
                'addressCountry': 'ID'
            },
            'geo': {
                '@type': 'GeoCoordinates',
                'latitude': 0.5404,
                'longitude': 101.4241
            },
            'areaServed': [
                { '@type': 'AdministrativeArea', 'name': 'Pekanbaru' },
                { '@type': 'AdministrativeArea', 'name': 'Pelalawan' },
                { '@type': 'AdministrativeArea', 'name': 'Kampar' },
                { '@type': 'AdministrativeArea', 'name': 'Siak' },
                { '@type': 'AdministrativeArea', 'name': 'Indragiri Hulu' },
                { '@type': 'AdministrativeArea', 'name': 'Indragiri Hilir' },
                { '@type': 'AdministrativeArea', 'name': 'Medan' },
                { '@type': 'AdministrativeArea', 'name': 'Riau' },
                { '@type': 'AdministrativeArea', 'name': 'Sumatera Utara' }
            ],
            'openingHoursSpecification': [
                {
                    '@type': 'OpeningHoursSpecification',
                    'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    'opens': '08:00',
                    'closes': '17:00'
                }
            ]
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'name': 'Navigasi Utama Aspacindo Kedaton Motor',
            'itemListElement': [
                {
                    '@type': 'SiteNavigationElement',
                    'position': 1,
                    'name': 'PT. Aspacindo Kedaton Motor',
                    'description': 'Profil lengkap perusahaan dan sejarah dealer resmi Yamaha PT. Aspacindo Kedaton Motor.',
                    'url': `${baseSiteUrl}/tentang-kami`
                },
                {
                    '@type': 'SiteNavigationElement',
                    'position': 2,
                    'name': 'Lokasi Dealer Yamaha',
                    'description': 'Daftar alamat 20+ cabang resmi dealer dan bengkel Yamaha di Riau & Sumatera Utara.',
                    'url': `${baseSiteUrl}/lokasi-dealer`
                },
                {
                    '@type': 'SiteNavigationElement',
                    'position': 3,
                    'name': 'Cabang',
                    'description': 'Jaringan cabang resmi Yamaha di Pekanbaru, Kampar, Siak, Pelalawan, Inhu, Inhil & Medan.',
                    'url': `${baseSiteUrl}/lokasi-dealer`
                },
                {
                    '@type': 'SiteNavigationElement',
                    'position': 4,
                    'name': 'Motor',
                    'description': 'Katalog lengkap sepeda motor baru Yamaha MAXi, Classy, Matic, Sport, Off-Road, dan Moped.',
                    'url': `${baseSiteUrl}/produk`
                },
                {
                    '@type': 'SiteNavigationElement',
                    'position': 5,
                    'name': 'Layanan & Bengkel Resmi',
                    'description': 'Booking service online, Service Kunjung Yamaha (SKY), Fast Pit, dan suku cadang asli Yamalube.',
                    'url': `${baseSiteUrl}/layanan`
                },
                {
                    '@type': 'SiteNavigationElement',
                    'position': 6,
                    'name': 'Artikel & Info Promo',
                    'description': 'Update berita terbaru, tips perawatan motor, serta event dan promo motor Yamaha.',
                    'url': `${baseSiteUrl}/artikel`
                },
                {
                    '@type': 'SiteNavigationElement',
                    'position': 7,
                    'name': 'Simulasi Cicilan',
                    'description': 'Kalkulator simulasi kredit dan tabel cicilan DP ringan motor Yamaha.',
                    'url': `${baseSiteUrl}/simulasi-cicilan`
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
            <Head>
                {/* Meta Title */}
                <title>{cleanTitle}</title>

                {/* Standard Search Engine Directives */}
                <meta name="description" content={description} />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

                {/* Canonical URL - strictly points to new website */}
                <link rel="canonical" href={canonicalLink} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content={type} />
                <meta property="og:site_name" content="Aspacindo Kedaton Motor" />
                <meta property="og:title" content={cleanTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonicalLink} />
                <meta property="og:image" content={metaImage} />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={cleanTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={metaImage} />

                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaOrgData)}
                </script>
            </Head>

            <Navbar categoryBar={categoryBar} />

            <main className="flex-grow">
                {children}
            </main>

            <FloatingWhatsApp />

            <Footer />
        </div>
    );
}
