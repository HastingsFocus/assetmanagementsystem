import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationsBell from "./NotificationsBell";
import {
  FiGrid,
  FiFilePlus,
  FiFileText,
  FiFolder,
  FiBox,
  FiRepeat,
  FiList,
  FiInbox,
  FiPlusSquare,
  FiArchive,
  FiTruck,
  FiCreditCard,
  FiUsers,
  FiClipboard,
  FiBell,
} from "react-icons/fi";

/*
=====================================================================
  NAVIGATION CONFIG
  A single declarative source of truth for the sidebar links, grouped
  by role. This replaces the long chain of inline JSX + <br/> spacers.
=====================================================================
*/
const NAV_SECTIONS = [
  {
    heading: null,
    items: [{ to: "/dashboard", label: "Dashboard", icon: FiGrid }],
  },
  {
    heading: "Requisitions",
    roles: ["HOD"],
    items: [
      { to: "/requisition", label: "Create Requisition", icon: FiFilePlus },
      { to: "/my-requisitions", label: "My Requisitions", icon: FiFileText },
    ],
  },
  {
    heading: "Assets",
    roles: ["HOD"],
    items: [
      { to: "/hod/assets", label: "My Department Assets", icon: FiFolder },
      {
        to: "/department-inventory",
        label: "Department Inventory",
        icon: FiBox,
      },
      {
        to: "/asset-transfer-request",
        label: "Request Asset Transfer",
        icon: FiRepeat,
      },
      {
        to: "/my-transfer-requests",
        label: "My Transfer Requests",
        icon: FiList,
      },
    ],
  },
  {
    heading: "Requisitions",
    roles: ["Principal"],
    items: [
      {
        to: "/principal/requisitions",
        label: "Review Requisitions",
        icon: FiClipboard,
      },
    ],
  },
  {
    heading: "Inventory",
    roles: ["Stores"],
    items: [
      { to: "/inventory", label: "Inventory Dashboard", icon: FiGrid },
      {
        to: "/inventory/pending-receivals",
        label: "Pending Receivals",
        icon: FiInbox,
      },
      {
        to: "/inventory/create-asset",
        label: "Create Assets",
        icon: FiPlusSquare,
      },
      { to: "/inventory/assets", label: "Asset Register", icon: FiBox },
      {
        to: "/inventory/condition-requests",
        label: "Condition Requests",
        icon: FiRepeat,
      },
      {
        to: "/inventory/archived-assets",
        label: "Archived Assets",
        icon: FiArchive,
      },
      {
        to: "/stores/pending-transfers",
        label: "Pending Transfers",
        icon: FiTruck,
      },
    ],
  },
  {
    heading: "Finance",
    roles: ["Accounts"],
    items: [{ to: "/payments", label: "Payments", icon: FiCreditCard }],
  },
  {
    heading: "Administration",
    roles: ["Admin"],
    items: [
      { to: "/users", label: "User Management", icon: FiUsers },
      { to: "/inventory/assets", label: "Asset Register", icon: FiBox },
      { to: "/payments", label: "Payments", icon: FiCreditCard },
    ],
  },
];

const linkClass = ({ isActive }) =>
  [
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-white/15 text-white"
      : "text-ink-300 hover:bg-white/10 hover:text-white",
  ].join(" ");

const Sidebar = ({ onNavigate }) => {
  const { user } = useAuth();
  const role = user?.role;

  const visibleSections = NAV_SECTIONS.filter(
    (section) => !section.roles || section.roles.includes(role)
  );

  const showNotifications = ["HOD", "Principal", "Stores", "Accounts"].includes(
    role
  );

  return (
    <aside className="flex h-full w-64 flex-col bg-ink-900 text-white">
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-base font-bold">
          A
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Asset Manager</p>
          <p className="text-xs text-ink-400">{role || "Guest"}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
        aria-label="Main navigation"
      >
        {visibleSections.map((section, idx) => (
          <div key={`${section.heading}-${idx}`}>
            {section.heading ? (
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                {section.heading}
              </p>
            ) : null}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/inventory"}
                      className={linkClass}
                      onClick={onNavigate}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {showNotifications ? (
          <div>
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
              Alerts
            </p>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/notifications"
                  className={linkClass}
                  onClick={onNavigate}
                >
                  <FiBell className="size-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1">Notifications</span>
                  <NotificationsBell />
                </NavLink>
              </li>
            </ul>
          </div>
        ) : null}
      </nav>
    </aside>
  );
};

export default Sidebar;
