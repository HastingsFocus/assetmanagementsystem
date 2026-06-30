import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import {
  getAssetById,
  requestConditionChange,
} from "../services/assetService";
import {
  PageHeader,
  Card,
  Field,
  Select,
  Textarea,
  Button,
  StatusBadge,
  Alert,
  Loader,
} from "../components/ui";
import { FiArrowLeft, FiRepeat } from "react-icons/fi";

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-ink-400">{label}</p>
    <p className="font-medium text-ink-800">{value || "—"}</p>
  </div>
);

const HODAssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestedCondition, setRequestedCondition] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState(null);

  const loadAsset = async () => {
    try {
      const response = await getAssetById(id);
      setAsset(response.asset);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAsset();
  }, [id]);

  const handleRequest = async () => {
    setFeedback(null);
    if (!requestedCondition || !reason) {
      setFeedback({
        variant: "error",
        text: "Please select a condition and provide a reason.",
      });
      return;
    }
    try {
      await requestConditionChange(id, { requestedCondition, reason });
      setFeedback({
        variant: "success",
        text: "Condition change request submitted successfully.",
      });
      setRequestedCondition("");
      setReason("");
    } catch (error) {
      console.error("FULL ERROR:", error);
      setFeedback({
        variant: "error",
        text: error.response?.data?.message || "Failed to submit request.",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader label="Loading asset…" />
      </DashboardLayout>
    );
  }

  if (!asset) {
    return (
      <DashboardLayout>
        <PageHeader title="Asset not found" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={asset.assetName}
        subtitle={asset.assetTag}
        actions={
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <FiArrowLeft className="size-4" />
            Back
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2>Asset details</h2>
            <StatusBadge status={asset.status} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Detail label="Asset Tag" value={asset.assetTag} />
            <Detail label="Asset Name" value={asset.assetName} />
            <Detail label="Category" value={asset.category} />
            <Detail label="Brand" value={asset.brand} />
            <Detail label="Model" value={asset.model} />
            <Detail label="Serial Number" value={asset.serialNumber} />
            <Detail
              label="Department"
              value={asset.department?.name || asset.department}
            />
            <Detail label="Source" value={asset.source} />
            <Detail label="Condition" value={asset.condition} />
            <Detail
              label="Purchase Price"
              value={`MWK ${Number(
                asset.purchasePrice || 0
              ).toLocaleString()}`}
            />
          </div>
        </Card>

        <Card>
          <h3 className="flex items-center gap-2">
            <FiRepeat className="size-4 text-brand-600" />
            Request condition change
          </h3>
          <p className="mt-1 text-sm text-ink-500">
            Current: <strong>{asset.condition || "Not specified"}</strong>
          </p>

          {feedback ? (
            <Alert variant={feedback.variant} className="mt-4">
              {feedback.text}
            </Alert>
          ) : null}

          <div className="mt-4 space-y-4">
            <Field label="Requested condition">
              <Select
                value={requestedCondition}
                onChange={(e) => setRequestedCondition(e.target.value)}
              >
                <option value="">Select condition</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="unserviceable">
                  Unserviceable (move to archive)
                </option>
              </Select>
            </Field>

            <Field label="Reason">
              <Textarea
                rows="5"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why the condition should be changed…"
              />
            </Field>

            <Button onClick={handleRequest} className="w-full">
              Submit request
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HODAssetDetailsPage;
