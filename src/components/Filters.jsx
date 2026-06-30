import { useState, useEffect } from 'react'
import { getGenres, getGenresTv } from '../api/tmdb'
import '../styles/filters.css'

const RATING_OPTIONS = [
  { value: 0, label: 'Todas' },
  { value: 4, label: '4+' },
  { value: 6, label: '6+' },
  { value: 7, label: '7+' },
  { value: 8, label: '8+' },
]

export default function Filters({ filters, onChange, isOpen, mediaFilter }) {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    const fetch = mediaFilter === 'tv' ? getGenresTv : getGenres
    fetch().then(({ data }) => {
      if (data) setGenres(data.genres)
    })
  }, [mediaFilter])

  function handleGenreToggle(id) {
    const currentIds = (filters.genreIds || []).map(Number)
    const numId = Number(id)
    const newIds = currentIds.includes(numId)
      ? currentIds.filter((g) => g !== numId)
      : [...currentIds, numId]
    onChange({ ...filters, genreIds: newIds })
  }

  function handleRating(value) {
    onChange({ ...filters, minRating: value })
  }

  function handleYear(e) {
    onChange({ ...filters, year: e.target.value })
  }

  function handleReset() {
    onChange({ genreIds: [], minRating: 0, year: '' })
  }

  const currentGenres = (filters.genreIds || []).map(Number)
  const currentRating = filters.minRating || 0

  return (
    <aside className={`filters${isOpen ? ' filters--open' : ''}`}>
      <h2 className="filters__title">Filtros</h2>

      <section className="filters__section">
        <h3 className="filters__section-title">Géneros</h3>
        <div className="filters__genres">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`filters__genre-btn${currentGenres.includes(genre.id) ? ' active' : ''}`}
              onClick={() => handleGenreToggle(genre.id)}
              aria-pressed={currentGenres.includes(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </section>

      <section className="filters__section">
        <h3 className="filters__section-title">Puntuación mínima</h3>
        <div className="filters__stars">
          {RATING_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`filters__genre-btn${currentRating === value ? ' active' : ''}`}
              onClick={() => handleRating(value)}
              aria-pressed={currentRating === value}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="filters__section">
        <h3 className="filters__section-title">Año de estreno</h3>
        <input
          className="filters__year-input"
          type="number"
          placeholder="Ej: 2023"
          min="1900"
          max={new Date().getFullYear()}
          value={filters.year || ''}
          onChange={handleYear}
          aria-label="Filtrar por año"
        />
      </section>

      <button className="filters__reset-btn" onClick={handleReset}>
        Limpiar filtros
      </button>
    </aside>
  )
}
