import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import { accountsApi } from "../services/accountsApi";
import {
  MOCK_ACCOUNTS,
  computeAccountKPIs,
  computeAccountTabCounts,
} from "../data/mockAccountsData";

// Common Dashboard Shell Components
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";

// Accounts & Credit Components
import AccountKPIStats from "../components/AccountKPIStats";
import AccountFilterTabs from "../components/AccountFilterTabs";
import AccountsRegisterTable from "../components/AccountsRegisterTable";
import AccountCreditDetailPanel from "../components/AccountCreditDetailPanel";
import AdjustCreditLimitModal from "../components/AdjustCreditLimitModal";
import IssueCreditNoteModal from "../components/IssueCreditNoteModal";
import GrantOverrideModal from "../components/GrantOverrideModal";

// Styling
import "../styles/accounts.css";

export default function AccountsCreditPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Core Data State
  const [accounts, setAccounts] = useState(() => MOCK_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [liveStats, setLiveStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filtering & Search State
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("Oct 2026");

  // Shell & Navigation Drawers
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals State
  const [adjustModalAccount, setAdjustModalAccount] = useState(null);
  const [isCreditNoteModalOpen, setIsCreditNoteModalOpen] = useState(false);
  const [overrideModalAccount, setOverrideModalAccount] = useState(null);

  // Global Ctrl + K command palette
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

  // Fetch live accounts credit and portfolio stats
  const fetchAccountsData = useCallback(
    async ({ showLoader = false } = {}) => {
      if (showLoader) setIsLoading(true);
      else setIsSyncing(true);

      try {
        const [accountsData, statsData] = await Promise.all([
          accountsApi.getAccounts({
            status: activeTab,
            search: searchQuery,
            month: selectedMonth,
          }),
          accountsApi.getAccountStats().catch(() => null),
        ]);

        const list = Array.isArray(accountsData) ? accountsData : [];
        setAccounts(list);
        if (statsData) setLiveStats(statsData);

        if (list.length > 0) {
          setSelectedAccountId((prev) => {
            const exists = list.some((a) => a.id === prev || a.code === prev);
            return exists ? prev : list[0].id;
          });
        } else {
          setSelectedAccountId(null);
        }
      } catch (err) {
        console.error("Failed to load accounts credit:", err);
        setToast({
          type: "danger",
          title: "Connection Error",
          message:
            err.response?.data?.error ||
            err.message ||
            "Failed to load credit risk registry.",
        });
      } finally {
        setIsLoading(false);
        setIsSyncing(false);
      }
    },
    [activeTab, searchQuery, selectedMonth]
  );

  // Initial load & filter change
  useEffect(() => {
    fetchAccountsData({ showLoader: accounts.length === 0 });
  }, [fetchAccountsData]);

  // Compute live KPIs and tab counters
  const kpis = useMemo(() => {
    if (liveStats?.kpis) return liveStats.kpis;
    return computeAccountKPIs(accounts);
  }, [liveStats, accounts]);

  const counts = useMemo(() => {
    if (liveStats?.counts) return liveStats.counts;
    return computeAccountTabCounts(accounts);
  }, [liveStats, accounts]);

  // Selected account object
  const selectedAccount = useMemo(() => {
    return (
      accounts.find((a) => a.id === selectedAccountId || a.code === selectedAccountId) ||
      accounts[0] ||
      null
    );
  }, [accounts, selectedAccountId]);

  // Filtered accounts list
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // 1. Tab filter
      if (activeTab === "active" && acc.status !== "Active") return false;
      if (activeTab === "watchlist" && acc.status !== "Watchlist") return false;
      if (
        activeTab === "breached" &&
        acc.status !== "Blocked" &&
        Number(acc.utilizationRate || 0) <= 100
      )
        return false;
      if (activeTab === "healthy" && acc.status !== "Healthy") return false;

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (acc.name || "").toLowerCase().includes(query);
        const matchesCode = (acc.code || "").toLowerCase().includes(query);
        const matchesGstin = (acc.gstin || "").toLowerCase().includes(query);
        const matchesTerms = (acc.terms || "").toLowerCase().includes(query);
        const matchesTier = (acc.tier || "").toLowerCase().includes(query);
        if (
          !matchesName &&
          !matchesCode &&
          !matchesGstin &&
          !matchesTerms &&
          !matchesTier
        ) {
          return false;
        }
      }

      return true;
    });
  }, [accounts, activeTab, searchQuery]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      clearCurrentUser();
      navigate("/login");
    }
  };

  // KPI Card Click Filter
  const handleKpiFilterSelect = (filterId) => {
    setActiveTab(filterId);
  };

  // Adjust Credit Limit Callback
  const handleSaveAdjustLimit = async (updatedAccount, notes) => {
    try {
      setIsSyncing(true);
      const res = await accountsApi.adjustCreditLimit(updatedAccount.id, {
        creditLimit: updatedAccount.creditLimit,
        terms: updatedAccount.terms,
        securityDeposit: updatedAccount.bankGuarantee,
        depositType: updatedAccount.guaranteeRef,
        remarks: notes,
      });

      const updated = res.id ? res : updatedAccount;
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === updated.id || acc.code === updated.code ? updated : acc))
      );
      setAdjustModalAccount(null);
      setToast({
        type: "success",
        title: "Credit Limit Revised",
        message: `Sanctioned limit for ${updated.name} updated to ${updated.creditLimitDisplay}.${
          notes ? ` Rationale: ${notes}` : ""
        }`,
      });
      accountsApi.getAccountStats().then(setLiveStats).catch(() => {});
    } catch (err) {
      console.error("Adjust credit limit error:", err);
      setToast({
        type: "danger",
        title: "Update Failed",
        message: err.response?.data?.error || "Could not adjust credit limit.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Issue Credit Note Callback
  const handleIssueCreditNote = async (noteData) => {
    try {
      setIsSyncing(true);
      const res = await accountsApi.issueCreditNote(noteData.accountId, {
        amount: noteData.amount,
        reasonCode: noteData.reasonCode,
        invoiceRef: noteData.invoiceRef,
      });

      if (res.account) {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === res.account.id || acc.code === res.account.code ? res.account : acc
          )
        );
      }
      setIsCreditNoteModalOpen(false);
      setToast({
        type: "success",
        title: "Credit Note Issued",
        message: `Credit note of ${noteData.amountDisplay} issued against ${noteData.invoiceRef}.`,
      });
      accountsApi.getAccountStats().then(setLiveStats).catch(() => {});
    } catch (err) {
      console.error("Issue credit note error:", err);
      setToast({
        type: "danger",
        title: "Issuance Failed",
        message: err.response?.data?.error || "Could not issue credit note voucher.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Grant Override Callback
  const handleGrantOverride = async (overrideData) => {
    try {
      setIsSyncing(true);
      const res = await accountsApi.grantDispatchOverride(overrideData.accountId, {
        duration: overrideData.duration,
        bufferAmount: overrideData.bufferAmount,
        approver: overrideData.approver,
      });

      if (res.account) {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === res.account.id || acc.code === res.account.code ? res.account : acc
          )
        );
      }
      setOverrideModalAccount(null);
      setToast({
        type: "warning",
        title: "Dispatch Override Authorized",
        message: `Temporary ${overrideData.duration} override granted for ${overrideData.accountName}. Bookings resumed.`,
      });
      accountsApi.getAccountStats().then(setLiveStats).catch(() => {});
    } catch (err) {
      console.error("Grant override error:", err);
      setToast({
        type: "danger",
        title: "Override Failed",
        message: err.response?.data?.error || "Could not authorize emergency dispatch override.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Halt / Resume Bookings
  const handleToggleHaltBookings = async (account) => {
    try {
      setIsSyncing(true);
      const updated = await accountsApi.toggleHaltBookings(account.id);
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === account.id || acc.code === account.id ? updated : acc
        )
      );

      const isNowBlocked = updated.status === "Blocked";
      setToast({
        type: isNowBlocked ? "danger" : "success",
        title: isNowBlocked ? "Bookings Halted" : "Bookings Resumed",
        message: `${updated.name} is now ${
          isNowBlocked
            ? "blocked from creating or dispatching new trips."
            : "unblocked and active for live freight dispatch."
        }`,
      });
      accountsApi.getAccountStats().then(setLiveStats).catch(() => {});
    } catch (err) {
      console.error("Toggle halt bookings error:", err);
      setToast({
        type: "danger",
        title: "Action Failed",
        message: err.response?.data?.error || "Could not change account dispatch status.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Download Account Statement
  const handleDownloadStatement = (account) => {
    const statementRows = [
      ["Account Statement", account.name],
      ["Account ID", account.code],
      ["GSTIN", account.gstin],
      ["Credit Terms", account.terms],
      ["Credit Limit", account.creditLimitDisplay],
      ["Outstanding Balance", account.outstandingDisplay],
      ["Utilization Rate", `${account.utilizationRate}%`],
      ["Available Buffer", account.availableBufferDisplay],
      [
        "Bank Guarantee",
        `${account.bankGuaranteeDisplay} (${account.guaranteeRef})`,
      ],
      [],
      ["Recent Transactions:"],
      ["Date & Title", "Amount", "Balance After"],
      ...(account.transactions || []).map((tx) => [
        `"${tx.title} - ${tx.subtitle}"`,
        tx.amount,
        tx.balanceAfter,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      statementRows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HireD_Account_Statement_${account.code.replace("#", "")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      type: "info",
      title: "Statement Exported",
      message: `Downloaded CSV ledger statement for ${account.name}.`,
    });
  };

  // Export Full CSV Register
  const handleExportCSV = () => {
    const headers = [
      "Account ID",
      "Account Name",
      "Tier",
      "GSTIN",
      "Terms",
      "Credit Limit (INR)",
      "Outstanding (INR)",
      "Utilization (%)",
      "Available Buffer (INR)",
      "Current (<30D)",
      "1-30 Days",
      "31-60 Days",
      "60+ Days Delinquent",
      "Status",
      "Bank Guarantee",
      "Guarantee Ref",
    ];

    const rows = accounts.map((a) => [
      a.code,
      `"${a.name}"`,
      a.tier,
      a.gstin,
      a.terms,
      a.creditLimit,
      a.outstanding,
      `${a.utilizationRate}%`,
      a.availableBuffer,
      a.ageing?.currentDisplay || "0",
      a.ageing?.d30Display || "0",
      a.ageing?.d60Display || "0",
      a.ageing?.d90Display || "0",
      a.status,
      a.bankGuarantee,
      a.guaranteeRef,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell || ""}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HireD_Accounts_Credit_Register_${selectedMonth.replace(/\s+/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      type: "success",
      title: "CSV Export Complete",
      message: `Exported ${accounts.length} enterprise accounts with live credit metrics.`,
    });
  };

  // Refresh Ledger Trigger
  const handleRefresh = () => {
    fetchAccountsData({ showLoader: false });
    setToast({
      type: "info",
      title: "Syncing Live Ledger",
      message: "Fetching latest ERP invoices and bank settlement feeds...",
    });
  };

  const handleToggleColumns = () => {
    setToast({
      type: "info",
      title: "Column View",
      message: "Displaying standard financial audit column configuration.",
    });
  };

  return (
    <div className="accounts-page-shell" id="accounts-page-root">
      {/* Sidebar Navigation */}
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeModule="accounts-credit"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <div
        className={`accounts-content-viewport ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        {/* Top Header Navbar */}
        <AdminNavbar
          user={user}
          onLogout={handleLogout}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          backendStatus={{ isHealthy: true, checkedAt: "Just now" }}
          breadcrumbCurrent="Accounts & Credit"
          quickActionLabel="+ Credit Note"
          onQuickAction={() => setIsCreditNoteModalOpen(true)}
        />

        {/* Content Container */}
        <main className="accounts-main-container">
          <div className="accounts-page-container">
            {/* 1. Header Toolbar */}
            <div className="accounts-header">
              <div className="accounts-header-left">
                <div className="accounts-title-row">
                  <h1 className="accounts-title">Accounts &amp; Credit</h1>
                  <span className="accounts-financial-badge">
                    Ledger &amp; Financial Risk
                  </span>
                  {isSyncing && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--acc-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span className="material-symbols-outlined text-[14px] animate-spin">
                        sync
                      </span>
                      Syncing...
                    </span>
                  )}
                </div>
                <p className="accounts-subtitle">
                  Monitor corporate client credit utilization, aging receivables,
                  payment terms compliance, and manual dispatch risk locks.
                </p>
              </div>

              <div className="accounts-header-actions">
                {/* Month Selector */}
                <select
                  className="btn-accounts-tool"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  id="select-month-filter"
                >
                  <option value="Oct 2026">October 2026 (Live Cycle)</option>
                  <option value="Sep 2026">September 2026 (Closed)</option>
                  <option value="Aug 2026">August 2026 (Audited)</option>
                </select>

                {/* Column Toggle */}
                <button
                  type="button"
                  className="btn-accounts-tool"
                  onClick={handleToggleColumns}
                  id="btn-toggle-columns"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    view_column
                  </span>
                  <span>Columns</span>
                </button>

                {/* Export CSV */}
                <button
                  type="button"
                  className="btn-accounts-tool"
                  onClick={handleExportCSV}
                  id="btn-export-csv"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    file_download
                  </span>
                  <span>Export CSV</span>
                </button>

                {/* Refresh */}
                <button
                  type="button"
                  className="btn-accounts-tool"
                  onClick={handleRefresh}
                  disabled={isSyncing}
                  id="btn-refresh-ledger"
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isSyncing ? "animate-spin" : ""
                    }`}
                  >
                    refresh
                  </span>
                  <span>Refresh</span>
                </button>

                {/* Issue Credit Note Trigger */}
                <button
                  type="button"
                  className="btn-issue-credit-note"
                  onClick={() => setIsCreditNoteModalOpen(true)}
                  id="btn-issue-credit-note-header"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    receipt_long
                  </span>
                  <span>+ Credit Note</span>
                </button>
              </div>
            </div>

            {/* 2. KPI Summary Ribbon */}
            <AccountKPIStats
              kpis={kpis}
              selectedFilter={activeTab}
              onSelectFilter={handleKpiFilterSelect}
            />

            {/* 3. Filter Navigation Tabs */}
            <AccountFilterTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={counts}
            />

            {/* 4. Dual-Column Master-Detail Workspace */}
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4rem",
                  backgroundColor: "var(--acc-card)",
                  borderRadius: "var(--acc-radius-lg)",
                  border: "1px solid var(--acc-border)",
                  color: "var(--acc-text-muted)",
                  gap: "1rem",
                }}
              >
                <span
                  className="material-symbols-outlined animate-spin"
                  style={{ fontSize: "32px", color: "var(--acc-primary)" }}
                >
                  progress_activity
                </span>
                <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  Connecting to live financial risk ledger...
                </span>
              </div>
            ) : (
              <div className="accounts-workspace-grid">
                {/* Left Column: Register Table */}
                <AccountsRegisterTable
                  accounts={filteredAccounts}
                  selectedAccountId={selectedAccountId}
                  onSelectAccount={(acc) => setSelectedAccountId(acc.id)}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onOpenOverride={(acc) => setOverrideModalAccount(acc)}
                  onOpenAdjustLimit={(acc) => setAdjustModalAccount(acc)}
                />

                {/* Right Column: 360° Account Credit Detail Panel */}
                <AccountCreditDetailPanel
                  account={selectedAccount}
                  onOpenAdjustLimit={(acc) => setAdjustModalAccount(acc)}
                  onOpenOverride={(acc) => setOverrideModalAccount(acc)}
                  onToggleHaltBookings={handleToggleHaltBookings}
                  onDownloadStatement={handleDownloadStatement}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AdjustCreditLimitModal
        key={adjustModalAccount?.id || "adjust-limit"}
        isOpen={Boolean(adjustModalAccount)}
        onClose={() => setAdjustModalAccount(null)}
        account={adjustModalAccount}
        onSaveAdjust={handleSaveAdjustLimit}
      />

      <IssueCreditNoteModal
        isOpen={isCreditNoteModalOpen}
        onClose={() => setIsCreditNoteModalOpen(false)}
        accounts={accounts}
        onIssueCreditNote={handleIssueCreditNote}
      />

      <GrantOverrideModal
        key={overrideModalAccount?.id || "grant-override"}
        isOpen={Boolean(overrideModalAccount)}
        onClose={() => setOverrideModalAccount(null)}
        account={overrideModalAccount}
        onGrantOverride={handleGrantOverride}
      />

      {/* Slide-out Drawers & Palettes */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectCommand={(cmd) => {
          if (cmd.path) navigate(cmd.path);
        }}
      />

      {/* Toast Feedback */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
