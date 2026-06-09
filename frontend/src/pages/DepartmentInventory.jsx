import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getDepartmentInventory } from "../services/inventoryService";

const DepartmentInventory = () => {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
  ==========================================
  FETCH DEPARTMENT INVENTORY
  ==========================================
  */
  const fetchInventory = async () => {
    try {
      setLoading(true);

      if (!user?.department) return;

      const res = await getDepartmentInventory(user.department);

      setItems(res.data.items || []);
    } catch (error) {
      console.log("Inventory load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.department) {
      fetchInventory();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h1>📦 Department Inventory</h1>

        <p>
          View all assets received into your department from approved requisitions.
        </p>

        {loading ? (
          <p>Loading inventory...</p>
        ) : items.length === 0 ? (
          <p>No inventory found for this department.</p>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {items.map((item) => (
              <div
                key={item._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  background: "#fff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                }}
              >
                <h3>{item.name}</h3>

                <p>
                  <strong>Asset Tag:</strong> {item.assetTag}
                </p>

                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>

                <p>
                  <strong>Unit Price:</strong> MWK{" "}
                  {Number(item.unitPrice || 0).toLocaleString()}
                </p>

                <p>
                  <strong>Total Value:</strong> MWK{" "}
                  {Number(
                    item.quantity * item.unitPrice
                  ).toLocaleString()}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {item.status}
                  </span>
                </p>

                <p>
                  <strong>Received By:</strong>{" "}
                  {item.receivedBy?.name || "Stores"}
                </p>

                <p>
                  <strong>Source Requisition:</strong>{" "}
                  {item.sourceRequisition?.requisitionId || "N/A"}
                </p>

                <p style={{ fontSize: "12px", color: "#666" }}>
                  Added: {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DepartmentInventory;