import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { getArchivedAssets } from "../services/assetService";
import {
  PageHeader,
  Card,
  Table,
  Button,
  StatusBadge,
  EmptyState,
  Loader,
} from "../components/ui";
import { FiArchive } from "react-icons/fi";

const ArchivedAssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAssets = async () => {
    try {
      const response = await getArchivedAssets();
      setAssets(response.assets || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiArchive />}
        title="Archived Assets"
        subtitle="Assets that have been retired or disposed."
      />

      {loading ? (
        <Loader label="Loading archived assets…" />
      ) : assets.length === 0 ? (
        <EmptyState
          icon={<FiArchive />}
          title="No archived assets"
          message="Retired or disposed assets will appear here."
        />
      ) : (
        <Card padded={false}>
          <Table>
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Department</th>
                <th>Condition</th>
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
                  <td>{asset.department?.name || asset.department || "-"}</td>
                  <td>{asset.condition}</td>
                  <td>
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="text-right">
                    <Button
                      as={Link}
                      to={`/inventory/assets/${asset._id}`}
                      variant="secondary"
                      size="sm"
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

export default ArchivedAssetsPage;
