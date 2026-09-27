import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

const SITE_URL = 'https://www.haatpoint.com';
const SITE_NAME = 'HaatPoint';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_TWITTER_IMAGE = `${SITE_URL}/summary_large_image.jpg`;

interface JsonLd {
    '@context'?: string;
    '@type'?: string;
    [key: string]: unknown;
}

interface SeoHeadProps {
    title: string;
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
    description = 'Shop thousands of products from trusted vendors across Bangladesh. Find electronics, fashion, home goods & more at HaatPoint.',
    keywords,
    canonical = SITE_URL,
    robots = 'index, follow',
    ogType = 'website',
    ogTitle,
    ogDescription,
    ogImage = DEFAULT_OG_IMAGE,
    twitterTitle,
    twitterDescription,
    twitterImage,
    ogUrl,
    jsonLd,
    children,
}: SeoHeadProps) {
    const resolveImage = (image: string) =>
        image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;

    const resolvedOgImage = resolveImage(ogImage);
    const resolvedTwitterImage = twitterImage ? resolveImage(twitterImage) : DEFAULT_TWITTER_IMAGE;
    const resolvedOgUrl = ogUrl || canonical;
    const finalOgTitle = ogTitle || title;
    const finalOgDescription = ogDescription || description;
    const finalTwitterTitle = twitterTitle || finalOgTitle;
    const finalTwitterDescription = twitterDescription || finalOgDescription;

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
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords ? <meta name="keywords" content={keywords} /> : null}
            <meta name="robots" content={robots} />
            <link rel="canonical" href={canonical} />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="manifest" href="/site.webmanifest" />

            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={finalOgTitle} />
            <meta property="og:description" content={finalOgDescription} />
            <meta property="og:url" content={resolvedOgUrl} />
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
