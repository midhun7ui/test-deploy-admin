import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import { enquiriesApi } from "../services/enquiriesApi";

// Data
import {
  computeEnquiryStats,
} from "../data/mockEnquiriesData";

// Components
import EnquiryStats from "../components/EnquiryStats";
import LeadPipelineKanban from "../components/LeadPipelineKanban";
import EnquiriesTable from "../components/EnquiriesTable";
import AddEnquiryModal from "../components/AddEnquiryModal";
import ConvertTripModal from "../components/ConvertTripModal";
import EnquiryDetailModal from "../components/EnquiryDetailModal";
import EnquiryFilterModal from "../components/EnquiryFilterModal";

// Shell & Layout Components
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";

// Styles
import "../styles/enquiries.css";

function EnquiriesPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Core Data State
  const [enquiries, setEnquiries] = useState([]);
  const [activeView, setActiveView] = useState("pipeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [timePeriod, setTimePeriod] = useState("This month");
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    status: "ALL",
    priority: "ALL",
    source: "ALL",
    owner: "ALL",
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertTarget, setConvertTarget] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Layout & Overlays
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
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

  // Fetch live CRM enquiries from REST backend
  const fetchEnquiries = useCallback(
    async (showToast = false) => {
      try {
        setIsRefreshing(true);
        const data = await enquiriesApi.getEnquiries({
          period: timePeriod,
        });

        if (Array.isArray(data)) {
          setEnquiries(data);
          setApiError(null);
        }

        if (showToast) {
          setToast({
            title: "Pipeline Synchronized",
            message: `Fetched latest CRM leads from database.`,
            type: "success",
          });
        }
      } catch (err) {
        console.warn("Could not fetch enquiries from backend API:", err);
        setApiError("Backend disconnected — operating in offline mode.");
        if (showToast) {
          setToast({
            title: "Offline Sync Warning",
            message: "Could not reach backend; using local cache.",
            type: "warning",
          });
        }
      } finally {
        setIsRefreshing(false);
      }
    },
    [timePeriod]
  );

  // Initial fetch and on time period change
  useEffect(() => {
    fetchEnquiries(false);
  }, [fetchEnquiries]);

  // Live Sync: Continuous background synchronization for pending orders and direct admin orders
  useEffect(() => {
    function handleLiveOrderUpdate() {
      fetchEnquiries(false);
    }

    window.addEventListener("orders_updated", handleLiveOrderUpdate);
    window.addEventListener("order_created", handleLiveOrderUpdate);

    // 10-second polling while user is viewing the page to stream live incoming orders
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchEnquiries(false);
      }
    }, 10000);

    return () => {
      window.removeEventListener("orders_updated", handleLiveOrderUpdate);
      window.removeEventListener("order_created", handleLiveOrderUpdate);
      clearInterval(interval);
    };
  }, [fetchEnquiries]);

  // Compute live KPI metrics
  const stats = useMemo(() => {
    return computeEnquiryStats(enquiries);
  }, [enquiries]);

  // Apply filters and client search to list
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // Status filter
      if (filters.status !== "ALL" && item.status !== filters.status) {
        return false;
      }
      // Priority filter
      if (filters.priority !== "ALL" && item.priority !== filters.priority) {
        return false;
      }
      // Source filter
      if (filters.source !== "ALL" && item.source !== filters.source) {
        return false;
      }
      // Owner filter
      if (filters.owner !== "ALL") {
        if (filters.owner === "unassigned") {
          if (item.owner !== null && item.owner !== undefined) return false;
        } else if (!item.owner || item.owner.name !== filters.owner) {
          return false;
        }
      }
      // Search query filter
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          (item.id && item.id.toLowerCase().includes(q)) ||
          (item.company && item.company.toLowerCase().includes(q)) ||
          (item.contactPerson && item.contactPerson.toLowerCase().includes(q)) ||
          (item.route && item.route.toLowerCase().includes(q)) ||
          (item.phone && item.phone.includes(q)) ||
          (item.source && item.source.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [enquiries, filters, searchQuery]);

  // Logout handler
  async function handleLogout() {
    try {
      await logout();
    } catch {
      // continue cleanup
    } finally {
      clearCurrentUser();
      navigate("/", { replace: true });
    }
  }

  // Status transition handler
  async function handleStatusChange(enquiryId, newStatus) {
    // 1. Optimistic UI update
    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id === enquiryId) {
          const updatedTimeline = [
            {
              id: `tl-${Date.now()}`,
              title: `Status Changed to ${newStatus}`,
              desc: `Updated via pipeline console by Operations Desk.`,
              timestamp: "Just now",
              author: "Admin Ops",
            },
            ...(item.timeline || []),
          ];

          return {
            ...item,
            status: newStatus,
            lastUpdate: "Just now",
            timeline: updatedTimeline,
          };
        }
        return item;
      })
    );

    // Update selected modal data if open
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry((prev) => ({
        ...prev,
        status: newStatus,
        lastUpdate: "Just now",
      }));
    }

    setToast({
      title: "Lead Status Updated",
      message: `${enquiryId} moved to '${newStatus}' pipeline stage.`,
      type: "success",
    });

    // 2. Persist to REST API
    try {
      await enquiriesApi.updateEnquiry(enquiryId, { status: newStatus });
    } catch (err) {
      console.warn("Could not sync status change with backend:", err);
    }
  }

  // Add new enquiry
  async function handleSaveNewEnquiry(newEnquiry) {
    try {
      const payload = {
        company: newEnquiry.company,
        contactPerson: newEnquiry.contactPerson,
        phone: newEnquiry.phone,
        email: newEnquiry.email,
        origin: newEnquiry.origin,
        destination: newEnquiry.destination,
        numericVolume: newEnquiry.numericVolume || 0,
        source: newEnquiry.source || "Website",
        status: newEnquiry.status || "New",
        priority: newEnquiry.priority || "Medium",
        vehicleRequirement: newEnquiry.vehicleRequirement || "",
        notes: newEnquiry.notes || "",
        ownerId: (newEnquiry.owner && newEnquiry.owner.name) || newEnquiry.ownerId || "unassigned",
      };

      const serverRecord = await enquiriesApi.createEnquiry(payload);
      const savedItem = serverRecord && serverRecord.id ? serverRecord : newEnquiry;
      setEnquiries((prev) => [savedItem, ...prev.filter((e) => e.id !== savedItem.id)]);

      setToast({
        title: "Enquiry Registered",
        message: `${savedItem.id} created for ${savedItem.company} on ${savedItem.route}.`,
        type: "success",
      });
    } catch (err) {
      console.warn("Could not save enquiry via REST API, fallback local:", err);
      setEnquiries((prev) => [newEnquiry, ...prev]);
      setToast({
        title: "Enquiry Registered (Local)",
        message: `${newEnquiry.id} saved for ${newEnquiry.company}.`,
        type: "info",
      });
    }
  }

  // Open Convert to Trip modal
  function handleInitiateConvert(enquiry) {
    setConvertTarget(enquiry);
    setIsConvertModalOpen(true);
  }

  // Confirm Convert to Trip
  async function handleConfirmConvertTrip(conversionPayload) {
    let finalTripId = conversionPayload.tripId;

    try {
      const result = await enquiriesApi.convertTrip(conversionPayload.enquiryId, {
        tripAmount: conversionPayload.tripAmount,
        driverSharePct: conversionPayload.driverSharePct,
        platformSharePct: conversionPayload.platformSharePct,
        vehicleType: conversionPayload.vehicleType,
        pickupDate: conversionPayload.pickupDate,
        cargoType: conversionPayload.cargoType,
        driver_id: conversionPayload.driver_id,
      });

      if (result && result.tripId) {
        finalTripId = result.tripId;
      }
    } catch (err) {
      console.warn("Could not convert trip via REST API, using client trip ID:", err);
    }

    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id === conversionPayload.enquiryId) {
          const updatedTimeline = [
            {
              id: `tl-${Date.now()}`,
              title: `Converted to Active Trip (${finalTripId})`,
              desc: `Dispatched ${conversionPayload.vehicleType} on ${item.route}. Trip Amount: ₹${conversionPayload.tripAmount.toLocaleString("en-IN")}.`,
              timestamp: "Just now",
              author: "Admin Ops",
            },
            ...(item.timeline || []),
          ];

          return {
            ...item,
            status: "Converted",
            convertedTripId: finalTripId,
            lastUpdate: "Just now",
            timeline: updatedTimeline,
          };
        }
        return item;
      })
    );

    if (selectedEnquiry && selectedEnquiry.id === conversionPayload.enquiryId) {
      setSelectedEnquiry((prev) => ({
        ...prev,
        status: "Converted",
        convertedTripId: finalTripId,
        lastUpdate: "Just now",
      }));
    }

    setToast({
      title: "Trip Dispatched & Lead Converted",
      message: `Enquiry converted to live trip ${finalTripId} (Driver split: ${conversionPayload.driverSharePct}%, Platform margin: ${conversionPayload.platformSharePct}%).`,
      type: "success",
    });
  }

  // Assign Ops Owner
  async function handleAssignOwner(enquiryId, ownerObj) {
    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id === enquiryId) {
          const updatedTimeline = [
            {
              id: `tl-${Date.now()}`,
              title: "Ops Owner Reassigned",
              desc: `Assigned to ${ownerObj ? ownerObj.name : "Unassigned Pool"}.`,
              timestamp: "Just now",
              author: "Admin Ops",
            },
            ...(item.timeline || []),
          ];

          return {
            ...item,
            owner: ownerObj,
            lastUpdate: "Just now",
            timeline: updatedTimeline,
          };
        }
        return item;
      })
    );

    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry((prev) => ({
        ...prev,
        owner: ownerObj,
        lastUpdate: "Just now",
      }));
    }

    setToast({
      title: "Owner Assigned",
      message: `Assigned to ${ownerObj ? ownerObj.name : "Unassigned"}.`,
      type: "info",
    });

    try {
      await enquiriesApi.updateEnquiry(enquiryId, {
        owner: ownerObj ? ownerObj.name : "unassigned",
      });
    } catch (err) {
      console.warn("Could not sync owner assignment with backend:", err);
    }
  }

  // Add timeline note
  async function handleAddTimelineNote(enquiryId, noteObj) {
    const newEntry = {
      id: `tl-${Date.now()}`,
      title: noteObj.title,
      desc: noteObj.desc,
      timestamp: "Just now",
      author: noteObj.author || "Admin Ops",
    };

    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id === enquiryId) {
          const updatedTimeline = [newEntry, ...(item.timeline || [])];

          return {
            ...item,
            lastUpdate: "Just now",
            timeline: updatedTimeline,
          };
        }
        return item;
      })
    );

    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry((prev) => ({
        ...prev,
        lastUpdate: "Just now",
        timeline: [newEntry, ...(prev.timeline || [])],
      }));
    }

    setToast({
      title: "Note Recorded",
      message: "Activity logged to immutable enquiry audit stream.",
      type: "info",
    });

    try {
      await enquiriesApi.addTimelineNote(enquiryId, {
        title: noteObj.title,
        desc: noteObj.desc,
        author: noteObj.author || "Admin Ops",
      });
    } catch (err) {
      console.warn("Could not sync note with backend:", err);
    }
  }

  // Delete enquiry
  async function handleDeleteEnquiry(enquiryId) {
    setEnquiries((prev) => prev.filter((item) => item.id !== enquiryId));
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setIsDetailModalOpen(false);
      setSelectedEnquiry(null);
    }
    setToast({
      title: "Enquiry Removed",
      message: `Removed ${enquiryId} from the CRM register.`,
      type: "warning",
    });

    try {
      await enquiriesApi.deleteEnquiry(enquiryId);
    } catch (err) {
      console.warn("Could not delete enquiry from backend:", err);
    }
  }

  // Export CSV handler
  function handleExportCSV() {
    const headers = [
      "Enquiry ID",
      "Company",
      "Contact Person",
      "Phone",
      "Email",
      "Route",
      "Expected Monthly Volume",
      "Source",
      "Status",
      "Priority",
      "Owner",
      "Created At",
    ];

    const rows = filteredEnquiries.map((e) => [
      e.id,
      `"${e.company.replace(/"/g, '""')}"`,
      `"${e.contactPerson.replace(/"/g, '""')}"`,
      e.phone,
      e.email,
      `"${e.route}"`,
      `"${e.expectedVolume}"`,
      e.source,
      e.status,
      e.priority,
      e.owner ? e.owner.name : "Unassigned",
      `"${e.createdAt}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hired_enquiries_crm_pipeline_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      title: "Export Completed",
      message: `Successfully downloaded ${filteredEnquiries.length} CRM enquiry records as CSV.`,
      type: "success",
    });
  }

  // Stat Card click to quick-filter
  function handleStatClick(statId) {
    if (statId === "open") {
      setFilters((prev) => ({ ...prev, status: "ALL" }));
      setToast({
        title: "Filtered Open Leads",
        message: "Displaying all active open pipeline enquiries.",
        type: "info",
      });
    } else if (statId === "followup") {
      setFilters((prev) => ({ ...prev, status: "Contacted" }));
      setToast({
        title: "Filtered Needs Follow-up",
        message: "Displaying contacted leads awaiting proposal response.",
        type: "info",
      });
    } else if (statId === "qualified") {
      setFilters((prev) => ({ ...prev, status: "Qualified" }));
      setToast({
        title: "Filtered Qualified Leads",
        message: "Displaying high-probability leads ready for trip conversion.",
        type: "info",
      });
    } else if (statId === "unassigned") {
      setFilters((prev) => ({ ...prev, owner: "unassigned" }));
      setToast({
        title: "Filtered Unassigned Leads",
        message: "Displaying enquiries requiring operations owner assignment.",
        type: "warning",
      });
    }
  }

  return (
    <div className="admin-operations-shell" id="admin-enquiries-app">
      {/* Toast Alert Feedback */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Side Features Bar */}
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeModule="enquiries"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Right Content Layout */}
      <div className={`admin-main-viewport ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Navbar */}
        <AdminNavbar
          user={user}
          onLogout={handleLogout}
          unreadCount={3}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onQuickAction={() => setIsAddModalOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          breadcrumbCurrent="Enquiries & CRM"
        />

        {/* Scrollable Dashboard Workspace */}
        <main className="dashboard-content-scroll" id="main-content">
          <div className="dashboard-content-inner">
            {/* Top Page Header Bar */}
            <div className="enquiries-page-header">
              <div className="enquiries-header-left">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <h1 className="enquiries-main-title">Enquiries / CRM</h1>
                  <span
                    className="live-sync-pill"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.75rem",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                      background: apiError ? "#fee2e2" : "#dcfce7",
                      color: apiError ? "#991b1b" : "#166534",
                      fontWeight: 600,
                      border: `1px solid ${apiError ? "#fecaca" : "#bbf7d0"}`,
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: apiError ? "#ef4444" : "#22c55e",
                      }}
                    />
                    {apiError ? "Local Cache" : "Live REST Sync"}
                  </span>
                </div>
                <p className="enquiries-sub-title">
                  B2B lead pipeline from first touch to converted trip
                </p>
              </div>

              <div className="enquiries-header-actions">
                {/* Time Period Filter */}
                <div className="period-dropdown-container">
                  <button
                    type="button"
                    className="btn-period-dropdown"
                    id="btn-period-dropdown"
                    onClick={() => setIsPeriodDropdownOpen((prev) => !prev)}
                  >
                    <span className="material-symbols-outlined">calendar_today</span>
                    <span>{timePeriod}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>

                  {isPeriodDropdownOpen && (
                    <div className="period-dropdown-menu">
                      {["Today", "This week", "This month", "This quarter"].map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={`period-item ${timePeriod === p ? "selected" : ""}`}
                          onClick={() => {
                            setTimePeriod(p);
                            setIsPeriodDropdownOpen(false);
                            setToast({
                              title: "Period Updated",
                              message: `Adjusted pipeline timeline view to: ${p}`,
                              type: "info",
                            });
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter Popover Button */}
                <button
                  type="button"
                  className="btn-header-filter"
                  id="btn-header-filter"
                  onClick={() => setIsFilterModalOpen(true)}
                  title="Open filter options"
                >
                  <span className="material-symbols-outlined">filter_alt</span>
                  <span>Filter</span>
                </button>

                {/* Live Sync / Refresh Button */}
                <button
                  type="button"
                  className="btn-header-filter"
                  id="btn-refresh-enquiries"
                  onClick={() => fetchEnquiries(true)}
                  disabled={isRefreshing}
                  title="Synchronize live CRM pipeline with backend database"
                >
                  <span
                    className="material-symbols-outlined"
                    style={isRefreshing ? { animation: "spin 1s linear infinite" } : {}}
                  >
                    sync
                  </span>
                  <span>{isRefreshing ? "Syncing..." : "Sync"}</span>
                </button>

                {/* Primary Add Enquiry Button */}
                <button
                  type="button"
                  className="btn-header-primary"
                  id="btn-add-enquiry-header"
                  onClick={() => setIsAddModalOpen(true)}
                  title="Create new B2B enquiry"
                >
                  <span className="material-symbols-outlined">add</span>
                  <span>Add Enquiry</span>
                </button>
              </div>
            </div>

            {/* 1. Summary KPI Cards */}
            <EnquiryStats stats={stats} onStatClick={handleStatClick} />

            {/* 2. Lead Pipeline (Pipeline Kanban or List view) */}
            <LeadPipelineKanban
              enquiries={filteredEnquiries}
              onStatusChange={handleStatusChange}
              onSelectEnquiry={(card) => {
                setSelectedEnquiry(card);
                setIsDetailModalOpen(true);
              }}
              onConvertTrip={handleInitiateConvert}
              activeView={activeView}
              onToggleView={setActiveView}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenFilter={() => setIsFilterModalOpen(true)}
            />

            {/* 3. All Enquiries Data Table */}
            <EnquiriesTable
              enquiries={filteredEnquiries}
              onSelectEnquiry={(item) => {
                setSelectedEnquiry(item);
                setIsDetailModalOpen(true);
              }}
              onConvertTrip={handleInitiateConvert}
              onAddEnquiry={() => setIsAddModalOpen(true)}
              onExport={handleExportCSV}
              onStatusChange={handleStatusChange}
              onAssignOwner={handleAssignOwner}
              onDeleteEnquiry={handleDeleteEnquiry}
            />
          </div>
        </main>
      </div>

      {/* Add Enquiry Modal */}
      <AddEnquiryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewEnquiry}
      />

      {/* Convert to Trip Modal */}
      <ConvertTripModal
        isOpen={isConvertModalOpen}
        onClose={() => {
          setIsConvertModalOpen(false);
          setConvertTarget(null);
        }}
        enquiry={convertTarget}
        onConvert={handleConfirmConvertTrip}
      />

      {/* Enquiry Detail Inspection Modal */}
      <EnquiryDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedEnquiry(null);
        }}
        enquiry={selectedEnquiry}
        onStatusChange={handleStatusChange}
        onAssignOwner={handleAssignOwner}
        onConvertTrip={handleInitiateConvert}
        onAddTimelineNote={handleAddTimelineNote}
      />

      {/* Filter Modal */}
      <EnquiryFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onChangeFilter={(key, val) =>
          setFilters((prev) => ({ ...prev, [key]: val }))
        }
        onResetFilters={() =>
          setFilters({ status: "ALL", priority: "ALL", source: "ALL", owner: "ALL" })
        }
      />



      {/* Command Palette Modal (Ctrl + K) */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectAction={(action) => {
          setToast({
            title: action.title,
            message: action.subtitle,
            type: "info",
          });
        }}
      />
    </div>
  );
}

export default EnquiriesPage;
