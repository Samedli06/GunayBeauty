import { useEffect, useState } from "react";
import { useEditPromoCodeMutation, useGetPromoCodeByIdQuery } from "../../store/API";
import { toast } from "react-toastify";
import { Calendar, Hash, Percent, Users, Loader2 } from "lucide-react";

const EditPromoCodeModal = ({ setOpen, promoCodeId }) => {
    const { data: promoCode, isLoading: isFetching } = useGetPromoCodeByIdQuery(promoCodeId, {
        skip: !promoCodeId,
    });

    const [editPromoCode, { isLoading: isUpdating }] = useEditPromoCodeMutation();

    const [formData, setFormData] = useState({
        code: "",
        discountPercentage: 0,
        expirationDate: "",
        isActive: true,
        usageLimit: 0,
    });

    useEffect(() => {
        if (promoCode) {
            setFormData({
                code: promoCode.code,
                discountPercentage: promoCode.discountPercentage,
                expirationDate: promoCode.expirationDate,
                isActive: promoCode.isActive,
                usageLimit: promoCode.usageLimit,
            });
        }
    }, [promoCode]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : name === "discountPercentage" || name === "usageLimit" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: promoCodeId,
                ...formData,
                expirationDate: new Date(formData.expirationDate).toISOString(),
            };
            await editPromoCode(payload).unwrap();
            toast.success("Promo code updated successfully");
            setOpen(false);
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update promo code");
        }
    };

    if (isFetching) {
        return <div className="p-10 text-center text-white"><Loader2 className="animate-spin w-8 h-8 mx-auto" /> Loading...</div>
    }

    return (
        <div className="bg-[#1f1f1f] text-white p-6 rounded-lg max-w-xl w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold !text-white">Edit Promo Code</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" /> Code *
                    </label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. SUMMER2026"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Percent className="w-4 h-4 text-gray-400" /> Discount (%) *
                        </label>
                        <input
                            type="number"
                            name="discountPercentage"
                            value={formData.discountPercentage}
                            onChange={handleInputChange}
                            required
                            min="0"
                            max="100"
                            className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" /> Usage Limit *
                        </label>
                        <input
                            type="number"
                            name="usageLimit"
                            value={formData.usageLimit}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" /> Expiration Date *
                    </label>
                    <input
                        type="datetime-local"
                        name="expirationDate"
                        value={formData.expirationDate ? new Date(formData.expirationDate).toISOString().slice(0, 16) : ""}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white scheme-dark"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 bg-[#2c2c2c] border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium">
                        Active
                    </label>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isUpdating ? "Updating..." : "Update Promo Code"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPromoCodeModal;
