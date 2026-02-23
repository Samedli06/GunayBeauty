import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useGetCartCountQuery, useGetFavoritesCountQuery, useGetMeQuery, useSearchProductsQuery, useGetParentCategoriesQuery } from "../../store/API";
import { Search, X } from 'lucide-react';
import { SearchContext } from '../../router/Context';
import { FaRegFile, FaRegUser, FaRegUserCircle, FaUserCircle } from 'react-icons/fa';
import { PiCarProfile } from 'react-icons/pi';

import SearchDropdown from '../UI/SearchDropdown';
import MobileSearchDropdown from '../UI/MobileSearchDropdown';
import UnauthorizedModal from '../UI/UnauthorizedModal';
import CategoriesDropdown from '../UI/CategoriesDropdown';

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
  const [animateCart, setAnimateCart] = useState(false);




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

  const { data: parentCategoriesData } = useGetParentCategoriesQuery();

  const parentCategories = React.useMemo(() => {
    if (!parentCategoriesData) return [];
    return [...parentCategoriesData]
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map(cat => ({
        ...cat,
        subCategories: cat.subCategories
          ? [...cat.subCategories]
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map(sub => ({
              ...sub,
              subCategories: sub.subCategories
                ? [...sub.subCategories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                : []
            }))
          : []
      }));
  }, [parentCategoriesData]);

  const [navCategories, setNavCategories] = useState([]);

  const [cartCount, setCartCount] = useState(() => {
    const localCart = JSON.parse(localStorage.getItem("ecommerce_cart")) || { items: [] };
    return localCart.items.length;
  });

  useEffect(() => {
    const handleCartAnimation = () => {
      setAnimateCart(true);
      setTimeout(() => setAnimateCart(false), 500); // Reset animation after 500ms
    };

    window.addEventListener('cartAnimation', handleCartAnimation);
    return () => window.removeEventListener('cartAnimation', handleCartAnimation);
  }, []);

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

  const { data: me, isLoading: isMeLoading, error: meError } = useGetMeQuery();

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

  useEffect(() => {
    if (parentCategories) {
      setNavCategories(parentCategories.slice(0, 6));
    }
  }, [parentCategories]);

  const { data: searchResult, isLoading: isSearching } = useSearchProductsQuery({ q: searchQuery }, {
    skip: !searchQuery || searchQuery.length < 2
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchOpen(true);
  };

  const handleFavoriteClick = () => {
    if (hasToken && meError?.status !== 401) {
      navigate('/favorites');
    } else {
      setUnauthorizedAction("Məhsulları sevimlilərə əlavə etmək");
      setShowUnauthorizedModal(true);
    }
  };

  const handleAccountClick = () => {
    if (hasToken && meError?.status !== 401) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

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
                  placeholder="Axtar..."
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
                  className="absolute top-full left-0 mt-2 bg-white border border-[#F3E7E1] rounded-sm shadow-xl z-50 overflow-hidden min-w-[800px]"
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
                    width={searchWidth}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Center: Logo */}
          <div className='flex-1 flex justify-center items-center z-10 min-w-max'>
            <Link to='/' className='block no-underline'>
              <span className="font-logo text-sm lg:text-4xl text-white whitespace-nowrap hover:text-white transition-colors duration-300">
                Gunay Beauty Store
              </span>
            </Link>
          </div>

          {/* Right: Icons */}
          <div className='flex-1 flex justify-end items-center gap-5 lg:gap-8'>


            <div
              onClick={handleFavoriteClick}
              className="cursor-pointer relative group"
            >
              <img className='w-5 h-5 lg:w-6 lg:h-6 brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity' src="/Icons/favorites.svg" alt="Favorites" />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#4A041D] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </div>

            <Link
              to='/cart'
              className={`cursor-pointer relative group transition-transform duration-300 ease-in-out ${animateCart ? 'scale-125' : 'scale-100'}`}
            >
              <img className='w-5 h-5 lg:w-6 lg:h-6 brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity' src="/Icons/cart.svg" alt="Cart" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#4A041D] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div onClick={handleAccountClick} className="cursor-pointer hidden lg:block group">
              {hasToken && meError?.status !== 401 ? (
                <div className="flex items-center gap-2">
                  <span className="font-sans text-white text-xs uppercase tracking-wider group-hover:text-white transition-colors">Hesab</span>
                </div>
              ) : (
                <span className="font-sans text-white text-xs uppercase tracking-wider group-hover:text-white transition-colors">Daxil ol</span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Slim Secondary Bar */}
        <div className="hidden lg:flex justify-center bg-[#43041A] py-3 border-t border-white/10 ">
          <div className="flex items-center gap-10 max-[1200px]:gap-5">
            {/* 1. Categories */}
            <Link to='/categories' className="whitespace-nowrap text-[12px]">
              <CategoriesDropdown />
            </Link>

            {/* 2. First 3 Parent Categories */}
            {navCategories.slice(0, 3).map((cat) => (
              <div key={cat.id} className="relative group/cat">
                <Link
                  to={`/categories/${cat.slug}`}
                  className="text-white/90 hover:text-white font-sans text-[12px] tracking-[0.25em] max-[1200px]:tracking-[0.1em]  uppercase font-medium transition-colors relative after:content-[''] after:block after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap block py-1"
                >
                  {cat.name}
                </Link>

                {/* Subcategories Dropdown */}
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-2xl opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 border border-gray-100 w-[30vw]  z-[60] p-6 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                      {cat.subCategories.map(sub => (
                        <div key={sub.id} className="flex flex-col">
                          <Link
                            to={`/products/${sub.slug}`}
                            className="block py-2.5 text-[12px] text-gray-800 hover:text-[#4A041D] hover:translate-x-1 uppercase tracking-[0.1em] transition-all font-semibold border-b border-gray-50 last:border-0"
                          >
                            {sub.name}
                          </Link>
                          {sub.subCategories && sub.subCategories.length > 0 && (
                            <div className="pl-4 pb-2 flex flex-col gap-1.5">
                              {sub.subCategories.map(thirdLevel => (
                                <Link
                                  key={thirdLevel.id}
                                  to={`/products/${thirdLevel.slug}`}
                                  className="text-[10px] text-gray-500 hover:text-[#4A041D] transition-colors"
                                >
                                  {thirdLevel.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 3. Darling Favorites */}
            <Link to='/products?isHotDeal=true' className="text-white hover:text-white font-sans text-[12px] tracking-[0.25em] uppercase font-bold transition-colors shadow-glow whitespace-nowrap border border-white/20 px-3 py-1 rounded-sm">
              Hamının sevimlisi
            </Link>

            {/* 4. Last 3 Parent Categories */}
            {navCategories.slice(3, 6).map((cat) => (
              <div key={cat.id} className="relative group/cat">
                <Link
                  to={`/categories/${cat.slug}`}
                  className="text-white/90 hover:text-white font-sans text-[12px] tracking-[0.25em] uppercase font-medium transition-colors relative after:content-[''] after:block after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap block py-1"
                >
                  {cat.name}
                </Link>

                {/* Subcategories Dropdown */}
                {cat.subCategories && cat.subCategories.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-2xl opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-300 border border-gray-100 w-[30vw]   z-[60] p-6 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                      {cat.subCategories.map(sub => (
                        <div key={sub.id} className="flex flex-col">
                          <Link
                            to={`/products/${sub.slug}`}
                            className="block py-2.5 text-[12px] text-gray-800 hover:text-[#4A041D] hover:translate-x-1 uppercase tracking-[0.1em] transition-all font-semibold border-b border-gray-50 last:border-0"
                          >
                            {sub.name}
                          </Link>
                          {sub.subCategories && sub.subCategories.length > 0 && (
                            <div className="pl-4 pb-2 flex flex-col gap-1.5">
                              {sub.subCategories.map(thirdLevel => (
                                <Link
                                  key={thirdLevel.id}
                                  to={`/products/${thirdLevel.slug}`}
                                  className="text-[10px] text-gray-500 hover:text-[#4A041D] transition-colors"
                                >
                                  {thirdLevel.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
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
              placeholder="Axtar..."
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
              Ləğv et
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