import React, { useState } from 'react';
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from '../../store/API';
import { Loader2, Eye, ShoppingBag, User, Calendar, CreditCard, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, AlertCircle, Search, RefreshCw, CheckCheck, Undo2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import AdminOrderDetailsModal from '../../components/admin/Orders/AdminOrderDetailsModal';

const OrdersAdmin = () => {
    const { t } = useTranslation();

    const { data: ordersData, isLoading, isFetching } = useGetAdminOrdersQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');



    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateStatus({ id: orderId, status: parseInt(newStatus) }).unwrap();
            toast.success('Sifariş statusu yeniləndi');
        } catch (error) {
            toast.error(error?.data?.message || 'Statusu yeniləmək mümkün olmadı');
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
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
            case 'PaymentInitiated':
                return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            case 'Processing':
                return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'Delivered':
                return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
            case 'Refunded':
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            case 'Failed':
                return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
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
            case 'PaymentInitiated': return <CreditCard size={14} />;
            case 'Processing': return <RefreshCw size={14} />;
            case 'Delivered': return <CheckCheck size={14} />;
            case 'Refunded': return <Undo2 size={14} />;
            case 'Failed': return <AlertTriangle size={14} />;
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

    // Filter orders based on search query (client-side since API doesn't support it)
    const filteredOrders = (Array.isArray(ordersData) ? ordersData : []).filter(order => {
        const query = searchQuery.toLowerCase();
        return (
            order.customerName?.toLowerCase().includes(query) ||
            order.orderNumber?.toLowerCase().includes(query) ||
            order.id?.toLowerCase().includes(query) ||
            order.customerPhone?.includes(query)
        );
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Sifarişlər</h1>
                    <p className="text-gray-400">Mağaza üzərindən gələn bütün sifarişlərin idarə edilməsi</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Müştəri və ya Sifariş # axtar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#1f1f1f] border border-gray-800 text-white text-sm rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-[#C5A059] w-64 transition-all"
                    />
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
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-white font-mono font-bold">#{order.orderNumber || order.id.slice(0, 8)}</span>
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
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => handleViewDetails(order)}
                                                className="p-1.5 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-all"
                                                title="Detallara bax"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <select
                                                // value={statusMap[order.status] ?? order.status} // Complex matching, simplified below
                                                defaultValue=""
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                disabled={isUpdating}
                                                className="bg-[#2c2c2c] border border-gray-700 text-white text-xs rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#C5A059] transition-all disabled:opacity-50"
                                            >
                                                <option value="" disabled>Dəyişdir</option>
                                                <option value="0">Pending</option>
                                                <option value="1">Payment Initiated</option>
                                                <option value="2">Paid</option>
                                                <option value="3">Processing</option>
                                                <option value="4">Shipped</option>
                                                <option value="5">Delivered</option>
                                                <option value="6">Cancelled</option>
                                                <option value="7">Refunded</option>
                                                <option value="8">Failed</option>
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
            </div>

            <AdminOrderDetailsModal
                order={selectedOrder}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />
        </div>
    );
};

export default OrdersAdmin;
