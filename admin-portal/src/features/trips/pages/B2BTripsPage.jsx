import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";

// Services
import { tripsApi } from "../services/tripsApi";

// Data
import {
  INITIAL_TRIPS_DATA,
  computeTripStats,
} from "../data/mockTripsData";

// Components
import TripKPIStats from "../components/TripKPIStats";
import TripStatusTabs from "../components/TripStatusTabs";
import TripRegisterTable from "../components/TripRegisterTable";
import TripDetailPanel from "../components/TripDetailPanel";
import CreateTripModal from "../components/CreateTripModal";
import AssignDriverModal from "../components/AssignDriverModal";
import LiveTrackingModal from "../components/LiveTrackingModal";

// Shell & Layout Components
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";

// Styles
import "../styles/trips.css";

function B2BTripsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Core Data State
  const [trips, setTrips] = useState(() => INITIAL_TRIPS_DATA);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [backendStats, setBackendStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filtering & Sorting State
  const [statusTab, setStatusTab] = useState("all");
  const [tonnageFilter, setTonnageFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("eta");

  // Auto-Sync Timer State
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncCountdown, setSyncCountdown] = useState(30);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetTrip, setAssignTargetTrip] = useState(null);
  const [isLiveTrackingModalOpen, setIsLiveTrackingModalOpen] = useState(false);
  const [trackingTargetTrip, setTrackingTargetTrip] = useState(null);

  // Layout & Overlays
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch trips and stats from backend
  const fetchTripsAndStats = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [tripsData, statsData] = await Promise.all([
        tripsApi.getTrips(),
        tripsApi.getTripStats(),
      ]);

      if (Array.isArray(tripsData)) {
        setTrips(tripsData);
        setSelectedTripId((prevId) => {
          if (prevId && tripsData.some((t) => t.id === prevId)) {
            return prevId;
          }
          return tripsData.length > 0 ? tripsData[0].id : "";
        });
      }

      if (statsData) {
        setBackendStats(statsData);
      }
    } catch (err) {
      console.error("Failed to fetch live B2B trips from backend:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTripsAndStats(true);
  }, [fetchTripsAndStats]);

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
          fetchTripsAndStats(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoSyncEnabled, fetchTripsAndStats]);

  // Compute live KPI metrics
  const stats = useMemo(() => {
    const computed = computeTripStats(trips);
    if (backendStats) {
      return {
        ...computed,
        ...backendStats,
      };
    }
    return computed;
  }, [trips, backendStats]);

  // Compute status tab counts
  const tabCounts = useMemo(() => {
    if (backendStats?.counts) {
      return backendStats.counts;
    }
    return {
      all: trips.length,
      scheduled: trips.filter((t) => t.status === "Scheduled").length,
      inTransit: trips.filter((t) => t.status === "In Transit").length,
      atPickup: trips.filter((t) => t.status === "At Pickup").length,
      delivered: trips.filter((t) => t.status === "Delivered").length,
      delayed: trips.filter((t) => t.status === "Delayed" || t.status === "Awaiting Driver").length,
    };
  }, [trips, backendStats]);

  // Apply filters and search
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // 1. Status Tab filter
      if (statusTab !== "all") {
        if (statusTab === "scheduled" && trip.status !== "Scheduled") return false;
        if (statusTab === "in_transit" && trip.status !== "In Transit") return false;
        if (statusTab === "at_pickup" && trip.status !== "At Pickup") return false;
        if (statusTab === "delivered" && trip.status !== "Delivered") return false;
        if (statusTab === "delayed" && trip.status !== "Delayed" && trip.status !== "Awaiting Driver") return false;
      }

      // 2. Tonnage Filter
      if (tonnageFilter !== "ALL" && trip.tonnageCategory !== tonnageFilter) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = (trip.id || "").toLowerCase().includes(q);
        const matchAccount = (trip.account || "").toLowerCase().includes(q);
        const matchDriver = (trip.driver?.name || "").toLowerCase().includes(q);
        const matchVehicle = (trip.vehicle?.number || "").toLowerCase().includes(q);
        const matchRoute = `${trip.route?.origin || ""} ${trip.route?.destination || ""}`.toLowerCase().includes(q);
        if (!matchId && !matchAccount && !matchDriver && !matchVehicle && !matchRoute) {
          return false;
        }
      }

      return true;
    });
  }, [trips, statusTab, tonnageFilter, searchQuery]);

  // Selected trip instance
  const selectedTrip = useMemo(() => {
    if (!trips || trips.length === 0) return null;
    return trips.find((t) => t.id === selectedTripId) || filteredTrips[0] || trips[0] || null;
  }, [trips, selectedTripId, filteredTrips]);

  // Logout handler
  async function handleLogout() {
    try {
      await logout();
    } catch {
      // cleanup
    } finally {
      clearCurrentUser();
      navigate("/", { replace: true });
    }
  }

  // Handle Create Trip
  async function handleCreateTrip(payload) {
    try {
      const newTrip = await tripsApi.createTrip(payload);
      setTrips((prev) => [newTrip, ...prev]);
      setSelectedTripId(newTrip.id);
      setToast({
        type: "success",
        title: "New Trip Dispatched",
        message: `Trip #${newTrip.id} dispatched to ${newTrip.driver?.name || "assigned corridor"}.`,
      });
      fetchTripsAndStats(false);
    } catch (err) {
      setToast({
        type: "error",
        title: "Dispatch Failed",
        message: err.response?.data?.error || err.message || "Failed to create trip.",
      });
    }
  }

  // Handle Mark As Delivered
  async function handleMarkDelivered(targetTrip) {
    try {
      const updated = await tripsApi.markDelivered(targetTrip.id);
      setTrips((prev) => prev.map((t) => (t.id === targetTrip.id ? updated : t)));
      setToast({
        type: "success",
        title: "Trip Marked as Delivered",
        message: `Trip #${targetTrip.id} signed off with digital OTP verification.`,
      });
      fetchTripsAndStats(false);
    } catch (err) {
      setToast({
        type: "error",
        title: "Delivery Sign-Off Failed",
        message: err.response?.data?.error || err.message || "Failed to mark trip delivered.",
      });
    }
  }

  // Handle Cancel Trip
  async function handleCancelTrip(targetTrip) {
    const reason = window.prompt(
      `Enter cancellation reason for Trip #${targetTrip.id}:`,
      "Cancelled by operations desk due to corridor constraints."
    );
    if (!reason) return;

    try {
      const updated = await tripsApi.cancelTrip(targetTrip.id, reason);
      setTrips((prev) => prev.map((t) => (t.id === targetTrip.id ? updated : t)));
      setToast({
        type: "warning",
        title: "Trip Cancelled",
        message: `Trip #${targetTrip.id} has been marked as cancelled.`,
      });
      fetchTripsAndStats(false);
    } catch (err) {
      setToast({
        type: "error",
        title: "Cancellation Failed",
        message: err.response?.data?.error || err.message || "Failed to cancel trip.",
      });
    }
  }

  // Handle Assign Driver Confirm
  async function handleAssignDriverConfirm(tripId, assignedDriver) {
    try {
      const updated = await tripsApi.assignDriver(tripId, {
        driver_id: assignedDriver.id,
        driver_name: assignedDriver.name,
        vehicle_type: assignedDriver.vehicleType,
      });

      setTrips((prev) => prev.map((t) => (t.id === tripId ? updated : t)));
      setToast({
        type: "success",
        title: "Driver Assigned & Dispatched",
        message: `${assignedDriver.name} assigned to #${tripId}.`,
      });
      fetchTripsAndStats(false);
    } catch (err) {
      setToast({
        type: "error",
        title: "Assignment Failed",
        message: err.response?.data?.error || err.message || "Failed to assign driver.",
      });
    }
  }

  // Handle Export CSV
  function handleExportCSV() {
    const headers = ["Trip ID,Account,Origin,Destination,Corridor,Distance KM,Driver,Vehicle,Status,SLA\n"];
    const rows = filteredTrips.map((t) =>
      [
        t.id,
        `"${t.account || ""}"`,
        t.route?.origin || "",
        t.route?.destination || "",
        t.route?.corridor || "",
        t.route?.distanceKm || "",
        t.driver ? `"${t.driver.name}"` : "Unassigned",
        t.vehicle?.number || "",
        t.status,
        t.sla,
      ].join(",")
    );

    const blob = new Blob([headers.concat(rows.join("\n"))], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `HireD_B2B_Trips_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      type: "success",
      title: "Export Successful",
      message: `Exported ${filteredTrips.length} corridor trip records to CSV.`,
    });
  }

  return (
    <div className="b2b-trips-page-shell">
      {/* Sidebar Navigation */}
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeModule="trips"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className={`b2b-trips-content-viewport ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Header */}
        <AdminNavbar
          user={user}
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          breadcrumbCurrent="B2B Trips Control"
        />

        {/* Control Room Main */}
        <main className="b2b-trips-main-container">
          <div className="b2b-trips-wrapper space-y-6">
            {/* Top Control Room Header & Actions */}
            <div className="trip-control-header-row">
              <div className="trip-control-title-cluster">
                <div className="trip-control-h1-group">
                  <h1 className="trip-control-title">B2B Trips</h1>
                  <span className="trip-control-live-pill">
                    <span className="trip-pulse-indicator"></span>
                    Live Fleet Dispatch
                  </span>
                </div>
                <p className="trip-control-subtitle">
                  Control room for scheduled, on-demand and delivery jobs across national freight corridors
                </p>
              </div>

              <div className="trip-header-actions-group">
                <button
                  type="button"
                  className="trip-btn-header-secondary"
                  onClick={handleExportCSV}
                  title="Export records to CSV"
                >
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  className={`trip-btn-header-secondary ${autoSyncEnabled ? "bg-primary/5 text-primary" : ""}`}
                  onClick={() => {
                    fetchTripsAndStats(false);
                    setSyncCountdown(30);
                  }}
                  title="Refresh live telemetry now"
                >
                  <span className={`material-symbols-outlined text-[18px] ${loading ? "animate-spin" : ""}`}>
                    refresh
                  </span>
                  <span>Auto-Sync ({syncCountdown}s)</span>
                </button>

                <button
                  type="button"
                  className="trip-btn-header-primary"
                  onClick={() => setIsCreateModalOpen(true)}
                  id="btn-create-new-trip"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>+ Create New Trip</span>
                </button>
              </div>
            </div>

            {/* Operational KPI Metric Ribbons */}
            <TripKPIStats
              stats={stats}
              onCardClick={(filterKey) => {
                if (filterKey === "ALL") setStatusTab("all");
                if (filterKey === "ON_TIME") setStatusTab("in_transit");
                if (filterKey === "AWAITING_DRIVER") setStatusTab("delayed");
                if (filterKey === "DELAYED") setStatusTab("delayed");
              }}
            />

            {/* Filter Pipeline Segment Tabs */}
            <TripStatusTabs
              activeTab={statusTab}
              onSelectTab={(tabId) => setStatusTab(tabId)}
              counts={tabCounts}
            />

            {/* Master-Detail Operational Surface */}
            <div className="trip-master-detail-grid">
              {/* Left Panel: Trip Register Table */}
              <div className="trip-register-panel">
                <TripRegisterTable
                  trips={filteredTrips}
                  selectedTripId={selectedTrip?.id}
                  onSelectTrip={(id) => setSelectedTripId(id)}
                  searchQuery={searchQuery}
                  onSearchChange={(q) => setSearchQuery(q)}
                  tonnageFilter={tonnageFilter}
                  onTonnageChange={(t) => setTonnageFilter(t)}
                  sortBy={sortBy}
                  onSortChange={(s) => setSortBy(s)}
                  onTrackLive={(t) => {
                    setTrackingTargetTrip(t);
                    setIsLiveTrackingModalOpen(true);
                  }}
                  onAssignDriver={(t) => {
                    setAssignTargetTrip(t);
                    setIsAssignModalOpen(true);
                  }}
                  onOpenReport={(t) => {
                    setToast({
                      type: "info",
                      title: "Electronic POD Generated",
                      message: `Opened Verified Proof of Delivery for #${t.id}.`,
                    });
                  }}
                />
              </div>

              {/* Right Panel: Live Selected Trip Details Card */}
              <div className="trip-details-panel">
                <TripDetailPanel
                  trip={selectedTrip}
                  onTrackLive={(t) => {
                    setTrackingTargetTrip(t);
                    setIsLiveTrackingModalOpen(true);
                  }}
                  onMarkDelivered={handleMarkDelivered}
                  onCancelTrip={handleCancelTrip}
                  onAssignDriver={(t) => {
                    setAssignTargetTrip(t);
                    setIsAssignModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals & Drawers */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTrip={handleCreateTrip}
      />

      <AssignDriverModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssignTargetTrip(null);
        }}
        trip={assignTargetTrip}
        onAssignDriverConfirm={handleAssignDriverConfirm}
      />

      <LiveTrackingModal
        isOpen={isLiveTrackingModalOpen}
        onClose={() => {
          setIsLiveTrackingModalOpen(false);
          setTrackingTargetTrip(null);
        }}
        trip={trackingTargetTrip}
      />

      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(path) => navigate(path)}
      />

      {toast && (
        <ToastNotification
          toast={toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default B2BTripsPage;
