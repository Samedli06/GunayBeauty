import React, { useState, useEffect } from 'react';
import { Search, Package, Tag, Grid, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../../store/API';

// Skeleton Components
const CategorySkeleton = () => (
  <div className="flex items-center gap-4 p-3 animate-pulse border-b border-gray-50 last:border-0">
    <div className="w-10 h-10 bg-gray-100 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="h-2 bg-gray-100 rounded w-1/4" />
    </div>
  </div>
);

const BrandSkeleton = () => (
  <div className="flex items-center gap-2 p-2 animate-pulse">
    <div className="w-8 h-8 bg-gray-100 rounded-full" />
    <div className="h-3 bg-gray-100 rounded w-20" />
  </div>
);

const ProductSkeletonDesktop = () => (
  <div className="bg-white rounded-lg p-3 animate-pulse">
    <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3" />
    <div className="space-y-2">
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  </div>
);

const SearchDropdown = ({
  searchQuery,
  searchResult,
  isSearching,
  onProductClick,
  onCategoryClick,
  onBrandClick,
  onViewAllProducts,
  t
}) => {

  const containerStyle = { fontFamily: 'Montserrat, sans-serif' };

  if (searchQuery.length < 2) {
    return (
      <div className="p-8 text-center" style={containerStyle}>
        <div className="w-16 h-16 bg-[#4A041D]/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-[#4A041D]/40" />
        </div>
        <p className="text-[#4A041D] font-medium text-lg mb-1">Axtar</p>
        <p className="text-gray-400 text-sm">Nəticələri görmək üçün yazmağa başlayın...</p>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="p-6 max-h-[70vh] overflow-y-auto" style={containerStyle}>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3 border-r border-gray-100 pr-6 space-y-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => <CategorySkeleton key={i} />)}
            </div>
          </div>
          <div className="col-span-9">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <ProductSkeletonDesktop key={i} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!searchResult || (!searchResult.categories?.length && !searchResult.brands?.length && !searchResult.products?.length)) {
    return (
      <div className="p-12 text-center" style={containerStyle}>
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-900 font-medium text-lg mb-1">Heç bir məhsul tapılmadı</p>
        <p className="text-gray-500 text-sm">"{searchQuery}" üçün nəticə tapılmadı</p>
      </div>
    );
  }

  const hasCategories = searchResult.categories?.length > 0;
  const hasBrands = searchResult.brands?.length > 0;
  const hasProducts = searchResult.products?.length > 0;

  return (
    <div className="max-h-[75vh] overflow-y-auto bg-white" style={containerStyle}>
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar: Categories & Brands */}
        {(hasCategories || hasBrands) && (
          <div className="w-full lg:w-1/4 bg-gray-50/50 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
            {hasCategories && (
              <div className="mb-8">
                <h3 className="text-xs font-bold text-[#4A041D] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Grid className="w-3 h-3" /> Kateqoriyalar
                </h3>
                <div className="space-y-1">
                  {searchResult.categories.slice(0, 5).map((category) => (
                    <div
                      key={category.id}
                      onClick={() => onCategoryClick(category.slug, category.name)}
                      className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-200"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-[#4A041D] font-medium">{category.name}</span>
                      <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#4A041D] opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasBrands && (
              <div>
                <h3 className="text-xs font-bold text-[#4A041D] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Brendlər
                </h3>
                <div className="flex flex-wrap gap-2">
                  {searchResult.brands.slice(0, 8).map((brand) => (
                    <div
                      key={brand.id}
                      onClick={() => onBrandClick(brand.slug, brand.name)}
                      className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-xs font-medium text-gray-600 hover:border-[#4A041D] hover:text-[#4A041D] cursor-pointer transition-colors"
                    >
                      {brand.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Content: Products */}
        <div className={`w-full ${hasCategories || hasBrands ? 'lg:w-3/4' : 'lg:w-full'} p-6`}>
          {hasProducts && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-[#4A041D] uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-3 h-3" /> Məhsullar
                </h3>
                {searchResult.products.length > 4 && (
                  <button onClick={onViewAllProducts} className="text-xs font-semibold text-[#C5A059] hover:text-[#b08d4b] transition-colors">
                    Bütün nəticələrə bax &rarr;
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {searchResult.products.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    onClick={(e) => onProductClick(e, product.id)}
                    className="group bg-white rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-gray-100 hover:ring-[#4A041D]/10 overflow-hidden"
                  >
                    <div className="relative aspect-square bg-gray-50/30 p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={`${API_BASE_URL}/${product.primaryImageUrl}`}
                        alt={product.name}
                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = '/Icons/logo.jpeg'; }}
                      />
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-[#4A041D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{product.discountPercentage}%
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 line-clamp-1">{product.categoryName}</p>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5em] leading-snug group-hover:text-[#4A041D] transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-baseline gap-2">
                        {parseFloat(product.discountedPrice || 0) > 0 ? (
                          <>
                            <span className="text-sm font-bold text-[#C5A059]">{product.discountedPrice} ₼</span>
                            {product.price > product.discountedPrice && (
                              <span className="text-xs text-gray-300 line-through decoration-gray-300">{product.price} ₼</span>
                            )}
                          </>
                        ) : parseFloat(product.price) > 0 ? (
                          <span className="text-sm font-bold text-[#C5A059]">{product.price} ₼</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;