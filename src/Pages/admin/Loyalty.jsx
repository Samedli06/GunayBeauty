import React, { useState, useEffect } from 'react';
import { useGetLoyaltySettingsQuery, useUpdateLoyaltySettingsMutation } from '../../store/API';
import { toast } from 'react-toastify';
import { Save, Percent, CheckCircle, AlertCircle } from 'lucide-react';

const Loyalty = () => {
    const { data: settings, isLoading } = useGetLoyaltySettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateLoyaltySettingsMutation();

    const [bonusPercentage, setBonusPercentage] = useState(0);

    useEffect(() => {
        if (settings) {
            setBonusPercentage(settings.bonusPercentage || 0);
        }
    }, [settings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateSettings({ bonusPercentage: Number(bonusPercentage) }).unwrap();
            toast.success('Loyallıq tənzimləmələri uğurla yeniləndi');
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Xəta baş verdi');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold !text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Loyallıq Proqramı
                </h1>
                <p className="text-gray-400 text-sm">
                    Müştərilər üçün bonus qazanma qaydalarını buradan tənzimləyə bilərsiniz.
                </p>
                <div className="w-20 h-1 bg-[#C5A059] mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Settings Card */}
                <div className="bg-[#1f1f1f] rounded-2xl shadow-xl border border-gray-800 p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-[#4A041D] rounded-xl shadow-lg shadow-[#4A041D]/20">
                            <Percent className="w-6 h-6 text-[#C5A059]" />
                        </div>
                        <h2 className="text-xl font-semibold !text-white">Bonus Tənzimləmələri</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Cashback Faizi (%) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={bonusPercentage}
                                    onChange={(e) => setBonusPercentage(e.target.value)}
                                    className="w-full pl-6 pr-12 py-4 rounded-xl bg-[#2a2a2a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all text-xl font-bold"
                                    placeholder="0.00"
                                />
                                <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                                    <span className="text-[#C5A059] font-bold text-xl">%</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-xs">
                                Müştəri hər sifarişin ümumi məbləğinin bu faizini öz bonus balansına qazanacaqdır.
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full flex justify-center items-center py-4 px-6 bg-white hover:bg-[#C5A059] hover:text-white text-[#1a1a1a] font-bold rounded-xl shadow-lg transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isUpdating ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
                                        <span>Yadda saxlanılır...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="w-5 h-5 transition-transform group-hover:scale-110" />
                                        <span>Dəyişiklikləri Yadda Saxla</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview Card / Info Box */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#4A041D] to-[#2D0212] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>

                        <h3 className="text-xl font-bold mb-6 flex !text-white items-center gap-2">
                            <div className="w-2 h-2 bg-[#C5A059] rounded-full"></div>
                            Müştəri Görünüşü
                        </h3>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-6">
                            <p className="text-sm text-white/60 mb-1">Cari Qazanc Rejimi</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-[#C5A059]">{bonusPercentage || 0}%</span>
                                <span className="text-white/60 text-sm">hər alışda</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-[#C5A059]" />
                                </div>
                                <p className="text-sm text-white/80">Sifariş təsdiqləndikdən sonra bonuslar dərhal balansa köçür.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-[#C5A059]" />
                                </div>
                                <p className="text-sm text-white/80">Bonuslar növbəti alış-verişlərdə endirim kimi istifadə oluna bilər.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1f1f1f] rounded-2xl p-6 border border-gray-800">
                        <h4 className="!text-white font-semibold mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-blue-400" />
                            Mühüm Qeyd
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Loyallıq proqramında edilən dəyişikliklər yalnız yeni yaradılan sifarişlərə şamil olunur. Köhnə sifarişlərin bonusları həmin vaxt qüvvədə olan faizlə hesablanmışdır.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loyalty;
