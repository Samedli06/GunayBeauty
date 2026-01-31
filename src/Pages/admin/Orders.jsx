import React, { useState } from 'react';
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from '../../store/API';
import { Loader2, Eye, ShoppingBag, User, Calendar, CreditCard, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const OrdersAdmin = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const pageSize = 15;

    const { data: ordersData, isLoading, isFetching } = useGetAdminOrdersQuery({
        page,
        pageSize
    });
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateStatus({ orderId, status: newStatus }).unwrap();
            toast.success('Sifariş statusu yeniləndi');
        } catch (error) {
            toast.error(error?.data?.message || 'Statusu yeniləmək mümkün olmadı');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Paid':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Cancelled':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Shipped':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Paid': return <CheckCircle size={14} />;
            case 'Pending': return <Clock size={14} />;
            case 'Cancelled': return <XCircle size={14} />;
            case 'Shipped': return <AlertCircle size={14} />;
            default: return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-[#C5A059]" />
            </div>
        );
    }

    const orders = ordersData?.items || [];
    const totalPages = ordersData?.totalPages || 1;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Sifarişlər</h1>
                    <p className="text-gray-400">Mağaza üzərindən gələn bütün sifarişlərin idarə edilməsi</p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#1f1f1f] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#2c2c2c] text-gray-300 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Sifariş ID</th>
                                <th className="px-6 py-4 font-semibold">Müştəri</th>
                                <th className="px-6 py-4 font-semibold">Tarix</th>
                                <th className="px-6 py-4 font-semibold">Məbləğ</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Əməliyyatlar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-white font-mono font-bold">#{order.id.slice(0, 8)}...</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{order.customerName || 'Naməlum'}</span>
                                                <span className="text-xs text-gray-500">{order.customerPhone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Calendar size={14} className="text-gray-500" />
                                                <span className="text-sm">
                                                    {new Date(order.createdAt).toLocaleDateString('az-AZ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[#C5A059] font-bold">
                                                {order.totalAmount?.toFixed(2)} AZN
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusStyle(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                disabled={isUpdating}
                                                className="bg-[#2c2c2c] border border-gray-700 text-white text-xs rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#C5A059] transition-all disabled:opacity-50"
                                            >
                                                <option value="Pending">Gözləmədə</option>
                                                <option value="Paid">Ödənilib</option>
                                                <option value="Shipped">Göndərilib</option>
                                                <option value="Cancelled">Ləğv edilib</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">
                                        Hələ ki, heç bir sifariş tapılmadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-[#2c2c2c] border-t border-gray-800 flex items-center justify-between">
                        <span className="text-sm text-gray-400 font-medium">
                            Səhifə {page} / {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || isFetching}
                                className="p-2 rounded-lg bg-[#1f1f1f] text-white hover:bg-[#3c3c3c] disabled:opacity-30 transition-all border border-gray-700"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || isFetching}
                                className="p-2 rounded-lg bg-[#1f1f1f] text-white hover:bg-[#3c3c3c] disabled:opacity-30 transition-all border border-gray-700"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersAdmin;
