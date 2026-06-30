import { useState, useEffect } from 'react'
import { getGenres, getGenresTv } from '../api/tmdb'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import '../styles/categories.css'

const GENRE_ICONS = {
  28: '💥', 12: '🗺️', 16: '🎨', 35: '😂', 80: '🔫', 99: '📽️',
  18: '🎭', 10751: '👨‍👩‍👧', 14: '🧙', 36: '📜', 27: '👻',
  10402: '🎵', 9648: '🔍', 10749: '❤️', 878: '🚀', 10770: '📺',
  53: '😱', 10752: '⚔️', 37: '🤠',
}

export default function Categories({ onNavigate, mediaFilter }) {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isTvMode = mediaFilter === 'tv'

  async function loadGenres() {
    setLoading(true)
    setError(null)
    const res = isTvMode ? await getGenresTv() : await getGenres()
    if (res.error) { setError(res.error); setLoading(false); return }
    const sorted = [...(res.data.genres || [])].sort((a, b) => a.name.localeCompare(b.name, 'es'))
    setGenres(sorted)
    setLoading(false)
  }

  useEffect(() => {
    loadGenres()
  }, [mediaFilter])

  function handleGenreClick(genreId, genreName) {
    const mediaParam = isTvMode ? '&mediaType=tv' : ''
    onNavigate(`/buscar?genreId=${genreId}&genreName=${encodeURIComponent(genreName)}${mediaParam}`)
  }

  if (loading) return <main className="page"><LoadingSpinner text="Cargando categorías..." /></main>
  if (error) return <main className="page"><div className="container"><ErrorMessage message={error} onRetry={loadGenres} /></div></main>

  return (
    <main className="categories-page page container">
      <header className="categories-page__header">
        <h1 className="categories-page__title">Categorías</h1>
        <p className="categories-page__subtitle">Explora el catálogo por género cinematográfico</p>
      </header>

      <ul className="categories-grid" aria-label="Géneros cinematográficos">
        {genres.map((genre) => (
          <li key={genre.id}>
            <button
              className="category-card"
              onClick={() => handleGenreClick(genre.id, genre.name)}
              aria-label={`Ver películas de ${genre.name}`}
            >
              <span className="category-card__name">{genre.name}</span>
              <span className="category-card__icon" aria-hidden="true">
                {GENRE_ICONS[genre.id] || '🎬'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
