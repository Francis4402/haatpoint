import { useState } from 'react'
import { CartItem, Product } from '@/types'
import { FaShoppingCart } from 'react-icons/fa'
import { toast } from 'sonner'
import { useStore } from '../state/cartStore'
import { useTranslation } from '@/state/languageStore'
import { parseVariantList } from '@/Pages/utils/parseVariants'

interface AddtoCartButtonProps {
    product: CartItem | Product,
    className?: string;
    variant?: 'default' | 'icon' | 'full';
    size?: 'sm' | 'md' | 'lg';
    /** Controlled variant values (used by the product detail page). */
    selectedSize?: string;
    selectedColor?: string;
    /** Render the inline size/color picker. Disable when the parent renders its own. */
    showVariantPicker?: boolean;
}

const AddtoCartButton = ({
    product,
    className = '',
    variant = 'full',
    size = 'md',
    selectedSize,
    selectedColor,
    showVariantPicker = true,
}: AddtoCartButtonProps) => {
    const addtoCart = useStore((state) => state.addToCart)
    const { t } = useTranslation()

    const availableSizes = parseVariantList(product.size)
    const availableColors = parseVariantList(product.color)
    const hasVariants = availableSizes.length > 0 || availableColors.length > 0

    const [internalSize, setInternalSize] = useState('')
    const [internalColor, setInternalColor] = useState('')

    const chosenSize = selectedSize !== undefined ? selectedSize : internalSize
    const chosenColor = selectedColor !== undefined ? selectedColor : internalColor

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();

        const resolvedStore = product.store;

        if (!resolvedStore || !resolvedStore.id) {
            toast.error(t('store_info_unavailable', 'Store information unavailable'));
            return;
        }

        if (availableSizes.length > 0 && !chosenSize) {
            toast.error(t('select_size', 'Please select a size'));
            return;
        }

        if (availableColors.length > 0 && !chosenColor) {
            toast.error(t('select_color', 'Please select a color'));
            return;
        }

        addtoCart(product, resolvedStore, 1, chosenSize, chosenColor);
    };

    // Size configurations
    const sizeClasses = {
        sm: 'px-2.5 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2 text-xs gap-2',
        lg: 'px-5 py-2.5 text-sm gap-2.5'
    };

    // Variant configurations
    const variantClasses = {
        default: `w-full flex items-center justify-center rounded-lg font-medium transition-all duration-300 flex-shrink-0 ${
            product.inStock && product.quantity > 0
                ? 'bg-gray-900 hover:bg-marigold text-white hover:shadow-lg hover:scale-105 border border-transparent hover:border-marigold'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
        }`,
        icon: `flex items-center justify-center rounded-full transition-all duration-300 flex-shrink-0 ${
            product.inStock && product.quantity > 0
                ? 'bg-white/90 hover:bg-white text-gray-600 hover:text-marigold shadow-lg hover:shadow-xl hover:scale-110 border border-gray-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
        }`,
        full: `w-full flex items-center justify-center rounded-lg font-medium transition-all duration-300 flex-shrink-0 ${
            product.inStock && product.quantity > 0
                ? 'bg-marigold hover:bg-marigold-dark text-white hover:shadow-lg hover:scale-105 border border-transparent'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
        }`
    };

    // Size for icon variant
    const iconSizeClasses = {
        sm: 'w-7 h-7',
        md: 'w-8 h-8',
        lg: 'w-9 h-9'
    };

    const buttonText = product.inStock && product.quantity > 0
        ? t('add_to_cart', 'Add to Cart')
        : t('out_of_stock', 'Out of Stock');

    const renderPicker = () => {
        if (!showVariantPicker || !hasVariants || variant === 'icon') return null;

        return (
            <div
                className="w-full rounded-lg bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg p-2.5 space-y-2 mb-1.5"
                onClick={(e) => e.stopPropagation()}
            >
                {availableColors.length > 0 && (
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                            {t('color', 'Color')}
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {availableColors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setInternalColor(color)}
                                    className={`px-2 py-0.5 rounded-full border text-[11px] font-medium transition-colors capitalize ${
                                        chosenColor === color
                                            ? 'bg-marigold text-white border-marigold'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-marigold'
                                    }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {availableSizes.length > 0 && (
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">
                            {t('size', 'Size')}
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {availableSizes.map((optionSize) => (
                                <button
                                    key={optionSize}
                                    type="button"
                                    onClick={() => setInternalSize(optionSize)}
                                    className={`min-w-[28px] px-2 py-0.5 rounded-md border text-[11px] font-semibold uppercase transition-colors ${
                                        chosenSize === optionSize
                                            ? 'bg-marigold text-white border-marigold'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-marigold'
                                    }`}
                                >
                                    {optionSize}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleAddToCart}
                className={`${variantClasses.icon} ${iconSizeClasses[size]} ${className}`}
                disabled={!product.inStock || product.quantity <= 0}
                aria-label={t('add_to_cart', 'Add to cart')}
                title={buttonText}
            >
                <FaShoppingCart className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
            </button>
        );
    }

    return (
        <div className={`w-full ${className}`}>
            {renderPicker()}
            <button
                onClick={handleAddToCart}
                className={`${variantClasses[variant === 'full' ? 'full' : 'default']} ${sizeClasses[size]}`}
                disabled={!product.inStock || product.quantity <= 0}
            >
                <FaShoppingCart className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                {buttonText}
            </button>
        </div>
    );
}

export default AddtoCartButton;
