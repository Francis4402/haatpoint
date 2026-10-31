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
