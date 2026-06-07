import { useAuth } from "../context/AuthContext";

const Topbar = () => {

  const { user, logout } = useAuth();

  return (

    <div
      style={{
        padding: "15px",
        background: "#eee",
        display: "flex",
        justifyContent: "space-between"
      }}
    >

      <div>
        Welcome {user?.role}
      </div>

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
};

export default Topbar;