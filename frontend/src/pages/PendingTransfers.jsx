import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  getPendingTransferRequests,
  approveTransferRequest,
  rejectTransferRequest,
} from "../services/assetService";
import {
  PageHeader,
  Card,
  Button,
  Alert,
  EmptyState,
  Loader,
} from "../components/ui";
import { FiTruck, FiArrowRight } from "react-icons/fi";

const PendingTransfers = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const loadRequests = async () => {
    try {
      const response = await getPendingTransferRequests();
      setRequests(response.requests || []);
    } catch (error) {
      console.log("Failed loading transfers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this asset transfer?")) return;
    setFeedback(null);
    try {
      await approveTransferRequest(id);
      setFeedback({
        variant: "success",
        text: "Asset transferred successfully.",
      });
      loadRequests();
    } catch (error) {
      console.log(error);
      setFeedback({
        variant: "error",
        text: error?.response?.data?.message || "Failed approving transfer.",
      });
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason");
    if (!reason) return;
    setFeedback(null);
    try {
      await rejectTransferRequest(id, { rejectionReason: reason });
      setFeedback({ variant: "success", text: "Transfer rejected." });
      loadRequests();
    } catch (error) {
      console.log(error);
      setFeedback({
        variant: "error",
        text: error?.response?.data?.message || "Failed rejecting request.",
      });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiTruck />}
        title="Pending Asset Transfers"
        subtitle="Review and approve asset movement requests."
      />

      {feedback ? (
        <Alert variant={feedback.variant} className="mb-5">
          {feedback.text}
        </Alert>
      ) : null}

      {loading ? (
        <Loader label="Loading requests…" />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<FiTruck />}
          title="No pending transfers"
          message="Transfer requests awaiting approval will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {requests.map((request) => (
            <Card key={request._id} className="flex flex-col">
              <h3>{request.asset?.assetName}</h3>
              <p className="mt-0.5 text-sm text-ink-500">
                {request.asset?.assetTag}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="badge badge-gray">
                  {request.fromDepartment?.name || "Unknown"}
                </span>
                <FiArrowRight className="size-4 text-ink-400" />
                <span className="badge badge-blue">
                  {request.toDepartment?.name || "Unknown"}
                </span>
              </div>

              <p className="mt-3 text-sm text-ink-500">
                Requested by{" "}
                <span className="font-medium text-ink-800">
                  {request.requestedBy?.name || "Unknown"}
                </span>
              </p>

              <div className="mt-3 rounded-lg bg-ink-50 p-3 text-sm">
                <p className="font-medium text-ink-700">Reason</p>
                <p className="mt-1 text-ink-600">{request.reason}</p>
              </div>

              <div className="mt-4 flex gap-2 pt-1">
                <Button
                  variant="success"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleApprove(request._id)}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleReject(request._id)}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PendingTransfers;
