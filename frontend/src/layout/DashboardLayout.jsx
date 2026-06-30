import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

/**
 * DashboardLayout — the authenticated app shell.
 *
 * Layout:
 *  - Fixed sidebar on large screens.
 *  - On smaller screens the sidebar becomes an off-canvas drawer toggled
 *    from the Topbar menu button.
 *  - Page content is rendered inside a semantic <main> with a constrained
 *    max width for readability.
 */
const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-100">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 shadow-xl">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      {/* Content column (offset by sidebar width on desktop) */}
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
