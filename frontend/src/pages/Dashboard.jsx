import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { PageHeader, Card } from "../components/ui";
import { FiMail, FiShield, FiHome, FiHash } from "react-icons/fi";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3">
    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
      <Icon className="size-4" />
    </span>
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p className="text-sm font-medium text-ink-800">{value || "—"}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome${user?.name ? `, ${user.name}` : ""}`}
        subtitle="Here's an overview of your account and workspace."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-1">Account details</h2>
          <p className="mb-2 text-sm text-ink-500">
            Your profile information within the asset management system.
          </p>
          <div className="divide-y divide-ink-100">
            <InfoRow icon={FiMail} label="Email" value={user?.email} />
            <InfoRow icon={FiShield} label="Role" value={user?.role} />
            <InfoRow
              icon={FiHome}
              label="Department"
              value={user?.department?.name}
            />
            <InfoRow
              icon={FiHash}
              label="Department code"
              value={user?.department?.code}
            />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
          <p className="text-sm font-medium text-brand-100">Signed in as</p>
          <p className="mt-1 text-2xl font-bold">{user?.role}</p>
          <p className="mt-4 text-sm text-brand-100">
            Use the navigation on the left to manage requisitions, assets,
            transfers and approvals available to your role.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
