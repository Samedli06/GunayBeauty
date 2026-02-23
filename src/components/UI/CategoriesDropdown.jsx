import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useGetParentCategoriesQuery, useGetSubCategoriesQuery, API_BASE_URL } from '../../store/API';
import { ChevronRight } from 'lucide-react';

const CategoriesDropdown = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredParentId, setHoveredParentId] = useState(null);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);

    const { data: parentCategories, isLoading } = useGetParentCategoriesQuery();

    // We can get subcategories from the parent object directly if available, 
    // or fetch them. Home.jsx uses the nested subCategories from parentCategories query.
    // Let's rely on parentCategories having the subCategories nested to avoid extra requests 
    // and sync issues, similar to Home.jsx

    // Find the currently hovered parent object
    const hoveredParent = parentCategories?.find(p => p.id === hoveredParentId);
    // Use the subCategories from the parent object
    const subCategories = hoveredParent?.subCategories || [];

    // Category icon mapping
    const getCategoryIcon = (slug) => {
        const iconMap = {
            'ticaret-avadanliqlari': '/Icons/banner-commercial.svg',
            'komputerler': '/Icons/banner-computers.svg',
            'noutbuklar': '/Icons/banner-laptops.svg',
            'musahide-sistemleri': '/Icons/banner-surveillance.svg',
            'komputer-avadanliqlari': '/Icons/banner-mouse.svg',
            'ofis-avadanliqlari': '/Icons/banner-printer.svg',
            'sebeke-avadanliqlari': '/Icons/banner-global.svg',
        };
        return iconMap[slug] || '/Icons/banner-commercial.svg';
    };



    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setHoveredParentId(null);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsOpen(true);
        // Default to first category if none hovered
        if (!hoveredParentId && parentCategories?.length > 0) {
            setHoveredParentId(parentCategories[0].id);
        }
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
            setHoveredParentId(null);
        }, 200);
    };

    const handleParentHover = (parentId) => {
        setHoveredParentId(parentId);
    };

    const handleLinkClick = () => {
        setIsOpen(false);
        setHoveredParentId(null);
    };

    // Ensure we have a default hovered parent when opening
    useEffect(() => {
        if (isOpen && !hoveredParentId && parentCategories?.length > 0) {
            setHoveredParentId(parentCategories[0].id);
        }
    }, [isOpen, parentCategories, hoveredParentId]);

    if (isLoading) {
        return (
            <div className="text-white/90 hover:text-white font-sans text-[11px] tracking-[0.25em] uppercase font-medium transition-colors">
                Kateqoriyalar
            </div>
        );
    }

    return (
        <div
            className="relative h-full flex items-center"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Categories Link - Visual Only (Parent Link handles navigation) */}
            <div className="text-white/90 hover:text-white font-sans text-[12px] tracking-[0.25em] uppercase font-medium transition-colors cursor-pointer relative after:content-[''] after:block after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Kateqoriyalar
            </div>

            {/* Dropdown Menu - Full Width Fixed Positioning */}
            {isOpen && (
                <div
                    className="fixed left-0 w-full right-0 z-50 bg-white border-t border-[#F3E7E1] shadow-xl animate-fade-in-up"
                    style={{ top: '115px', height: 'auto', maxHeight: 'calc(100vh - 110px)' }}
                >
                    <div className="w-full h-full flex max-w-[1600px] mx-auto">

                        {/* Left Side - Parent Categories List */}
                        <div className="w-[300px] bg-[#F9F9F9] border-r border-[#F3E7E1] flex flex-col py-6 h-full overflow-y-auto max-h-[70vh] dark-scrollbar">
                            {parentCategories?.map((parent) => (
                                <Link
                                    key={parent.id}
                                    to={`/categories/${parent.slug}`}
                                    onMouseEnter={() => handleParentHover(parent.id)}
                                    onClick={handleLinkClick}
                                    className={`relative px-8 py-3.5 flex items-center justify-between text-xs uppercase tracking-wider font-sans transition-all duration-200 ${hoveredParentId === parent.id
                                        ? 'text-[#4A041D] font-bold bg-white shadow-sm border-l-4 border-l-[#4A041D]'
                                        : 'text-[#4A041D]/70 hover:text-[#4A041D] hover:bg-gray-100'
                                        }`}
                                >
                                    {parent.name}
                                    {hoveredParentId === parent.id && (
                                        <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                                    )}
                                </Link>
                            ))}

                            <div className="mt-4 px-8 pt-4 border-t border-[#F3E7E1]/50">
                                <Link to="/categories" onClick={handleLinkClick} className="flex items-center gap-2 text-[#C5A059] font-bold text-xs uppercase tracking-widest hover:text-[#9E2A2B] transition-colors">
                                    Bütün kateqoriyalara bax
                                    <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Right Side - Subcategories Grid */}
                        <div className="flex-1 bg-white p-8 lg:p-10 overflow-y-auto max-h-[70vh]">
                            {hoveredParent ? (
                                <div className="h-full flex flex-col">
                                    <div className="mb-8 flex justify-between items-end border-b border-[#F3E7E1] pb-4">
                                        <div>
                                            <h3 className="text-3xl font-sans text-[#4A041D] mb-2 font-semibold">{hoveredParent.name}</h3>
                                            <p className="text-[#9E2A2B] text-sm italic font-sans">Kolleksiyanı kəşf edin</p>
                                        </div>
                                        <Link
                                            to={`/categories/${hoveredParent.slug}`}
                                            onClick={handleLinkClick}
                                            className="text-xs font-bold uppercase tracking-widest text-[#4A041D] hover:text-[#C5A059] transition-colors border-b border-transparent hover:border-[#C5A059] pb-1"
                                        >
                                            Hamısına bax
                                        </Link>
                                    </div>

                                    {subCategories && subCategories.length > 0 ? (
                                        <div className="grid grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-8 content-start">
                                            {subCategories.map((sub) => (
                                                <div key={sub.id} className="flex flex-col gap-2">
                                                    <Link
                                                        to={`/products/${sub.slug}`}
                                                        onClick={handleLinkClick}
                                                        className="group flex flex-col items-center gap-3 p-2 rounded-xl hover:bg-[#FDFBF8] transition-all duration-300 transform hover:-translate-y-1"
                                                    >
                                                        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-full border border-[#F3E7E1] p-1 flex items-center justify-center group-hover:border-[#C5A059] transition-colors relative overflow-hidden shadow-sm">
                                                            <img
                                                                src={sub.imageUrl ? `${API_BASE_URL}/${sub.imageUrl}` : getCategoryIcon(sub.slug)}
                                                                alt={sub.name}
                                                                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                                                                onError={(e) => {
                                                                    e.target.src = getCategoryIcon(sub.slug);
                                                                    e.target.className = "w-8 h-8 opacity-30 grayscale object-contain";
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-center font-sans font-medium text-[#4A041D] text-xs group-hover:text-[#9E2A2B] transition-colors line-clamp-2 leading-tight px-1">
                                                            {sub.name}
                                                        </span>
                                                    </Link>
                                                    {sub.subCategories && sub.subCategories.length > 0 && (
                                                        <div className="flex flex-col gap-1 items-center">
                                                            {sub.subCategories.slice(0, 3).map(third => (
                                                                <Link
                                                                    key={third.id}
                                                                    to={`/products/${third.slug}`}
                                                                    onClick={handleLinkClick}
                                                                    className="text-[10px] text-gray-400 hover:text-[#4A041D] text-center transition-colors line-clamp-1 px-2"
                                                                >
                                                                    {third.name}
                                                                </Link>
                                                            ))}
                                                            {sub.subCategories.length > 3 && (
                                                                <span className="text-[9px] text-[#C5A059] font-semibold opacity-70">
                                                                    +{sub.subCategories.length - 3} daha...
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40 min-h-[300px]">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                                <ChevronRight className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-sans text-lg">Alt kateqoriya tapılmadı</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-gray-300 font-sans text-xl">Kateqoriya seçin</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesDropdown;
