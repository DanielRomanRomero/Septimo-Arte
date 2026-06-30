import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import Detail from './pages/Detail'
import Library from './pages/Library'
import Categories from './pages/Categories'

function parseLocation() {
  const path = window.location.pathname
  const search = new URLSearchParams(window.location.search)
  return { path, search }
}

function getRoute(path, search) {
  if (path === '/') return { name: 'home' }
  if (path === '/buscar') return {
    name: 'search',
    query: search.get('q') || '',
    genreId: search.get('genreId') || null,
    genreName: search.get('genreName') || null,
    mediaType: search.get('mediaType') || null,
  }
  if (path.startsWith('/pelicula/')) return { name: 'detail', id: path.split('/pelicula/')[1], mediaType: 'movie' }
  if (path.startsWith('/serie/')) return { name: 'detail', id: path.split('/serie/')[1], mediaType: 'tv' }
  if (path === '/libreria') return { name: 'library' }
  if (path === '/categorias') return { name: 'categories' }
  return { name: 'home' }
}

export default function App() {
  const [location, setLocation] = useState(parseLocation())
  const [mediaFilter, setMediaFilter] = useState('all')

  function navigate(to) {
    if (to === -1) {
      window.history.back()
      return
    }
    window.history.pushState({}, '', to)
    setLocation(parseLocation())
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    function onPopState() {
      setLocation(parseLocation())
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const route = getRoute(location.path, location.search)

  function renderPage() {
    switch (route.name) {
      case 'home':
        return <Home onNavigate={navigate} mediaFilter={mediaFilter} />
      case 'search':
        return <Search query={route.query} genreId={route.genreId} mediaType={route.mediaType} onNavigate={navigate} mediaFilter={mediaFilter} />
      case 'detail':
        return <Detail itemId={Number(route.id)} mediaType={route.mediaType} onNavigate={navigate} />
      case 'library':
        return <Library onNavigate={navigate} />
      case 'categories':
        return <Categories onNavigate={navigate} mediaFilter={mediaFilter} />
      default:
        return <Home onNavigate={navigate} mediaFilter={mediaFilter} />
    }
  }

  return (
    <>
      <Header
        currentPath={location.path}
        onNavigate={navigate}
        mediaFilter={mediaFilter}
        onMediaFilterChange={setMediaFilter}
      />
      {renderPage()}
      <Footer />
    </>
  )
}
