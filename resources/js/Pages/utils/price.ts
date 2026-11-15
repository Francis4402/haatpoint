// Central place for platform product price formatting.
//
// Products in the database are stored with their final market-optimized retail selling price
// (giving Superadmin the highest profit margin in the Bangladesh market).
export const PRICE_MARKUP = 1.0;

/**
 * Returns the customer-facing price rounded to a whole number (no decimals).
 * Always safe to call with numbers, numeric strings or null/undefined.
 */
export function withMarkup(price: number | string | null | undefined): number {
    if (price === null || price === undefined || price === '') return 0;

    const value = typeof price === 'string' ? parseFloat(price) : price;
    if (!Number.isFinite(value)) return 0;

    return Math.round(value * PRICE_MARKUP);
}

/** The amount added on top of the base price (0 when stored at retail). */
export function markupAmount(price: number | string | null | undefined): number {
    const value = typeof price === 'string' ? parseFloat(price) : Number(price);
    if (!Number.isFinite(value)) return 0;

    return Math.round((withMarkup(value) - value) * 100) / 100;
}
