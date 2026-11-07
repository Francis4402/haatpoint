/**
 * Format store type cleanly avoiding redundant "Store" suffixes.
 * E.g.:
 * - 'Retail Store' -> 'Retail Store' (NOT 'Retail Store Store')
 * - 'Wholesale' -> 'Wholesale Store'
 * - 'Service Provider' -> 'Service Provider'
 * - 'E-commerce' -> 'E-commerce Store'
 */
export function formatStoreType(type?: string | null): string {
    if (!type || !type.trim()) return 'General Store';
    const clean = type.trim();
    if (/store/i.test(clean)) return clean;
    if (/service/i.test(clean) || /provider/i.test(clean)) return clean;
    return `${clean} Store`;
}

export function isServiceProvider(type?: string | null): boolean {
    if (!type) return false;
    return /service/i.test(type) || /provider/i.test(type);
}

export function isWholesale(type?: string | null): boolean {
    if (!type) return false;
    return /wholesale/i.test(type);
}

/**
 * Convert a store name (or store object) into a clean URL-friendly dashed slug.
 * Spaces/gaps are replaced with dashes (-), ampersands (&) are replaced with 'and',
 * while preserving the casing of the store name.
 * E.g.:
 * - "Adnan Lifestyle" -> "Adnan-Lifestyle"
 * - "Rahman & Sons"   -> "Rahman-and-Sons"
 * - "H&M"             -> "H-and-M"
 */
export function storeSlug(store?: string | { name?: string | null; id?: string | null } | null, fallback?: string | null): string {
    if (!store) return fallback || '';
    const raw = typeof store === 'string' ? store : (store.name || store.id || fallback || '');
    if (!raw) return '';
    const cleaned = raw
        .trim()
        .replace(/&/g, ' and ')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return encodeURIComponent(cleaned);
}
