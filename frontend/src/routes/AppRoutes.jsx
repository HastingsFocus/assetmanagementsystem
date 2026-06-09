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
import ReceiveGoodsPage from "../pages/inventory/ReceiveGoodsPage";
import InventoryListPage from "../pages/inventory/InventoryListPage";
import DepartmentInventory from "../pages/DepartmentInventory";

/*
========================================
PROTECTED ROUTES
========================================
*/
import RoleRoute from "../components/RoleRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* =========================
          DEFAULT ROUTE
      ========================= */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* =========================
          AUTH ROUTES
      ========================= */}
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

      {/* 📦 DEPARTMENT INVENTORY (HOD) */}
<Route
  path="/department-inventory"
  element={
    <RoleRoute allowedRoles={["HOD"]}>
      <DepartmentInventory />
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
          INVENTORY
      ========================= */}
      <Route
        path="/inventory"
        element={
          <RoleRoute allowedRoles={["Stores", "Admin"]}>
            <Inventory />
          </RoleRoute>
        }
      />
      /*
========================================
INVENTORY - RECEIVE GOODS (STORES ONLY)
========================================
*/
<Route
  path="/inventory/receive"
  element={
    <RoleRoute allowedRoles={["Stores"]}>
      <ReceiveGoodsPage />
    </RoleRoute>
  }
/>

/*
========================================
INVENTORY - LIST VIEW
========================================
*/
<Route
  path="/inventory/list"
  element={
    <RoleRoute allowedRoles={["Stores", "Admin"]}>
      <InventoryListPage />
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
          USER MANAGEMENT
      ========================= */}
      <Route
        path="/users"
        element={
          <RoleRoute allowedRoles={["Admin"]}>
            <Users />
          </RoleRoute>
        }
      />


      <Route
  path="/notifications"
  element={
    <RoleRoute
      allowedRoles={[
        "HOD",
        "Principal",
        "Stores",
        "Accounts",
      ]}
    >
      <Notifications />
    </RoleRoute>
  }
/>

      {/* =========================
          ERROR / FALLBACK
      ========================= */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default AppRoutes;