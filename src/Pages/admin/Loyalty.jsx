import React, { useState, useEffect } from 'react';
import { useGetLoyaltySettingsQuery, useUpdateLoyaltySettingsMutation } from '../../store/API';
import { toast } from 'react-toastify';
import { Save, Percent } from 'lucide-react';

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
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Loyallıq Proqramı Tənzimləmələri</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bonus Faizi (%)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Percent className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={bonusPercentage}
                                onChange={(e) => setBonusPercentage(e.target.value)}
                                className="pl-10 block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="0.00"
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            İstifadəçilərin hər alış-verişdən qazanacağı bonus faizi.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                        {isUpdating ? (
                            'Yadda saxlanılır...'
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Yadda Saxla
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Loyalty;
