import { useState, useMemo } from "react";
import {
    useGetAdminQuizQuestionsQuery,
    useGetQuizRulesQuery,
    useAddQuizRuleMutation,
    useUpdateQuizRuleMutation,
    useDeleteQuizRuleMutation,
    useGetProductsQuery
} from "../../store/API";
import Modal from "../../components/UI/Modal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import {
    Loader2,
    Plus,
    Sparkles,
    Trash2,
    Edit2,
    Search,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Package,
    HelpCircle
} from "lucide-react";
import { toast } from "react-toastify";

const QuizAdmin = () => {
    const [modalType, setModalType] = useState(null); // 'create', 'edit', 'delete'
    const [selectedRule, setSelectedRule] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: questions, isLoading: isQuestionsLoading } = useGetAdminQuizQuestionsQuery();
    const { data: rules, isLoading: isRulesLoading } = useGetQuizRulesQuery();
    const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery();

    const [addRule, { isLoading: isAdding }] = useAddQuizRuleMutation();
    const [updateRule, { isLoading: isUpdating }] = useUpdateQuizRuleMutation();
    const [deleteRule, { isLoading: isDeleting }] = useDeleteQuizRuleMutation();

    // Form State
    const [ruleForm, setRuleForm] = useState({
        ruleDescription: "",
        answerOptionIds: [],
        productIds: []
    });

    const products = useMemo(() => productsData || [], [productsData]);

    const handleOpenCreate = () => {
        setRuleForm({
            ruleDescription: "",
            answerOptionIds: [],
            productIds: []
        });
        setModalType("create");
    };

    const handleOpenEdit = (rule) => {
        setSelectedRule(rule);
        setRuleForm({
            ruleDescription: rule.ruleDescription,
            answerOptionIds: rule.answers.map(a => a.answerOptionId),
            productIds: rule.products.map(p => p.productId)
        });
        setModalType("edit");
    };

    const handleOpenDelete = (rule) => {
        setSelectedRule(rule);
        setModalType("delete");
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedRule(null);
    };

    const toggleAnswerSelection = (answerId) => {
        setRuleForm(prev => {
            const newIds = prev.answerOptionIds.includes(answerId)
                ? prev.answerOptionIds.filter(id => id !== answerId)
                : [...prev.answerOptionIds, answerId];
            return { ...prev, answerOptionIds: newIds };
        });
    };

    const toggleProductSelection = (productId) => {
        setRuleForm(prev => {
            const newIds = prev.productIds.includes(productId)
                ? prev.productIds.filter(id => id !== productId)
                : [...prev.productIds, productId];
            return { ...prev, productIds: newIds };
        });
    };

    const handleSave = async () => {
        if (!ruleForm.ruleDescription.trim()) {
            toast.error("Təsvir daxil edilməlidir");
            return;
        }
        if (ruleForm.answerOptionIds.length === 0) {
            toast.error("Ən azı bir cavab seçilməlidir");
            return;
        }
        if (ruleForm.productIds.length === 0) {
            toast.error("Ən azı bir məhsul seçilməlidir");
            return;
        }

        try {
            if (modalType === "create") {
                await addRule(ruleForm).unwrap();
                toast.success("Qayda yaradıldı");
            } else {
                await updateRule({ id: selectedRule.id, ...ruleForm }).unwrap();
                toast.success("Qayda yeniləndi");
            }
            handleCloseModal();
        } catch (error) {
            toast.error(error?.data?.message || "Xəta baş verdi");
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteRule(selectedRule.id).unwrap();
            toast.success("Qayda silindi");
            handleCloseModal();
        } catch (error) {
            toast.error("Qaydanı silmək mümkün olmadı");
        }
    };

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products.slice(0, 10);
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 20);
    }, [products, searchTerm]);

    if (isRulesLoading || isQuestionsLoading || isProductsLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-[#C5A059]" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-4xl font-bold !text-white mb-2 flex items-center gap-3">
                        <Sparkles className="w-10 h-10 text-[#C5A059]" />
                        Gözəllik Testi Qaydaları
                    </h2>
                    <p className="text-gray-400">Test cavablarına uyğun məhsul tövsiyələrini idarə edin</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="px-6 py-3 bg-[#C5A059] text-white rounded-lg font-semibold shadow-lg hover:bg-[#A88746] transition-all flex items-center gap-2 transform hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Qayda
                </button>
            </div>

            {/* Rules Grid */}
            <div className="grid grid-cols-1 gap-6">
                {rules?.map((rule) => (
                    <div key={rule.id} className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6 hover:border-[#C5A059]/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{rule.ruleDescription}</h3>
                                <div className="flex gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <HelpCircle size={14} />
                                        {rule.answers.length} Cavab
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Package size={14} />
                                        {rule.products.length} Məhsul
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenEdit(rule)}
                                    className="p-2 bg-gray-800 text-blue-400 rounded-lg hover:bg-blue-400/10 transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleOpenDelete(rule)}
                                    className="p-2 bg-gray-800 text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Seçilmiş Şərtlər</p>
                                <div className="flex flex-wrap gap-2">
                                    {rule.answers.map(ans => (
                                        <span key={ans.answerOptionId} className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-xs text-gray-300">
                                            {ans.answerText}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tövsiyə Olunan Məhsullar</p>
                                <div className="flex flex-wrap gap-2">
                                    {rule.products.map(prod => (
                                        <span key={prod.productId} className="px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-full text-xs text-[#C5A059]">
                                            {prod.productName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            <Modal open={modalType === "create" || modalType === "edit"} setOpen={handleCloseModal}>
                <div className="max-h-[85vh] overflow-y-auto px-2 custom-scrollbar">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        {modalType === "create" ? "Yeni Qayda Yarat" : "Qaydanı Yenilə"}
                    </h3>

                    <div className="space-y-6">
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Qayda Təsviri</label>
                            <input
                                type="text"
                                value={ruleForm.ruleDescription}
                                onChange={(e) => setRuleForm(prev => ({ ...prev, ruleDescription: e.target.value }))}
                                placeholder="Məs: Quru dəri üçün nəmləndirici dəsti"
                                className="w-full bg-[#181818] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
                            />
                        </div>

                        {/* Answers Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                                <HelpCircle size={18} />
                                Test Cavablarını Seçin
                            </label>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {questions?.map((q) => (
                                    <div key={q.id} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                                        <p className="font-bold text-gray-300 mb-3 text-sm">{q.questionText}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {q.answerOptions.map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => toggleAnswerSelection(opt.id)}
                                                    className={`px-3 py-2 rounded-lg text-xs text-left transition-all border ${ruleForm.answerOptionIds.includes(opt.id)
                                                        ? 'bg-[#C5A059] border-[#C5A059] text-white'
                                                        : 'bg-[#181818] border-gray-700 text-gray-400 hover:border-gray-500'
                                                        }`}
                                                >
                                                    {opt.answerText}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Products Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                                <Package size={18} />
                                Tövsiyə Olunacaq Məhsullar
                            </label>

                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Məhsul axtar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#181818] border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-[#C5A059]"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredProducts.map(prod => (
                                    <button
                                        key={prod.id}
                                        onClick={() => toggleProductSelection(prod.id)}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-all border ${ruleForm.productIds.includes(prod.id)
                                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                            : 'bg-[#181818] border-gray-800 text-gray-500 hover:border-gray-700'
                                            }`}
                                    >
                                        <span className="text-sm truncate mr-4">{prod.name}</span>
                                        {ruleForm.productIds.includes(prod.id) && <CheckCircle2 size={16} />}
                                    </button>
                                ))}
                            </div>

                            {/* Selected Count */}
                            <div className="mt-4 flex justify-between text-xs text-gray-500">
                                <span>Seçilmiş: {ruleForm.productIds.length} məhsul</span>
                                <button
                                    onClick={() => setRuleForm(prev => ({ ...prev, productIds: [] }))}
                                    className="text-red-400 hover:underline"
                                >
                                    Seçimi təmizlə
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="flex-2 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-all"
                            >
                                Ləğv et
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isAdding || isUpdating}
                                className="flex-1 py-3 bg-[#C5A059] text-white rounded-xl font-bold hover:bg-[#A88746] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {(isAdding || isUpdating) && <Loader2 className="animate-spin" size={20} />}
                                Yadda saxla
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal open={modalType === "delete"} setOpen={handleCloseModal}>
                <ConfirmDeleteModal
                    onClose={handleCloseModal}
                    onConfirm={confirmDelete}
                    isLoading={isDeleting}
                    title="Qaydanı Sil"
                    message={`"${selectedRule?.ruleDescription}" qaydasını silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`}
                />
            </Modal>
        </div>
    );
};

export default QuizAdmin;
