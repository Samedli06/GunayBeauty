import React, { act, useEffect, useRef, useState } from 'react'
import MyMap from '../UI/googleMaps'
import SearchUI from '../UI/SearchUI'
import HomePageUI from '../UI/HomePageUI'
import { Link } from 'react-router'
import BannerSlider from '../UI/BannerSlider'
import { useAddCartItemMutation, useGetBannersQuery, useGetHotDealsQuery, useGetParentCategoriesQuery, useGetRecommendedQuery, useGetSubCategoriesQuery } from '../../store/API'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import InfiniteBrandSlider from '../UI/BrandSlider'
import { useTranslation } from 'react-i18next'
import { translateDynamicField } from '../../i18n'
import SEO from '../SEO/SEO'

// Skeleton Components
const CategorySkeleton = () => (
  <div className="p-2 pl-3 flex gap-2 lg:mb-3 cursor-pointer lg:rounded-2xl min-w-[220px] lg:pr-5 animate-pulse">
    <div className="w-[24px] h-[24px] bg-gray-300 rounded"></div>
    <div className="h-4 bg-gray-300 rounded w-32"></div>
  </div>
);

const SubCategorySkeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-48 mx-auto"></div>
    <div className="grid grid-cols-2 gap-x-10 gap-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 rounded w-24"></div>
      ))}
    </div>
  </div>
);

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-3 animate-pulse">
    <div className="aspect-square bg-gray-300 rounded-lg mb-3"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

const HotDealCardSkeleton = () => (
  <div className="relative py-5 border border-gray-300 bg-white w-full flex flex-col items-center gap-2 animate-pulse">
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[140px] lg:max-w-[160px] h-32 bg-gray-300 rounded"></div>
    </div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mx-2"></div>
    <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 rounded-full"></div>
  </div>
);

const Home = () => {
  const [hoveredCategorie, setHoveredCategorie] = useState(null)
  const [hoveredName, setHoveredName] = useState(null)
  const [activeCategorie, setActiveCategorie] = useState(null)
  const { data: hotDeals, isLoading, error, refetch } = useGetHotDealsQuery({ limit: 12 });
  const { data: recommended, isLoading: isRecommendedLoading } = useGetRecommendedQuery({ limit: 18 });
  const [addCartItem, { isLoading: isAddingToCart, error: cartError }] = useAddCartItemMutation();
  const { t, i18n } = useTranslation();

  // Dynamic translation states
  const [translatedParentCategories, setTranslatedParentCategories] = useState([]);
  const [translatedSubCategories, setTranslatedSubCategories] = useState([]);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [unauthorizedAction, setUnauthorizedAction] = useState('');

  const brands = [
    { src: './slider/slider1.svg', alt: 'LG' },
    { src: './slider/slider2.svg', alt: 'Dell' },
    { src: './slider/slider3.svg', alt: '' },
    { src: './slider/slider4.svg', alt: 'Oppo' },
    { src: './slider/slider5.svg', alt: 'Asus' },
    { src: './slider/slider6.svg', alt: 'Samsung' },
    { src: './slider/slider7.svg', alt: 'HP' },
    { src: './slider/slider8.svg', alt: 'Lenovo' },
    { src: './slider/slider9.svg', alt: 'Apple' },
    { src: './slider/slider10.svg', alt: 'Acer' },
    { src: './slider/slider11.svg', alt: 'Sony' },
    { src: './slider/slider12.svg', alt: 'Microsoft' }
  ];

  // Touch start handler
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  // Touch move handler
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch end handler
  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 500);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 500);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => setIsPaused(false), 500);
      if (scrollRef.current) {
        scrollRef.current.style.cursor = 'grab';
      }
    }
  };



  const { data: parentCategories, isLoading: isParentLoading, refetchCategories } = useGetParentCategoriesQuery();
  const subCategories = hoveredCategorie
    ? parentCategories?.find(cat => cat.id === hoveredCategorie)?.subCategories
    : null;

  // Get the parent category object for breadcrumb navigation
  const parentCategory = hoveredCategorie
    ? (translatedParentCategories.length > 0 ? translatedParentCategories : parentCategories)?.find(cat => cat.id === hoveredCategorie)
    : null;

  // Dynamic translation effect for parent categories
  useEffect(() => {
    async function translateParentCategories() {
      if (!parentCategories || parentCategories.length === 0) return;

      const targetLang = i18n.language;
      if (targetLang === 'en') {
        const translated = await Promise.all(
          parentCategories.map(async (category) => ({
            ...category,
            name: await translateDynamicField(category.name, targetLang),
            subCategories: category.subCategories ? await Promise.all(
              category.subCategories.map(async (subCategory) => ({
                ...subCategory,
                name: await translateDynamicField(subCategory.name, targetLang)
              }))
            ) : category.subCategories
          }))
        );
        setTranslatedParentCategories(translated);
      } else {
        setTranslatedParentCategories(parentCategories);
      }
    }
    translateParentCategories();
  }, [i18n.language, parentCategories]);

  // Dynamic translation effect for sub categories
  useEffect(() => {
    async function translateSubCategories() {
      if (!subCategories || subCategories.length === 0) return;

      const targetLang = i18n.language;
      if (targetLang === 'en') {
        const translated = await Promise.all(
          subCategories.map(async (subCategory) => ({
            ...subCategory,
            name: await translateDynamicField(subCategory.name, targetLang)
          }))
        );
        setTranslatedSubCategories(translated);
      } else {
        setTranslatedSubCategories(subCategories);
      }
    }
    translateSubCategories();
  }, [i18n.language, subCategories]);


  const handleAddToCart = async (id) => {
    if (!id) {
      console.error('Product not available');
      return;
    }

    try {
      const result = await addCartItem({
        productId: id,
        quantity: 1
      }).unwrap();


    } catch (err) {
      console.error('Failed to add product to cart:', err);

      if (err?.status === 401 || err?.data?.status === 401) {
        setUnauthorizedAction('add items to cart');
        setShowUnauthorizedModal(true);
      } else {
        toast.error(t('failedAddToCart'));
      }
    }
  };

  // Category icon mapping
  const getCategoryIcon = (slug) => {
    const iconMap = {
      'ticaret-avadanliqlari': './Icons/banner-commercial.svg',
      'komputerler': './Icons/banner-computers.svg',
      'noutbuklar': './Icons/banner-laptops.svg',
      'musahide-sistemleri': './Icons/banner-surveillance.svg',
      'komputer-avadanliqlari': './Icons/banner-mouse.svg',
      'ofis-avadanliqlari': './Icons/banner-printer.svg',
      'sebeke-avadanliqlari': './Icons/banner-global.svg',
    };
    return iconMap[slug] || './Icons/banner-commercial.svg';
  };



  // Add handler to prevent dragging from interfering with clicks
  const handleBrandClick = (e, slug) => {
    if (isDragging || !slug) {
      e.preventDefault();
    }
  };

  return (
    <>
      <SEO
        title="GunayBeauty - Luxury Cosmetics & Beauty"
        description="Discover the magic of GunayBeauty. Shop the finest cosmetics, skincare, and beauty products."
        keywords="beauty, cosmetics, luxury, makeup, skincare, GunayBeauty"
        image="/Icons/logo.jpeg"
        type="website"
      />
      <main className='bg-[#FDFBF8] pb-20'>

        {/* 1. Hero Section - Full Width */}
        <section className='w-full h-[45vh] lg:h-[70vh] relative'>
          <BannerSlider />
        </section>

        {/* 2. Shop by Category - Visual Tiles */}
        <section className='max-w-[1440px] mx-auto px-4 lg:px-12 mt-16 lg:mt-24'>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif text-[#4A041D] mb-3">{t('Shop by Category')}</h2>
            <p className="text-[#9E2A2B] font-serif italic text-lg">{t('Discover your beauty implementation')}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            {(translatedParentCategories.length > 0 ? translatedParentCategories : parentCategories)?.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                to={`/categories/${item.slug}`}
                className="group flex flex-col items-center gap-4 cursor-pointer"
              >
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-2 border-[#C5A059] p-1 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center relative">
                    {/* Placeholder for category image if not available, using icon for now */}
                    <img className="w-12 h-12 lg:w-16 lg:h-16 object-contain opacity-80 group-hover:opacity-100 transition-opacity" src={getCategoryIcon(item.slug)} alt={item.name} />
                  </div>
                </div>
                <span className="text-[#4A041D] font-sans text-sm font-medium tracking-widest uppercase border-b border-transparent group-hover:border-[#9E2A2B] transition-all">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Darlings' Favourites (Hot Deals) */}
        <section className='max-w-[1440px] mx-auto px-4 lg:px-12 mt-20 lg:mt-32'>
          <div className='flex justify-between items-end mb-10 border-b border-[#F3E7E1] pb-4'>
            <div>
              <h2 className='text-2xl lg:text-3xl font-serif text-[#4A041D]'>{t('Darlings Favourites')}</h2>
              <p className="text-[#9E2A2B] font-sans text-xs tracking-widest uppercase mt-1">Exclusive Offers</p>
            </div>
            <Link to='/products/hot-deals' className='text-[#4A041D] hover:text-[#C5A059] font-sans text-sm font-medium border-b border-[#4A041D] pb-1 transition-colors'>
              {t('View All Offers')}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {isLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            ) : (
              hotDeals?.map(item => (
                <HomePageUI
                  key={item.id}
                  deal={true}
                  product={item}
                  url={item.primaryImageUrl}
                  handleAddToCart={handleAddToCart}
                  isAddingToCart={isAddingToCart}
                  showUnauthorizedModal={showUnauthorizedModal}
                  setShowUnauthorizedModal={setShowUnauthorizedModal}
                  unauthorizedAction={unauthorizedAction}
                  setUnauthorizedAction={setUnauthorizedAction}
                />
              ))
            )}
          </div>
        </section>

        {/* 4. Brand Magic (Slider) */}
        <section className="bg-[#F3E7E1] py-16 mt-20 lg:mt-32">
          <div className='max-w-[1440px] mx-auto px-4 lg:px-12'>
            <h2 className="text-center text-2xl lg:text-3xl font-serif text-[#4A041D] mb-10">{t('Our Luxury Partners')}</h2>
            <InfiniteBrandSlider />
          </div>
        </section>

        {/* 5. Recommended For You */}
        <section className='max-w-[1440px] mx-auto px-4 lg:px-12 mt-20 lg:mt-32'>
          <div className='flex justify-between items-end mb-10 border-b border-[#F3E7E1] pb-4'>
            <div>
              <h2 className='text-2xl lg:text-3xl font-serif text-[#4A041D]'>{t('Chosen For You')}</h2>
              <p className="text-[#9E2A2B] font-sans text-xs tracking-widest uppercase mt-1">New Arrivals & Best Sellers</p>
            </div>
            <Link to='/products/recommended' className='text-[#4A041D] hover:text-[#C5A059] font-sans text-sm font-medium border-b border-[#4A041D] pb-1 transition-colors'>
              {t('View All')}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {isRecommendedLoading ? (
              <>
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            ) : (
              recommended?.recentlyAdded.map(item => (
                <HomePageUI
                  key={item.id}
                  deal={false}
                  product={item}
                  url={item.primaryImageUrl}
                  handleAddToCart={handleAddToCart}
                  isAddingToCart={isAddingToCart}
                  showUnauthorizedModal={showUnauthorizedModal}
                  setShowUnauthorizedModal={setShowUnauthorizedModal}
                  unauthorizedAction={unauthorizedAction}
                  setUnauthorizedAction={setUnauthorizedAction}
                />))
            )}
          </div>
        </section>



      </main>
    </>
  )
}



export default Home