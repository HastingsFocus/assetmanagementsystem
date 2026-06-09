import { useEffect, useState } from "react";
import { getAllInventory } from "../../services/inventoryService";
import DashboardLayout from "../../layout/DashboardLayout";

const InventoryListPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await getAllInventory();
      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h2>📦 Inventory Items</h2>

        {items.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              background: "white"
            }}
          >
            <h4>{item.name}</h4>
            <p><strong>Tag:</strong> {item.assetTag}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Department:</strong> {item.department?.name}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default InventoryListPage;