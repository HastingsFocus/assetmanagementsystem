import { useEffect, useState } from "react";
import API from "../../services/api";
import { receiveGoods } from "../../services/inventoryService";
import DashboardLayout from "../../layout/DashboardLayout";

const ReceiveGoodsPage = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  ==========================================
  LOAD REQUISITIONS READY FOR RECEIVING
  ==========================================
  */
  const fetchApprovedRequisitions = async () => {
    try {
      setLoading(true);

      const res = await API.get("/requisitions");

      const ready = (
        res.data.requisitions || []
      ).filter(
        (r) => r.status === "FUNDS_RELEASED"
      );

      setRequisitions(ready);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedRequisitions();
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
          item.approvedQuantity *
            item.unitPrice
        );
      }

      return sum;
    }, 0);
  };

  /*
  ==========================================
  RECEIVE GOODS
  ==========================================
  */
  const handleReceive = async (id) => {
    try {
      await receiveGoods(id);

      alert(
        "Goods successfully added to inventory ✅"
      );

      fetchApprovedRequisitions();
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to receive goods"
      );
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h2>
          📦 Receive Goods (Stores Department)
        </h2>

        <p>
          Receive approved and funded
          requisitions into inventory.
        </p>

        {loading ? (
          <p>Loading requisitions...</p>
        ) : requisitions.length === 0 ? (
          <p
            style={{
              marginTop: "20px",
              color: "#666"
            }}
          >
            No funded requisitions ready for
            receiving 📭
          </p>
        ) : (
          requisitions.map((req) => (
            <div
              key={req._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginTop: "20px",
                background: "#fff",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,0.08)"
              }}
            >
              <h3>{req.requisitionId}</h3>

              <p>
                <strong>Department:</strong>{" "}
                {req.department}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: "green",
                    fontWeight: "bold"
                  }}
                >
                  {req.status}
                </span>
              </p>

              <p>
                <strong>Priority:</strong>{" "}
                {req.priority}
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

              <h4
                style={{
                  marginTop: "20px"
                }}
              >
                Approved Items
              </h4>

              <div
                style={{
                  overflowX: "auto"
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                    marginTop: "10px"
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
                              item.approvedQuantity *
                              item.unitPrice
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() =>
                  handleReceive(req._id)
                }
                style={{
                  marginTop: "20px",
                  padding:
                    "10px 18px",
                  background:
                    "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Receive Goods
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
  textAlign: "left"
};

const tableCell = {
  border: "1px solid #ddd",
  padding: "10px"
};

export default ReceiveGoodsPage;