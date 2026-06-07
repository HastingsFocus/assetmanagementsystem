import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = ({ children }) => {

  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ flex: 1 }}>

        <Topbar />

        <div style={{ padding: "20px" }}>
          {children}
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;