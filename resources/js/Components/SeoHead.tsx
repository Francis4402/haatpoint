import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

const SITE_URL = 'https://www.haatpoint.com';
const SITE_NAME = 'HaatPoint';
const DEFAULT_DESCRIPTION =
    'Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_TWITTER_IMAGE = `${SITE_URL}/summary_large_image.jpg`;

interface JsonLd {
    '@context'?: string;
    '@type'?: string;
    [key: string]: unknown;
}

/**
 * The values App\Http\Middleware\SeoMeta already printed into the HTML shell.
 *
 * They are the defaults for every tag below rather than the other way round:
 * the Blade shell and this component used to emit the same four tags from two
 * different sources, so Google's rendered result disagreed with what a crawler
 * saw before JS ran — and SeoHead's own defaults canonicalised every page at
 * the homepage.
 */
interface SeoData {
    title?: string;
    description?: string;
    canonical?: string;
    robots?: string;
    ogType?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
}

interface SeoHeadProps {
    /** Overrides only — normally the server-computed title is used. */
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
    robots?: string;
    ogType?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    ogUrl?: string;
    jsonLd?: JsonLd | JsonLd[];
    children?: ReactNode;
}

export default function SeoHead({
    title,
    description,
    keywords,
    canonical,
    robots,
    ogType,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    ogUrl,
    jsonLd,
    children,
}: SeoHeadProps) {
    const { seo } = usePage().props as { seo?: SeoData };

    const finalTitle = title ?? seo?.title ?? SITE_NAME;
    const finalDescription = description ?? seo?.description ?? DEFAULT_DESCRIPTION;
    const finalRobots = robots ?? seo?.robots ?? 'index, follow';
    const finalCanonical = canonical ?? seo?.canonical ?? '';
    const finalOgType = ogType ?? seo?.ogType ?? 'website';
    const finalOgImage = ogImage ?? seo?.ogImage ?? DEFAULT_OG_IMAGE;
    const resolvedOgUrl = ogUrl ?? seo?.ogUrl ?? finalCanonical;
    const finalOgTitle = ogTitle ?? seo?.ogTitle ?? finalTitle;
    const finalOgDescription = ogDescription ?? seo?.ogDescription ?? finalDescription;
    const finalTwitterTitle = twitterTitle ?? finalOgTitle;
    const finalTwitterDescription = twitterDescription ?? finalOgDescription;

    const resolveImage = (image: string) =>
        image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;

    const resolvedOgImage = resolveImage(finalOgImage);
    const resolvedTwitterImage = twitterImage ? resolveImage(twitterImage) : DEFAULT_TWITTER_IMAGE;

    const renderJsonLd = (data: JsonLd | JsonLd[] | undefined) => {
        if (!data) return null;
        const list = Array.isArray(data) ? data : [data];
        return list.map((schema, index) => (
            <script
                key={index}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        ));
    };

    return (
        <Head>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            {keywords ? <meta name="keywords" content={keywords} /> : null}
            <meta name="robots" content={finalRobots} />
            {/* Empty on error responses: a 404 must not claim a canonical. */}
            {finalCanonical ? <link rel="canonical" href={finalCanonical} /> : null}

            <meta property="og:type" content={finalOgType} />
            <meta property="og:title" content={finalOgTitle} />
            <meta property="og:description" content={finalOgDescription} />
            {resolvedOgUrl ? <meta property="og:url" content={resolvedOgUrl} /> : null}
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:image" content={resolvedOgImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="en_US" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTwitterTitle} />
            <meta name="twitter:description" content={finalTwitterDescription} />
            <meta name="twitter:image" content={resolvedTwitterImage} />

            {renderJsonLd(jsonLd)}
            {children}
        </Head>
    );
}
