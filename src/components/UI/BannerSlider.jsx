import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useGetBannersQuery, useGetCategoriesQuery, useGetParentCategoriesQuery, API_BASE_URL } from '../../store/API';

const BannerSlider = ({ banners, isLoading, disableAnimation = false }) => {
  const { data: apiBanners, isLoading: apiLoading } = useGetBannersQuery(undefined, { skip: !!banners });

  const bannersD = banners || apiBanners;
  const isBannersLoading = isLoading !== undefined ? isLoading : apiLoading;
  console.log(bannersD);
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannersD?.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [bannersD?.length, isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % bannersD?.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + bannersD?.length) % bannersD?.length);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);



  return (
    <div className='w-full h-full '>
      <div
        className="w-full relative flex-1 overflow-hidden h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Banner Container */}
        <div
          className="flex transition-transform duration-500 h-full w-full ease-in-out "
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannersD?.map((banner, index) => {
            const isActive = index === currentSlide;
            return (
              <div onClick={() => navigate(`${banner.linkUrl}`)} key={banner.id} className="w-full cursor-pointer  flex items-center justify-center flex-shrink-0 h-full relative group">
                {/* Desktop Image */}
                <img
                  className={`hidden md:block w-full h-full object-cover md:rounded-lg lg:p-2 ${isActive && !disableAnimation ? 'animate-ken-burns' : ''}`}
                  src={`${API_BASE_URL}/${banner.imageUrl}`}
                  alt={`Banner ${index + 1}`}
                  onError={(e) => {
                    e.target.src = '/Icons/logo.jpeg';
                    e.target.className = 'hidden md:block  object-contain bg-[#580000] w-[70%] h-[70%] mx-auto '
                  }}
                />

                {/* Mobile Image */}
                <img
                  className={`block md:hidden w-full md:rounded-lg md:h-[40vh] lg:p-2 ${isActive && !disableAnimation ? 'animate-ken-burns' : ''}`}
                  src={banner.mobileImageUrl
                    ? `${API_BASE_URL}/${banner.mobileImageUrl}`
                    : `${API_BASE_URL}/${banner.imageUrl}`}
                  alt={`Banner ${index + 1}`}
                  onError={(e) => {
                    e.target.src = '/Icons/logo.jpeg';
                    e.target.className = 'block md:hidden w-[70%] h-[70%] mx-auto object-contain md:rounded-lg h-[26vh] md:h-[40vh] lg:p-2'
                  }}
                />

                <div className="absolute top-[13%] left-[8%] lg:left-[100px] lg:top-[17%] flex flex-col gap-9 max-w-[80%]">
                  <div className='flex flex-col gap-5'>
                    <h1 className={`${banner.titleVisible ? 'block' : 'hidden'} text-xl lg:text-5xl font-bold font-sans text-[#4A041D] ${isActive ? 'animate-slide-in-right' : 'opacity-0'}`}>
                      {banner.title
                        .split(" ")
                        .map((word, index) => (
                          <React.Fragment key={index}>
                            {word}{" "}
                            {(index + 1) % 3 === 0 && <br />}
                          </React.Fragment>
                        ))}
                    </h1>

                    <p className={`${banner.descriptionVisible ? 'block' : 'hidden'} text-lg lg:text-xl font-sans text-[#4A041D]/80 italic max-w-lg ${isActive ? 'animate-slide-in-right delay-200' : 'opacity-0'}`}>
                      {banner.description
                        .split(" ")
                        .map((word, index) => (
                          <React.Fragment key={index}>
                            {word}{" "}
                            {(index + 1) % 7 === 0 && <br />}
                          </React.Fragment>
                        ))}
                    </p>
                  </div>
                </div>

                {/* Centered Bottom Button - Hover Triggered */}
                {banner.buttonText && banner.buttonVisible && (
                  <div className={`absolute bottom-[25%] left-1/2 -translate-x-1/2 transition-all duration-500 transform ${isActive ? 'opacity-0 group-hover:opacity-100 group-hover:-translate-y-4' : 'opacity-0'}`}>
                    <Link
                      to={`${banner.linkUrl}`}
                      className="px-10 py-4 rounded-full font-sans text-sm lg:text-base bg-[#4A041D] hover:bg-[#9E2A2B] text-white font-bold tracking-[0.2em] uppercase transition-all shadow-xl hover:shadow-[#4A041D]/40 border border-[#C5A059]/30"
                    >
                      {banner.buttonText}
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
        {bannersD?.length > 1 && (
          <>

            <button
              onClick={prevSlide}
              className="hidden lg:block cursor-pointer absolute top-1/2 left-8 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="hidden lg:block absolute top-1/2 right-8 cursor-pointer transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {bannersD?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${currentSlide === index
                    ? 'bg-white shadow-lg scale-110'
                    : 'bg-white/60 hover:bg-white/80'
                    }`}
                />
              ))}
            </div>
          </>
        )}

      </div>

    </div>
  );
};

export default BannerSlider;