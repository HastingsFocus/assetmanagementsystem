/**
 * EmptyState — friendly placeholder shown when a list/table has no data.
 */
const EmptyState = ({ icon, title = "Nothing here yet", message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-300 bg-white px-6 py-14 text-center">
      {icon ? (
        <div className="mb-3 text-3xl text-ink-400" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <h3 className="text-ink-800">{title}</h3>
      {message ? (
        <p className="mt-1 max-w-sm text-sm text-ink-500">{message}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
