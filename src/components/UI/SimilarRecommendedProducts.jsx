import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToggleFavoriteMutation, useAddCartItemMutation } from '../../store/API';
import { toast } from 'react-toastify';
import CartUtils from './CartUtils';
import AuthUtils from './AuthUtils';
import UnauthorizedModal from './UnauthorizedModal';
import { ProductCard } from '../../products/ProductCard';

// Skeleton Component matching the site's design
const SkeletonProductCard = () => (
  <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden min-w-[150px] md:min-w-[180px] lg:min-w-[270px] h-[280px] lg:h-[350px] flex flex-col">
    <div className="aspect-square bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3 flex-1 flex flex-col">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
      <div className="mt-auto h-6 bg-gray-200 rounded animate-pulse w-1/3" />
    </div>
  </div>
);

const SimilarProducts = ({ products, isLoading }) => {
  const scrollContainerRef = useRef(null);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [unauthorizedAction, setUnauthorizedAction] = useState('');
  const [addCartItem, { isLoading: isAddingToCart }] = useAddCartItemMutation();
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [addingIds, setAddingIds] = useState(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(AuthUtils.isAuthenticated());
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
      toast.success("Səbətə əlavə edildi");
    } catch (err) {
      console.error(err);
      if (err?.status === 401 || err?.data?.status === 401) {
        setUnauthorizedAction('məhsulları səbətə əlavə etmək');
        setShowUnauthorizedModal(true);
      } else {
        toast.error("Məhsulu səbətə əlavə etmək alınmadı");
      }
    } finally {
      setTimeout(() => {
        setAddingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 500);
    }
  }, [isAuthenticated, addCartItem]);

  const handleToggleFavorite = useCallback(async (id) => {
    if (!id) return;

    try {
      await toggleFavorite({ productId: id }).unwrap();
    } catch (err) {
      console.error(err);
      if (err?.status === 401 || err?.data?.status === 401) {
        setUnauthorizedAction('məhsulları sevimlilərə əlavə etmək');
        setShowUnauthorizedModal(true);
      } else {
        toast.error("Sevimliləri yeniləmək mümkün olmadı");
      }
    }
  }, [toggleFavorite]);


  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * 0.8;

      if (direction === 'left') {
        container.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        });
      } else {
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12 mb-8">
        <div className="flex items-center justify-between mb-6 px-4 md:px-0">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="flex space-x-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-10 px-4 md:px-0 luxury-scrollbar">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="min-w-[150px] md:min-w-[180px] lg:min-w-[220px] xl:min-w-[270px] h-[280px] lg:h-[350px]">
              <SkeletonProductCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 mb-12">
      <UnauthorizedModal
        isOpen={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        action={unauthorizedAction}
      />

      <div className="flex items-center justify-between mb-8 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold text-[#4A041D]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Oxşar məhsullar
        </h2>

        {/* Navigation Buttons */}
        <div className="hidden md:flex space-x-3">
          <button
            onClick={() => scroll('left')}
            className="p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-[#4A041D] hover:text-white hover:border-[#4A041D] transition-all duration-300 text-gray-600 group"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-3 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-[#4A041D] hover:text-white hover:border-[#4A041D] transition-all duration-300 text-gray-600 group"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product List */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto items-stretch gap-4 pb-10 px-4 md:px-0 luxury-scrollbar snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product) => {
          const cardInfo = {
            url: product.primaryImageUrl,
            name: product.name,
            priceOriginal: product.price,
            price: product.discountedPrice && product.discountedPrice > 0 ? product.discountedPrice : product.price,
            id: product.id,
            description: product.description || product.shortDescription,
            discountPercentage: product.discountPercentage,
            isHotDeal: product.isHotDeal
          };

          return (
            <div key={product.id} className="snap-start h-full">
              <ProductCard
                col={true}
                info={cardInfo}
                productData={product}
                handleAddToCart={handleAddToCart}
                isAddingToCart={addingIds.has(product.id)}
                toggleFavorite={handleToggleFavorite}
                compact={true}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SimilarProducts;