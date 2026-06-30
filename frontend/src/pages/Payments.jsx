import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";

import { getApprovedRequisitions } from "../services/requisitionService";
import { releaseFunds } from "../services/accountsService";
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
import { FiCreditCard, FiCheckCircle } from "react-icons/fi";

const RELEASED = "FUNDS_RELEASED";

const Payments = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const loadRequisitions = async () => {
    try {
      const data = await getApprovedRequisitions();

      const filtered =
        data.requisitions?.filter(
          (req) => req.status === "APPROVED" || req.status === RELEASED
        ) || [];

      setRequisitions(filtered);
    } catch (error) {
      console.error("Error loading requisitions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequisitions();
  }, []);

  const handleReleaseFunds = async (id) => {
    setFeedback(null);
    try {
      await releaseFunds(id);
      setFeedback({
        variant: "success",
        text: "Funds released successfully. Stores has been notified.",
      });
      loadRequisitions();
    } catch (error) {
      console.error(error);
      setFeedback({ variant: "error", text: "Failed to release funds." });
    }
  };

  const approvedTotalFor = (req) =>
    req.items.reduce((total, item) => {
      if (item.status === "APPROVED") {
        return total + (item.approvedQuantity || 0) * (item.unitPrice || 0);
      }
      return total;
    }, 0);

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiCreditCard />}
        title="Payments"
        subtitle="Review approved requisitions and release funds."
      />

      {feedback ? (
        <Alert variant={feedback.variant} className="mb-5">
          {feedback.text}
        </Alert>
      ) : null}

      {loading ? (
        <Loader label="Loading requisitions…" />
      ) : requisitions.length === 0 ? (
        <EmptyState
          icon={<FiCreditCard />}
          title="No requisitions to fund"
          message="Approved requisitions awaiting fund release will appear here."
        />
      ) : (
        <div className="space-y-5">
          {requisitions.map((req) => {
            const approvedTotal = approvedTotalFor(req);
            const isReleased = req.status === RELEASED;

            return (
              <Card key={req._id} padded={false}>
                <div className="flex flex-col gap-3 border-b border-ink-100 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3>Requisition {req.requisitionId}</h3>
                    <p className="mt-1 text-sm text-ink-500">
                      {req.department?.name || "Unknown department"}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-400">
                      Requested amount
                    </p>
                    <p className="text-lg font-semibold text-ink-900">
                      MWK {Number(req.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-400">
                      Approved amount
                    </p>
                    <p className="text-lg font-semibold text-emerald-600">
                      MWK {approvedTotal.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-2">
                  <h4 className="mb-2 text-sm font-semibold text-ink-700">
                    Approved items
                  </h4>
                  <Table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Approved Qty</th>
                        <th>Unit Price</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {req.items
                        .filter((item) => item.status === "APPROVED")
                        .map((item) => (
                          <tr key={item._id}>
                            <td className="font-medium text-ink-900">
                              {item.name}
                            </td>
                            <td>{item.approvedQuantity}</td>
                            <td>
                              MWK{" "}
                              {Number(item.unitPrice || 0).toLocaleString()}
                            </td>
                            <td className="text-right">
                              MWK{" "}
                              {(
                                (item.approvedQuantity || 0) *
                                (item.unitPrice || 0)
                              ).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-ink-50 font-semibold">
                        <td colSpan="3" className="px-4 py-3">
                          Approved total
                        </td>
                        <td className="px-4 py-3 text-right">
                          MWK {approvedTotal.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>

                <div className="flex items-center justify-end gap-3 p-5">
                  {isReleased ? (
                    <p className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <FiCheckCircle className="size-4" />
                      Funds already released
                    </p>
                  ) : (
                    <Button onClick={() => handleReleaseFunds(req._id)}>
                      Release Funds
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Payments;
