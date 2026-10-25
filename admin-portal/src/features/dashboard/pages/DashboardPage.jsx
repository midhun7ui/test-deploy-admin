import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import { EMPTY_DASHBOARD_DATA, INITIAL_DASHBOARD_DATA } from "../data/mockDashboardData";
import { dashboardApi } from "../services/dashboardApi";

// Components
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import DashboardHeader from "../components/DashboardHeader";
import OperationsStats from "../components/OperationsStats";
import RevenueBillingSummary from "../components/RevenueBillingSummary";
import DriverPayoutSummary from "../components/DriverPayoutSummary";
import RecentActivities from "../components/RecentActivities";
import ActiveTripsTable from "../components/ActiveTripsTable";
import PendingOrdersQueue from "../components/PendingOrdersQueue";
import CommandPaletteModal from "../components/CommandPaletteModal";
import QuickDispatchModal from "../components/QuickDispatchModal";
import DetailModal from "../components/DetailModal";
import ToastNotification from "../components/ToastNotification";
import AcceptOrderModal from "../../orders/components/AcceptOrderModal";
import "../../orders/styles/orders.css";

function DashboardPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Primary operational state
  const [dashboardData, setDashboardData] = useState(() => INITIAL_DASHBOARD_DATA);
  const [activePeriod, setActivePeriod] = useState("month");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedText, setLastUpdatedText] = useState("Updated just now");

  // UI Navigation & Layout state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState("dashboard");

  // Overlays state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickDispatchOpen, setQuickDispatchOpen] = useState(false);
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    data: null,
    type: null,
  });
  const [acceptModalOrder, setAcceptModalOrder] = useState(null);
  const [toast, setToast] = useState(null);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch live dashboard metrics from REST backend
  const fetchDashboardData = useCallback(async (period, showToast = false) => {
    try {
      setIsRefreshing(true);
      const data = await dashboardApi.getDashboardSummary(period);
      if (data && typeof data === "object") {
        setDashboardData({
          ...EMPTY_DASHBOARD_DATA,
          ...data,
          systemNotifications: data.systemNotifications || [],
        });
        setLastUpdatedText("Updated just now");
        if (showToast) {
          setToast({
            title: "Telemetry Refreshed",
            message: `Synchronized operational metrics for period: ${period}.`,
            type: "success",
          });
        }
      }
    } catch (err) {
      console.warn("Could not sync with live operations API, using cached state:", err?.message || err);
      if (showToast) {
        setToast({
          title: "Sync Notice",
          message: "Could not reach remote telemetry server. Operating in offline/cached mode.",
          type: "warning",
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Sync on component mount & when period filter changes
  useEffect(() => {
    fetchDashboardData(activePeriod, false);
  }, [activePeriod, fetchDashboardData]);

  // Logout handler
  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Clean up even if network error
    } finally {
      clearCurrentUser();
      navigate("/", { replace: true });
    }
  }

  // Periodic telemetry refresh handler
  function handleRefresh() {
    fetchDashboardData(activePeriod, true);
  }

  // Time period filter handler
  function handleChangePeriod(periodId) {
    setActivePeriod(periodId);
    let labelText = "This Month (Oct 2026)";

    if (periodId === "today") {
      labelText = "Today";
    } else if (periodId === "week") {
      labelText = "This Week";
    } else if (periodId === "quarter") {
      labelText = "Q3 Fiscal";
    }

    setToast({
      title: "Filter Applied",
      message: `Operational dashboard metrics adjusted for: ${labelText}`,
      type: "info",
    });
  }

  // Order review queue actions - open modal with explicit driver assignment
  function handleAcceptOrder(order) {
    setAcceptModalOrder(order);
  }

  async function handleConfirmAccept({ orderId, driver, departureSchedule, opsRemarks }) {
    try {
      const orderIdentifier = orderId || acceptModalOrder?.id;
      const cleanId = String(orderIdentifier).replace("ORD-", "").trim();
      const result = await dashboardApi.acceptOrder(cleanId, {
        driver: { id: driver.id, name: driver.name },
        driver_id: driver.id,
        departureSchedule,
        opsRemarks,
        notes: opsRemarks || "Accepted via Operations Dashboard review queue",
      });

      setAcceptModalOrder(null);
      setToast({
        title: "Order Accepted & Dispatched",
        message: `Order #${orderIdentifier} accepted and dispatched with driver ${driver.name}!`,
        type: "success",
      });

      fetchDashboardData(activePeriod, false);
      window.dispatchEvent(new CustomEvent("orders_updated"));
    } catch (err) {
      console.error("Order acceptance error:", err);
      setToast({
        title: "Acceptance Notice",
        message: err.response?.data?.error || err.response?.data?.detail || "Could not process order acceptance on server.",
        type: "error",
      });
    }
  }

  async function handleRejectOrder(order) {
    try {
      const orderIdentifier = order.id || order.order_number;
      await dashboardApi.rejectOrder(orderIdentifier, {
        reason: "Declined by operations due to corridor capacity constraints.",
      });

      setDashboardData((prev) => {
        const updatedQueue = prev.pendingOrdersQueue.filter((o) => o.id !== order.id);
        const currentPending = Math.max(0, (prev.kpiStats?.pendingOrders?.numericValue || 1) - 1);

        const rejectActivity = {
          id: `act-${Date.now()}`,
          category: "order",
          title: "Order Quote Declined",
          description: `${order.id} for ${order.partner} was rejected due to corridor capacity constraints.`,
          timestamp: "Just now",
          relativeMinutes: 0,
          severity: "warning",
          icon: "cancel",
          entityCode: order.id,
          badge: "Declined",
        };

        return {
          ...prev,
          pendingOrdersQueue: updatedQueue,
          recentActivities: [rejectActivity, ...(prev.recentActivities || [])],
          kpiStats: {
            ...prev.kpiStats,
            pendingOrders: {
              ...prev.kpiStats?.pendingOrders,
              value: currentPending.toString(),
              numericValue: currentPending,
            },
          },
        };
      });

      setToast({
        title: "Order Declined",
        message: `${order.id} marked as rejected. Notified ${order.partner}.`,
        type: "warning",
      });
    } catch (err) {
      console.error("Order rejection error:", err);
      setToast({
        title: "Rejection Notice",
        message: err.response?.data?.error || err.response?.data?.detail || "Could not process order rejection on server.",
        type: "warning",
      });
    }
  }

  // Activity modal inspection
  function handleActivityClick(activity) {
    setDetailModal({
      isOpen: true,
      data: activity,
      type: "activity",
    });
  }

  // Trip tracking inspection
  function handleTrackTrip(trip) {
    setDetailModal({
      isOpen: true,
      data: trip,
      type: "trip",
    });
  }

  // Stat card click: navigate directly to target module
  function handleStatClick(statKey) {
    switch (statKey) {
      case "totalOrders":
        navigate("/orders");
        break;
      case "pendingOrders":
        navigate("/orders?status=Pending");
        break;
      case "activeTrips":
        navigate("/trips?status=Ongoing");
        break;
      case "completedTrips":
        navigate("/trips?status=Closed");
        break;
      case "availableDrivers":
        navigate("/drivers?status=available");
        break;
      case "busyDrivers":
        navigate("/drivers?status=on_trip");
        break;
      case "pendingDriverOnboarding":
        navigate("/drivers?status=pending");
        break;
      default:
        navigate("/dashboard");
    }
  }

  // Financial actions
  function handleExportBilling() {
    const summary = dashboardData.revenueBillingSummary;
    const categoryRows = (summary?.categories && summary.categories.length > 0)
      ? summary.categories.map((c) => [c.label, `${c.percentage}%`, c.amount])
      : [["No corridor revenue recorded", "0%", "₹0"]];

    const rows = [
      ["HireD Enterprise Logistics - B2B Invoicing & GST Ledger"],
      ["Billing Period", summary?.billingPeriod || activePeriod],
      ["Gross Revenue", summary?.monthlyRevenue || "₹0"],
      ["Total Invoiced", summary?.totalBilled || "₹0"],
      ["Collected", summary?.totalCollected || "₹0"],
      ["Outstanding Receivables", summary?.outstandingReceivables || "₹0"],
      ["Projected Month-End", summary?.projectedEndMonth || "₹0"],
      [],
      ["Corridor Segment", "Share Percentage", "Total Volume"],
      ...categoryRows,
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hired_invoicing_ledger_${activePeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      title: "Export Completed",
      message: `Downloaded B2B Invoicing & GST ledger spreadsheet for ${activePeriod}.`,
      type: "success",
    });
  }

  function handleViewLedger() {
    navigate("/invoicing");
  }

  function handleReviewPayoutBatch() {
    navigate("/payouts");
  }

  function handleViewPayoutHistory() {
    navigate("/payouts");
  }

  function handleViewAllTrips() {
    navigate("/trips");
  }

  function handleViewAllOrders() {
    navigate("/orders");
  }

  function handleViewAllAudit() {
    navigate("/audit-logs");
  }

  // Quick Load Dispatch Callback
  function handleQuickDispatchSuccess(data) {
    const newTrip = {
      id: data.tripId || `TRP-${Math.floor(1000 + Math.random() * 9000)}`,
      partner: data.client,
      route: data.corridor,
      distance: "380 km",
      driverName: data.driver,
      driverPhone: "+91 98450 11928",
      vehicleNo: data.vehicle,
      vehicleType: data.vehicleType || "Multi-Axle Commercial",
      cargo: data.cargo || "Enterprise General Freight",
      eta: "Tomorrow, 08:30 AM",
      progressPct: 15,
      status: "Dispatched",
      slaStatus: "healthy",
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      category: "trip",
      title: "Quick Load Dispatched",
      description: `${data.client} load dispatched to driver ${data.driver} (${data.vehicle}) on ${data.corridor}.`,
      timestamp: "Just now",
      relativeMinutes: 0,
      severity: "success",
      icon: "local_shipping",
      entityCode: newTrip.id,
      badge: "Dispatched",
    };

    setDashboardData((prev) => ({
      ...prev,
      activeTripsCorridor: [newTrip, ...(prev.activeTripsCorridor || [])],
      recentActivities: [newActivity, ...(prev.recentActivities || [])],
      kpiStats: {
        ...prev.kpiStats,
        activeTrips: {
          ...prev.kpiStats?.activeTrips,
          numericValue: (prev.kpiStats?.activeTrips?.numericValue || 0) + 1,
          value: ((prev.kpiStats?.activeTrips?.numericValue || 0) + 1).toString(),
        },
        busyDrivers: {
          ...prev.kpiStats?.busyDrivers,
          numericValue: (prev.kpiStats?.busyDrivers?.numericValue || 0) + 1,
          value: ((prev.kpiStats?.busyDrivers?.numericValue || 0) + 1).toString(),
        },
        availableDrivers: {
          ...prev.kpiStats?.availableDrivers,
          numericValue: Math.max(0, (prev.kpiStats?.availableDrivers?.numericValue || 1) - 1),
          value: Math.max(0, (prev.kpiStats?.availableDrivers?.numericValue || 1) - 1).toString(),
        },
      },
    }));

    setToast({
      title: "Load Dispatched Successfully",
      message: `${newTrip.id} allocated to ${data.driver} (${data.vehicle}) on ${data.corridor}. Route telemetry activated.`,
      type: "success",
    });
  }

  // Command palette selection
  function handleCommandSelect(action) {
    switch (action.id) {
      case "cmd-dash":
        navigate("/dashboard");
        break;
      case "cmd-orders":
        navigate("/orders");
        break;
      case "cmd-trips":
        navigate("/trips");
        break;
      case "cmd-drivers":
        navigate("/drivers");
        break;
      case "cmd-vehicles":
        navigate("/vehicles");
        break;
      case "cmd-support":
        navigate("/support");
        break;
      case "cmd-payouts":
        navigate("/payouts");
        break;
      case "cmd-invoices":
        navigate("/invoicing");
        break;
      case "cmd-quick-order":
        setQuickDispatchOpen(true);
        break;
      case "cmd-onboard-driver":
        navigate("/drivers?status=pending");
        break;
      default:
        setToast({
          title: action.title,
          message: action.subtitle,
          type: "info",
        });
    }
  }

  const unreadNotifsCount = dashboardData.systemNotifications.filter(
    (n) => n.unread
  ).length;

  return (
    <div className="admin-operations-shell" id="admin-dashboard-app">
      {/* Toast Alert Feedback */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Side Features Bar */}
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeModule={activeModule}
        onSelectModule={(id) => {
          setActiveModule(id);
          const path = id === "dashboard" ? "/dashboard" : `/${id}`;
          navigate(path);
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Right Content Layout */}
      <div className={`admin-main-viewport ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Navbar */}
        <AdminNavbar
          user={user}
          onLogout={handleLogout}
          unreadCount={unreadNotifsCount}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onQuickAction={() => setQuickDispatchOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable Dashboard Workspace */}
        <main className="dashboard-content-scroll" id="main-content">
          <div className="dashboard-content-inner">
            {/* 1. Header Banner */}
            <DashboardHeader
              activePeriod={activePeriod}
              onChangePeriod={handleChangePeriod}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              lastUpdatedText={lastUpdatedText}
            />

            {/* 2. Operations KPI Stats */}
            <OperationsStats
              stats={dashboardData.kpiStats}
              onStatClick={handleStatClick}
            />

            {/* 3. Financial & Payout Summaries */}
            <section className="financial-summaries-grid" aria-label="Financial and Settlements Overview">
              <RevenueBillingSummary
                summary={dashboardData.revenueBillingSummary}
                onExport={handleExportBilling}
                onViewLedger={handleViewLedger}
              />

              <DriverPayoutSummary
                payoutData={dashboardData.driverPayoutSummary}
                onReviewBatch={handleReviewPayoutBatch}
                onViewHistory={handleViewPayoutHistory}
              />
            </section>

            {/* 4. Live Corridor Monitoring & Pending Orders Review Queue */}
            <section className="corridors-and-queue-grid" aria-label="Live Corridors & Pending Queue">
              <ActiveTripsTable
                trips={dashboardData.activeTripsCorridor}
                onTrackTrip={handleTrackTrip}
                onViewAllTrips={handleViewAllTrips}
              />

              <PendingOrdersQueue
                orders={dashboardData.pendingOrdersQueue}
                onAcceptOrder={handleAcceptOrder}
                onRejectOrder={handleRejectOrder}
                onViewAllOrders={handleViewAllOrders}
              />
            </section>

            {/* 5. Recent Activities Feed */}
            <RecentActivities
              activities={dashboardData.recentActivities}
              onActivityClick={handleActivityClick}
              onViewAll={handleViewAllAudit}
            />
          </div>
        </main>
      </div>

      {/* Quick Dispatch Modal */}
      <QuickDispatchModal
        isOpen={quickDispatchOpen}
        onClose={() => setQuickDispatchOpen(false)}
        onDispatchSuccess={handleQuickDispatchSuccess}
      />

      {/* Command Palette Modal (Ctrl + K) */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectAction={handleCommandSelect}
      />

      {/* Details View Modal */}
      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null, type: null })}
        data={detailModal.data}
        type={detailModal.type}
      />

      {/* Accept Order & Allocate Driver Modal */}
      <AcceptOrderModal
        isOpen={Boolean(acceptModalOrder)}
        order={acceptModalOrder}
        onClose={() => setAcceptModalOrder(null)}
        onConfirmAccept={handleConfirmAccept}
      />
    </div>
  );
}

export default DashboardPage;
