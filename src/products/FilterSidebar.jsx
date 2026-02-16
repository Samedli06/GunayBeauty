import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { useFilterProductsMutation, useGetCategoriesQuery, useGetCategoryFiltersQuery, useGetFiltersQuery, useGetParentCategoriesQuery } from '../store/API';


const SortDropdown = ({ currentSort, onSortChange, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: "", label: "Sırala" },
    { value: "price_asc", label: "Ucuzdan Bahaya" },
    { value: "price_desc", label: "Bahadan Ucuza" },
    { value: "name_asc", label: "A-dan Z-yə" },
    { value: "name_desc", label: "Z-dən A-ya" }
  ];

  const selectedOption = options.find(opt => opt.value === (currentSort || "")) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    // Create a fake event to match the expected interface of onSortChange if it expects an event
    const event = { target: { value } };
    onSortChange(event);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef} style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm flex items-center justify-between transition-all duration-300 ${isOpen ? 'border-[#C5A059] ring-2 ring-[#C5A059] ring-opacity-20' : 'border-gray-300 hover:border-[#C5A059]'}`}
      >
        <span className="text-gray-700">{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 text-[#C5A059] transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      <div
        className={`absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top transform ${isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}
      >
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-200 ${currentSort === option.value || (!currentSort && option.value === "") ? 'bg-[#F5F5F0] text-[#4A041D] font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-[#C5A059]'}`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const FilterDropdown = ({ label, children, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef} style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 bg-white border rounded-lg text-sm flex items-center gap-2 transition-all duration-300 ${isOpen || isActive ? 'border-[#C5A059] ring-1 ring-[#C5A059] text-[#4A041D]' : 'border-gray-200 hover:border-[#C5A059] text-gray-700'}`}
      >
        <span className="font-medium">{label}</span>
        <ChevronDown className={`w-4 h-4 text-[#C5A059] transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      <div
        className={`absolute z-30 mt-2 min-w-[240px] bg-white border border-gray-100 rounded-xl shadow-xl p-4 transition-all duration-300 origin-top-left ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
      >
        {children}
      </div>
    </div>
  );
};

export const FilterSidebar = React.memo(({
  onFilterResults,
  onLoadingChange,
  currentSort,
  currentPage,
  isHotDeals,
  isRecommended,
  isBrand,
  isSearch,
  setCurrentPage,
  pageSize,
  forcedCategoryId = null,
  showCategory = false,
  onSortChange
}) => {


  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});

  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const { data: ParentCat, isLoading: isParentCatLoading } = useGetParentCategoriesQuery();
  const { data: customFilters, isLoading: isCustomLoading } = useGetFiltersQuery();
  const [filterProducts, { isLoading: isFiltering }] = useFilterProductsMutation();

  const hasFiltersApplied = useRef(false);
  const debounceTimer = useRef(null);
  const isInitialMount = useRef(true);

  // Use forcedCategoryId if provided, otherwise use selected category
  const activeCategoryId = forcedCategoryId || (selectedCategories.length > 0 ? selectedCategories[0] : null);

  const { data: categoryFilters, isLoading: isCategoryFiltersLoading } = useGetCategoryFiltersQuery(
    activeCategoryId,
    { skip: !activeCategoryId }
  );

  // Determine which filters to show - category-specific or general
  const filtersToShow = activeCategoryId && categoryFilters ? categoryFilters : (customFilters || []);
  const isFiltersLoading = activeCategoryId ? isCategoryFiltersLoading : isCustomLoading;

  // Memoize buildActiveFilters function - don't include it in dependencies
  const buildActiveFilters = useCallback(() => {
    const activeFilters = [];

    // Add category filters only if shown
    if (showCategory && selectedCategories.length > 0 && categories) {
      selectedCategories.forEach(categoryId => {
        const category = categories.find(cat => cat.id === categoryId);
        if (category) {
          activeFilters.push({
            id: `category-${categoryId}`,
            key: `category-${categoryId}`,
            label: category.name,
            type: 'category',
            value: categoryId
          });
        }
      });
    }

    // Add custom filter selections
    if (customFilters) {
      Object.values(selectedFilters).forEach(filter => {
        if (filter.filterOptionIds && filter.filterOptionIds.length > 0) {
          const customFilter = customFilters.find(cf => cf.id === filter.filterId);
          if (customFilter) {
            filter.filterOptionIds.forEach(optionId => {
              const option = customFilter.options?.find(opt => opt.id === optionId);
              if (option) {
                activeFilters.push({
                  id: `filter-${filter.filterId}-${optionId}`,
                  key: `filter-${filter.filterId}-${optionId}`,
                  label: `${customFilter.name}: ${option.displayName || option.label}`,
                  type: 'custom',
                  filterId: filter.filterId,
                  optionId: optionId
                });
              }
            });
          }
        }
      });
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      const priceLabel = minPrice && maxPrice
        ? `Qiymət: ₼${minPrice} - ₼${maxPrice}`
        : minPrice
          ? `Qiymət: ₼${minPrice}+`
          : `Qiymət: ₼${maxPrice}-a qədər`;

      activeFilters.push({
        id: 'price-range',
        key: 'price-range',
        label: priceLabel,
        type: 'price',
        minPrice,
        maxPrice
      });
    }

    return activeFilters;
  }, [showCategory, selectedCategories, categories, customFilters, selectedFilters, minPrice, maxPrice]);

  // Initialize selectedFilters when filters load or change
  useEffect(() => {
    if (filtersToShow) {
      const initialFilters = {};
      filtersToShow.forEach(filter => {
        if (!selectedFilters[filter.id]) {
          initialFilters[filter.id] = {
            filterId: filter.id,
            filterOptionIds: [],
            customValue: '',
            minValue: 0,
            maxValue: 0
          };
        }
      });

      if (Object.keys(initialFilters).length > 0) {
        setSelectedFilters(prev => ({
          ...prev,
          ...initialFilters
        }));
      }
    }
  }, [filtersToShow]);

  useEffect(() => {
    if (activeCategoryId) {
      setSelectedFilters({});
    }
  }, [activeCategoryId]);

  const toggleShowAll = useCallback(() => {
    setShowAllCategories(prev => !prev);
  }, []);

  const handleCategoryChange = useCallback((categoryId) => {
    setCurrentPage(1);
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [categoryId];
    });
  }, [setCurrentPage]);

  const handleFilterChange = useCallback((isChecked, filterId, optionId) => {
    setCurrentPage(1);

    setSelectedFilters(prev => {
      const updatedFilters = { ...prev };

      if (!updatedFilters[filterId]) {
        updatedFilters[filterId] = {
          filterId: filterId,
          filterOptionIds: [],
          customValue: '',
          minValue: 0,
          maxValue: 0
        };
      }

      if (isChecked) {
        if (!updatedFilters[filterId].filterOptionIds.includes(optionId)) {
          updatedFilters[filterId].filterOptionIds = [...updatedFilters[filterId].filterOptionIds, optionId];
        }
      } else {
        updatedFilters[filterId].filterOptionIds = updatedFilters[filterId].filterOptionIds.filter(
          id => id !== optionId
        );
      }

      return updatedFilters;
    });
  }, [setCurrentPage]);

  const buildFilterCriteria = useCallback(() => {
    const criteria = [];

    Object.values(selectedFilters).forEach(filter => {
      if (filter.filterOptionIds.length > 0 || filter.customValue || filter.minValue > 0 || filter.maxValue > 0) {
        criteria.push({
          filterId: filter.filterId,
          filterOptionIds: filter.filterOptionIds.length > 0 ? filter.filterOptionIds : null,
          customValue: filter.customValue || null,
          minValue: filter.minValue || null,
          maxValue: filter.maxValue || null
        });
      }
    });

    return criteria;
  }, [selectedFilters]);

  const hasActiveFilters = useCallback(() => {
    const hasCategories = showCategory && selectedCategories.length > 0;
    const hasPrice = minPrice || maxPrice;
    const hasCustomFilters = Object.values(selectedFilters).some(filter =>
      filter.filterOptionIds?.length > 0 ||
      filter.customValue ||
      filter.minValue > 0 ||
      filter.maxValue > 0
    );
    const hasForcedCategory = !!forcedCategoryId;
    const hasSort = currentSort;

    return hasCategories || hasPrice || hasCustomFilters || hasForcedCategory || hasSort;
  }, [showCategory, selectedCategories, minPrice, maxPrice, selectedFilters, forcedCategoryId, currentSort]);

  // Separate effect for filter criteria changes (excludes currentPage)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      const hasActiveFiltersApplied = hasActiveFilters();

      if (!hasActiveFiltersApplied) {
        hasFiltersApplied.current = false;
        if (onFilterResults) {
          onFilterResults(null, []);
        }
        return;
      }

      hasFiltersApplied.current = true;

      const filterCriteria = buildFilterCriteria();
      const categoryIdToUse = forcedCategoryId || (selectedCategories.length > 0 ? selectedCategories[0] : null);
      const filterPayload = {
        categoryId: categoryIdToUse || null,
        brandSlug: isBrand || null,
        isHotDeal: isHotDeals || null,
        isRecommended: isRecommended || null,
        searchTerm: isSearch || null,
        filterCriteria: filterCriteria.length > 0 ? filterCriteria : [],
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : 1000000,
        sortBy: currentSort?.split("_")[0] || null,
        sortOrder: currentSort?.split("_")[1] || null,
        page: 1,
        pageSize: pageSize || 20
      };

      if (onLoadingChange) {
        onLoadingChange(true);
      }

      try {
        const result = await filterProducts(filterPayload).unwrap();

        if (onFilterResults) {
          onFilterResults(result, buildActiveFilters());
        }
      } catch (error) {
        if (onFilterResults) {
          onFilterResults({ products: [], totalCount: 0 }, []);
        }
      } finally {
        if (onLoadingChange) {
          onLoadingChange(false);
        }
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [selectedCategories, selectedFilters, minPrice, maxPrice, currentSort, forcedCategoryId, isHotDeals, isBrand, isSearch, pageSize]);

  // Separate effect for page changes only (no debounce)
  useEffect(() => {
    if (!hasFiltersApplied.current || isInitialMount.current) {
      return;
    }

    const applyFiltersWithNewPage = async () => {
      const filterCriteria = buildFilterCriteria();
      const categoryIdToUse = forcedCategoryId || (selectedCategories.length > 0 ? selectedCategories[0] : null);

      const filterPayload = {
        categoryId: categoryIdToUse,
        brandSlug: isBrand,
        isHotDeal: isHotDeals,
        searchTerm: isSearch,
        filterCriteria: filterCriteria.length > 0 ? filterCriteria : [],
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        sortBy: currentSort?.split("_")[0],
        sortOrder: currentSort?.split("_")[1],
        page: currentPage,
        pageSize: pageSize || 20
      };

      if (onLoadingChange) {
        onLoadingChange(true);
      }

      try {
        const result = await filterProducts(filterPayload).unwrap();

        if (onFilterResults) {
          onFilterResults(result, buildActiveFilters());
        }
      } catch (error) {
        if (onFilterResults) {
          onFilterResults({ products: [], totalCount: 0 }, []);
        }
      } finally {
        if (onLoadingChange) {
          onLoadingChange(false);
        }
      }
    };

    applyFiltersWithNewPage();
  }, [currentPage, pageSize]);

  const handleMinPriceChange = useCallback((e) => {
    setCurrentPage(1);
    setMinPrice(e.target.value);
  }, [setCurrentPage]);

  const handleMaxPriceChange = useCallback((e) => {
    setCurrentPage(1);
    setMaxPrice(e.target.value);
  }, [setCurrentPage]);

  if (isCategoriesLoading) {
    return (
      <div className="w-full h-12 bg-gray-100 animate-pulse rounded-lg"></div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>

      {/* Left Side: Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-3 flex-1">

        {/* Categories Dropdown */}
        {showCategory && (
          <FilterDropdown
            label="Kateqoriya"
            isActive={selectedCategories.length > 0}
          >
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {(ParentCat)?.map(item => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border border-gray-300 rounded checked:bg-[#4A041D] checked:border-[#4A041D] transition-all"
                      checked={selectedCategories.includes(item.id)}
                      onChange={() => handleCategoryChange(item.id)}
                    />
                    <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className={`text-sm transition-colors ${selectedCategories.includes(item.id) ? 'text-[#4A041D] font-medium' : 'text-gray-600 group-hover:text-[#4A041D]'}`}>
                    {item.name}
                  </span>
                </label>
              ))}
            </div>
          </FilterDropdown>
        )}

        {/* Dynamic Filters */}
        {!isFiltersLoading && filtersToShow?.map(filter => {
          const isActive = selectedFilters[filter.id]?.filterOptionIds?.length > 0;
          return (
            <FilterDropdown
              key={filter.id}
              label={filter.name}
              isActive={isActive}
            >
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filter.options?.map(option => (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded checked:bg-[#4A041D] checked:border-[#4A041D] transition-all"
                        checked={selectedFilters[filter.id]?.filterOptionIds?.includes(option.id) || false}
                        onChange={(e) => handleFilterChange(e.target.checked, filter.id, option.id)}
                      />
                      <svg className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none left-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className={`text-sm transition-colors ${selectedFilters[filter.id]?.filterOptionIds?.includes(option.id) ? 'text-[#4A041D] font-medium' : 'text-gray-600 group-hover:text-[#4A041D]'}`}>
                      {option.displayName || option.label}
                    </span>
                  </label>
                ))}
              </div>
            </FilterDropdown>
          );
        })}

        {/* Price Dropdown */}
        <FilterDropdown
          label="Qiymət aralığı"
          isActive={minPrice || maxPrice}
        >
          <div className="space-y-4 p-1">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Min.</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">₼</span>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-sm transition-all"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Maks.</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">₼</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] text-sm transition-all"
                  min="0"
                />
              </div>
            </div>
          </div>
        </FilterDropdown>

        {(isFiltering || isFiltersLoading) && (
          <div className="flex items-center gap-2 text-sm text-[#C5A059]">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C5A059]"></div>
          </div>
        )}
      </div>

      {/* Right Side: Sort */}
      <div className="w-full lg:w-[200px]">
        <SortDropdown
          currentSort={currentSort}
          onSortChange={onSortChange}
        />
      </div>
    </div>
  );
});