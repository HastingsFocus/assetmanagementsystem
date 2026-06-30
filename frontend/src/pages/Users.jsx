import DashboardLayout from "../layout/DashboardLayout";
import { PageHeader, Card, EmptyState } from "../components/ui";
import { FiUsers } from "react-icons/fi";

const Users = () => {
  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiUsers />}
        title="User Management"
        subtitle="Manage system users, roles, permissions and access levels."
      />

      <Card padded={false}>
        <EmptyState
          icon={<FiUsers />}
          title="User management is coming soon"
          message="This area will let administrators view registered users, assign roles and manage access. The backend endpoints for this view are not wired up yet."
        />
      </Card>
    </DashboardLayout>
  );
};

export default Users;
