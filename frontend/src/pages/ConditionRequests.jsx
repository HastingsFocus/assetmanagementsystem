import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  getConditionRequests,
  approveConditionRequest,
  rejectConditionRequest,
} from "../services/assetService";
import {
  PageHeader,
  Card,
  Table,
  Button,
  StatusBadge,
  Alert,
  EmptyState,
  Loader,
} from "../components/ui";
import { FiRepeat } from "react-icons/fi";

const ConditionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const loadRequests = async () => {
    try {
      const response = await getConditionRequests();
      setRequests(response.requests || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approve = async (id) => {
    setFeedback(null);
    try {
      await approveConditionRequest(id);
      setFeedback({ variant: "success", text: "Request approved successfully." });
      loadRequests();
    } catch (error) {
      console.log(error);
      setFeedback({ variant: "error", text: "Failed to approve request." });
    }
  };

  const reject = async (id) => {
    const reason = prompt("Enter rejection reason");
    if (!reason) return;
    setFeedback(null);
    try {
      await rejectConditionRequest(id, { rejectionReason: reason });
      setFeedback({ variant: "success", text: "Request rejected." });
      loadRequests();
    } catch (error) {
      console.log(error);
      setFeedback({ variant: "error", text: "Failed to reject request." });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiRepeat />}
        title="Asset Condition Requests"
        subtitle="Review requests to change the recorded condition of assets."
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
          icon={<FiRepeat />}
          title="No condition requests"
          message="Pending asset condition change requests will appear here."
        />
      ) : (
        <Card padded={false}>
          <Table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Current</th>
                <th>Requested</th>
                <th>Reason</th>
                <th>Requested By</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>
                    <span className="font-medium text-ink-900">
                      {request.asset?.assetName}
                    </span>
                    <span className="block text-xs text-ink-400">
                      {request.asset?.assetTag}
                    </span>
                  </td>
                  <td>{request.currentCondition}</td>
                  <td>{request.requestedCondition}</td>
                  <td className="max-w-xs">{request.reason}</td>
                  <td>{request.requestedBy?.name}</td>
                  <td>
                    <StatusBadge status={request.status} />
                  </td>
                  <td>
                    {request.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => approve(request._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => reject(request._id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default ConditionRequests;
