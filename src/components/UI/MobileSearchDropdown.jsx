import React, { useState, useEffect } from 'react';
import { Search, Package, Tag, Grid, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { translateDynamicField } from '../../i18n';

// Skeleton Components
const CategorySkeletonMobile = () => (
  <div className="flex items-center gap-3 p-3 animate-pulse border-b border-gray-50 last:border-0">
    <div className="w-10 h-10 bg-gray-100 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-2 bg-gray-100 rounded w-1/3" />
    </div>
  </div>
);

const BrandSkeletonMobile = () => (
  <div className="flex items-center gap-2 p-2 animate-pulse bg-gray-50 border border-gray-100 rounded-full">
    <div className="w-6 h-6 bg-gray-200 rounded-full" />
    <div className="h-3 bg-gray-200 rounded w-16" />
  </div>
);

const ProductSkeletonMobile = () => (
  <div className="bg-white rounded-lg p-3 animate-pulse border border-gray-100">
    <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3" />
    <div className="space-y-2">
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  </div>
);

const MobileSearchDropdown = ({
  searchQuery,
  searchResult,
  isSearching,
  onProductClick,
  onCategoryClick,
  onBrandClick,
  onViewAllProducts
}) => {
  const { t, i18n } = useTranslation();
  const [translatedSearchResult, setTranslatedSearchResult] = useState(null);

  useEffect(() => {
    async function translateSearchResult() {
      if (!searchResult) return;

      const targetLang = i18n.language;
      if (targetLang === 'en') {
        const translated = { ...searchResult };

        if (searchResult.categories) {
          translated.categories = await Promise.all(
            searchResult.categories.map(async (category) => ({
              ...category,
              name: await translateDynamicField(category.name, targetLang)
            }))
          );
        }

        if (searchResult.brands) {
          translated.brands = await Promise.all(
            searchResult.brands.map(async (brand) => ({
              ...brand,
              name: await translateDynamicField(brand.name, targetLang)
            }))
          );
        }

        if (searchResult.products) {
          translated.products = await Promise.all(
            searchResult.products.map(async (product) => ({
              ...product,
              name: await translateDynamicField(product.name, targetLang),
              categoryName: product.categoryName ? await translateDynamicField(product.categoryName, targetLang) : product.categoryName
            }))
          );
        }

        setTranslatedSearchResult(translated);
      } else {
        setTranslatedSearchResult(searchResult);
      }
    }
    translateSearchResult();
  }, [i18n.language, searchResult]);

  const containerStyle = { fontFamily: 'Montserrat, sans-serif' };

  // Empty state - before typing
  if (searchQuery.length < 2) {
    return (
      <div className="py-12 text-center" style={containerStyle}>
        <div className="w-14 h-14 bg-[#4A041D]/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-6 h-6 text-[#4A041D]/40" />
        </div>
        <p className="text-[#4A041D] font-medium mb-1">{t('search')}</p>
        <p className="text-gray-400 text-sm">
          Type to search...
        </p>
      </div>
    );
  }

  // Loading state
  if (isSearching) {
    return (
      <div className="space-y-8 pb-8" style={containerStyle}>
        <div>
          <h3 className="text-xs font-bold text-[#4A041D] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Grid className="w-3 h-3" /> CATEGORIES
          </h3>
          <div className="space-y-1">
            {[1, 2].map(i => <CategorySkeletonMobile key={i} />)}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-[#4A041D] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Tag className="w-3 h-3" /> BRANDS
          </h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map(i => <BrandSkeletonMobile key={i} />)}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-[#4A041D] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Package className="w-3 h-3" /> PRODUCTS
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => <ProductSkeletonMobile key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const currentSearchResult = translatedSearchResult || searchResult;

  // No results state
  if (!currentSearchResult || (!currentSearchResult.categories?.length && !currentSearchResult.brands?.length && !currentSearchResult.products?.length)) {
    return (
      <div className="py-12 text-center" style={containerStyle}>
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-gray-900 font-medium mb-1">No results found</p>
        <p className="text-gray-500 text-sm">
          Check spelling or try new keywords
        </p>
      </div>
    );
  }

  const hasCategories = currentSearchResult.categories && currentSearchResult.categories.length > 0;
  const hasBrands = currentSearchResult.brands && currentSearchResult.brands.length > 0;
  const hasProducts = currentSearchResult.products && currentSearchResult.products.length > 0;

  return (
    <div className="space-y-8 pb-20" style={containerStyle}>
      {/* Categories Section */}
      {hasCategories && (
        <div>
          <h3 className="text-xs font-bold text-[#4A041D] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Grid className="w-3 h-3" /> CATEGORIES ({currentSearchResult.categories.length})
          </h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            {currentSearchResult.categories.slice(0, 4).map((category, idx) => (
              <div
                key={category.id}
                onClick={() => onCategoryClick(category.id, category.name)}
                className={`flex items-center justify-between p-3.5 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors ${idx !== 3 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-800">{category.name}</span>
                  {category.productCount > 0 && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{category.productCount}</span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brands Section */}
      {hasBrands && (
        <div>
          <h3 className="text-xs font-bold text-[#4A041D] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Tag className="w-3 h-3" /> {t('brandsSection.brandsLabel')} ({currentSearchResult.brands.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentSearchResult.brands.slice(0, 6).map((brand) => (
              <div
                key={brand.id}
                onClick={() => onBrandClick(brand.slug, brand.name)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-full shadow-sm active:scale-95 transition-all text-xs font-medium text-gray-700"
              >
                {brand.logoUrl ? (
                  <img
                    src={`https://kozmetik-001-site1.qtempurl.com/${brand.logoUrl}`}
                    alt={brand.name}
                    className="w-4 h-4 rounded-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <Tag className="w-3 h-3 text-[#4A041D]" />
                )}
                {brand.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Section */}
      {hasProducts && (
        <div>
          <h3 className="text-xs font-bold text-[#4A041D] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Package className="w-3 h-3" /> PRODUCTS ({currentSearchResult.products.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {currentSearchResult.products.slice(0, 6).map((product) => (
              <div
                key={product.id}
                onClick={(e) => onProductClick(e, product.id)}
                className="bg-white rounded-xl border border-gray-100 p-2 shadow-sm active:scale-95 transition-all"
              >
                <div className="relative w-full aspect-square bg-[#f9f9f9] rounded-lg mb-2 flex items-center justify-center p-2">
                  <img
                    src={`https://kozmetik-001-site1.qtempurl.com/${product.primaryImageUrl}`}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => {
                      e.target.src = '/Icons/logo.jpeg';
                    }}
                  />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-1.5 left-1.5 bg-[#4A041D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                      -{product.discountPercentage}%
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wide truncate mb-0.5">
                    {product.categoryName}
                  </p>
                  <h4 className="text-xs font-semibold text-gray-900 mb-1.5 line-clamp-2 min-h-[2.4em] leading-snug">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {parseFloat(product.discountedPrice || 0) > 0 ? (
                      <>
                        <span className="text-xs font-bold text-[#C5A059]">{product.discountedPrice} ₼</span>
                        {product.price > product.discountedPrice && (
                          <span className="text-[9px] text-gray-300 line-through">
                            {product.price} ₼
                          </span>
                        )}
                      </>
                    ) : parseFloat(product.price) > 0 ? (
                      <span className="text-xs font-bold text-[#C5A059]">{product.price} ₼</span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {searchResult.products.length > 6 && (
            <button
              onClick={onViewAllProducts}
              className="w-full mt-4 py-3 bg-[#4A041D] text-white rounded-xl text-sm font-medium hover:bg-[#3A0318] active:bg-black transition-colors shadow-lg shadow-pink-900/20"
            >
              View all {searchResult.products.length} results
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileSearchDropdown;
