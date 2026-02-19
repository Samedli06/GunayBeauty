import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, X, Loader2, Check, ShoppingBag, Wallet } from 'lucide-react';
import { Link } from 'react-router';
import {
  useGetCartItemsQuery,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useRemoveCartMutation,
  useGetMeQuery,
  useCreateWhatsappOrderMutation,
  useApplyPromoCartMutation,
  useRemovePromoCartMutation,
  API_BASE_URL,
  useInitiatePaymentMutation,
  useGetInstallmentConfigurationQuery,
  useGetInstallmentOptionsQuery,
  useCalculateInstallmentQuery,
  useGetWalletBalanceQuery
} from '../../store/API';
import { Ticket, Tag, CreditCard, ChevronRight, Calculator } from 'lucide-react';
import { toast } from 'react-toastify';
import { Breadcrumb } from '../../products/Breadcrumb'
import UnauthorizedModal from '../../components/UI/UnauthorizedModal';

const AuthUtils = {
  isAuthenticated() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name] = cookie.trim().split('=');
      if (name === 'token' || name === 'authToken' || name === 'accessToken' || name === 'jwt') {
        return true;
      }
    }
    return false;
  }
};

const CartUtils = {
  CART_KEY: 'ecommerce_cart',

  getCart() {
    try {
      const cart = localStorage.getItem(this.CART_KEY);
      return cart ? JSON.parse(cart) : {
        items: [],
        totalPriceBeforeDiscount: 0,
        totalDiscount: 0,
        totalAmount: 0
      };
    } catch (error) {
      console.error('Error reading cart:', error);
      return {
        items: [],
        totalPriceBeforeDiscount: 0,
        totalDiscount: 0,
        totalAmount: 0
      };
    }
  },

  saveCart(cart) {
    try {
      cart.totalPriceBeforeDiscount = cart.totalPriceBeforeDiscount || 0;
      cart.totalDiscount = cart.totalDiscount || 0;
      cart.totalAmount = cart.totalAmount || 0;

      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  removeItem(itemId) {
    const cart = this.getCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    this.updateCartTotals(cart);
    return cart;
  },

  updateQuantity(itemId, quantity) {
    const cart = this.getCart();
    const item = cart.items.find(item => item.id === itemId);

    if (!item) {
      console.warn(`Item with id ${itemId} not found`);
      return cart;
    }

    if (quantity <= 0) {
      return this.removeItem(itemId);
    }

    item.quantity = quantity;
    const originalUnitPrice = item.unitPrice + (item.productDiscount || 0);
    item.totalPriceBeforeDiscount = originalUnitPrice * quantity;
    item.totalPrice = item.unitPrice * quantity;

    this.updateCartTotals(cart);
    return cart;
  },

  clearCart() {
    const emptyCart = {
      items: [],
      totalPriceBeforeDiscount: 0,
      totalDiscount: 0,
      totalAmount: 0
    };
    localStorage.setItem(this.CART_KEY, JSON.stringify(emptyCart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: emptyCart }));
  },

  updateCartTotals(cart) {
    const totalPriceBeforeDiscount = cart.items.reduce(
      (sum, item) => sum + (item.totalPriceBeforeDiscount || 0),
      0
    );

    const totalDiscount = cart.items.reduce(
      (sum, item) => sum + ((item.productDiscount || 0) * (item.quantity || 0)),
      0
    );

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );

    cart.totalPriceBeforeDiscount = isNaN(totalPriceBeforeDiscount) ? 0 : totalPriceBeforeDiscount;
    cart.totalDiscount = isNaN(totalDiscount) ? 0 : totalDiscount;
    cart.totalAmount = isNaN(totalAmount) ? 0 : totalAmount;

    this.saveCart(cart);
  }
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Skeleton Components
const CartItemSkeletonMobile = () => (
  <div className="space-y-4 lg:hidden animate-pulse">
    <div className="flex items-start rounded-lg">
      <div className="w-30 h-30 bg-gray-300 rounded-lg mr-4"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center border border-gray-300 rounded-lg">
        <div className="w-10 h-10 bg-gray-300 rounded"></div>
        <div className="w-12 h-10 bg-gray-300 mx-2 rounded"></div>
        <div className="w-10 h-10 bg-gray-300 rounded"></div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-20"></div>
    </div>
  </div>
);

const CartItemSkeletonDesktop = () => (
  <div className="hidden lg:flex gap-4 animate-pulse">
    <div className="flex-1 flex">
      <div className="w-30 h-30 bg-gray-300 rounded-lg mr-4"></div>
      <div className="flex-1">
        <div className="space-y-2 mb-4">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
        <div className="h-8 bg-gray-300 rounded w-20 mt-7"></div>
      </div>
    </div>
    <div className="flex flex-col items-end justify-around px-4">
      <div className="h-6 bg-gray-300 rounded w-20"></div>
      <div className="flex items-center border border-gray-300 rounded-lg">
        <div className="w-10 h-10 bg-gray-300 rounded"></div>
        <div className="w-12 h-10 bg-gray-300 mx-2 rounded"></div>
        <div className="w-10 h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

const CartSummarySkeleton = () => (
  <div className="lg:bg-white lg:p-5 lg:shadow-sm py-1 lg:h-fit flex-2 lg:rounded-lg animate-pulse">
    <div className="border-t lg:border-none border-gray-200 pt-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-gray-300 rounded w-20"></div>
        <div className="h-5 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-5 bg-gray-300 rounded w-20"></div>
        <div className="h-5 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="flex justify-between pt-2 border-t border-gray-200">
        <div className="h-6 bg-gray-300 rounded w-16"></div>
        <div className="h-6 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
    <div className="w-full h-14 bg-gray-300 rounded-lg mt-4"></div>
  </div>
);

const EmptyCartSkeleton = () => (
  <div className="flex-5 flex gap-5 p-4 flex-col bg-white lg:rounded-lg animate-pulse">
    {[...Array(3)].map((_, index) => (
      <div key={index}>
        <CartItemSkeletonMobile />
        <CartItemSkeletonDesktop />
        {index < 2 && <hr className="mx-2 border-[#dee2e6] my-4" />}
      </div>
    ))}
    <hr className="mx-2 border-[#dee2e6] hidden lg:block" />
    <div className="justify-between hidden lg:flex">
      <div className="h-10 bg-gray-300 rounded w-32"></div>
      <div className="h-10 bg-gray-300 rounded w-24"></div>
    </div>
  </div>
);

// Loyalty Wallet Section Component
const LoyaltyWalletSection = ({ walletBalance, walletAmountToUse, onWalletAmountChange, totalAmount, disabled }) => {
  const balance = walletBalance?.balance ?? 0;
  const maxUsable = Math.min(balance, totalAmount);

  const handleChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    const clamped = Math.max(0, Math.min(val, maxUsable));
    onWalletAmountChange(clamped);
  };

  const handleUseAll = () => {
    onWalletAmountChange(maxUsable);
  };

  const handleClear = () => {
    onWalletAmountChange(0);
  };

  if (balance <= 0) return null;

  return (
    <div className="rounded-xl border-2 border-[#C5A059]/30 bg-gradient-to-r from-[#FDF2F5] to-[#FFFBF2] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#C5A059]/10 border-b border-[#C5A059]/20">
        <Wallet className="w-4 h-4 text-[#C5A059]" />
        <span className="text-sm font-bold text-[#4A041D]">Loyalty Cüzdanı</span>
        <span className="ml-auto text-sm font-semibold text-[#C5A059]">Balans: {balance.toFixed(2)} AZN</span>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-500">Sifarişdən çıxılacaq məbləği daxil edin (maks: {maxUsable.toFixed(2)} AZN)</p>
        <div className="flex flex-col md:flex-row gap-2 md:items-center items-start">
          <div className="relative flex-1">
            <input
              type="number"
              min="0"
              max={maxUsable}
              step="0.01"
              value={walletAmountToUse === 0 ? '' : walletAmountToUse}
              onChange={handleChange}
              disabled={disabled}
              placeholder="0.00"
              className="w-full px-4 py-2.5 mb-3 min-w-[150px] md:mb-0 border-2 border-[#C5A059]/30 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">AZN</span>
          </div>
          {walletAmountToUse > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="px-3 py-2.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Sıfırla
            </button>
          ) : (
            <button
              type="button"
              onClick={handleUseAll}
              disabled={disabled}
              className="px-3 py-2.5 text-xs font-semibold text-[#C5A059] border border-[#C5A059]/40 rounded-lg hover:bg-[#C5A059]/10 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Hamısını istifadə et
            </button>
          )}
        </div>
        {walletAmountToUse > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Cüzdandan çıxılacaq:</span>
            <span className="font-bold text-[#C5A059]">- {walletAmountToUse.toFixed(2)} AZN</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Checkout Modal Component
const CheckoutModal = ({ isOpen, onClose, cartItems, onSubmit, isSubmitting, isSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    notes: ''
  });
  const [walletAmountToUse, setWalletAmountToUse] = useState(0);
  const [error, setError] = useState('');

  const { data: walletBalance } = useGetWalletBalanceQuery(undefined, { skip: !isOpen });

  if (!isOpen) return null;

  const cartTotal = cartItems?.finalAmount || cartItems?.totalAmount || 0;
  const finalPayable = Math.max(0, cartTotal - walletAmountToUse);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError('Zəhmət olmasa tam adınızı daxil edin');
      return false;
    }
    if (!formData.customerPhone.trim()) {
      setError('Zəhmət olmasa telefon nömrənizi daxil edin');
      return false;
    }
    if (!formData.customerEmail.trim()) {
      setError('Zəhmət olmasa e-poçt ünvanınızı daxil edin');
      return false;
    }
    if (!formData.shippingAddress.trim()) {
      setError('Zəhmət olmasa çatdırılma ünvanınızı daxil edin');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({ ...formData, walletAmountToUse });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        shippingAddress: '',
        notes: ''
      });
      setWalletAmountToUse(0);
      setError('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[9999] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FDF2F5] rounded-xl">
              <ShoppingBag className="w-5 h-5 text-[#4A041D]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#4A041D]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Sifarişi rəsmiləşdir</h3>
              <p className="text-xs text-gray-500">Çatdırılma məlumatlarınızı daxil edin</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Cart Items Preview */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4 max-h-44 overflow-y-auto">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Sifariş xülasəsi ({cartItems?.items?.length || 0} məhsul)
            </h4>
            <div className="space-y-2">
              {cartItems?.items?.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-white p-2 rounded-lg">
                  <img
                    src={`${API_BASE_URL}${item?.productImageUrl}`}
                    alt={item?.productName}
                    className="w-10 h-10 object-contain rounded bg-gray-50 p-1"
                    onError={(e) => { e.target.src = "/Icons/logo.jpeg" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                    <p className="text-xs text-gray-500">Sayı: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {(item.unitPrice * item.quantity).toFixed(2)} AZN
                  </span>
                </div>
              ))}
              {cartItems?.items?.length > 3 && (
                <p className="text-sm text-gray-500 text-center py-1">
                  +{cartItems.items.length - 3} daha çox məhsul
                </p>
              )}
            </div>
          </div>

          {/* Form - Two column on desktop */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Personal Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-[#4A041D] text-sm border-b border-gray-100 pb-2 uppercase tracking-wide">
                  Şəxsi Məlumatlar
                </h4>

                <div className="space-y-1">
                  <label htmlFor="customerName" className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Ad və Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    disabled={isSubmitting || isSuccess}
                    placeholder="Ad və soyadınızı daxil edin"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#4A041D] outline-none transition-all disabled:cursor-not-allowed text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="customerPhone" className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Telefon nömrəsi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    disabled={isSubmitting || isSuccess}
                    placeholder="+994 XX XXX XX XX"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#4A041D] outline-none transition-all disabled:cursor-not-allowed text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="customerEmail" className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    E-poçt ünvanı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    disabled={isSubmitting || isSuccess}
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#4A041D] outline-none transition-all disabled:cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              {/* Right Column - Shipping Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-[#4A041D] text-sm border-b border-gray-100 pb-2 uppercase tracking-wide">
                  Çatdırılma Məlumatları
                </h4>

                <div className="space-y-1">
                  <label htmlFor="shippingAddress" className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Çatdırılma ünvanı <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    disabled={isSubmitting || isSuccess}
                    placeholder="Çatdırılma ünvanınızı daxil edin"
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#4A041D] outline-none transition-all disabled:cursor-not-allowed resize-none text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="notes" className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Sifariş qeydləri
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    disabled={isSubmitting || isSuccess}
                    placeholder="Çatdırılma üçün hər hansı xüsusi qeydiniz?"
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#4A041D] outline-none transition-all disabled:cursor-not-allowed resize-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Loyalty Wallet */}
            <div className="pt-2">
              <LoyaltyWalletSection
                walletBalance={walletBalance}
                walletAmountToUse={walletAmountToUse}
                onWalletAmountChange={setWalletAmountToUse}
                totalAmount={cartTotal}
                disabled={isSubmitting || isSuccess}
              />
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Order Summary */}
            <div className="mt-5 p-4 bg-gray-50 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Məbləğ:</span>
                <span>{(cartItems?.totalPriceBeforeDiscount || 0).toFixed(2)} AZN</span>
              </div>
              {(cartItems?.totalDiscount || 0) > 0 && (
                <div className="flex items-center justify-between text-sm text-[#C5A059]">
                  <span>Endirim:</span>
                  <span>- {(cartItems?.totalDiscount || 0).toFixed(2)} AZN</span>
                </div>
              )}
              {(cartItems?.promoCodeDiscountAmount || 0) > 0 && (
                <div className="flex items-center justify-between text-sm text-green-600">
                  <span>Promo endirim ({cartItems.appliedPromoCode}):</span>
                  <span>- {(cartItems?.promoCodeDiscountAmount || 0).toFixed(2)} AZN</span>
                </div>
              )}
              {walletAmountToUse > 0 && (
                <div className="flex items-center justify-between text-sm text-[#C5A059]">
                  <span>Loyalty cüzdanı:</span>
                  <span>- {walletAmountToUse.toFixed(2)} AZN</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900">Ödəniləcək məbləğ:</span>
                <span className="text-2xl font-black text-[#4A041D]">
                  {finalPayable.toFixed(2)} AZN
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full mt-5 py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${isSuccess
                ? 'bg-green-500 text-white cursor-default'
                : isSubmitting
                  ? 'bg-[#4A041D] opacity-70 text-white cursor-not-allowed'
                  : 'bg-[#4A041D] hover:bg-[#6D082D] text-white cursor-pointer shadow-lg transform active:scale-[0.98]'
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gözləyin...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  Sifariş uğurla yerləşdirildi!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Sifarişi tamamla
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const InstallmentModal = ({ isOpen, onClose, amount, cartItems, onSubmit, isSubmitting, user }) => {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [step, setStep] = useState(1); // 1: Options, 2: Calculation/Form
  const [walletAmountToUse, setWalletAmountToUse] = useState(0);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    notes: ''
  });

  const { data: walletBalance } = useGetWalletBalanceQuery(undefined, { skip: !isOpen });

  const { data: options, isLoading: isOptionsLoading } = useGetInstallmentOptionsQuery(amount, { skip: !isOpen });
  const { data: calculation, isLoading: isCalculating } = useCalculateInstallmentQuery(
    { amount, optionId: selectedOptionId },
    { skip: !selectedOptionId || step !== 2 }
  );

  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.fullName || '',
        customerEmail: user.email || '',
        customerPhone: user.phoneNumber || ''
      }));
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedOptionId(null);
      setWalletAmountToUse(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOptionSelect = (id) => {
    setSelectedOptionId(id);
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.shippingAddress || !formData.customerEmail) {
      toast.error('Zəhmət olmasa tələb olunan xanaları doldurun');
      return;
    }
    onSubmit({ ...formData, installmentOptionId: selectedOptionId, walletAmountToUse });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FDF2F5] rounded-xl">
              <CreditCard className="w-6 h-6 text-[#4A041D]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#4A041D]">Hissə-hissə ödəniş</h3>
              <p className="text-xs text-gray-500">Bank seçimi edin və şərtlərlə tanış olun</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto">
          {step === 1 ? (
            <div className="p-6 space-y-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mövcud Bank Seçimləri</h4>
              {isOptionsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-10 h-10 animate-spin text-[#4A041D]" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {options?.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className="group flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#4A041D] transition-all hover:shadow-lg text-left h-full"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-[#4A041D] group-hover:bg-[#4A041D] group-hover:text-white transition-colors uppercase flex-shrink-0">
                          {option.bankName.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-[#4A041D] transition-colors">{option.bankName}</p>
                          <p className="text-sm text-gray-500">{option.installmentPeriod} ay / {option.interestPercentage}% faiz</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#4A041D] transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm text-[#4A041D] font-semibold mb-6 hover:underline"
              >
                <ArrowLeft size={16} /> Bank seçimini dəyiş
              </button>

              {isCalculating ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-10 h-10 animate-spin text-[#4A041D]" />
                </div>
              ) : calculation && (
                <div className="space-y-6">
                  {/* Calculation Summary */}
                  <div className="bg-[#4A041D] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Calculator size={80} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm opacity-80 mb-1">Aylıq ödəniş</p>
                      <h4 className="text-4xl font-black mb-4">{calculation.monthlyPayment.toFixed(2)} ₼</h4>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        <div>
                          <p className="text-[10px] opacity-60 uppercase">Ümumi məbləğ</p>
                          <p className="font-bold">{calculation.totalAmount.toFixed(2)} ₼</p>
                        </div>
                        <div>
                          <p className="text-[10px] opacity-60 uppercase">Faiz məbləği</p>
                          <p className="font-bold">{calculation.interestAmount.toFixed(2)} ₼</p>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-4 text-[11px] opacity-70 font-medium">
                        <span className="bg-white/10 px-2 py-1 rounded">Müddət: {calculation.installmentPeriod} ay</span>
                        <span className="bg-white/10 px-2 py-1 rounded">Faiz: {calculation.interestPercentage}%</span>
                        <span className="bg-white/10 px-2 py-1 rounded">Əsas: {calculation.originalAmount.toFixed(2)} ₼</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Məlumatları tamamlayın</h4>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 ml-1">AD SOYAD</label>
                        <input
                          required
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#4A041D] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 ml-1">TELEFON</label>
                        <input
                          required
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          placeholder="+994"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#4A041D] outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 ml-1">E-POÇT ÜNVANI</label>
                        <input
                          required
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          placeholder="example@mail.com"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#4A041D] outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 ml-1">ÇATDIRILMA ÜNVANI</label>
                        <textarea
                          required
                          name="shippingAddress"
                          value={formData.shippingAddress}
                          onChange={handleInputChange}
                          rows="2"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#4A041D] outline-none transition-all resize-none"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 ml-1">SİFARİŞ QEYDLƏRİ</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          rows="2"
                          placeholder="Hər hansı əlavə qeydiniz..."
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#4A041D] outline-none transition-all resize-none"
                        />
                      </div>

                      {/* Loyalty Wallet */}
                      <div className="md:col-span-2">
                        <LoyaltyWalletSection
                          walletBalance={walletBalance}
                          walletAmountToUse={walletAmountToUse}
                          onWalletAmountChange={setWalletAmountToUse}
                          totalAmount={amount}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {walletAmountToUse > 0 && (
                      <div className="flex items-center justify-between text-sm text-[#C5A059] px-1">
                        <span>Loyalty endirimindən sonra:</span>
                        <span className="font-bold">{Math.max(0, (calculation?.totalAmount || amount) - walletAmountToUse).toFixed(2)} AZN</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#C5A059] text-white font-black rounded-2xl shadow-lg hover:bg-[#A68648] transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "ÖDƏNİŞİ TƏSDİQLƏ"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const { data: installmentConfig } = useGetInstallmentConfigurationQuery();
  const [localCart, setLocalCart] = useState({
    items: [],
    totalPriceBeforeDiscount: 0,
    totalDiscount: 0,
    totalAmount: 0
  });

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrderSubmitting, setIsOrderSubmitting] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [unauthorizedAction, setUnauthorizedAction] = useState("");

  const { data: cartItemsD, isLoading: apiLoading, isError } = useGetCartItemsQuery(undefined, {
    skip: !isAuthenticated
  });

  const { data: me } = useGetMeQuery();
  const [updateCartItemQuantity] = useUpdateCartItemQuantityMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [removeCart] = useRemoveCartMutation();
  const [initiatePayment] = useInitiatePaymentMutation();
  const [applyPromo] = useApplyPromoCartMutation();
  const [removePromo] = useRemovePromoCartMutation();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isRemovingPromo, setIsRemovingPromo] = useState(false);

  const [removingItems, setRemovingItems] = useState(new Set());
  const [isRemovingCart, setIsRemovingCart] = useState(false);
  const [localQuantities, setLocalQuantities] = useState({});
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    const authStatus = AuthUtils.isAuthenticated();
    setIsAuthenticated(authStatus);

    if (!authStatus) {
      setLocalCart(CartUtils.getCart());
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      const handleCartUpdate = (e) => {
        setLocalCart(e.detail);
      };

      window.addEventListener('cartUpdated', handleCartUpdate);
      return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }
  }, [isAuthenticated]);

  const cartItems = isAuthenticated ? cartItemsD : localCart;
  const isLoading = isAuthenticated ? apiLoading : false;



  const handleCheckoutSubmit = async (formData) => {
    setIsOrderSubmitting(true);

    try {
      const paymentPayload = {
        customerName: formData?.customerName || me?.fullName,
        customerEmail: formData?.customerEmail || me?.email,
        customerPhone: formData?.customerPhone.replace(/\D/g, '') || me?.phoneNumber,
        shippingAddress: formData?.shippingAddress,
        notes: formData?.notes || '',
        installmentOptionId: null,
        walletAmountToUse: formData?.walletAmountToUse || 0
      };
      const response = await initiatePayment(paymentPayload).unwrap();

      if (response.redirect_url) {
        setIsOrderSuccess(true);
        setTimeout(() => {
          window.location.href = response.redirect_url;
        }, 1000);
      }

    } catch (error) {
      console.error('❌ Payment Initiation Error:', error);
      toast.error(error?.data?.message || 'Ödəniş başlana bilmədi. Zəhmət olmasa yenidən cəhd edin.');
      setIsOrderSubmitting(false);
    }
  };

  const debouncedUpdate = useMemo(
    () => debounce(async (cartItemId, quantity) => {
      if (!isAuthenticated) return;

      try {
        setUpdatingItems(prev => new Set(prev).add(cartItemId));
        await updateCartItemQuantity({ cartItemId, quantity }).unwrap();
      } catch (error) {
        console.error('Failed to update cart item:', error);
        setLocalQuantities(prev => {
          const newState = { ...prev };
          delete newState[cartItemId];
          return newState;
        });
      } finally {
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });
      }
    }, 500),
    [updateCartItemQuantity, isAuthenticated]
  );

  useEffect(() => {
    if (isAuthenticated && cartItemsD?.items) {
      setLocalQuantities(prev => {
        const newState = { ...prev };
        let hasChanges = false;

        cartItemsD.items.forEach(item => {
          if (newState[item.id] === item.quantity) {
            delete newState[item.id];
            hasChanges = true;
          }
        });

        return hasChanges ? newState : prev;
      });
    }
  }, [cartItemsD, isAuthenticated]);

  const getEffectiveQuantity = useCallback((item) => {
    return localQuantities[item.id] !== undefined ? localQuantities[item.id] : item.quantity;
  }, [localQuantities]);

  const handleQuantityChange = useCallback((item, newQuantity) => {
    if (newQuantity < 1) return;

    if (isAuthenticated) {
      setLocalQuantities(prev => ({
        ...prev,
        [item.id]: newQuantity
      }));
      debouncedUpdate(item.id, newQuantity);
    } else {
      const updatedCart = CartUtils.updateQuantity(item.id, newQuantity);
      setLocalCart(updatedCart);
    }
  }, [isAuthenticated, debouncedUpdate]);

  const handleIncrement = useCallback((item) => {
    const currentQuantity = getEffectiveQuantity(item);
    handleQuantityChange(item, currentQuantity + 1);
  }, [getEffectiveQuantity, handleQuantityChange]);

  const handleDecrement = useCallback((item) => {
    const currentQuantity = getEffectiveQuantity(item);
    if (currentQuantity > 1) {
      handleQuantityChange(item, currentQuantity - 1);
    }
  }, [getEffectiveQuantity, handleQuantityChange]);

  const handleRemoveItem = async (id) => {
    try {
      setRemovingItems(prev => new Set(prev).add(id));

      if (isAuthenticated) {
        await removeCartItem({ id }).unwrap();
      } else {
        const updatedCart = CartUtils.removeItem(id);
        setLocalCart(updatedCart);
      }

    } catch (error) {
      console.error('Failed to remove cart item:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleRemoveCart = async () => {
    try {
      setIsRemovingCart(true);

      if (isAuthenticated) {
        await removeCart().unwrap();
      } else {
        CartUtils.clearCart();
        setLocalCart({
          items: [],
          totalPriceBeforeDiscount: 0,
          totalDiscount: 0,
          totalAmount: 0
        });
      }

    } catch (error) {
      console.error('Failed to remove cart:', error);
    } finally {
      setIsRemovingCart(false);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    try {
      setIsApplyingPromo(true);
      await applyPromo({ promoCode: promoCodeInput }).unwrap();
      toast.success('Promo kod tətbiq edildi!');
      setPromoCodeInput('');
    } catch (error) {
      toast.error(error?.data?.message || 'Yanlış promo kod');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = async () => {
    try {
      setIsRemovingPromo(true);
      await removePromo().unwrap();
      toast.success('Promo kod silindi');
    } catch (error) {
      toast.error('Promo kodu silmək mümkün olmadı');
    } finally {
      setIsRemovingPromo(false);
    }
  };

  const handleOrderCompletion = () => {
    if (isAuthenticated) {
      setIsCheckoutModalOpen(true);
    } else {
      setUnauthorizedAction("Sifarişi tamamlamaq");
      setShowUnauthorizedModal(true);
    }
  };

  if (isError) {
    return (
      <section className="inter bg-[#f7fafc] min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Səbəti yükləmək mümkün olmadı</h2>
          <p className="text-gray-600">Zəhmət olmasa bir az sonra yenidən cəhd edin.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FCFCFC] min-h-[80vh] font-sans pb-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="lg:hidden px-4 md:px-8 py-4 bg-white mb-4">
        <Breadcrumb />
      </div>

      <div className="min-h-[80vh] lg:max-w-[98vw] lg:mx-auto border-none lg:border-0">
        <div className='p-4 pl-7 pb-0 hidden lg:block'>
          <Breadcrumb />
        </div>

        <div className="p-4 md:px-8 text-2xl font-bold bg-transparent border-none mb-6 text-[#4A041D]">
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          ) : (
            <h1>Səbətim <span className="text-gray-400 font-normal text-lg">({cartItems?.items?.length || 0} məhsul)</span></h1>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 px-4 md:px-8">
          {isLoading ? (
            <>
              <EmptyCartSkeleton />
              <CartSummarySkeleton />
            </>
          ) : (
            <>
              <div className='flex-5 flex gap-5 p-4 flex-col bg-white lg:rounded-2xl shadow-sm'>
                {cartItems?.items?.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Səbətiniz boşdur</h3>
                    <p className="text-gray-600">Alış-verişə başlamaq üçün məhsul əlavə edin</p>
                  </div>
                ) : (
                  cartItems?.items?.map((item, index) => {
                    const effectiveQuantity = getEffectiveQuantity(item);
                    const isItemUpdating = updatingItems.has(item.id);
                    const isItemRemoving = removingItems.has(item.id);

                    return (
                      <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 mb-4">
                        {/* Mobile View */}
                        <div className="lg:hidden space-y-4">
                          <div className="flex gap-4">
                            <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                              <img
                                className='w-full h-full object-contain'
                                src={`${API_BASE_URL}${item?.productImageUrl}`}
                                alt={item?.productName || 'Product'}
                                onError={(e) => {
                                  e.target.src = "/Icons/logo.jpeg"
                                }}
                              />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                              <div>
                                <h3 className="font-semibold !text-sm text-[#4A041D] line-clamp-2 leading-tight mb-1">
                                  {item.productName}
                                </h3>
                              </div>
                              <div className="flex justify-between items-end">
                                <span className="font-bold text-sm text-[#C5A059]">
                                  {(item.unitPrice * effectiveQuantity).toFixed(2)} ₼
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                            <div className="flex items-center bg-gray-50 rounded-lg p-1">
                              <button
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:text-[#4A041D] disabled:opacity-50 transition-colors"
                                onClick={() => handleDecrement(item)}
                                disabled={effectiveQuantity <= 1 || isItemUpdating || isItemRemoving}
                              >
                                <Minus size={14} />
                              </button>
                              <span className={`w-8 text-center font-medium text-gray-900 ${isItemUpdating ? 'opacity-50' : ''}`}>
                                {effectiveQuantity}
                              </span>
                              <button
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:text-[#4A041D] disabled:opacity-50 transition-colors"
                                onClick={() => handleIncrement(item)}
                                disabled={isItemUpdating || isItemRemoving}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 hover:bg-red-50 rounded-lg"
                              disabled={isItemRemoving || isItemUpdating}
                              title="Sil"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Desktop View */}
                        <div className='hidden lg:flex items-center gap-6'>
                          <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center border border-gray-100">
                            <img
                              className="w-full h-full object-contain"
                              src={`${API_BASE_URL}${item?.productImageUrl}`}
                              alt={item?.productName || "Product"}
                              onError={(e) => {
                                e.currentTarget.src = "/Icons/logo.jpeg";
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-[#4A041D] mb-1 line-clamp-1">
                              {item.productName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.productSku && `SKU: ${item.productSku}`}
                            </p>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center bg-gray-50 rounded-lg p-1 mx-8">
                            <button
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:text-[#4A041D] disabled:opacity-50 transition-colors"
                              onClick={() => handleDecrement(item)}
                              disabled={effectiveQuantity <= 1 || isItemUpdating || isItemRemoving}
                            >
                              <Minus size={14} />
                            </button>
                            <span className={`w-12 text-center font-medium text-gray-900 ${isItemUpdating ? 'opacity-50' : ''}`}>
                              {effectiveQuantity}
                            </span>
                            <button
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-600 shadow-sm hover:text-[#4A041D] disabled:opacity-50 transition-colors"
                              onClick={() => handleIncrement(item)}
                              disabled={isItemUpdating || isItemRemoving}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="w-32 text-right">
                            <div className="text-xl font-bold text-[#C5A059]">
                              {(item.unitPrice * effectiveQuantity).toFixed(2)} ₼
                            </div>
                            {effectiveQuantity > 1 && (
                              <div className="text-xs text-gray-400 mt-1">
                                {item.unitPrice.toFixed(2)} ₼ / ədəd
                              </div>
                            )}
                          </div>

                          {/* Remove */}
                          <button
                            className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4 disabled:opacity-50'
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isItemRemoving || isItemUpdating}
                            title="Sil"
                          >
                            {(isItemRemoving) ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}

                {cartItems?.items?.length > 0 && (
                  <>
                    <hr className="mx-2 border-[#dee2e6] hidden lg:block" />
                    <div className='justify-between hidden lg:flex'>
                      <Link to='/' className='flex items-center gap-2 text-white bg-black inter p-2 rounded-lg'>
                        <ArrowLeft size={20} />
                        <p>Mağazaya qayıt</p>
                      </Link>
                      <button
                        onClick={() => handleRemoveCart()}
                        className='px-3 bg-white hover:bg-gray-100 cursor-pointer text-red-500 rounded-lg border-1 border-[#bfc2c6] disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isRemovingCart}
                      >
                        {isRemovingCart ? "Hamısı silinir..." : "Hamısını sil"}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className='bg-white p-6 shadow-sm rounded-2xl h-fit border border-gray-100'>
                <div className="border-b border-gray-100 pb-6 space-y-4">
                  <div className="flex justify-between text-gray-600 text-base font-medium">
                    <span>Məbləğ:</span>
                    <span>{(cartItems?.totalPriceBeforeDiscount || 0).toFixed(2)} AZN</span>
                  </div>
                  {(cartItems?.totalDiscount || 0) > 0 && (
                    <div className="flex justify-between text-[#C5A059] text-base font-medium">
                      <span>Endirim:</span>
                      <span>- {(cartItems?.totalDiscount || 0).toFixed(2)} AZN</span>
                    </div>
                  )}

                  {/* Promo Code Section */}
                  {isAuthenticated && (
                    <div className="pt-2">
                      {!cartItems?.appliedPromoCode ? (
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Promo kod daxil edin"
                              value={promoCodeInput}
                              onChange={(e) => setPromoCodeInput(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg min-w-[150px] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A041D]"
                            />
                          </div>
                          <button
                            onClick={handleApplyPromo}
                            disabled={isApplyingPromo || !promoCodeInput.trim()}
                            className="px-4 py-2 bg-[#4A041D] text-white rounded-lg text-sm font-semibold hover:bg-[#6D082D] transition-colors disabled:opacity-50"
                          >
                            {isApplyingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tətbiq et"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-xs text-green-600 font-bold uppercase">{cartItems?.appliedPromoCode}</p>
                              <p className="text-[10px] text-green-500">{cartItems?.promoCodeDiscountPercentage}% endirim tətbiq edildi</p>
                            </div>
                          </div>
                          <button
                            onClick={handleRemovePromo}
                            disabled={isRemovingPromo}
                            className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            {isRemovingPromo ? <Loader2 className="w-3 h-3 animate-spin text-green-600" /> : <X className="w-4 h-4 text-green-600" />}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {(cartItems?.promoCodeDiscountAmount || 0) > 0 && (
                    <div className="flex justify-between text-green-600 text-base font-medium">
                      <span>Promo endirim:</span>
                      <span>- {(cartItems?.promoCodeDiscountAmount || 0).toFixed(2)} AZN</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-bold text-[#4A041D] pt-4">
                    <span>Yekun məbləğ:</span>
                    <span>{(cartItems?.finalAmount || cartItems?.totalAmount || 0).toFixed(2)} AZN</span>
                  </div>
                </div>

                <button
                  onClick={handleOrderCompletion}
                  className="w-full mt-6 cursor-pointer bg-[#4A041D] hover:bg-[#6D082D] text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  disabled={!cartItems?.items?.length}
                >
                  <ShoppingCart size={20} />
                  <span>Sifarişi tamamla</span>
                </button>

                {installmentConfig?.isEnabled && (cartItems?.finalAmount || cartItems?.totalAmount || 0) >= installmentConfig?.minimumAmount && (
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        setIsInstallmentModalOpen(true);
                      } else {
                        setUnauthorizedAction("Hissə-hissə ödənişdən istifadə etmək");
                        setShowUnauthorizedModal(true);
                      }
                    }}
                    className="w-full mt-3 cursor-pointer bg-white border-2 border-[#4A041D] text-[#4A041D] hover:bg-[#FDF2F5] font-semibold py-4 px-6 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                    disabled={!cartItems?.items?.length}
                  >
                    <CreditCard size={20} />
                    <span>Hissə-hissə ödəniş</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <InstallmentModal
        isOpen={isInstallmentModalOpen}
        onClose={() => setIsInstallmentModalOpen(false)}
        amount={cartItems?.finalAmount || cartItems?.totalAmount || 0}
        cartItems={cartItems}
        user={me}
        onSubmit={async (formData) => {
          setIsOrderSubmitting(true);
          try {
            const payload = {
              customerName: formData.customerName,
              customerEmail: formData.customerEmail,
              customerPhone: formData.customerPhone.replace(/\D/g, ''),
              shippingAddress: formData.shippingAddress,
              notes: formData.notes || '',
              installmentOptionId: formData.installmentOptionId,
              walletAmountToUse: formData.walletAmountToUse || 0
            };
            const response = await initiatePayment(payload).unwrap();
            if (response.redirect_url) {
              setIsOrderSuccess(true);
              setTimeout(() => {
                window.location.href = response.redirect_url;
              }, 1000);
            }
          } catch (error) {
            toast.error(error?.data?.message || 'Xəta baş verdi');
            setIsOrderSubmitting(false);
          }
        }}
        isSubmitting={isOrderSubmitting}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => {
          if (!isOrderSubmitting) {
            setIsCheckoutModalOpen(false);
          }
        }}
        cartItems={cartItems}
        onSubmit={handleCheckoutSubmit}
        isSubmitting={isOrderSubmitting}
        isSuccess={isOrderSuccess}
      />

      <UnauthorizedModal
        isOpen={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        action={unauthorizedAction}
      />
    </section>
  );
};

export default Cart;