import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/Authentication/pages/LoginPage";
import VerifyOtpPage from "../features/Authentication/pages/VerifyOtpPage";
import ResetPasswordPage from "../features/Authentication/pages/ResetPasswordPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import EnquiriesPage from "../features/enquiries/pages/EnquiriesPage";
import B2BTripsPage from "../features/trips/pages/B2BTripsPage";
import OrdersPage from "../features/orders/pages/OrdersPage";
import DriversPage from "../features/drivers/pages/DriversPage";
import CompaniesPage from "../features/companies/pages/CompaniesPage";
import VehiclesApprovalPage from "../features/companies/pages/VehiclesApprovalPage";
import AccountsCreditPage from "../features/accounts/pages/AccountsCreditPage";
import PayoutsPage from "../features/payouts/pages/PayoutsPage";
import InvoicingPage from "../features/invoicing/pages/InvoicingPage";
import StatementsPage from "../features/statements/pages/StatementsPage";
import ReportsPage from "../features/reports/pages/ReportsPage";
import PerformanceAnalyticsPage from "../features/analytics/pages/PerformanceAnalyticsPage";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";
import AdminUsersPage from "../features/admin-users/pages/AdminUsersPage";
import AuditLogsPage from "../features/audit-logs/pages/AuditLogsPage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import B2BSupportPage from "../features/support/pages/B2BSupportPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />

        {/* Protected Dashboard & Operations Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <B2BTripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drivers"
          element={
            <ProtectedRoute>
              <DriversPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enquiries"
          element={
            <ProtectedRoute>
              <EnquiriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <CompaniesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <VehiclesApprovalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <B2BSupportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support/:ticketId"
          element={
            <ProtectedRoute>
              <B2BSupportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts-credit"
          element={
            <ProtectedRoute>
              <AccountsCreditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payouts"
          element={
            <ProtectedRoute>
              <PayoutsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoicing"
          element={
            <ProtectedRoute>
              <InvoicingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statements"
          element={
            <ProtectedRoute>
              <StatementsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <PerformanceAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AuditLogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
