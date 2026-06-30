import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getDepartmentInventory } from "../services/inventoryService";
import {
  PageHeader,
  Card,
  StatusBadge,
  EmptyState,
  Loader,
} from "../components/ui";
import { FiBox } from "react-icons/fi";

const DepartmentInventory = () => {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      if (!user?.department) return;
      const res = await getDepartmentInventory(user.department);
      setItems(res.data.items || []);
    } catch (error) {
      console.log("Inventory load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.department) {
      fetchInventory();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiBox />}
        title="Department Inventory"
        subtitle="Assets received into your department from approved requisitions."
      />

      {loading ? (
        <Loader label="Loading inventory…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<FiBox />}
          title="No inventory found"
          message="Items received into your department will be listed here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item._id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3>{item.name}</h3>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-1 text-sm text-ink-500">
                Tag: {item.assetTag || "—"}
              </p>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Quantity</dt>
                  <dd className="font-medium text-ink-800">{item.quantity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Unit price</dt>
                  <dd className="font-medium text-ink-800">
                    MWK {Number(item.unitPrice || 0).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-ink-100 pt-2">
                  <dt className="text-ink-500">Total value</dt>
                  <dd className="font-semibold text-ink-900">
                    MWK{" "}
                    {Number(
                      (item.quantity || 0) * (item.unitPrice || 0)
                    ).toLocaleString()}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 border-t border-ink-100 pt-3 text-xs text-ink-500">
                <p>Received by: {item.receivedBy?.name || "Stores"}</p>
                <p>
                  Source: {item.sourceRequisition?.requisitionId || "N/A"}
                </p>
                <p className="mt-1 text-ink-400">
                  Added {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DepartmentInventory;
