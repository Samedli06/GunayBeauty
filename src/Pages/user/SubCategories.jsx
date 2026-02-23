import React, { useEffect, useState } from 'react';
import { useGetCategoryQuery, useGetRecommendedPageQuery, useGetRecommendedQuery, API_BASE_URL } from '../../store/API';
import { Link, useLocation, useParams } from 'react-router';
import { Breadcrumb } from '../../products/Breadcrumb';
import SimilarProducts from '../../components/UI/SimilarRecommendedProducts';

// Skeleton Components
const SkeletonCategoryCard = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex flex-col items-center text-center h-full">
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-24 sm:w-28 md:w-32"></div>
    </div>
  </div>
);

const SubCategoriesSkeleton = () => {
  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Breadcrumb Skeleton */}
        <div className="hidden md:block mb-5">
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-1"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Page Title Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-8 sm:h-9 md:h-10 bg-gray-200 rounded w-48 sm:w-56 md:w-64"></div>
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, index) => (
            <SkeletonCategoryCard key={index} />
          ))}
        </div>

        {/* Similar Products Skeleton */}
        <SimilarProducts products={[]} isLoading={true} />

      </div>
    </section>
  );
};

// Category Card
const CategoryCard = ({ title, imageSrc = null, slug, parentCategory, subCategories = [] }) => (
  <div className="flex flex-col gap-3">
    <Link
      to={`/products/${slug}`}
      state={{
        parentCategoryName: parentCategory?.name,
        parentCategorySlug: parentCategory?.slug
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-[#C5A059]/30 transition-all duration-300 cursor-pointer group flex-1"
    >
      <div className="flex flex-col items-center text-center h-full">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#FDFBF8] transition-all duration-500 overflow-hidden border border-transparent group-hover:border-[#F3E7E1]">
          {imageSrc ? (
            <img
              src={`${API_BASE_URL}${imageSrc}`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center text-[#4A041D]/20">
              No Image
            </div>
          )}
        </div>
        <h3 className="text-sm sm:text-base md:text-lg font-sans font-bold text-[#4A041D] group-hover:text-[#9E2A2B] transition-colors uppercase tracking-wider">
          {title}
        </h3>
      </div>
    </Link>

    {/* Sub-subcategories (3rd Level) */}
    {subCategories && subCategories.length > 0 && (
      <div className="flex flex-col gap-1.5 px-4 py-2 border-l-2 border-[#C5A059]/20 ml-4 lg:ml-8">
        {subCategories.map((sub) => (
          <Link
            key={sub.id}
            to={`/products/${sub.slug}`}
            className="text-[11px] lg:text-xs text-gray-400 hover:text-[#4A041D] transition-colors flex items-center gap-2 group/third"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/30 group-hover/third:bg-[#4A041D] transition-colors"></span>
            {sub.name}
          </Link>
        ))}
      </div>
    )}
  </div>
);

// Main Component
const SubCategories = () => {
  const { slug } = useParams();
  const { data: subs, isLoading } = useGetCategoryQuery(slug);
  console.log(subs)
  const { data: similar, isLoading: isSimilarLoading } = useGetRecommendedPageQuery({
    categoryId: subs?.id,
    page: 1,
    pageSize: 6
  });
  console.log(similar)
  const location = useLocation();
  const { name } = location.state || {};


  if (isLoading || !subs) {
    return <SubCategoriesSkeleton />;
  }

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        <div className=" md:block mb-5">
          <Breadcrumb />
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {subs.name || name}
          </h1>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {subs?.subCategories?.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.name}
              imageSrc={category.imageUrl}
              slug={category.slug}
              parentCategory={subs}
              subCategories={category.subCategories}
            />
          ))}
        </div>

        {/* Similar Products Section */}
        <SimilarProducts
          products={similar?.items}
          isLoading={isSimilarLoading}
          useGridOnMobile={true}
        />
      </div>
    </section>
  );
};

export default SubCategories;
