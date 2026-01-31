import { Edit, Trash2, Calendar, Hash, Percent, Award } from "lucide-react";

const PromoCodeCard = ({ promoCode, onEdit, onDelete }) => {
    const isExpired = new Date(promoCode.expirationDate) < new Date();
    const usagePercentage = promoCode.usageLimit > 0
        ? (promoCode.currentUsageCount / promoCode.usageLimit) * 100
        : 0;

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative group">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-white tracking-wider font-mono">
                                {promoCode.code}
                            </span>
                            {promoCode.isActive ? (
                                isExpired ? (
                                    <span className="bg-red-900/50 text-red-200 text-xs px-2 py-1 rounded-full border border-red-700">
                                        Expired
                                    </span>
                                ) : (
                                    <span className="bg-green-900/50 text-green-200 text-xs px-2 py-1 rounded-full border border-green-700">
                                        Active
                                    </span>
                                )
                            ) : (
                                <span className="bg-gray-700 text-gray-400 text-xs px-2 py-1 rounded-full border border-gray-600">
                                    Inactive
                                </span>
                            )}
                        </div>
                        <p className="text-gray-400 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expires: {new Date(promoCode.expirationDate).toLocaleDateString()}
                        </p>
                    </div>

                </div>

                {/* Details */}
                <div className="space-y-4">
                    {/* Usage Stats */}
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Usage</span>
                            <span>{promoCode.currentUsageCount} / {promoCode.usageLimit}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${usagePercentage >= 100 ? 'bg-red-500' : 'bg-blue-500'
                                    }`}
                                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700">
                        <div className="text-center p-2 rounded-lg bg-gray-700/30">
                            <span className="block text-xs text-gray-400">Discount</span>
                            <span className="text-lg font-semibold text-indigo-300">{promoCode.discountPercentage}%</span>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-gray-700/30">
                            <span className="block text-xs text-gray-400">Claims</span>
                            <span className="text-lg font-semibold text-green-300">{promoCode.currentUsageCount}</span>
                        </div>
                    </div>
                </div>

                {/* Actions - Visible on Hover (or always for mobile friendlier UI) */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => onEdit(promoCode)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(promoCode.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromoCodeCard;
