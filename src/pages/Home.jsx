import { useState, useEffect } from 'react'
import {
  getNowPlaying, getPopularMovies, getTopRated, getUpcoming,
  getPopularTv, getTopRatedTv, getOnAirTv,
  getBackdropUrl, normalizeMovie, normalizeTv,
} from '../api/tmdb'
import MovieGrid from '../components/MovieGrid'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import '../styles/home.css'

const isReadable = (item) =>
  item.overview?.trim().length > 0 &&
  (item.title ?? item.name)?.trim().length > 0 &&
  /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(item.title ?? item.name ?? '')

export default function Home({ onNavigate, mediaFilter }) {
  const [featuredMovies, setFeaturedMovies] = useState([])
  const [featuredTv, setFeaturedTv] = useState([])
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [nowPlaying, setNowPlaying] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [popularTv, setPopularTv] = useState([])
  const [topRatedTv, setTopRatedTv] = useState([])
  const [onAirTv, setOnAirTv] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadAll() {
    setLoading(true)
    setError(null)

    const [nowRes, popMovRes, topMovRes, upcomRes, popTvRes, topTvRes, onAirRes] = await Promise.all([
      getNowPlaying(1),
      getPopularMovies(1),
      getTopRated(1),
      getUpcoming(1),
      getPopularTv(1),
      getTopRatedTv(1),
      getOnAirTv(1),
    ])

    if (nowRes.error) {
      setError(nowRes.error)
      setLoading(false)
      return
    }

    const nowResults = (nowRes.data.results || []).map(normalizeMovie)
    const popularTvResults = (popTvRes.data?.results || []).map(normalizeTv)

    const readableMovies = nowResults.filter(isReadable)
    const readableTv = popularTvResults.filter(isReadable)

    setFeaturedMovies(readableMovies.slice(0, 5))
    setFeaturedTv(readableTv.slice(0, 5))
    setNowPlaying(readableMovies.slice(5))
    setFeaturedIndex(0)

    setPopularMovies((popMovRes.data?.results || []).map(normalizeMovie))
    setTopRated((topMovRes.data?.results || []).map(normalizeMovie))
    setUpcoming((upcomRes.data?.results || []).map(normalizeMovie))
    setPopularTv((popTvRes.data?.results || []).map(normalizeTv))
    setTopRatedTv((topTvRes.data?.results || []).map(normalizeTv))
    setOnAirTv((onAirRes.data?.results || []).map(normalizeTv))

    setLoading(false)
  }

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    setFeaturedIndex(0)
  }, [mediaFilter])

  const featuredList = mediaFilter === 'tv' ? featuredTv
    : mediaFilter === 'movie' ? featuredMovies
    : [...featuredMovies, ...featuredTv].slice(0, 5)

  function goPrev() {
    setFeaturedIndex((i) => (i - 1 + featuredList.length) % featuredList.length)
  }

  function goNext() {
    setFeaturedIndex((i) => (i + 1) % featuredList.length)
  }

  if (loading) return <main className="page"><LoadingSpinner text="Cargando estrenos..." /></main>
  if (error) return <main className="page"><div className="container"><ErrorMessage message={error} onRetry={loadAll} /></div></main>

  const featured = featuredList[featuredIndex] || null
  const showMovies = mediaFilter === 'all' || mediaFilter === 'movie'
  const showTv = mediaFilter === 'all' || mediaFilter === 'tv'

  return (
    <main className="page">
      {featured && (
        <section className="home-hero" aria-label="Destacado">
          {getBackdropUrl(featured.backdrop_path) ? (
            <img
              className="home-hero__backdrop"
              src={getBackdropUrl(featured.backdrop_path)}
              alt=""
              aria-hidden="true"
            />
          ) : (
            <div style={{ background: 'var(--color-bg-elevated)', position: 'absolute', inset: 0 }} aria-hidden="true" />
          )}
          <div className="home-hero__gradient" aria-hidden="true" />

          {featuredList.length > 1 && (
            <button className="home-hero__nav home-hero__nav--prev" onClick={goPrev} aria-label="Anterior">
              &#8249;
            </button>
          )}

          <div className="container">
            <div className="home-hero__content">
              <div className="home-hero__badges">
                <span className={`home-hero__badge home-hero__badge--type home-hero__badge--type-${featured.mediaType === 'tv' ? 'tv' : 'movie'}`}>
                  {featured.mediaType === 'tv' ? 'Serie' : 'Película'}
                </span>
                {(featured.release_date || featured.first_air_date) && (
                  <span className="home-hero__badge home-hero__badge--year">
                    {(featured.release_date || featured.first_air_date).slice(0, 4)}
                  </span>
                )}
                {featured.vote_average > 0 && (
                  <span className="home-hero__badge home-hero__badge--genre">
                    ★ {featured.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              <h1 className="home-hero__title">{featured.title ?? featured.name}</h1>
              {featured.overview && (
                <p className="home-hero__overview">{featured.overview}</p>
              )}
              <div className="home-hero__actions">
                <button
                  className="btn btn--primary"
                  onClick={() => onNavigate(`/pelicula/${featured.id}`)}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </div>

          {featuredList.length > 1 && (
            <button className="home-hero__nav home-hero__nav--next" onClick={goNext} aria-label="Siguiente">
              &#8250;
            </button>
          )}

          {featuredList.length > 1 && (
            <div className="home-hero__dots" aria-hidden="true">
              {featuredList.map((_, i) => (
                <button
                  key={i}
                  className={`home-hero__dot${i === featuredIndex ? ' home-hero__dot--active' : ''}`}
                  onClick={() => setFeaturedIndex(i)}
                  aria-label={`Ir a destacado ${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {showMovies && nowPlaying.length > 0 && (
        <section className="home-section container" aria-label="En cartelera">
          <div className="home-section__header">
            <h2 className="home-section__title">En cartelera</h2>
            <span className="home-section__subtitle">{nowPlaying.length} películas</span>
          </div>
          <MovieGrid movies={nowPlaying} onNavigate={onNavigate} />
        </section>
      )}

      {showTv && popularTv.length > 0 && (
        <section className="home-section container" aria-label="Series populares">
          <div className="home-section__header">
            <h2 className="home-section__title">Series populares</h2>
          </div>
          <MovieGrid movies={popularTv} onNavigate={onNavigate} />
        </section>
      )}

      {showMovies && popularMovies.length > 0 && (
        <section className="home-section container" aria-label="Películas populares">
          <div className="home-section__header">
            <h2 className="home-section__title">Películas populares</h2>
          </div>
          <MovieGrid movies={popularMovies} onNavigate={onNavigate} />
        </section>
      )}

      {showMovies && topRated.length > 0 && (
        <section className="home-section container" aria-label="Mejor valoradas">
          <div className="home-section__header">
            <h2 className="home-section__title">Mejor valoradas</h2>
          </div>
          <MovieGrid movies={topRated} onNavigate={onNavigate} />
        </section>
      )}

      {showTv && topRatedTv.length > 0 && (
        <section className="home-section container" aria-label="Series mejor valoradas">
          <div className="home-section__header">
            <h2 className="home-section__title">Series mejor valoradas</h2>
          </div>
          <MovieGrid movies={topRatedTv} onNavigate={onNavigate} />
        </section>
      )}

      {showMovies && upcoming.length > 0 && (
        <section className="home-section container" aria-label="Próximos estrenos">
          <div className="home-section__header">
            <h2 className="home-section__title">Próximos estrenos</h2>
          </div>
          <MovieGrid movies={upcoming} onNavigate={onNavigate} />
        </section>
      )}

      {showTv && onAirTv.length > 0 && (
        <section className="home-section container" aria-label="Series en emisión">
          <div className="home-section__header">
            <h2 className="home-section__title">Series en emisión</h2>
          </div>
          <MovieGrid movies={onAirTv} onNavigate={onNavigate} />
        </section>
      )}
    </main>
  )
}
