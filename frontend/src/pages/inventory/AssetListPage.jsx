import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import { getAllAssets } from "../../services/assetService";

const AssetListPage = () => {
  const [groupedAssets, setGroupedAssets] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /*
  ==========================================
  LOAD + GROUP ASSETS BY DEPARTMENT
  ==========================================
  */
  const loadAssets = async () => {
    try {
      setLoading(true);

      const response = await getAllAssets();

      const assets = response.assets || [];

      const grouped = assets.reduce((acc, asset) => {
        const department =
          asset.department?.name ||
          asset.department ||
          "Unknown Department";

        if (!acc[department]) {
          acc[department] = [];
        }

        acc[department].push(asset);

        return acc;
      }, {});

      setGroupedAssets(grouped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ padding: "24px" }}>
        <h2>📦 Asset Register</h2>

        <p
          style={{
            color: "#666",
            marginBottom: "20px",
          }}
        >
          View all assets grouped by department.
        </p>

        {loading ? (
          <p>Loading assets...</p>
        ) : Object.keys(groupedAssets).length === 0 ? (
          <div style={emptyCard}>
            No assets found.
          </div>
        ) : (
          Object.keys(groupedAssets).map((department) => (
            <div
              key={department}
              style={departmentCard}
            >
              <h3
                style={{
                  marginBottom: "15px",
                }}
              >
                📁 {department}
              </h3>

              <table style={table}>
                <thead>
                  <tr>
                    <th style={header}>Asset Tag</th>
                    <th style={header}>Asset Name</th>
                    <th style={header}>Category</th>
                    <th style={header}>Brand</th>
                    <th style={header}>Model</th>
                    <th style={header}>Source</th>
                    <th style={header}>Status</th>
                    <th style={header}>Price</th>
                    <th style={header}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {groupedAssets[department].map(
                    (asset) => (
                      <tr key={asset._id}>
                        <td style={cell}>
                          {asset.assetTag}
                        </td>

                        <td style={cell}>
                          {asset.assetName}
                        </td>

                        <td style={cell}>
                          {asset.category}
                        </td>

                        <td style={cell}>
                          {asset.brand || "-"}
                        </td>

                        <td style={cell}>
                          {asset.model || "-"}
                        </td>

                        <td style={cell}>
                          {asset.source}
                        </td>

                        <td style={cell}>
                          <span
                            style={statusBadge(
                              asset.status
                            )}
                          >
                            {asset.status}
                          </span>
                        </td>

                        <td style={cell}>
                          MWK{" "}
                          {Number(
                            asset.purchasePrice || 0
                          ).toLocaleString()}
                        </td>

                        <td style={cell}>
                          <button
                            onClick={() =>
                              navigate(
                                `/inventory/assets/${asset._id}`
                              )
                            }
                            style={detailsBtn}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

/*
=========================================
STYLES
=========================================
*/

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

const header = {
  border: "1px solid #ddd",
  padding: "12px",
  background: "#f5f5f5",
  textAlign: "left",
};

const cell = {
  border: "1px solid #ddd",
  padding: "10px",
};

const departmentCard = {
  marginBottom: "30px",
  padding: "20px",
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "10px",
};

const emptyCard = {
  padding: "20px",
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "10px",
};

const detailsBtn = {
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  background: "#007bff",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

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

export default AssetListPage;