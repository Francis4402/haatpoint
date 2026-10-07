// CartPage.tsx
import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaArrowLeft,
  FaCreditCard,
  FaTag,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeart,
  FaCheckCircle,
  FaLock,
  FaBox,
  FaTimes,
  FaStar,
  FaMapMarkerAlt,
  FaTruckLoading,
  FaInfoCircle,
  FaWeightHanging,
  FaPercent,
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import { areatypes, citytypes, zonetypes } from '@/types';
import { toast } from 'sonner';
import { useStore } from '../state/cartStore';
import ClearCartDialog from '../dialogpopups/ClearCartDialog';
import FormatPrice from '../utils/FormatePrice';
import Eyebrow from '../Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';


interface CartPageProps {
  auth: {
    user: any;
  };
  wishlist: any
}

const CartPage = ({ auth, wishlist }: CartPageProps) => {

  const {
    cart: cartItems,
    removeFromCart,
    clearCart,
    getTotalItems,
    getSubTotal,
    getShipping,
    increaseQty,
    decreaseQty,
    getItemById,
    pathaoCharges,
    selectedCity,
    selectedZone,
    selectedArea,
    setPathaoCharges,
    setSelectedCity,
    setSelectedZone,
    setSelectedArea,
    setCities,
    setZonesCart,
    setAreasCart,
    getFormattedCartItems
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  } | null>(null);

  const [cities, setLocalCities] = useState<citytypes[]>([]);
  const [zones, setZones] = useState<zonetypes[]>([]);
  const [areas, setAreas] = useState<areatypes[]>([]);
  const [loadingPathao, setLoadingPathao] = useState(false);
  const [pathaoBaseCharge, setPathaoBaseCharge] = useState<number | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoadingPathao(true);
    try {
      const res = await axios.get('/api/pathao/cities');
      const citiesData = res.data.data.data.map((city: any) => ({
        city_id: city.city_id,
        city_name: city.city_name
      }));
      setLocalCities(citiesData);
      setCities(citiesData);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Failed to load cities');
    } finally {
      setLoadingPathao(false);
    }
  }

  const fetchZone = async (cityId: string) => {
    if (!cityId) return;

    setLoadingPathao(true);
    try {
      const res = await axios.get(`/api/pathao/zones/${cityId}`);
      const zonesData = res.data.data.data.map((zone: any) => ({
        zone_id: zone.zone_id,
        zone_name: zone.zone_name
      }));
      setZones(zonesData);
      setZonesCart(zonesData);
      setAreas([]);
    } catch (error) {
      console.error('Error fetching zones:', error);
      setZones([]);
      toast.error('Failed to load zones');
    } finally {
      setLoadingPathao(false);
    }
  }

  const fetchArea = async (zoneId: string) => {
    if (!zoneId) return;

    setLoadingPathao(true);
    try {
      const res = await axios.get(`/api/pathao/areas/${zoneId}`);
      const areasData = res.data.data.data.map((area: any) => ({
        area_id: area.area_id,
        area_name: area.area_name,
        home_delivery_available: area.home_delivery_available || false,
        pickup_available: area.pickup_available || false
      }));
      setAreas(areasData);
      setAreasCart(areasData);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
      toast.error('Failed to load areas');
    } finally {
      setLoadingPathao(false);
    }
  }

  const getWeightSurchargePercentage = (weight: number): number => {
    if (weight <= 0.5) return 0;
    if (weight > 0.5 && weight <= 1) return 10;
    if (weight > 1 && weight <= 2) return 35;
    if (weight > 2) {
      const extraKg = Math.ceil(weight - 2);
      return 35 + (extraKg * 10);
    }
    return 0;
  };

  const getWeightSurchargeMessage = (weight: number): string => {
    if (weight <= 0.5) return 'No surcharge (≤ 0.5kg)';
    if (weight > 0.5 && weight <= 1) return '10% surcharge (0.5kg - 1kg)';
    if (weight > 1 && weight <= 2) return '35% surcharge (1kg - 2kg)';
    if (weight > 2) {
      const extraKg = Math.ceil(weight - 2);
      return `${35 + (extraKg * 10)}% surcharge (${extraKg}kg extra beyond 2kg)`;
    }
    return '';
  };

  const calculatePathaoPrice = async (cityId: string, zoneId: string, areaId?: string) => {
    if (!cityId || !zoneId) {
      toast.error('Please select city and zone');
      return;
    }

    setLoadingPathao(true);

    try {
      const subtotal = getSubTotal();
      const itemCount = getTotalItems();
      const items = getFormattedCartItems();

      const totalWeight = items.reduce((sum, item) => {
        return sum + ((item.item_weight || 0.5) * item.quantity);
      }, 0);

      const priceRequest: any = {
        store_id: 367082,
        sender_city: 2,
        recipient_city: parseInt(cityId),
        recipient_zone: parseInt(zoneId),
        item_type: 2,
        item_weight: Math.max(0.5, totalWeight),
        item_quantity: itemCount,
        amount_to_collect: subtotal,
        delivery_type: 48
      };

      if (areaId) {
        priceRequest.recipient_area = parseInt(areaId);
      }

      const response = await axios.post('/api/pathao/calculate-price', priceRequest);

      if (response.data?.data?.data) {
        const priceData = response.data.data.data;
        const pathaoDeliveryCharge = priceData.price || priceData.final_price || 0;

        setPathaoBaseCharge(pathaoDeliveryCharge);

        let weightSurchargePercentage = getWeightSurchargePercentage(totalWeight);
        let weightSurchargeAmount = pathaoDeliveryCharge * (weightSurchargePercentage / 100);

        const pathaoWithSurcharge = pathaoDeliveryCharge + weightSurchargeAmount;
        const totalDeliveryCharge = pathaoWithSurcharge + 20;

        setPathaoCharges({
          delivery_charge: totalDeliveryCharge,
          base_charge: pathaoDeliveryCharge,
          service_fee: 20,
          weight_surcharge: weightSurchargeAmount,
          weight_surcharge_percentage: weightSurchargePercentage
        });

        let weightMessage = '';
        if (totalWeight <= 0.5) {
          weightMessage = 'No weight surcharge';
        } else if (totalWeight > 0.5 && totalWeight <= 1) {
          weightMessage = `+10% weight surcharge (${totalWeight.toFixed(2)}kg)`;
        } else if (totalWeight > 1 && totalWeight <= 2) {
          weightMessage = `+35% weight surcharge (${totalWeight.toFixed(2)}kg)`;
        } else if (totalWeight > 2) {
          weightMessage = `+${weightSurchargePercentage}% weight surcharge (${totalWeight.toFixed(2)}kg)`;
        }

        toast.success(
          `Delivery charge: ৳${totalDeliveryCharge.toFixed(2)} (Pathao: ৳${pathaoDeliveryCharge.toFixed(2)} + ${weightMessage})`,
          { duration: 6000 }
        );
      }
    } catch (error: any) {
      console.error('Pathao calculation error:', error);

      if (error.response?.data?.message?.includes('area')) {
        toast.error('Please select an area to calculate shipping');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to calculate shipping price. Please try again.');
      }

      setPathaoCharges(null);
      setPathaoBaseCharge(null);
    } finally {
      setLoadingPathao(false);
    }
  };

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedZone('');
    setSelectedArea('');
    setZones([]);
    setAreas([]);
    setPathaoCharges(null);
    setPathaoBaseCharge(null);

    if (cityId) {
      await fetchZone(cityId);
    }
  };

  const handleZoneChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zoneId = e.target.value;
    setSelectedZone(zoneId);
    setSelectedArea('');
    setAreas([]);
    setPathaoCharges(null);
    setPathaoBaseCharge(null);

    if (zoneId && selectedCity) {
      await fetchArea(zoneId);
      await calculatePathaoPrice(selectedCity, zoneId);
    }
  };

  const handleAreaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaId = e.target.value;
    setSelectedArea(areaId);

    if (selectedCity && selectedZone) {
      await calculatePathaoPrice(selectedCity, selectedZone, areaId);
    }
  };

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const confirmClearCart = () => {
    clearCart();
    close();
  };

  const calculateTotals = () => {
    const subtotal = getSubTotal();
    const shipping = getShipping();
    const item_count = getTotalItems();

    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.type === 'percentage'
        ? subtotal * (appliedCoupon.discount / 100)
        : Math.min(appliedCoupon.discount, subtotal);
    }

    const total = Math.max(0, subtotal + shipping - discount);

    return { subtotal, shipping, discount, total, item_count };
  };

  const cartTotals = calculateTotals();

  const handleIncreaseQuantity = async (itemId: string) => {
    const item = getItemById(itemId);
    if (item && item.cartQty && item.cartQty < item.quantity) {
      increaseQty(itemId);
      if (selectedCity && selectedZone) {
        await calculatePathaoPrice(selectedCity, selectedZone, selectedArea);
      }
    }
  };

  const handleDecreaseQuantity = async (itemId: string) => {
    const item = getItemById(itemId);
    if (item && item.cartQty && item.cartQty > 1) {
      decreaseQty(itemId);
      if (selectedCity && selectedZone) {
        await calculatePathaoPrice(selectedCity, selectedZone, selectedArea);
      }
    } else {
      removeFromCart(itemId);
    }
  };

  const moveToWishlist = (itemId: string) => {
    const item = cartItems?.find(item => item.id === itemId);
    if (item) {
      removeFromCart(itemId);
      toast.success(`${item.name} moved to wishlist`);
    }
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) return;

    const validCoupons = [
      { code: 'SAVE10', discount: 10, type: 'percentage' as const },
      { code: 'SAVE20', discount: 20, type: 'percentage' as const },
      { code: 'SAVE5', discount: 5.99, type: 'fixed' as const },
      { code: 'SAVE15', discount: 15, type: 'percentage' as const }
    ];

    const coupon = validCoupons.find(c => c.code === couponCode.toUpperCase());

    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode('');
      toast.success(`Coupon ${coupon.code} applied!`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const calculateDiscountPercentage = (regular: number, sale: number | null) => {
    if (!sale || sale >= regular) return 0;
    return Math.round(((regular - sale) / regular) * 100);
  };

  const getStockStatus = (inStock: boolean) => {
    if (inStock) return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
  };

  const getFirstImage = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      let imageName = '';
      if (Array.isArray(parsed) && parsed.length > 0) {
        imageName = parsed[0];
      } else if (typeof parsed === 'string' && parsed) {
        imageName = parsed;
      }

      if (imageName) {
        return `${window.location.origin}/storage/${imageName}`;
      }
    } catch (error) {
      if (typeof images === 'string' && images) {
        const matches = images.match(/"([^"]+)"/);
        if (matches && matches[1]) {
          return `${window.location.origin}/storage/${matches[1]}`;
        }
      }
    }

    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
  };

  const calculateSaleSavings = () => {
    return (cartItems || []).reduce((sum, item) => {
      const regular = (item.regular_price);
      const sale = (item.sale_price);
      const quantity = item.cartQty || 1;

      if (sale && sale < regular) {
        return sum + ((regular - sale) * quantity);
      }
      return sum;
    }, 0);
  };

  const getSelectedCityName = () => {
    const city = cities.find(c => c.city_id === parseFloat(selectedCity));
    return city?.city_name || '';
  };

  const getSelectedZoneName = () => {
    const zone = zones.find(z => z.zone_id === parseFloat(selectedZone));
    return zone?.zone_name || '';
  };

  const getSelectedAreaName = () => {
    const area = areas.find(a => a.area_id === parseFloat(selectedArea));
    return area?.area_name || '';
  };

  const getTotalWeight = () => {
    const items = getFormattedCartItems();
    return items.reduce((sum, item) => {
      return sum + ((item.item_weight || 0.5) * item.quantity);
    }, 0);
  };

  const isCheckoutDisabled = () => {
    return !selectedCity || !selectedZone || !pathaoCharges || loadingPathao;
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <AppLayout user={auth.user} wishlist={wishlist}>
        <SeoHead />
        <div className="min-h-screen bg-paper-dim py-20">
          <div className="max-w-[1240px] mx-auto px-8">
            <div className="bg-white rounded-2xl shadow-hard-sm p-12 text-center border border-line">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-marigold/10 flex items-center justify-center">
                <FaShoppingCart className="h-12 w-12 text-marigold" />
              </div>
              <h3 className="text-2xl font-display font-bold text-ink mb-3">Your cart is empty</h3>
              <p className="text-text-soft mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Start shopping to discover amazing products!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <FaArrowRight className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={auth.user} wishlist={wishlist}>
      <SeoHead />

      <ClearCartDialog isOpen={isOpen} confirmClearCart={confirmClearCart} />

      <div className="min-h-screen bg-paper-dim py-20">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-9">
            <div>
              <Eyebrow>Review your items</Eyebrow>
              <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Shopping Cart</h2>
              <p className="text-text-soft mt-2">
                Review your items and select delivery location for Pathao shipping
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="font-mono text-xs uppercase tracking-wide border-b-2 border-ink pb-0.5 hover:border-marigold transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <FaArrowLeft className="h-3 w-3" />
                Continue Shopping
              </Link>
              {cartItems.length > 0 && (
                <button
                  onClick={open}
                  className="font-mono text-xs uppercase tracking-wide border-b-2 border-red-500 pb-0.5 text-red-500 hover:text-red-600 hover:border-red-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <FaTrash className="h-3 w-3" />
                  Clear Cart
                </button>
              )}
            </div>
          </div>

          {/* Cart Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-text-soft">Items</p>
                  <p className="text-lg sm:text-2xl font-bold text-ink">{cartTotals.item_count}</p>
                </div>
                <FaBox className="h-6 w-6 sm:h-8 sm:w-8 text-marigold/70" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-text-soft">Subtotal</p>
                  <p className="text-lg sm:text-2xl font-bold text-ink truncate">
                    <FormatPrice price={cartTotals.subtotal} />
                  </p>
                </div>
                <FaCreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-marigold/70" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-text-soft">Savings</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600 truncate">
                    <FormatPrice price={cartTotals.discount + calculateSaleSavings()} />
                  </p>
                </div>
                <FaTag className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 border border-line">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-text-soft">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-marigold truncate">
                    <FormatPrice price={cartTotals.total} />
                  </p>
                </div>
                <FaCheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-marigold" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-hard-sm overflow-hidden border border-line">
                <div className="p-4 sm:p-6 border-b border-line bg-paper-dim">
                  <h2 className="text-lg sm:text-xl font-semibold text-ink">
                    Your Items ({cartTotals.item_count})
                  </h2>
                </div>

                <div className="divide-y divide-line">
                  {cartItems.map((item) => {
                    const regularPrice = (item.regular_price);
                    const salePrice = item.sale_price ? (item.sale_price) : null;
                    const discountPercent = calculateDiscountPercentage(regularPrice, salePrice);
                    const stockStatus = getStockStatus(item.inStock);
                    const currentPrice = salePrice || regularPrice;
                    const quantity = item.cartQty || 1;
                    const totalPrice = currentPrice * quantity;
                    const imageUrl = getFirstImage(item.images);
                    const rating = item.rating || 0;

                    return (
                      <div key={item.id} className="p-4 sm:p-6 hover:bg-paper-dim/50 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="relative group">
                              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 border border-line">
                                <img
                                  src={imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                                  }}
                                />
                              </div>
                              {discountPercent > 0 && (
                                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                                  -{discountPercent}%
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-grow min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                              <div className="flex-grow min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <Link href={`/products/${item.slug}`}>
                                      <h3 className="font-semibold text-ink text-base sm:text-lg mb-1 hover:text-marigold transition-colors cursor-pointer truncate">
                                        {item.name}
                                      </h3>
                                    </Link>
                                    <p className="text-xs sm:text-sm text-text-soft mb-2 line-clamp-2">
                                      {stripHtml(item.description)}
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="text-base sm:text-lg font-bold text-ink">
                                      <FormatPrice price={currentPrice} />
                                    </div>
                                    {salePrice && (
                                      <div className="text-xs sm:text-sm text-text-soft line-through">
                                        <FormatPrice price={regularPrice} />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Product Meta */}
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                  <span className="text-[10px] sm:text-xs font-mono text-text-soft bg-paper-dim px-2 py-1 rounded truncate max-w-[100px] sm:max-w-none">
                                    {item.category}
                                  </span>
                                  <span className={`text-[10px] sm:text-xs font-mono px-2 py-1 rounded-full ${stockStatus.color}`}>
                                    {stockStatus.label}
                                  </span>
                                  {rating > 0 && (
                                    <span className="flex items-center text-[10px] sm:text-xs text-text-soft">
                                      <FaStar className="h-3 w-3 text-yellow-400 mr-1" />
                                      {rating}
                                    </span>
                                  )}
                                </div>

                                {/* Quantity Controls & Actions */}
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center border border-line rounded-lg bg-white">
                                      <button
                                        onClick={() => handleDecreaseQuantity(item.id)}
                                        disabled={quantity <= 1}
                                        className="px-2 sm:px-3 py-1.5 sm:py-2 text-text-soft hover:bg-paper-dim disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                                      >
                                        <FaMinus className="h-3 w-3" />
                                      </button>
                                      <span className="w-8 sm:w-12 text-center py-1.5 sm:py-2 text-ink font-medium border-x border-line text-sm">
                                        {quantity}
                                      </span>
                                      <button
                                        onClick={() => handleIncreaseQuantity(item.id)}
                                        disabled={quantity >= item.quantity}
                                        className="px-2 sm:px-3 py-1.5 sm:py-2 text-text-soft hover:bg-paper-dim disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                                      >
                                        <FaPlus className="h-3 w-3" />
                                      </button>
                                    </div>

                                    {/* Item Total */}
                                    <div className="text-xs sm:text-sm font-semibold text-ink whitespace-nowrap">
                                      Total: <FormatPrice price={totalPrice} />
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2 sm:gap-4">
                                    <button
                                      onClick={() => moveToWishlist(item.id)}
                                      className="inline-flex items-center text-xs sm:text-sm text-text-soft hover:text-marigold hover:bg-paper-dim px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors"
                                    >
                                      <FaHeart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                      <span className="hidden sm:inline">Save</span>
                                    </button>
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="inline-flex items-center text-xs sm:text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors"
                                    >
                                      <FaTrash className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                      <span className="hidden sm:inline">Remove</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-line flex items-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <FaShieldAlt className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink text-sm sm:text-base">Secure Checkout</p>
                    <p className="text-xs sm:text-sm text-text-soft truncate">Your data is protected</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-line flex items-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <FaTruck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink text-sm sm:text-base">Pathao Delivery</p>
                    <p className="text-xs sm:text-sm text-text-soft truncate">Fast & reliable</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-line flex items-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <FaUndo className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink text-sm sm:text-base">Easy Returns</p>
                    <p className="text-xs sm:text-sm text-text-soft truncate">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Order Summary Card */}
                <div className="bg-white rounded-xl shadow-hard-sm overflow-hidden border border-line">
                  <div className="p-4 sm:p-6 border-b border-line bg-paper-dim">
                    <h2 className="text-lg sm:text-xl font-semibold text-ink flex items-center">
                      <FaCreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-text-soft" />
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-4 sm:p-6">
                    {/* Pricing Breakdown */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm sm:text-base text-text-soft">Subtotal</span>
                          <div className="group relative ml-2">
                            <FaInfoCircle className="h-3 w-3 text-text-soft cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-ink text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Tax (10%) is included
                            </div>
                          </div>
                        </div>
                        <span className="font-medium text-ink text-sm sm:text-base">
                          <FormatPrice price={cartTotals.subtotal} />
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base text-text-soft">Shipping (Pathao)</span>
                        <span className="font-medium text-ink text-sm sm:text-base">
                          {pathaoCharges ? (
                            <div className="text-right">
                              <div><FormatPrice price={pathaoCharges.delivery_charge} /></div>
                            </div>
                          ) : (
                            <span className="text-text-soft">
                              {loadingPathao ? 'Calculating...' : 'Select area'}
                            </span>
                          )}
                        </span>
                      </div>

                      {appliedCoupon && (
                        <div className="flex justify-between items-center bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200">
                          <div className="flex items-center min-w-0">
                            <FaTag className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-1 sm:mr-2 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-text-soft truncate">
                              Discount ({appliedCoupon.code})
                            </span>
                          </div>
                          <div className="flex items-center flex-shrink-0">
                            <span className="font-medium text-green-600 mr-1 sm:mr-2 text-sm">
                              -<FormatPrice price={cartTotals.discount} />
                            </span>
                            <button
                              onClick={removeCoupon}
                              className="text-text-soft hover:text-ink transition-colors"
                              aria-label="Remove coupon"
                            >
                              <FaTimes className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pathao Delivery Configuration */}
                    <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl shadow-sm p-4 sm:p-6 border-2 border-green-200 mb-6">
                      <h2 className="text-base sm:text-lg font-bold text-ink mb-4 flex items-center">
                        <FaTruck className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                        Pathao Delivery
                      </h2>

                      <div className="space-y-4">
                        <div className="mt-2">
                          <h3 className="font-bold text-ink mb-3 flex items-center text-xs sm:text-sm">
                            <FaMapMarkerAlt className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-2" />
                            Select Delivery Location
                          </h3>

                          {loadingPathao && (
                            <div className="mb-3 p-2 sm:p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                              <p className="text-[10px] sm:text-xs text-blue-700 font-medium flex items-center">
                                <FaTruckLoading className="h-3 w-3 mr-2 animate-spin" />
                                Loading locations...
                              </p>
                            </div>
                          )}

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] sm:text-xs font-mono text-text-soft mb-1 uppercase tracking-wide">
                                City *
                              </label>
                              <select
                                value={selectedCity}
                                onChange={handleCityChange}
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-line rounded-lg focus:ring-2 focus:ring-green-500 focus:border-marigold transition-all bg-white"
                                disabled={loadingPathao}
                              >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                  <option key={city.city_id} value={city.city_id}>
                                    {city.city_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] sm:text-xs font-mono text-text-soft mb-1 uppercase tracking-wide">
                                Zone *
                              </label>
                              <select
                                value={selectedZone}
                                onChange={handleZoneChange}
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-line rounded-lg focus:ring-2 focus:ring-green-500 focus:border-marigold transition-all bg-white"
                                disabled={!selectedCity || loadingPathao}
                              >
                                <option value="">Select Zone</option>
                                {zones.map((zone) => (
                                  <option key={zone.zone_id} value={zone.zone_id}>
                                    {zone.zone_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] sm:text-xs font-mono text-text-soft mb-1 uppercase tracking-wide">
                                Area
                              </label>
                              <select
                                value={selectedArea}
                                onChange={handleAreaChange}
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-line rounded-lg focus:ring-2 focus:ring-green-500 focus:border-marigold transition-all bg-white"
                                disabled={!selectedZone || loadingPathao}
                              >
                                <option value="">Select Area (Optional)</option>
                                {areas.map((area) => (
                                  <option key={area.area_id} value={area.area_id}>
                                    {area.area_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Shipping Rate Display */}
                          {selectedCity && (
                            <div className="mt-4 p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-sm overflow-hidden">
                              <div className="flex items-center mb-2 sm:mb-3">
                                <FaCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                                <h4 className="font-bold text-green-800 text-xs sm:text-sm">Delivery Charges</h4>
                              </div>

                              {loadingPathao && (
                                <div className="mb-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-[10px] sm:text-xs text-blue-700 flex items-center">
                                    <FaTruckLoading className="h-3 w-3 mr-2 animate-spin" />
                                    Calculating delivery charges via Pathao...
                                  </p>
                                </div>
                              )}

                              <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
                                <p className="text-[10px] sm:text-xs text-blue-700 flex items-center truncate">
                                  <FaMapMarkerAlt className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">
                                    Delivering to: {getSelectedCityName()}
                                    {selectedZone && `, ${getSelectedZoneName()}`}
                                    {selectedArea && `, ${getSelectedAreaName()}`}
                                  </span>
                                </p>
                              </div>

                              {!loadingPathao && (
                                <div className="mb-3 p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] sm:text-xs font-semibold text-yellow-800 flex items-center">
                                      <FaWeightHanging className="h-3 w-3 mr-1" />
                                      Total Weight:
                                    </p>
                                    <p className="text-xs sm:text-sm font-bold text-yellow-900">
                                      {getTotalWeight().toFixed(2)} kg
                                    </p>
                                  </div>

                                  <div className="mt-2 p-2 bg-white rounded border border-yellow-200">
                                    <p className="text-[10px] sm:text-xs text-gray-700 flex items-center mb-1">
                                      <FaPercent className="h-3 w-3 mr-1 text-orange-500" />
                                      Weight Surcharge:
                                    </p>
                                    <p className={`text-[10px] sm:text-xs font-medium ${getTotalWeight() <= 0.5 ? 'text-green-600' : getTotalWeight() <= 1 ? 'text-orange-500' : 'text-red-500'}`}>
                                      {getWeightSurchargeMessage(getTotalWeight())}
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="text-center p-3 sm:p-4 bg-green-100 rounded-lg border-2 border-green-300 mb-3">
                                <p className="text-[10px] sm:text-xs text-green-700 font-semibold mb-1">
                                  {loadingPathao ? 'Calculating...' : pathaoCharges ? 'Total Delivery Charge' : 'Select area to calculate'}
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-green-700">
                                  {loadingPathao ? (
                                    <FaTruckLoading className="h-5 w-5 sm:h-6 sm:w-6 mx-auto animate-spin" />
                                  ) : (
                                    pathaoCharges ? <FormatPrice price={pathaoCharges.delivery_charge} /> : '---'
                                  )}
                                </p>
                              </div>

                              {pathaoCharges && !loadingPathao && (
                                <div className="mt-2 p-2 sm:p-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-2 flex items-center">
                                    <FaInfoCircle className="h-3 w-3 mr-1" />
                                    Price Breakdown:
                                  </p>
                                  <div className="space-y-1 text-[10px] sm:text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Pathao Base Charge:</span>
                                      <span className="font-medium">
                                        <FormatPrice price={pathaoCharges.base_charge || 0} />
                                      </span>
                                    </div>

                                    {pathaoCharges.weight_surcharge && pathaoCharges.weight_surcharge > 0 && (
                                      <div className="flex justify-between text-orange-600">
                                        <span className="flex items-center truncate">
                                          <FaWeightHanging className="h-3 w-3 mr-1 flex-shrink-0" />
                                          <span className="truncate">Surcharge ({pathaoCharges.weight_surcharge_percentage}%):</span>
                                        </span>
                                        <span className="flex-shrink-0">+ <FormatPrice price={pathaoCharges.weight_surcharge} /></span>
                                      </div>
                                    )}

                                    <div className="flex justify-between text-blue-600">
                                      <span>Service Fee:</span>
                                      <span>+ <FormatPrice price={20} /></span>
                                    </div>

                                    <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                                      <span>Total:</span>
                                      <span className="text-green-600"><FormatPrice price={pathaoCharges.delivery_charge} /></span>
                                    </div>
                                  </div>

                                  <div className="mt-3 p-2 bg-gray-50 rounded text-[10px] sm:text-xs">
                                    <p className="text-gray-600 font-medium mb-1 flex items-center">
                                      <FaInfoCircle className="h-3 w-3 mr-1" />
                                      Weight Surcharge Rules:
                                    </p>
                                    <ul className="text-gray-500 space-y-0.5 ml-4 list-disc">
                                      <li>≤ 0.5 kg: <span className="text-green-600">No surcharge</span></li>
                                      <li>0.5 kg - 1 kg: <span className="text-orange-500">+10% surcharge</span></li>
                                      <li>1 kg - 2 kg: <span className="text-orange-500">+35% surcharge</span></li>
                                      <li>&gt; 2 kg: <span className="text-red-500">+35% + 10% per additional kg</span></li>
                                    </ul>
                                  </div>
                                </div>
                              )}

                              {selectedArea && pathaoCharges && (
                                <div className="mt-3 p-2 bg-purple-50 rounded-lg border border-purple-200">
                                  <p className="text-[10px] sm:text-xs text-purple-700 flex items-center">
                                    <FaTruck className="h-3 w-3 mr-1" />
                                    Estimated delivery: {
                                      getSelectedCityName().toLowerCase().includes('dhaka') ? '2-3' :
                                      getSelectedCityName().toLowerCase().includes('chittagong') ? '2-3' : '3-5'
                                    } business days
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Coupon Code */}
                    {!appliedCoupon && (
                      <div className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-grow px-3 sm:px-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-marigold transition-colors bg-white text-sm"
                          />
                          <button
                            onClick={applyCoupon}
                            className="px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-lg transition-all duration-300 hover:shadow-md whitespace-nowrap text-sm"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t border-line pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-base sm:text-lg font-semibold text-ink">Total</span>
                        <div className="text-right">
                          <div className="text-xl sm:text-2xl font-bold text-marigold">
                            <FormatPrice price={cartTotals.total} />
                          </div>
                          <div className="text-xs sm:text-sm text-text-soft">
                            {cartTotals.item_count} item{cartTotals.item_count !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => {
                        if (!isCheckoutDisabled()) {
                          router.visit('/checkout');
                        }
                      }}
                      disabled={isCheckoutDisabled()}
                      className={`w-full py-2.5 sm:py-3 px-4 font-semibold rounded-lg transition-all duration-300 text-center mb-4 flex items-center justify-center text-sm sm:text-base ${
                        isCheckoutDisabled()
                          ? 'bg-gray-200 text-text-soft cursor-not-allowed'
                          : 'bg-gray-900 hover:bg-marigold text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      <FaLock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      {isCheckoutDisabled()
                        ? 'Complete delivery details to continue'
                        : 'Proceed to Checkout'}
                    </button>

                    {/* Payment Methods */}
                    <div className="text-center pt-4 border-t border-line">
                      <p className="text-xs sm:text-sm text-text-soft mb-3">We accept</p>
                      <div className="flex justify-center space-x-3">
                        <div className="w-8 h-5 sm:w-10 sm:h-6 bg-gray-100 rounded border border-line"></div>
                        <div className="w-8 h-5 sm:w-10 sm:h-6 bg-gray-100 rounded border border-line"></div>
                        <div className="w-8 h-5 sm:w-10 sm:h-6 bg-gray-100 rounded border border-line"></div>
                        <div className="w-8 h-5 sm:w-10 sm:h-6 bg-gray-100 rounded border border-line"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need Help */}
                <div className="bg-gradient-to-r from-marigold to-marigold-dark rounded-xl shadow-lg p-4 sm:p-6 text-white">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Need help?</h3>
                  <p className="text-white/80 text-xs sm:text-sm mb-4">
                    Our customer support team is available 24/7 to assist you with your order.
                  </p>
                  <Link
                    href="/contactus"
                    className="inline-flex items-center justify-center w-full py-2 bg-white text-marigold font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Contact Support
                    <FaArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CartPage;
