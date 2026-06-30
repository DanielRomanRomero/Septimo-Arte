import '../styles/spinner.css'

export default function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" aria-label="Cargando" role="status"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  )
}
