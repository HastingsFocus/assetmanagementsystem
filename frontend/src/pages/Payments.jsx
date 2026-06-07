import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";

import { getApprovedRequisitions } from "../services/requisitionService";
import { releaseFunds } from "../services/accountsService";

const Payments = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  ========================================
  LOAD REQUISITIONS (APPROVED + FUNDED)
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
        Manage approved requisitions and fund release.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : requisitions.length === 0 ? (
        <p>No requisitions available.</p>
      ) : (
        requisitions.map((req) => (
          <div
            key={req._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
              background:
                req.status === "FUNDED"
                  ? "#e6fff2"
                  : "#fff7e6",
            }}
          >
            <h3>
              Requisition: {req.requisitionId}
            </h3>

            <p>
              <strong>Department:</strong>{" "}
              {req.department}
            </p>

            <p>
              <strong>Total Amount:</strong>{" "}
              MWK {req.totalAmount}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color:
                    req.status === "FUNDED"
                      ? "green"
                      : "orange",
                }}
              >
                {req.status}
              </span>
            </p>

            {/* ONLY APPROVED CAN BE FUNDED */}
            {req.status === "APPROVED" && (
              <button
                onClick={() =>
                  handleReleaseFunds(req._id)
                }
                style={{
                  padding: "8px 12px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Release Funds
              </button>
            )}

            {/* FUNDED INFO */}
            {req.status === "FUNDED" && (
              <p style={{ color: "green" }}>
                ✔ Funds already released
              </p>
            )}
          </div>
        ))
      )}
    </DashboardLayout>
  );
};

export default Payments;