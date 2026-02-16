import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Heart, Download, Share2, Minus, Plus, X, Check, Copy, MessageCircle, Send, Loader2, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Breadcrumb } from '../../products/Breadcrumb';

import {
  useGetProductQuery,
  useGetProductSpecificationsQuery,
  useAddCartItemMutation,
  useToggleFavoriteMutation,
  useGetFavoriteStatusQuery,
  useGetRecommendedQuery,
  useGetMeQuery,
  useGetRecommendedPageQuery,
  API_BASE_URL
} from '../../store/API';
import { toast } from 'react-toastify';
import SimilarProducts from '../../components/UI/SimilarRecommendedProducts';
import QuickOrderModal from '../../components/UI/QuickOrderModal';
import CartUtils from '../../components/UI/CartUtils';
import AuthUtils from '../../components/UI/AuthUtils';
import UnauthorizedModal from '../../components/UI/UnauthorizedModal';
import SEO from '../../components/SEO/SEO';

// Skeleton Components
const SkeletonBox = ({ className = "", width, height }) => (
  <div
    className={`bg-gray-200 animate-pulse rounded-lg ${className}`}
    style={{ width, height }}
  />
);

const ImageSkeleton = () => (
  <div className='flex gap-4 h-[600px]'>
    <div className='flex flex-col gap-4 w-24'>
      {[1, 2, 3, 4].map(i => <div key={i} className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse" />)}
    </div>
    <div className="flex-1 bg-gray-200 animate-pulse rounded-3xl h-full w-full" />
  </div>
);

const DesktopDetailsSkeleton = () => (
  <div className="hidden md:block max-w-[95vw] mx-auto px-6 pb-12 pt-8">
    <div className="mb-8">
      <SkeletonBox className="w-48 h-6" />
    </div>
    <div className="grid grid-cols-12 gap-12">
      <div className="col-span-7">
        <ImageSkeleton />
      </div>
      <div className="col-span-5 space-y-8">
        <SkeletonBox className="w-3/4 h-10" />
        <SkeletonBox className="w-1/2 h-8" />
        <SkeletonBox className="w-full h-32" />
        <SkeletonBox className="w-full h-12" />
        <SkeletonBox className="w-full h-12" />
      </div>
    </div>
  </div>
);

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [hovered, setHovered] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiperRef, setSwiperRef] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [unauthorizedAction, setUnauthorizedAction] = useState('');
  const { data: recommendation, isRecLoading } = useGetRecommendedQuery({ limit: 6 })
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalSlideIndex, setModalSlideIndex] = useState(0);
  const [showQuickOrderModal, setShowQuickOrderModal] = useState(false);
  const { data: me, isLoading: isMeLoading } = useGetMeQuery();
  const [isAuthenticated, setIsAuthenticated] = useState(false);



  useEffect(() => {
    setIsAuthenticated(AuthUtils.isAuthenticated());
  }, []);

  const openDetail = (initialIndex = 0) => {
    setModalSlideIndex(initialIndex);
    setShowDetailModal(true);
  };

  const closeDetail = () => {
    setShowDetailModal(false);
  };

  const nextModalSlide = () => {
    const total = (product?.images?.length || 0) + 1;
    setModalSlideIndex((prev) => (prev + 1) % total);
  };

  const prevModalSlide = () => {
    const total = (product?.images?.length || 0) + 1;
    setModalSlideIndex((prev) => (prev - 1 + total) % total);
  };

  // RTK Query hooks
  const { data: product, isLoading: loading, error, isError } = useGetProductQuery(id, { skip: !id });
  const { data: productSpec, isLoading: isSpecLoading } = useGetProductSpecificationsQuery(product?.id, { skip: !product?.id });
  const { data: favoriteStatus } = useGetFavoriteStatusQuery({ productId: product?.id }, { skip: !product?.id });
  const { data: similar, isLoading: isSimilarLoading } = useGetRecommendedPageQuery({
    categoryId: product?.categoryId,
    page: 1,
    pageSize: 6
  });

  const [showSuccess, setShowSuccess] = useState(false);





  const [toggleFavorite] = useToggleFavoriteMutation();
  const [addCartItem, { isLoading: isAddingToCart, error: cartError }] = useAddCartItemMutation();

  const isInStock = product?.stockQuantity > 0;

  useEffect(() => {
    if (!isAddingToCart && showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAddingToCart, showSuccess]);

  const handleToggleFavorite = async (productId) => {
    if (!productId) return;
    try {
      await toggleFavorite({ productId }).unwrap();
    } catch (err) {
      console.error(err);
      if (err?.status === 401 || err?.data?.status === 401) {
        setUnauthorizedAction('məhsulları sevimlilərə əlavə etmək');
        setShowUnauthorizedModal(true);
      } else {
        toast.error("Favoritləri yeniləmək mümkün olmadı");
      }
    }
  };

  const handleDownloadPdf = async () => {
    if (!product?.id) { toast.error("Məhsul yüklənməyib"); return; }
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const headers = { 'Accept': '*/*' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/api/v1/product-pdfs/download/product/${product.id}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`PDF yüklənməsi uğursuz oldu: ${response.status} `);
      const blob = await response.blob();
      if (blob.size === 0) throw new Error('Yüklənmiş fayl boşdur');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${product.name.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Bu məhsul üçün fayl yoxdur.");
    }
  };

  useEffect(() => {
    if (error?.status === 401 || error?.data?.status === 401) {
      setUnauthorizedAction('məhsula baxmaq');
      setShowUnauthorizedModal(true);
    }
  }, [error]);

  const handleAddToCart = async () => {
    if (!product || !id) return;
    try {
      if (isAuthenticated && handleAddToCart) {
        await addCartItem({ productId: id, quantity: quantity }).unwrap();
      } else {
        CartUtils.addItem(product, quantity);
        // Dispatch event is already handled in CartUtils.addItem but good to be explicit if using hook too
        // window.dispatchEvent(new Event("cartUpdated")); // Handled in CartUtils
      }
      setShowSuccess(true);
      window.dispatchEvent(new Event('cartAnimation'));
    } catch (err) {
      console.error('Failed to add product to cart:', err);
      toast.error("Məhsulu səbətə əlavə etmək mümkün olmadı");
    }
  };

  const handleShare = async (platform) => {
    const productUrl = window.location.href;
    const productTitle = product.name;
    const productDescription = product.shortDescription || `${product.name} məhsuluna baxın`;

    if (platform === 'native') {
      if (navigator.share) {
        try {
          await navigator.share({ title: productTitle, text: productDescription, url: productUrl });
          setShowShareMenu(false);
        } catch (error) { if (error.name !== 'AbortError') toast.error('Paylaşmaq mümkün olmadı'); }
      } else { toast.info('Paylaşma API bu brauzer tərəfindən dəstəklənmir'); }
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(productUrl);
        setShowShareMenu(false);
        toast.success("Link kopyalandı!");
      } catch (error) { toast.error('Linki kopyalamaq mümkün olmadı'); }
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(productTitle + ' - ' + productUrl)}`, '_blank');
      setShowShareMenu(false);
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productTitle)}`, '_blank');
      setShowShareMenu(false);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const getSpecifications = (product, productSpec) => {
    if (!product) return [];
    const specs = [];
    const currentProductSpec = productSpec;
    if (currentProductSpec && currentProductSpec.specificationGroups) {
      currentProductSpec.specificationGroups.forEach(group => {
        if (group.items && Array.isArray(group.items)) {
          group.items.forEach(item => {
            const basicFields = ['sku', 'category', 'stock status', 'availability', 'name'];
            if (!basicFields.includes(item.name.toLowerCase())) {
              const spec = item.unit ? `${item.value} ${item.unit}` : item.value;
              specs.push(spec);
            }
          });
        }
      });
    }
    return specs.length === 0 ? [] : specs;
  };

  const getFeatures = (product, productSpec) => {
    if (!product) return [];
    const features = [];
    const currentProductSpec = productSpec;
    if (currentProductSpec && currentProductSpec.specificationGroups) {
      currentProductSpec.specificationGroups.forEach(group => {
        if (group.items && Array.isArray(group.items)) {
          group.items.forEach(item => {
            console.log(item.name.toLowerCase());
            const duplicateFields = ['sku', 'category', 'stock status', 'availability', 'hot deal'];
            if (!duplicateFields.includes(item.name.toLowerCase())) {
              const value = item.unit ? `${item.value} ${item.unit}` : item.value;
              features.push({ label: item.name, value: value });
            }
          });
        }
      });
    }
    return features;
  };

  if (loading || isSpecLoading) {
    return <DesktopDetailsSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="min-h-[70vh] bg-[#FCFCFC] flex items-center justify-center font-sans">
        <div className="text-center">
          <X className="w-16 h-16 text-[#4A041D] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Məhsul tapılmadı</h2>
          <p className="text-gray-600">Axtardığınız məhsul mövcud deyil.</p>
        </div>
      </div>
    );
  }

  const currentProduct = product;
  const features = getFeatures(currentProduct, productSpec);
  const productImageUrl = product?.imageUrl ? `${API_BASE_URL}${product.imageUrl}` : '/Icons/logo.jpeg';
  const productImages = product?.images ? product.images.map(img => `${API_BASE_URL}${img.imageUrl}`) : [];

  const productForSEO = product ? {
    ...product,
    name: currentProduct.name,
    description: currentProduct.description || currentProduct.shortDescription,
    imageUrl: productImageUrl,
    images: productImages,
    brandName: product.brandName,
    categoryName: currentProduct.categoryName,
    price: product.price || 0,
    discountedPrice: product.discountedPrice || 0,
  } : null;

  return (
    <section className="bg-[#FCFCFC] min-h-screen font-sans" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <SEO
        title={`${currentProduct?.name || 'Məhsul'} - Gunay Beauty`}
        description={currentProduct?.description || currentProduct?.shortDescription || `Gunay Beauty - də ${currentProduct?.name} alın.`}
        image={productImageUrl}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="product"
        product={productForSEO}
      />

      <UnauthorizedModal
        isOpen={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        action={unauthorizedAction}
      />

      <QuickOrderModal
        isOpen={showQuickOrderModal}
        onClose={() => setShowQuickOrderModal(false)}
        product={product}
        quantity={quantity}
      />

      {/* Image Detail Modal */}
      {showDetailModal && (
        <section className="fixed inset-0 w-screen h-screen bg-white/95 backdrop-blur-sm z-[10000]">
          <X onClick={closeDetail} className="absolute top-8 right-8 cursor-pointer hover:rotate-90 transition-transform w-10 h-10 text-[#4A041D] z-10" />
          <button onClick={prevModalSlide} className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-all z-10">
            <ChevronLeft className="w-8 h-8 text-[#4A041D]" />
          </button>
          <button onClick={nextModalSlide} className="absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-all z-10">
            <ChevronRight className="w-8 h-8 text-[#4A041D]" />
          </button>

          <div className="w-full h-full flex items-center justify-center p-8">
            <img
              src={`${API_BASE_URL}${modalSlideIndex === 0 ? product?.imageUrl : product?.images?.[modalSlideIndex - 1]?.imageUrl}`}
              alt={product?.name}
              className="max-w-[90vw] max-h-[85vh] object-contain drop-shadow-2xl"
              onError={(e) => { e.target.src = '/Icons/logo.jpeg' }}
            />
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-[95vw]  mx-auto px-4 md:px-8 pb-16 pt-6">
        <div className="mb-6">
          <Breadcrumb productData={product} />
        </div>

        {/* Desktop 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start">

          {/* Left Column: Sticky Images */}
          {/* Left Column: Sticky Images (Desktop Only) */}
          <div className="lg:col-span-7 relative lg:sticky lg:top-24">
            <div className="flex flex-row gap-4 lg:gap-6 h-[400px] md:h-[500px] lg:h-[600px]">
              {/* Thumbnails - Always on the side (Left) */}
              <div className="flex flex-col gap-3 lg:gap-4 lg:px-1 overflow-y-auto overflow-x-hidden hide-scrollbar w-16 md:w-20 lg:w-28 flex-shrink-0 h-full">
                {/* Main thumb */}
                <div
                  onClick={() => { setHovered(null); openDetail(0); }}
                  onMouseEnter={() => setHovered(null)}
                  className={`aspect-square rounded-xl bg-white p-1.5 lg:p-2 lg:m-1 cursor-pointer border-2 transition-all duration-300 ${!hovered ? 'border-[#4A041D] shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <img src={productImageUrl} alt="Əsas" className="w-full h-full object-contain" onError={(e) => { e.target.src = '/Icons/logo.jpeg' }} />
                </div>

                {/* Additional thumbs */}
                {product?.images?.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setHovered(img.imageUrl); openDetail(idx + 1); }}
                    onMouseEnter={() => setHovered(img.imageUrl)}
                    className={`aspect-square rounded-xl bg-white p-1.5 lg:p-2 cursor-pointer border-2 transition-all duration-300 ${hovered === img.imageUrl ? 'border-[#4A041D] shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    <img src={`${API_BASE_URL}${img.imageUrl}`} alt={`Thumb ${idx}`} className="w-full h-full object-contain" onError={(e) => { e.target.src = '/Icons/logo.jpeg' }} />
                  </div>
                ))}
              </div>

              {/* Main Image Display */}
              <div className="flex-1 bg-white rounded-3xl p-4 lg:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 flex items-center justify-center relative group overflow-hidden h-full">
                <img
                  src={hovered ? `${API_BASE_URL}${hovered}` : productImageUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                  onClick={() => {
                    const idx = hovered ? product?.images?.findIndex(i => i.imageUrl === hovered) : -1;
                    openDetail(idx !== -1 ? idx + 1 : 0);
                  }}
                  onError={(e) => { e.target.src = '/Icons/logo.jpeg' }}
                />

                {/* Floating Action Buttons */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 lg:translate-x-12 lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-500">
                  <button
                    onClick={() => handleToggleFavorite(id)}
                    className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full hover:bg-[#4A041D] hover:text-white transition-all transform hover:scale-110 group/btn"
                    title="Seçilmişlərə əlavə et"
                  >
                    <Heart className={`w-5 h-5 ${favoriteStatus?.isFavorite ? 'fill-[#4A041D] text-[#4A041D] group-hover/btn:fill-white group-hover/btn:text-white' : 'text-gray-600 group-hover/btn:text-white'}`} />
                  </button>
                  <button
                    onClick={() => setShowShareMenu(true)}
                    className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-full hover:bg-[#4A041D] hover:text-white transition-all transform hover:scale-110"
                    title="Paylaş"
                  >
                    <Share2 className="w-5 h-5 text-gray-600 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">

            {/* Header Info */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-4">
                {isInStock ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FDFBF8] text-[#4A041D] border border-[#4A041D]/20">
                    <Check size={12} className="mr-1" /> Stokda var
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                    <X size={12} className="mr-1" /> Stokda yoxdur
                  </span>
                )}
                {product.brandName && (
                  <span className="text-xs font-bold text-[#4A041D] tracking-wider uppercase">{product.brandName}</span>
                )}
              </div>

              <h1 className="text-2xl lg:text-4xl font-bold text-[#4A041D] mb-4 leading-tight">{currentProduct.name}</h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl lg:text-4xl font-bold text-[#C5A059]">
                  {product.discountedPrice > 0 ? product.discountedPrice : product.price} ₼
                </span>
                {(product.discountedPrice > 0 && product.price > product.discountedPrice) && (
                  <span className="text-lg lg:text-xl text-gray-400 line-through">
                    {product.price} ₼
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed text-sm lg:text-lg mb-8">
                {currentProduct.shortDescription || currentProduct.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-4">
                {isInStock && (
                  <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-2xl w-fit">
                    <button onClick={() => handleQuantityChange(-1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-[#4A041D] transition-colors"><Minus size={18} /></button>
                    <span className="w-12 text-center text-xl font-semibold text-[#4A041D]">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-[#4A041D] transition-colors"><Plus size={18} /></button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!isInStock || isAddingToCart}
                    className="col-span-1 py-4 px-6 bg-[#4A041D] hover:bg-[#6D082D] text-white rounded-2xl font-bold text-xs shadow-lg shadow-[#4A041D]/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? <Loader2 className="animate-spin" /> : <ShoppingBag size={21} />}
                    Səbətə əlavə et
                  </button>
                  <button
                    onClick={() => setShowQuickOrderModal(true)}
                    disabled={!isInStock}
                    className="col-span-1 py-4 px-6 bg-white border-2 border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white rounded-2xl font-bold text-xs transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    İndi al
                  </button>
                </div>
              </div>
            </div>

            {/* Description & Features (Moved to Right Column) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
              <h3 className="!text-sm md:!text-base lg:!text-xl font-bold text-[#4A041D] mb-6 border-b border-gray-100 pb-2">Xüsusiyyətlər</h3>

              {features.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {features.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 px-2 rounded-lg transition-colors">
                      <span className="!text-sm text-gray-500 font-medium">{item.label}</span>
                      <span className="!text-sm text-gray-900 font-semibold text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">Əlavə xüsusiyyət yoxdur.</p>
              )}

              {currentProduct.description && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="!text-sm md:!text-base lg:!text-xl font-bold text-[#4A041D] mb-3">Məhsulun təsviri</h4>
                  <div className="!text-sm md:!text-base lg:!text-lg prose prose-stone text-gray-600 leading-relaxed">
                    {currentProduct.description}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Similar Products (Keep at bottom) */}
        <div className="mt-20">
          <SimilarProducts products={similar?.items} isLoading={isRecLoading} />
        </div>
      </div>

      {/* Share Menu Overlay */}
      {showShareMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setShowShareMenu(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#4A041D]">Məhsulu paylaş</h3>
              <button onClick={() => setShowShareMenu(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleShare('copy')} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Copy size={24} /></div>
                <span className="font-medium text-sm">Linki kopyala</span>
              </button>
              <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600"><MessageCircle size={24} /></div>
                <span className="font-medium text-sm">WhatsApp</span>
              </button>
              <button onClick={() => handleShare('telegram')} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600"><Send size={24} /></div>
                <span className="font-medium text-sm">Telegram</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default Details;