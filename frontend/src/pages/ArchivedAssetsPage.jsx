import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { getArchivedAssets } from "../services/assetService";

const ArchivedAssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAssets = async () => {
    try {
      const response = await getArchivedAssets();

      setAssets(response.assets || []);
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
      <div style={container}>
        <h2>🗄️ Archived Assets</h2>

        {loading ? (
          <p>Loading archived assets...</p>
        ) : assets.length === 0 ? (
          <div style={card}>
            No archived assets found.
          </div>
        ) : (
          <div style={card}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={header}>Asset Tag</th>
                  <th style={header}>Asset Name</th>
                  <th style={header}>Category</th>
                  <th style={header}>Department</th>
                  <th style={header}>Condition</th>
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

                    <td style={cell}>
                      {asset.department}
                    </td>

                    <td style={cell}>
                      {asset.condition}
                    </td>

                    <td style={cell}>
                      <span style={statusBadge}>
                        {asset.status}
                      </span>
                    </td>

                    <td style={cell}>
                      <Link
                        to={`/inventory/assets/${asset._id}`}
                        style={viewBtn}
                      >
                        View
                      </Link>
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

const container = {
  padding: "24px",
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const header = {
  padding: "12px",
  border: "1px solid #ddd",
  background: "#f5f5f5",
  textAlign: "left",
};

const cell = {
  padding: "10px",
  border: "1px solid #ddd",
};

const statusBadge = {
  background: "#dc3545",
  color: "#fff",
  padding: "5px 10px",
  borderRadius: "5px",
  fontSize: "12px",
};

const viewBtn = {
  background: "#007bff",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "5px",
  textDecoration: "none",
};

export default ArchivedAssetsPage;