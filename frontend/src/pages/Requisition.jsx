import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { createRequisition } from "../services/requisitionService";

const Requisition = () => {
  const { user } = useAuth();

  const [priority, setPriority] = useState("LOW");

  const [items, setItems] = useState([
    {
      name: "",
      quantity: 1,
      unitPrice: 0,
      description: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  /*
  ==========================================
  HANDLE ITEM CHANGE
  ==========================================
  */
  const handleItemChange = (
    index,
    field,
    value
  ) => {
    const updatedItems = [...items];

    updatedItems[index][field] = value;

    setItems(updatedItems);
  };

  /*
  ==========================================
  ADD ITEM
  ==========================================
  */
  const addItem = () => {
    setItems([
      ...items,
      {
        name: "",
        quantity: 1,
        unitPrice: 0,
        description: "",
      },
    ]);
  };

  /*
  ==========================================
  REMOVE ITEM
  ==========================================
  */
  const removeItem = (index) => {
    if (items.length === 1) return;

    const updatedItems = items.filter(
      (_, i) => i !== index
    );

    setItems(updatedItems);
  };

  /*
  ==========================================
  SUBMIT REQUISITION
  ==========================================
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedItems = items.filter(
      (item) =>
        item.name.trim() &&
        Number(item.quantity) > 0 &&
        Number(item.unitPrice) > 0
    );

    if (cleanedItems.length === 0) {
      return alert(
        "Please add at least one valid item."
      );
    }

    try {
      setLoading(true);

      await createRequisition({
        department: user?.department?._id,
        priority,
        items: cleanedItems,
      });

      alert(
        "Requisition submitted successfully."
      );

      setPriority("LOW");

      setItems([
        {
          name: "",
          quantity: 1,
          unitPrice: 0,
          description: "",
        },
      ]);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to submit requisition."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ==========================================
  ACCESS CONTROL
  ==========================================
  */
  if (user?.role !== "HOD") {
    return (
      <DashboardLayout>
        <h2>Access Denied</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h1>Create Requisition</h1>

        <p style={{ color: "#666" }}>
          Submit a requisition for your
          department.
        </p>

        {/* Department Information */}
        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "25px",
            border: "1px solid #ddd",
          }}
        >
          <strong>Department:</strong>{" "}
          {user?.department?.name || "N/A"}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Priority */}
          <div style={formGroup}>
            <label>Priority</label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
              style={inputStyle}
            >
              <option value="LOW">
                LOW
              </option>

              <option value="MEDIUM">
                MEDIUM
              </option>

              <option value="HIGH">
                HIGH
              </option>

              <option value="CRITICAL">
                CRITICAL
              </option>
            </select>
          </div>

          {/* Items */}
          <h3 style={{ marginTop: "30px" }}>
            Requisition Items
          </h3>

          {items.map((item, index) => (
            <div
              key={index}
              style={{
                border:
                  "1px solid #e0e0e0",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
                background: "#fff",
              }}
            >
              <h4>
                Item {index + 1}
              </h4>

              <div style={formGroup}>
                <label>
                  Item Name
                </label>

                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />
              </div>

              <div style={formGroup}>
                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />
              </div>

              <div style={formGroup}>
                <label>
                  Unit Price (MWK)
                </label>

                <input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "unitPrice",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />
              </div>

              <div style={formGroup}>
                <label>
                  Description
                </label>

                <textarea
                  value={
                    item.description
                  }
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  rows="3"
                  style={{
                    ...inputStyle,
                    resize:
                      "vertical",
                  }}
                />
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeItem(index)
                  }
                  style={
                    removeButton
                  }
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={addItem}
              style={addButton}
            >
              + Add Item
            </button>

            <button
              type="submit"
              disabled={loading}
              style={submitButton}
            >
              {loading
                ? "Submitting..."
                : "Submit Requisition"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

/*
==========================================
STYLES
==========================================
*/

const formGroup = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "15px",
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  marginTop: "5px",
};

const addButton = {
  background: "#007bff",
  color: "#fff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const submitButton = {
  background: "#28a745",
  color: "#fff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const removeButton = {
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default Requisition;