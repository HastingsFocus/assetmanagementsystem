import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getMyRequisitions } from "../services/requisitionService";
import {
  PageHeader,
  Card,
  Table,
  StatusBadge,
  EmptyState,
  Loader,
} from "../components/ui";
import { FiFileText } from "react-icons/fi";

const MyRequisitions = () => {
  const { user } = useAuth();

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRequisitions = async () => {
    try {
      setLoading(true);
      const res = await getMyRequisitions();
      setRequisitions(res.data.requisitions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "HOD") {
      fetchMyRequisitions();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiFileText />}
        title="My Requisitions"
        subtitle="Track the status of requisitions you've submitted."
      />

      {loading ? (
        <Loader label="Loading requisitions…" />
      ) : requisitions.length === 0 ? (
        <EmptyState
          icon={<FiFileText />}
          title="No requisitions yet"
          message="Requisitions you create will be listed here with their approval status."
        />
      ) : (
        <div className="space-y-5">
          {requisitions.map((req) => {
            const approvedTotal = req.items.reduce((sum, item) => {
              if (item.status === "APPROVED") {
                return (
                  sum + (item.approvedQuantity || 0) * (item.unitPrice || 0)
                );
              }
              return sum;
            }, 0);

            return (
              <Card key={req._id} padded={false}>
                <div className="flex flex-col gap-2 border-b border-ink-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <h3>{req.requisitionId}</h3>
                  <StatusBadge status={req.status} />
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-400">
                      Priority
                    </p>
                    <p className="font-medium text-ink-800">{req.priority}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-400">
                      Requested
                    </p>
                    <p className="font-medium text-ink-800">
                      MWK {Number(req.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-400">
                      Approved
                    </p>
                    <p className="font-medium text-emerald-600">
                      MWK {approvedTotal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-400">
                      Date
                    </p>
                    <p className="font-medium text-ink-800">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="px-5">
                  <h4 className="mb-2 text-sm font-semibold text-ink-700">
                    Requested items
                  </h4>
                  <Table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Req. Qty</th>
                        <th>Appr. Qty</th>
                        <th>Unit Price</th>
                        <th>Approved Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {req.items.map((item) => (
                        <tr key={item._id}>
                          <td className="font-medium text-ink-900">
                            {item.name}
                          </td>
                          <td>{item.quantity}</td>
                          <td>{item.approvedQuantity ?? "-"}</td>
                          <td>
                            MWK {Number(item.unitPrice || 0).toLocaleString()}
                          </td>
                          <td>
                            MWK{" "}
                            {(
                              (item.approvedQuantity || 0) *
                              (item.unitPrice || 0)
                            ).toLocaleString()}
                          </td>
                          <td>
                            <StatusBadge status={item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="m-5 rounded-lg border-l-4 border-brand-500 bg-brand-50/50 p-4">
                  <p className="text-sm font-semibold text-ink-700">
                    Principal comment
                  </p>
                  <p className="mt-1 text-sm text-ink-600">
                    {req.principalComment || "No comment provided yet."}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyRequisitions;
