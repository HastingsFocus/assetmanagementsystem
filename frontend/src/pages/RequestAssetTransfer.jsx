import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getDepartmentAssets,
  createTransferRequest,
} from "../services/assetService";
import { getDepartments } from "../services/departmentService";
import {
  PageHeader,
  Card,
  Field,
  Select,
  Textarea,
  Button,
  Alert,
} from "../components/ui";
import { FiRepeat } from "react-icons/fi";

const RequestAssetTransfer = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [toDepartment, setToDepartment] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadAssets = async () => {
    try {
      const response = await getDepartmentAssets(user.department._id);
      setAssets(response);
    } catch (error) {
      console.log("Failed loading assets", error);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.departments || []);
    } catch (error) {
      console.log("Failed loading departments", error);
    }
  };

  useEffect(() => {
    if (user?.department) {
      loadAssets();
      loadDepartments();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedAsset || !toDepartment || !reason) {
      setFeedback({ variant: "error", text: "Please fill in all fields." });
      return;
    }

    try {
      setLoading(true);
      await createTransferRequest({
        assetId: selectedAsset,
        toDepartment,
        reason,
      });
      setFeedback({
        variant: "success",
        text: "Transfer request submitted successfully.",
      });
      setSelectedAsset("");
      setToDepartment("");
      setReason("");
    } catch (error) {
      console.log(error);
      setFeedback({
        variant: "error",
        text: error?.response?.data?.message || "Failed submitting request.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiRepeat />}
        title="Request Asset Transfer"
        subtitle="Move an asset from your department to another department."
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {feedback ? (
            <Alert variant={feedback.variant}>{feedback.text}</Alert>
          ) : null}

          <Card>
            <p className="label">Your department</p>
            <p className="rounded-lg bg-ink-50 px-3.5 py-2.5 text-sm font-medium text-ink-800">
              {user?.department?.name || "N/A"}
            </p>

            <div className="mt-5 space-y-5">
              <Field label="Select asset" required>
                <Select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  required
                >
                  <option value="">Select asset</option>
                  {assets.map((asset) => (
                    <option key={asset._id} value={asset._id}>
                      {asset.assetName} — {asset.assetTag}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Transfer to" required>
                <Select
                  value={toDepartment}
                  onChange={(e) => setToDepartment(e.target.value)}
                  required
                >
                  <option value="">Select department</option>
                  {departments
                    .filter((dept) => dept._id !== user.department._id)
                    .map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                </Select>
              </Field>

              <Field label="Reason" required>
                <Textarea
                  rows="4"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why should this asset be transferred?"
                  required
                />
              </Field>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting…" : "Request transfer"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RequestAssetTransfer;
