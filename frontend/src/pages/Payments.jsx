import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";

import { getApprovedRequisitions } from "../services/requisitionService";
import { releaseFunds } from "../services/accountsService";

const Payments = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  ========================================
  LOAD REQUISITIONS
  ========================================
  */
  const loadRequisitions = async () => {
    try {
      const data = await getApprovedRequisitions();

      const filtered =
        data.requisitions?.filter(
          (req) =>
            req.status === "APPROVED" ||
            req.status === "FUNDED"
        ) || [];

      setRequisitions(filtered);
    } catch (error) {
      console.error(
        "Error loading requisitions:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequisitions();
  }, []);

  /*
  ========================================
  RELEASE FUNDS
  ========================================
  */
  const handleReleaseFunds = async (id) => {
    try {
      await releaseFunds(id);

      alert(
        "Funds released successfully. Stores has been notified."
      );

      loadRequisitions();
    } catch (error) {
      console.error(error);

      alert("Failed to release funds.");
    }
  };

  return (
    <DashboardLayout>
      <h1>Payments Management</h1>

      <p>
        Manage approved requisitions and fund
        release.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : requisitions.length === 0 ? (
        <p>No requisitions available.</p>
      ) : (
        requisitions.map((req) => {
          const approvedTotal = req.items.reduce(
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
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
                background:
                  req.status === "FUNDED"
                    ? "#e6fff2"
                    : "#fff7e6",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,0.08)"
              }}
            >
              <h3>
                Requisition: {req.requisitionId}
              </h3>

             <p>
  <strong>Department:</strong>{" "}
  {req.department?.name || "Unknown"}
</p>

              <p>
                <strong>Requested Amount:</strong>{" "}
                MWK{" "}
                {Number(
                  req.totalAmount || 0
                ).toLocaleString()}
              </p>

              <p>
                <strong>Approved Amount:</strong>{" "}
                MWK{" "}
                {approvedTotal.toLocaleString()}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      req.status === "FUNDED"
                        ? "green"
                        : "orange"
                  }}
                >
                  {req.status}
                </span>
              </p>

              {/* APPROVED ITEMS */}
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "20px"
                }}
              >
                <h4>Approved Items</h4>

                <div
                  style={{
                    overflowX: "auto"
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse:
                        "collapse"
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background:
                            "#f5f5f5"
                        }}
                      >
                        <th style={tableHeader}>
                          Item
                        </th>

                        <th style={tableHeader}>
                          Approved Qty
                        </th>

                        <th style={tableHeader}>
                          Unit Price
                        </th>

                        <th style={tableHeader}>
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {req.items
                        .filter(
                          (item) =>
                            item.status ===
                            "APPROVED"
                        )
                        .map((item) => (
                          <tr key={item._id}>
                            <td
                              style={
                                tableCell
                              }
                            >
                              {item.name}
                            </td>

                            <td
                              style={
                                tableCell
                              }
                            >
                              {
                                item.approvedQuantity
                              }
                            </td>

                            <td
                              style={
                                tableCell
                              }
                            >
                              MWK{" "}
                              {Number(
                                item.unitPrice ||
                                  0
                              ).toLocaleString()}
                            </td>

                            <td
                              style={
                                tableCell
                              }
                            >
                              MWK{" "}
                              {(
                                (item.approvedQuantity ||
                                  0) *
                                (item.unitPrice ||
                                  0)
                              ).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>

                    <tfoot>
                      <tr
                        style={{
                          background:
                            "#f8f9fa",
                          fontWeight:
                            "bold"
                        }}
                      >
                        <td
                          colSpan="3"
                          style={
                            tableCell
                          }
                        >
                          Approved Total
                        </td>

                        <td
                          style={
                            tableCell
                          }
                        >
                          MWK{" "}
                          {approvedTotal.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ACTION BUTTON */}
              {req.status ===
                "APPROVED" && (
                <button
                  onClick={() =>
                    handleReleaseFunds(
                      req._id
                    )
                  }
                  style={{
                    padding:
                      "10px 15px",
                    background:
                      "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius:
                      "6px",
                    cursor: "pointer",
                    fontWeight:
                      "bold"
                  }}
                >
                  Release Funds
                </button>
              )}

              {/* FUNDED MESSAGE */}
              {req.status ===
                "FUNDED" && (
                <p
                  style={{
                    color: "green",
                    fontWeight:
                      "bold",
                    marginTop: "15px"
                  }}
                >
                  ✔ Funds already
                  released
                </p>
              )}
            </div>
          );
        })
      )}
    </DashboardLayout>
  );
};

const tableHeader = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
  background: "#f8f9fa"
};

const tableCell = {
  border: "1px solid #ddd",
  padding: "10px"
};

export default Payments;