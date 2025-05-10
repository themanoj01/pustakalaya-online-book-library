import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  siblingCount = 1 
}) => {
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const generatePaginationItems = () => {
    // If there are 7 or fewer pages, show all pages
    if (totalPages <= 7) {
      return range(1, totalPages);
    }

    // Basic algorithm for pagination with ellipsis
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Always show first and last page
    if (shouldShowLeftDots && shouldShowRightDots) {
      // Show both ellipses
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, '...', ...middleRange, '...', totalPages];
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      // Show only left ellipsis
      const rightRange = range(leftSiblingIndex, totalPages);
      return [1, '...', ...rightRange];
    } else if (!shouldShowLeftDots && shouldShowRightDots) {
      // Show only right ellipsis
      const leftRange = range(1, rightSiblingIndex);
      return [...leftRange, '...', totalPages];
    }
    
    // Fallback to showing all pages (shouldn't happen given constraints)
    return range(1, totalPages);
  };

  const paginationItems = generatePaginationItems();

  return (
    <div className="pagination">
      <button
        className="pagination-button prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>
      
      <div className="pagination-numbers">
        {paginationItems.map((item, index) => {
          if (item === '...') {
            return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
          }
          
          return (
            <button
              key={item}
              className={`pagination-number ${item === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(item)}
              aria-current={item === currentPage ? 'page' : undefined}
              aria-label={`Page ${item}`}
            >
              {item}
            </button>
          );
        })}
      </div>
      
      <button
        className="pagination-button next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;