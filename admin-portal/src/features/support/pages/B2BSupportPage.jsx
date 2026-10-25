import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import { supportAdminApi } from "../services/supportAdminApi";

// Layout Shell
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";

// Support Components
import SupportKPIStats from "../components/SupportKPIStats";
import SupportFilterToolbar from "../components/SupportFilterToolbar";
import SupportTicketsTable from "../components/SupportTicketsTable";
import TicketInspectorDrawer from "../components/TicketInspectorDrawer";
import TicketResolutionModal from "../components/TicketResolutionModal";

// Styles
import "../styles/b2bSupport.css";

function B2BSupportPage() {
  const navigate = useNavigate();
  const { ticketId: routeTicketId } = useParams();
  const user = getCurrentUser();

  // Shell Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Tickets & Stats Data
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoSync, setAutoSync] = useState(true);

  // Inspector & Modal State
  const [inspectingTicketId, setInspectingTicketId] = useState(routeTicketId || null);
  const [resolvingTicket, setResolvingTicket] = useState(null);
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);

  const pollingRef = useRef(null);

  // Sync route param with inspectingTicketId
  useEffect(() => {
    if (routeTicketId) {
      setInspectingTicketId(routeTicketId);
    }
  }, [routeTicketId]);

  // Fetch Tickets & Stats from backend
  const fetchTickets = useCallback(
    async (showToast = false, silent = false) => {
      try {
        if (!silent) setIsRefreshing(true);
        const data = await supportAdminApi.getTickets({
          status: statusFilter,
          category: categoryFilter,
          priority: priorityFilter,
          search: searchQuery,
        });

        if (data && Array.isArray(data.tickets)) {
          setTickets(data.tickets);
          if (data.stats) {
            setStats(data.stats);
          }
        } else if (Array.isArray(data)) {
          setTickets(data);
        }

        if (showToast) {
          setToast({
            title: "Support Desk Synchronized",
            message: "Fetched latest partner tickets and resolution threads.",
            type: "success",
          });
        }
      } catch (err) {
        console.warn("Could not fetch support tickets from backend:", err);
        if (showToast) {
          setToast({
            title: "Connection Error",
            message: "Unable to reach server. Please check your network connection.",
            type: "error",
          });
        }
      } finally {
        if (!silent) {
          setIsRefreshing(false);
          setLoading(false);
        }
      }
    },
    [statusFilter, categoryFilter, priorityFilter, searchQuery]
  );

  // Initial fetch and on filter changes
  useEffect(() => {
    fetchTickets(false, false);
  }, [fetchTickets]);

  // Live Auto-Sync: Poll every 10 seconds if enabled and page is visible
  useEffect(() => {
    if (!autoSync) return;

    pollingRef.current = setInterval(() => {
      if (!document.hidden) {
        fetchTickets(false, true);
      }
    }, 10000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [autoSync, fetchTickets]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      clearCurrentUser();
      navigate("/login");
    }
  };

  // Open ticket inspector
  const handleInspectTicket = (ticket) => {
    setInspectingTicketId(ticket.id);
  };

  // Close ticket inspector
  const handleCloseInspector = () => {
    setInspectingTicketId(null);
    if (routeTicketId) {
      navigate("/support");
    }
  };

  // Open quick resolution modal
  const handleOpenResolveModal = (ticket) => {
    setResolvingTicket(ticket);
  };

  // Confirm resolution from modal
  const handleConfirmResolution = async ({ ticketId, status, resolutionNote }) => {
    try {
      setIsSubmittingResolution(true);
      const updated = await supportAdminApi.updateStatus(ticketId, status, resolutionNote);

      setTickets((prev) =>
        prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
      );

      setToast({
        title: "Ticket Problem Resolved",
        message: `Ticket ${ticketId} marked as ${status}. Notification dispatched to partner.`,
        type: "success",
      });

      setResolvingTicket(null);

      // Re-fetch tickets & stats to keep counts 100% accurate
      fetchTickets(false, true);
    } catch (err) {
      setToast({
        title: "Resolution Failed",
        message: err?.response?.data?.detail || "Could not resolve ticket.",
        type: "error",
      });
    } finally {
      setIsSubmittingResolution(false);
    }
  };

  // Ticket updated callback from drawer
  const handleTicketUpdated = (updated) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
    );
    // Refresh stats
    fetchTickets(false, true);
  };

  return (
    <div className="admin-operations-shell" id="admin-support-app">
      {/* Toast Feedback */}
      {toast && (
        <ToastNotification
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Main Admin Sidebar */}
      <AdminSidebar
        user={user}
        activeModule="support"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className={`admin-main-viewport ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Navbar */}
        <AdminNavbar
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          breadcrumbCurrent="B2B Partner Support"
        />

        <main className="b2b-support-content">
          {/* Header */}
          <div className="b2b-support-header">
            <div className="b2b-support-title-cluster">
              <div className="b2b-support-badge-row">
                <span className="b2b-support-eyebrow">OPERATIONS DESK</span>
                <span className="b2b-support-live-indicator">
                  <span className="b2b-support-pulse-dot" />
                  Live Sync Active
                </span>
              </div>
              <h1 className="b2b-support-main-title">B2B Partner Support &amp; Problem Resolution</h1>
              <p className="b2b-support-sub-title">
                Review, investigate, reply, and resolve issues raised by enterprise partners via the B2B portal.
              </p>
            </div>

            <div className="b2b-support-header-actions">
              <button
                type="button"
                className="b2b-support-sync-btn"
                onClick={() => fetchTickets(true, false)}
                disabled={isRefreshing}
              >
                <span className={`material-symbols-outlined b2b-support-sync-icon ${isRefreshing ? "spinning" : ""}`} style={{ fontSize: "1rem" }}>
                  refresh
                </span>
                <span>{isRefreshing ? "Synchronizing..." : "Sync Live Stream"}</span>
              </button>
            </div>
          </div>

          {/* KPI Stats Grid */}
          <SupportKPIStats
            stats={stats}
            activeStatusFilter={statusFilter}
            onSelectStatusFilter={(newFilter) => setStatusFilter(newFilter)}
          />

          {/* Filter and Search Controls Toolbar */}
          <SupportFilterToolbar
            statusFilter={statusFilter}
            onStatusChange={(val) => setStatusFilter(val)}
            categoryFilter={categoryFilter}
            onCategoryChange={(val) => setCategoryFilter(val)}
            priorityFilter={priorityFilter}
            onPriorityChange={(val) => setPriorityFilter(val)}
            searchQuery={searchQuery}
            onSearchChange={(val) => setSearchQuery(val)}
            autoSync={autoSync}
            onToggleAutoSync={(val) => setAutoSync(val)}
            isRefreshing={isRefreshing}
            onRefresh={() => fetchTickets(true, false)}
            stats={stats}
          />

          {/* Tickets Data Table */}
          <SupportTicketsTable
            tickets={tickets}
            loading={loading}
            onInspect={handleInspectTicket}
            onResolve={handleOpenResolveModal}
          />
        </main>
      </div>

      {/* Ticket Inspector Slide-Over Drawer */}
      <TicketInspectorDrawer
        ticketId={inspectingTicketId}
        isOpen={Boolean(inspectingTicketId)}
        onClose={handleCloseInspector}
        onTicketUpdated={handleTicketUpdated}
        onOpenResolveModal={handleOpenResolveModal}
      />

      {/* Quick Problem Resolution Modal */}
      <TicketResolutionModal
        ticket={resolvingTicket}
        isOpen={Boolean(resolvingTicket)}
        onClose={() => setResolvingTicket(null)}
        onConfirm={handleConfirmResolution}
        isSubmitting={isSubmittingResolution}
      />
    </div>
  );
}

export default B2BSupportPage;
