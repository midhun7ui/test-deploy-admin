import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import {
  INITIAL_DRIVERS_DATA,
  computeDriverKPIs,
  computeDriverTabCounts,
} from "../data/mockDriversData";
import driversApi from "../services/driversApi";

// Common Dashboard Layout Components
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";

// Driver Management Components
import DriverKPIStats from "../components/DriverKPIStats";
import DriverStatusTabs from "../components/DriverStatusTabs";
import DriversRegisterTable from "../components/DriversRegisterTable";
import DriverProfilePanel from "../components/DriverProfilePanel";
import AddDriverModal from "../components/AddDriverModal";
import VerifyKycModal from "../components/VerifyKycModal";
import AssignDriverTripModal from "../components/AssignDriverTripModal";
import DocumentPreviewModal from "../components/DocumentPreviewModal";
import AssignVehicleModal from "../components/AssignVehicleModal";


// Driver Styling
import "../styles/drivers.css";

export default function DriversPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Core Data State
  const [drivers, setDrivers] = useState(() => INITIAL_DRIVERS_DATA);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [stats, setStats] = useState(null);
  const [availableTrips, setAvailableTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filtering & Search
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [corridorFilter, setCorridorFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Layout & Drawers
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [verifyModalDriver, setVerifyModalDriver] = useState(null);
  const [assignModalDriver, setAssignModalDriver] = useState(null);
  const [assignVehicleDriver, setAssignVehicleDriver] = useState(null);
  const [previewDocData, setPreviewDocData] = useState(null);


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

  // Fetch Drivers and Stats from Backend
  const fetchDriversData = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    else setIsSyncing(true);

    try {
      const [driversData, statsData, tripsData] = await Promise.all([
        driversApi.getDrivers({
          corridor: corridorFilter,
          status: activeTab,
          search: searchQuery,
        }),
        driversApi.getDriverStats(),
        driversApi.getAvailableTrips(),
      ]);

      const driverList = Array.isArray(driversData) ? driversData : [];
      setDrivers(driverList);
      setStats(statsData);
      setAvailableTrips(Array.isArray(tripsData) ? tripsData : []);

      setSelectedDriverId((prev) => {
        if (prev && driverList.some((d) => d.id === prev)) return prev;
        return driverList[0]?.id || "";
      });
    } catch (err) {
      console.error("Failed to load live fleet drivers data:", err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [corridorFilter, activeTab, searchQuery]);

  // Initial load and filter change trigger
  useEffect(() => {
    fetchDriversData(false);
  }, [fetchDriversData]);

  // Background auto-refresh every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      fetchDriversData(true);
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchDriversData]);

  // Compute live KPIs and tab counters (prefer backend stats if available)
  const kpis = useMemo(() => {
    if (stats?.kpis) return stats.kpis;
    return computeDriverKPIs(drivers);
  }, [stats, drivers]);

  const tabCounts = useMemo(() => {
    if (stats?.tabCounts) return stats.tabCounts;
    return computeDriverTabCounts(drivers);
  }, [stats, drivers]);

  // Filter Drivers Roster locally for immediate responsiveness
  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      // 1. Tab Status Filter
      if (activeTab === "active" && driver.status !== "Active" && driver.status !== "On Trip") {
        return false;
      }
      if (activeTab === "available" && driver.status !== "Available") {
        return false;
      }
      if (activeTab === "ontrip" && driver.status !== "On Trip") {
        return false;
      }
      if (activeTab === "pending" && driver.status !== "Pending KYC" && driver.kycStatus !== "Pending") {
        return false;
      }
      if (activeTab === "bank") {
        const isPendingBank =
          driver.bankDetails?.isPending ||
          driver.bankDetails?.status === "Pending" ||
          (driver.bankDetails?.hasBank && !driver.bankDetails?.isActive);
        if (!isPendingBank) return false;
      }
      if (activeTab === "inactive" && driver.status !== "Inactive") {
        return false;
      }

      // 2. Corridor Filter
      if (corridorFilter !== "all" && driver.corridor !== corridorFilter) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchName = (driver.name || "").toLowerCase().includes(query);
        const matchPhone = (driver.phone || "").toLowerCase().includes(query);
        const matchVehicle = (driver.vehicle?.number || "").toLowerCase().includes(query);
        const matchCorridor = (driver.corridor || "").toLowerCase().includes(query);

        if (!matchName && !matchPhone && !matchVehicle && !matchCorridor) {
          return false;
        }
      }

      return true;
    });
  }, [drivers, activeTab, corridorFilter, searchQuery]);

  // Paginated slice
  const paginatedDrivers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDrivers.slice(startIndex, startIndex + pageSize);
  }, [filteredDrivers, currentPage, pageSize]);

  // Active selected driver for profile inspection
  const selectedDriver = useMemo(() => {
    if (!drivers || drivers.length === 0) return null;
    return drivers.find((d) => d.id === selectedDriverId) || drivers[0] || null;
  }, [drivers, selectedDriverId]);

  // Handlers that reset page to 1
  function handleTabChange(tab) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  function handleSearchChange(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleCorridorChange(val) {
    setCorridorFilter(val);
    setCurrentPage(1);
  }

  function handleKpiFilterSelect(filterKey) {
    setActiveTab(filterKey);
    setCurrentPage(1);
  }

  function handleSelectDriver(driverId) {
    setSelectedDriverId(driverId);
  }

  // Export Drivers CSV
  function handleExportCSV() {
    const headers = [
      "Driver ID",
      "Name",
      "Phone",
      "Vehicle Plate",
      "Vehicle Type",
      "Corridor",
      "KYC Status",
      "Status",
      "Rating",
      "Trips Completed",
      "Wallet Balance (INR)",
    ];

    const rows = filteredDrivers.map((d) => [
      `"${d.id}"`,
      `"${d.name}"`,
      `"${d.phone}"`,
      `"${d.vehicle?.number}"`,
      `"${d.vehicle?.type}"`,
      `"${d.corridor}"`,
      `"${d.kycStatus}"`,
      `"${d.status}"`,
      `"${d.rating}"`,
      `"${d.tripsCompleted}"`,
      `"${d.wallet?.availableBalance}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hired_drivers_registry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      title: "Driver Registry Exported",
      message: `Exported ${filteredDrivers.length} driver compliance records as CSV.`,
      type: "success",
    });
  }

  // Add Driver
  async function handleAddDriver(driverPayload) {
    try {
      const createdDriver = await driversApi.onboardDriver(driverPayload);
      setDrivers((prev) => [createdDriver, ...prev]);
      setSelectedDriverId(createdDriver.id);
      setAddModalOpen(false);
      setToast({
        title: "Driver Registered",
        message: `Onboarded ${createdDriver.name}. Document verification queued.`,
        type: "success",
      });
      fetchDriversData(true);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to onboard driver.";
      setToast({
        title: "Registration Error",
        message: errMsg,
        type: "error",
      });
    }
  }

  // Verify KYC Documents
  async function handleConfirmVerify({ driverId, isFullyApproved, verifiedCount, adminNotes }) {
    try {
      const updated = await driversApi.verifyKyc(driverId, {
        isFullyApproved,
        verifiedCount,
        adminNotes,
      });

      setDrivers((prev) => prev.map((d) => (d.id === driverId ? updated : d)));
      setVerifyModalDriver(null);
      setToast({
        title: isFullyApproved ? "KYC Approved & Verified" : "Review Notes Logged",
        message: isFullyApproved
          ? `Driver credentials verified. Status updated to Available.`
          : `Remarks logged: ${adminNotes}`,
        type: isFullyApproved ? "success" : "info",
      });
      fetchDriversData(true);
    } catch (err) {
      setToast({
        title: "KYC Review Error",
        message: err.response?.data?.error || "Failed to submit KYC review.",
        type: "error",
      });
    }
  }

  // Assign Trip to Driver
  async function handleConfirmAssign({ driverId, trip, departureSlot }) {
    try {
      const updated = await driversApi.assignTrip(driverId, {
        tripId: trip.id,
        departureSlot,
      });

      setDrivers((prev) => prev.map((d) => (d.id === driverId ? updated : d)));
      setAssignModalDriver(null);
      setToast({
        title: "Trip Assigned",
        message: `Assigned trip #${trip.id} to driver. Telemetry link active.`,
        type: "success",
      });
      fetchDriversData(true);
    } catch (err) {
      setToast({
        title: "Assignment Error",
        message: err.response?.data?.error || "Failed to assign trip to driver.",
        type: "error",
      });
    }
  }

  // Vehicle Reassignment
  function handleReassignVehicle(driver) {
    setAssignVehicleDriver(driver);
  }

  async function handleConfirmVehicleAssignment({ driverId, action, vehicleNumber, vehicleType, reason }) {
    try {
      const updated = await driversApi.reassignVehicle(driverId, {
        action,
        vehicleNumber,
        vehicleType,
        reason,
      });

      setDrivers((prev) => prev.map((d) => (d.id === driverId ? updated : d)));
      setToast({
        title: action === "approve_request"
          ? "Own Vehicle Request Approved"
          : action === "reject_request"
          ? "Vehicle Request Rejected"
          : "Fleet Vehicle Assigned",
        message: action === "approve_request"
          ? `Approved and assigned commercial vehicle ${vehicleNumber}.`
          : action === "reject_request"
          ? "The driver vehicle request has been rejected."
          : `Assigned fleet vehicle ${vehicleNumber}.`,
        type: action === "reject_request" ? "info" : "success",
      });
      fetchDriversData(true);
    } catch (err) {
      setToast({
        title: "Vehicle Assignment Error",
        message: err.response?.data?.error || "Failed to update vehicle assignment.",
        type: "error",
      });
      throw err;
    }
  }

  // Call Driver
  function handleCallDriver(driver) {
    setToast({
      title: "Connecting Cloud Telephony",
      message: `Initiating secure bridge call to ${driver.name} at ${driver.phone}...`,
      type: "info",
    });
  }

  // Suspend / Reactivate Driver
  async function handleSuspendDriver(driver) {
    try {
      const updated = await driversApi.toggleStatus(driver.id);
      setDrivers((prev) => prev.map((d) => (d.id === driver.id ? updated : d)));
      const isNowSuspended = updated.status === "Inactive";

      setToast({
        title: isNowSuspended ? "Driver Suspended" : "Driver Reactivated",
        message: isNowSuspended
          ? `${driver.name} has been placed on operational suspension.`
          : `${driver.name} has been reactivated for corridor operations.`,
        type: isNowSuspended ? "info" : "success",
      });
      fetchDriversData(true);
    } catch (err) {
      setToast({
        title: "Status Update Error",
        message: err.response?.data?.error || "Failed to update driver status.",
        type: "error",
      });
    }
  }

  // Verify or Deny Bank Account
  async function handleVerifyBank(driver, actionStatus = "Active", reason = "") {
    try {
      const response = await driversApi.verifyBank(driver.id, {
        status: actionStatus,
        reason,
      });

      const updatedDriver = response.driver || {
        ...driver,
        bankDetails: {
          ...driver.bankDetails,
          status: actionStatus,
          isActive: actionStatus === "Active",
          isPending: actionStatus === "Pending",
          isRejected: actionStatus === "Rejected",
        },
      };

      setDrivers((prev) =>
        prev.map((d) => (d.id === driver.id ? updatedDriver : d))
      );

      const isApproved = actionStatus === "Active";
      setToast({
        title: isApproved ? "Bank Account Approved" : "Bank Account Denied",
        message: isApproved
          ? `Bank account for ${driver.name} approved. Payout distributions are now enabled.`
          : `Bank account for ${driver.name} denied. Payout distributions remain blocked.`,
        type: isApproved ? "success" : "warning",
      });

      fetchDriversData(true);
    } catch (err) {
      setToast({
        title: "Bank Verification Error",
        message: err.response?.data?.error || "Failed to update driver bank status.",
        type: "error",
      });
    }
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
    <div className="driver-page-shell" id="drivers-page-root">
      {/* Sidebar Navigation */}
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeModule="drivers"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <div className={`driver-content-viewport ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Navbar */}
        <AdminNavbar
          user={user}
          onLogout={handleLogout}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          backendStatus={{ isHealthy: true, checkedAt: isSyncing ? "Syncing..." : "Just now" }}
          breadcrumbCurrent="Driver Management"
          quickActionLabel="+ Add Driver"
          onQuickAction={() => setAddModalOpen(true)}
        />

        {/* Content Container */}
        <main className="driver-main-container">
          <div className="driver-page-wrapper">
            {/* 1. Header & Actions Row */}
            <div className="driver-header-row">
              <div className="driver-title-cluster">
                <div className="driver-h1-group">
                  <h1 className="driver-title">Drivers</h1>
                  <span className="driver-registry-pill">Fleet Registry</span>
                  {isSyncing && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--driver-primary)",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span className="driver-pulse-green" />
                      Live Sync
                    </span>
                  )}
                </div>
                <p className="driver-subtitle">
                  Fleet personnel verification, KYC compliance, active assignments, and digital wallet settlements
                </p>
              </div>

              <div className="driver-header-actions">
                {/* Freight Corridor Selector Dropdown */}
                <div className="driver-corridor-select-wrapper">
                  <span className="material-symbols-outlined driver-corridor-icon">alt_route</span>
                  <select
                    className="driver-corridor-select"
                    value={corridorFilter}
                    onChange={(e) => handleCorridorChange(e.target.value)}
                    id="select-active-corridor"
                  >
                    <option value="all">All Fleets / Active Corridors</option>
                    <option value="Western Dedicated Corridor (MH-GJ)">Western Dedicated Corridor (MH-GJ)</option>
                    <option value="North Central Belt (DL-HR-UP)">North Central Belt (DL-HR-UP)</option>
                    <option value="Southern Coastal Express (KA-TN)">Southern Coastal Express (KA-TN)</option>
                  </select>
                  <span className="material-symbols-outlined driver-select-chevron">expand_more</span>
                </div>

                {/* Manual Refresh Button */}
                <button
                  type="button"
                  className="driver-btn-secondary"
                  onClick={() => fetchDriversData(false)}
                  disabled={isLoading}
                  title="Refresh Driver Registry"
                  id="btn-refresh-drivers"
                  style={{ minWidth: "40px", padding: "0.5rem 0.75rem" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "17px",
                      animation: isLoading ? "spin 1s linear infinite" : "none",
                    }}
                  >
                    refresh
                  </span>
                </button>

                {/* Export CSV Button */}
                <button
                  type="button"
                  className="driver-btn-secondary"
                  onClick={handleExportCSV}
                  id="btn-export-drivers-csv"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "var(--driver-text-outline)" }}>
                    file_download
                  </span>
                  <span>Export CSV</span>
                </button>

                {/* Add Driver Trigger */}
                <button
                  type="button"
                  className="driver-btn-primary"
                  onClick={() => setAddModalOpen(true)}
                  id="btn-add-driver-header"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    person_add
                  </span>
                  <span>+ Add Driver</span>
                </button>
              </div>
            </div>

            {/* 2. Summary KPI Ribbon (4 Cards) */}
            <DriverKPIStats
              kpis={kpis}
              activeFilter={activeTab}
              onFilterSelect={handleKpiFilterSelect}
            />

            {/* 3. Operational Two-Column Layout (58% Left Master / 42% Right Detail) */}
            <div className="driver-master-detail-grid">
              {/* Left Column: Driver Register Card */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Filter Tabs Bar */}
                <DriverStatusTabs
                  activeTab={activeTab}
                  onSelectTab={handleTabChange}
                  counts={tabCounts}
                />

                {/* Master Register Table */}
                <DriversRegisterTable
                  drivers={paginatedDrivers}
                  selectedDriverId={selectedDriverId}
                  onSelectDriver={handleSelectDriver}
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  onAssignTrip={(drv) => setAssignModalDriver(drv)}
                  onVerifyKyc={(drv) => setVerifyModalDriver(drv)}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalCount={filteredDrivers.length}
                  onPageChange={setCurrentPage}
                />
              </div>

              {/* Right Column: Driver Profile & Compliance Panel */}
              <DriverProfilePanel
                driver={selectedDriver}
                onAssignTrip={(drv) => setAssignModalDriver(drv)}
                onVerifyKyc={(drv) => setVerifyModalDriver(drv)}
                onPreviewDoc={(doc, drv) => setPreviewDocData({ doc, driver: drv || selectedDriver })}
                onReassignVehicle={handleReassignVehicle}
                onCallDriver={handleCallDriver}
                onSuspendDriver={handleSuspendDriver}
                onVerifyBank={handleVerifyBank}
                initialSubtab={activeTab === "bank" ? "bank" : undefined}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <AddDriverModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddDriver={handleAddDriver}
      />

      <VerifyKycModal
        isOpen={Boolean(verifyModalDriver)}
        driver={verifyModalDriver}
        onClose={() => setVerifyModalDriver(null)}
        onConfirmVerify={handleConfirmVerify}
      />

      <AssignDriverTripModal
        isOpen={Boolean(assignModalDriver)}
        driver={assignModalDriver}
        onClose={() => setAssignModalDriver(null)}
        onConfirmAssign={handleConfirmAssign}
        trips={availableTrips}
      />

      <AssignVehicleModal
        isOpen={Boolean(assignVehicleDriver)}
        driver={assignVehicleDriver}
        onClose={() => setAssignVehicleDriver(null)}
        onAssignSuccess={handleConfirmVehicleAssignment}
        onPreviewDoc={(doc, drv) => setPreviewDocData({ doc, driver: drv || assignVehicleDriver })}
      />

      <DocumentPreviewModal
        isOpen={Boolean(previewDocData)}
        document={previewDocData?.doc}
        driver={previewDocData?.driver}
        onClose={() => setPreviewDocData(null)}
        zIndex={1200}
      />


      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectAction={(cmd) => {
          if (cmd.path) navigate(cmd.path);
          else if (cmd.id === "cmd-dash") navigate("/dashboard");
          else if (cmd.id === "cmd-orders") navigate("/orders");
          else if (cmd.id === "cmd-trips") navigate("/trips");
          else if (cmd.id === "cmd-vehicles") navigate("/vehicles");
          else if (cmd.id === "cmd-support") navigate("/support");
          else if (cmd.id === "cmd-onboard-driver") setAddModalOpen(true);
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
