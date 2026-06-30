/**
 * Badge — small status pill.
 *
 * <Badge color="green">Approved</Badge>
 * <StatusBadge status="in_store" /> — maps domain statuses to colors + labels.
 */
const COLORS = {
  gray: "badge-gray",
  blue: "badge-blue",
  green: "badge-green",
  amber: "badge-amber",
  red: "badge-red",
};

export const Badge = ({ color = "gray", className = "", children }) => {
  return (
    <span className={`badge ${COLORS[color] || COLORS.gray} ${className}`}>
      {children}
    </span>
  );
};

/**
 * Maps the various status strings used across the system to a sensible color.
 * Falls back to gray for anything unknown.
 */
const STATUS_COLORS = {
  // assets
  in_store: "green",
  available: "green",
  assigned: "blue",
  in_use: "blue",
  maintenance: "amber",
  repair: "amber",
  damaged: "red",
  retired: "gray",
  archived: "gray",
  disposed: "red",
  // workflow
  PENDING: "amber",
  pending: "amber",
  APPROVED: "green",
  approved: "green",
  REJECTED: "red",
  rejected: "red",
  FUNDS_RELEASED: "blue",
  FUNDED: "blue",
  COMPLETED: "green",
  RECEIVED: "green",
};

const prettify = (status) =>
  String(status || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const StatusBadge = ({ status, className = "" }) => {
  const color = STATUS_COLORS[status] || "gray";
  return (
    <Badge color={color} className={className}>
      {prettify(status) || "—"}
    </Badge>
  );
};

export default Badge;
