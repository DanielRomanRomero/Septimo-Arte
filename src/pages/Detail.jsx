import { useState, useEffect } from 'react'
import { getMovieDetail, getTvDetail, getPosterUrl, getBackdropUrl } from '../api/tmdb'
import { toggleVista, toggleLike, togglePendiente, isVista, isLike, isPendiente } from '../utils/userStorage'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import '../styles/detail.css'

function formatRuntime(minutes) {
  if (!minutes) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const TV_STATUS = {
  'Returning Series': 'En emisión',
  'Ended': 'Finalizada',
  'Canceled': 'Cancelada',
  'In Production': 'En producción',
  'Planned': 'Planificada',
  'Pilot': 'Piloto',
}

export default function Detail({ itemId, mediaType, onNavigate }) {
  const isTv = mediaType === 'tv'
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState({ vista: false, like: false, pendiente: false })

  async function loadItem() {
    setLoading(true)
    setError(null)
    const { data, error: err } = isTv ? await getTvDetail(itemId) : await getMovieDetail(itemId)
    if (err) {
      setError(err)
    } else {
      setItem(data)
      setUserData({
        vista: isVista(data.id),
        like: isLike(data.id),
        pendiente: isPendiente(data.id),
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    loadItem()
    window.scrollTo({ top: 0 })
  }, [itemId, mediaType])

  function handleVista() {
    toggleVista(item.id, mediaType)
    setUserData((prev) => ({ ...prev, vista: !prev.vista }))
  }

  function handleLike() {
    toggleLike(item.id, mediaType)
    setUserData((prev) => ({ ...prev, like: !prev.like }))
  }

  function handlePendiente() {
    togglePendiente(item.id, mediaType)
    setUserData((prev) => ({ ...prev, pendiente: !prev.pendiente }))
  }

  const loadingText = isTv ? 'Cargando serie...' : 'Cargando película...'
  if (loading) return <main className="page"><LoadingSpinner text={loadingText} /></main>
  if (error) return <main className="page"><div className="container"><ErrorMessage message={error} onRetry={loadItem} /></div></main>
  if (!item) return null

  const title = item.title ?? item.name ?? '—'
  const originalDate = item.release_date ?? item.first_air_date ?? ''
  const year = originalDate ? originalDate.slice(0, 4) : '—'

  const director = item.credits?.crew?.find((c) => c.job === 'Director')
  const writers = item.credits?.crew?.filter((c) => c.job === 'Screenplay' || c.job === 'Writer').slice(0, 3)
  const trailer = item.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
  const runtime = isTv
    ? (item.episode_run_time?.[0] ? `${item.episode_run_time[0]} min/ep` : null)
    : formatRuntime(item.runtime)

  const tvStatus = isTv && item.status ? (TV_STATUS[item.status] ?? item.status) : null
  const creators = isTv ? item.created_by?.slice(0, 3) : null

  return (
    <main className="detail-page page">
      <div className="detail-backdrop">
        {getBackdropUrl(item.backdrop_path) ? (
          <img
            className="detail-backdrop__img"
            src={getBackdropUrl(item.backdrop_path)}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <div style={{ background: 'var(--color-bg-elevated)', width: '100%', height: '100%' }} aria-hidden="true" />
        )}
        <div className="detail-backdrop__gradient" aria-hidden="true" />
      </div>

      <div className="detail-content container">
        <button
          onClick={() => onNavigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '2.4rem',
            color: 'var(--color-text-secondary)',
            fontSize: '1.4rem',
            transition: 'color var(--transition)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
        >
          ← Volver
        </button>

        <div className="detail-main">
          <div className="detail-poster">
            {getPosterUrl(item.poster_path) ? (
              <img src={getPosterUrl(item.poster_path)} alt={`Póster de ${title}`} />
            ) : (
              <div className="detail-poster__placeholder">
                <span style={{ fontSize: '4rem', opacity: 0.3 }}>{isTv ? '📺' : '🎬'}</span>
              </div>
            )}
          </div>

          <div className="detail-info">
            <div className="detail-meta">
              <span className={`detail-meta__type detail-meta__type--${isTv ? 'tv' : 'movie'}`}>
                {isTv ? 'Serie' : 'Película'}
              </span>
              {year && <span className="detail-meta__item">{year}</span>}
              {runtime && <span className="detail-meta__item">{runtime}</span>}
              {item.vote_average > 0 && (
                <span className="detail-meta__rating">
                  ★ {item.vote_average.toFixed(1)}
                  <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400, fontSize: '1.2rem' }}>
                    &nbsp;/ 10 IMDb
                  </span>
                </span>
              )}
            </div>

            <h1 className="detail-title">{title}</h1>

            {item.tagline && <p className="detail-tagline">{item.tagline}</p>}

            {isTv && (
              <dl className="detail-tv-stats">
                {typeof item.number_of_seasons === 'number' && (
                  <div className="detail-tv-stats__item">
                    <dt>Temporadas</dt>
                    <dd>{item.number_of_seasons}</dd>
                  </div>
                )}
                {typeof item.number_of_episodes === 'number' && (
                  <div className="detail-tv-stats__item">
                    <dt>Episodios</dt>
                    <dd>{item.number_of_episodes}</dd>
                  </div>
                )}
                {tvStatus && (
                  <div className="detail-tv-stats__item">
                    <dt>Estado</dt>
                    <dd>{tvStatus}</dd>
                  </div>
                )}
              </dl>
            )}

            {item.genres?.length > 0 && (
              <ul className="detail-genres" aria-label="Géneros">
                {item.genres.map((g) => (
                  <li key={g.id} className="detail-genre-tag">{g.name}</li>
                ))}
              </ul>
            )}

            {item.overview && (
              <p className="detail-overview">{item.overview}</p>
            )}

            <div className="detail-actions">
              <button
                className={`detail-action-btn${userData.vista ? ' active-vista' : ''}`}
                onClick={handleVista}
                aria-pressed={userData.vista}
              >
                ✓ {userData.vista ? 'Vista' : 'Marcar como vista'}
              </button>
              <button
                className={`detail-action-btn${userData.like ? ' active-like' : ''}`}
                onClick={handleLike}
                aria-pressed={userData.like}
              >
                ♥ {userData.like ? 'Me gusta' : 'Me gusta'}
              </button>
              <button
                className={`detail-action-btn${userData.pendiente ? ' active-pendiente' : ''}`}
                onClick={handlePendiente}
                aria-pressed={userData.pendiente}
              >
                🔖 {userData.pendiente ? 'En pendientes' : 'Pendiente de ver'}
              </button>
            </div>

            <dl className="detail-crew">
              {!isTv && director && (
                <div className="detail-crew__item">
                  <dt>Director</dt>
                  <dd>{director.name}</dd>
                </div>
              )}
              {isTv && creators && creators.length > 0 && (
                <div className="detail-crew__item">
                  <dt>Creador{creators.length > 1 ? 'es' : ''}</dt>
                  <dd>{creators.map((c) => c.name).join(', ')}</dd>
                </div>
              )}
              {writers && writers.length > 0 && (
                <div className="detail-crew__item">
                  <dt>Guionistas</dt>
                  <dd>{writers.map((w) => w.name).join(', ')}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {trailer && (
          <section className="detail-trailer" aria-label="Tráiler">
            <h2>Tráiler</h2>
            <div className="detail-trailer__embed">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`Tráiler de ${title}`}
                allowFullScreen
              />
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
