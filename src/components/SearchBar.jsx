import { useState } from 'react'
import '../styles/searchbar.css'

export default function SearchBar({ initialValue = '', onSearch, onClear }) {
  const [query, setQuery] = useState(initialValue)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) onSearch(trimmed)
  }

  function handleChange(e) {
    const value = e.target.value
    setQuery(value)
    if (value === '' && onClear) onClear()
  }

  function handleClear() {
    setQuery('')
    if (onClear) onClear()
  }

  return (
    <div className="searchbar">
      <form className="searchbar__form" onSubmit={handleSubmit} role="search">
        <span className="searchbar__icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          className="searchbar__input"
          type="search"
          placeholder="Buscar películas y series..."
          value={query}
          onChange={handleChange}
          aria-label="Buscar películas y series"
        />
        {query && (
          <button
            type="button"
            className="searchbar__clear"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </form>
    </div>
  )
}
