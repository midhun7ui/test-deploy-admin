import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";

function AdminSidebar({
  user,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  activeModule,
  onSelectModule,
  mobileOpen = false,
  onCloseMobile,
}) {
  const location = useLocation();
  const navContainerRef = useRef(null);

  // Preserve scroll position across page route transitions
  const handleNavScroll = (e) => {
    sessionStorage.setItem("admin_sidebar_scroll", String(e.target.scrollTop));
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_sidebar_scroll");
    if (navContainerRef.current) {
      if (saved !== null) {
        navContainerRef.current.scrollTop = Number(saved);
      }
      // Keep active item in visible viewport without jumping to top
      const activeEl = navContainerRef.current.querySelector(".sidebar-nav-link.active");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "auto" });
      }
    }
  }, [location.pathname]);

  const navSections = [
    {
      title: "OPERATIONS",
      items: [
        {
          id: "dashboard",
          label: "Operations Dashboard",
          path: "/dashboard",
          icon: "dashboard",
          badge: "Live",
          badgeType: "live",
        },
        {
          id: "enquiries",
          label: "Enquiries & CRM",
          path: "/enquiries",
          icon: "contact_support",
        },
        {
          id: "trips",
          label: "B2B Trips Control",
          path: "/trips",
          icon: "local_shipping",
        },
        {
          id: "orders",
          label: "Orders Management",
          path: "/orders",
          icon: "shopping_bag",
        },
        {
          id: "drivers",
          label: "Driver Management",
          path: "/drivers",
          icon: "badge",
        },
        {
          id: "companies",
          label: "Company Accounts",
          path: "/companies",
          icon: "domain",
        },
        {
          id: "vehicles",
          label: "Vehicle Management",
          path: "/vehicles",
          icon: "commute",
          badge: "Compliance",
          badgeType: "live",
        },
        {
          id: "support",
          label: "B2B Partner Support",
          path: "/support",
          icon: "support_agent",
          badge: "Live",
          badgeType: "live",
        },
      ],
    },
    {
      title: "FINANCE & SETTLEMENTS",
      items: [
        {
          id: "accounts-credit",
          label: "Accounts & Credit",
          path: "/accounts-credit",
          icon: "credit_card",
        },
        {
          id: "payouts",
          label: "Driver Payouts",
          path: "/payouts",
          icon: "account_balance_wallet",
        },
        {
          id: "invoicing",
          label: "Invoicing & Billing",
          path: "/invoicing",
          icon: "receipt_long",
        },
        {
          id: "statements",
          label: "Statements",
          path: "/statements",
          icon: "description",
        },
      ],
    },
    {
      title: "INTELLIGENCE",
      items: [
        {
          id: "reports",
          label: "Operational Reports",
          path: "/reports",
          icon: "analytics",
        },
        {
          id: "analytics",
          label: "Performance Analytics",
          path: "/analytics",
          icon: "monitoring",
        },
      ],
    },
    {
      title: "SYSTEM ADMINISTRATION",
      items: [
        {
          id: "notifications",
          label: "Notification Center",
          path: "/notifications",
          icon: "notifications",
        },
        {
          id: "admin-users",
          label: "Admin Users & Roles",
          path: "/admin-users",
          icon: "manage_accounts",
        },
        {
          id: "audit-logs",
          label: "Audit Trail",
          path: "/audit-logs",
          icon: "shield",
        },
        {
          id: "settings",
          label: "System Settings",
          path: "/settings",
          icon: "settings",
        },
      ],
    },
  ];

  return (
    <aside
      className={`admin-features-sidebar ${isCollapsed ? "collapsed" : ""} ${
        mobileOpen ? "mobile-open" : ""
      }`}
      id="admin-sidebar"
      aria-label="Features navigation bar"
    >
      {/* Brand Header */}
      <div className="sidebar-brand-wrapper">
        <div className="brand-logo-cluster">
          <div className="sidebar-brand-emblem-pod">
            <img
              src="/logo-blended.svg"
              alt="HireD Logo"
              className="sidebar-brand-logo"
              onError={(e) => {
                // fallback to transparent png if svg fails
                e.target.src = "/logo-transparent.png";
              }}
            />
          </div>
          {!isCollapsed && (
            <div className="brand-titles">
              <span className="brand-primary-name">HireD Ops</span>
              <span className="brand-portal-tag">Enterprise Admin</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="sidebar-collapse-toggle"
          id="btn-sidebar-collapse"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined">
            {isCollapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>
      </div>

      {/* Navigation Sections */}
      <nav
        ref={navContainerRef}
        onScroll={handleNavScroll}
        className="sidebar-navigation-container"
        aria-label="Portal features"
      >
        {navSections.map((section) => (
          <div key={section.title} className="sidebar-nav-group">
            {!isCollapsed && (
              <p className="sidebar-group-heading">{section.title}</p>
            )}

            <div className="sidebar-items-list">
              {section.items.map((item) => {
                const isItemActive =
                  location.pathname === item.path ||
                  (item.path !== "/dashboard" && location.pathname.startsWith(item.path)) ||
                  (item.path === "/dashboard" && location.pathname === "/") ||
                  activeModule === item.id;

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={`sidebar-nav-link ${
                      isItemActive ? "active" : ""
                    }`}
                    onClick={(e) => {
                      if (navContainerRef.current) {
                        sessionStorage.setItem("admin_sidebar_scroll", String(navContainerRef.current.scrollTop));
                      }
                      const routedPaths = [
                        "/dashboard",
                        "/enquiries",
                        "/trips",
                        "/orders",
                        "/drivers",
                        "/companies",
                        "/vehicles",
                        "/support",
                        "/accounts-credit",
                        "/payouts",
                        "/invoicing",
                        "/statements",
                        "/reports",
                        "/analytics",
                        "/notifications",
                        "/admin-users",
                        "/audit-logs",
                        "/settings",
                      ];
                      if (!routedPaths.includes(item.path)) {
                        e.preventDefault();
                        onSelectModule?.(item.id, item.label);
                      }
                      onCloseMobile?.();
                    }}
                    title={isCollapsed ? item.label : undefined}
                    id={`nav-link-${item.id}`}
                  >
                    <span className="sidebar-nav-icon-box">
                      <span className="material-symbols-outlined sidebar-icon">
                        {item.icon}
                      </span>
                    </span>

                    {!isCollapsed && (
                      <span className="sidebar-nav-label">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`sidebar-counter-badge badge-${item.badgeType || "neutral"}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer User Card */}
      <div className="sidebar-footer-user-section">
        <div className="sidebar-user-pill">
          <div className="user-avatar-circle">
            <span className="material-symbols-outlined">shield_person</span>
          </div>

          {!isCollapsed && (
            <div className="sidebar-user-meta">
              <strong className="sidebar-user-name">
                {user?.username || user?.email?.split("@")[0] || "Administrator"}
              </strong>
              <span className="sidebar-role-indicator">
                {user?.role?.toUpperCase() || "SUPER ADMIN"}
              </span>
            </div>
          )}

          <button
            type="button"
            className="sidebar-quick-logout"
            id="btn-sidebar-logout"
            onClick={onLogout}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

AdminSidebar.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func.isRequired,
  activeModule: PropTypes.string,
  onSelectModule: PropTypes.func,
  mobileOpen: PropTypes.bool,
  onCloseMobile: PropTypes.func,
};

export default AdminSidebar;
