export function Loading({ label = "Loading…" }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorMessage({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && <button type="button" className="btn" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function Empty({ title, message, action }) {
  return (
    <div className="state">
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  );
}
