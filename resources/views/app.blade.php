<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'HaatPoint') }}</title>

        <meta name="description" content="Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.">
        <meta name="keywords" content="online shopping Bangladesh, multivendor marketplace, buy online, electronics, fashion, home goods, HaatPoint">
        <meta name="robots" content="index, follow">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
        <meta http-equiv="Content-Language" content="en">

        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="manifest" href="/build/manifest.json">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        {{-- Canonical URL --}}
        <link rel="canonical" href="https://www.haatpoint.com/">

        {{-- Open Graph Meta Tags --}}
        <meta property="og:title" content="HaatPoint - Bangladesh's Premier Marketplace">
        <meta property="og:description" content="Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://www.haatpoint.com/">
        <meta property="og:site_name" content="HaatPoint">
        <meta property="og:image" content="/og-image.png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:locale" content="en_US">

        {{-- Twitter Card Meta Tags --}}
        <meta name="twitter:card" content="/summary_large_image.jpg">
        <meta name="twitter:title" content="HaatPoint - Bangladesh's Premier Marketplace">
        <meta name="twitter:description" content="Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.">
        <meta name="twitter:image" content="/summary_large_image.jpg">

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
