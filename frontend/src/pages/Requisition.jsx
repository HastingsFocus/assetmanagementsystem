import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { createRequisition } from "../services/requisitionService";
import {
  PageHeader,
  Card,
  Field,
  Input,
  Select,
  Textarea,
  Button,
  Alert,
} from "../components/ui";
import { FiFilePlus, FiPlus, FiTrash2 } from "react-icons/fi";

const emptyItem = () => ({
  name: "",
  quantity: 1,
  unitPrice: 0,
  description: "",
});

const Requisition = () => {
  const { user } = useAuth();

  const [priority, setPriority] = useState("LOW");
  const [items, setItems] = useState([emptyItem()]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => setItems([...items, emptyItem()]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const estimatedTotal = items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const cleanedItems = items.filter(
      (item) =>
        item.name.trim() &&
        Number(item.quantity) > 0 &&
        Number(item.unitPrice) > 0
    );

    if (cleanedItems.length === 0) {
      setFeedback({
        variant: "error",
        text: "Please add at least one valid item (name, quantity and unit price).",
      });
      return;
    }

    try {
      setLoading(true);
      await createRequisition({
        department: user?.department?._id,
        priority,
        items: cleanedItems,
      });
      setFeedback({
        variant: "success",
        text: "Requisition submitted successfully.",
      });
      setPriority("LOW");
      setItems([emptyItem()]);
    } catch (error) {
      console.error(error);
      setFeedback({
        variant: "error",
        text:
          error?.response?.data?.message || "Failed to submit requisition.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "HOD") {
    return (
      <DashboardLayout>
        <PageHeader title="Access denied" subtitle="This page is for HODs." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiFilePlus />}
        title="Create Requisition"
        subtitle="Submit a requisition for your department."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        {feedback ? (
          <Alert variant={feedback.variant}>{feedback.text}</Alert>
        ) : null}

        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="label">Department</p>
              <p className="rounded-lg bg-ink-50 px-3.5 py-2.5 text-sm font-medium text-ink-800">
                {user?.department?.name || "N/A"}
              </p>
            </div>
            <Field label="Priority">
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </Select>
            </Field>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <h2>Requisition items</h2>
          <Button variant="secondary" size="sm" onClick={addItem}>
            <FiPlus className="size-4" />
            Add item
          </Button>
        </div>

        {items.map((item, index) => (
          <Card key={index}>
            <div className="mb-4 flex items-center justify-between">
              <h3>Item {index + 1}</h3>
              {items.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <FiTrash2 className="size-4" />
                  Remove
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Item name">
                <Input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  placeholder="e.g. Office chair"
                />
              </Field>
              <Field label="Quantity">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                />
              </Field>
              <Field label="Unit price (MWK)">
                <Input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleItemChange(index, "unitPrice", e.target.value)
                  }
                />
              </Field>
              <Field label="Line total">
                <Input
                  type="text"
                  readOnly
                  value={`MWK ${(
                    (Number(item.quantity) || 0) *
                    (Number(item.unitPrice) || 0)
                  ).toLocaleString()}`}
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Description">
                <Textarea
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  rows="3"
                  placeholder="Optional notes about this item"
                />
              </Field>
            </div>
          </Card>
        ))}

        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-ink-500">Estimated total</p>
              <p className="text-xl font-bold text-ink-900">
                MWK {estimatedTotal.toLocaleString()}
              </p>
            </div>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Submitting…" : "Submit requisition"}
            </Button>
          </div>
        </Card>
      </form>
    </DashboardLayout>
  );
};

export default Requisition;
