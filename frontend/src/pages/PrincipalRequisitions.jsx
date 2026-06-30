import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { getAllRequisitions } from "../services/requisitionService";
import { useAuth } from "../context/AuthContext";
import {
  PageHeader,
  Card,
  Button,
  StatusBadge,
  EmptyState,
  Loader,
} from "../components/ui";
import { FiClipboard, FiArrowRight } from "react-icons/fi";

const PrincipalRequisitions = () => {
  const { user } = useAuth();
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequisitions = async () => {
    try {
      setLoading(true);
      const res = await getAllRequisitions();
      setRequisitions(res.data.requisitions || []);
    } catch (error) {
      console.log("Error fetching requisitions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "Principal") {
      fetchRequisitions();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiClipboard />}
        title="Requisitions"
        subtitle="Review and monitor all submitted requisitions."
      />

      {loading ? (
        <Loader label="Loading requisitions…" />
      ) : requisitions.length === 0 ? (
        <EmptyState
          icon={<FiClipboard />}
          title="No requisitions found"
          message="Submitted requisitions awaiting your review will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {requisitions.map((req) => {
            const approvedAmount = req.items.reduce((total, item) => {
              if (item.status === "APPROVED") {
                return (
                  total + (item.approvedQuantity || 0) * (item.unitPrice || 0)
                );
              }
              return total;
            }, 0);

            return (
              <Card key={req._id} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3>{req.requisitionId}</h3>
                    <p className="mt-0.5 text-sm text-ink-500">
                      {req.department?.name ||
                        req.department?.code ||
                        "Unknown department"}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Requested by</dt>
                    <dd className="font-medium text-ink-800">
                      {req.requestedBy?.name || "Unknown"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Items</dt>
                    <dd className="font-medium text-ink-800">
                      {req.items?.length || 0}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Priority</dt>
                    <dd className="font-medium text-ink-800">{req.priority}</dd>
                  </div>
                </dl>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-ink-50 p-3 text-sm">
                  <div>
                    <p className="text-xs text-ink-400">Requested</p>
                    <p className="font-semibold text-ink-900">
                      MWK {Number(req.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-400">Approved</p>
                    <p className="font-semibold text-emerald-600">
                      MWK {approvedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-1">
                  <Button
                    as={Link}
                    to={`/principal/requisitions/${req._id}`}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    View details
                    <FiArrowRight className="size-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PrincipalRequisitions;
