import React, { useState, useEffect } from 'react';
import {
    useGetInstallmentConfigurationQuery,
    useUpdateInstallmentConfigurationMutation,
    useGetAdminInstallmentOptionsQuery,
    useAddInstallmentOptionMutation,
    useUpdateInstallmentOptionMutation,
    useDeleteInstallmentOptionMutation
} from '../../store/API';
import { toast } from 'react-toastify';
import { Save, Plus, Trash2, Edit2, CheckCircle, AlertCircle, CreditCard, DollarSign, X } from 'lucide-react';

const PaymentAdmin = () => {
    // Configuration State
    const { data: config, isLoading: isConfigLoading } = useGetInstallmentConfigurationQuery();
    const [updateConfig, { isLoading: isUpdatingConfig }] = useUpdateInstallmentConfigurationMutation();

    const [isEnabled, setIsEnabled] = useState(false);
    const [minAmount, setMinAmount] = useState(0);

    // Options State
    const { data: options, isLoading: isOptionsLoading } = useGetAdminInstallmentOptionsQuery();
    const [addOption] = useAddInstallmentOptionMutation();
    const [updateOption] = useUpdateInstallmentOptionMutation();
    const [deleteOption] = useDeleteInstallmentOptionMutation();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState(null);
    const [formData, setFormData] = useState({
        bankName: '',
        installmentPeriod: 0,
        interestPercentage: 0,
        isActive: true,
        minimumAmount: 0,
        displayOrder: 0
    });

    useEffect(() => {
        if (config) {
            setIsEnabled(config.isEnabled);
            setMinAmount(config.minimumAmount);
        }
    }, [config]);

    const handleConfigSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateConfig({ isEnabled, minimumAmount: Number(minAmount) }).unwrap();
            toast.success('Konfiqurasiya uğurla yeniləndi');
        } catch (error) {
            toast.error('Xəta baş verdi');
        }
    };

    const handleOpenModal = (option = null) => {
        if (option) {
            setEditingOption(option);
            setFormData({
                bankName: option.bankName,
                installmentPeriod: option.installmentPeriod,
                interestPercentage: option.interestPercentage,
                isActive: option.isActive,
                minimumAmount: option.minimumAmount,
                displayOrder: option.displayOrder || 0
            });
        } else {
            setEditingOption(null);
            setFormData({
                bankName: '',
                installmentPeriod: 0,
                interestPercentage: 0,
                isActive: true,
                minimumAmount: 0,
                displayOrder: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                installmentPeriod: Number(formData.installmentPeriod),
                interestPercentage: Number(formData.interestPercentage),
                minimumAmount: Number(formData.minimumAmount),
                displayOrder: Number(formData.displayOrder)
            };

            if (editingOption) {
                await updateOption({ id: editingOption.id, ...payload }).unwrap();
                toast.success('Seçim uğurla yeniləndi');
            } else {
                await addOption(payload).unwrap();
                toast.success('Yeni seçim əlavə edildi');
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Xəta baş verdi');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu seçimi silmək istədiyinizə əminsiniz?')) {
            try {
                await deleteOption(id).unwrap();
                toast.success('Seçim silindi');
            } catch (error) {
                toast.error('Xəta baş verdi');
            }
        }
    };

    if (isConfigLoading || isOptionsLoading) {
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
                    Hissə-hissə Ödəniş Sistemi
                </h1>
                <p className="text-gray-400 text-sm">
                    Sistem üzrə hissə-hissə ödəniş tənzimləmələrini və bank seçimlərini buradan idarə edin.
                </p>
                <div className="w-20 h-1 bg-[#C5A059] mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Global Config */}
                <div className="lg:col-span-1">
                    <div className="bg-[#1f1f1f] rounded-2xl border border-gray-800 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#4A041D] rounded-lg">
                                <CreditCard className="w-5 h-5 text-[#C5A059]" />
                            </div>
                            <h2 className="text-xl font-semibold !text-white">Ümumi Ayarlar</h2>
                        </div>

                        <form onSubmit={handleConfigSubmit} className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-xl border border-gray-700">
                                <span className="text-gray-300 font-medium">Sistem Aktivdir</span>
                                <button
                                    type="button"
                                    onClick={() => setIsEnabled(!isEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEnabled ? 'bg-[#C5A059]' : 'bg-gray-600'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">Minimal Məbləğ (₼)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={minAmount}
                                        onChange={(e) => setMinAmount(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-[#C5A059] outline-none"
                                    />
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                                <p className="text-xs text-gray-500">Bu məbləğdən aşağı olan sifarişlərdə hissəli ödəniş görünməyəcək.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdatingConfig}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-[#C5A059] hover:text-white text-black font-bold rounded-xl transition-all disabled:opacity-50"
                            >
                                <Save size={18} />
                                {isUpdatingConfig ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
                            </button>
                        </form>
                    </div>

                    <div className="mt-6 bg-[#1f1f1f] rounded-2xl p-6 border border-gray-800">
                        <h4 className="!text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-blue-400" />
                            İstifadə Qaydası
                        </h4>
                        <ul className="text-gray-400 text-xs space-y-2 ml-4 list-disc">
                            <li>Minimal məbləğ hər bir bank seçimi üçün fərdi olaraq da təyin edilə bilər.</li>
                            <li>Sistem deaktiv edildikdə bütün hissəli ödəniş seçimləri gizlədiləcək.</li>
                        </ul>
                    </div>
                </div>

                {/* Options Table */}
                <div className="lg:col-span-2">
                    <div className="bg-[#1f1f1f] rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                            <h2 className="text-xl font-semibold !text-white">Bank Seçimləri</h2>
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex items-center gap-2 px-4 py-2 bg-[#C5A059] text-white rounded-lg hover:bg-[#A68648] transition-all text-sm font-medium"
                            >
                                <Plus size={18} />
                                Yeni Seçim
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#2a2a2a] text-gray-400 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Bank</th>
                                        <th className="px-6 py-4 text-center">Müddət</th>
                                        <th className="px-6 py-4 text-center">Faiz</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Əməliyyatlar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {options?.map((option) => (
                                        <tr key={option.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{option.bankName}</div>
                                                <div className="text-xs text-gray-500">Min: {option.minimumAmount} ₼</div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-300">
                                                {option.installmentPeriod} ay
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-[#C5A059]">
                                                {option.interestPercentage}%
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${option.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {option.isActive ? 'Aktiv' : 'Deaktiv'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(option)}
                                                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(option.id)}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {options?.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                Heç bir seçim tapılmadı.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                            <h3 className="text-xl font-bold !text-white">{editingOption ? 'Seçimi Redaktə Et' : 'Yeni Seçim'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm text-gray-400">Bank Adı</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white focus:ring-1 focus:ring-[#C5A059] outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-400">Müddət (ay)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.installmentPeriod}
                                        onChange={(e) => setFormData({ ...formData, installmentPeriod: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-400">Faiz (%)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.1"
                                        value={formData.interestPercentage}
                                        onChange={(e) => setFormData({ ...formData, interestPercentage: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-400">Min. Məbləğ (₼)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.minimumAmount}
                                        onChange={(e) => setFormData({ ...formData, minimumAmount: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm text-gray-400">Sıralama</label>
                                    <input
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 py-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 accent-[#C5A059]"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-300">Aktiv statusu</label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all font-medium"
                                >
                                    Ləğv et
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-[#C5A059] text-white rounded-lg hover:bg-[#A68648] transition-all font-bold"
                                >
                                    Yadda Saxla
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentAdmin;
