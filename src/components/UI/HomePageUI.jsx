import { Heart, Loader2, Check, LogIn, UserPlus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useToggleFavoriteMutation, useGetFavoriteStatusQuery } from '../../store/API';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { translateDynamicField } from '../../i18n';
import CartUtils from './CartUtils';
import AuthUtils from './AuthUtils';
import UnauthorizedModal from './UnauthorizedModal';


// ============= MAIN COMPONENT =============
const HomePageUI = ({
  deal,
  product,
  url,
  handleAddToCart,
  showUnauthorizedModal,
  setShowUnauthorizedModal,
  unauthorizedAction,
  setUnauthorizedAction,
}) => {

  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Dynamic translation states
  const [translatedProductName, setTranslatedProductName] = useState(product?.name || '');
  const [translatedProductDescription, setTranslatedProductDescription] = useState(product?.shortDescription || '');


  // Get favorite status for this product
  const { data: favoriteStatus } = useGetFavoriteStatusQuery({ productId: product.id });
  const [toggleFavorite, { isLoading: isTogglingFavorite }] = useToggleFavoriteMutation();
  const [localFavorite, setLocalFavorite] = useState(false);

  // Check authentication status on mount
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    setIsAuthenticated(AuthUtils.isAuthenticated());
  }, []);

  // Dynamic translation effect
  useEffect(() => {
    async function translateFields() {
      const targetLang = i18n.language;
      if (targetLang === 'en' && product?.name) {
        setTranslatedProductName(await translateDynamicField(product.name, targetLang));
      } else {
        setTranslatedProductName(product?.name || '');
      }

      if (targetLang === 'en' && product?.shortDescription) {
        setTranslatedProductDescription(await translateDynamicField(product.shortDescription, targetLang));
      } else {
        setTranslatedProductDescription(product?.shortDescription || '');
      }
    }
    translateFields();
  }, [i18n.language, product?.name, product?.shortDescription]);

  // Update local favorite state when API data arrives
  useEffect(() => {
    if (favoriteStatus) {
      setLocalFavorite(favoriteStatus.isFavorite);
    }
  }, [favoriteStatus]);

  const onAddToCart = async (e, productData) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    setShowSuccess(false);

    try {
      // Check if user is authenticated
      if (isAuthenticated && handleAddToCart) {
        // Use API for authenticated users
        await handleAddToCart(productData.id);
      } else {
        // Use localStorage for non-authenticated users
        CartUtils.addItem(productData, 1);
        window.dispatchEvent(new Event("cartUpdated"));
      }

      // Show success feedback
      setIsLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);

      // Check for 401 unauthorized error (in case token expired)
      if (error?.status === 401 || error?.data?.status === 401) {
        setUnauthorizedAction('add items to cart');
        setShowUnauthorizedModal(true);
        setIsAuthenticated(false);
      } else {
        toast.error(t('oCart') || 'Error adding to cart');
        console.error('Add to cart error:', error);
      }
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const newFavoriteState = !localFavorite;
    setLocalFavorite(newFavoriteState);

    try {
      await toggleFavorite({ productId: product.id }).unwrap();
    } catch (err) {
      // Revert on error
      setLocalFavorite(!newFavoriteState);

      // Check for 401 unauthorized error
      if (err?.status === 401 || err?.data?.status === 401) {
        setUnauthorizedAction('add items to favorites');
        setShowUnauthorizedModal(true);
      } else {
        toast.error('Failed to update favorites');
        console.error('Toggle favorite error:', err);
      }
    }
  };

  const renderButton = () => {
    if (isLoading) {
      return (
        <button disabled className="w-full cursor-not-allowed flex justify-center items-center text-xs lg:text-sm bg-[#9E2A2B] text-white py-3 rounded-none font-medium uppercase tracking-widest transition-colors duration-200">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {t('adding')}
        </button>
      );
    }

    if (showSuccess) {
      return (
        <button disabled className="w-full cursor-default flex justify-center items-center text-xs lg:text-sm bg-[#4A041D] text-white py-3 rounded-none font-medium uppercase tracking-widest transition-colors duration-200">
          <Check className="w-4 h-4 mr-2" />
          {t('addedToCart')}
        </button>
      );
    }

    return (
      <button
        onClick={(e) => onAddToCart(e, product)}
        className="w-full cursor-pointer flex justify-center items-center text-xs lg:text-sm bg-[#4A041D] hover:bg-[#9E2A2B] text-white py-3 rounded-none font-medium uppercase tracking-widest transition-colors duration-300"
      >
        {t('addToCart')}
      </button>
    );
  };

  return (
    <>
      <UnauthorizedModal
        isOpen={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        action={unauthorizedAction}
      />

      <Link
        to={`/details/${product.id}`}
        className="group flex flex-col h-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-md overflow-hidden border border-gray-200 relative transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
      >

        {/* Image Container - Added padding to match ProductCard style */}
        <div className="relative  p-4 overflow-hidden flex items-center justify-center">
          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <div className='absolute top-2 left-2 z-10 bg-[#9E2A2B] text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full'>
              -{product.discountPercentage}%
            </div>
          )}



          <img
            className="w-full aspect-square h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out"
            src={`https://kozmetik-001-site1.qtempurl.com/${url}`}
            alt={product.name}
            onError={(e) => { e.target.src = '/Icons/logo.jpeg'; }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-4 pb-4 items-center text-center">

          {/* Brand/Category Placeholder */}
          <p className="text-[#9E2A2B] text-[10px] font-bold uppercase tracking-widest mb-1">GunayBeauty</p>

          <h3 className="font-sans text-[#4A041D] text-lg leading-tight line-clamp-2 h-[3rem] w-full flex items-center justify-center">
            {translatedProductName}
          </h3>

          {/* Price - Pushed to bottom */}
          <div className="flex items-center flex-col gap-1 mt-auto pt-2">
            {product.originalPrice > product.currentPrice && (
              <span className="text-gray-400 text-sm line-through decoration-[#9E2A2B] decoration-1">{product.originalPrice} AZN</span>
            )}
            <span className="text-[#4A041D] font-bold text-xl">{product.currentPrice} AZN</span>
          </div>
        </div>

      </Link>
    </>
  );
};

export default HomePageUI;