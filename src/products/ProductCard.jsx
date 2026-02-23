import React, { useState, useEffect } from 'react';
import { Heart, Check, ShoppingBag, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useGetFavoriteStatusQuery, API_BASE_URL } from '../store/API';

export function ProductCard({
  col,
  info,
  productData,
  handleAddToCart,
  isAddingToCart,
  toggleFavorite,
  isFavorite = false,
  compact = false
}) {
  const { id, url, name: originalName, description: originalDescription, isHotDeal } = info;

  // Use productData directly for prices to avoid mapping confusion
  const basePrice = parseFloat(productData?.price) || 0;
  const salePrice = parseFloat(productData?.discountedPrice) || 0;

  // Core price logic
  const hasDiscount = salePrice > 0 && salePrice < basePrice;
  const displayPrice = hasDiscount ? salePrice : basePrice;
  const originalPrice = hasDiscount ? basePrice : 0;

  // Optional: calculate discount percentage if not provided
  const discountPercentage = info.discountPercentage || (hasDiscount ? Math.round(((basePrice - salePrice) / basePrice) * 100) : 0);

  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const name = originalName;
  const description = originalDescription;
  const { data: favoriteStatus } = useGetFavoriteStatusQuery({ productId: id });



  useEffect(() => {
    if (justAdded) {
      const timer = setTimeout(() => setJustAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [justAdded]);

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (handleAddToCart) {
      handleAddToCart(id, productData);
      setJustAdded(true);
      window.dispatchEvent(new Event('cartAnimation'));
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTogglingFavorite || !toggleFavorite) return;
    try {
      await toggleFavorite(id);
    } catch (error) {
    }
  };

  const PriceDisplay = ({ isCompact, isRow }) => {
    if (displayPrice <= 0) return null;

    return (
      <div className={`${isRow ? 'flex items-center gap-3 mt-4 flex-wrap' : ' border-t border-gray-100/50 pt-2'}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`${isCompact ? '!text-[13px] lg:!text-lg' : isRow ? 'text-!2xl' : 'text-lg md:!text-xl'} font-bold text-[#C5A059]`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {displayPrice} ₼
          </p>
          {hasDiscount && (
            <p className={`${isCompact ? '!text-xs lg:!text-sm' : '!text-sm'} text-gray-400 line-through`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {originalPrice} ₼
            </p>
          )}
        </div>
        {hasDiscount && !isRow && (
          <p className={`${isCompact ? '!text-[10px] lg:!text-sm' : 'text-xs'} text-green-600 font-medium mt-1`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Qənaət edin {(originalPrice - displayPrice).toFixed(2)} ₼
          </p>
        )}
        {hasDiscount && isRow && (
          <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
            Qənaət edin {(originalPrice - displayPrice).toFixed(2)} ₼
          </span>
        )}
      </div>
    );
  };

  if (col) {
    return (
      <div className={`bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-md overflow-hidden relative group transition-all duration-300 h-full flex flex-col min-h-[300px]  items-between hover:shadow-xl transform hover:-translate-y-1 ${compact ? 'min-w-[150px] max-w-[150px] md:min-w-[180px] md:max-w-[180px] lg:min-w-[220px] lg:max-w-[220px] xl:min-w-[270px] xl:max-w-[270px]' : 'w-full'}`}>
        <Link to={`/details/${id}`} className="block">
          <div className={`aspect-square relative bg-transparent flex items-center justify-center ${compact ? 'p-2 lg:p-4' : 'p-2 lg:p-4'}`}>
            <img
              src={`${API_BASE_URL}${url}`}
              alt={name || 'Product'}
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = '/Icons/logo.jpeg'; }}
            />
            {isHotDeal && (
              <div className={`absolute top-2 right-2 bg-[#E60C03] text-white rounded font-semibold ${compact ? 'text-[10px] lg:text-xs px-1.5 py-0.5 lg:px-2 lg:py-1' : 'text-[10px] lg:text-xs px-1.5 py-0.5 lg:px-2 lg:py-1'}`}>
                Sərfəli Təklif
              </div>
            )}
            {hasDiscount && discountPercentage > 0 && (
              <div className={`absolute top-2 left-2 bg-red-500 text-white rounded-full font-semibold ${compact ? 'text-[10px] lg:text-xs px-1.5 py-0.5 lg:px-2 lg:py-1' : 'text-[10px] lg:text-xs px-1.5 py-0.5 lg:px-2 lg:py-1'}`}>
                -{discountPercentage}%
              </div>
            )}
          </div>
        </Link>

        <div className={`${compact ? 'p-2 lg:p-3' : 'p-2 lg:p-4'} pt-2 bg-white flex flex-col flex-1`}>
          <Link to={`/details/${id}`} className="block">
            <div className='flex gap-2 items-start justify-between'>
              <h3 className={`${compact ? '!text-xs md:!text-sm lg:!text-lg' : '!text-[10px] lg:!text-sm'} font-semibold text-gray-900 mb-1 line-clamp-3 leading-snug flex-1`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {name}
              </h3>
              <button
                onClick={handleFavoriteClick}
                disabled={isTogglingFavorite}
                className={`rounded-full hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10 shrink-0 ${compact ? 'p-1.5 lg:p-2.5 -mt-0.5 lg:-mt-2' : 'p-2 -mt-1 h-fit lg:p-3'}`}
              >
                <Heart
                  className={`transition-all duration-300 ${compact ? 'w-4 h-4 lg:w-6 lg:h-6' : 'w-5 h-5 lg:w-6 lg:h-6'} ${favoriteStatus?.isFavorite ? 'fill-[#C5A059] text-[#C5A059]' : 'text-gray-400 hover:text-[#C5A059]'}`}
                />
              </button>
            </div>
            {!compact && (
              <div className="">
                {description && (
                  <p className="!text-[9px] md:!text-base lg:!text-base text-gray-500 line-clamp-2 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {description}
                  </p>
                )}
              </div>
            )}
            <PriceDisplay isCompact={true} isRow={false} />
          </Link>
          <div className="mt-4">
            <button
              onClick={handleCartClick}
              disabled={isAddingToCart}
              className={`w-full py-2 px-2 rounded font-semibold text-[10px] md:text-[16px] lg:text-[14px] transition-all duration-300 flex items-center justify-center  gap-1 ${justAdded
                ? 'bg-[#C5A059] text-white'
                : 'bg-[#4A041D] hover:bg-[#6D082D] text-white shadow-sm'
                }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {isAddingToCart ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Səbətə əlavə olundu
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  Səbətə əlavə et
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-4 bg-white shadow-md rounded-md border border-gray-200 flex items-center gap-6 relative group transition-all duration-300 hover:shadow-lg">
        <Link to={`/details/${id}`} className="flex-shrink-0 h-full w-full max-w-[150px] relative bg-transparent overflow-hidden flex items-center justify-center">
          <img
            src={`${API_BASE_URL}${url}`}
            alt={name || 'Product'}
            className="max-w-[150px] object-contain aspect-square w-full h-full rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/Icons/logo.jpeg";
              e.currentTarget.className = "object-contain aspect-square w-full h-full rounded-lg";
            }}
          />
          {hasDiscount && discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              -{discountPercentage}%
            </div>
          )}
          {isHotDeal && (
            <div className="absolute top-2 right-2 bg-[#E60C03] text-white text-xs px-2 py-1 rounded font-semibold">
              Sərfəli Təklif
            </div>
          )}
        </Link>
        <div className="flex flex-col flex-1 space-y-4 py-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Link to={`/details/${id}`}>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{name}</h2>
              </Link>
              {description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{description}</p>
              )}
              <PriceDisplay isCompact={false} isRow={true} />
            </div>
            <div className="flex flex-col items-end gap-4">
              <button
                onClick={handleFavoriteClick}
                disabled={isTogglingFavorite}
                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart
                  className={`w-6 h-6 transition-all duration-300 ${favoriteStatus?.isFavorite ? 'fill-[#C5A059] text-[#C5A059]' : 'text-gray-400 hover:text-[#C5A059]'}`}
                />
              </button>
              <button
                onClick={handleCartClick}
                disabled={isAddingToCart}
                className={`py-2 px-6 rounded font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${justAdded
                  ? 'bg-[#C5A059] text-white'
                  : 'bg-[#4A041D] hover:bg-[#6D082D] text-white shadow-sm'
                  }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {isAddingToCart ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    Səbətə əlavə olundu
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Səbətə əlavə et
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
