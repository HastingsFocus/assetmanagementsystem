import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-100 px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <FiLock className="size-7" />
      </span>
      <div>
        <p className="text-sm font-semibold text-red-600">Error 403</p>
        <h1 className="mt-1">Unauthorized</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-500">
          You do not have permission to access this page. If you think this is a
          mistake, contact your administrator.
        </p>
      </div>
      <Link to="/dashboard" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
