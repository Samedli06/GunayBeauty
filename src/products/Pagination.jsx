import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { current } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslation();
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      }

      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center mt-12 mb-8" aria-label={t('pagination.navigation')}>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`w-10 h-10 rounded-full flex justify-center items-center transition-all duration-300
            ${currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-[#4A041D] hover:text-white hover:bg-[#4A041D] cursor-pointer'}`}
          aria-label={t('pagination.previousPage')}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-[#4A041D]/50 font-sans"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={currentPage === page}
                className={`w-10 h-10 rounded-full text-sm font-sans font-semibold transition-all duration-300
                  ${currentPage === page
                    ? 'bg-[#4A041D] text-white shadow-md shadow-[#4A041D]/20 transform scale-110'
                    : 'text-[#4A041D] hover:text-[#C5A059] hover:bg-[#4A041D]/5 cursor-pointer'}`}
                aria-label={`${t('pagination.page')} ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`w-10 h-10 rounded-full flex justify-center items-center transition-all duration-300
            ${currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-[#4A041D] hover:text-white hover:bg-[#4A041D] cursor-pointer'}`}
          aria-label={t('pagination.nextPage')}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}