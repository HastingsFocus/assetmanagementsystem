import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                flexDirection: "column",
                gap: "1rem"
            }}
        >
            <h1>403 - Unauthorized</h1>

            <p>
                You do not have permission
                to access this page.
            </p>

            <Link to="/dashboard">
                Return to Dashboard
            </Link>
        </div>
    );
};

export default Unauthorized;