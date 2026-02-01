import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { CheckCircle2, ChevronRight, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useGetOrderQuery, useRemoveCartMutation } from '../../../store/API';
import { useTranslation } from 'react-i18next';

const PaymentSuccess = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [removeCart] = useRemoveCartMutation();
    const [cartCleared, setCartCleared] = useState(false);

    // Filter params
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');
    const transactionId = searchParams.get('transactionId');

    const { data: order, isLoading, isError } = useGetOrderQuery(orderId, {
        skip: !orderId,
        pollingInterval: 3000,
    });
    console.log(order)

    useEffect(() => {
        if (order) {
            console.log("📝 Order status verified on success page:", order);
        }
        if (isError) {
            console.error("❌ Error verifying order status on success page");
        }
    }, [order, isError]);

    useEffect(() => {
        // If payment is confirmed as "Paid" on backend, clear the cart
        if (order?.status === 'Paid' && !cartCleared) {
            const clearCart = async () => {
                try {
                    // Clear API cart
                    await removeCart().unwrap();

                    // Clear local cart
                    localStorage.removeItem('ecommerce_cart');
                    window.dispatchEvent(new CustomEvent('cartUpdated', {
                        detail: { items: [], totalAmount: 0 }
                    }));

                    setCartCleared(true);
                } catch (err) {
                    console.error('Failed to clear cart:', err);
                }
            };
            clearCart();
        }
    }, [order, removeCart, cartCleared]);

    if (!orderId) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 mb-4">{t('payment.invalidOrder') || 'Invalid order information.'}</p>
                <Link to="/" className="flex items-center gap-2 text-[#4A041D] font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    {t('payment.backToHome') || 'Back to Home'}
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4 py-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header Decoration */}
                <div className="h-3 bg-[#C5A059]" />

                <div className="p-8 md:p-12">
                    <div className="flex flex-col items-center text-center">
                        {/* Success Icon */}
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 relative">
                            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-[#4A041D] mb-4">
                            {t('payment.successful') || 'Payment Successful!'}
                        </h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            {t('payment.successText') || 'Thank you! Your order has been placed successfully and is being processed.'}
                        </p>

                        {/* Order Details Card */}
                        <div className="w-full bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        {t('payment.orderId') || 'Order ID'}
                                    </p>
                                    <p className="font-bold text-[#4A041D]">#{orderId}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        {t('payment.transactionId') || 'Transaction ID'}
                                    </p>
                                    <p className="font-medium text-gray-700 truncate">{transactionId || '---'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        {t('payment.status') || 'Payment Status'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {isLoading ? (
                                            <div className="flex items-center gap-2 text-blue-500">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="font-bold">{t('payment.verifying') || 'Verifying...'}</span>
                                            </div>
                                        ) : order?.status === 'Paid' ? (
                                            <div className="flex items-center gap-2 text-green-500">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="font-bold">{t('payment.paid') || 'Paid'}</span>
                                            </div>
                                        ) : (
                                            <span className="font-bold text-orange-500">{order?.status || t('payment.processing') || 'Processing'}</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        {t('totalAmount') || 'Total Amount'}
                                    </p>
                                    <p className="font-bold text-[#4A041D]">
                                        {order?.totalAmount ? `${order.totalAmount.toFixed(2)} AZN` : '---'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <Link
                                to="/profile"
                                className="flex-1 bg-[#4A041D] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2D0212] transition-colors shadow-lg shadow-[#4a041d33]"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {t('payment.viewOrders') || 'View My Orders'}
                            </Link>
                            <Link
                                to="/"
                                className="flex-1 bg-white border-2 border-[#4A041D] text-[#4A041D] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#4A041D05] transition-colors"
                            >
                                {t('continueShopping') || 'Continue Shopping'}
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
