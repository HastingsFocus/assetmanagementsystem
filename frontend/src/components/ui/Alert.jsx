/**
 * Alert — inline feedback message (error / success / info / warning).
 * Used to replace raw browser alert() calls and unstyled error <div>s.
 */
const STYLES = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-brand-200 bg-brand-50 text-brand-700",
};

const Alert = ({ variant = "info", className = "", children }) => {
  if (!children) return null;
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-sm ${
        STYLES[variant] || STYLES.info
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Alert;
