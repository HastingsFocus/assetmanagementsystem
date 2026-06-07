import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { createRequisition } from "../services/requisitionService";

const Requisition = () => {
  const { user } = useAuth();

  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("LOW");

  const [items, setItems] = useState([
    {
      name: "",
      quantity: 1,
      unitPrice: 0,
      description: ""
    }
  ]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { name: "", quantity: 1, unitPrice: 0, description: "" }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedItems = items.filter(
      (item) => item.name && item.quantity && item.unitPrice
    );

    if (cleanedItems.length === 0) {
      return alert("Please add valid items");
    }

    try {
      await createRequisition({
        department,
        priority,
        items: cleanedItems
      });

      alert("Requisition submitted successfully");

      setDepartment("");
      setPriority("LOW");
      setItems([{ name: "", quantity: 1, unitPrice: 0, description: "" }]);

    } catch (error) {
      console.log(error);
    }
  };

  if (user.role !== "HOD") {
    return <DashboardLayout>Access Denied</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h1>Create Requisition</h1>

      <form onSubmit={handleSubmit}>
        <label>Department</label>
        <input
          type="text"
          placeholder="Enter department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <br /><br />

        <label>Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        <h3>Items</h3>

        {items.map((item, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <label>Item Name</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) =>
                handleItemChange(index, "name", e.target.value)
              }
            />

            <label>Quantity</label>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
            />

            <label>Unit Price</label>
            <input
              type="number"
              value={item.unitPrice}
              onChange={(e) =>
                handleItemChange(index, "unitPrice", e.target.value)
              }
            />

            <label>Description</label>
            <input
              type="text"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
            />
          </div>
        ))}

        <button type="button" onClick={addItem}>
          + Add Item
        </button>

        <br /><br />

        <button type="submit">
          Submit
        </button>
      </form>
    </DashboardLayout>
  );
};

export default Requisition;