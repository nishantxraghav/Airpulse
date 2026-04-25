import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import styles from './Pagination.module.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // For large page counts, show condensed range
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    if (currentPage <= 4) return [...pages.slice(0, 5), '…', totalPages];
    if (currentPage >= totalPages - 3) return [1, '…', ...pages.slice(totalPages - 5)];
    return [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages];
  };

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        className={styles.navBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <LuChevronLeft size={16} />
      </button>

      <div className={styles.pages}>
        {getVisiblePages().map((page, i) =>
          page === '…' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={page}
              className={[styles.pageBtn, currentPage === page ? styles.active : ''].join(' ')}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className={styles.navBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <LuChevronRight size={16} />
      </button>

      <span className={styles.label}>
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  );
}
