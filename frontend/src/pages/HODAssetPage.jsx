import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { getAllAssets } from "../services/assetService";
import { useAuth } from "../context/AuthContext";

const HODAssetPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  const loadAssets = async () => {
    try {
      setLoading(true);

      const response = await getAllAssets();
      const allAssets = response.assets || [];

      // 🔥 FILTER ONLY HOD DEPARTMENT
      const filtered = allAssets.filter((asset) => {
        const assetDept =
          asset.department?._id ||
          asset.department;

        const userDept =
          user.department?._id ||
          user.department;

        return assetDept === userDept;
      });

      setAssets(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadAssets();
  }, [user]);

  return (
    <DashboardLayout>
      <div style={{ padding: "24px" }}>
        <h2>📁 My Department Assets</h2>

        <p style={{ color: "#666", marginBottom: "20px" }}>
          Assets allocated to your department only.
        </p>

        {loading ? (
          <p>Loading assets...</p>
        ) : assets.length === 0 ? (
          <div style={emptyCard}>
            No assets found for your department.
          </div>
        ) : (
          <div style={departmentCard}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={header}>Asset Tag</th>
                  <th style={header}>Name</th>
                  <th style={header}>Category</th>
                  <th style={header}>Brand</th>
                  <th style={header}>Model</th>
                  <th style={header}>Status</th>
                  <th style={header}>Action</th>
                </tr>
              </thead>

              <tbody>
                {assets.map((asset) => (
                  <tr key={asset._id}>
                    <td style={cell}>{asset.assetTag}</td>
                    <td style={cell}>{asset.assetName}</td>
                    <td style={cell}>{asset.category}</td>
                    <td style={cell}>{asset.brand || "-"}</td>
                    <td style={cell}>{asset.model || "-"}</td>
                    <td style={cell}>
                      <span style={statusBadge(asset.status)}>
                        {asset.status}
                      </span>
                    </td>
                    <td style={cell}>
  <button
    onClick={() =>
      navigate(`/hod/assets/${asset._id}`)
    }
    style={detailsBtn}
  >
    View
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/* reuse your styles */
const table = { width: "100%", borderCollapse: "collapse", background: "#fff" };
const header = { border: "1px solid #ddd", padding: "12px", background: "#f5f5f5", textAlign: "left" };
const cell = { border: "1px solid #ddd", padding: "10px" };
const departmentCard = { padding: "20px", background: "#fff", border: "1px solid #ddd", borderRadius: "10px" };
const emptyCard = { padding: "20px", background: "#fff", border: "1px solid #ddd", borderRadius: "10px" };
const detailsBtn = { padding: "8px 14px", border: "none", borderRadius: "6px", background: "#007bff", color: "#fff", cursor: "pointer" };

const statusBadge = (status) => ({
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  background:
    status === "in_store"
      ? "#d4edda"
      : status === "assigned"
      ? "#cce5ff"
      : status === "maintenance"
      ? "#fff3cd"
      : "#f8d7da",
});

export default HODAssetPage;