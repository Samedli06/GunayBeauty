import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useGetParentCategoriesQuery, API_BASE_URL } from '../../store/API';
import SEO from '../../components/SEO/SEO';
import { ChevronRight, Loader2 } from 'lucide-react';

const Categories = () => {
    const { data: parentCategories, isLoading } = useGetParentCategoriesQuery();

    // Category icon mapping (reused from Home.jsx or similar)
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

    const categoriesToDisplay = parentCategories;

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#FDFBF8]">
                <Loader2 className="w-10 h-10 text-[#4A041D] animate-spin" />
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Kateqoriyalar - Gunay Beauty"
                description="Bütün gözəllik və elektronika kateqoriyalarımıza baxın."
            />

            <main className="min-h-screen bg-[#FDFBF8] pt-[80px] lg:pt-[120px] pb-20 px-4 lg:px-12">
                <div className="max-w-[1440px] mx-auto">

                    <div className="text-center mb-12 lg:mb-20">
                        <h1 className="text-3xl lg:text-5xl font-sans text-[#4A041D] mb-4">
                            Bizim Kolleksiyalarımız
                        </h1>
                        <div className="h-[2px] w-24 bg-[#C5A059] mx-auto mb-4"></div>
                        <p className="text-[#9E2A2B] font-sans italic text-lg lg:text-xl">
                            Bizim diqqətlə seçilmiş kateqoriyalarımızı kəşf edin
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                        {categoriesToDisplay?.map((category) => (
                            <div
                                key={category.id}
                                className="group flex flex-col bg-white rounded-2xl shadow-sm border border-[#F3E7E1] overflow-hidden hover:shadow-xl hover:border-[#C5A059]/30 transition-all duration-500 transform hover:-translate-y-1"
                            >
                                {/* Header / Image Area */}
                                <Link to={`/categories/${category.slug}`} className="relative h-48 lg:h-56 overflow-hidden bg-[#Fdfbf8] flex items-center justify-center p-6 border-b border-[#F3E7E1]">
                                    {/* Background Decor */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#4A041D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <img
                                        src={category.imageUrl ? `${API_BASE_URL}${category.imageUrl}` : getCategoryIcon(category.slug)}
                                        alt={category.name}
                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-in-out drop-shadow-sm"
                                        onError={(e) => {
                                            e.target.src = getCategoryIcon(category.slug);
                                            e.target.className = "w-24 h-24 object-contain opacity-40 grayscale";
                                        }}
                                    />
                                </Link>

                                {/* Content Area */}
                                <div className="p-6 lg:p-8 flex-1 flex flex-col">
                                    <Link to={`/categories/${category.slug}`} className="block">
                                        <h2 className="!text-sm lg:text-2xl font-sans text-[#4A041D] group-hover:text-[#C5A059] transition-colors mb-4 flex items-center justify-between">
                                            {category.name}
                                            <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#C5A059]" />
                                        </h2>
                                    </Link>

                                    {/* Subcategories */}
                                    <div className="flex-1 space-y-3">
                                        {category.subCategories && category.subCategories.length > 0 ? (
                                            <>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {category.subCategories.slice(0, 4).map((sub) => (
                                                        <Link
                                                            key={sub.id}
                                                            to={`/products/${sub.slug || ''}`}
                                                            className="group/sub flex flex-col items-center gap-3 p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <div className="w-16 h-16 lg:w-12 lg:h-12 bg-white rounded-full border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm group-hover/sub:border-[#C5A059] transition-all">
                                                                <img
                                                                    src={sub.imageUrl ? `${API_BASE_URL}${sub.imageUrl}` : getCategoryIcon(sub.slug)}
                                                                    alt={sub.name}
                                                                    className="w-full h-full object-cover p-1"
                                                                    onError={(e) => {
                                                                        e.target.src = getCategoryIcon(sub.slug);
                                                                        e.target.className = "w-6 h-6 object-contain opacity-30 grayscale";
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="!text-xs md:!text-sm lg:!text-base  text-center font-sans font-medium text-[#4A041D] leading-tight line-clamp-2 px-1">
                                                                {sub.name}
                                                            </span>
                                                        </Link>
                                                    ))}

                                                </div>
                                                {category.subCategories.length > 4 && (
                                                    <div className="text-center pt-1 border-t border-gray-50">
                                                        <Link
                                                            to={`/categories/${category.slug}`}
                                                            className="text-[#C5A059] font-sans font-semibold text-[10px] uppercase tracking-widest hover:text-[#9E2A2B] transition-colors inline-flex items-center gap-1"
                                                        >
                                                            Hamısına bax ({category.subCategories.length}) <ChevronRight className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-gray-400 font-sans text-xs italic p-4 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50/50">Alt kateqoriya yoxdur</p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer of Card */}
                                <div className="px-6 pb-6 pt-0 mt-4">
                                    <Link
                                        to={`/categories/${category.slug}`}
                                        className="w-full block text-center py-3 border border-[#4A041D]/10 rounded-full text-[#4A041D] font-medium text-sm hover:bg-[#4A041D] hover:text-white transition-all duration-300"
                                    >
                                        Kolleksiyaya bax
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Categories;
