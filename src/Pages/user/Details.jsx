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
  API_BASE_URL,
} from '../../store/API';
import { toast } from 'react-toastify';
import SimilarProducts from '../../components/UI/SimilarRecommendedProducts';
import QuickOrderModal from '../../components/UI/QuickOrderModal';
import CartUtils from '../../components/UI/CartUtils';
import AuthUtils from '../../components/UI/AuthUtils';
import UnauthorizedModal from '../../components/UI/UnauthorizedModal';
import { useTranslation } from 'react-i18next';
import { translateDynamicField } from '../../i18n';
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
  const { t, i18n } = useTranslation();
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

  // Dynamic translation states
  const [translatedProduct, setTranslatedProduct] = useState(null);
  const [translatedProductSpec, setTranslatedProductSpec] = useState(null);

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

  // Dynamic translation effect
  useEffect(() => {
    async function translateProductData() {
      if (!product) return;

      const targetLang = i18n.language;
      if (targetLang === 'en') {
        const translated = { ...product };
        if (product.name) translated.name = await translateDynamicField(product.name, targetLang);
        if (product.description) translated.description = await translateDynamicField(product.description, targetLang);
        if (product.shortDescription) translated.shortDescription = await translateDynamicField(product.shortDescription, targetLang);
        if (product.categoryName) translated.categoryName = await translateDynamicField(product.categoryName, targetLang);
        setTranslatedProduct(translated);
      } else {
        setTranslatedProduct(product);
      }
    }
    translateProductData();
  }, [i18n.language, product]);

  // Dynamic translation effect for product specifications
  useEffect(() => {
    async function translateProductSpec() {
      if (!productSpec) return;

      const targetLang = i18n.language;
      if (targetLang === 'en') {
        const translated = { ...productSpec };
        if (productSpec.specificationGroups) {
          translated.specificationGroups = await Promise.all(
            productSpec.specificationGroups.map(async (group) => ({
              ...group,
              items: group.items ? await Promise.all(
                group.items.map(async (item) => ({
                  ...item,
                  name: await translateDynamicField(item.name, targetLang),
                  value: await translateDynamicField(item.value, targetLang)
                }))
              ) : group.items
            }))
          );
        }
        setTranslatedProductSpec(translated);
      } else {
        setTranslatedProductSpec(productSpec);
      }
    }
    translateProductSpec();
  }, [i18n.language, productSpec]);

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
        setUnauthorizedAction('add items to favorites');
        setShowUnauthorizedModal(true);
      } else {
        toast.error("Failed to update favorites");
      }
    }
  };

  const handleDownloadPdf = async () => {
    if (!product?.id) { toast.error("Product not loaded"); return; }
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const headers = { 'Accept': '*/*' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`https://kozmetik-001-site1.qtempurl.comapi/v1/product-pdfs/download/product/${product.id}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`Failed to download PDF: ${response.status}`);
      const blob = await response.blob();
      if (blob.size === 0) throw new Error('Downloaded file is empty');

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
      toast.error("No file exists for this product.");
    }
  };

  useEffect(() => {
    if (error?.status === 401 || error?.data?.status === 401) {
      setUnauthorizedAction('view this product');
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
      toast.error("Failed to add product to cart");
    }
  };

  const handleShare = async (platform) => {
    const productUrl = window.location.href;
    const productTitle = product.name;
    const productDescription = product.shortDescription || `Check out ${product.name}`;

    if (platform === 'native') {
      if (navigator.share) {
        try {
          await navigator.share({ title: productTitle, text: productDescription, url: productUrl });
          setShowShareMenu(false);
        } catch (error) { if (error.name !== 'AbortError') toast.error('Failed to share'); }
      } else { toast.info('Share API not supported on this browser'); }
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(productUrl);
        setShowShareMenu(false);
        toast.success("Link copied!");
      } catch (error) { toast.error('Failed to copy link'); }
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
    const currentProductSpec = translatedProductSpec || productSpec;
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
    const currentProductSpec = translatedProductSpec || productSpec;
    if (currentProductSpec && currentProductSpec.specificationGroups) {
      currentProductSpec.specificationGroups.forEach(group => {
        if (group.items && Array.isArray(group.items)) {
          group.items.forEach(item => {
            const duplicateFields = ['sku', 'category', 'stock status', 'availability'];
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const currentProduct = translatedProduct || product;
  const features = getFeatures(currentProduct, productSpec);
  const productImageUrl = product?.imageUrl ? `https://kozmetik-001-site1.qtempurl.com${product.imageUrl}` : '/Icons/logo.jpeg';
  const productImages = product?.images ? product.images.map(img => `https://kozmetik-001-site1.qtempurl.com${img.imageUrl}`) : [];

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
        title={`${currentProduct?.name || 'Product'} - GunayBeauty`}
        description={currentProduct?.description || currentProduct?.shortDescription || `Buy ${currentProduct?.name} at GunayBeauty.`}
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
              src={`https://kozmetik-001-site1.qtempurl.com${modalSlideIndex === 0 ? product?.imageUrl : product?.images?.[modalSlideIndex - 1]?.imageUrl}`}
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
          <div className="lg:col-span-7 relative lg:sticky lg:top-24 z-10">
            <div className='flex flex-col-reverse lg:flex-row gap-6'>
              {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] hide-scrollbar py-2 lg:py-4 px-1 min-w-[80px] lg:min-w-[120px]">
                {/* Main thumb */}
                <div
                  onClick={() => { setHovered(null); openDetail(0); }}
                  onMouseEnter={() => setHovered(null)}
                  className={`flex-shrink-0 w-20 h-20 lg:w-28 lg:h-28 rounded-2xl bg-white p-2 cursor-pointer border-2 transition-all duration-300 ${!hovered ? 'border-[#4A041D] shadow-lg scale-105' : 'border-transparent shadow-sm hover:border-gray-200'}`}
                >
                  <img src={productImageUrl} alt="Main" className="w-full h-full object-contain" onError={(e) => { e.target.src = '/Icons/logo.jpeg' }} />
                </div>

                {/* Additional thumbs */}
                {product?.images?.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setHovered(img.imageUrl); openDetail(idx + 1); }}
                    onMouseEnter={() => setHovered(img.imageUrl)}
                    className={`flex-shrink-0 w-20 h-20 lg:w-28 lg:h-28 rounded-2xl bg-white p-2 cursor-pointer border-2 transition-all duration-300 ${hovered === img.imageUrl ? 'border-[#4A041D] shadow-lg scale-105' : 'border-transparent shadow-sm hover:border-gray-200'}`}
                  >
                    <img src={`https://kozmetik-001-site1.qtempurl.com${img.imageUrl}`} alt={`Thumb ${idx}`} className="w-full h-full object-contain" onError={(e) => { e.target.src = '/Icons/logo.jpeg' }} />
                  </div>
                ))}
              </div>

              {/* Main Image Display */}
              <div className="flex-1 bg-white rounded-3xl p-4 lg:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] min-h-[300px] lg:min-h-[500px]  lg:max-h-[700px] flex items-center justify-center relative group">
                <img
                  src={hovered ? `https://kozmetik-001-site1.qtempurl.com${hovered}` : productImageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                  onClick={() => {
                    const idx = hovered ? product?.images?.findIndex(i => i.imageUrl === hovered) : -1;
                    openDetail(idx !== -1 ? idx + 1 : 0);
                  }}
                  onError={(e) => { e.target.src = '/Icons/logo.jpeg' }}
                />
                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => handleToggleFavorite(id)} className="p-3 bg-white shadow-md rounded-full hover:bg-[#4A041D] hover:text-white transition-colors group/btn">
                    <Heart className={`w-5 h-5 text-gray-400 group-hover/btn:text-white ${favoriteStatus?.isFavorite ? 'fill-[#4A041D] text-[#4A041D]' : ''}`} />
                  </button>
                  <button onClick={() => setShowShareMenu(true)} className="p-3 bg-white shadow-md rounded-full hover:bg-[#4A041D] hover:text-white transition-colors">
                    <Share2 className="w-5 h-5 text-gray-400 hover:text-white" />
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
                    <Check size={12} className="mr-1" /> {t("features.inStock")}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                    <X size={12} className="mr-1" /> {t("features.outOfStock")}
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
                    className="col-span-1 py-4 px-6 bg-[#4A041D] hover:bg-[#6D082D] text-white rounded-2xl font-bold text-md shadow-lg shadow-[#4A041D]/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? <Loader2 className="animate-spin" /> : <ShoppingBag size={21} />}
                    {t('addToCart')}
                  </button>
                  <button
                    onClick={() => setShowQuickOrderModal(true)}
                    disabled={!isInStock}
                    className="col-span-1 py-4 px-6 bg-white border-2 border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white rounded-2xl font-bold text-md transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {t('buyNow')}
                  </button>
                </div>
              </div>
            </div>

            {/* Description & Features (Moved to Right Column) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
              <h3 className="text-xl font-bold text-[#4A041D] mb-6 border-b border-gray-100 pb-2">{t('features.title')}</h3>

              {features.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {features.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
                      <span className="text-gray-500 font-medium">{item.label}</span>
                      <span className="text-gray-900 font-semibold text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No additional features available.</p>
              )}

              {currentProduct.description && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-[#4A041D] mb-3">Product Description</h4>
                  <div className="prose prose-stone text-gray-600 leading-relaxed">
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
              <h3 className="text-lg font-bold text-[#4A041D]">Share Product</h3>
              <button onClick={() => setShowShareMenu(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleShare('copy')} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Copy size={24} /></div>
                <span className="font-medium text-sm">Copy Link</span>
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