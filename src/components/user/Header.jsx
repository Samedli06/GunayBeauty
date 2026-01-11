import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { useGetCartCountQuery, useGetFavoritesCountQuery, useGetMeQuery, useSearchProductsQuery, useUpdateCartItemQuantityMutation } from "../../store/API";
import { Search, X } from 'lucide-react';
import { SearchContext } from '../../router/Context';
import { FaRegFile, FaRegUser, FaRegUserCircle, FaUserCircle } from 'react-icons/fa';
import { PiCarProfile } from 'react-icons/pi';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import SearchDropdown from '../UI/SearchDropdown';
import MobileSearchDropdown from '../UI/MobileSearchDropdown';
import UnauthorizedModal from '../UI/UnauthorizedModal';

// Helper function to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const Header = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  // Initialize language from cookie or default to 'en'
  const [selected, setSelected] = useState(() => {
    const savedLang = getCookie('language');
    return savedLang || i18next.language || 'en';
  });

  const { t } = useTranslation();
  const { searchOpen, setSearchOpen } = useContext(SearchContext);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const mobileSearchDropdownRef = useRef(null);
  const hasToken = document.cookie.split('; ').some(row => row.startsWith('token='));
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false)
  const [unauthorizedAction, setUnauthorizedAction] = useState('')

  const { data: cartCountData } = useGetCartCountQuery(undefined, {
    skip: !hasToken,
  });
  const { data: favoritesCount } = useGetFavoritesCountQuery(undefined, {
    skip: !hasToken,
  });

  const [cartCount, setCartCount] = useState(() => {
    const localCart = JSON.parse(localStorage.getItem("ecommerce_cart")) || { items: [] };
    return localCart.items.length;
  });

  // ✅ handle both cases safely
  useEffect(() => {
    if (hasToken && cartCountData !== undefined) {
      setCartCount(cartCountData);
    } else if (!hasToken) {
      const localCart = JSON.parse(localStorage.getItem("ecommerce_cart")) || { items: [] };
      setCartCount(localCart.items.length);
    }
  }, [hasToken, cartCountData]);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("ecommerce_cart")) || { items: [] };
      setCartCount(cart.items.length);
    };

    // Listen for custom event
    window.addEventListener("cartUpdated", updateCartCount);

    // Also listen for cross-tab storage changes
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const { data: me, isLoading: isMeLoading } = useGetMeQuery();



  const [searchWidth, setSearchWidth] = useState(0);
  const searchRef = useRef(null);

  // Scroll detection state
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (searchRef.current) {
      setSearchWidth(searchRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (searchRef.current) {
        setSearchWidth(searchRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show navbar at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const dropdownRefLang = useRef(null);

  const languages = [
    {
      name: "English",
      value: "en"
    },
    {
      name: "Azerbaijani",
      value: "az"
    }
  ];

  const langName = {
    en: "English",
    az: "Azerbaijani"
  };

  // Initialize language on mount
  useEffect(() => {
    const savedLang = getCookie('language');
    if (savedLang && savedLang !== i18next.language) {
      i18next.changeLanguage(savedLang);
      setSelected(savedLang);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Handle language change
  useEffect(() => {
    i18next.changeLanguage(selected);
    // Store in cookie for persistence (1 year)
    document.cookie = `language=${selected}; path=/; max-age=31536000`;
  }, [selected]);

  const handleSelect = (language) => {
    setSelected(language);
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchDropdownRef?.current && !searchDropdownRef?.current.contains(event.target)) {
        if (window.innerWidth > 1024) {
          setSearchOpen(false);
        }
      }
    }

    if (open || searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, searchOpen, setSearchOpen]);

  const { data: searchResult, isLoading: isSearching } = useSearchProductsQuery({ q: searchQuery }, {
    skip: !searchQuery || searchQuery.length < 2
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchOpen(true);
  };

  const handleFavoriteClick = () => {
    setUnauthorizedAction('add items to Favorites');
    setShowUnauthorizedModal(true);
  }

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchOpen(true);
  };

  const handleSearchFocus = () => {
    setSearchOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim().length >= 2) {
      const query = searchQuery;
      setSearchOpen(false);
      setMobileSearchActive(false);
      setSearchQuery('');
      navigate(`/products?search=${query}`);
      window.location.reload()
    } else if (e.key === 'Escape') {
      handleClearSearch();
      e.target.blur();
    }
  };

  const handleProductClick = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    navigate(`/details/${productId}`);
    setTimeout(() => {
      setSearchOpen(false);
      setMobileSearchActive(false);
      setSearchQuery('');
    }, 100);
  };

  const handleCategoryClick = (catSlug, categoryName) => {
    navigate(`/products/${catSlug}`);
    setSearchOpen(false);
    setMobileSearchActive(false);
    setSearchQuery('');
  };

  const handleViewAllClick = () => {
    const query = encodeURIComponent(searchQuery);
    navigate(`/products?search=${query}`);
    setSearchOpen(false);
    setMobileSearchActive(false);
    setSearchQuery('');
  };

  const handleBrandClick = (brandSlug, brandName) => {
    navigate(`/products/brand/${brandSlug}`);
    setSearchOpen(false);
    setMobileSearchActive(false);
    setSearchQuery('');

    setTimeout(() => {
      navigate(`/products?search=${query}`);
    }, 0);
  };

  return (
    <header className='pt-[65px] lg:pt-[115px]'>
      <UnauthorizedModal
        isOpen={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        action={unauthorizedAction}
      />


      <nav className={`fixed top-0 z-50 w-full bg-[#4A041D] shadow-md border-b border-white/30 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
        {/* Main Header Container */}
        <div className='max-w-[1440px] mx-auto px-4 lg:px-8 py-3 lg:py-4 relative flex items-center justify-between'>

          {/* Left: Mobile Menu & Search (Desktop) */}
          <div className='flex items-center flex-1 gap-6'>
            {/* Mobile Search Icon */}
            <button
              onClick={() => setMobileSearchActive(true)}
              className="lg:hidden text-white p-2 -ml-2 hover:text-white transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>


            {/* Desktop Search - Refined */}
            <div className='hidden lg:block relative' ref={searchDropdownRef}>
              <div className={`flex items-center border-b border-white/50 hover:border-white transition-all duration-300 w-48`}>
                <Search className='text-white w-4 h-4 mb-2' />
                <input
                  type="text"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-none outline-none px-3 pb-2 text-white placeholder-white/60 font-sans text-sm tracking-wide"
                />
                {searchQuery && (
                  <button onClick={handleClearSearch} className="mb-2">
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}
              </div>

              {searchOpen && (
                <div
                  style={{ width: searchWidth || '100%' }}
                  className="absolute top-full left-0 mt-2 bg-white border border-[#F3E7E1] rounded-sm shadow-xl z-50 overflow-hidden min-w-[300px]"
                >
                  <SearchDropdown
                    searchQuery={searchQuery}
                    searchResult={searchResult}
                    isSearching={isSearching}
                    onClose={() => setSearchOpen(false)}
                    onProductClick={handleProductClick}
                    onCategoryClick={handleCategoryClick}
                    onBrandClick={handleBrandClick}
                    onViewAllProducts={handleViewAllClick}
                    t={t}
                    width={searchWidth}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Center: Logo */}
          <div className='flex-1 flex justify-center items-center z-10 min-w-max'>
            <Link to='/' className='block no-underline'>
              <span className="font-gateway text-xl lg:text-4xl text-white whitespace-nowrap hover:text-white transition-colors duration-300">
                Gunay Beauty Store
              </span>
            </Link>
          </div>

          {/* Right: Icons */}
          <div className='flex-1 flex justify-end items-center gap-5 lg:gap-8'>
            {/* Language Switcher */}
            <div className="relative hidden lg:block text-white font-sans cursor-pointer" ref={dropdownRef}>
              <div onClick={() => setOpen(!open)} className="flex items-center gap-1 hover:text-white transition-colors">
                <span className="text-xs uppercase tracking-[0.15em]">{selected}</span>
              </div>
              {open && (
                <div className="absolute top-full right-0 mt-3 bg-[#4A041D] border border-white py-1 min-w-[100px] z-50">
                  {languages.map((lang) => (
                    <div key={lang.value} onClick={() => handleSelect(lang.value)} className="px-4 py-2 hover:bg-white hover:text-[#4A041D] text-white text-xs cursor-pointer font-sans uppercase tracking-wider transition-colors">
                      {lang.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              onClick={() => { hasToken ? navigate('/favorites') : handleFavoriteClick() }}
              className="cursor-pointer relative group"
            >
              <img className='w-5 h-5 lg:w-6 lg:h-6 brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity' src="/Icons/favorites.svg" alt="Favorites" />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#4A041D] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </div>

            <Link to='/cart' className="cursor-pointer relative group">
              <img className='w-5 h-5 lg:w-6 lg:h-6 brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity' src="/Icons/cart.svg" alt="Cart" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#4A041D] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to={hasToken ? "/profile" : "/login"} className="cursor-pointer hidden lg:block group">
              {hasToken ? (
                <div className="flex items-center gap-2">
                  <span className="font-sans text-white text-xs uppercase tracking-wider group-hover:text-white transition-colors">Account</span>
                </div>
              ) : (
                <span className="font-sans text-white text-xs uppercase tracking-wider group-hover:text-white transition-colors">Log In</span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Navigation - Slim Secondary Bar */}
        <div className="hidden lg:flex justify-center bg-[#43041A] py-3 border-t border-white/10">
          <div className="flex items-center gap-12">
            <Link to='/products' className="text-white/90 hover:text-white font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-colors relative after:content-[''] after:block after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              {t('SHOP ALL')}
            </Link>
            <Link to='/products/hot-deals' className="text-white hover:text-white font-sans text-[11px] tracking-[0.25em] uppercase font-bold transition-colors shadow-glow">
              {t('Darlings Favourites')}
            </Link>
            <Link to='/brands' className="text-white/90 hover:text-white font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-colors relative after:content-[''] after:block after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              {t('Brands')}
            </Link>
            <Link to='/about' className="text-white/90 hover:text-white font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-colors relative after:content-[''] after:block after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">
              {t('About Us')}
            </Link>
          </div>
        </div>

        {/* Mobile Search Overlay */}


      </nav>

      {/* Mobile Search Overlay - Moved outside nav to avoid transform issues */}
      <div
        className={`fixed inset-0 z-[60] bg-white transition-transform duration-300 ease-in-out lg:hidden ${mobileSearchActive ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="flex flex-col h-full safe-area-inset-top">
          {/* Search Header */}
          <div className="flex items-center gap-3 p-4 border-b border-[#4A041D]/10">
            <Search className="text-[#4A041D] w-5 h-5 shrink-0" />
            <input
              autoFocus={mobileSearchActive}
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-[#4A041D] placeholder-[#4A041D]/50 font-sans text-base"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1">
                <X className="w-4 h-4 text-[#4A041D]/50" />
              </button>
            )}
            <button
              onClick={() => {
                setMobileSearchActive(false);
                setSearchQuery('');
              }}
              className="text-[#4A041D] text-sm font-medium uppercase tracking-wider ml-2"
            >
              Cancel
            </button>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-4">
            <MobileSearchDropdown
              searchQuery={searchQuery}
              searchResult={searchResult}
              isSearching={isSearching}
              onProductClick={handleProductClick}
              onCategoryClick={handleCategoryClick}
              onBrandClick={handleBrandClick}
              onViewAllProducts={handleViewAllClick}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header