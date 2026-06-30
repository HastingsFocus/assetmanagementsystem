import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../services/api";
import {
  PageHeader,
  Card,
  Field,
  Input,
  Select,
  Textarea,
  Button,
  StatusBadge,
  Alert,
  Loader,
} from "../components/ui";
import { FiArrowLeft } from "react-icons/fi";

const PrincipalRequisitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchRequisition = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/requisitions/${id}`);
      setRequisition(res.data.requisition);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisition();
  }, [id]);

  const handleItemChange = (index, field, value) => {
    const updated = { ...requisition };
    updated.items[index][field] = value;
    setRequisition(updated);
  };

  const handleSubmit = async () => {
    setFeedback(null);
    try {
      setSubmitting(true);
      await API.put(`/requisitions/${id}/review`, {
        items: requisition.items,
        principalComment: requisition.principalComment || "",
      });
      navigate("/principal/requisitions");
    } catch (error) {
      console.log(error);
      setFeedback({ variant: "error", text: "Failed to submit review." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !requisition) {
    return (
      <DashboardLayout>
        <Loader label="Loading requisition…" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={`Requisition ${requisition.requisitionId}`}
        subtitle="Review each item and submit your decision."
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate("/principal/requisitions")}
          >
            <FiArrowLeft className="size-4" />
            Back
          </Button>
        }
      />

      {feedback ? (
        <Alert variant={feedback.variant} className="mb-5">
          {feedback.text}
        </Alert>
      ) : null}

      <Card className="mb-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400">
              Department
            </p>
            <p className="font-medium text-ink-800">
              {requisition.department?.name || requisition.department || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400">
              Status
            </p>
            <StatusBadge status={requisition.status} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-400">
              Total
            </p>
            <p className="font-medium text-ink-800">
              MWK {Number(requisition.totalAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <h2 className="mb-3">Items review</h2>
      <div className="space-y-4">
        {requisition.items.map((item, index) => (
          <Card key={item._id}>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-400">
                  Item
                </p>
                <p className="font-medium text-ink-900">{item.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-400">
                  Requested Qty
                </p>
                <p className="font-medium text-ink-800">{item.quantity}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-400">
                  Unit Price
                </p>
                <p className="font-medium text-ink-800">
                  MWK {Number(item.unitPrice || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Approved quantity">
                <Input
                  type="number"
                  min="0"
                  value={item.approvedQuantity || 0}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "approvedQuantity",
                      Number(e.target.value)
                    )
                  }
                />
              </Field>
              <Field label="Decision">
                <Select
                  value={item.status || "PENDING"}
                  onChange={(e) =>
                    handleItemChange(index, "status", e.target.value)
                  }
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </Select>
              </Field>
              <Field label="Comment">
                <Input
                  type="text"
                  value={item.adminComment || ""}
                  onChange={(e) =>
                    handleItemChange(index, "adminComment", e.target.value)
                  }
                  placeholder="Optional note"
                />
              </Field>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-5">
        <Field label="Principal comment">
          <Textarea
            rows="4"
            value={requisition.principalComment || ""}
            onChange={(e) =>
              setRequisition({
                ...requisition,
                principalComment: e.target.value,
              })
            }
            placeholder="Overall comment on this requisition"
          />
        </Field>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit review"}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default PrincipalRequisitionDetails;
