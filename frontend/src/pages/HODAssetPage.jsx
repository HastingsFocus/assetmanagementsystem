import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { getAllAssets } from "../services/assetService";
import { useAuth } from "../context/AuthContext";
import {
  PageHeader,
  Card,
  Table,
  Button,
  StatusBadge,
  EmptyState,
  Loader,
} from "../components/ui";
import { FiFolder } from "react-icons/fi";

const HODAssetPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  const loadAssets = async () => {
    try {
      setLoading(true);

      const response = await getAllAssets();
      const allAssets = response.assets || [];

      const filtered = allAssets.filter((asset) => {
        const assetDept = asset.department?._id || asset.department;
        const userDept = user.department?._id || user.department;
        return assetDept === userDept;
      });

      setAssets(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadAssets();
  }, [user]);

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiFolder />}
        title="My Department Assets"
        subtitle="Assets allocated to your department only."
      />

      {loading ? (
        <Loader label="Loading assets…" />
      ) : assets.length === 0 ? (
        <EmptyState
          icon={<FiFolder />}
          title="No assets found"
          message="There are no assets allocated to your department yet."
        />
      ) : (
        <Card padded={false}>
          <Table>
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset._id}>
                  <td className="font-medium text-ink-900">{asset.assetTag}</td>
                  <td>{asset.assetName}</td>
                  <td>{asset.category}</td>
                  <td>{asset.brand || "-"}</td>
                  <td>{asset.model || "-"}</td>
                  <td>
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/hod/assets/${asset._id}`)}
                    >
                      View
                    </Button>
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

export default HODAssetPage;
