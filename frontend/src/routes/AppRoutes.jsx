import { Routes, Route, Navigate } from "react-router-dom";

/*
========================================
AUTH PAGES
========================================
*/
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

/*
========================================
SYSTEM PAGES
========================================
*/
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import Requisition from "../pages/Requisition";
import MyRequisitions from "../pages/MyRequisitions";
import PrincipalRequisitions from "../pages/PrincipalRequisitions";
import PrincipalRequisitionDetails from "../pages/PrincipalRequisitionDetails";
import Payments from "../pages/Payments";
import Users from "../pages/Users";
import Unauthorized from "../pages/Unauthorized";
import Notifications from "../pages/Notifications";

/*
========================================
INVENTORY PAGES
========================================
*/
import PendingReceivalsPage from "../pages/inventory/PendingReceivalsPage";
import CreateAssetPage from "../pages/inventory/CreateAssetPage";
import AssetListPage from "../pages/inventory/AssetListPage";
import AssetDetailsPage from "../pages/inventory/AssetDetailsPage";
import DepartmentInventory from "../pages/DepartmentInventory";
import HODAssetPage from "../pages/HODAssetPage";
import HODAssetDetailsPage from "../pages/HODAssetDetailsPage";
import ConditionRequests from "../pages/ConditionRequests";
import ArchivedAssetsPage from "../pages/ArchivedAssetsPage";

/*
========================================
ASSET TRANSFER PAGES
========================================
*/
import RequestAssetTransfer from "../pages/RequestAssetTransfer";
import MyTransferRequests from "../pages/MyTransferRequests";
import PendingTransfers from "../pages/PendingTransfers";

/*
========================================
PROTECTED ROUTES
========================================
*/
import RoleRoute from "../components/RoleRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* =========================
                DASHBOARD
            ========================= */}
            <Route
                path="/dashboard"
                element={
                    <RoleRoute allowedRoles={["HOD", "Principal", "Stores", "Accounts", "Admin"]}>
                        <Dashboard />
                    </RoleRoute>
                }
            />

            {/* =========================
                HOD ROUTES
            ========================= */}
            <Route
                path="/requisition"
                element={
                    <RoleRoute allowedRoles={["HOD"]}>
                        <Requisition />
                    </RoleRoute>
                }
            />
            <Route
                path="/my-requisitions"
                element={
                    <RoleRoute allowedRoles={["HOD"]}>
                        <MyRequisitions />
                    </RoleRoute>
                }
            />
            <Route
                path="/hod/assets"
                element={
                    <RoleRoute allowedRoles={["HOD"]}>
                        <HODAssetPage />
                    </RoleRoute>
                }
            />
            <Route
                path="/hod/assets/:id"
                element={
                    <RoleRoute allowedRoles={["HOD"]}>
                        <HODAssetDetailsPage />
                    </RoleRoute>
                }
            />
            <Route
                path="/department-inventory"
                element={
                    <RoleRoute allowedRoles={["HOD"]}>
                        <DepartmentInventory />
                    </RoleRoute>
                }
            />

            {/* =========================
                ASSET TRANSFERS HOD
            ========================= */}
            <Route
                path="/asset-transfer-request"
                element={
                    <RoleRoute allowedRoles={["HOD"]}>
                        <RequestAssetTransfer />
                    </RoleRoute>
                }
            />
            <Route
                path="/my-transfer-requests"
                element={
                    <RoleRoute allowedRoles={["HOD"]}>
                        <MyTransferRequests />
                    </RoleRoute>
                }
            />

            {/* =========================
                PRINCIPAL ROUTES
            ========================= */}
            <Route
                path="/principal/requisitions"
                element={
                    <RoleRoute allowedRoles={["Principal"]}>
                        <PrincipalRequisitions />
                    </RoleRoute>
                }
            />
            <Route
                path="/principal/requisitions/:id"
                element={
                    <RoleRoute allowedRoles={["Principal"]}>
                        <PrincipalRequisitionDetails />
                    </RoleRoute>
                }
            />

            {/* =========================
                STORES ROUTES
            ========================= */}
            <Route
                path="/inventory"
                element={
                    <RoleRoute allowedRoles={["Stores"]}>
                        <Inventory />
                    </RoleRoute>
                }
            />
            <Route
                path="/inventory/pending-receivals"
                element={
                    <RoleRoute allowedRoles={["Stores"]}>
                        <PendingReceivalsPage />
                    </RoleRoute>
                }
            />
            <Route
                path="/inventory/create-asset"
                element={
                    <RoleRoute allowedRoles={["Stores"]}>
                        <CreateAssetPage />
                    </RoleRoute>
                }
            />
            <Route
                path="/inventory/assets"
                element={
                    <RoleRoute allowedRoles={["Stores", "Admin"]}>
                        <AssetListPage />
                    </RoleRoute>
                }
            />
            <Route
                path="/inventory/assets/:id"
                element={
                    <RoleRoute allowedRoles={["Stores", "Admin"]}>
                        <AssetDetailsPage />
                    </RoleRoute>
                }
            />
            <Route
                path="/inventory/condition-requests"
                element={
                    <RoleRoute allowedRoles={["Stores"]}>
                        <ConditionRequests />
                    </RoleRoute>
                }
            />
            <Route
                path="/inventory/archived-assets"
                element={
                    <RoleRoute allowedRoles={["Stores", "Admin"]}>
                        <ArchivedAssetsPage />
                    </RoleRoute>
                }
            />

            {/* =========================
                ASSET TRANSFER STORES
            ========================= */}
            <Route
                path="/stores/pending-transfers"
                element={
                    <RoleRoute allowedRoles={["Stores"]}>
                        <PendingTransfers />
                    </RoleRoute>
                }
            />

            {/* =========================
                PAYMENTS
            ========================= */}
            <Route
                path="/payments"
                element={
                    <RoleRoute allowedRoles={["Accounts", "Admin"]}>
                        <Payments />
                    </RoleRoute>
                }
            />

            {/* =========================
                USERS
            ========================= */}
            <Route
                path="/users"
                element={
                    <RoleRoute allowedRoles={["Admin"]}>
                        <Users />
                    </RoleRoute>
                }
            />

            {/* =========================
                NOTIFICATIONS
            ========================= */}
            <Route
                path="/notifications"
                element={
                    <RoleRoute allowedRoles={["HOD", "Principal", "Stores", "Accounts"]}>
                        <Notifications />
                    </RoleRoute>
                }
            />

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;