import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  FaTimes,
  FaShoppingCart,
  FaShoppingBag,
  FaCheck,
  FaPlus,
  FaMinus,
  FaStore,
  FaExternalLinkAlt,
  FaLayerGroup,
} from 'react-icons/fa';
import { Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { CartItem, Product, storeType } from '@/types';
import { parseVariantList } from '@/Pages/utils/parseVariants';
import { useStore } from '@/Pages/state/cartStore';
import FormatPrice from '@/Pages/utils/FormatePrice';
import { withMarkup } from '@/Pages/utils/price';

interface SelectOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | CartItem;
  store?: storeType;
}

interface ItemVariantConfig {
  size: string;
  color: string;
}

function resolveProductImage(images: string | null | undefined): string {
  if (!images) return '';
  try {
    const clean = images.startsWith('"') && images.endsWith('"') ? images.slice(1, -1) : images;
    const parsed = JSON.parse(clean);
    const first = Array.isArray(parsed) ? parsed[0] : parsed;
    if (typeof first === 'string' && first.length > 0) {
      return first.startsWith('http') || first.startsWith('/') ? first : `/storage/${first}`;
    }
  } catch {
    // not JSON
  }
  const trimmed = images.trim();
  if (trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed;
  return `/storage/${trimmed}`;
}

const SelectOptionsDialog: React.FC<SelectOptionsDialogProps> = ({
  isOpen,
  onClose,
  product,
  store,
}) => {
  const { addToCart } = useStore();

  const availableSizes = parseVariantList(product.size);
  const availableColors = parseVariantList(product.color);
  const hasSizes = availableSizes.length > 0;
  const hasColors = availableColors.length > 0;

  const resolvedStore = store || product.store;
  const maxStock = product.quantity || 0;

  const [quantity, setQuantity] = useState<number>(1);
  const [useSeparateVariants, setUseSeparateVariants] = useState<boolean>(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  // Array of variant selections for each individual item (up to quantity)
  const [itemConfigs, setItemConfigs] = useState<ItemVariantConfig[]>([
    {
      size: availableSizes.length === 1 ? availableSizes[0] : '',
      color: availableColors.length === 1 ? availableColors[0] : '',
    },
  ]);

  // Reset or adjust configs when dialog opens or available variants change
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setUseSeparateVariants(false);
      setActiveItemIndex(0);
      setItemConfigs([
        {
          size: availableSizes.length === 1 ? availableSizes[0] : '',
          color: availableColors.length === 1 ? availableColors[0] : '',
        },
      ]);
    }
  }, [isOpen]);

  // Adjust itemConfigs array length when quantity changes
  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1 || (maxStock > 0 && newQty > maxStock)) return;

    setQuantity(newQty);
    setItemConfigs((prev) => {
      const next = [...prev];
      if (newQty > prev.length) {
        // Expand using previous first item's choices as defaults
        const defaultChoice = prev[0] || {
          size: availableSizes.length === 1 ? availableSizes[0] : '',
          color: availableColors.length === 1 ? availableColors[0] : '',
        };
        while (next.length < newQty) {
          next.push({ ...defaultChoice });
        }
      } else {
        // Truncate
        next.splice(newQty);
      }
      return next;
    });

    if (activeItemIndex >= newQty) {
      setActiveItemIndex(newQty - 1);
    }
  };

  const handleUpdateItemVariant = (
    index: number,
    field: 'size' | 'color',
    value: string
  ) => {
    setItemConfigs((prev) => {
      const next = [...prev];
      if (!useSeparateVariants) {
        // If not using separate variants, applying to one applies to ALL
        return next.map((item) => ({
          ...item,
          [field]: value,
        }));
      }
      if (next[index]) {
        next[index] = {
          ...next[index],
          [field]: value,
        };
      }
      return next;
    });
  };

  const copyFirstItemToAll = () => {
    if (itemConfigs.length === 0) return;
    const first = itemConfigs[0];
    setItemConfigs((prev) => prev.map(() => ({ ...first })));
    toast.success('Applied options to all items');
  };

  // Prices
  const unitPrice = withMarkup(product.sale_price ?? product.regular_price ?? 0);
  const regularUnitPrice = withMarkup(product.regular_price ?? 0);
  const hasDiscount = product.sale_price && product.sale_price < product.regular_price;
  const totalPrice = unitPrice * quantity;

  // Validation
  const validateSelections = (): boolean => {
    if (!product.inStock || maxStock === 0) {
      toast.error('Product is out of stock');
      return false;
    }

    if (!resolvedStore || !resolvedStore.id) {
      toast.error('Store information unavailable');
      return false;
    }

    for (let i = 0; i < quantity; i++) {
      const config = itemConfigs[i];
      if (hasSizes && (!config || !config.size)) {
        toast.error(
          quantity > 1
            ? `Please select a size for Item #${i + 1}`
            : 'Please select a size'
        );
        setActiveItemIndex(i);
        return false;
      }
      if (hasColors && (!config || !config.color)) {
        toast.error(
          quantity > 1
            ? `Please select a color for Item #${i + 1}`
            : 'Please select a color'
        );
        setActiveItemIndex(i);
        return false;
      }
    }

    return true;
  };

  const handleAddAndProceed = (andCheckout: boolean = false) => {
    if (!validateSelections()) return;

    if (!resolvedStore) return;

    // Group matching items by (size + color) so cart doesn't have duplicate identical lines
    const grouped: Record<string, { size: string; color: string; count: number }> = {};

    for (let i = 0; i < quantity; i++) {
      const item = itemConfigs[i];
      const key = `${item?.size || ''}__${item?.color || ''}`;
      if (!grouped[key]) {
        grouped[key] = {
          size: item?.size || '',
          color: item?.color || '',
          count: 0,
        };
      }
      grouped[key].count += 1;
    }

    Object.values(grouped).forEach((group) => {
      addToCart(product, resolvedStore, group.count, group.size, group.color);
    });

    onClose();

    if (andCheckout) {
      router.visit(route('cart.index'));
    }
  };

  const imageSrc = resolveProductImage(product.images);
  const productUrl = `/products/${product.slug || product.id}`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-t-3xl sm:rounded-2xl bg-white text-left align-bottom sm:align-middle shadow-2xl border border-line transition-all flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-line flex items-start justify-between gap-3 bg-paper-dim/40 sticky top-0 z-10 backdrop-blur">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-line flex-shrink-0 bg-white"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-paper-dim border border-line flex items-center justify-center flex-shrink-0">
                        <FaStore className="w-6 h-6 text-text-soft" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-sm sm:text-base text-ink line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-display font-extrabold text-base sm:text-lg text-ink">
                          <FormatPrice price={unitPrice} />
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-text-soft line-through">
                            <FormatPrice price={regularUnitPrice} />
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {product.inStock && maxStock > 0 ? `${maxStock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      {resolvedStore?.name && (
                        <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1 truncate">
                          <FaStore className="w-3 h-3 text-marigold" />
                          <span>{resolvedStore.name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-paper-dim text-text-soft hover:text-ink transition-colors flex-shrink-0"
                    aria-label="Close dialog"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content (scrollable) */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-left flex-1">
                  {/* Quantity Selector */}
                  <div className="bg-paper-dim/60 p-3.5 rounded-xl border border-line flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-ink block">Quantity</span>
                      <span className="text-xs text-text-soft">
                        {quantity > 1 ? `${quantity} items selected` : 'Select quantity to order'}
                      </span>
                    </div>

                    <div className="flex items-center border border-line rounded-xl overflow-hidden bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="px-3.5 py-2 text-text-soft hover:text-ink hover:bg-paper-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-r border-line"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-2 font-bold text-sm min-w-[42px] text-center text-ink select-none">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= maxStock}
                        className="px-3.5 py-2 text-text-soft hover:text-ink hover:bg-paper-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-l border-line"
                        aria-label="Increase quantity"
                      >
                        <FaPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Multi-Item Variant Mode Toggle (When quantity >= 2) */}
                  {quantity >= 2 && (hasSizes || hasColors) && (
                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FaLayerGroup className="w-4 h-4 text-marigold flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-semibold text-ink">
                            Multiple sizes or colors?
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUseSeparateVariants(!useSeparateVariants)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${
                            useSeparateVariants
                              ? 'bg-ink text-white border-ink shadow-sm'
                              : 'bg-white text-ink border-line hover:border-marigold'
                          }`}
                        >
                          {useSeparateVariants ? 'Separate per item: ON' : 'Customize each item'}
                        </button>
                      </div>

                      {useSeparateVariants && (
                        <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between flex-wrap gap-2">
                          <p className="text-[11px] text-text-soft">
                            Configure individual size and color for each of your {quantity} items below.
                          </p>
                          <button
                            type="button"
                            onClick={copyFirstItemToAll}
                            className="text-[11px] font-semibold text-marigold hover:underline"
                          >
                            Copy Item #1 to all
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Multi-item Tabs (When quantity >= 2 and useSeparateVariants is true) */}
                  {quantity >= 2 && useSeparateVariants && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {Array.from({ length: quantity }).map((_, i) => {
                        const cfg = itemConfigs[i];
                        const isComplete =
                          (!hasSizes || !!cfg?.size) && (!hasColors || !!cfg?.color);
                        const isActive = activeItemIndex === i;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveItemIndex(i)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                              isActive
                                ? 'bg-ink text-white border-ink shadow-sm scale-102'
                                : isComplete
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-paper-dim text-text-soft border-line hover:border-ink hover:text-ink'
                            }`}
                          >
                            <span>Item #{i + 1}</span>
                            {isComplete ? (
                              <FaCheck className="w-2.5 h-2.5 text-emerald-500" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Active Variant Configuration Form */}
                  {(() => {
                    const currentConfig =
                      quantity >= 2 && useSeparateVariants
                        ? itemConfigs[activeItemIndex] || { size: '', color: '' }
                        : itemConfigs[0] || { size: '', color: '' };

                    const targetIndex = quantity >= 2 && useSeparateVariants ? activeItemIndex : 0;

                    return (
                      <div className="space-y-4">
                        {quantity >= 2 && useSeparateVariants && (
                          <div className="flex items-center justify-between pb-1 border-b border-line">
                            <span className="text-xs font-mono uppercase tracking-wider text-marigold font-bold">
                              Configuring Item #{targetIndex + 1} of {quantity}
                            </span>
                            <span className="text-xs text-text-soft">
                              {currentConfig.size ? `Size: ${currentConfig.size}` : 'No size'}
                              {' • '}
                              {currentConfig.color ? `Color: ${currentConfig.color}` : 'No color'}
                            </span>
                          </div>
                        )}

                        {/* Colors */}
                        {hasColors && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono uppercase tracking-wider text-text-soft font-semibold">
                                Color
                              </span>
                              {currentConfig.color && (
                                <span className="text-xs font-bold text-ink uppercase">
                                  {currentConfig.color}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {availableColors.map((col) => {
                                const isSelected = currentConfig.color === col;
                                return (
                                  <button
                                    key={col}
                                    type="button"
                                    onClick={() => handleUpdateItemVariant(targetIndex, 'color', col)}
                                    className={`min-h-[38px] px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold capitalize transition-all flex items-center gap-1.5 select-none active:scale-95 ${
                                      isSelected
                                        ? 'bg-ink text-white border-ink shadow-sm ring-2 ring-marigold/40'
                                        : 'bg-white text-ink border-line hover:border-marigold hover:bg-paper-dim'
                                    }`}
                                  >
                                    {isSelected && <FaCheck className="w-3 h-3 text-marigold" />}
                                    <span>{col}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Sizes */}
                        {hasSizes && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono uppercase tracking-wider text-text-soft font-semibold">
                                Size
                              </span>
                              {currentConfig.size && (
                                <span className="text-xs font-bold text-ink uppercase">
                                  {currentConfig.size}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {availableSizes.map((sz) => {
                                const isSelected = currentConfig.size === sz;
                                return (
                                  <button
                                    key={sz}
                                    type="button"
                                    onClick={() => handleUpdateItemVariant(targetIndex, 'size', sz)}
                                    className={`min-h-[38px] min-w-[46px] px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold uppercase transition-all flex items-center justify-center gap-1.5 select-none active:scale-95 ${
                                      isSelected
                                        ? 'bg-ink text-white border-ink shadow-sm ring-2 ring-marigold/40'
                                        : 'bg-white text-ink border-line hover:border-marigold hover:bg-paper-dim'
                                    }`}
                                  >
                                    {isSelected && <FaCheck className="w-3 h-3 text-marigold" />}
                                    <span>{sz}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Summary of all configured items (when multiple items with separate options) */}
                  {quantity >= 2 && useSeparateVariants && (
                    <div className="bg-paper-dim/60 rounded-xl p-3 border border-line">
                      <span className="text-xs font-mono uppercase tracking-wide text-text-soft block mb-2 font-semibold">
                        Order Breakdown ({quantity} units):
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {itemConfigs.slice(0, quantity).map((cfg, i) => (
                          <div
                            key={i}
                            onClick={() => setActiveItemIndex(i)}
                            className={`flex items-center justify-between text-xs p-2 rounded-lg cursor-pointer transition-colors ${
                              activeItemIndex === i
                                ? 'bg-white border border-marigold/60 shadow-xs'
                                : 'hover:bg-white/60'
                            }`}
                          >
                            <span className="font-semibold text-ink">Item #{i + 1}</span>
                            <span className="text-text-soft font-mono">
                              {cfg.size || 'No size'} • {cfg.color || 'No color'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link to full details */}
                  <div className="pt-1 text-center">
                    <Link
                      href={productUrl}
                      className="inline-flex items-center gap-1.5 text-xs text-text-soft hover:text-ink font-mono uppercase tracking-wider transition-colors"
                      onClick={onClose}
                    >
                      <span>View full product details & reviews</span>
                      <FaExternalLinkAlt className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 sm:p-5 border-t border-line bg-white sticky bottom-0 z-10 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-soft font-medium">Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'}):</span>
                    <span className="font-display font-extrabold text-lg text-ink">
                      <FormatPrice price={totalPrice} />
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleAddAndProceed(false)}
                      disabled={!product.inStock || maxStock === 0}
                      className="w-full py-3 px-3 rounded-xl bg-ink hover:bg-ink-light text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaShoppingCart className="w-3.5 h-3.5 text-marigold" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddAndProceed(true)}
                      disabled={!product.inStock || maxStock === 0}
                      className="w-full py-3 px-3 rounded-xl bg-marigold hover:bg-marigold-dark text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SelectOptionsDialog;
