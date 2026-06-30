import { useAuth } from "../context/AuthContext";
import { FiMenu, FiLogOut } from "react-icons/fi";

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <FiMenu className="size-5" />
        </button>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink-900">
            Welcome{user?.name ? `, ${user.name}` : ""}
          </p>
          <p className="text-xs text-ink-500">{user?.role} workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
          aria-hidden="true"
        >
          {initial}
        </span>
        <button type="button" onClick={logout} className="btn btn-secondary btn-sm">
          <FiLogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
