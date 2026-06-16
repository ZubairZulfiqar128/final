/**
 * Simple loading indicator for async API fetches.
 */
export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden />
      <span>{label}</span>
    </div>
  )
}
