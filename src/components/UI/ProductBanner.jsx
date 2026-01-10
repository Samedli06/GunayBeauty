import React from 'react';

const ProductBanner = () => {
    return (
        <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 mb-6">
            <img
                src="/mock/banner/1654.jpg"
                alt="Product Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.src = '/Icons/logo.svg';
                    e.target.className = 'w-full h-full object-contain p-8';
                }}
            />
        </div>
    );
};

export default ProductBanner;
