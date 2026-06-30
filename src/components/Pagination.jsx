import '../styles/pagination.css'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxPages = Math.min(totalPages, 500)
  if (maxPages <= 1) return null

  function getPages() {
    const pages = []
    const delta = 2
    const left = Math.max(1, currentPage - delta)
    const right = Math.min(maxPages, currentPage + delta)

    if (left > 1) {
      pages.push(1)
      if (left > 2) pages.push('...')
    }
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < maxPages) {
      if (right < maxPages - 1) pages.push('...')
      pages.push(maxPages)
    }
    return pages
  }

  const pages = getPages()

  return (
    <nav className="pagination" aria-label="Paginación">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        ‹
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="pagination__ellipsis">…</span>
        ) : (
          <button
            key={page}
            className={`pagination__btn${page === currentPage ? ' active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Ir a página ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPages}
        aria-label="Página siguiente"
      >
        ›
      </button>
    </nav>
  )
}
