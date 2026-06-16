import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import { getAssetById } from "../../services/assetService";

const AssetDetailsPage = () => {
  const { id } = useParams();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAsset = async () => {
    try {
      setLoading(true);

      const res = await getAssetById(id);

      setAsset(res.asset || res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAsset();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: "24px" }}>
          <p>Loading asset...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!asset) {
    return (
      <DashboardLayout>
        <div style={{ padding: "24px" }}>
          <p>Asset not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ padding: "24px" }}>
        <h2>📦 Asset Details</h2>

        <div style={card}>
          {/* HEADER */}
          <div style={headerSection}>
            <div>
              <h2>{asset.assetName}</h2>

              <p
                style={{
                  color: "#666",
                  marginTop: "5px",
                }}
              >
                {asset.assetTag}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <span style={statusBadge(asset.status)}>
                {asset.status || "N/A"}
              </span>

              <span
                style={conditionBadge(
                  asset.condition
                )}
              >
                {asset.condition || "N/A"}
              </span>
            </div>
          </div>

          <hr />

          {/* GENERAL INFO */}
          <h3>General Information</h3>

          <div style={grid}>
            <InfoItem
              label="Asset Tag"
              value={asset.assetTag}
            />

            <InfoItem
              label="Category"
              value={asset.category}
            />

            <InfoItem
              label="Department"
              value={
                asset.department?.name ||
                asset.department
              }
            />

            <InfoItem
              label="Source"
              value={asset.source}
            />

            <InfoItem
              label="Purchase Price"
              value={`MWK ${Number(
                asset.purchasePrice || 0
              ).toLocaleString()}`}
            />
          </div>

          <hr />

          {/* ASSET INFO */}
          <h3>Asset Information</h3>

          <div style={grid}>
            <InfoItem
              label="Brand"
              value={asset.brand || "-"}
            />

            <InfoItem
              label="Model"
              value={asset.model || "-"}
            />

            <InfoItem
              label="Serial Number"
              value={
                asset.serialNumber || "-"
              }
            />

            <InfoItem
              label="Quantity"
              value={asset.quantity}
            />
          </div>

          <hr />

          {/* ASSIGNMENT */}
          <h3>Assignment Information</h3>

          <div style={grid}>
            <InfoItem
              label="Status"
              value={asset.status}
            />

            <InfoItem
              label="Condition"
              value={asset.condition}
            />

            <InfoItem
              label="Assigned Date"
              value={
                asset.assignedDate
                  ? new Date(
                      asset.assignedDate
                    ).toLocaleString()
                  : "-"
              }
            />

            <InfoItem
              label="Archived Date"
              value={
                asset.archivedDate
                  ? new Date(
                      asset.archivedDate
                    ).toLocaleString()
                  : "-"
              }
            />
          </div>

          <hr />

          {/* AUDIT */}
          <h3>Audit Information</h3>

          <div style={grid}>
            <InfoItem
              label="Created At"
              value={new Date(
                asset.createdAt
              ).toLocaleString()}
            />

            <InfoItem
              label="Last Updated"
              value={new Date(
                asset.updatedAt
              ).toLocaleString()}
            />

            <InfoItem
              label="Remarks"
              value={asset.remarks || "-"}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const InfoItem = ({ label, value }) => (
  <div style={infoCard}>
    <strong>{label}</strong>
    <p>{value}</p>
  </div>
);

/*
=========================================
STYLES
=========================================
*/

const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)",
};

const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(250px,1fr))",
  gap: "15px",
  marginBottom: "20px",
};

const infoCard = {
  background: "#f8f9fa",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #e5e5e5",
};

const statusBadge = (status) => {
  const colors = {
    assigned: "#cce5ff",
    archived: "#f8d7da",
    maintenance: "#fff3cd",
    disposed: "#f8d7da",
    lost: "#f8d7da",
    in_store: "#d4edda",
  };

  return {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
    background:
      colors[status] || "#e2e3e5",
  };
};

const conditionBadge = (condition) => {
  const colors = {
    excellent: "#d4edda",
    good: "#cce5ff",
    fair: "#fff3cd",
    poor: "#f8d7da",
    obsolete: "#f5c6cb",
  };

  return {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
    background:
      colors[condition] || "#e2e3e5",
  };
};

export default AssetDetailsPage;