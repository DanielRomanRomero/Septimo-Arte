import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__logo">Séptimo Arte</span>
        <p className="footer__text">Datos proporcionados por TMDB. © {new Date().getFullYear()} Catálogo Personal.</p>
        <nav className="footer__links" aria-label="Enlaces del pie de página">
          <a
            className="footer__link"
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TMDB
          </a>
        </nav>
      </div>
    </footer>
  )
}
