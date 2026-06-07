import { Navigate } from "react-router-dom";

import { useAuth }
from "../context/AuthContext";

const ProtectedRoute = ({
    children,
    allowedRoles = []
}) => {

    const {
        user,
        isAuthenticated,
        loading
    } = useAuth();

    /*
    ========================================
    WAIT FOR AUTH TO LOAD
    ========================================
    */

    if (loading) {
        return <h2>Loading...</h2>;
    }

    /*
    ========================================
    NOT LOGGED IN
    ========================================
    */

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    /*
    ========================================
    ROLE CHECK
    ========================================
    */

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user?.role)
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    /*
    ========================================
    ACCESS GRANTED
    ========================================
    */

    return children;
};

export default ProtectedRoute;