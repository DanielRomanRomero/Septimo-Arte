import '../styles/error.css'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <div className="error-box__icon">⚠</div>
      <p className="error-box__msg">{message || 'Ha ocurrido un error inesperado.'}</p>
      {onRetry && (
        <button className="error-box__retry" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
