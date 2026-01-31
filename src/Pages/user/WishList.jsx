import React, { useState, useEffect } from 'react';

import { Breadcrumb } from '../../products/Breadcrumb';
import { Heart, Loader2, Check, Trash2 } from 'lucide-react';
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
  useAddCartItemMutation,
  useClearFavoritesMutation,
  useGetRecommendedQuery
} from '../../store/API';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import SimilarProducts from '../../components/UI/SimilarRecommendedProducts';
import { useTranslation } from 'react-i18next';
import { translateDynamicField } from '../../i18n';
import { ProductCard } from '../../products/ProductCard';

const WishList = () => {
  const { t, i18n } = useTranslation();

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);

  // Dynamic translation states
  const [translatedFavorites, setTranslatedFavorites] = useState([]);

  const { data: recommendation, isRecLoading } = useGetRecommendedQuery({ limit: 6 });
  const { data: favoritesData, isLoading, error } = useGetFavoritesQuery({ page, pageSize });
  const [removeFavorite, { isLoading: isRemovingFavorite }] = useRemoveFavoriteMutation();
  const [addCartItem, { isLoading: isAddingToCart }] = useAddCartItemMutation();
  const [clearFavorites] = useClearFavoritesMutation();

  const favorites = favoritesData?.favorites || [];
  const totalCount = favoritesData?.totalCount || 0;

  // Dynamic translation effect
  useEffect(() => {
    async function translateFavorites() {
      if (!favorites || favorites.length === 0) return;

      const targetLang = i18n.language;
      if (targetLang === 'en') {
        const translated = await Promise.all(
          favorites.map(async (favorite) => ({
            ...favorite,
            product: {
              ...favorite.product,
              name: await translateDynamicField(favorite.product.name, targetLang),
              shortDescription: favorite.product.shortDescription ?
                await translateDynamicField(favorite.product.shortDescription, targetLang) :
                favorite.product.shortDescription
            }
          }))
        );
        setTranslatedFavorites(translated);
      } else {
        setTranslatedFavorites(favorites);
      }
    }
    translateFavorites();
  }, [i18n.language, favorites]);

  const handleRemoveFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFavorite({ productId }).unwrap();
    } catch (err) {
      toast.error(t('failedToRemoveFavorite'));
      console.error('Remove favorite error:', err);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingProductId(productId);
    try {
      await addCartItem({ productId, quantity: 1 }).unwrap();
      setShowSuccess(productId);
      setTimeout(() => {
        setShowSuccess(null);
        setLoadingProductId(null);
      }, 2000);
    } catch (err) {
      setLoadingProductId(null);
      if (err?.status === 401 || err?.data?.status === 401) {
        toast.error(t('pleaseLoginFirst'));
      } else {
        toast.error(t('failedToAddToCart'));
      }
      console.error('Add to cart error:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearFavorites().unwrap();
    } catch (err) {
      toast.error(t('failedToClearFavorites'));
      console.error('Clear favorites error:', err);
    }
  };


  if (isLoading) {
    return (
      <section className="inter bg-[#f7fafc] min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('loadingFavorites')}</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="inter bg-[#f7fafc] min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{t('errorLoadingFavorites')}</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f7fafc] pb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Mobile Breadcrumb */}
      <div className="lg:hidden px-4 py-4 bg-white border-b border-[#dee2e6]">
        <Breadcrumb />
      </div>

      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="hidden lg:block mb-4">
          <Breadcrumb />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A041D]">
            {t('favorites')} ({totalCount})
          </h1>
          {favorites?.length > 0 && (
            <button
              onClick={handleClearAll}
              className="mt-4 md:mt-0 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              {t('clearAll')}
            </button>
          )}
        </div>

        {favorites?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-300 fill-gray-100" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('favoritesEmpty')}</h2>
            <p className="text-gray-500 max-w-md mx-auto">{t('favoritesEmptyHint')}</p>
            <Link to="/products" className="inline-block mt-8 px-8 py-3 bg-[#4A041D] text-white rounded-full font-medium hover:bg-[#3d0318] transition-colors shadow-lg shadow-pink-900/20">
              {t('startShopping')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {(translatedFavorites.length > 0 ? translatedFavorites : favorites).map((item) => {
              const cardInfo = {
                url: item.product.primaryImageUrl,
                name: item.product.name,
                priceOriginal: item.product.price,
                price: item.product.discountedPrice && item.product.discountedPrice > 0 ? item.product.discountedPrice : item.product.price,
                id: item.product.id,
                description: item.product.shortDescription || item.product.description,
                discountPercentage: item.product.discountPercentage,
                isHotDeal: item.product.isHotDeal
              };

              return (
                <ProductCard
                  key={item.id}
                  col={true}
                  info={cardInfo}
                  productData={item.product}
                  handleAddToCart={(id) => handleAddToCart({ preventDefault: () => { }, stopPropagation: () => { } }, id)}
                  isAddingToCart={loadingProductId === item.product.id}
                  toggleFavorite={(id) => handleRemoveFavorite({ preventDefault: () => { }, stopPropagation: () => { } }, id)}
                  isFavorite={true}
                />
              );
            })}
          </div>
        )}

        {/* Pagination - Matching website style */}
        {totalCount > pageSize && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-[#4A041D] hover:text-white hover:border-[#4A041D] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
            >
              {'<'}
            </button>
            <span className="px-6 py-2 bg-white border border-gray-200 rounded-full text-gray-700 font-medium shadow-sm">
              {page} / {Math.ceil(totalCount / pageSize)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(totalCount / pageSize)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-[#4A041D] hover:text-white hover:border-[#4A041D] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
            >
              {'>'}
            </button>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SimilarProducts products={recommendation?.recentlyAdded} isLoading={isRecLoading} />
      </div>
    </section>
  );
};

export default WishList;
