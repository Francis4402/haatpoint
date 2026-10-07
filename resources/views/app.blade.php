<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Per-page head values are computed server-side by App\Http\Middleware\SeoMeta.
             Hardcoding one canonical here told crawlers that every page on the site duplicated
             the home page, which is why nothing else could rank. --}}
        <title>{{ $seo['title'] ?? 'HaatPoint' }}</title>

        <meta name="description" content="{{ $seo['description'] ?? 'Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.' }}">
        <meta name="keywords" content="online shopping Bangladesh, multivendor marketplace, buy online, electronics, fashion, home goods, HaatPoint">
        <meta name="robots" content="{{ $seo['robots'] ?? 'index, follow' }}">
        <meta http-equiv="Content-Language" content="en">

        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="manifest" href="/build/manifest.json">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        {{-- Canonical URL. Omitted when SeoMeta deliberately left it empty (error
             responses have nothing to consolidate into) — an empty or home-page
             canonical on a 404 tells Google the broken URL is the homepage. --}}
        @if(!empty($seo['canonical']))
            <link rel="canonical" href="{{ $seo['canonical'] }}">
        @endif

        {{-- Open Graph Meta Tags --}}
        <meta property="og:title" content="{{ $seo['ogTitle'] ?? 'HaatPoint - Bangladesh\'s Premier Marketplace' }}">
        <meta property="og:description" content="{{ $seo['ogDescription'] ?? 'Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.' }}">
        <meta property="og:type" content="{{ $seo['ogType'] ?? 'website' }}">
        @if(!empty($seo['ogUrl']))
            <meta property="og:url" content="{{ $seo['ogUrl'] }}">
        @endif
        <meta property="og:site_name" content="HaatPoint">
        <meta property="og:image" content="{{ $seo['ogImage'] ?? 'https://www.haatpoint.com/og-image.png' }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:locale" content="en_US">

        {{-- Twitter Card Meta Tags --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seo['ogTitle'] ?? 'HaatPoint - Bangladesh\'s Premier Marketplace' }}">
        <meta name="twitter:description" content="{{ $seo['ogDescription'] ?? 'Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.' }}">
        <meta name="twitter:image" content="https://www.haatpoint.com/summary_large_image.jpg">

        {{-- Additional Meta Tags --}}
        <meta name="author" content="HaatPoint Team">
        <meta name="copyright" content="HaatPoint {{ date('Y') }}">
        <meta name="revisit-after" content="7 days">
        <meta name="rating" content="general">
        <meta name="distribution" content="global">

        <!-- Google Translate CSS to hide banner and styling overrides -->
        <style>
            .goog-te-banner-frame.skiptranslate,
            .goog-te-banner-frame,
            .goog-te-banner {
                display: none !important;
            }
            body {
                top: 0px !important;
            }
            #google_translate_element {
                display: none !important;
            }
            .goog-tooltip,
            .goog-tooltip:hover {
                display: none !important;
            }
            .goog-text-highlight {
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
            }
            .skiptranslate:not(.notranslate) {
                display: none !important;
            }
            body > .skiptranslate {
                display: none !important;
            }
        </style>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <!-- Google Translate Element -->
        <div id="google_translate_element" style="display:none;"></div>
        <script type="text/javascript">
            function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,bn',
                    autoDisplay: false
                }, 'google_translate_element');
            }
        </script>
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
    </body>
</html>
