import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import NotificationDrawer from "./NotificationDrawer";
import QuickDispatchModal from "./QuickDispatchModal";
import ToastNotification from "./ToastNotification";

const ROUTE_BREADCRUMBS = {
  "/": "Operations Dashboard",
  "/dashboard": "Operations Dashboard",
  "/enquiries": "Enquiries & CRM",
  "/trips": "B2B Trips Control",
  "/orders": "Orders Management",
  "/drivers": "Driver Management",
  "/companies": "Company Accounts",
  "/vehicles": "Vehicle Management",
  "/support": "B2B Partner Support",
  "/accounts-credit": "Accounts & Credit",
  "/payouts": "Driver Payouts",
  "/invoicing": "Invoicing & Billing",
  "/statements": "Statements",
  "/reports": "Operational Reports",
  "/analytics": "Performance Analytics",
  "/notifications": "Notification Center",
  "/admin-users": "Admin Users & Roles",
  "/audit-logs": "Audit Trail",
  "/settings": "System Settings",
};

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Driver KYC Alert",
    text: "3 new commercial driver licenses uploaded for KYC review",
    time: "10m ago",
    unread: true,
    type: "driver",
  },
  {
    id: "notif-2",
    title: "High Value Order",
    text: "Nexus Logistics booked ₹64,500 FTL Mumbai → Ahmedabad run",
    time: "25m ago",
    unread: true,
    type: "order",
  },
  {
    id: "notif-3",
    title: "Weekly Payout Batch Ready",
    text: "Batch BATCH-OCT-W2 (₹38.4L) awaiting controller sign-off",
    time: "1h ago",
    unread: true,
    type: "finance",
  },
  {
    id: "notif-4",
    title: "System Health",
    text: "Django DRF REST cluster operating nominally (Lat: 42ms)",
    time: "2h ago",
    unread: false,
    type: "system",
  },
];

function AdminNavbar({
  user,
  onLogout,
  onOpenNotifications,
  onOpenNotificationDrawer,
  unreadCount = 4,
  onOpenSearch,
  onQuickAction,
  onToggleSidebar,
  breadcrumbCurrent = "Dashboard",
}) {
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);
  const [quickDispatchOpen, setQuickDispatchOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    user?.username || user?.name || user?.email?.split("@")[0] || "Admin Operations";
  const userInitials =
    displayName.substring(0, 2).toUpperCase() || "AD";

  // Derive current breadcrumb label: explicit override if not default, else route-based
  const currentPath = location.pathname.toLowerCase();
  const matchedRouteBreadcrumb = ROUTE_BREADCRUMBS[currentPath];
  const activeBreadcrumb =
    (breadcrumbCurrent && breadcrumbCurrent !== "Dashboard")
      ? breadcrumbCurrent
      : matchedRouteBreadcrumb || breadcrumbCurrent || "Dashboard";

  const effectiveUnread = notifications.filter((n) => n.unread).length;

  function handleNotificationClick() {
    setInternalDrawerOpen((prev) => !prev);
    const notifyHandler = onOpenNotifications || onOpenNotificationDrawer;
    if (typeof notifyHandler === "function") {
      notifyHandler();
    }
  }

  function handleQuickDispatchClick() {
    setQuickDispatchOpen(true);
    if (typeof onQuickAction === "function") {
      onQuickAction();
    }
  }

  function handleDispatchSuccess(data) {
    setToast({
      title: "Load Dispatched Successfully",
      message: `${data.tripId} allocated to ${data.driver} (${data.vehicle}) on ${data.corridor}. Route telemetry activated.`,
      type: "success",
    });
  }

  return (
    <>
      <header className="admin-top-navbar" id="admin-navbar">
        {/* Left Area: Mobile Drawer Toggle & Breadcrumbs */}
        <div className="navbar-left-area">
          <button
            type="button"
            className="mobile-sidebar-toggle"
            id="btn-mobile-sidebar-toggle"
            onClick={onToggleSidebar}
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="navbar-breadcrumb-cluster">
            <Link to="/dashboard" className="breadcrumb-root" title="Go to Operations Dashboard">
              Operations Control
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{activeBreadcrumb}</span>
          </div>

          {/* Live Backend Connection Indicator */}
          <div className="backend-live-indicator" title="Connected to Django REST Framework backend">
            <span className="pulse-green-dot" />
            <span className="indicator-label">Backend: Connected</span>
          </div>
        </div>

        {/* Center Area: Global Search Box / Command Trigger */}
        <div className="navbar-center-area">
          <button
            type="button"
            className="navbar-search-trigger"
            id="btn-navbar-search"
            onClick={onOpenSearch}
            title="Press Ctrl+K to search"
          >
            <span className="material-symbols-outlined search-icon">search</span>
            <span className="search-placeholder-text">
              Search orders, active trips, drivers, companies...
            </span>
            <kbd className="search-shortcut-badge">Ctrl K</kbd>
          </button>
        </div>

        {/* Right Area: Actions, Notifications & Profile */}
        <div className="navbar-right-area">
          {/* Quick Action Button */}
          <button
            type="button"
            className="nav-quick-action-btn"
            id="btn-nav-quick-dispatch"
            onClick={handleQuickDispatchClick}
            title="Immediate Corridor Load Dispatch"
          >
            <span className="material-symbols-outlined action-plus-icon">add</span>
            <span>Quick Dispatch</span>
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            className="nav-icon-button"
            id="btn-nav-notifications"
            onClick={handleNotificationClick}
            title="Notifications & System Alerts"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {effectiveUnread > 0 && (
              <span className="notification-badge-count">{effectiveUnread}</span>
            )}
          </button>

          <div className="navbar-vertical-divider" />

          {/* Profile Pill & Dropdown */}
          <div className="navbar-profile-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className="navbar-profile-button"
              id="btn-nav-profile"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              aria-expanded={profileDropdownOpen}
            >
              <div className="profile-avatar-circle">
                <span>{userInitials}</span>
              </div>

              <div className="profile-text-group">
                <strong className="profile-display-name">{displayName}</strong>
                <span className="profile-role-tag">{user?.role || "ADMIN"}</span>
              </div>

              <span className="material-symbols-outlined chevron-icon">
                {profileDropdownOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="profile-dropdown-card">
                <div className="dropdown-user-header">
                  <div className="large-avatar-circle">{userInitials}</div>
                  <div>
                    <strong className="dropdown-user-name">{displayName}</strong>
                    <span className="dropdown-user-email">
                      {user?.email || "admin@hired.co"}
                    </span>
                  </div>
                </div>

                <div className="dropdown-menu-list">
                  <div className="dropdown-info-item">
                    <span className="info-key">Role:</span>
                    <span className="info-val role-pill">{user?.role || "admin"}</span>
                  </div>
                  <div className="dropdown-info-item">
                    <span className="info-key">Backend URL:</span>
                    <span className="info-val">http://127.0.0.1:8000</span>
                  </div>
                  <div className="dropdown-info-item">
                    <span className="info-key">Session:</span>
                    <span className="info-val verified-val">JWT Active</span>
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="dropdown-action-btn logout-action"
                    id="btn-dropdown-logout"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout?.();
                    }}
                  >
                    <span className="material-symbols-outlined">logout</span>
                    <span>Sign Out of Ops Console</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Internal Guaranteed Notification Drawer */}
      <NotificationDrawer
        isOpen={internalDrawerOpen}
        onClose={() => setInternalDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
          setToast({
            title: "Notifications Cleared",
            message: "All operational alerts marked as read.",
            type: "info",
          });
        }}
        onNotificationClick={(notif) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
          );
          setToast({
            title: notif.title,
            message: notif.text,
            type: notif.type === "driver" ? "warning" : "info",
          });
        }}
      />

      {/* Universal Quick Dispatch Modal */}
      <QuickDispatchModal
        isOpen={quickDispatchOpen}
        onClose={() => setQuickDispatchOpen(false)}
        onDispatchSuccess={handleDispatchSuccess}
      />

      {/* Universal Toast Notifications */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </>
  );
}

AdminNavbar.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  onOpenNotifications: PropTypes.func,
  onOpenNotificationDrawer: PropTypes.func,
  unreadCount: PropTypes.number,
  onOpenSearch: PropTypes.func,
  onQuickAction: PropTypes.func,
  onToggleSidebar: PropTypes.func,
  breadcrumbCurrent: PropTypes.string,
};

export default AdminNavbar;
