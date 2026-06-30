import MovieCard from './MovieCard'

export default function MovieGrid({ movies, onNavigate }) {
  if (!movies || movies.length === 0) return null

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onNavigate={onNavigate} />
      ))}
    </div>
  )
}
