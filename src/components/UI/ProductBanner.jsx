import React from 'react';
import { useGetBannersQuery } from '../../store/API';
import BannerSlider from './BannerSlider';

const ProductBanner = () => {
    const { data: banners, isLoading } = useGetBannersQuery(1);

    if (isLoading) {
        return (
            <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-2xl bg-gray-200 animate-pulse mb-6" />
        );
    }

    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 h-[200px] md:h-[300px] lg:h-[400px]">
            <BannerSlider banners={banners} isLoading={isLoading} disableAnimation={true} />
        </div>
    );
};

export default ProductBanner;
