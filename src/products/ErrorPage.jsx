import React from 'react';
import { Home, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

// Reusing the button styles and colors from the main theme based on Home.jsx findings
// Primary Color: #4A041D (Deep Burgundy/Red)
// Secondary/Accent: #C5A059 (Gold)
// Text/Secondary Text: #9E2A2B
// Background: #FDFBF8

export default function ErrorPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF8] px-4 py-16 text-center">
      {/* 404 Display */}
      <h1 className="text-[120px] md:text-[180px] font-serif font-bold text-[#4A041D] leading-none opacity-10 select-none">
        404
      </h1>

      <div className="-mt-12 md:-mt-20 relative z-10">
        <h2 className="text-3xl md:text-5xl font-sans text-[#4A041D] font-medium mb-6">
          {t('errorPage.title')}
        </h2>

        <p className="text-[#9E2A2B] text-lg md:text-xl font-sans max-w-lg mx-auto mb-10 leading-relaxed italic">
          {t('errorPage.description')}
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-8 py-3 bg-[#4A041D] text-white font-sans text-sm tracking-widest uppercase hover:bg-[#C5A059] transition-all duration-300 rounded-sm shadow-sm"
          >
            <Home className="w-4 h-4" />
            {t('errorPage.homeButton')}
          </button>

          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 px-8 py-3 bg-transparent border border-[#4A041D] text-[#4A041D] font-sans text-sm tracking-widest uppercase hover:bg-[#F3E7E1] transition-all duration-300 rounded-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            {t('errorPage.productsButton')}
          </button>
        </div>
      </div>
    </div>
  );
}