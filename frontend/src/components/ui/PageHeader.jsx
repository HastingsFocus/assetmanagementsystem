/**
 * PageHeader — consistent page title block with an optional subtitle and
 * a right-aligned actions slot (buttons, filters, etc.).
 */
const PageHeader = ({ title, subtitle, icon, actions }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="flex items-center gap-2.5">
          {icon ? (
            <span className="text-brand-600" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <span className="truncate">{title}</span>
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
};

export default PageHeader;
