import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {

  const { user } = useAuth();

  return (

    <DashboardLayout>

      <h1>Dashboard</h1>

      <p>Email: {user?.email}</p>

      <p>Role: {user?.role}</p>

      <p>
        Department: {user?.department}
      </p>

    </DashboardLayout>

  );
};

export default Dashboard;