/**
 * Universal product image resolver.
 * Handles:
 *  - JSON arrays: '["https://...", "https://..."]'
 *  - JSON string: '"https://..."'
 *  - Direct external CDN URLs: 'https://...'
 *  - Root relative paths: '/images/...'
 *  - Storage paths: 'product_images/xxx.jpg' or 'storage/xxx.jpg'
 */
export function toHighResCatalogImage(url: string | null | undefined): string {
    if (!url || typeof url !== 'string') return url || '';
    if (/_S_(\d+)\.jpg/i.test(url)) {
        return url.replace(/_S_(\d+)\.jpg$/i, '_L_$1.jpeg');
    }
    return url;
}

export const toHighResShopBase = toHighResCatalogImage;

export function handleProductImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string = '/placeholder.png') {
    const target = e.currentTarget;
    const current = target.src || '';

    // Step 1: If _L_...jpeg failed, try _L_...jpg
    if (current.includes('_L_') && (current.endsWith('.jpeg') || current.includes('.jpeg?'))) {
        target.src = current.replace(/\.jpeg(\?.*)?$/i, '.jpg');
        return;
    }

    // Step 2: If _L_...jpg failed (or direct _L_ failed), try original _S_ thumbnail
    if (current.includes('_L_')) {
        target.src = current.replace(/_L_(\d+)\.(jpeg|jpg)(\?.*)?$/i, '_S_$1.jpg');
        return;
    }

    // Step 3: Prevent infinite loop if already at placeholder
    if (!current.includes('placeholder')) {
        target.src = fallback;
    }
}

export function resolveProductImage(images: string | null | undefined, fallback: string = '/placeholder.png'): string {
    if (!images) return fallback;

    let target = '';

    // 1. Try parsing JSON
    try {
        const clean = images.startsWith('"') && images.endsWith('"') && !images.startsWith('"[')
            ? images.slice(1, -1)
            : images;
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed) && parsed.length > 0) {
            target = String(parsed[0]).trim();
        } else if (typeof parsed === 'string' && parsed) {
            target = parsed.trim();
        }
    } catch {
        const matches = images.match(/"([^"]+)"/);
        if (matches && matches[1]) {
            target = matches[1].trim();
        } else {
            target = images.trim();
        }
    }

    target = target.replace(/^["']+|["']+$/g, '').trim();

    if (!target || target === 'null' || target === 'undefined' || target === '[]' || target === '""') {
        return fallback;
    }

    // 2. Direct absolute URLs (Auto-upgrade catalog thumbnails to high-res photos)
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('//')) {
        return toHighResCatalogImage(target);
    }

    // 3. Absolute root path
    if (target.startsWith('/')) {
        return target;
    }

    // 4. Storage paths
    if (target.startsWith('storage/')) {
        return `/${target}`;
    }

    return `/storage/${target}`;
}
