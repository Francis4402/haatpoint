// Checkout.tsx
import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import {
  FaLock,
  FaArrowLeft,
  FaMoneyBill,
  FaUser,
  FaShieldAlt,
  FaShoppingCart,
  FaExclamationCircle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBox,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaMoneyBillWave,
  FaStore,
} from 'react-icons/fa';
import AppLayout from '@/Layouts/AppLayout';
import { useStore, OrderData } from '../state/cartStore';
import { toast } from 'sonner';
import FormatPrice from '../utils/FormatePrice';
import Eyebrow from '../Components/Eyebrow';
import SeoHead from '@/Components/SeoHead';


interface CheckoutProps {
  auth: {
    user: any
  };
  wishlist: any
}

const Checkout = ({ auth, wishlist }: CheckoutProps) => {
  const {
    cart: cartItems,
    processCheckout,
    getOrderSummary,
    pathaoCharges,
    selectedCity,
    selectedZone,
    selectedArea,
    cities,
    zones,
    areas,
  } = useStore();

  const store = cartItems[0]?.store;

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { data, setData, processing } = useForm({
    recipient_name: auth.user?.name || '',
    recipient_phone: '',
    recipient_email: auth.user?.email || '',
    recipient_address: '',
    notes: '',
    payment_method: 'cash_on_delivery' as 'cash_on_delivery' | 'bikash'
  });

  const summary = getOrderSummary();

  const getFirstImage = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      const imageName = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;
      if (imageName) {
        return `/storage/${imageName}`;
      }
    } catch {
      if (typeof images === 'string' && images) {
        const matches = images.match(/"([^"]+)"/);
        if (matches && matches[1]) {
          return `/storage/${matches[1]}`;
        }
        if (images && !images.includes('"')) {
          return `/storage/${images}`;
        }
      }
    }
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
  };

  const getSelectedCityName = () => {
    const city = cities.find(c => c.city_id === parseInt(selectedCity));
    return city?.city_name || '';
  };

  const getSelectedZoneName = () => {
    const zone = zones.find(z => z.zone_id === parseInt(selectedZone));
    return zone?.zone_name || '';
  };

  const getSelectedAreaName = () => {
    if (!selectedArea) return '';
    const area = areas.find(a => a.area_id === parseInt(selectedArea));
    return area?.area_name || '';
  };

  const getEstimatedDelivery = () => {
    const cityName = getSelectedCityName().toLowerCase();
    if (cityName.includes('dhaka')) return '3-4 business days';
    if (cityName.includes('chittagong') || cityName.includes('chattogram')) return '2-3 business days';
    return '3-4 business days';
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!data.recipient_name.trim()) errors.recipient_name = 'Recipient name is required';
    if (!data.recipient_phone.trim()) errors.recipient_phone = 'Recipient phone number is required';
    else if (!/^01[3-9]\d{8}$/.test(data.recipient_phone)) errors.recipient_phone = 'Phone number must be 11 digits and start with 01';
    if (!data.recipient_email.trim()) errors.recipient_email = 'Recipient email is required';
    else if (!/\S+@\S+\.\S+/.test(data.recipient_email)) errors.recipient_email = 'Email is invalid';
    if (!data.recipient_address.trim()) errors.recipient_address = 'Delivery address is required';
    if (!selectedCity) errors.pathao_city = 'Please select a city';
    if (!selectedZone) errors.pathao_zone = 'Please select a zone';
    if (!pathaoCharges) errors.pathao_charges = 'Please calculate shipping charges';
    if (!termsAccepted) errors.terms = 'You must accept the terms and conditions';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsProcessing(true);
    setError('');
    setValidationErrors({});

    if (!selectedCity || !selectedZone || !pathaoCharges) {
      toast.error('Please select city and zone');
      setIsProcessing(false);
      return;
    }

    if (!auth.user) {
      toast.error('Please login to continue');
      setIsProcessing(false);
      return;
    }

    const userId = auth.user.uuid || auth.user.id || auth.user.user_id;

    if (!userId) {
      toast.error('User ID not found');
      setIsProcessing(false);
      return;
    }

    const orderData: OrderData = {
      user_id: userId,
      sender_name: '',
      sender_email: '',
      sender_phone: '',
      recipient_name: data.recipient_name,
      recipient_phone: data.recipient_phone,
      recipient_email: data.recipient_email,
      recipient_address: data.recipient_address,
      notes: data.notes,
      payment_method: data.payment_method,
      pathao_city: selectedCity,
      pathao_city_name: getSelectedCityName(),
      pathao_zone: selectedZone,
      pathao_zone_name: getSelectedZoneName(),
      ...(selectedArea && {
        pathao_area: selectedArea,
        pathao_area_name: getSelectedAreaName(),
      }),
    };

    try {
      await processCheckout(orderData);
    } catch (err: any) {
      console.error('Checkout error:', err);
      if (err && typeof err === 'object') {
        setValidationErrors(err);
        setError('Please fix the validation errors below');
      } else {
        setError('Failed to process checkout. Please try again.');
      }
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <AppLayout user={auth.user} wishlist={wishlist}>
        <SeoHead />
        <div className="min-h-screen bg-paper-dim py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-marigold/10 flex items-center justify-center">
                <FaShoppingCart className="h-12 w-12 text-marigold" />
              </div>
              <h2 className="text-2xl font-display font-extrabold uppercase text-ink mb-4">Your cart is empty</h2>
              <p className="text-text-soft mb-8">Add items to your cart before checkout</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <FaArrowLeft className="h-4 w-4" />
                Continue Shopping
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

      <div className="min-h-screen bg-paper-dim py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Eyebrow>Complete your purchase</Eyebrow>
            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Checkout</h1>
            <p className="text-text-soft mt-1">Review and confirm your order details</p>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 text-red-700 px-4 py-3 rounded-xl flex items-start shadow-hard-sm border-red-200">
              <FaExclamationCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{error}</p>
                {Object.keys(validationErrors).length > 0 && (
                  <ul className="text-sm mt-1 list-disc list-inside">
                    {Object.entries(validationErrors).map(([field, message]) => (
                      <li key={field} className="text-red-600">
                        {field.replace(/_/g, ' ')}: {message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Store Information */}
                {store && (
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                  <div className="bg-gradient-to-r from-marigold to-marigold-dark px-6 py-4">
                    <h2 className="text-xl font-display font-extrabold uppercase text-white flex items-center">
                      <FaStore className="h-5 w-5 mr-2" />
                      Store Information
                    </h2>
                    <p className="text-white/80 text-sm mt-1">Items will be shipped from this store</p>
                  </div>
                  <div className="p-6">
                    <div className="bg-paper-dim p-4 rounded-xl border border-line">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={`/storage/${store.logo}`}
                          alt={store.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-marigold/30"
                          onError={(e) => {
                            e.currentTarget.src = '/default-store-logo.png';
                          }}
                        />
                        <div>
                          <h3 className="font-semibold text-ink text-lg">{store.name}</h3>
                          <p className="text-sm text-text-soft flex items-center gap-1">
                            <FaCheckCircle className="h-3 w-3 text-marigold" />
                            Verified Store
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-text-soft mt-3 pt-3 border-t border-line">
                        <p className="flex items-center gap-2">
                          <FaPhone className="h-3 w-3 text-marigold" />
                          <span className="font-medium text-ink">Phone:</span> {store.mobile || 'Not available'}
                        </p>
                        <p className="flex items-center gap-2">
                          <FaEnvelope className="h-3 w-3 text-marigold" />
                          <span className="font-medium text-ink">Email:</span> {store.email || 'Not available'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-text-soft mt-2">
                      This store will fulfill and ship your order
                    </p>
                  </div>
                </div>
                )}

                {/* Recipient Information */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                    <h2 className="text-xl font-display font-extrabold uppercase text-white flex items-center">
                      <FaUser className="h-5 w-5 mr-2" />
                      Recipient Information
                    </h2>
                    <p className="text-gray-300 text-sm mt-1">Who will receive this order?</p>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-2">
                          <FaUser className="h-4 w-4 inline mr-1 text-marigold" />
                          Recipient Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={data.recipient_name}
                          onChange={e => setData('recipient_name', e.target.value)}
                          className={`w-full px-4 py-3 border ${
                            validationErrors.recipient_name ? 'border-red-500 bg-red-50' : 'border-line'
                          } rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft transition-all`}
                          placeholder="Enter recipient's full name"
                        />
                        {validationErrors.recipient_name && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <FaExclamationCircle className="h-3 w-3 mr-1" />
                            {validationErrors.recipient_name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-ink mb-2">
                          <FaPhone className="h-4 w-4 inline mr-1 text-marigold" />
                          Recipient Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={data.recipient_phone}
                          onChange={e => setData('recipient_phone', e.target.value)}
                          className={`w-full px-4 py-3 border ${
                            validationErrors.recipient_phone ? 'border-red-500 bg-red-50' : 'border-line'
                          } rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft transition-all`}
                          placeholder="01XXXXXXXXX"
                        />
                        {validationErrors.recipient_phone && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <FaExclamationCircle className="h-3 w-3 mr-1" />
                            {validationErrors.recipient_phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        <FaEnvelope className="h-4 w-4 inline mr-1 text-marigold" />
                        Recipient Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={data.recipient_email}
                        onChange={e => setData('recipient_email', e.target.value)}
                        className={`w-full px-4 py-3 border ${
                          validationErrors.recipient_email ? 'border-red-500 bg-red-50' : 'border-line'
                        } rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft transition-all`}
                        placeholder="recipient@email.com"
                      />
                      {validationErrors.recipient_email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <FaExclamationCircle className="h-3 w-3 mr-1" />
                          {validationErrors.recipient_email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        <FaMapMarkerAlt className="h-4 w-4 inline mr-1 text-marigold" />
                        Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={data.recipient_address}
                        onChange={e => setData('recipient_address', e.target.value)}
                        className={`w-full px-4 py-3 border ${
                          validationErrors.recipient_address ? 'border-red-500 bg-red-50' : 'border-line'
                        } rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft transition-all`}
                        placeholder="House #, Road #, Area"
                      />
                      {validationErrors.recipient_address && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <FaExclamationCircle className="h-3 w-3 mr-1" />
                          {validationErrors.recipient_address}
                        </p>
                      )}
                    </div>

                    {/* Pathao Location Summary */}
                    {selectedCity && selectedZone && pathaoCharges && (
                      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <div className="flex items-start">
                          <FaCheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-800">Pathao Delivery Location</p>
                            <p className="text-sm text-green-700 mt-1">
                              {getSelectedZoneName()}, {getSelectedCityName()}
                              {selectedArea && `, ${getSelectedAreaName()}`}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-green-600">
                                Delivery: <FormatPrice price={pathaoCharges.delivery_charge} />
                              </p>
                              <p className="text-xs text-green-600 flex items-center">
                                <FaClock className="h-3 w-3 mr-1" />
                                {getEstimatedDelivery()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={data.notes}
                        onChange={e => setData('notes', e.target.value)}
                        className="w-full px-4 py-3 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft transition-all"
                        placeholder="Special instructions for delivery, gate code, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                  <div className="bg-gradient-to-r from-marigold to-marigold-dark px-6 py-4">
                    <h2 className="text-xl font-display font-extrabold uppercase text-white flex items-center">
                      <FaMoneyBill className="h-5 w-5 mr-2" />
                      Payment Method
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                        data.payment_method === 'cash_on_delivery'
                          ? 'border-marigold bg-marigold/5'
                          : 'border-line hover:border-marigold/50'
                      }`}>
                        <input
                          type="radio"
                          name="payment_method"
                          value="cash_on_delivery"
                          checked={data.payment_method === 'cash_on_delivery'}
                          onChange={() => setData('payment_method', 'cash_on_delivery')}
                          className="h-5 w-5 text-marigold"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center">
                            <FaMoneyBillWave className="h-6 w-6 text-marigold mr-2" />
                            <span className="font-medium text-ink">Cash on Delivery</span>
                          </div>
                          <p className="text-sm text-text-soft mt-1">Pay with cash when you receive your order</p>
                        </div>
                      </label>

                      <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                        data.payment_method === 'bikash'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-line hover:border-marigold/50'
                      }`}>
                        <input
                          type="radio"
                          name="payment_method"
                          value="bikash"
                          checked={data.payment_method === 'bikash'}
                          onChange={() => setData('payment_method', 'bikash')}
                          className="h-5 w-5 text-pink-600"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center">
                            <FaCreditCard className="h-6 w-6 text-pink-600 mr-2" />
                            <span className="font-medium text-ink">bKash</span>
                          </div>
                          <p className="text-sm text-text-soft mt-1">Pay via bKash mobile banking</p>
                        </div>
                      </label>
                    </div>

                    {validationErrors.payment_method && (
                      <p className="text-red-500 text-sm mt-2">{validationErrors.payment_method}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-6">
                  {/* Order Summary Card */}
                  <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                      <h2 className="text-xl font-display font-extrabold uppercase text-white flex items-center">
                        <FaBox className="h-5 w-5 mr-2" />
                        Order Summary
                      </h2>
                      <p className="text-gray-300 text-sm mt-1">{cartItems.length} items in your cart</p>
                    </div>

                    <div className="p-6">
                      {/* Cart Items */}
                      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div key={item.cartKey || `${item.id}__${item.selectedSize || ''}__${item.selectedColor || ''}`} className="flex gap-3">
                            <div className="w-16 h-16 bg-paper-dim rounded-xl overflow-hidden flex-shrink-0 border border-line">
                              <img
                                src={getFirstImage(item.images)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-image.jpg';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-ink line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-xs text-text-soft mt-1">
                                Qty: {item.cartQty || 1}
                              </p>
                              {(item.selectedColor || item.selectedSize) && (
                                <p className="text-xs text-text-soft mt-0.5">
                                  {item.selectedColor && <span className="capitalize">{item.selectedColor}</span>}
                                  {item.selectedColor && item.selectedSize && ' · '}
                                  {item.selectedSize && <span className="uppercase">{item.selectedSize}</span>}
                                </p>
                              )}
                              <p className="text-sm font-semibold text-ink mt-1">
                                <FormatPrice price={(item.sale_price || item.regular_price) * (item.cartQty || 1)} />
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-3 pt-4 border-t border-line">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-soft">Subtotal</span>
                          <span className="font-medium text-ink"><FormatPrice price={summary.subtotal} /></span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-soft">Shipping</span>
                          <span className="font-medium text-ink"><FormatPrice price={summary.shipping} /></span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-soft">Tax (10%)</span>
                          <span className="font-medium text-ink"><FormatPrice price={summary.tax} /></span>
                        </div>
                        {summary.discount && summary.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-text-soft">Discount</span>
                            <span className="font-medium text-green-600">-<FormatPrice price={summary.discount} /></span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-bold pt-3 border-t border-line">
                          <span className="text-ink">Total</span>
                          <span className="text-marigold"><FormatPrice price={summary.total} /></span>
                        </div>
                      </div>

                      {/* Terms and Place Order */}
                      <div className="mt-6">
                        <div className="flex items-start mb-4">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="h-4 w-4 text-marigold mt-1 rounded border-line focus:ring-marigold"
                          />
                          <label htmlFor="terms" className="ml-2 text-xs text-text-soft">
                            I agree to the{' '}
                            <a
                              href={route('terms.and.conditions')}
                              className="text-marigold hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Terms &amp; Conditions
                            </a>{' '}
                            and confirm that the order information is correct
                          </label>
                        </div>
                        {validationErrors.terms && (
                          <p className="text-red-500 text-xs mb-2">{validationErrors.terms}</p>
                        )}

                        <button
                          type="submit"
                          disabled={processing || isProcessing || cartItems.length === 0 || !selectedCity || !selectedZone || !pathaoCharges || !termsAccepted}
                          className="w-full py-4 bg-gray-900 hover:bg-marigold text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                        >
                          <FaLock className="h-5 w-5 mr-2" />
                          {(processing || isProcessing) ? (
                            <span className="flex items-center">
                              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            'Place Order'
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => window.history.back()}
                          className="w-full mt-3 py-3 bg-paper-dim text-text-soft hover:text-ink font-medium rounded-xl hover:bg-paper-dim/80 transition-colors flex items-center justify-center border border-line"
                        >
                          <FaArrowLeft className="h-4 w-4 mr-2" />
                          Return to Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Secure Checkout Badge */}
                  <div className="bg-marigold/5 rounded-xl p-4 border border-marigold/20">
                    <div className="flex items-center gap-3">
                      <FaShieldAlt className="h-8 w-8 text-marigold" />
                      <div>
                        <h4 className="font-semibold text-ink">Secure Checkout</h4>
                        <p className="text-xs text-text-soft">Your information is encrypted and secure</p>
                      </div>
                    </div>
                  </div>

                  {/* Need Help */}
                  <div className="bg-paper-dim rounded-xl p-4 border border-line">
                    <h4 className="font-semibold text-ink mb-2">Need Help?</h4>
                    <p className="text-sm text-text-soft mb-3">
                      Contact our customer support for assistance
                    </p>
                    <div className="text-marigold text-sm font-medium flex items-center gap-2">
                      <FaPhone className="h-3 w-3" />
                      +8801319052507
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Checkout;
