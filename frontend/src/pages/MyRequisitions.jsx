import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getMyRequisitions } from "../services/requisitionService";

const MyRequisitions = () => {
  const { user } = useAuth();

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyRequisitions = async () => {
    try {
      setLoading(true);

      const res = await getMyRequisitions();

      setRequisitions(res.data.requisitions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "HOD") {
      fetchMyRequisitions();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>My Requisitions</h1>

        {loading && <p>Loading requisitions...</p>}

        {!loading && requisitions.length === 0 && (
          <p>No requisitions found.</p>
        )}

        {requisitions.map((req) => {
          const approvedTotal = req.items.reduce((sum, item) => {
            if (item.status === "APPROVED") {
              return (
                sum +
                ((item.approvedQuantity || 0) *
                  (item.unitPrice || 0))
              );
            }
            return sum;
          }, 0);

          return (
            <div
              key={req._id}
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "25px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  marginBottom: "15px"
                }}
              >
                <h3>{req.requisitionId}</h3>

                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    color: "#fff",
                    background:
                      req.status === "APPROVED"
                        ? "green"
                        : req.status === "REJECTED"
                        ? "red"
                        : req.status === "UNDER_REVIEW"
                        ? "orange"
                        : "#555"
                  }}
                >
                  {req.status}
                </span>
              </div>

              {/* Requisition Details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "10px",
                  marginBottom: "20px"
                }}
              >
                <p>
                  <strong>Priority:</strong> {req.priority}
                </p>

                <p>
                  <strong>Requested Amount:</strong> MWK{" "}
                  {Number(
                    req.totalAmount || 0
                  ).toLocaleString()}
                </p>

                <p>
                  <strong>Approved Amount:</strong> MWK{" "}
                  {approvedTotal.toLocaleString()}
                </p>

                <p>
                  <strong>Items:</strong> {req.items.length}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    req.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              {/* Items Table */}
              <h4 style={{ marginBottom: "10px" }}>
                Requested Items
              </h4>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse"
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                      <th style={tableHeader}>Item</th>
                      <th style={tableHeader}>
                        Requested Qty
                      </th>
                      <th style={tableHeader}>
                        Approved Qty
                      </th>
                      <th style={tableHeader}>
                        Unit Price
                      </th>
                      <th style={tableHeader}>
                        Approved Total
                      </th>
                      <th style={tableHeader}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {req.items.map((item) => (
                      <tr key={item._id}>
                        <td style={tableCell}>
                          {item.name}
                        </td>

                        <td style={tableCell}>
                          {item.quantity}
                        </td>

                        <td style={tableCell}>
                          {item.approvedQuantity ?? "-"}
                        </td>

                        <td style={tableCell}>
                          MWK{" "}
                          {Number(
                            item.unitPrice || 0
                          ).toLocaleString()}
                        </td>

                        <td style={tableCell}>
                          MWK{" "}
                          {(
                            (item.approvedQuantity || 0) *
                            (item.unitPrice || 0)
                          ).toLocaleString()}
                        </td>

                        <td style={tableCell}>
                          <span
                            style={{
                              color:
                                item.status === "APPROVED"
                                  ? "green"
                                  : item.status === "REJECTED"
                                  ? "red"
                                  : "orange",
                              fontWeight: "bold"
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Principal Comment */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#f9f9f9",
                  borderLeft: "4px solid #1976d2",
                  borderRadius: "5px"
                }}
              >
                <strong>Principal Comment</strong>

                <p style={{ marginTop: "8px" }}>
                  {req.principalComment
                    ? req.principalComment
                    : "No comment provided yet."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

const tableHeader = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
  fontWeight: "bold"
};

const tableCell = {
  border: "1px solid #ddd",
  padding: "10px"
};

export default MyRequisitions;