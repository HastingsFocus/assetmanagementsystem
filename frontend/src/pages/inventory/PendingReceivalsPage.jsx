import { useEffect, useState } from "react";
import API from "../../services/api";
import { receiveRequisitionAssets } from "../../services/assetService";
import DashboardLayout from "../../layout/DashboardLayout";

const PendingReceivalsPage = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  ==========================================
  LOAD FUNDED REQUISITIONS
  ==========================================
  */
  const fetchPendingReceivals = async () => {
    try {
      setLoading(true);

      const res = await API.get("/requisitions");

      const pending = (res.data.requisitions || []).filter(
        (req) =>
          req.status === "FUNDS_RELEASED" &&
          !req.inventoryAdded
      );

      setRequisitions(pending);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReceivals();
  }, []);

  /*
  ==========================================
  CALCULATE APPROVED TOTAL
  ==========================================
  */
  const getApprovedTotal = (items) => {
    return items.reduce((sum, item) => {
      if (
        item.status === "APPROVED" &&
        item.approvedQuantity > 0
      ) {
        return (
          sum +
          item.approvedQuantity * item.unitPrice
        );
      }

      return sum;
    }, 0);
  };

  /*
  ==========================================
  RECEIVE REQUISITION ASSETS
  ==========================================
  */
  const handleReceiveAssets = async (
    requisitionId
  ) => {
    try {
      const response =
        await receiveRequisitionAssets(
          requisitionId
        );

      alert(
        response.message ||
          "Assets created successfully"
      );

      fetchPendingReceivals();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to receive assets"
      );
    }
  };

  return (
    <DashboardLayout>
      <div
        style={{
          padding: "24px",
        }}
      >
        <h2>📦 Pending Asset Receivals</h2>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Funded requisitions waiting to be
          converted into individual assets.
        </p>

        {loading ? (
          <p>Loading requisitions...</p>
        ) : requisitions.length === 0 ? (
          <div
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          >
            <p
              style={{
                color: "#666",
                margin: 0,
              }}
            >
              No funded requisitions awaiting
              receival 📭
            </p>
          </div>
        ) : (
          requisitions.map((req) => (
            <div
              key={req._id}
              style={{
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h3>{req.requisitionId}</h3>

              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <p>
  <strong>Department:</strong>{" "}
  {req.department?.name || "Unknown"}
</p>

                <p>
                  <strong>Priority:</strong>{" "}
                  {req.priority}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: "#28a745",
                      fontWeight: "bold",
                    }}
                  >
                    {req.status}
                  </span>
                </p>

                <p>
                  <strong>
                    Approved Total:
                  </strong>{" "}
                  MWK{" "}
                  {getApprovedTotal(
                    req.items
                  ).toLocaleString()}
                </p>
              </div>

              <h4
                style={{
                  marginTop: "20px",
                }}
              >
                Approved Items
              </h4>

              <div
                style={{
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                    marginTop: "10px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background:
                          "#f5f5f5",
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
                      ?.filter(
                        (item) =>
                          item.status ===
                            "APPROVED" &&
                          item.approvedQuantity >
                            0
                      )
                      .map((item) => (
                        <tr
                          key={item._id}
                        >
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
                              item.unitPrice
                            ).toLocaleString()}
                          </td>

                          <td
                            style={
                              tableCell
                            }
                          >
                            MWK{" "}
                            {(
                              item.approvedQuantity *
                              item.unitPrice
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <h4
                style={{
                  marginTop: "20px",
                }}
              >
                Assets To Be Created
              </h4>

              <ul>
                {req.items
                  ?.filter(
                    (item) =>
                      item.status ===
                        "APPROVED" &&
                      item.approvedQuantity >
                        0
                  )
                  .map((item) => (
                    <li key={item._id}>
                      {
                        item.approvedQuantity
                      }{" "}
                      × {item.name}
                    </li>
                  ))}
              </ul>

              <button
                onClick={() =>
                  handleReceiveAssets(
                    req._id
                  )
                }
                style={{
                  marginTop: "20px",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Receive Assets
              </button>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

const tableHeader = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const tableCell = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default PendingReceivalsPage;