const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'

export const getPosterUrl = (path, size = 'w500') =>
  path ? `${IMG_BASE}/${size}${path}` : null

export const getBackdropUrl = (path, size = 'original') =>
  path ? `${IMG_BASE}/${size}${path}` : null

async function fetchTMDB(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'es-ES')
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') {
      url.searchParams.set(k, v)
    }
  })

  try {
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
    const data = await res.json()
    return { data, error: null }
  } catch (err) {
    return { data: null, error: err.message }
  }
}

// Normaliza un item de TV para que tenga los mismos campos que una película
export function normalizeTv(item) {
  return {
    ...item,
    title: item.title ?? item.name,
    release_date: item.release_date ?? item.first_air_date ?? '',
    mediaType: 'tv',
  }
}

// Normaliza una película añadiendo mediaType
export function normalizeMovie(item) {
  return { ...item, mediaType: 'movie' }
}

// --- Películas ---
export const getNowPlaying = (page = 1) =>
  fetchTMDB('/movie/now_playing', { page })

export const getPopularMovies = (page = 1) =>
  fetchTMDB('/movie/popular', { page })

export const getTopRated = (page = 1) =>
  fetchTMDB('/movie/top_rated', { page })

export const getUpcoming = (page = 1) =>
  fetchTMDB('/movie/upcoming', { page })

export const searchMovies = (query, page = 1) =>
  fetchTMDB('/search/movie', { query, page, include_adult: false })

export const getMovieDetail = (id) =>
  fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,videos' })

export const getGenres = () =>
  fetchTMDB('/genre/movie/list')

export const getGenresTv = () =>
  fetchTMDB('/genre/tv/list')

export const discoverMovies = (filters = {}, page = 1) => {
  const params = { page }
  if (filters.genreId) params.with_genres = filters.genreId
  if (filters.year) params.primary_release_year = filters.year
  if (filters.minRating) params['vote_average.gte'] = filters.minRating
  if (filters.sortBy) params.sort_by = filters.sortBy
  return fetchTMDB('/discover/movie', params)
}

export const discoverTv = (filters = {}, page = 1) => {
  const params = { page }
  if (filters.genreId) params.with_genres = filters.genreId
  if (filters.year) params.first_air_date_year = filters.year
  if (filters.minRating) params['vote_average.gte'] = filters.minRating
  if (filters.sortBy) params.sort_by = filters.sortBy
  return fetchTMDB('/discover/tv', params)
}

export const getMoviesByIds = async (ids) => {
  const results = await Promise.all(ids.map((id) => getMovieDetail(id)))
  return results
    .filter((r) => r.data !== null)
    .map((r) => r.data)
}

// items: array de { id, mediaType }
export const getItemsByIds = async (items) => {
  const results = await Promise.all(
    items.map(({ id, mediaType }) =>
      mediaType === 'tv' ? getTvDetail(id) : getMovieDetail(id)
    )
  )
  return results
    .filter((r) => r.data !== null)
    .map((r, i) => ({
      ...r.data,
      mediaType: items[i].mediaType,
    }))
}

// --- Series ---
export const getPopularTv = (page = 1) =>
  fetchTMDB('/tv/popular', { page })

export const getTopRatedTv = (page = 1) =>
  fetchTMDB('/tv/top_rated', { page })

export const getOnAirTv = (page = 1) =>
  fetchTMDB('/tv/on_the_air', { page })

export const searchTv = (query, page = 1) =>
  fetchTMDB('/search/tv', { query, page, include_adult: false })

export const getTvDetail = (id) =>
  fetchTMDB(`/tv/${id}`, { append_to_response: 'credits,videos' })

// --- Búsqueda combinada (películas + series mezcladas por popularidad) ---
export async function searchAll(query, page = 1) {
  const [moviesRes, tvRes] = await Promise.all([
    searchMovies(query, page),
    searchTv(query, page),
  ])

  if (moviesRes.error && tvRes.error) {
    return { data: null, error: moviesRes.error }
  }

  const movies = (moviesRes.data?.results || []).map(normalizeMovie)
  const tvShows = (tvRes.data?.results || []).map(normalizeTv)
  const combined = [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity)

  const totalResults = (moviesRes.data?.total_results || 0) + (tvRes.data?.total_results || 0)
  const totalPages = Math.max(moviesRes.data?.total_pages || 1, tvRes.data?.total_pages || 1)

  return {
    data: { results: combined, total_results: totalResults, total_pages: totalPages },
    error: null,
  }
}
