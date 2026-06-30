# 🎬 Séptimo Arte

Aplicación web para buscar películas y gestionar tu catálogo personal de cine, construida con React y la API de TMDB.

## Características

- **Búsqueda de películas** en tiempo real
- **Home con últimos estrenos** y películas populares
- **Filtros** por año, valoración y categoría
- **Paginación** de resultados
- **Vista de detalle** con sinopsis, póster, reparto y más
- **Catálogo personal**: marca películas como vistas, pendientes o favoritas
- **Sección de biblioteca** con tus películas vistas y pendientes
- **Indicador de carga** y manejo de errores
- Interfaz completamente en **español**
- Diseño **responsive**

## Stack tecnológico

- HTML5 + CSS3 nativo
- JavaScript (ES Modules)
- React 18
- Vite
- API: [TMDB (The Movie Database)](https://www.themoviedb.org/)

## Requisitos previos

- Node.js 18 o superior
- Una API Key gratuita de [TMDB](https://developer.themoviedb.org/docs/getting-started)

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/DanielRomanRomero/Septimo-Arte.git
cd Septimo-Arte
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea el fichero `.env` en la raíz del proyecto con tu API Key de TMDB:

```env
VITE_TMDB_API_KEY=tu_api_key_aqui
```

4. Arranca el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción |

## Estructura del proyecto

```
septimo-arte/
├── design/                  # Mockups de diseño de referencia
├── public/
├── src/
│   ├── api/
│   │   └── tmdb.js          # Llamadas a la API de TMDB
│   ├── components/          # Componentes reutilizables
│   │   ├── ErrorMessage.jsx
│   │   ├── Filters.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieGrid.jsx
│   │   ├── Pagination.jsx
│   │   └── SearchBar.jsx
│   ├── pages/               # Páginas principales
│   │   ├── Categories.jsx
│   │   ├── Detail.jsx
│   │   ├── Home.jsx
│   │   ├── Library.jsx
│   │   └── Search.jsx
│   ├── styles/              # Estilos CSS por componente/página
│   ├── utils/
│   │   └── userStorage.js   # Gestión de datos del usuario
│   ├── App.jsx
│   └── main.jsx
├── .env                     # Variables de entorno (no versionado)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Configuración de la API

Esta aplicación usa la API REST de TMDB. Para obtener tu API Key gratuita:

1. Regístrate en [themoviedb.org](https://www.themoviedb.org/signup)
2. Ve a **Configuración → API**
3. Solicita una API Key (tipo "Developer")
4. Copia la clave y pégala en tu fichero `.env`

## Datos del usuario

Los datos personales (películas vistas, pendientes y favoritas) se guardan en el **`localStorage` del navegador**, bajo la clave `septimo_arte_datos`. No se requiere ningún fichero externo ni base de datos.

---

> Proyecto de uso personal. Los datos de películas son proporcionados por [TMDB](https://www.themoviedb.org/). Este producto usa la API de TMDB pero no está respaldado ni certificado por TMDB.
