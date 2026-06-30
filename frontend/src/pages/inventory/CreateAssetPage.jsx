import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { createManualAssets } from "../../services/assetService";
import { getDepartments } from "../../services/departmentService";
import {
  PageHeader,
  Card,
  Field,
  Input,
  Select,
  Textarea,
  Button,
  Alert,
} from "../../components/ui";
import { FiPlusSquare } from "react-icons/fi";

const initialForm = {
  assetName: "",
  category: "",
  quantity: 1,
  department: "",
  source: "donation",
  purchasePrice: 0,
  brand: "",
  model: "",
  remarks: "",
};

const CreateAssetPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Failed loading departments", error);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    try {
      setLoading(true);
      const response = await createManualAssets(formData);
      setFeedback({
        variant: "success",
        text: response.message || "Assets created successfully.",
      });
      setFormData(initialForm);
    } catch (error) {
      console.error(error);
      setFeedback({
        variant: "error",
        text: error?.response?.data?.message || "Failed to create assets.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiPlusSquare />}
        title="Create Assets"
        subtitle="Add assets obtained through donations, purchases, transfers or other sources."
      />

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {feedback ? (
            <Alert variant={feedback.variant}>{feedback.text}</Alert>
          ) : null}

          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Asset name" required>
                <Input
                  type="text"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleChange}
                  required
                  placeholder="Lenovo Laptop"
                />
              </Field>
              <Field label="Category" required>
                <Input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="Computer"
                />
              </Field>
              <Field label="Quantity" required>
                <Input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field label="Department" required>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.code}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Source" required>
                <Select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                >
                  <option value="donation">Donation</option>
                  <option value="purchase">Purchase</option>
                  <option value="transfer">Transfer</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
              <Field label="Purchase price (MWK)">
                <Input
                  type="number"
                  name="purchasePrice"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Brand">
                <Input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Lenovo"
                />
              </Field>
              <Field label="Model">
                <Input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="ThinkPad T14"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Remarks">
                <Textarea
                  name="remarks"
                  rows="4"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Additional notes…"
                />
              </Field>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Creating assets…" : "Create assets"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateAssetPage;
