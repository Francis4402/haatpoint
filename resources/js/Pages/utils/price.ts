// Central place for the platform's product-price increase.
//
// Agents enter their own price when uploading a product. The platform then
// adds a fixed percentage on top and shows that increased amount to everyone
// (customers and agents). The extra amount is the platform's cut, so it is
// baked into the price instead of being shown as a separate tax/cut line.
export const PRICE_MARKUP = 1.1;

/**
 * Returns the customer-facing price: the agent's price plus the platform
 * markup, rounded to a whole number so customers never see decimals.
 * Always safe to call with numbers, numeric strings or null/undefined.
 */
export function withMarkup(price: number | string | null | undefined): number {
    if (price === null || price === undefined || price === '') return 0;

    const value = typeof price === 'string' ? parseFloat(price) : price;
    if (!Number.isFinite(value)) return 0;

    return Math.round(value * PRICE_MARKUP);
}

/** The amount added on top of the agent's base price. */
export function markupAmount(price: number | string | null | undefined): number {
    const value = typeof price === 'string' ? parseFloat(price) : Number(price);
    if (!Number.isFinite(value)) return 0;

    return Math.round((withMarkup(value) - value) * 100) / 100;
}
