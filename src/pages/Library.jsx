import { useState, useEffect } from 'react'
import { getUserData, toggleVista, toggleLike, togglePendiente } from '../utils/userStorage'
import { getItemsByIds } from '../api/tmdb'
import MovieGrid from '../components/MovieGrid'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/library.css'

const TABS = [
  { key: 'vistas', label: 'Vistas', emoji: '✓' },
  { key: 'likes', label: 'Me gustan', emoji: '♥' },
  { key: 'pendientes', label: 'Pendientes', emoji: '🔖' },
]

function EmptyState({ tab, onNavigate }) {
  const messages = {
    vistas: { title: 'Aún no has marcado ninguna película como vista', desc: 'Cuando veas una película, márcala como vista desde su página de detalle o desde el catálogo.' },
    likes: { title: 'Aún no tienes películas marcadas con Me gusta', desc: 'Dale a ♥ en cualquier película para guardarla aquí.' },
    pendientes: { title: 'Tu lista de pendientes está vacía', desc: 'Añade películas que quieras ver en el futuro pulsando 🔖.' },
  }
  const msg = messages[tab]
  return (
    <div className="library-empty">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
      <h3>{msg.title}</h3>
      <p>{msg.desc}</p>
      <button className="library-empty__btn" onClick={() => onNavigate('/')}>
        Explorar películas
      </button>
    </div>
  )
}

export default function Library({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('vistas')
  const [moviesByTab, setMoviesByTab] = useState({ vistas: [], likes: [], pendientes: [] })
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(getUserData())

  async function loadMovies() {
    setLoading(true)
    const data = getUserData()
    setUserData(data)

    const [vistas, likes, pendientes] = await Promise.all([
      data.vistas.length > 0 ? getItemsByIds(data.vistas) : Promise.resolve([]),
      data.likes.length > 0 ? getItemsByIds(data.likes) : Promise.resolve([]),
      data.pendientes.length > 0 ? getItemsByIds(data.pendientes) : Promise.resolve([]),
    ])

    setMoviesByTab({ vistas, likes, pendientes })
    setLoading(false)
  }

  useEffect(() => {
    loadMovies()
  }, [])

  const currentMovies = moviesByTab[activeTab] || []
  const counts = {
    vistas: userData.vistas?.length || 0,
    likes: userData.likes?.length || 0,
    pendientes: userData.pendientes?.length || 0,
  }

  return (
    <main className="library-page page container">
      <header className="library-page__header">
        <h1 className="library-page__title">Mi Librería</h1>
      </header>

      <nav className="library-tabs" aria-label="Pestañas de librería">
        {TABS.map(({ key, label, emoji }) => (
          <button
            key={key}
            className={`library-tab${activeTab === key ? ' active' : ''}`}
            onClick={() => setActiveTab(key)}
            aria-selected={activeTab === key}
            role="tab"
          >
            {emoji} {label}
            <span className="library-tab__count">{counts[key]}</span>
          </button>
        ))}
      </nav>

      {loading ? (
        <LoadingSpinner text="Cargando tu librería..." />
      ) : currentMovies.length === 0 ? (
        <EmptyState tab={activeTab} onNavigate={onNavigate} />
      ) : (
        <MovieGrid movies={currentMovies} onNavigate={onNavigate} />
      )}
    </main>
  )
}
