import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import { getAllAssets } from "../../services/assetService";
import {
  PageHeader,
  Card,
  Table,
  Button,
  StatusBadge,
  Loader,
  EmptyState,
} from "../../components/ui";
import { FiBox } from "react-icons/fi";

const AssetListPage = () => {
  const [groupedAssets, setGroupedAssets] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /*
  ==========================================
  LOAD + GROUP ASSETS BY DEPARTMENT
  ==========================================
  */
  const loadAssets = async () => {
    try {
      setLoading(true);

      const response = await getAllAssets();

      const assets = response.assets || [];

      const grouped = assets.reduce((acc, asset) => {
        const department =
          asset.department?.name ||
          asset.department ||
          "Unknown Department";

        if (!acc[department]) {
          acc[department] = [];
        }

        acc[department].push(asset);

        return acc;
      }, {});

      setGroupedAssets(grouped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const departments = Object.keys(groupedAssets);

  return (
    <DashboardLayout>
      <PageHeader
        icon={<FiBox />}
        title="Asset Register"
        subtitle="All assets grouped by department."
      />

      {loading ? (
        <Loader label="Loading assets…" />
      ) : departments.length === 0 ? (
        <EmptyState
          icon={<FiBox />}
          title="No assets found"
          message="Once assets are created they will appear here grouped by department."
        />
      ) : (
        <div className="space-y-6">
          {departments.map((department) => (
            <Card key={department} padded={false}>
              <div className="flex items-center justify-between px-5 py-4">
                <h3>{department}</h3>
                <span className="badge badge-gray">
                  {groupedAssets[department].length} assets
                </span>
              </div>

              <Table>
                <thead>
                  <tr>
                    <th>Asset Tag</th>
                    <th>Asset Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {groupedAssets[department].map((asset) => (
                    <tr key={asset._id}>
                      <td className="font-medium text-ink-900">
                        {asset.assetTag}
                      </td>
                      <td>{asset.assetName}</td>
                      <td>{asset.category}</td>
                      <td>{asset.brand || "-"}</td>
                      <td>{asset.model || "-"}</td>
                      <td>{asset.source}</td>
                      <td>
                        <StatusBadge status={asset.status} />
                      </td>
                      <td className="whitespace-nowrap">
                        MWK{" "}
                        {Number(asset.purchasePrice || 0).toLocaleString()}
                      </td>
                      <td className="text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            navigate(`/inventory/assets/${asset._id}`)
                          }
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AssetListPage;
