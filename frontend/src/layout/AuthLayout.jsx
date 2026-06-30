/**
 * AuthLayout — shared shell for all unauthenticated pages (login, register,
 * forgot/reset password). Provides a branded background, a logo header and a
 * centered card so every auth screen looks consistent.
 */
const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-white/10 text-xl font-bold text-white ring-1 ring-white/20">
            A
          </span>
          <h1 className="text-2xl font-bold text-white">Asset Manager</h1>
          <p className="text-sm text-brand-100">Inventory Management System</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-7 shadow-xl sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-ink-900">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
            ) : null}
          </div>

          {children}
        </div>

        {footer ? (
          <p className="mt-6 text-center text-sm text-brand-100">{footer}</p>
        ) : null}
      </div>
    </div>
  );
};

export default AuthLayout;
