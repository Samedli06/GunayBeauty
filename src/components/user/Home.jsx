import React, { act, useEffect, useRef, useState } from 'react'
import HomePageUI from '../UI/HomePageUI'
import { Link } from 'react-router'
import BannerSlider from '../UI/BannerSlider'
import { useAddCartItemMutation, useGetBannersQuery, useGetHotDealsQuery, useGetParentCategoriesQuery, useGetRecommendedQuery, useGetSubCategoriesQuery, useGetBrandsAdminQuery, useGetProductsCategorySlugQuery, API_BASE_URL } from '../../store/API'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import SEO from '../SEO/SEO'
import AOS from 'aos'
import 'aos/dist/aos.css'

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
  <div className="flex-shrink-0 w-[200px] md:w-[240px] lg:w-[260px] h-[400px] bg-white rounded-lg border border-gray-200 p-3 animate-pulse">
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
  const { data: hotDeals, isLoading, error, refetch } = useGetHotDealsQuery({ limit: 8 });
  const { data: recommended, isLoading: isRecommendedLoading } = useGetRecommendedQuery({ limit: 12 });
  const { data: allBrands } = useGetBrandsAdminQuery();
  const [addCartItem, { isLoading: isAddingToCart, error: cartError }] = useAddCartItemMutation();

  const { data: bannersD, isLoading: isBannersLoading } = useGetBannersQuery();
  const { data: giftSets, isLoading: isGiftSetsLoading } = useGetProductsCategorySlugQuery('skin-care');
  const { data: skinCare, isLoading: isSkinCareLoading } = useGetProductsCategorySlugQuery('skin-care');
  const heroBanners = bannersD?.filter(b => b.sortOrder === 0 && b.isActive) || [];
  const middleBanner = bannersD?.find(b => b.sortOrder === 2 && b.isActive);
  const bottomBanners = bannersD?.filter(b => b.sortOrder === 3 && b.isActive) || [];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);


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
    ? parentCategories?.find(cat => cat.id === hoveredCategorie)
    : null;




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
        setUnauthorizedAction('məhsulları səbətə əlavə etmək');
        setShowUnauthorizedModal(true);
      } else {
        toast.error("Məhsulu səbətə əlavə etmək alınmadı");
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
        title="Gunay Beauty - Lüks Kosmetika və Gözəllik"
        description="Gunay Beauty-nin sehrini kəşf edin. Ən yaxşı kosmetika, dəriyə qulluq və gözəllik məhsullarını əldə edin."
        keywords="gözəllik, kosmetika, lüks, makiyaj, dəriyə qulluq, Gunay Beauty"
        image="/Icons/logo.jpeg"
        type="website"
      />
      <main className='bg-[#FDFBF8] pb-20'>

        {/* 1. Hero Section - Full Width */}
        <section className='w-full lg:h-[70vh] relative'>
          <BannerSlider banners={heroBanners} isLoading={isBannersLoading} />
        </section>



        {/* 2. Shop by Category - Visual Tiles */}
        <section className='max-w-[1340px]  px-6  lg:mx-0 px-4 lg:mx-auto lg:px-12 mt-10 lg:mt-24' data-aos="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-sans text-[#4A041D] mb-3">Kategoriyaya görə alış-veriş</h2>
            <p className="text-[#9E2A2B] font-sans italic text-lg">Gözəlliyini kəşf et</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {parentCategories?.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                to={`/categories/${item.slug}`}
                className="group flex flex-col gap-4 cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden bg-white border border-[#F3E7E1] rounded-sm group-hover:shadow-lg transition-all duration-500">
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    <img
                      className="w-full h-full object-cover max- group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      src={item.imageUrl ? `${API_BASE_URL}/${item.imageUrl}` : getCategoryIcon(item.slug)}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = '/Icons/logo2.jpeg';
                        e.target.className = "w-full h-full object-cover opacity-70 ";
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[#4A041D] font-sans text-xs lg:text-sm font-bold tracking-[0.2em] uppercase group-hover:text-[#9E2A2B] transition-colors text-center px-2">
                    {item.name}
                  </span>
                  <div className="w-6 h-[2px] bg-[#C5A059] mt-3 group-hover:w-12 transition-all duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Darlings' Favourites (Hot Deals) */}
        <section className='max-w-[1340px]  px-4 lg:px-12 lg:mx-auto mt-20 lg:mt-32' data-aos="fade-up">
          <div className='flex justify-between items-end mb-10 border-b border-[#F3E7E1] pb-4'>
            <div>
              <h2 className='text-2xl lg:text-3xl font-sans text-[#4A041D]'>Hamının sevimlisi</h2>
              <p className="text-[#9E2A2B] font-sans text-xs tracking-widest uppercase mt-1">Xüsusi təkliflər</p>
            </div>
            <Link to='/products/hot-deals' className='text-[#4A041D] hover:text-[#C5A059] font-sans text-sm font-medium border-b border-[#4A041D] pb-1 transition-colors'>
              Bütün təkliflərə bax
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-4 lg:gap-6 luxury-scrollbar items-stretch pb-4">
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

        {/* Middle Banner Section */}
        {middleBanner && (
          <section className="max-w-[1340px] px-4 lg:px-12 mx-auto mt-20 lg:mt-32" data-aos="fade-up">
            <Link to={middleBanner.linkUrl || "#"} className="block group">
              <div className="relative aspect-[21/9] md:aspect-[25/9] overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={`${API_BASE_URL}${middleBanner.imageUrl}`}
                  alt={middleBanner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-center p-8 lg:p-16">
                  {middleBanner.titleVisible && (
                    <h3 className="text-white text-3xl lg:text-5xl font-bold mb-4 max-w-xl leading-tight">
                      {middleBanner.title}
                    </h3>
                  )}
                  {middleBanner.descriptionVisible && (
                    <p className="text-white/90 text-lg lg:text-xl italic max-w-lg mb-8">
                      {middleBanner.description}
                    </p>
                  )}
                  {middleBanner.buttonVisible && middleBanner.buttonText && (
                    <div>
                      <span className="inline-block px-8 py-3 bg-white text-[#4A041D] font-bold rounded-full uppercase tracking-wider text-sm hover:bg-[#C5A059] hover:text-white transition-colors">
                        {middleBanner.buttonText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Brand Section Side-by-Side */}
        <section className='max-w-[1340px] px-4 lg:px-12 lg:mx-auto mt-20 lg:mt-32' data-aos="fade-up">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">
            {/* Left Side: Header */}
            <div className="lg:w-[320px] shrink-0">
              <h2 className='text-2xl lg:text-3xl font-bold text-[#1a1a1a] mb-3' style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Brendlərimizə baxın
              </h2>
              <p className="text-gray-500 text-sm lg:text-base leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Gözəllik dünyasının ən populyar və sevilən markalarını kəşf edin.
              </p>
            </div>

            {/* Right Side: Cards Row */}
            <div className="flex-1 w-full overflow-x-auto pb-6 luxury-scrollbar">
              <div className="flex gap-4 min-w-max">
                {allBrands?.map((brand) => (
                  <Link
                    key={brand.id}
                    to={`/products/brand/${brand.slug}`}
                    className="group bg-white w-[140px] h-[160px] lg:w-[160px] lg:h-[180px] rounded-xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Brand Logo Container */}
                    <div className="flex-1 flex items-center justify-center mb-3">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={brand.logoUrl ? `${API_BASE_URL}${brand.logoUrl}` : './Icons/logo2.jpeg'}
                          alt={brand.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = './Icons/logo2.jpeg';
                          }}
                        />
                      </div>
                    </div>

                    {/* Brand Name - Small text below logo */}
                    <div className="text-center">
                      <span className="text-[10px] lg:text-xs font-semibold text-gray-600 uppercase tracking-wide leading-tight group-hover:text-[#4A041D] transition-colors line-clamp-2">
                        {brand.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* 5. Recommended For You */}
        <section className='max-w-[1340px]  px-4 lg:px-12 lg:mx-auto mt-20 lg:mt-32' data-aos="fade-up">
          <div className='flex justify-between items-end mb-10 border-b border-[#F3E7E1] pb-4'>
            <div>
              <h2 className='text-2xl lg:text-3xl font-sans text-[#4A041D]'>Sizin üçün seçilmiş</h2>
              <p className="text-[#9E2A2B] font-sans !text-xs tracking-wide uppercase mt-1">Yeni məhsullar və Ən çox satılanlar</p>
            </div>
            <Link to='/products/recommended' className='text-[#4A041D] hover:text-[#C5A059] font-sans text-sm font-medium border-b border-[#4A041D] pb-1 transition-colors'>
              Bütün təkliflərə bax
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-4 lg:gap-6 luxury-scrollbar items-stretch pb-4">
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

        {/* Gift Sets Slider */}
        <section className='max-w-[1340px] px-4 lg:px-12 lg:mx-auto mt-20 lg:mt-32' data-aos="fade-up">
          <div className='flex justify-between items-end mb-10 border-b border-[#F3E7E1] pb-4'>
            <div>
              <h2 className='text-2xl lg:text-3xl font-sans text-[#4A041D]'>Hədiyyə Dəstləri</h2>
              <p className="text-[#9E2A2B] font-sans !text-xs tracking-wide uppercase mt-1">Gözəl hədiyyə seçimləri</p>
            </div>
            <Link to='/products/gift-sets' className='text-[#4A041D] hover:text-[#C5A059] font-sans text-sm font-medium border-b border-[#4A041D] pb-1 transition-colors'>
              Bütün dəstlərə bax
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-4 lg:gap-6 luxury-scrollbar items-stretch pb-4">
            {isGiftSetsLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            ) : (
              giftSets?.map(item => (
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
                />
              ))
            )}
          </div>
        </section>

        {/* Bottom Banners Section */}
        {bottomBanners.length > 0 && (
          <section className='max-w-[1340px] px-4 lg:px-12 lg:mx-auto mt-20 lg:mt-48 pb-10' data-aos="fade-up">
            <div className="flex overflow-x-auto gap-6 pb-6 luxury-scrollbar">
              {bottomBanners.map((banner) => (
                <Link
                  key={banner.id}
                  to={banner.linkUrl || "#"}
                  className="flex-shrink-0 w-[300px] md:w-[450px] group"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
                    <img
                      src={`${API_BASE_URL}${banner.imageUrl}`}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                      {banner.titleVisible && (
                        <h4 className="text-white text-xl font-bold mb-2 group-hover:text-[#C5A059] transition-colors line-clamp-2">
                          {banner.title}
                        </h4>
                      )}
                      {banner.buttonVisible && banner.buttonText && (
                        <div>
                          <span className="text-white text-xs font-bold uppercase tracking-widest border-b border-white pb-1 group-hover:border-[#C5A059] group-hover:text-[#C5A059] transition-all">
                            {banner.buttonText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Skin Care Slider */}
        <section className='max-w-[1340px] px-4 lg:px-12 lg:mx-auto mt-20 lg:mt-32' data-aos="fade-up">
          <div className='flex justify-between items-end mb-10 border-b border-[#F3E7E1] pb-4'>
            <div>
              <h2 className='text-2xl lg:text-3xl font-sans text-[#4A041D]'>Dəriyə Qulluq</h2>
              <p className="text-[#9E2A2B] font-sans !text-xs tracking-wide uppercase mt-1">Sağlam və gözəl dəri üçün</p>
            </div>
            <Link to='/products/skin-care' className='text-[#4A041D] hover:text-[#C5A059] font-sans text-sm font-medium border-b border-[#4A041D] pb-1 transition-colors'>
              Bütün məhsullara bax
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-4 lg:gap-6 luxury-scrollbar items-stretch pb-4">
            {isSkinCareLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            ) : (
              skinCare?.map(item => (
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
                />
              ))
            )}
          </div>
        </section>





      </main >
    </>
  )
}



export default Home