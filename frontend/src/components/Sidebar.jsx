import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationsBell from "./NotificationsBell";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        width: "250px",
        background: "#222",
        color: "white",
        minHeight: "100vh",
        padding: "20px"
      }}
    >
      <h2>AMS</h2>

      {/* Dashboard */}
      <Link to="/dashboard">Dashboard</Link>

      <br />
      <br />

      {/* HOD */}
      {user?.role === "HOD" && (
        <>
          <Link to="/requisition">Create Requisition</Link>

          <br />
          <br />

          <Link to="/my-requisitions">My Requisitions</Link>

          <br />
          <br />
        </>
      )}

      {/* Principal */}
      {user?.role === "Principal" && (
        <>
          <Link to="/principal/requisitions">
            View Requisitions
          </Link>

          <br />
          <br />
        </>
      )}

      {/* Stores */}
      {user?.role === "Stores" && (
        <>
          <Link to="/inventory">
            Inventory Management
          </Link>

          <br />
          <br />
        </>
      )}

      {/* Accounts */}
      {user?.role === "Accounts" && (
        <>
          <Link to="/payments">Payments</Link>

          <br />
          <br />
        </>
      )}

      {/* Admin */}
      {user?.role === "Admin" && (
        <>
          <Link to="/users">User Management</Link>

          <br />
          <br />

          <Link to="/inventory">
            Inventory Control
          </Link>

          <br />
          <br />

          <Link to="/payments">
            Payments Control
          </Link>

          <br />
          <br />
        </>
      )}

      {/* Notifications */}
      {(user?.role === "HOD" ||
        user?.role === "Principal" ||
        user?.role === "Stores") && (
        <>
         

          <Link
            to="/notifications"
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>Notifications</span>
            <NotificationsBell />
          </Link>
        </>
      )}
    </div>
  );
};

export default Sidebar;