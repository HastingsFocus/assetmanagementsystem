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
  ========================================
  FETCH REQUISITIONS
  ========================================
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
  ========================================
  LOAD DATA
  ========================================
  */
  useEffect(() => {
    if (user?.role === "Principal") {
      fetchRequisitions();
    }
  }, [user]);

  /*
  ========================================
  STATUS COLORS
  ========================================
  */
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "APPROVED":
        return "green";
      case "REJECTED":
        return "red";
      case "UNDER_REVIEW":
        return "#ff9800";
      case "PROCESSING":
        return "blue";
      default:
        return "gray";
    }
  };

  /*
  ========================================
  UI
  ========================================
  */
  return (
    <DashboardLayout>
      <h1>Principal Requisitions Panel</h1>

      <p>Review and monitor all submitted requisitions</p>

      {loading && <p>Loading requisitions...</p>}

      {!loading && requisitions.length === 0 && (
        <p>No requisitions found.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {requisitions.map((req) => {
          const approvedAmount = req.items.reduce(
            (total, item) => {
              if (item.status === "APPROVED") {
                return (
                  total +
                  ((item.approvedQuantity || 0) *
                    (item.unitPrice || 0))
                );
              }

              return total;
            },
            0
          );

          

          return (
            <div
              key={req._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "18px",
                background: "#fff",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  color: "#222"
                }}
              >
                {req.requisitionId}
              </h3>

              <p>
                <strong>Department:</strong>{" "}
                {req.department}
              </p>

              <p>
                <strong>Requested By:</strong>{" "}
                {req.requestedBy?.name || "Unknown"}
              </p>

              <p>
                <strong>Items:</strong>{" "}
                {req.items?.length || 0}
              </p>

              <div
                style={{
                  marginTop: "15px",
                  marginBottom: "15px",
                  padding: "12px",
                  background: "#f8f9fa",
                  borderRadius: "8px"
                }}
              >
                <p>
                  <strong>Requested Amount:</strong>
                  <br />
                  MWK{" "}
                  {Number(
                    req.totalAmount || 0
                  ).toLocaleString()}
                </p>

                <p>
                  <strong>Approved Amount:</strong>
                  <br />
                  MWK{" "}
                  {approvedAmount.toLocaleString()}
                </p>

                
              </div>

              <p
                style={{
                  color: getStatusColor(req.status),
                  fontWeight: "bold",
                  fontSize: "15px"
                }}
              >
                {req.status}
              </p>

              <p
                style={{
                  fontSize: "13px",
                  color: "#666"
                }}
              >
                Priority: {req.priority}
              </p>

              <Link
                to={`/principal/requisitions/${req._id}`}
                style={{
                  display: "inline-block",
                  marginTop: "12px",
                  padding: "10px 15px",
                  background: "#222",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: "500"
                }}
              >
                View Details
              </Link>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default PrincipalRequisitions;