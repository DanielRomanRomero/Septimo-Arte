import { useState, useEffect, useRef } from 'react'
import { searchAll, discoverMovies, discoverTv, normalizeMovie, normalizeTv } from '../api/tmdb'
import MovieGrid from '../components/MovieGrid'
import Pagination from '../components/Pagination'
import Filters from '../components/Filters'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import '../styles/search.css'

export default function Search({ query, genreId, mediaType, onNavigate, mediaFilter }) {
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    genreIds: genreId ? [Number(genreId)] : [],
    minRating: 0,
    year: '',
  })
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Ref para tener siempre los valores más actuales sin problemas de closure
  const stateRef = useRef({})
  stateRef.current = { query, filters, mediaFilter, mediaType }

  async function load(currentPage, currentMediaFilter) {
    const { query: q, filters: f, mediaType: mt } = stateRef.current
    const mf = currentMediaFilter

    setLoading(true)
    setError(null)

    const isTvMode = mt === 'tv' || mf === 'tv'

    let result
    if (q) {
      result = await searchAll(q, currentPage)
    } else {
      const discoverParams = {
        genreId: f.genreIds.join(','),
        minRating: f.minRating || undefined,
        year: f.year || undefined,
      }
      result = isTvMode
        ? await discoverTv(discoverParams, currentPage)
        : await discoverMovies(discoverParams, currentPage)
      if (result.data) {
        result = {
          ...result,
          data: {
            ...result.data,
            results: (result.data.results || []).map(isTvMode ? normalizeTv : normalizeMovie),
          },
        }
      }
    }

    if (result.error) {
      setError(result.error)
    } else {
      let items = result.data.results || []

      if (q) {
        if (mf === 'movie') {
          items = items.filter((m) => m.mediaType === 'movie')
        } else if (mf === 'tv') {
          items = items.filter((m) => m.mediaType === 'tv')
        }
        if (f.genreIds.length > 0) {
          items = items.filter((m) =>
            m.genre_ids?.some((id) => f.genreIds.includes(id))
          )
        }
        if (f.minRating > 0) {
          items = items.filter((m) => m.vote_average >= f.minRating)
        }
        if (f.year) {
          items = items.filter((m) =>
            (m.release_date ?? m.first_air_date ?? '').startsWith(f.year)
          )
        }
      }

      setResults(items)
      setTotalPages(result.data.total_pages || 1)
      setTotalResults(result.data.total_results || 0)
    }
    setLoading(false)
  }

  useEffect(() => {
    setFilters({ genreIds: genreId ? [Number(genreId)] : [], minRating: 0, year: '' })
  }, [genreId])

  useEffect(() => {
    if (genreId) return
    setFilters((prev) => ({ ...prev, genreIds: [] }))
  }, [mediaFilter])

  useEffect(() => {
    setPage(1)
    load(1, mediaFilter)
  }, [query, filters, mediaFilter, mediaType])

  useEffect(() => {
    if (page > 1) load(page, mediaFilter)
  }, [page])

  function handlePageChange(newPage) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleFiltersChange(newFilters) {
    setFilters(newFilters)
  }

  const pageTitle = query
    ? <>Resultados para: <span>&ldquo;{query}&rdquo;</span></>
    : mediaFilter === 'tv' ? 'Explorar series' : 'Explorar películas'

  return (
    <main className="search-page page container">
      <header className="search-page__header">
        <h1 className="search-page__title">{pageTitle}</h1>
        {!loading && (
          <p className="search-page__count">
            {totalResults.toLocaleString('es-ES')} títulos encontrados
          </p>
        )}
      </header>

      <div className="search-page__layout">
        <div className="search-page__sidebar">
          <Filters filters={filters} onChange={handleFiltersChange} isOpen={filtersOpen} mediaFilter={mediaFilter} />
        </div>

        <div className="search-page__results">
          <button
            className="view-toggle__btn"
            style={{ marginBottom: '1.6rem', display: 'block' }}
            onClick={() => setFiltersOpen((prev) => !prev)}
            aria-expanded={filtersOpen}
          >
            {filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>

          {loading ? (
            <LoadingSpinner text="Buscando..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => load(page, mediaFilter)} />
          ) : results.length === 0 ? (
            <div className="search-page__empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h3>Sin resultados</h3>
              <p>No encontramos títulos que coincidan con tu búsqueda o filtros.</p>
            </div>
          ) : (
            <>
              <MovieGrid movies={results} onNavigate={onNavigate} />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>
    </main>
  )
}
