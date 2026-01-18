import { useState } from "react";
import { useGetPromoCodesQuery, useDeletePromoCodeMutation } from "../../store/API";
import Modal from "../../components/UI/Modal";
import CreatePromoCodeModal from "../../components/admin/CreatePromoCodeModal";
import EditPromoCodeModal from "../../components/admin/EditPromoCodeModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import PromoCodeCard from "../../components/admin/PromoCodeCard";
import { Loader2, Plus, Ticket } from "lucide-react";
import { toast } from "react-toastify";

const PromoCodes = () => {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [modalType, setModalType] = useState(null); // 'create', 'edit', 'delete'
    const [selectedId, setSelectedId] = useState(null);

    const { data: promoCodesData, isLoading } = useGetPromoCodesQuery({
        pageNumber: page,
        pageSize: pageSize
    });

    const [deletePromoCode, { isLoading: isDeleting }] = useDeletePromoCodeMutation();

    const handleDelete = (id) => {
        setSelectedId(id);
        setModalType("delete");
    };

    const confirmDelete = async () => {
        try {
            await deletePromoCode({ id: selectedId }).unwrap();
            toast.success("Promo code deleted");
            handleCloseModal();
        } catch (error) {
            toast.error("Failed to delete promo code");
        }
    };

    const handleEdit = (code) => {
        setSelectedId(code.id);
        setModalType("edit");
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedId(null);
    };

    return (
        <div className="p-6 min-h-screen text-white">
            <Modal open={modalType === "create"} setOpen={handleCloseModal}>
                <CreatePromoCodeModal setOpen={handleCloseModal} />
            </Modal>
            <Modal open={modalType === "edit"} setOpen={handleCloseModal}>
                <EditPromoCodeModal setOpen={handleCloseModal} promoCodeId={selectedId} />
            </Modal>
            <Modal open={modalType === "delete"} setOpen={handleCloseModal}>
                <ConfirmDeleteModal
                    onClose={handleCloseModal}
                    onConfirm={confirmDelete}
                    isLoading={isDeleting}
                    title="Delete Promo Code"
                    message="Are you sure you want to delete this promo code? This action is permanent and cannot be undone."
                />
            </Modal>

            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-4xl font-bold !text-white mb-2 flex items-center gap-3">
                            <Ticket className="w-10 h-10 text-indigo-500" />
                            Promo Codes
                        </h2>
                        <p className="text-gray-400">Manage your discount codes and coupons</p>
                    </div>
                    <button
                        onClick={() => setModalType("create")}
                        className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-all flex items-center gap-2 transform hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        New Promo Code
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {promoCodesData?.items?.map((code) => (
                                <PromoCodeCard
                                    key={code.id}
                                    promoCode={code}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        {/* Empty State */}
                        {promoCodesData?.items?.length === 0 && (
                            <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700 mt-6">
                                <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold !text-white mb-2">No Promo Codes Found</h3>
                                <p className="text-gray-500 mb-6">Create your first promo code to get started.</p>
                                <button
                                    onClick={() => setModalType("create")}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                                >
                                    Create Promo Code
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {promoCodesData?.items?.length > 0 && (
                            <div className="flex justify-center mt-10 gap-2">
                                <button
                                    disabled={!promoCodesData.hasPreviousPage}
                                    onClick={() => setPage(p => p - 1)}
                                    className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-gray-400">
                                    Page {promoCodesData.page} of {promoCodesData.totalPages}
                                </span>
                                <button
                                    disabled={!promoCodesData.hasNextPage}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PromoCodes;
