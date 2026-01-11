import { LogIn, UserPlus } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const UnauthorizedModal = ({ isOpen, onClose, action }) => {
  const navigate = useNavigate();
  const { t } = useTranslation()

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      onClick={onClose}
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <div
        className={`bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#4A041D]/5 mb-6">
            <LogIn className="h-8 w-8 text-[#4A041D]" />
          </div>
          <h3 className="text-xl font-bold text-[#4A041D] mb-3">
            {t('signInRequired')}
          </h3>
          <p className="text-sm whitespace-normal text-gray-600 mb-8 leading-relaxed">
            {t('signInRequiredMessage')}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="flex-1 bg-[#4A041D] hover:bg-[#6D082D] text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <LogIn className="w-5 h-5" />
              {t('signIn')}
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex-1 bg-white border border-[#4A041D]/20 hover:border-[#4A041D] text-[#4A041D] py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:bg-[#4A041D]/5"
            >
              <UserPlus className="w-5 h-5" />
              {t('signUp')}
            </button>
          </div>
          <button
            onClick={onClose}
            className="mt-6 text-sm text-gray-400 hover:text-[#C5A059] transition-colors font-medium"
          >
            {t('continueBrowsing')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedModal