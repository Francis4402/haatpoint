/**
 * Universal product image resolver.
 * Handles:
 *  - JSON arrays: '["https://...", "https://..."]'
 *  - JSON string: '"https://..."'
 *  - Direct external URLs: 'https://shopbasebd.com/...' or 'http://...'
 *  - Root relative paths: '/images/...'
 *  - Storage paths: 'product_images/xxx.jpg' or 'storage/xxx.jpg'
 */
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

    // 2. Direct absolute URLs
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('//')) {
        return target;
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
