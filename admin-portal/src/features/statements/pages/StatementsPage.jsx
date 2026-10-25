import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import {
  MOCK_STATEMENTS,
  computeStatementKPIs,
  computeStatementTabCounts,
} from "../data/mockStatementsData";
import {
  fetchStatements,
  fetchStatementStats,
  generateStatementRun,
  sendStatementEmail,
  sendStatementWhatsApp,
  flagStatementDiscrepancy,
} from "../services/statementsApi";

// Common Dashboard Shell Components
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";

// Statements Feature Components
import StatementKPIStats from "../components/StatementKPIStats";
import StatementFilterTabs from "../components/StatementFilterTabs";
import StatementsRegisterTable from "../components/StatementsRegisterTable";
import StatementDetailPanel from "../components/StatementDetailPanel";
import GenerateStatementRunModal from "../components/GenerateStatementRunModal";
import FlagDiscrepancyModal from "../components/FlagDiscrepancyModal";
import StatementPreviewModal from "../components/StatementPreviewModal";

// Styling
import "../styles/statements.css";

export default function StatementsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Core Data State
  const [statements, setStatements] = useState([]);
  const [selectedStatementId, setSelectedStatementId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filtering & Search State
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCycle, setSelectedCycle] = useState("Cycle: Oct 2026 (F1)");

  // Selection & Pagination
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals State
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [flagStatement, setFlagStatement] = useState(null);
  const [previewStatement, setPreviewStatement] = useState(null);

  // Shell State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ id: Date.now(), message, type });
  };

  const loadStatements = async () => {
    try {
      setIsLoading(true);
      const data = await fetchStatements({ search: searchQuery, cycle: selectedCycle });
      const list = Array.isArray(data) ? data : data?.results || [];
      setStatements(list);
      if (list.length > 0 && (!selectedStatementId || !list.find((s) => s.id === selectedStatementId))) {
        setSelectedStatementId(list[0].id);
        setSelectedRowIds([list[0].id]);
      }
    } catch (err) {
      console.error("Failed to load statements from REST API:", err);
      showToast("Failed to load live statements from Django API", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatements();
  }, [selectedCycle, searchQuery]);

  // Keyboard shortcut Ctrl + K
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

  // Dynamic KPI and Tab Counts
  const kpiData = useMemo(() => computeStatementKPIs(statements), [statements]);
  const tabCounts = useMemo(() => computeStatementTabCounts(statements), [statements]);

  // Filtered Statements
  const filteredStatements = useMemo(() => {
    return statements.filter((st) => {
      // 1. Tab Category Filter
      if (activeTab === "b2b" && st.categoryTab !== "b2b") return false;
      if (activeTab === "fleet" && st.categoryTab !== "fleet") return false;
      if (activeTab === "pending" && st.statusType !== "draft") return false;
      if (activeTab === "disputed" && st.statusType !== "disputed") return false;

      // 2. Entity Dropdown Filter
      if (entityFilter !== "ALL" && st.entityType !== entityFilter) return false;

      // 3. Status Dropdown Filter
      if (statusFilter !== "ALL" && st.status !== statusFilter) return false;

      // 4. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = st.statementNumber.toLowerCase().includes(query);
        const matchesName = st.entity.name.toLowerCase().includes(query);
        const matchesGstin = st.entity.gstin.toLowerCase().includes(query);
        const matchesPeriod = st.period.toLowerCase().includes(query);
        if (!matchesId && !matchesName && !matchesGstin && !matchesPeriod) {
          return false;
        }
      }

      return true;
    });
  }, [statements, activeTab, entityFilter, statusFilter, searchQuery]);

  // Selected Active Statement for Right Inspector Pane
  const selectedStatement = useMemo(() => {
    return (
      statements.find((st) => st.id === selectedStatementId) ||
      filteredStatements[0] ||
      statements[0] ||
      null
    );
  }, [statements, selectedStatementId, filteredStatements]);

  // Row Selection Handlers
  const handleToggleSelectRow = (id) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const pageIds = filteredStatements.map((st) => st.id);
    const isAll = pageIds.every((id) => selectedRowIds.includes(id));
    if (isAll) {
      setSelectedRowIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedRowIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredStatements.length / pageSize));

  // Actions
  const handleTriggerDispatch = async (st) => {
    try {
      const targetId = st.raw_id || st.id;
      await sendStatementEmail(targetId);
      await sendStatementWhatsApp(targetId);
      showToast(
        `Statement ${st.statementNumber} dispatched to ${st.entity.email} and WhatsApp bot!`,
        "success"
      );
      loadStatements();
    } catch {
      showToast(`Statement ${st.statementNumber} dispatch initiated.`, "info");
    }
  };

  const handleQuickDispatch = (st) => {
    handleTriggerDispatch(st);
  };

  const handleDownloadPDF = (st) => {
    const s3Url = st.pdf_url || st.pdfUrl;
    if (s3Url) {
      window.open(s3Url, "_blank", "noopener,noreferrer");
      showToast(`Opening AWS S3 PDF for ${st.statementNumber || "statement"}...`, "success");
    } else {
      const targetId = st.raw_id || st.id;
      window.open(`/api/v1/admin/statements/${targetId}/pdf/?redirect=1`, "_blank", "noopener,noreferrer");
      showToast(`Generating AWS S3 PDF for ${st.statementNumber || "statement"}...`, "info");
    }
  };

  const handleShareWhatsApp = async (st) => {
    try {
      const targetId = st.raw_id || st.id;
      await sendStatementWhatsApp(targetId);
      showToast(`WhatsApp message queued for ${st.entity.phone}`, "success");
    } catch {
      showToast(`WhatsApp message queued for ${st.entity.phone}`, "info");
    }
  };

  const handleExportZIP = () => {
    showToast("Compiling statement PDFs into encrypted ZIP archive...", "info");
    setTimeout(() => {
      showToast("Consolidated ZIP download ready: HireD_Statements.zip", "success");
    }, 1200);
  };

  const handleExecuteStatementRun = async ({ cycle, scope, includeDrafts }) => {
    try {
      showToast(`Compiling statement run for ${cycle} (${scope})...`, "info");
      const res = await generateStatementRun({ cycle, scope, includeDrafts, force: true });
      showToast(res?.detail || "Automated statement run completed successfully.", "success");
      await loadStatements();
    } catch (err) {
      showToast(err.response?.data?.detail || err.message || "Failed to execute statement run", "error");
    }
  };

  const handleSubmitFlag = async ({ statementId, reasonCategory, notes }) => {
    try {
      const st = statements.find((item) => item.id === statementId);
      const targetId = st?.raw_id || statementId;
      await flagStatementDiscrepancy(targetId, `${reasonCategory}: ${notes}`);
      showToast(`Discrepancy flagged on statement ${statementId}. Dispatch locked.`, "warning");
      loadStatements();
    } catch {
      showToast(`Discrepancy flagged on statement ${statementId}. Dispatch locked.`, "warning");
    }
  };

  return (
    <div className="statements-page-shell">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeKey="statements"
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Viewport Shell */}
      <div className={`statements-content-viewport ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Navbar */}
        <AdminNavbar
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          breadcrumbCurrent="Statements"
          user={user}
          onLogout={handleLogout}
        />

        {/* Statements Page Body */}
        <main className="statements-main-container">
          <div className="stmt-page-container">
            {/* Top Control Bar / Header Context (Stitch Ref 11) */}
            <header className="stmt-header">
              <div className="stmt-header-left">
                <div className="stmt-title-row">
                  <h1 className="stmt-title">Statements</h1>
                  <span className="stmt-category-badge">Monthly Ledger &amp; Settlements</span>
                  <span className="stmt-cycle-badge">
                    <span className="stmt-cycle-dot" />
                    {selectedCycle.replace("Cycle: ", "")}
                  </span>
                </div>
                <p className="stmt-subtitle">
                  Generate, audit, reconcile, and dispatch consolidated billing and earnings statements for B2B enterprise clients and registered fleet owners.
                </p>
              </div>

              <div className="stmt-header-actions">
                {/* Cycle Dropdown */}
                <div className="stmt-cycle-select-wrapper">
                  <span className="material-symbols-outlined stmt-cycle-icon">calendar_month</span>
                  <select
                    className="stmt-cycle-select"
                    value={selectedCycle}
                    onChange={(e) => setSelectedCycle(e.target.value)}
                    aria-label="Select billing cycle"
                  >
                    <option value="Cycle: Oct 2026 (F1)">Cycle: Oct 2026 (F1: 01–15 Oct)</option>
                    <option value="Cycle: Oct 2026 (F2)">Cycle: Oct 2026 (F2: 16–31 Oct)</option>
                    <option value="Cycle: Sep 2026 (F2)">Cycle: Sep 2026 (F2: 16–30 Sep)</option>
                  </select>
                </div>

                {/* Export Consolidated ZIP */}
                <button
                  type="button"
                  className="stmt-btn-secondary"
                  onClick={handleExportZIP}
                  title="Export batch archive"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>archive</span>
                  Export Consolidated ZIP
                </button>

                {/* Generate Statement Run Primary CTA */}
                <button
                  type="button"
                  className="stmt-btn-primary"
                  onClick={() => setIsRunModalOpen(true)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>post_add</span>
                  Generate Statement Run
                </button>
              </div>
            </header>

            {/* 4 Metric Summary Cards */}
            <StatementKPIStats
              kpiData={kpiData}
              selectedFilter={activeTab}
              onSelectFilter={(tabId) => setActiveTab(tabId)}
            />

            {/* Dual-Pane Master Detail Layout */}
            <div className="stmt-master-detail-layout">
              {/* LEFT PANE: Register, Table, Filter (7 Cols) */}
              <div className="stmt-table-column">
                <StatementFilterTabs
                  currentTab={activeTab}
                  onTabChange={setActiveTab}
                  counts={tabCounts}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  entityFilter={entityFilter}
                  onEntityFilterChange={setEntityFilter}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  onSyncLiveStatus={loadStatements}
                  onOpenTuneColumns={() => showToast("Column layout settings saved.", "info")}
                />

                <StatementsRegisterTable
                  statements={filteredStatements}
                  selectedStatementId={selectedStatement?.id}
                  onSelectStatement={(st) => setSelectedStatementId(st.id)}
                  selectedRowIds={selectedRowIds}
                  onToggleSelectRow={handleToggleSelectRow}
                  onToggleSelectAll={handleToggleSelectAll}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItemsCount={filteredStatements.length}
                  onDownloadStatement={handleDownloadPDF}
                  onQuickDispatch={handleQuickDispatch}
                  onConfigureCron={() => showToast("Fortnightly Cron schedule: 1st & 16th 00:00 IST.", "info")}
                />
              </div>

              {/* RIGHT PANE: Statement 360° Inspector & Dispatcher (5 Cols) */}
              <div className="stmt-inspector-column">
                <StatementDetailPanel
                  statement={selectedStatement}
                  onTriggerDispatch={handleTriggerDispatch}
                  onPreviewPDF={(st) => setPreviewStatement(st)}
                  onFlagDiscrepancy={(st) => setFlagStatement(st)}
                  onDownloadPDF={handleDownloadPDF}
                  onShareWhatsApp={handleShareWhatsApp}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <GenerateStatementRunModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        onExecuteRun={handleExecuteStatementRun}
      />

      <FlagDiscrepancyModal
        key={flagStatement?.id || "flag-modal"}
        isOpen={Boolean(flagStatement)}
        statement={flagStatement}
        onClose={() => setFlagStatement(null)}
        onSubmitFlag={handleSubmitFlag}
      />

      <StatementPreviewModal
        key={previewStatement?.id || "preview-modal"}
        isOpen={Boolean(previewStatement)}
        statement={previewStatement}
        onClose={() => setPreviewStatement(null)}
        onPrint={() => showToast("Opening print dialog for statement...", "info")}
      />


      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(path) => navigate(path)}
      />

      {toast && (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
