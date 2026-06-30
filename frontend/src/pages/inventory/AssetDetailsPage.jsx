import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import { getAssetById } from "../../services/assetService";
import {
  PageHeader,
  Card,
  Button,
  StatusBadge,
  Loader,
} from "../../components/ui";
import { FiArrowLeft } from "react-icons/fi";

const InfoItem = ({ label, value }) => (
  <div className="rounded-lg bg-ink-50 p-4">
    <p className="text-xs uppercase tracking-wide text-ink-400">{label}</p>
    <p className="mt-1 font-medium text-ink-800">{value || "—"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <Card className="mb-5">
    <h3 className="mb-4">{title}</h3>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  </Card>
);

const AssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAsset = async () => {
    try {
      setLoading(true);
      const res = await getAssetById(id);
      setAsset(res.asset || res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAsset();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader label="Loading asset…" />
      </DashboardLayout>
    );
  }

  if (!asset) {
    return (
      <DashboardLayout>
        <PageHeader title="Asset not found" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={asset.assetName}
        subtitle={asset.assetTag}
        actions={
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <FiArrowLeft className="size-4" />
            Back
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <StatusBadge status={asset.status} />
        <StatusBadge status={asset.condition} />
      </div>

      <Section title="General information">
        <InfoItem label="Asset Tag" value={asset.assetTag} />
        <InfoItem label="Category" value={asset.category} />
        <InfoItem
          label="Department"
          value={asset.department?.name || asset.department}
        />
        <InfoItem label="Source" value={asset.source} />
        <InfoItem
          label="Purchase Price"
          value={`MWK ${Number(asset.purchasePrice || 0).toLocaleString()}`}
        />
      </Section>

      <Section title="Asset information">
        <InfoItem label="Brand" value={asset.brand} />
        <InfoItem label="Model" value={asset.model} />
        <InfoItem label="Serial Number" value={asset.serialNumber} />
        <InfoItem label="Quantity" value={asset.quantity} />
      </Section>

      <Section title="Assignment information">
        <InfoItem label="Status" value={asset.status} />
        <InfoItem label="Condition" value={asset.condition} />
        <InfoItem
          label="Assigned Date"
          value={
            asset.assignedDate
              ? new Date(asset.assignedDate).toLocaleString()
              : "—"
          }
        />
        <InfoItem
          label="Archived Date"
          value={
            asset.archivedDate
              ? new Date(asset.archivedDate).toLocaleString()
              : "—"
          }
        />
      </Section>

      <Section title="Audit information">
        <InfoItem
          label="Created At"
          value={
            asset.createdAt ? new Date(asset.createdAt).toLocaleString() : "—"
          }
        />
        <InfoItem
          label="Last Updated"
          value={
            asset.updatedAt ? new Date(asset.updatedAt).toLocaleString() : "—"
          }
        />
        <InfoItem label="Remarks" value={asset.remarks} />
      </Section>
    </DashboardLayout>
  );
};

export default AssetDetailsPage;
