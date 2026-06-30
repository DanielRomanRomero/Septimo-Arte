import { useState, useCallback } from 'react'
import { getPosterUrl } from '../api/tmdb'
import { toggleVista, toggleLike, togglePendiente, isVista, isLike, isPendiente } from '../utils/userStorage'
import '../styles/moviecard.css'

export default function MovieCard({ movie, onNavigate }) {
  const [userData, setUserData] = useState({
    vista: isVista(movie.id),
    like: isLike(movie.id),
    pendiente: isPendiente(movie.id),
  })

  const posterUrl = getPosterUrl(movie.poster_path)
  const title = movie.title ?? movie.name ?? '—'
  const releaseDate = movie.release_date ?? movie.first_air_date ?? ''
  const year = releaseDate ? releaseDate.slice(0, 4) : '—'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null
  const isTv = movie.mediaType === 'tv' || (!movie.release_date && !!movie.first_air_date)

  const handleVista = useCallback((e) => {
    e.stopPropagation()
    toggleVista(movie.id, isTv ? 'tv' : 'movie')
    setUserData((prev) => ({ ...prev, vista: !prev.vista }))
  }, [movie.id, isTv])

  const handleLike = useCallback((e) => {
    e.stopPropagation()
    toggleLike(movie.id, isTv ? 'tv' : 'movie')
    setUserData((prev) => ({ ...prev, like: !prev.like }))
  }, [movie.id, isTv])

  const handlePendiente = useCallback((e) => {
    e.stopPropagation()
    togglePendiente(movie.id, isTv ? 'tv' : 'movie')
    setUserData((prev) => ({ ...prev, pendiente: !prev.pendiente }))
  }, [movie.id, isTv])

  function handleClick() {
    onNavigate(isTv ? `/serie/${movie.id}` : `/pelicula/${movie.id}`)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <article
      className="movie-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${title}`}
    >
      {posterUrl ? (
        <img
          className="movie-card__poster"
          src={posterUrl}
          alt={`Póster de ${title}`}
          loading="lazy"
        />
      ) : (
        <div className="movie-card__no-poster">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="2" width="20" height="20" rx="2" />
            <path d="M8 10l2 2 4-4" />
          </svg>
          <span>Sin imagen</span>
        </div>
      )}

      <div className="movie-card__type-badge" aria-hidden="true">
        {isTv ? 'SERIE' : 'PELÍCULA'}
      </div>

      <div className="movie-card__badges" aria-hidden="true">
        {userData.vista && <span className="movie-card__badge movie-card__badge--vista" title="Vista">✓</span>}
        {userData.like && <span className="movie-card__badge movie-card__badge--like" title="Me gusta">♥</span>}
        {userData.pendiente && <span className="movie-card__badge movie-card__badge--pendiente" title="Pendiente">🔖</span>}
      </div>

      <div className="movie-card__overlay">
        <h3 className="movie-card__title">{title}</h3>
        <p className="movie-card__year">{year}</p>
        {rating && (
          <div className="movie-card__rating">
            <span>★</span>
            <span>{rating}</span>
          </div>
        )}
        <div className="movie-card__actions">
          <button
            className={`movie-card__action-btn${userData.vista ? ' active-vista' : ''}`}
            onClick={handleVista}
            title={userData.vista ? 'Marcar como no vista' : 'Marcar como vista'}
            aria-pressed={userData.vista}
          >
            ✓
          </button>
          <button
            className={`movie-card__action-btn${userData.like ? ' active-like' : ''}`}
            onClick={handleLike}
            title={userData.like ? 'Quitar me gusta' : 'Me gusta'}
            aria-pressed={userData.like}
          >
            ♥
          </button>
          <button
            className={`movie-card__action-btn${userData.pendiente ? ' active-pendiente' : ''}`}
            onClick={handlePendiente}
            title={userData.pendiente ? 'Quitar de pendientes' : 'Añadir a pendientes'}
            aria-pressed={userData.pendiente}
          >
            🔖
          </button>
        </div>
      </div>
    </article>
  )
}
