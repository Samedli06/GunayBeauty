import React, { useEffect, useState, useRef } from 'react';
import { SlidersHorizontal, Filter, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useFilterProductsMutation, useGetCategoriesQuery, useGetCategoryFiltersQuery, useGetFiltersQuery, useGetParentCategoriesQuery } from '../store/API';

// Move these components outside to prevent recreation on each render
const FilterSection = ({ title, isExpanded, onToggle, children }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      type="button"
      className="w-full px-4 py-4 flex justify-between items-center text-left"
    >
      <span className="text-base font-semibold text-[#4A041D] uppercase tracking-wider">{title}</span>
      {isExpanded ? <ChevronUp size={18} className="text-[#4A041D]" /> : <ChevronDown size={18} className="text-[#4A041D]" />}
    </button>
    {isExpanded && (
      <div className="px-4 pb-4">
        {children}
      </div>
    )}
  </div>
);

const CheckboxItem = ({ label, checked, onChange }) => (
  <label className="flex items-center py-2 cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${checked ? 'bg-[#4A041D] border-[#4A041D]' : 'border-gray-200'
        }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </div>
    <span className="ml-3 text-gray-700">{label}</span>
  </label>
);

export function MobileFilterButtons({ onFilterResults, onLoadingChange, currentSort, onSortChange, currentPage, pageSize }) {
  const [isSort, setIsSort] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});



  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const { data: ParentCat, isLoading: isParentCatLoading } = useGetParentCategoriesQuery();
  const { data: customFilters, isLoading: isCustomLoading } = useGetFiltersQuery();

  const selectedCategoryId = selectedCategories.length > 0 ? selectedCategories[0] : null;
  const { data: categoryFilters, isLoading: isCategoryFiltersLoading } = useGetCategoryFiltersQuery(
    selectedCategoryId,
    { skip: !selectedCategoryId }
  );

  const [filterProducts, { isLoading: isFiltering }] = useFilterProductsMutation();
  const hasFiltersApplied = useRef(false);
  const debounceTimer = useRef(null);

  const filtersToShow = selectedCategoryId && categoryFilters ? categoryFilters : customFilters;
  const isFiltersLoading = selectedCategoryId ? isCategoryFiltersLoading : isCustomLoading;

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    priceRange: true
  });



  useEffect(() => {
    if (isFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilter]);

  // Initialize selectedFilters when filters load
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

      setSelectedFilters(prev => ({
        ...prev,
        ...initialFilters
      }));

      // Set expanded state for each filter
      setExpandedSections(prev => {
        const newSections = { ...prev };
        filtersToShow.forEach(filter => {
          if (newSections[`filter-${filter.id}`] === undefined) {
            newSections[`filter-${filter.id}`] = true;
          }
        });
        return newSections;
      });
    }
  }, [filtersToShow]);

  // Reset filters when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      setSelectedFilters({});
    }
  }, [selectedCategoryId]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [categoryId];
    });
  };

  const handleFilterChange = (isChecked, filterId, optionId) => {
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
          updatedFilters[filterId].filterOptionIds.push(optionId);
        }
      } else {
        updatedFilters[filterId].filterOptionIds = updatedFilters[filterId].filterOptionIds.filter(
          id => id !== optionId
        );
      }

      return updatedFilters;
    });
  };

  const buildFilterCriteria = () => {
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
  };

  const buildActiveFilters = () => {
    const activeFilters = [];

    if (selectedCategories.length > 0 && categories) {
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
  };

  const hasActiveFilters = () => {
    const hasCategories = selectedCategories.length > 0;
    const hasPrice = minPrice || maxPrice;
    const hasCustomFilters = Object.values(selectedFilters).some(filter =>
      filter.filterOptionIds?.length > 0 ||
      filter.customValue ||
      filter.minValue > 0 ||
      filter.maxValue > 0
    );

    return hasCategories || hasPrice || hasCustomFilters;
  };

  const applyFilters = async () => {
    const hasActiveFiltersApplied = hasActiveFilters();

    if (!hasActiveFiltersApplied) {
      hasFiltersApplied.current = false;
      if (onFilterResults) {
        onFilterResults(null, []);
      }
      return;
    }

    hasFiltersApplied.current = true;

    let sortByValue, sortOrderValue;
    if (currentSort) {
      const sortParts = currentSort.split('_');
      if (sortParts[0] === 'price') {
        sortByValue = 'price';
        sortOrderValue = sortParts[1];
      } else if (sortParts[0] === 'name') {
        sortByValue = 'name';
        sortOrderValue = sortParts[1];
      } else if (currentSort === 'newest') {
        sortByValue = 'createdDate';
        sortOrderValue = 'desc';
      }
    }

    const filterCriteria = buildFilterCriteria();

    const filterPayload = {
      categoryId: selectedCategories.length > 0 ? selectedCategories[0] : null,
      filterCriteria: filterCriteria.length > 0 ? filterCriteria : [],
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      sortBy: sortByValue || null,
      sortOrder: sortOrderValue || null,
      page: currentPage || 1,
      pageSize: pageSize || 20
    };

    if (onLoadingChange) {
      onLoadingChange(true);
    }

    try {
      const result = await filterProducts(filterPayload).unwrap();
      const activeFilters = buildActiveFilters();

      if (onFilterResults) {
        onFilterResults(result, activeFilters);
      }
    } catch (error) {
      console.error('Failed to filter products:', error);
      if (onFilterResults) {
        onFilterResults({ products: [], totalCount: 0 }, []);
      }
    } finally {
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedFilters({});
    setMinPrice('');
    setMaxPrice('');
    hasFiltersApplied.current = false;
    if (onFilterResults) {
      onFilterResults(null, []);
    }
  };

  const handleShowResults = () => {
    applyFilters();
    setIsFilter(false);
  };

  return (
    <>
      {/* Mobile Filter Modal */}
      <div className={`fixed inset-0 bg-white z-5000 flex flex-col ${isFilter ? 'block' : 'hidden'}`}>
        <div className="flex justify-between items-center p-5 border-b border-[#F3E7E1] bg-[#FDFBF8]">
          <h1 className="text-xl font-bold text-[#4A041D] uppercase tracking-widest" style={{ fontFamily: 'Montserrat, sans-serif' }}>Filtrlər</h1>
          <button onClick={() => setIsFilter(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-[#4A041D]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Category Filter */}
          <FilterSection
            title="Kateqoriya"
            isExpanded={expandedSections.category}
            onToggle={() => toggleSection('category')}
          >
            <div className="space-y-4">
              {ParentCat?.slice(0, showAllCategories ? ParentCat.length : 5).map(item => (
                <div key={item.id} className="flex flex-col gap-1">
                  {/* Level 1 Parent */}
                  <CheckboxItem
                    label={item.name}
                    checked={selectedCategories.includes(item.id)}
                    onChange={() => handleCategoryChange(item.id)}
                  />

                  {/* Level 2 Subcategories */}
                  {item.subCategories && item.subCategories.length > 0 && (
                    <div className="ml-6 space-y-1 py-1">
                      {item.subCategories.map(sub => (
                        <div key={sub.id} className="flex flex-col gap-1">
                          <CheckboxItem
                            label={sub.name}
                            checked={selectedCategories.includes(sub.id)}
                            onChange={() => handleCategoryChange(sub.id)}
                          />

                          {/* Level 3 Categories */}
                          {sub.subCategories && sub.subCategories.length > 0 && (
                            <div className="ml-6 space-y-1">
                              {sub.subCategories.map(third => (
                                <label key={third.id} className="flex items-center py-1.5 cursor-pointer opacity-80">
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(third.id)}
                                    onChange={() => handleCategoryChange(third.id)}
                                    className="w-3.5 h-3.5 accent-[#C5A059]"
                                  />
                                  <span className="ml-3 text-[11px] uppercase tracking-wider text-gray-500">{third.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {ParentCat?.length > 5 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-sm text-[#9E2A2B] hover:text-[#4A041D] font-bold uppercase tracking-wider mt-2 transition-colors"
              >
                {showAllCategories ? "Daha az gör" : "Hamısını gör"}
              </button>
            )}
          </FilterSection>

          {/* Custom Filters */}
          {isFiltersLoading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                </div>
              </div>
            </div>
          ) : (
            filtersToShow?.map(filter => (
              <FilterSection
                key={filter.id}
                title={filter.name}
                isExpanded={expandedSections[`filter-${filter.id}`]}
                onToggle={() => toggleSection(`filter-${filter.id}`)}
              >
                <div className="space-y-1">
                  {filter.options?.map(option => (
                    <CheckboxItem
                      key={option.id}
                      label={option.displayName || option.label}
                      checked={selectedFilters[filter.id]?.filterOptionIds?.includes(option.id) || false}
                      onChange={(e) => handleFilterChange(e.target.checked, filter.id, option.id)}
                    />
                  ))}
                </div>
              </FilterSection>
            ))
          )}

          {/* Price Range */}
          <FilterSection
            title="Qiymət aralığı"
            isExpanded={expandedSections.priceRange}
            onToggle={() => toggleSection('priceRange')}
          >
            <div className="flex items-center space-x-2" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              <input
                type="number"
                placeholder="Min."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onFocus={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 border border-[#F3E7E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A041D] text-sm bg-white"
                min="0"
              />
              <span className="text-[#C5A059]">-</span>
              <input
                type="number"
                placeholder="Maks."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onFocus={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 border border-[#F3E7E1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#4A041D] text-sm bg-white"
                min="0"
              />
            </div>
          </FilterSection>
        </div >

        <div className="p-6 border-t border-[#F3E7E1] flex flex-col md:flex-rowhttp://localhost:5173/products/brand/alerana gap-4 bg-[#FDFBF8]">
          <button
            onClick={handleClearFilters}
            className="flex-1 py-3 text-[#4A041D] font-bold uppercase tracking-wider text-xs border border-[#4A041D] rounded-full hover:bg-[#4A041D]/5 transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Təmizlə
          </button>
          <button
            onClick={handleShowResults}
            className="flex-1 py-3 bg-[#4A041D] text-white font-bold uppercase tracking-wider text-xs rounded-full hover:bg-[#6D082D] shadow-lg shadow-[#4A041D]/20 transition-all"
            disabled={isFiltering}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {isFiltering ? "Yüklənir..." : "Nəticələri göstər"}
          </button>
        </div>
      </div >

      {/* Mobile Sort & Filter Buttons */}
      < div className="flex gap-2 mb-4 lg:hidden relative" >
        <div className="flex gap-2 w-full">
          <div className="flex-1 min-w-0">
            <button
              onClick={() => setIsSort(!isSort)}
              className={`${isSort && 'rounded-b-none border-b-0'} flex items-center justify-center gap-2 py-3 px-4 border border-[#F3E7E1] rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full`}
            >
              <SlidersHorizontal className="w-4 h-4 text-[#4A041D]" />
              <span className='whitespace-nowrap text-xs font-bold uppercase tracking-widest text-[#4A041D]'>Sıralama</span>
            </button>

            <div className={`overflow-hidden transition-all duration-500 rounded-b-lg absolute left-0 right-0 z-[60] ${isSort ? "max-h-80 opacity-100 mt-0" : "max-h-0 opacity-0"}`}>
              <div className="border border-[#F3E7E1] border-t-0 rounded-b-lg bg-white shadow-2xl">
                <div className="py-2 rounded-b-lg">
                  {[
                    { value: null, label: "Sıralama" },
                    { value: 'price_asc', label: "Ucuzdan Bahaya" },
                    { value: 'price_desc', label: "Bahadan Ucuza" },
                    { value: 'name_asc', label: "A-dan Z-yə" },
                    { value: 'name_desc', label: "Z-dən A-ya" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-start px-6 py-3 hover:bg-[#FDFBF8] hover:text-[#C5A059] transition-all duration-200 text-xs font-semibold uppercase tracking-wider ${currentSort === option.value ? 'bg-[#FDFBF8] text-[#4A041D] font-bold' : 'text-gray-600'}`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                      onClick={() => {
                        if (onSortChange) {
                          onSortChange({ target: { value: option.value } });
                        }
                        setIsSort(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFilter(true)}
            className={`flex items-center justify-center gap-2 rounded-lg bg-[#4A041D] text-white hover:bg-[#6D082D] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden min-w-0 ${isSort ? "flex-shrink-[999] w-0 p-0 opacity-0" : "flex-1 opacity-100"}`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <Filter className={`w-4 h-4 flex-shrink-0 transition-opacity duration-300 ${isSort ? "opacity-0" : "opacity-100"}`} />
            <span className={`whitespace-nowrap text-sm transition-opacity duration-300 ${isSort ? "opacity-0" : "opacity-100"}`}>
              Filtrlə
            </span>
          </button>
        </div>
      </div >
    </>
  );
}