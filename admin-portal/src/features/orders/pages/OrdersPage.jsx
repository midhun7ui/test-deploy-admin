import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import {
  INITIAL_ORDERS_DATA,
  computeOrderStats,
  computeOrderTabCounts,
} from "../data/mockOrdersData";

// API Service
import { ordersApi } from "../services/ordersApi";

// Layout & Dashboard components
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";

// Orders components
import OrderKPIStats from "../components/OrderKPIStats";
import OrderStatusTabs from "../components/OrderStatusTabs";
import OrdersRegisterTable from "../components/OrdersRegisterTable";
import OrderDetailPanel from "../components/OrderDetailPanel";
import AcceptOrderModal from "../components/AcceptOrderModal";
import RejectOrderModal from "../components/RejectOrderModal";
import CreateOrderModal from "../components/CreateOrderModal";

// Orders CSS
import "../styles/orders.css";

export default function OrdersPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Core Data State
  const [orders, setOrders] = useState(() => INITIAL_ORDERS_DATA);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [checkedOrderIds, setCheckedOrderIds] = useState([]);
  const [backendStats, setBackendStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filtering & Pagination State
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [timePeriod, setTimePeriod] = useState("month"); // 'all' | 'month'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Auto-Sync Timer State
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncCountdown, setSyncCountdown] = useState(30);

  // Modals & Drawers State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [acceptModalOrder, setAcceptModalOrder] = useState(null);
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch orders and stats from backend
  const fetchOrdersAndStats = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [ordersData, statsData] = await Promise.all([
        ordersApi.getOrders({ period: timePeriod }),
        ordersApi.getOrderStats(),
      ]);

      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
        setSelectedOrderId((prevId) => {
          if (prevId && ordersData.some((o) => o.id === prevId)) {
            return prevId;
          }
          return ordersData.length > 0 ? ordersData[0].id : "";
        });
      }

      if (statsData) {
        setBackendStats(statsData);
      }
    } catch (err) {
      console.error("Failed to fetch live orders from backend:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [timePeriod]);

  // Initial load and on period change
  useEffect(() => {
    fetchOrdersAndStats(true);
  }, [fetchOrdersAndStats]);

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

  // 30s Auto-Sync countdown timer effect
  useEffect(() => {
    if (!autoSyncEnabled) return;
    const interval = setInterval(() => {
      setSyncCountdown((prev) => {
        if (prev <= 1) {
          fetchOrdersAndStats(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoSyncEnabled, fetchOrdersAndStats]);

  // Compute live stats and tab counts (merge backend stats if available)
  const kpiStats = useMemo(() => {
    const computed = computeOrderStats(orders);
    if (backendStats) {
      return {
        ...computed,
        ...backendStats,
      };
    }
    return computed;
  }, [orders, backendStats]);

  const tabCounts = useMemo(() => {
    if (backendStats?.counts) {
      return backendStats.counts;
    }
    return computeOrderTabCounts(orders);
  }, [orders, backendStats]);

  // Filter orders according to activeTab, search query, and vehicleFilter
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Pipeline Tab Filter
      if (activeTab === "pending" && order.status !== "Pending Review") return false;
      if (activeTab === "accepted" && order.status !== "Accepted") return false;
      if (activeTab === "converted" && order.status !== "Converted to Trip") return false;
      if (activeTab === "rejected" && order.status !== "Rejected") return false;

      // 2. Vehicle Fleet Filter
      if (vehicleFilter !== "all" && order.vehicle?.category !== vehicleFilter) {
        return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase().replace("#", "");
        const matchId = (order.id || "").toLowerCase().includes(query);
        const matchCompany = (order.company || "").toLowerCase().includes(query);
        const matchOrigin = (order.route?.origin || "").toLowerCase().includes(query);
        const matchDest = (order.route?.destination || "").toLowerCase().includes(query);
        const matchCargo = (order.cargo?.title || "").toLowerCase().includes(query);

        if (!matchId && !matchCompany && !matchOrigin && !matchDest && !matchCargo) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, vehicleFilter, searchQuery]);

  // Paginated slice
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Get active selected order for the Inspector Panel
  const selectedOrder = useMemo(() => {
    if (!orders || orders.length === 0) return null;
    return orders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || orders[0] || null;
  }, [orders, selectedOrderId, filteredOrders]);

  // Filter change handlers that reset page to 1
  function handleTabChange(tab) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function handleSearchChange(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleVehicleFilterChange(vf) {
    setVehicleFilter(vf);
    setCurrentPage(1);
  }

  // Row selection handler
  function handleSelectOrder(orderId) {
    setSelectedOrderId(orderId);
  }

  // Row checkbox toggle
  function handleToggleCheckOrder(orderId) {
    setCheckedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  }

  // Select/Deselect all rows
  function handleToggleCheckAll() {
    const visibleIds = paginatedOrders.map((o) => o.id);
    const allVisibleChecked = visibleIds.length > 0 && visibleIds.every((id) => checkedOrderIds.includes(id));

    if (allVisibleChecked) {
      setCheckedOrderIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setCheckedOrderIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  }

  // KPI card click filter trigger
  function handleKpiFilterSelect(filterKey) {
    setActiveTab(filterKey);
    setCurrentPage(1);
  }

  // Export CSV handler
  function handleExportCSV() {
    const ordersToExport = checkedOrderIds.length > 0
      ? orders.filter((o) => checkedOrderIds.includes(o.id))
      : filteredOrders;

    const headers = [
      "Order ID",
      "Company",
      "Origin",
      "Destination",
      "Vehicle",
      "Cargo",
      "Amount (INR)",
      "Status",
      "Created At",
    ];

    const rows = ordersToExport.map((o) => [
      `"${o.id || ""}"`,
      `"${o.company || ""}"`,
      `"${o.route?.origin || ""}"`,
      `"${o.route?.destination || ""}"`,
      `"${o.vehicle?.type || ""}"`,
      `"${o.cargo?.title || ""}"`,
      `"${o.commercials?.amount || ""}"`,
      `"${o.status || ""}"`,
      `"${o.createdAt || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hired_orders_register_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      title: "Orders Register Exported",
      message: `Successfully downloaded ${ordersToExport.length} orders as CSV.`,
      type: "success",
    });
  }

  // Accept Order Trigger
  function handleOpenAcceptModal(order) {
    setAcceptModalOrder(order);
  }

  // Confirm Accept & Dispatch
  async function handleConfirmAccept({ orderId, driver, departureSchedule, opsRemarks }) {
    try {
      const res = await ordersApi.acceptOrder(orderId, {
        driver: { id: driver.id, name: driver.name },
        driver_id: driver.id,
        departureSchedule,
        opsRemarks,
      });

      const tripCode = res.trip_code || `TRP-${res.trip_id || "NEW"}`;

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status: "Converted to Trip",
              convertedTripId: tripCode,
              timeline: [
                ...(o.timeline || []),
                {
                  id: `t-${Date.now()}`,
                  title: `Order Accepted & Dispatched: Driver ${driver.name} assigned (${departureSchedule || "Scheduled"})`,
                  time: "Just now",
                  author: "Admin / Ops",
                },
              ],
            };
          }
          return o;
        })
      );

      setAcceptModalOrder(null);
      setToast({
        title: "Order Converted to Trip",
        message: `Order #${orderId} accepted and converted to Trip #${tripCode} with driver ${driver.name}.`,
        type: "success",
      });
      fetchOrdersAndStats(false);
      window.dispatchEvent(new CustomEvent("orders_updated"));
    } catch (err) {
      setToast({
        title: "Accept Order Failed",
        message: err.response?.data?.detail || err.message || "Failed to accept order.",
        type: "error",
      });
    }
  }

  // Reject Order Trigger
  function handleOpenRejectModal(order) {
    setRejectModalOrder(order);
  }

  // Confirm Reject
  async function handleConfirmReject({ orderId, reasonCode, remarks }) {
    try {
      await ordersApi.rejectOrder(orderId, { reasonCode, remarks });

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status: "Rejected",
              timeline: [
                ...(o.timeline || []),
                {
                  id: `t-${Date.now()}`,
                  title: `Order Rejected: ${remarks || reasonCode || "Fleet unavailable"}`,
                  time: "Just now",
                  author: "Admin / Ops",
                },
              ],
            };
          }
          return o;
        })
      );

      setRejectModalOrder(null);
      setToast({
        title: "Order Rejected",
        message: `Order #${orderId} has been marked as Rejected in the partner ledger.`,
        type: "info",
      });
      fetchOrdersAndStats(false);
      window.dispatchEvent(new CustomEvent("orders_updated"));
    } catch (err) {
      setToast({
        title: "Reject Order Failed",
        message: err.response?.data?.detail || err.message || "Failed to reject order.",
        type: "error",
      });
    }
  }

  // Create Order Handler
  async function handleCreateOrder(newOrderData) {
    try {
      const created = await ordersApi.createOrder(newOrderData);
      setOrders((prev) => [created, ...prev]);
      setSelectedOrderId(created.id);
      setCreateModalOpen(false);
      setToast({
        title: "Order Created Successfully",
        message: `New transport order #${created.id} booked for ${created.company}.`,
        type: "success",
      });
      fetchOrdersAndStats(false);
      window.dispatchEvent(new CustomEvent("order_created", { detail: created }));
      window.dispatchEvent(new CustomEvent("orders_updated"));
    } catch (err) {
      setToast({
        title: "Create Order Failed",
        message: err.response?.data?.detail || err.message || "Failed to create order.",
        type: "error",
      });
    }
  }

  // Add internal operations note
  async function handleAddNote(orderId, text) {
    try {
      const updated = await ordersApi.addNote(orderId, text);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setToast({
        title: "Note Added",
        message: `Internal operations note logged on Order #${orderId}.`,
        type: "info",
      });
    } catch (err) {
      setToast({
        title: "Failed to Add Note",
        message: err.response?.data?.error || err.message || "Could not log note.",
        type: "error",
      });
    }
  }

  // View connected trip in B2B Trips Control
  function handleViewTrip() {
    navigate("/trips");
    setToast({
      title: "Navigating to Live Corridor",
      message: "Opening live telemetry room for connected trip.",
      type: "info",
    });
  }

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

  return (
    <div className="orders-page-shell" id="orders-page-root">
      {/* Sidebar Navigation */}
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeModule="orders"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <div className={`orders-content-viewport ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Navbar */}
        <AdminNavbar
          user={user}
          onLogout={handleLogout}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          backendStatus={{ isHealthy: true, checkedAt: "Just now" }}
          breadcrumbCurrent="Orders Management"
          quickActionLabel="+ Create Order"
          onQuickAction={() => setCreateModalOpen(true)}
        />

        {/* Content Container */}
        <main className="orders-main-container">
          <div className="orders-page-wrapper">
            {/* 1. Header & Actions Row */}
            <div className="orders-header-row">
              <div className="orders-title-cluster">
                <div className="orders-h1-group">
                  <h1 className="orders-title">Orders</h1>
                  <span className="orders-live-pill">Live Feed</span>
                </div>
                <p className="orders-subtitle">
                  Manage, review and dispatch partner transport orders across active contracts
                </p>
              </div>

              <div className="orders-header-actions">
                {/* Time Range Toggle */}
                <div className="orders-time-toggle-group">
                  <button
                    type="button"
                    className={`orders-time-toggle-btn ${timePeriod === "all" ? "active" : ""}`}
                    onClick={() => setTimePeriod("all")}
                  >
                    All Time
                  </button>
                  <button
                    type="button"
                    className={`orders-time-toggle-btn ${timePeriod === "month" ? "active" : ""}`}
                    onClick={() => setTimePeriod("month")}
                  >
                    This Month
                  </button>
                </div>

                {/* Auto-Sync / Refresh Button */}
                <button
                  type="button"
                  className={`orders-btn-secondary ${autoSyncEnabled ? "bg-primary/5 text-primary" : ""}`}
                  onClick={() => {
                    fetchOrdersAndStats(false);
                    setSyncCountdown(30);
                  }}
                  title="Refresh live orders data"
                >
                  <span className={`material-symbols-outlined text-[18px] ${loading ? "animate-spin" : ""}`}>
                    refresh
                  </span>
                  <span>Auto-Sync ({syncCountdown}s)</span>
                </button>

                {/* Export CSV Button */}
                <button
                  type="button"
                  className="orders-btn-secondary"
                  onClick={handleExportCSV}
                  id="btn-export-orders-csv"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "18px", color: "var(--order-secondary)" }}
                  >
                    file_download
                  </span>
                  <span>Export CSV</span>
                </button>

                {/* Create Order Button */}
                <button
                  type="button"
                  className="orders-btn-primary"
                  onClick={() => setCreateModalOpen(true)}
                  id="btn-create-order-header"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    add_circle
                  </span>
                  <span>Create Order</span>
                </button>
              </div>
            </div>

            {/* 2. Summary KPI Ribbon (4 Cards) */}
            <OrderKPIStats
              stats={kpiStats}
              activeFilter={activeTab}
              onFilterSelect={handleKpiFilterSelect}
            />

            {/* 3. Two-Column Master-Detail Layout */}
            <div className="orders-master-detail-grid">
              {/* Left Column: Register Table (60% width -> 7 cols) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Status Filter Tabs */}
                <OrderStatusTabs
                  activeTab={activeTab}
                  onSelectTab={handleTabChange}
                  counts={tabCounts}
                />

                {/* High Density Table */}
                <OrdersRegisterTable
                  orders={paginatedOrders}
                  selectedOrderId={selectedOrderId}
                  onSelectOrder={handleSelectOrder}
                  checkedOrderIds={checkedOrderIds}
                  onToggleCheckOrder={handleToggleCheckOrder}
                  onToggleCheckAll={handleToggleCheckAll}
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  vehicleFilter={vehicleFilter}
                  onVehicleFilterChange={handleVehicleFilterChange}
                  onAcceptOrder={handleOpenAcceptModal}
                  onRejectOrder={handleOpenRejectModal}
                  onViewTrip={handleViewTrip}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalCount={filteredOrders.length}
                  onPageChange={setCurrentPage}
                />
              </div>

              {/* Right Column: Order Details Inspector Panel (40% width -> 5 cols) */}
              <OrderDetailPanel
                order={selectedOrder}
                onAcceptOrder={handleOpenAcceptModal}
                onRejectOrder={handleOpenRejectModal}
                onViewTrip={handleViewTrip}
                onAddNote={handleAddNote}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <AcceptOrderModal
        isOpen={Boolean(acceptModalOrder)}
        order={acceptModalOrder}
        onClose={() => setAcceptModalOrder(null)}
        onConfirmAccept={handleConfirmAccept}
      />

      <RejectOrderModal
        isOpen={Boolean(rejectModalOrder)}
        order={rejectModalOrder}
        onClose={() => setRejectModalOrder(null)}
        onConfirmReject={handleConfirmReject}
      />

      <CreateOrderModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateOrder={handleCreateOrder}
      />

      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectAction={(cmd) => {
          if (cmd.id === "cmd-quick-order") {
            setCreateModalOpen(true);
          } else if (cmd.path) {
            navigate(cmd.path);
          } else if (cmd.id === "cmd-dash") {
            navigate("/dashboard");
          } else if (cmd.id === "cmd-trips") {
            navigate("/trips");
          } else if (cmd.id === "cmd-vehicles") {
            navigate("/vehicles");
          } else if (cmd.id === "cmd-support") {
            navigate("/support");
          }
        }}
      />

      {/* Toast Feedback */}
      {toast && (
        <ToastNotification
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
