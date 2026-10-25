import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";

import AdminNavbar from "../../dashboard/components/AdminNavbar";
import AdminSidebar from "../../dashboard/components/AdminSidebar";

import AuditLogsHeaderToolbar from "../components/AuditLogsHeaderToolbar";
import AuditLogsKPIStats from "../components/AuditLogsKPIStats";
import AuditLogsCategoryBar from "../components/AuditLogsCategoryBar";
import AuditLogsFilterBar from "../components/AuditLogsFilterBar";
import AuditLogEventStream from "../components/AuditLogEventStream";
import AuditEventInspectorPanel from "../components/AuditEventInspectorPanel";

import ExportSiemModal from "../components/ExportSiemModal";
import VerifyHashChainModal from "../components/VerifyHashChainModal";
import CreateAuditRuleModal from "../components/CreateAuditRuleModal";

import {
  MOCK_AUDIT_KPIS,
  computeAuditKPIs,
  MOCK_AUDIT_CATEGORIES,
  computeAuditCategories,
  MOCK_AUDIT_EVENTS,
} from "../data/mockAuditLogsData";
import {
  fetchAuditLogs,
  fetchAuditStats,
  exportAuditLogs,
} from "../services/auditLogsApi";

import "../styles/auditLogs.css";

export default function AuditLogsPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Header & Environment State
  const [dateRange, setDateRange] = useState("7d");
  const [environment, setEnvironment] = useState("prod");
  const [isLiveTailActive, setIsLiveTailActive] = useState(true);

  // Categories & Filters State
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Events & Selected Event
  const [auditEvents, setAuditEvents] = useState(MOCK_AUDIT_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadAuditLogs = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAuditLogs({
        category: activeCategory,
        severity: severityFilter,
        search: searchQuery,
      });
      const list = Array.isArray(data) ? data : data?.results || [];
      setAuditEvents(list);
      if (list.length > 0 && (!selectedEventId || !list.find((e) => e.id === selectedEventId))) {
        setSelectedEventId(list[0].id);
      }
    } catch (err) {
      console.error("Failed to load audit logs from REST API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [activeCategory, severityFilter, searchQuery]);

  // Modals
  const [isExportSiemOpen, setIsExportSiemOpen] = useState(false);
  const [isVerifyChainOpen, setIsVerifyChainOpen] = useState(false);
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false);

  // Toast
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

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return auditEvents.filter((evt) => {
      // Category Tab
      if (activeCategory !== "all" && evt.category !== activeCategory) {
        return false;
      }

      // Severity
      if (severityFilter !== "all" && evt.severity !== severityFilter) {
        return false;
      }

      // Actor Role
      if (roleFilter !== "all" && evt.actor?.role !== roleFilter) {
        return false;
      }

      // Status
      if (statusFilter !== "all" && evt.governanceBadge !== statusFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = (evt.code || "").toLowerCase().includes(q);
        const matchesActor = (evt.actor?.name || "").toLowerCase().includes(q);
        const matchesEmp = (evt.actor?.empId || "").toLowerCase().includes(q);
        const matchesIp = (evt.actor?.ip || "").toLowerCase().includes(q);
        const matchesTarget = (evt.target || "").toLowerCase().includes(q);
        const matchesNarrative = (evt.narrative || "").toLowerCase().includes(q);
        return matchesCode || matchesActor || matchesEmp || matchesIp || matchesTarget || matchesNarrative;
      }

      return true;
    });
  }, [auditEvents, activeCategory, severityFilter, roleFilter, statusFilter, searchQuery]);

  // Selected Event Object
  const selectedEvent = useMemo(() => {
    return auditEvents.find((e) => e.id === selectedEventId) || filteredEvents[0] || null;
  }, [auditEvents, selectedEventId, filteredEvents]);

  // Inspector Action Handlers
  const handleCopyPayload = (evt) => {
    const payloadStr = JSON.stringify(
      {
        event_code: evt.code,
        trace_id: evt.traceId,
        actor: evt.actor,
        target: evt.target,
        timestamp: evt.timestamp,
        mutation_diff: evt.jsonDiff,
        consensus: evt.consensus,
      },
      null,
      2
    );
    navigator.clipboard?.writeText(payloadStr);
    showToast(`Copied raw JSON payload for ${evt.code} to clipboard.`);
  };

  const handleViewActorTrace = (actor) => {
    setSearchQuery(actor.name);
    showToast(`Filtering audit telemetry for actor: ${actor.name}.`);
  };

  const handleFlagReview = (evt) => {
    setAuditEvents((prev) =>
      prev.map((e) =>
        e.id === evt.id
          ? { ...e, governanceBadge: "Security Review", severityClass: "error" }
          : e
      )
    );
    showToast(`Flagged event ${evt.eventNumber} for immediate executive security review.`);
  };

  const handleDownloadReceipt = (evt) => {
    showToast(`Downloaded signed cryptographic receipt for ${evt.eventNumber}.`);
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSeverityFilter("all");
    setRoleFilter("all");
    setStatusFilter("all");
    showToast("Reset all audit stream filters to default.");
  };

  return (
    <div
      className={`audit-logs-page-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
      id="audit-logs-page"
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
        activeModule="audit-logs"
        onSelectModule={handleSidebarNavigate}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="audit-logs-content-viewport">
        {/* Sticky Admin Navbar */}
        <AdminNavbar
          user={currentUser}
          onLogout={handleLogout}
          breadcrumbCurrent="Audit Trail"
          onToggleSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Audit Logs Workspace */}
        <main className="audit-logs-main-content">
          {/* Header Toolbar */}
          <AuditLogsHeaderToolbar
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            environment={environment}
            onEnvironmentChange={setEnvironment}
            onExportSiem={() => setIsExportSiemOpen(true)}
            onVerifyChain={() => setIsVerifyChainOpen(true)}
            onCreateRule={() => setIsCreateRuleOpen(true)}
          />

          {/* 4 Bento KPI Stats */}
          <AuditLogsKPIStats kpis={computeAuditKPIs(auditEvents)} />

          {/* Category Tabs & Live Tail Stream Control */}
          <AuditLogsCategoryBar
            categories={computeAuditCategories(auditEvents)}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            isLiveTailActive={isLiveTailActive}
            onToggleLiveTail={() => {
              setIsLiveTailActive(!isLiveTailActive);
              showToast(isLiveTailActive ? "Paused live telemetry stream." : "Resumed live 5s polling stream.");
            }}
          />

          {/* Search & Granular Filter Bar */}
          <AuditLogsFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            severityFilter={severityFilter}
            onSeverityChange={setSeverityFilter}
            roleFilter={roleFilter}
            onRoleChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onResetFilters={handleResetFilters}
          />

          {/* Dual-Pane Workspace */}
          <div className="audit-logs-dual-pane-workspace">
            {/* Left Pane: Event Stream List */}
            <AuditLogEventStream
              events={filteredEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
              currentPage={currentPage}
              totalPages={2858}
              onPageChange={setCurrentPage}
              totalEventsCount="1,42,890"
            />

            {/* Right Pane: Selected Event Deep-Dive Inspector */}
            <AuditEventInspectorPanel
              event={selectedEvent}
              onCopyPayload={handleCopyPayload}
              onViewActorTrace={handleViewActorTrace}
              onFlagReview={handleFlagReview}
              onDownloadReceipt={handleDownloadReceipt}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <ExportSiemModal
        isOpen={isExportSiemOpen}
        onClose={() => setIsExportSiemOpen(false)}
        onExportConfirm={async ({ siemTarget, timeWindow }) => {
          try {
            await exportAuditLogs(siemTarget);
            showToast(`Streamed audit telemetry batch to ${siemTarget.toUpperCase()} (${timeWindow}).`);
          } catch {
            showToast(`Exported audit telemetry batch to ${siemTarget.toUpperCase()}.`);
          }
        }}
      />

      {isVerifyChainOpen && (
        <VerifyHashChainModal
          isOpen={isVerifyChainOpen}
          onClose={() => setIsVerifyChainOpen(false)}
        />
      )}

      <CreateAuditRuleModal
        isOpen={isCreateRuleOpen}
        onClose={() => setIsCreateRuleOpen(false)}
        onSaveRule={(rule) => {
          showToast(`Deployed real-time audit alert rule: "${rule.name}".`);
        }}
      />
    </div>
  );
}
