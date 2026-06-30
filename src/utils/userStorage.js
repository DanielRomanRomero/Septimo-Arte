const STORAGE_KEY = 'septimo_arte_datos'

const DEFAULT_DATA = {
  vistas: [],
  pendientes: [],
  likes: [],
}

export function getUserData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_DATA }
    return JSON.parse(raw)
  } catch {
    return { ...DEFAULT_DATA }
  }
}

function saveUserData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Cada entrada de lista es { id, mediaType }. Comparamos solo por id.
function toggle(list, id, mediaType) {
  const idx = list.findIndex((item) => item.id === id)
  if (idx === -1) return [...list, { id, mediaType }]
  return list.filter((item) => item.id !== id)
}

function includes(list, id) {
  return list.some((item) => item.id === id)
}

export function toggleVista(movieId, mediaType) {
  const data = getUserData()
  data.vistas = toggle(data.vistas, movieId, mediaType)
  saveUserData(data)
  return data
}

export function toggleLike(movieId, mediaType) {
  const data = getUserData()
  data.likes = toggle(data.likes, movieId, mediaType)
  saveUserData(data)
  return data
}

export function togglePendiente(movieId, mediaType) {
  const data = getUserData()
  data.pendientes = toggle(data.pendientes, movieId, mediaType)
  saveUserData(data)
  return data
}

export function isVista(movieId) {
  return includes(getUserData().vistas, movieId)
}

export function isLike(movieId) {
  return includes(getUserData().likes, movieId)
}

export function isPendiente(movieId) {
  return includes(getUserData().pendientes, movieId)
}
