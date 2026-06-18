import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div
        style={{
          padding: "20px",
        }}
      >
        <h1>Dashboard</h1>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
            maxWidth: "600px",
            marginTop: "20px",
          }}
        >
          <h2>User Information</h2>

          <p>
            <strong>Email:</strong>{" "}
            {user?.email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {user?.role}
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {user?.department?.name || "N/A"}
          </p>

          <p>
            <strong>Department Code:</strong>{" "}
            {user?.department?.code || "N/A"}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;