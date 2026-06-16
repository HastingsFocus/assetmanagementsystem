import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import {
  getAssetById,
  requestConditionChange,
} from "../services/assetService";

const HODAssetDetailsPage = () => {
  const { id } = useParams();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  const [requestedCondition, setRequestedCondition] =
    useState("");

  const [reason, setReason] = useState("");

  const loadAsset = async () => {
    try {
      const response = await getAssetById(id);

      setAsset(response.asset);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAsset();
  }, [id]);

  const handleRequest = async () => {
    try {
      if (!requestedCondition || !reason) {
        return alert(
          "Please select condition and provide reason"
        );
      }

      await requestConditionChange(id, {
        requestedCondition,
        reason,
      });

      alert(
        "Condition change request submitted successfully"
      );

      setRequestedCondition("");
      setReason("");
    } catch (error) {
  console.error("FULL ERROR:", error);

  console.log(
    "BACKEND RESPONSE:",
    error.response?.data
  );

  alert(
    error.response?.data?.message ||
    "Failed to submit request"
  );
}
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading asset...</p>
      </DashboardLayout>
    );
  }

  if (!asset) {
    return (
      <DashboardLayout>
        <p>Asset not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={container}>
        <h2>📦 Asset Details</h2>

        <div style={card}>
          <Detail
            label="Asset Tag"
            value={asset.assetTag}
          />

          <Detail
            label="Asset Name"
            value={asset.assetName}
          />

          <Detail
            label="Category"
            value={asset.category}
          />

          <Detail
            label="Brand"
            value={asset.brand}
          />

          <Detail
            label="Model"
            value={asset.model}
          />

          <Detail
            label="Serial Number"
            value={asset.serialNumber}
          />

          <Detail
            label="Department"
            value={
              asset.department?.name ||
              asset.department
            }
          />

          <Detail
            label="Source"
            value={asset.source}
          />

          <Detail
            label="Status"
            value={asset.status}
          />

          <Detail
  label="Condition"
  value={asset.condition}
/>

          <Detail
            label="Purchase Price"
            value={`MWK ${Number(
              asset.purchasePrice || 0
            ).toLocaleString()}`}
          />
        </div>

        {/* CONDITION REQUEST SECTION */}

<div style={requestCard}>
  <h3>🔄 Request Condition Change</h3>

  <p>
    Current Condition:{" "}
    <strong>
      {asset.condition || "Not Specified"}
    </strong>
  </p>

  <label>Requested Condition</label>

  <select
    value={requestedCondition}
    onChange={(e) =>
      setRequestedCondition(e.target.value)
    }
    style={input}
  >
    <option value="">
      Select Condition
    </option>

    <option value="excellent">
      Excellent
    </option>

    <option value="good">
      Good
    </option>

    <option value="fair">
      Fair
    </option>

    <option value="poor">
      Poor
    </option>

    <option value="unserviceable">
      Unserviceable (move to archive)
    </option>
  </select>

  <label>Reason</label>

  <textarea
    rows="5"
    style={input}
    value={reason}
    onChange={(e) =>
      setReason(e.target.value)
    }
    placeholder="Explain why the condition should be changed..."
  />

  <button
    onClick={handleRequest}
    style={submitBtn}
  >
    Submit Request
  </button>
</div>
      </div>
    </DashboardLayout>
  );
};

const Detail = ({ label, value }) => (
  <div style={{ marginBottom: "10px" }}>
    <strong>{label}:</strong> {value || "-"}
  </div>
);

const container = {
  padding: "24px",
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  marginBottom: "30px",
};

const requestCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  marginBottom: "15px",
};

const submitBtn = {
  background: "#007bff",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default HODAssetDetailsPage;