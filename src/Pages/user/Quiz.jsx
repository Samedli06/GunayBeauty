import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    useGetQuizQuestionsQuery,
    useSubmitQuizAnswersMutation,
    useAddCartItemMutation,
    useToggleFavoriteMutation,
    useGetFavoritesQuery,
    API_BASE_URL
} from '../../store/API';
import {
    ChevronRight,
    ChevronLeft,
    RefreshCw,
    Loader2,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    ShoppingBag
} from 'lucide-react';
import { toast } from 'react-toastify';
import { ProductCard } from '../../products/ProductCard';
import AuthUtils from '../../components/UI/AuthUtils';
import CartUtils from '../../components/UI/CartUtils';
import UnauthorizedModal from '../../components/UI/UnauthorizedModal';

const Quiz = () => {
    const { data: questions, isLoading: isQuestionsLoading } = useGetQuizQuestionsQuery();
    const [submitAnswers, { data: results, isLoading: isSubmitting }] = useSubmitQuizAnswersMutation();
    const [addCartItem] = useAddCartItemMutation();
    const [toggleFavorite] = useToggleFavoriteMutation();
    const { data: favorites } = useGetFavoritesQuery();

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const [addingIds, setAddingIds] = useState(new Set());
    const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
    const [unauthorizedAction, setUnauthorizedAction] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(() => AuthUtils.isAuthenticated());

    const handleAnswerSelect = (questionId, answerId) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        const answerIds = Object.values(selectedAnswers);
        if (answerIds.length < questions.length) {
            toast.error('Zəhmət olmasa bütün sualları cavablandırın');
            return;
        }
        try {
            await submitAnswers(answerIds).unwrap();
            setIsFinished(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            toast.error('Xəta baş verdi. Yenidən cəhd edin.');
        }
    };

    const handleRestart = () => {
        setCurrentStep(0);
        setSelectedAnswers({});
        setIsFinished(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddToCart = useCallback(async (id, productData) => {
        if (!id) return;
        setAddingIds(prev => new Set(prev).add(id));
        try {
            if (isAuthenticated) {
                await addCartItem({ productId: id, quantity: 1 }).unwrap();
                toast.success("Məhsul səbətə əlavə edildi");
            } else {
                CartUtils.addItem(productData, 1);
                window.dispatchEvent(new Event("cartUpdated"));
                toast.success("Məhsul səbətə əlavə edildi");
            }
        } catch (err) {
            if (err?.status === 401 || err?.data?.status === 401) {
                setUnauthorizedAction('məhsulu səbətə əlavə etmək');
                setShowUnauthorizedModal(true);
            } else {
                toast.error("Xəta baş verdi");
            }
        } finally {
            setAddingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    }, [isAuthenticated, addCartItem]);

    const handleToggleFavorite = useCallback(async (id) => {
        if (!id) return;
        try {
            await toggleFavorite({ productId: id }).unwrap();
        } catch (err) {
            if (err?.status === 401 || err?.data?.status === 401) {
                setUnauthorizedAction('favoritlərə əlavə etmək');
                setShowUnauthorizedModal(true);
            } else {
                toast.error("Favoritlərdə xəta baş verdi");
            }
        }
    }, [toggleFavorite]);

    const isProductFavorited = useCallback((productId) => {
        if (!favorites) return false;
        return favorites.includes(productId);
    }, [favorites]);

    if (isQuestionsLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-[#4A041D] animate-spin" />
                <p className="text-gray-500 font-medium">Suallar yüklənir...</p>
            </div>
        );
    }

    if (isFinished && results) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#4A041D] mb-4 font-logo">Sizin üçün tövsiyə olunanlar</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Sizin cavablarınıza və ehtiyaclarınıza uyğun olaraq ən yaxşı nəticələri seçdik.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20 px-2 lg:px-4">
                    {results.recommendedProducts?.map(product => (
                        <ProductCard
                            key={product.id}
                            col={true}
                            info={{
                                id: product.id,
                                url: product.imageUrl,
                                name: product.name,
                                description: product.shortDescription,
                                isHotDeal: product.isHotDeal
                            }}
                            productData={product}
                            handleAddToCart={handleAddToCart}
                            isAddingToCart={addingIds.has(product.id)}
                            toggleFavorite={handleToggleFavorite}
                            isFavorite={isProductFavorited(product.id)}
                        />
                    ))}
                </div>

                <div className="flex flex-col items-center justify-center bg-[#FDF2F5] rounded-[3rem] p-12 lg:p-20 text-center">
                    <Sparkles className="w-12 h-12 text-[#C5A059] mb-6" />
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#4A041D] mb-4">Başqa seçimlər etmək istəyirsiniz?</h2>
                    <p className="text-gray-600 mb-10 max-w-md">Testi yenidən başlayaraq fərqli meyarlar əsasında yeni tövsiyələr ala bilərsiniz.</p>
                    <button
                        onClick={handleRestart}
                        className="flex items-center gap-3 px-10 py-5 bg-[#4A041D] text-white rounded-2xl hover:bg-[#6D082D] transition-all transform active:scale-95 font-bold shadow-xl shadow-[#4A041D]/20"
                    >
                        <RefreshCw size={20} />
                        Testi yenidən başla
                    </button>
                </div>

                <UnauthorizedModal
                    isOpen={showUnauthorizedModal}
                    onClose={() => setShowUnauthorizedModal(false)}
                    action={unauthorizedAction}
                />
            </div>
        );
    }

    const currentQuestion = questions?.[currentStep];
    const progress = ((currentStep + 1) / (questions?.length || 1)) * 100;

    return (
        <div className="min-h-screen bg-[#FCFCFC] py-12 lg:py-24">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(74,4,29,0.05)] overflow-hidden border border-gray-100 flex flex-col">
                    {/* Progress Header */}
                    <div className="bg-[#4A041D] p-8 lg:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm font-bold tracking-wider uppercase backdrop-blur-md">
                                    Sual {currentStep + 1} / {questions?.length}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#C5A059] transition-all duration-700 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-[#C5A059]">{Math.round(progress)}%</span>
                                </div>
                            </div>
                            <h2 className="text-3xl !text-white lg:text-4xl font-bold leading-tight font-logo">{currentQuestion?.questionText}</h2>
                        </div>
                    </div>

                    <div className="p-8 lg:p-12 flex-1 flex flex-col">
                        <div className="grid gap-4 flex-1">
                            {currentQuestion?.answerOptions?.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                                    className={`flex items-center p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${selectedAnswers[currentQuestion.id] === option.id
                                        ? 'border-[#4A041D] bg-[#FDF2F5]'
                                        : 'border-gray-50 hover:border-[#C5A059]/30 bg-gray-50/50'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-6 flex items-center justify-center transition-all duration-300 ${selectedAnswers[currentQuestion.id] === option.id
                                        ? 'border-[#4A041D] bg-[#4A041D]'
                                        : 'border-gray-300 bg-white group-hover:border-[#C5A059]'
                                        }`}>
                                        {selectedAnswers[currentQuestion.id] === option.id && (
                                            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-lg font-bold transition-colors ${selectedAnswers[currentQuestion.id] === option.id ? 'text-[#4A041D]' : 'text-gray-700'
                                            }`}>
                                            {option.answerText}
                                        </p>
                                        {option.subText && (
                                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{option.subText}</p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-[#4A041D] font-bold transition-all disabled:opacity-0"
                            >
                                <ChevronLeft size={20} />
                                Geri
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={!selectedAnswers[currentQuestion?.id] || isSubmitting}
                                className="flex items-center gap-3 px-12 py-5 bg-[#4A041D] text-white rounded-2xl hover:bg-[#6D082D] transition-all transform active:scale-95 font-bold shadow-xl shadow-[#4A041D]/10 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Hazırlanır...
                                    </>
                                ) : (
                                    <>
                                        {currentStep === questions?.length - 1 ? 'Nəticəni gör' : 'Növbəti'}
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center text-center animate-fade-in">
                    <div className="flex items-center gap-2 text-gray-400 font-medium mb-4">
                        <Sparkles size={18} className="text-[#C5A059]" />
                        <span>Süni intellekt dəstəkli tövsiyə sistemi</span>
                    </div>
                    <p className="text-gray-400 text-sm max-w-sm">Cavablarınız tamamilə məxfidir və yalnız sizə uyğun məhsulları təyin etmək üçün istifadə olunur.</p>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
