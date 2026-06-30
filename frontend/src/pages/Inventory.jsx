import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { PageHeader, Card } from "../components/ui";
import {
  FiInbox,
  FiPlusSquare,
  FiBox,
  FiRepeat,
  FiArchive,
  FiTruck,
  FiArrowRight,
} from "react-icons/fi";

const SHORTCUTS = [
  {
    to: "/inventory/pending-receivals",
    label: "Pending Receivals",
    desc: "Receive items from funded requisitions.",
    icon: FiInbox,
  },
  {
    to: "/inventory/create-asset",
    label: "Create Assets",
    desc: "Register newly received items as assets.",
    icon: FiPlusSquare,
  },
  {
    to: "/inventory/assets",
    label: "Asset Register",
    desc: "Browse all assets across departments.",
    icon: FiBox,
  },
  {
    to: "/inventory/condition-requests",
    label: "Condition Requests",
    desc: "Review asset condition change requests.",
    icon: FiRepeat,
  },
  {
    to: "/inventory/archived-assets",
    label: "Archived Assets",
    desc: "View retired and disposed assets.",
    icon: FiArchive,
  },
  {
    to: "/stores/pending-transfers",
    label: "Pending Transfers",
    desc: "Approve inter-department transfers.",
    icon: FiTruck,
  },
];

const Inventory = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Inventory Dashboard"
        subtitle="Manage stock, asset records and store operations."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SHORTCUTS.map(({ to, label, desc, icon: Icon }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition hover:border-brand-300 hover:shadow-md">
              <div className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="size-5" />
                </span>
                <FiArrowRight className="size-4 text-ink-300 transition group-hover:translate-x-1 group-hover:text-brand-600" />
              </div>
              <h3 className="mt-3">{label}</h3>
              <p className="mt-1 text-sm text-ink-500">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
