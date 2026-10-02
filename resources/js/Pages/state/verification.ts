import { usePage } from '@inertiajs/react';

/**
 * Whether the signed-in account still has to confirm its address.
 *
 * Reads the shared `requiresVerification` prop rather than the user record,
 * because staff have no verification step. `null` means signed out, which is
 * allowed to shop: a guest browsing and filling a cart is not the problem this
 * gate exists to solve.
 */
export function useVerificationGate(): { requiresVerification: boolean; isGuest: boolean } {
    const { auth } = usePage().props as unknown as {
        auth?: { user?: { id?: string | number } | null; requiresVerification?: boolean };
    };

    const isGuest = !auth?.user;

    return {
        requiresVerification: !isGuest && auth?.requiresVerification === true,
        isGuest,
    };
}

/**
 * Copy shown when an unverified account tries to add to the cart. Kept in one
 * place because the same refusal appears on the product grid and the product
 * detail page, and the two drifting apart is how a user ends up getting a
 * different answer depending on where they clicked.
 */
export const UNVERIFIED_CART_MESSAGE =
    'You are not verified. Please verify your email address before adding products to the cart.';
