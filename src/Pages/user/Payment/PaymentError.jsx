import React from 'react';
import { useLocation, Link } from 'react-router';
import { XCircle, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

const PaymentError = () => {
    const location = useLocation();

    // Filter params
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');
    const message = searchParams.get('message');

    React.useEffect(() => {
        console.log("❌ Payment Failed Detail:", { orderId, message });
    }, [orderId, message]);

    return (
        <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4 py-12" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header Decoration */}
                <div className="h-3 bg-red-500" />

                <div className="p-8 md:p-12">
                    <div className="flex flex-col items-center text-center">
                        {/* Error Icon */}
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 relative">
                            <XCircle className="w-12 h-12 text-red-500" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Ödəniş Uğursuz Oldu
                        </h1>

                        <div className="flex items-center gap-2 bg-red-50 p-4 rounded-xl border border-red-100 mb-8 max-w-md w-full">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm font-medium text-left">
                                {message || 'Ödəniş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin və ya dəstək xidməti ilə əlaqə saxlayın.'}
                            </p>
                        </div>

                        {/* Order Info */}
                        {orderId && (
                            <div className="mb-8 p-3 px-6 bg-gray-50 rounded-full border border-gray-100">
                                <p className="text-sm font-medium text-gray-600">
                                    Sifariş ID: <span className="text-gray-900 font-bold">#{orderId}</span>
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <Link
                                to="/cart"
                                className="flex-1 bg-[#4A041D] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2D0212] transition-colors shadow-lg shadow-[#4a041d33]"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Yenidən Cəhd Edin
                            </Link>
                            <Link
                                to="/"
                                className="flex-1 bg-white border-2 border-[#4A041D] text-[#4A041D] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#4A041D05] transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Ana Səhifəyə Qayıt
                            </Link>
                        </div>

                        <p className="mt-10 text-sm text-gray-400">
                            Problem davam edərsə, xahiş edirik dəstək komandamızla əlaqə saxlayın.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentError;
