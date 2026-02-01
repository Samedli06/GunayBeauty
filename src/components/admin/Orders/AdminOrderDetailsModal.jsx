import React, { useState } from 'react';
import { X, Package, Clock, MapPin, CreditCard, ShoppingBag, User, Mail, Phone, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminOrderDetailsModal = ({ order, isOpen, onClose }) => {
    const { t } = useTranslation();

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-[#1f1f1f] border border-gray-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#2c2c2c] text-white">
                    <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-[#C5A059]" />
                        <div>
                            <h2 className="text-lg font-bold font-sans">
                                Sifariş Detalları
                            </h2>
                            <p className="text-xs text-gray-400">#{order.orderNumber || order.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#2c2c2c] p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Tarix</p>
                                <p className="text-sm font-bold text-white">{new Date(order.createdAt).toLocaleString('az-AZ')}</p>
                            </div>
                        </div>
                        <div className="bg-[#2c2c2c] p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Məbləğ</p>
                                <p className="text-sm font-bold text-[#C5A059]">{order.totalAmount?.toFixed(2)} AZN</p>
                            </div>
                        </div>
                        <div className="bg-[#2c2c2c] p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                            <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Status</p>
                                <p className="text-sm font-bold text-white uppercase">{order.status}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Customer Information */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-4 h-4 text-[#C5A059]" />
                                Müştəri Məlumatları
                            </h3>
                            <div className="bg-[#2c2c2c] border border-gray-800 rounded-xl p-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase">Ad Soyad</p>
                                        <p className="text-sm text-white font-medium">{order.customerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase">E-poçt</p>
                                        <p className="text-sm text-white font-medium">{order.customerEmail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase">Telefon</p>
                                        <p className="text-sm text-white font-medium">{order.customerPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment & Shipping Details */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#C5A059]" />
                                Çatdırılma və Ödəniş
                            </h3>
                            <div className="bg-[#2c2c2c] border border-gray-800 rounded-xl p-4 space-y-4">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase mb-1">Ünvan</p>
                                    <p className="text-sm text-white leading-relaxed">{order.shippingAddress || 'Qeyd edilməyib'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase mb-1">Sifariş Qeydi</p>
                                    <p className="text-sm text-gray-400 italic">"{order.notes || 'Heç bir qeyd yoxdur'}"</p>
                                </div>
                                <div className="pt-2 border-t border-gray-700">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Ödəniş Üsulu</span>
                                        <span className="text-white font-bold">{order.payment?.paymentMethod || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mt-1">
                                        <span className="text-gray-500">Tranzaksiya ID</span>
                                        <span className="text-xs text-gray-400 font-mono">{order.payment?.epointTransactionId || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                            Məhsullar ({order.items?.length || 0})
                        </h3>
                        <div className="bg-[#2c2c2c] border border-gray-800 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#333] text-gray-400 uppercase text-[10px] tracking-widest font-bold">
                                    <tr>
                                        <th className="px-4 py-3">Məhsul</th>
                                        <th className="px-4 py-3">SKU</th>
                                        <th className="px-4 py-3 text-center">Say</th>
                                        <th className="px-4 py-3 text-right">Qiymət</th>
                                        <th className="px-4 py-3 text-right">Cəmi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {order.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-4">
                                                <span className="text-white font-medium">{item.productName}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-xs text-gray-500 font-mono">{item.productSku}</span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="text-white bg-gray-700 px-2 py-0.5 rounded text-xs">{item.quantity}</span>
                                            </td>
                                            <td className="px-4 py-4 text-right text-gray-400">
                                                {item.unitPrice?.toFixed(2)} AZN
                                            </td>
                                            <td className="px-4 py-4 text-right text-[#C5A059] font-bold">
                                                {item.totalPrice?.toFixed(2)} AZN
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-[#262626]">
                                    {order.subtotal > 0 && order.subtotal !== order.totalAmount && (
                                        <>
                                            <tr className="text-gray-400">
                                                <td colSpan="4" className="px-4 py-2 text-right text-[10px] uppercase tracking-widest border-b border-gray-800">
                                                    Ara Cəmi
                                                </td>
                                                <td className="px-4 py-2 text-right text-sm">
                                                    {order.subtotal?.toFixed(2)} AZN
                                                </td>
                                            </tr>
                                            {order.discountAmount > 0 && (
                                                <tr className="text-red-500">
                                                    <td colSpan="4" className="px-4 py-2 text-right text-[10px] uppercase tracking-widest border-b border-gray-800">
                                                        Endirim {order.promoCode ? `(${order.promoCode})` : ''}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-sm font-bold">
                                                        -{order.discountAmount?.toFixed(2)} AZN
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    )}
                                    <tr className="text-white font-bold">
                                        <td colSpan="4" className="px-4 py-4 text-right uppercase tracking-widest text-[10px] text-gray-500">
                                            Yekun Məbləğ
                                        </td>
                                        <td className="px-4 py-4 text-right text-lg text-[#C5A059]">
                                            {order.totalAmount?.toFixed(2)} AZN
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-800 bg-[#2c2c2c] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                        Bağla
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-2 bg-[#C5A059] text-white rounded-lg text-sm font-medium hover:bg-[#a6864a] transition-colors"
                    >
                        Çap et
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailsModal;
