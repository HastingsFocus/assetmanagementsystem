import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { getMyTransferRequests } from "../services/assetService";
import {
  PageHeader,
  Card,
  StatusBadge,
  EmptyState,
  Loader,
} from "../components/ui";
import { FiList, FiArrowRight } from "react-icons/fi";

const MyTransferRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const response = await getMyTransferRequests();
      setRequests(response.requests || []);
    } catch (error) {
      console.log("Failed loading requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiList />}
        title="My Transfer Requests"
        subtitle="Track the status of your requested asset transfers."
      />

      {loading ? (
        <Loader label="Loading requests…" />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<FiList />}
          title="No transfer requests"
          message="Transfer requests you submit will be listed here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {requests.map((request) => (
            <Card key={request._id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3>{request.asset?.assetName}</h3>
                  <p className="mt-0.5 text-sm text-ink-500">
                    {request.asset?.assetTag}
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="badge badge-gray">
                  {request.fromDepartment?.name || "Unknown"}
                </span>
                <FiArrowRight className="size-4 text-ink-400" />
                <span className="badge badge-blue">
                  {request.toDepartment?.name || "Unknown"}
                </span>
              </div>

              <div className="mt-4 rounded-lg bg-ink-50 p-3 text-sm">
                <p className="font-medium text-ink-700">Reason</p>
                <p className="mt-1 text-ink-600">{request.reason}</p>
              </div>

              {request.status === "REJECTED" ? (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
                  <p className="font-medium text-red-700">Rejection reason</p>
                  <p className="mt-1 text-red-600">
                    {request.rejectionReason || "No reason provided"}
                  </p>
                </div>
              ) : null}

              <p className="mt-4 text-xs text-ink-400">
                Requested {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyTransferRequests;
