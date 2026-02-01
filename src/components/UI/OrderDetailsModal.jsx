import React from 'react';
import { X, Package, Clock, MapPin, CreditCard, ShoppingBag, ChevronRight } from 'lucide-react';
import { useGetOrderQuery } from '../../store/API';
import { useTranslation } from 'react-i18next';

const OrderDetailsModal = ({ orderId, isOpen, onClose }) => {
    const { t } = useTranslation();
    const { data: order, isLoading, error } = useGetOrderQuery(orderId, {
        skip: !orderId || !isOpen,
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#4A041D] text-white">
                    <div className="flex items-center gap-3">
                        <Package className="w-6 h-6" />
                        <div>
                            <h2 className="text-lg font-bold font-sans">
                                {t('orderDetails')}
                            </h2>
                            <p className="text-xs opacity-80">#{orderId?.slice(0, 8)}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A041D]"></div>
                            <p className="mt-4 text-gray-500 font-sans">{t('loading')}</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-500 font-sans">{t('errorLoadingOrders')}</p>
                        </div>
                    ) : order ? (
                        <>
                            {/* Status & Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#FDFBF8] p-4 rounded-xl border border-[#F3E7E1] flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#4A041D]/5 rounded-full flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-[#4A041D]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">{t('orderDate')}</p>
                                        <p className="font-bold text-[#4A041D]">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="bg-[#FDFBF8] p-4 rounded-xl border border-[#F3E7E1] flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#4A041D]/5 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-[#4A041D]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">{t('payment.status')}</p>
                                        {(() => {
                                            const statusColors = {
                                                'Pending': 'bg-yellow-100 text-yellow-700',
                                                'PaymentInitiated': 'bg-indigo-100 text-indigo-700',
                                                'Paid': 'bg-green-100 text-green-700',
                                                'Processing': 'bg-purple-100 text-purple-700',
                                                'Shipped': 'bg-blue-100 text-blue-700',
                                                'Delivered': 'bg-teal-100 text-teal-700',
                                                'Cancelled': 'bg-red-100 text-red-700',
                                                'Refunded': 'bg-gray-100 text-gray-700',
                                                'Failed': 'bg-rose-100 text-rose-700',
                                            };
                                            return (
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                                    {order.status}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping & Payment Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#C5A059]" />
                                        {t('payment.shippingAddress')}
                                    </h3>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p className="font-medium text-gray-900">{order.fullName}</p>
                                        <p>{order.email}</p>
                                        <p>{order.phone}</p>
                                        <p className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-100 italic">
                                            {order.notes || t('noSpecificNotes')}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-[#C5A059]" />
                                        {t('paymentInfo')}
                                    </h3>
                                    <div className="bg-[#FDFBF8] p-4 rounded-xl border border-[#F3E7E1] text-sm">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">{t('payment.status')}</span>
                                            <span className="font-medium text-green-600">{order.status === 'Paid' ? t('payment.paid') : t('unpaid')}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">{t('orderMethod')}</span>
                                            <span className="font-medium uppercase">{order.type}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-[#F3E7E1] mt-2">
                                            <span className="font-bold text-[#4A041D]">{t('totalAmount')}</span>
                                            <span className="font-bold text-[#4A041D]">₼ {order.totalAmount?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-[#C5A059]" />
                                    {t('products')} ({order.items?.length || 0})
                                </h3>
                                <div className="space-y-3">
                                    {order.items?.map((item, idx) => {
                                        console.log(item)
                                        return (
                                            <div key={idx} className="flex items-center gap-4 p-3 bg-white border border-[#F3E7E1] rounded-xl hover:border-[#C5A059]/30 transition-all">
                                                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={`https://kozmetik-001-site1.qtempurl.com/${item.product?.primaryImageUrl}`}
                                                        alt={item.product?.name}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => { e.target.src = '/Icons/logo.jpeg'; }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-[#4A041D] truncate">{item.product?.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {t('quantityShort')}: {item.quantity} · ₼ {item.unitPrice?.toFixed(2)} / {t('unit')}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-bold text-[#C5A059]">₼ {(item.quantity * item.unitPrice).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#4A041D] text-white rounded-xl font-sans font-medium text-sm hover:bg-[#7d1733] transition-colors shadow-lg shadow-[#4A041D]/20"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
