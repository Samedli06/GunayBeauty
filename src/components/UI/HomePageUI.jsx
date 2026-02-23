import { Heart, Loader2, Check, LogIn, UserPlus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useToggleFavoriteMutation, useGetFavoriteStatusQuery, API_BASE_URL } from '../../store/API';
import { toast } from 'react-toastify';

import CartUtils from './CartUtils';
import AuthUtils from './AuthUtils';


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

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);




  // Get favorite status for this product
  const { data: favoriteStatus } = useGetFavoriteStatusQuery({ productId: product.id });
  const [toggleFavorite, { isLoading: isTogglingFavorite }] = useToggleFavoriteMutation();
  const [localFavorite, setLocalFavorite] = useState(false);

  // Check authentication status on mount
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    setIsAuthenticated(AuthUtils.isAuthenticated());
  }, []);



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
        setUnauthorizedAction('məhsulları səbətə əlavə etmək');
        setShowUnauthorizedModal(true);
        setIsAuthenticated(false);
      } else {
        toast.error('Səbətə əlavə edilə bilmədi');
        console.error('Add to cart error:', error);
      }
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If not authenticated, show unauthorized modal immediately
    if (!isAuthenticated) {
      setUnauthorizedAction('məhsulları sevimlilərə əlavə etmək');
      setShowUnauthorizedModal(true);
      return;
    }

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
        setUnauthorizedAction('məhsulları sevimlilərə əlavə etmək');
        setShowUnauthorizedModal(true);
      } else {
        toast.error('Favoritləri yeniləmək mümkün olmadı');
        console.error('Toggle favorite error:', err);
      }
    }
  };

  const renderButton = () => {
    if (isLoading) {
      return (
        <button disabled className="w-full cursor-not-allowed flex justify-center items-center !text-[10px] lg:text-xs bg-[#9E2A2B] text-white py-2 rounded-none font-medium uppercase tracking-widest transition-colors duration-200">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Əlavə edilir...
        </button>
      );
    }

    if (showSuccess) {
      return (
        <button disabled className="w-full cursor-default flex justify-center items-center !text-[10px] lg:text-xs bg-[#4A041D] text-white py-2 rounded-none font-medium uppercase tracking-widest transition-colors duration-200">
          <Check className="w-4 h-4 mr-2" />
          Səbətə əlavə edildi
        </button>
      );
    }

    return (
      <button
        onClick={(e) => onAddToCart(e, product)}
        className="w-full cursor-pointer flex justify-center items-center !text-[10px] lg:text-xs bg-[#4A041D] hover:bg-[#9E2A2B] text-white py-2 rounded-none font-medium uppercase tracking-widest transition-colors duration-300"
      >
        Səbətə əlavə et
      </button>
    );
  };

  return (
    <>
      <Link
        to={`/details/${product.id}`}
        className="group flex flex-col flex-shrink-0 w-[200px] md:w-[240px] lg:w-[260px] h-full max-h-[400px] min-h-[400px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-md overflow-hidden border border-gray-200 relative transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
      >

        {/* Image Container */}
        <div className="relative p-4 overflow-hidden flex items-center justify-center">
          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <div className='absolute top-2 left-2 z-10 bg-[#9E2A2B] text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full'>
              -{product.discountPercentage}%
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${localFavorite
              ? 'bg-[#9E2A2B] text-white'
              : 'bg-white/80 text-gray-400 hover:bg-white hover:text-[#9E2A2B]'
              }`}
            aria-label={localFavorite ? 'Sevimlilərə əlavə edildi' : 'Sevimlilərə əlavə et'}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${localFavorite ? 'fill-current' : ''
                }`}
            />
          </button>

          <img
            className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out"
            src={`${API_BASE_URL}${url}`}
            alt={product.name}
            onError={(e) => { e.target.src = '/Icons/logo.jpeg'; }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-4 pb-4 items-center  text-center">

          {/* Brand/Category Placeholder */}
          <p className="text-[#9E2A2B] !text-[12px] font-bold uppercase tracking-widest mb-1">GunayBeauty</p>

          <h3 className="font-sans text-[#4A041D] !text-[12px] leading-[1.2rem] !line-clamp-2 w-full mb-1 flex items-center justify-center overflow-hidden">
            {product?.name}
          </h3>

          {/* Price - Pushed to bottom */}
          <div className="flex items-center flex-col gap-1 mt-auto pt-2">
            {product.discountedPrice > 0 && product.price > product.discountedPrice && (
              <span className="text-gray-400 text-sm line-through decoration-[#9E2A2B] decoration-1">{product.price} AZN</span>
            )}
            <span className="text-[#4A041D] font-bold text-xl">
              {product.discountedPrice > 0 ? product.discountedPrice : product.price} AZN
            </span>
          </div>

          <div className="w-full mt-4">
            {renderButton()}
          </div>
        </div>

      </Link>
    </>
  );
};

export default HomePageUI;