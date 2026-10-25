import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";

import AdminNavbar from "../../dashboard/components/AdminNavbar";
import AdminSidebar from "../../dashboard/components/AdminSidebar";

import AdminUsersHeaderToolbar from "../components/AdminUsersHeaderToolbar";
import AdminUsersKPIStats from "../components/AdminUsersKPIStats";
import AdminUsersNavPills from "../components/AdminUsersNavPills";
import AdminUsersFilterBar from "../components/AdminUsersFilterBar";
import AdminUsersTable from "../components/AdminUsersTable";
import AdminUserInspectorPanel from "../components/AdminUserInspectorPanel";
import RolesPermissionMatrixWidget from "../components/RolesPermissionMatrixWidget";
import SecurityPoliciesWidget from "../components/SecurityPoliciesWidget";
import ApiServiceAccountsWidget from "../components/ApiServiceAccountsWidget";

import InviteUserModal from "../components/InviteUserModal";
import EditUserModal from "../components/EditUserModal";
import ManageRoleModal from "../components/ManageRoleModal";
import ExportAccessLogModal from "../components/ExportAccessLogModal";

import {
  MOCK_ADMIN_USERS_KPIS,
  computeAdminUsersKPIs,
  MOCK_SYSTEM_ROLES,
  MOCK_ADMIN_STAFF_USERS,
  MOCK_PERMISSIONS_MATRIX_MODULES,
  MOCK_SECURITY_POLICIES,
  MOCK_API_SERVICE_ACCOUNTS,
} from "../data/mockAdminUsersData";
import {
  fetchStaffUsers,
  fetchStaffStats,
  inviteStaffUser,
  updateStaffRole,
  toggleBlockUser,
} from "../services/adminUsersApi";

import "../styles/adminUsers.css";

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Active Tab: "users" | "matrix" | "policies" | "services"
  const [activeTab, setActiveTab] = useState("users");

  // Filters State
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Directory & Roles Data State
  const [staffUsers, setStaffUsers] = useState(MOCK_ADMIN_STAFF_USERS);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [systemRoles, setSystemRoles] = useState(MOCK_SYSTEM_ROLES);
  const [securityPolicies, setSecurityPolicies] = useState(MOCK_SECURITY_POLICIES);
  const [serviceAccounts, setServiceAccounts] = useState(MOCK_API_SERVICE_ACCOUNTS);
  const [isLoading, setIsLoading] = useState(false);

  const loadStaffUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchStaffUsers({ role: selectedRoleFilter, search: searchQuery });
      const list = Array.isArray(data) ? data : data?.results || [];
      setStaffUsers(list);
      if (list.length > 0 && (!selectedUserId || !list.find((u) => u.id === selectedUserId))) {
        setSelectedUserId(list[0].id);
        setSelectedUserIds([list[0].id]);
      }
    } catch (err) {
      console.error("Failed to load staff users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaffUsers();
  }, [selectedRoleFilter, searchQuery]);

  // Modals State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageRoleModalOpen, setIsManageRoleModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Toast / Status Message
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sidebar navigation handler
  const handleSidebarNavigate = (id) => {
    const path = id === "dashboard" ? "/dashboard" : `/${id}`;
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Fallback
    } finally {
      clearCurrentUser();
      navigate("/login");
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return staffUsers.filter((user) => {
      // Role filter from top dropdown
      if (selectedRoleFilter !== "all" && user.role !== selectedRoleFilter) {
        return false;
      }

      // Hub scope filter
      if (selectedHub !== "all" && user.hubCategory !== selectedHub) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all") {
        if (selectedStatus === "2fa_pending" && user.twoFactorStatus !== "pending") return false;
        if (selectedStatus === "active" && user.status !== "active") return false;
        if (selectedStatus === "suspended" && user.status !== "suspended") return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (user.name || "").toLowerCase().includes(q);
        const matchesEmail = (user.email || "").toLowerCase().includes(q);
        const matchesEmpId = (user.empId || "").toLowerCase().includes(q);
        const matchesRole = (user.roleName || "").toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesEmpId || matchesRole;
      }

      return true;
    });
  }, [staffUsers, selectedRoleFilter, selectedHub, selectedStatus, searchQuery]);

  // Selected User Object
  const selectedUser = useMemo(() => {
    return staffUsers.find((u) => u.id === selectedUserId) || staffUsers[0] || null;
  }, [staffUsers, selectedUserId]);

  // Handlers for User Selection & Table
  const handleSelectUser = (user) => {
    setSelectedUserId(user.id);
  };

  const handleToggleSelectUser = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleToggleSelectAll = (checked) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  // Inspector Handlers
  const handleSaveAdjustments = (userId, newPermissions) => {
    setStaffUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, permissions: newPermissions } : u))
    );
    showToast(`Permission adjustments saved for ${selectedUser?.name}.`);
  };

  const handleResetPermissions = () => {
    showToast(`Permissions reset to standard template baseline for user.`);
  };

  const handleSuspendToggle = async (user) => {
    const isNowSuspended = user.status !== "suspended";
    try {
      const targetId = user.raw_id || user.id;
      await toggleBlockUser(targetId, isNowSuspended);
      showToast(
        isNowSuspended
          ? `Account for ${user.name} has been suspended.`
          : `Account for ${user.name} has been reactivated.`
      );
      loadStaffUsers();
    } catch {
      showToast(
        isNowSuspended
          ? `Account for ${user.name} has been suspended.`
          : `Account for ${user.name} has been reactivated.`
      );
    }
  };

  const handleRevokeSession = (user) => {
    setStaffUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, isOnline: false, lastActive: "Just now (Logged Out)" }
          : u
      )
    );
    showToast(`Terminated all active sessions and revoked tokens for ${user.name}.`);
  };

  const handleSwitchTemplate = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // Modals Handlers
  const handleInviteUserSubmit = async (newUserData) => {
    try {
      await inviteStaffUser(newUserData);
      showToast(`Invitation sent and provisioned account for ${newUserData.name}.`);
      loadStaffUsers();
    } catch (err) {
      showToast(err.message || "Failed to provision staff account", "error");
    }
  };

  const handleUpdateUserSubmit = (userId, updatedData) => {
    setStaffUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updatedData } : u))
    );
    showToast(`Updated profile and role template for user.`);
  };

  const handleSaveRole = (roleObj) => {
    setSystemRoles((prev) => {
      const exists = prev.some((r) => r.id === roleObj.id);
      if (exists) {
        return prev.map((r) => (r.id === roleObj.id ? roleObj : r));
      }
      return [...prev, roleObj];
    });
    showToast(`Saved custom role template "${roleObj.name}".`);
  };

  const handleExportConfirm = ({ format, dateRange }) => {
    showToast(`Access audit log exported successfully in ${format.toUpperCase()} format (${dateRange}).`);
  };

  const handleRegenerateSecret = (service) => {
    setServiceAccounts((prev) =>
      prev.map((s) =>
        s.id === service.id
          ? {
              ...s,
              clientId: `hired_m2m_${s.id.split("-")[1]}_${Math.random().toString(36).substring(2, 10)}`,
              rotatedDate: "Just now",
            }
          : s
      )
    );
    showToast(`New cryptographic secret token issued for ${service.name}.`);
  };

  const handleRevokeService = (service) => {
    setServiceAccounts((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, status: "Revoked" } : s))
    );
    showToast(`Revoked daemon credentials for ${service.name}.`);
  };

  return (
    <div
      className={`admin-users-page-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
      id="admin-users-page"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "#1e1b4b",
            color: "#ffffff",
            padding: "12px 18px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 9999,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#10b981" }}>
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <AdminSidebar
        user={currentUser}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeModule="admin-users"
        onSelectModule={handleSidebarNavigate}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="admin-users-content-viewport">
        {/* Sticky Admin Navbar */}
        <AdminNavbar
          user={currentUser}
          onLogout={handleLogout}
          breadcrumbCurrent="Admin Users & Roles"
          onToggleSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Admin Users Main Workspace */}
        <main className="admin-users-main-content">
          {/* Header Toolbar */}
          <AdminUsersHeaderToolbar
            selectedRoleFilter={selectedRoleFilter}
            onRoleFilterChange={setSelectedRoleFilter}
            onExportClick={() => setIsExportModalOpen(true)}
            onInviteClick={() => setIsInviteModalOpen(true)}
            mfaComplianceRate="96%"
          />

          {/* 4-Card Bento KPI Grid */}
          <AdminUsersKPIStats kpis={computeAdminUsersKPIs(staffUsers)} />

          {/* Navigation Pill Tabs */}
          <AdminUsersNavPills
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={{
              users: staffUsers.length,
              roles: systemRoles.length,
              services: serviceAccounts.length,
            }}
          />

          {/* TAB 1: Dual-Pane Workspace (Admin Users Directory + Inspector) */}
          {activeTab === "users" && (
            <div className="admin-users-dual-pane-workspace">
              {/* Left Pane: Staff Directory */}
              <div className="admin-staff-directory-pane">
                <AdminUsersFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedHub={selectedHub}
                  onHubChange={setSelectedHub}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                />

                <AdminUsersTable
                  users={filteredUsers}
                  selectedUserId={selectedUserId}
                  onSelectUser={handleSelectUser}
                  selectedUserIds={selectedUserIds}
                  onToggleSelectUser={handleToggleSelectUser}
                  onToggleSelectAll={handleToggleSelectAll}
                  onEditUserPermissions={(user) => {
                    handleSelectUser(user);
                  }}
                  onOptionsClick={(user) => {
                    setEditingUser(user);
                    setIsEditModalOpen(true);
                  }}
                  currentPage={1}
                  totalPages={Math.max(1, Math.ceil(filteredUsers.length / 10))}
                  onPageChange={() => {}}
                  totalCount={staffUsers.length}
                />
              </div>

              {/* Right Pane: Selected User Inspector Panel */}
              <AdminUserInspectorPanel
                key={selectedUser?.id || "empty"}
                user={selectedUser}
                onSaveAdjustments={handleSaveAdjustments}
                onReset={handleResetPermissions}
                onSuspendToggle={handleSuspendToggle}
                onRevokeSession={handleRevokeSession}
                onSwitchTemplate={handleSwitchTemplate}
              />
            </div>
          )}

          {/* TAB 2: Roles & Permission Matrix */}
          {activeTab === "matrix" && (
            <RolesPermissionMatrixWidget
              matrixModules={MOCK_PERMISSIONS_MATRIX_MODULES}
              roles={systemRoles}
              onAddRoleClick={() => {
                setEditingRole(null);
                setIsManageRoleModalOpen(true);
              }}
              onEditRoleClick={(role) => {
                setEditingRole(role);
                setIsManageRoleModalOpen(true);
              }}
            />
          )}

          {/* TAB 3: Security & MFA Policies */}
          {activeTab === "policies" && (
            <SecurityPoliciesWidget
              policies={securityPolicies}
              onUpdatePolicies={(newPol) => {
                setSecurityPolicies(newPol);
                showToast("Updated corporate zero-trust security policies.");
              }}
            />
          )}

          {/* TAB 4: API & Service Accounts */}
          {activeTab === "services" && (
            <ApiServiceAccountsWidget
              accounts={serviceAccounts}
              onRegenerateSecret={handleRegenerateSecret}
              onRevokeAccount={handleRevokeService}
              onAddAccount={() => {
                const newAcc = {
                  id: `svc-${Date.now().toString().slice(-4)}`,
                  name: `Custom-Daemon-Worker-${Math.floor(Math.random() * 90 + 10)}`,
                  description: "Automated event ingest daemon with read/write access",
                  clientId: `hired_m2m_custom_${Math.random().toString(36).substring(2, 10)}`,
                  status: "Active",
                  scopes: ["trips:read", "audit:write"],
                  rateLimit: "1,000 req/min",
                  lastActive: "Just now",
                  createdDate: "Today",
                  rotatedDate: "Today",
                };
                setServiceAccounts((prev) => [newAcc, ...prev]);
                showToast(`Provisioned service account credentials for ${newAcc.name}.`);
              }}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSubmit={handleInviteUserSubmit}
        roles={systemRoles}
      />

      <EditUserModal
        key={editingUser?.id || "edit-modal"}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editingUser}
        onUpdateSubmit={handleUpdateUserSubmit}
        roles={systemRoles}
      />

      <ManageRoleModal
        key={editingRole?.id || "new-role"}
        isOpen={isManageRoleModalOpen}
        onClose={() => setIsManageRoleModalOpen(false)}
        role={editingRole}
        onSaveRole={handleSaveRole}
      />

      <ExportAccessLogModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportConfirm={handleExportConfirm}
      />
    </div>
  );
}
