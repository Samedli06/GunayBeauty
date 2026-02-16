import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Breadcrumb } from '../../products/Breadcrumb';

import { FilterSidebar } from '../../products/FilterSidebar';
import { MobileFilterButtons } from '../../products/MobileFilters';
import { ProductCard } from '../../products/ProductCard';
import { Pagination } from '../../products/Pagination';
import CartUtils from '../../components/UI/CartUtils';
import AuthUtils from '../../components/UI/AuthUtils';
import {
  useAddCartItemMutation,
  useGetCategoriesQuery,
  useToggleFavoriteMutation,
  useGetFavoritesQuery,
  useSearchProductsPageQuery,
  useGetProductsCategorySlugPageQuery,
  useGetHotDealsPageQuery,
  useGetRecommendedPageQuery,
  useGetProductsBrandPageQuery,
  useGetProductsPaginatedQuery
} from '../../store/API';
import { toast } from 'react-toastify';
import { useParams, useSearchParams, useLocation } from 'react-router';
import UnauthorizedModal from '../../components/UI/UnauthorizedModal';
import SEO from '../../components/SEO/SEO';
import ProductBanner from '../../components/UI/ProductBanner';

const ProductCardSkeleton = React.memo(() => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="w-full aspect-square bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
    </div>
  </div>
));

function Products() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const locationPath = location.pathname;

  // Get parent category info from navigation state
  const parentCategoryInfo = location.state || null;

  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [unauthorizedAction, setUnauthorizedAction] = useState('');

  // Get search query from URL params
  const searchQuery = searchParams.get('search');
  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');

  // Extract brand slug if this is a brand route - memoize this
  const { isBrandRoute, brandSlug, isHotDeals, isRecommended, isBrand, isSearch, isCategoryParam, isBrandParam, isSpecialSlug } = useMemo(() => {
    const pathParts = locationPath.split('/');
    const isBrandRoute = pathParts.includes('brand');
    const brandSlug = isBrandRoute ? pathParts[pathParts.indexOf('brand') + 1] : null;
    const isHotDeals = slug === 'hot-deals';
    const isRecommended = slug === 'recommended';
    const isBrand = isBrandRoute && brandSlug;
    const isSearch = !!searchQuery;
    const isCategoryParam = !!categoryParam;
    const isBrandParam = !!brandParam;
    const isSpecialSlug = isHotDeals || isRecommended || isBrand || isSearch || isCategoryParam || isBrandParam;

    return { isBrandRoute, brandSlug, isHotDeals, isRecommended, isBrand, isSearch, isCategoryParam, isBrandParam, isSpecialSlug };
  }, [locationPath, slug, searchQuery, categoryParam, brandParam]);

  const categoryName = useMemo(() => {
    if (isHotDeals) return "Qaynar təkliflər";
    if (isRecommended) return "Tövsiyə olunanlar";
    if (isBrand) return brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1);
    if (isSearch) return `"${searchQuery}" üçün axtarış nəticələri`;
    if (isCategoryParam) return categoryParam.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return slug?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Bütün məhsullar";
  }, [isHotDeals, isRecommended, isBrand, isSearch, isCategoryParam, brandSlug, searchQuery, categoryParam, slug]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Query for search results
  const { data: searchResults, isLoading: isSearchLoading } = useSearchProductsPageQuery(
    {
      searchTerm: searchQuery,
      page: currentPage,
      pageSize: 10
    },
    { skip: !isSearch || !searchQuery || searchQuery.length < 2 }
  );

  const { data: productDefault, isLoading: isLoadingProducts } = useGetProductsCategorySlugPageQuery(
    {
      categorySlug: slug,
      page: currentPage,
      pageSize: 10
    },
    { skip: !slug || isSpecialSlug }
  );

  const { data: hotDeals, isLoading: isHotDealsLoading } = useGetHotDealsPageQuery(
    {
      page: currentPage,
      pageSize: 10
    },
    { skip: !isHotDeals }
  );

  const { data: recommended, isLoading: isRecommendedLoading } = useGetRecommendedPageQuery(
    {
      limit: 10,
      page: currentPage,
      pageSize: 10
    },
    { skip: !isRecommended }
  );

  const { data: brandProducts, isLoading: isBrandLoading } = useGetProductsBrandPageQuery(
    {
      brandSlug: brandSlug,
      page: currentPage,
      pageSize: 10
    },
    { skip: !isBrand }
  );

  const { data: allProductsData, isLoading: isLoadingAllProducts } = useGetProductsPaginatedQuery(
    { page: currentPage, pageSize: 10 },
    { skip: !!slug || isSpecialSlug }
  );

  const { data: categories } = useGetCategoriesQuery();
  const { data: favorites } = useGetFavoritesQuery();

  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const [addCartItem] = useAddCartItemMutation();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [addingIds, setAddingIds] = useState(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(() => AuthUtils.isAuthenticated());



  const categoryId = useMemo(() => {
    if (!slug || !categories || isSpecialSlug) return null;

    const category = categories.find(cat =>
      cat.slug.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
    );

    return category?.id;
  }, [slug, categories, isSpecialSlug]);

  const prevDataRef = useRef({});

  useEffect(() => {
    if (filtersApplied) return;

    let newProducts = null;
    let newTotalItems = 0;
    let dataKey = '';

    if (isSearch && searchResults?.items) {
      dataKey = 'search';
      newProducts = searchResults?.items;
      newTotalItems = searchResults?.totalCount;
    } else if (isHotDeals && hotDeals) {
      dataKey = 'hotDeals';
      newProducts = hotDeals?.items;
      newTotalItems = hotDeals?.totalCount;
    } else if (isRecommended && recommended?.items) {
      dataKey = 'recommended';
      newProducts = recommended?.items;
      newTotalItems = recommended?.totalCount;
    } else if (isBrand && brandProducts) {
      dataKey = 'brand';
      newProducts = brandProducts?.items;
      newTotalItems = brandProducts?.totalCount;
    } else if (slug && !isSpecialSlug && productDefault) {
      dataKey = 'category';
      newProducts = productDefault?.items;
      newTotalItems = productDefault?.totalCount;
    } else if (!slug && !isSpecialSlug && allProductsData) {
      dataKey = 'all';
      newProducts = allProductsData?.items;
      newTotalItems = allProductsData.totalCount;
    }

    // Only update if data actually changed
    if (newProducts && (
      prevDataRef.current.key !== dataKey ||
      prevDataRef.current.products !== newProducts ||
      prevDataRef.current.totalItems !== newTotalItems
    )) {
      prevDataRef.current = { key: dataKey, products: newProducts, totalItems: newTotalItems };
      setProducts(newProducts);
      setTotalItems(newTotalItems);
    }
  }, [
    searchResults,
    productDefault,
    hotDeals,
    recommended,
    brandProducts,
    allProductsData,
    filtersApplied,
    isSearch,
    isHotDeals,
    isRecommended,
    isBrand,
    isSpecialSlug,
    slug
  ]);

  // Calculate pagination - memoized
  const totalPages = useMemo(() => Math.ceil(totalItems / itemsPerPage), [totalItems, itemsPerPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterResults = useCallback((data, filters = []) => {
    setActiveFilters(filters);

    if (data === null) {
      setFiltersApplied(false);
      // Reset to appropriate default data
      if (isSearch && searchResults) {
        const searchProducts = searchResults.items || [];
        setProducts(searchProducts);
        setTotalItems(searchResults.totalCount || 0);
      } else if (isHotDeals && hotDeals) {
        setProducts(hotDeals.items || []);
        setTotalItems(hotDeals.totalCount || 0);
      } else if (isRecommended && recommended?.items) {
        setProducts(recommended.items);
        setTotalItems(recommended.totalCount || 0);
      } else if (isBrand && brandProducts) {
        setProducts(brandProducts.items || []);
        setTotalItems(brandProducts.totalCount || 0);
      } else if (slug && productDefault) {
        setProducts(productDefault.items || []);
        setTotalItems(productDefault.totalCount || 0);
      } else if (!slug && allProductsData) {
        setProducts(allProductsData.items || []);
        setTotalItems(allProductsData.totalCount || 0);
      }
    } else if (data?.products) {
      setFiltersApplied(true);
      setProducts(data.products);
      setTotalItems(data.totalCount || data.products?.length);
    } else {
      setFiltersApplied(true);
      setProducts([]);
      setTotalItems(0);
    }
  }, [
    searchResults,
    productDefault,
    allProductsData,
    hotDeals,
    recommended,
    brandProducts,
    isSearch,
    isHotDeals,
    isRecommended,
    isBrand,
    slug
  ]);

  const handleSortChange = useCallback((e) => {
    const value = e.target.value;
    setSortBy(value);
  }, []);

  const handleAddToCart = useCallback(async (id, productData) => {
    if (!id) return;

    setAddingIds(prev => new Set(prev).add(id));

    try {
      if (isAuthenticated) {
        await addCartItem({ productId: id, quantity: 1 }).unwrap();
      } else {
        CartUtils.addItem(productData, 1);
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      console.error(err);
      if (err?.status === 401 || err?.data?.status === 401) {
        toast.error("Xahiş edirik əvvəlcə daxil olun");
      } else {
        toast.error("Məhsulu səbətə əlavə etmək mümkün olmadı");
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
      console.error(err);
      if (err?.status === 401 || err?.data?.status === 401) {
        setUnauthorizedAction('məhsullarla əməliyyat etmək');
        setShowUnauthorizedModal(true);
        setIsAuthenticated(false);
      } else {
        toast.error("Favoritləri yeniləmək mümkün olmadı");
      }
    }
  }, [toggleFavorite]);

  const isProductFavorited = useCallback((productId) => {
    if (!favorites) return false;
    return favorites.includes(productId);
  }, [favorites]);



  // Determine loading state based on slug type - memoized
  const shouldShowLoading = useMemo(() => {
    return isLoading ||
      (isSearch && isSearchLoading && !filtersApplied) ||
      (isHotDeals && isHotDealsLoading && !filtersApplied) ||
      (isRecommended && isRecommendedLoading && !filtersApplied) ||
      (isBrand && isBrandLoading && !filtersApplied) ||
      (slug && !isSpecialSlug && isLoadingProducts && !filtersApplied) ||
      (!slug && !isSpecialSlug && isLoadingAllProducts && !filtersApplied);
  }, [
    isLoading,
    isSearch,
    isSearchLoading,
    isHotDeals,
    isHotDealsLoading,
    isRecommended,
    isRecommendedLoading,
    isBrand,
    isBrandLoading,
    slug,
    isSpecialSlug,
    isLoadingProducts,
    isLoadingAllProducts,
    filtersApplied
  ]);

  // Memoize skeleton array
  const skeletonArray = useMemo(() => Array.from({ length: 6 }), []);

  // Generate SEO data based on current page type
  const seoTitle = useMemo(() => {
    if (isHotDeals) return 'Qaynar təkliflər - Gunay Beauty';
    if (isRecommended) return 'Tövsiyə olunanlar - Gunay Beauty';
    if (isBrand) return `${brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1)} - Gunay Beauty`;
    if (isSearch) return `"${searchQuery}" üçün axtarış nəticələri - Gunay Beauty`;
    if (isCategoryParam) return `${categoryParam.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - Gunay Beauty`;
    if (slug) return `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} - Gunay Beauty`;
    return 'Bütün məhsullar - Gunay Beauty';
  }, [isHotDeals, isRecommended, isBrand, isSearch, isCategoryParam, brandSlug, searchQuery, categoryParam, slug]);

  const seoDescription = useMemo(() => {
    if (isHotDeals) return 'Gunay Beauty-də möhtəşəm qaynar təkliflər. Məhdud vaxt ərzində xüsusi endirimlər.';
    if (isRecommended) return 'Seçilmiş məhsullarımızla tanış olun - Gunay Beauty-dən ən yaxşı keyfiyyət və qiymət.';
    if (isBrand) return `Gunay Beauty-də ${brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1)} məhsullarını əldə edin. Ən yaxşı qiymətlər.`;
    if (isSearch) return `"${searchQuery}" üçün axtarış nəticələri. Gunay Beauty-də ən yaxşı gözəllik məhsullarını tapın.`;
    if (isCategoryParam) return `${categoryParam.replace(/-/g, ' ')} məhsulları Gunay Beauty-də. Keyfiyyətli məhsullar ən yaxşı qiymətə.`;
    if (slug) return `${slug.replace(/-/g, ' ')} məhsulları Gunay Beauty-də. Ən geniş seçim və münasib qiymətlər.`;
    return 'Gunay Beauty-də bütün gözəllik məhsullarına baxın. Peşəkar gözəllik vasitələri və aksesuarları.';
  }, [isHotDeals, isRecommended, isBrand, isSearch, isCategoryParam, brandSlug, searchQuery, categoryParam, slug]);

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`${categoryName}, gözəllik, gunay beauty, Azerbaijan, ${isBrand ? brandSlug : ''}, ${isSearch ? searchQuery : ''}`}
        image="/Icons/logo.png"
        type="website"
      />
      <UnauthorizedModal
        isOpen={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        action={unauthorizedAction}
      />

      <div className="min-h-screen bg-[#f7fafc]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div className='lg:hidden px-4 py-4 border-y-1 border-[#dee2e6] bg-white'>

          <Breadcrumb categoryData={parentCategoryInfo ? {
            parentCategoryName: parentCategoryInfo.parentCategoryName,
            parentCategorySlug: parentCategoryInfo.parentCategorySlug,
            categoryName: categoryName,
            categorySlug: slug
          } : null} />
        </div>

        <div className='lg:hidden bg-white px-4 py-4'>
          <h1 className="text-2xl font-medium text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {categoryName} ({totalItems || 0})
          </h1>
        </div>

        <div className=" mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Banner Section */}
          <ProductBanner />

          <div className='hidden lg:block lg:mb-4'><Breadcrumb categoryData={parentCategoryInfo ? {
            parentCategoryName: parentCategoryInfo.parentCategoryName,
            parentCategorySlug: parentCategoryInfo.parentCategorySlug,
            categoryName: categoryName,
            categorySlug: slug
          } : null} /></div>

          {/* Desktop Filters as Cards */}
          {/* Desktop Filters */}
          <div className="hidden lg:block mb-8">
            <FilterSidebar
              onFilterResults={handleFilterResults}
              onLoadingChange={setIsLoading}
              currentSort={sortBy}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              setCurrentPage={handlePageChange}
              pageSize={itemsPerPage}
              forcedCategoryId={categoryId}
              showCategory={true}
              isHotDeals={isHotDeals}
              isRecommended={isRecommended}
              isBrand={isBrand ? brandSlug : null}
              isSearch={searchQuery}
            />
          </div>

          <div className="flex-1 min-h-[calc(100vh-200px)]">
            <MobileFilterButtons
              onFilterResults={handleFilterResults}
              onLoadingChange={setIsLoading}
              currentSort={sortBy}
              onSortChange={handleSortChange}
              currentPage={currentPage}
              pageSize={itemsPerPage}
              forcedCategoryId={categoryId}
            />



            <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6 items-stretch pb-4">
              {shouldShowLoading ? (
                skeletonArray.map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              ) : products?.length > 0 ? (
                products.map((item) => {
                  const cardInfo = {
                    url: item.primaryImageUrl,
                    name: item.name,
                    priceOriginal: item?.price,
                    price: item?.discountedPrice && item?.discountedPrice > 0 ? item.discountedPrice : item.price,
                    id: item.id,
                    description: item.shortDescription
                  };
                  return (
                    <ProductCard
                      key={item.id}
                      col={true}
                      info={cardInfo}
                      productData={item}
                      handleAddToCart={handleAddToCart}
                      isAddingToCart={addingIds.has(item.id)}
                      toggleFavorite={handleToggleFavorite}
                      isFavorite={isProductFavorited(item.id)}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>Məhsul tapılmadı</p>
                  <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {isSearch ? "Fərqli açar sözləri yoxlayın" : "Filtrləri dəyişməyə çalışın"}
                  </p>
                </div>
              )}
            </div>

            {!shouldShowLoading && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;