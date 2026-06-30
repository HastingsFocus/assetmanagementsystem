import { useEffect, useState } from "react";
import API from "../../services/api";
import { receiveRequisitionAssets } from "../../services/assetService";
import DashboardLayout from "../../layout/DashboardLayout";
import {
  PageHeader,
  Card,
  Table,
  Button,
  StatusBadge,
  Alert,
  EmptyState,
  Loader,
} from "../../components/ui";
import { FiInbox } from "react-icons/fi";

const PendingReceivalsPage = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const fetchPendingReceivals = async () => {
    try {
      setLoading(true);
      const res = await API.get("/requisitions");
      const pending = (res.data.requisitions || []).filter(
        (req) => req.status === "FUNDS_RELEASED" && !req.inventoryAdded
      );
      setRequisitions(pending);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReceivals();
  }, []);

  const getApprovedTotal = (items) =>
    items.reduce((sum, item) => {
      if (item.status === "APPROVED" && item.approvedQuantity > 0) {
        return sum + item.approvedQuantity * item.unitPrice;
      }
      return sum;
    }, 0);

  const handleReceiveAssets = async (requisitionId) => {
    setFeedback(null);
    try {
      const response = await receiveRequisitionAssets(requisitionId);
      setFeedback({
        variant: "success",
        text: response.message || "Assets created successfully.",
      });
      fetchPendingReceivals();
    } catch (error) {
      console.error(error);
      setFeedback({
        variant: "error",
        text: error?.response?.data?.message || "Failed to receive assets.",
      });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiInbox />}
        title="Pending Asset Receivals"
        subtitle="Funded requisitions waiting to be converted into assets."
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
          icon={<FiInbox />}
          title="Nothing to receive"
          message="Funded requisitions awaiting receival will appear here."
        />
      ) : (
        <div className="space-y-5">
          {requisitions.map((req) => {
            const approvedItems =
              req.items?.filter(
                (item) =>
                  item.status === "APPROVED" && item.approvedQuantity > 0
              ) || [];

            return (
              <Card key={req._id} padded={false}>
                <div className="flex flex-col gap-2 border-b border-ink-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3>{req.requisitionId}</h3>
                    <p className="mt-0.5 text-sm text-ink-500">
                      {req.department?.name || "Unknown"} · Priority{" "}
                      {req.priority}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={req.status} />
                    <span className="text-sm font-semibold text-ink-900">
                      MWK {getApprovedTotal(req.items).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-5">
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
                      {approvedItems.map((item) => (
                        <tr key={item._id}>
                          <td className="font-medium text-ink-900">
                            {item.name}
                          </td>
                          <td>{item.approvedQuantity}</td>
                          <td>
                            MWK {Number(item.unitPrice).toLocaleString()}
                          </td>
                          <td className="text-right">
                            MWK{" "}
                            {(
                              item.approvedQuantity * item.unitPrice
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-ink-500">
                      {approvedItems.reduce(
                        (n, i) => n + (i.approvedQuantity || 0),
                        0
                      )}{" "}
                      asset(s) will be created.
                    </p>
                    <Button
                      variant="success"
                      onClick={() => handleReceiveAssets(req._id)}
                    >
                      Receive Assets
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PendingReceivalsPage;
