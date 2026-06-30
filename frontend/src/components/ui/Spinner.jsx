/**
 * Spinner — accessible loading indicator. Use <Loader /> for a centered
 * full-section loading state with an optional label.
 */
export const Spinner = ({ className = "" }) => (
  <span
    role="status"
    aria-label="Loading"
    className={`inline-block size-5 animate-spin rounded-full border-2 border-ink-300 border-t-brand-600 ${className}`}
  />
);

export const Loader = ({ label = "Loading…" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-500">
    <Spinner className="size-7" />
    <p className="text-sm">{label}</p>
  </div>
);

export default Spinner;
