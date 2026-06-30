import { useState } from 'react'
import SearchBar from './SearchBar'
import '../styles/header.css'

const NAV_LINKS = [
  { label: 'Inicio', path: '/' },
  { label: 'Mi Librería', path: '/libreria' },
  { label: 'Categorías', path: '/categorias' },
]

const MEDIA_OPTIONS = [
  { value: 'all', label: 'Todo' },
  { value: 'movie', label: 'Películas' },
  { value: 'tv', label: 'Series' },
]

export default function Header({ currentPath, onNavigate, mediaFilter, onMediaFilterChange }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function handleSearch(query) {
    setMenuOpen(false)
    onNavigate(`/buscar?q=${encodeURIComponent(query)}`)
  }

  function handleClear() {
    setMenuOpen(false)
    onNavigate('/')
  }

  function handleNavClick(path) {
    setMenuOpen(false)
    onNavigate(path)
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <button
          className="header__logo"
          onClick={() => handleNavClick('/')}
          aria-label="Ir al inicio - Séptimo Arte"
        >
          Séptimo Arte
        </button>

        <nav className={`header__nav${menuOpen ? ' open' : ''}`} aria-label="Navegación principal">
          {NAV_LINKS.map(({ label, path }) => (
            <button
              key={path}
              className={`header__nav-link${currentPath === path ? ' active' : ''}`}
              onClick={() => handleNavClick(path)}
              aria-current={currentPath === path ? 'page' : undefined}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="header__media-filter" role="group" aria-label="Filtrar por tipo">
          {MEDIA_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`header__filter-btn${mediaFilter === value ? ' active' : ''}`}
              onClick={() => onMediaFilterChange(value)}
              aria-pressed={mediaFilter === value}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="header__search">
          <SearchBar onSearch={handleSearch} onClear={handleClear} />
        </div>

        <button
          className="header__menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Abrir menú"
        >
          <span className={`header__menu-icon${menuOpen ? ' open' : ''}`} aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  )
}
