import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";

import { getAllRequisitions } from "../services/requisitionService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const PrincipalRequisitions = () => {
  const { user } = useAuth();

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
  =========================================
  FETCH REQUISITIONS (PRINCIPAL)
  =========================================
  */
  const fetchRequisitions = async () => {
    try {
      setLoading(true);

      const res = await getAllRequisitions();

      setRequisitions(res.data.requisitions || []);

    } catch (error) {
      console.log("Error fetching requisitions:", error);

    } finally {
      setLoading(false);
    }
  };

  /*
  =========================================
  LOAD DATA
  =========================================
  */
  useEffect(() => {
    if (user?.role === "Principal") {
      fetchRequisitions();
    }
  }, [user]);

  /*
  =========================================
  STATUS COLOR
  =========================================
  */
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "APPROVED":
        return "green";
      case "REJECTED":
        return "red";
      case "PROCESSING":
        return "blue";
      default:
        return "gray";
    }
  };

  /*
  =========================================
  UI
  =========================================
  */
  return (
    <DashboardLayout>
      <h1>Principal Requisitions Panel</h1>

      <p>
        Review and monitor all submitted requisitions
      </p>

      {loading && <p>Loading requisitions...</p>}

      {!loading && requisitions.length === 0 && (
        <p>No requisitions found.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "15px",
          marginTop: "20px"
        }}
      >
        {requisitions.map((req) => (
          <div
            key={req._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{req.requisitionId}</h3>

            <p>
              <b>Department:</b> {req.department}
            </p>

            <p>
              <b>Requested By:</b>{" "}
              {req.requestedBy?.name || "Unknown"}
            </p>

            <p>
              <b>Items:</b> {req.items?.length || 0}
            </p>

            <p>
              <b>Total:</b> {req.totalAmount}
            </p>

            <p style={{ color: getStatusColor(req.status), fontWeight: "bold" }}>
              {req.status}
            </p>

            <p style={{ fontSize: "12px", color: "#666" }}>
              Priority: {req.priority}
            </p>

            <Link
  to={`/principal/requisitions/${req._id}`}
  style={{
    display: "inline-block",
    marginTop: "10px",
    padding: "8px 12px",
    cursor: "pointer",
    background: "#222",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px"
  }}
>
  View Details
</Link>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default PrincipalRequisitions;