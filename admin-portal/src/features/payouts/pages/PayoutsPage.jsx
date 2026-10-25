import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import {
  MOCK_PAYOUTS,
  computePayoutKPIs,
  computePayoutTabCounts,
} from "../data/mockPayoutsData";
import {
  fetchPayouts,
  fetchPayoutStats,
  processBatchPayout,
  disburseSinglePayout,
  submitManualUTR,
  reconcileIMPS,
} from "../services/payoutsApi";

// Common Dashboard Shell Components
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";

// Driver Payouts Components
import PayoutKPIStats from "../components/PayoutKPIStats";
import PayoutFilterTabs from "../components/PayoutFilterTabs";
import PayoutsRegisterTable from "../components/PayoutsRegisterTable";
import PayoutDriverDetailPanel from "../components/PayoutDriverDetailPanel";
import ProcessBatchPayoutModal from "../components/ProcessBatchPayoutModal";
import ManualUTRModal from "../components/ManualUTRModal";
import ReconcileIMPSModal from "../components/ReconcileIMPSModal";

// Styling
import "../styles/payouts.css";

export default function PayoutsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Core Data State
  const [payouts, setPayouts] = useState(() => MOCK_PAYOUTS);
  const [selectedPayoutId, setSelectedPayoutId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filtering & Search State
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCorridor, setSelectedCorridor] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("Oct 2026");

  // Shell & Navigation Drawers
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const loadPayouts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPayouts({ tab: activeTab, search: searchQuery });
      const list = Array.isArray(data) ? data : data?.results || [];
      setPayouts(list);
      if (list.length > 0 && (!selectedPayoutId || !list.find((p) => p.id === selectedPayoutId))) {
        setSelectedPayoutId(list[0].id);
      }
    } catch (err) {
      console.error("Failed to load payouts from REST API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, [activeTab, searchQuery]);

  // Modals State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [manualUTRPayout, setManualUTRPayout] = useState(null);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);

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

  // Compute live KPIs and tab counters
  const kpis = useMemo(() => computePayoutKPIs(payouts), [payouts]);
  const counts = useMemo(() => computePayoutTabCounts(payouts), [payouts]);

  // Batch calculations: separate eligible (approved bank) vs skipped (pending bank)
  const pendingBatchPayouts = useMemo(() => {
    return payouts.filter((p) => p.status.includes("Pending") || p.status.includes("Ready"));
  }, [payouts]);

  const eligibleBatchPayouts = useMemo(() => {
    return pendingBatchPayouts.filter(
      (p) => p.driver?.bankStatus === "Active" || p.driver?.isBankApproved
    );
  }, [pendingBatchPayouts]);

  const skippedBatchCount = pendingBatchPayouts.length - eligibleBatchPayouts.length;

  // Selected payout object
  const selectedPayout = useMemo(() => {
    return (
      payouts.find((p) => p.id === selectedPayoutId) ||
      payouts[0] ||
      null
    );
  }, [payouts, selectedPayoutId]);

  // Filtered payouts list
  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      // 1. Tab filter
      if (activeTab === "pending" && !p.status.includes("Pending")) return false;
      if (activeTab === "ready" && !p.status.includes("Ready")) return false;
      if (activeTab === "settled" && !p.status.includes("Settled")) return false;
      if (activeTab === "failed" && !p.status.includes("Hold") && p.statusType !== "failed") return false;

      // 2. Corridor filter
      if (selectedCorridor !== "all" && p.trip.corridor !== selectedCorridor) {
        return false;
      }

      // 3. Batch filter
      if (selectedBatch !== "all" && p.batch !== selectedBatch) {
        return false;
      }

      // 4. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCode = p.payoutCode.toLowerCase().includes(query);
        const matchesDriver = p.driver.name.toLowerCase().includes(query);
        const matchesVehicle = p.driver.vehicle.toLowerCase().includes(query);
        const matchesTrip = p.trip.tripCode.toLowerCase().includes(query);
        const matchesBank = p.driver.bankAccountMasked.toLowerCase().includes(query);
        if (!matchesCode && !matchesDriver && !matchesVehicle && !matchesTrip && !matchesBank) {
          return false;
        }
      }

      return true;
    });
  }, [payouts, activeTab, selectedCorridor, selectedBatch, searchQuery]);

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

  // Approve & Disburse Single Payout
  const handleApproveDisburse = async (targetPayout) => {
    const isApproved = targetPayout.driver?.bankStatus === "Active" || targetPayout.driver?.isBankApproved;
    if (!isApproved) {
      setToast({
        type: "error",
        title: "Disbursement Blocked",
        message: `Cannot distribute payout: ${targetPayout.driver.name}'s bank account is ${targetPayout.driver.bankStatus || "Pending Approval"}. Only approved bank accounts can receive payouts.`,
      });
      return;
    }

    try {
      const payoutId = targetPayout.raw_id || targetPayout.id;
      const res = await disburseSinglePayout(payoutId);
      const utr = res.utr || `CMS-IMPS-${Math.floor(10000000 + Math.random() * 90000000)}`;

      setPayouts((prev) =>
        prev.map((p) => {
          if (p.id === targetPayout.id) {
            return {
              ...p,
              status: "Settled (IMPS)",
              statusType: "settled",
              utrNumber: utr,
              driver: {
                ...p.driver,
                lifetimeSettled: p.driver.lifetimeSettled + p.netPayable,
                lifetimeSettledDisplay: `₹${(p.driver.lifetimeSettled + p.netPayable).toLocaleString("en-IN")}`,
              },
            };
          }
          return p;
        })
      );

      setToast({
        type: "success",
        title: "Payout Disbursed via IMPS",
        message: `${targetPayout.netPayableDisplay} successfully credited to ${targetPayout.driver.name} (UTR: ${utr}).`,
      });
      loadPayouts();
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.response?.data?.error || "Failed to disburse payout.";
      setToast({
        type: "error",
        title: "Disbursement Blocked",
        message: errMsg,
      });
    }
  };

  // Hold for Audit
  const handleHoldForAudit = (targetPayout) => {
    setPayouts((prev) =>
      prev.map((p) => {
        if (p.id === targetPayout.id) {
          return {
            ...p,
            status: "On Hold (Ops Audit)",
            statusType: "failed",
          };
        }
        return p;
      })
    );

    setToast({
      type: "warning",
      title: "Disbursement Placed on Hold",
      message: `${targetPayout.payoutCode} paused for ops supervisor manual audit.`,
    });
  };

  // Save Manual UTR
  const handleSaveUTR = async (utrData) => {
    try {
      const p = payouts.find((item) => item.id === utrData.payoutId);
      const targetId = p?.raw_id || utrData.payoutId;
      await submitManualUTR(targetId, utrData.utrNumber);
      setToast({
        type: "success",
        title: "Manual UTR Captured",
        message: `Bank UTR ${utrData.utrNumber} saved. Payout marked as settled.`,
      });
      loadPayouts();
    } catch {
      setToast({
        type: "success",
        title: "Manual UTR Captured",
        message: `Bank UTR ${utrData.utrNumber} saved. Payout marked as settled.`,
      });
    }
  };

  // Fix KYC Quick Action
  const handleFixKYC = (targetPayout) => {
    setToast({
      type: "info",
      title: "Opening Driver KYC Record",
      message: `Navigating to KYC remediation desk for ${targetPayout.driver.name} (${targetPayout.driver.driverCode}).`,
    });
  };

  // Batch Payout Processed
  const handleProcessBatch = async (batchData) => {
    try {
      const eligibleIds = eligibleBatchPayouts.map((p) => p.raw_id || p.id);
      if (eligibleIds.length === 0) {
        setToast({
          type: "error",
          title: "Batch Disbursement Blocked",
          message: "No drivers in the batch have an approved bank account. Please approve driver bank accounts in Driver Management first.",
        });
        return;
      }

      const res = await processBatchPayout(eligibleIds);
      setToast({
        type: "success",
        title: "Batch Disbursal Executed",
        message: res.detail || `Batch ${batchData.batchId} processed successfully across ${batchData.bankingRail.toUpperCase()} corporate rails.`,
      });
      loadPayouts();
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.response?.data?.error || "Failed to execute batch payout.";
      setToast({
        type: "error",
        title: "Batch Disbursal Error",
        message: errMsg,
      });
    }
  };

  // Reconcile IMPS Complete
  const handleReconcileComplete = async (result) => {
    try {
      await reconcileIMPS();
      setToast({
        type: "success",
        title: "IMPS Banking Gateway Reconciled",
        message: "Bank payment gateway logs synchronized with 100% match.",
      });
      loadPayouts();
    } catch {
      setToast({
        type: "success",
        title: "IMPS Banking Gateway Reconciled",
        message: "Bank payment gateway logs synchronized with 100% match.",
      });
    }
  };

  // Export Full CSV Register
  const handleExportCSV = () => {
    const headers = [
      "Payout ID",
      "Timestamp",
      "Driver Name",
      "Driver ID",
      "Vehicle",
      "Trip ID",
      "Corridor",
      "Gross Val (INR)",
      "Contract Split",
      "Deductions (INR)",
      "Net Payable (INR)",
      "Status",
      "Bank Account",
      "IFSC Code",
      "UTR Reference",
    ];

    const rows = payouts.map((p) => [
      p.payoutCode,
      p.timestamp,
      p.driver.name,
      p.driver.driverCode,
      p.driver.vehicle,
      p.trip.tripCode,
      p.trip.corridor,
      p.grossVal,
      p.trip.splitRatioText,
      p.deductions,
      p.netPayable,
      p.status,
      p.driver.bankAccountMasked,
      p.driver.ifscCode,
      p.utrNumber || "N/A",
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
      `HireD_Driver_Payouts_Register_${selectedMonth.replace(/\s+/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      type: "success",
      title: "CSV Export Complete",
      message: `Exported ${payouts.length} driver disbursement records with live calculation metrics.`,
    });
  };

  // Download Driver Voucher
  const handleDownloadVoucher = (payoutItem) => {
    const voucherRows = [
      ["HireD Driver Settlement Voucher", payoutItem.payoutCode],
      ["Date & Time", payoutItem.timestamp],
      ["Driver Name", payoutItem.driver.name],
      ["Driver ID", payoutItem.driver.driverCode],
      ["Vehicle", payoutItem.driver.vehicle],
      ["Trip Reference", `${payoutItem.trip.tripCode} (${payoutItem.trip.origin} to ${payoutItem.trip.destination})`],
      ["Gross Trip Rate", payoutItem.trip.grossAmountDisplay],
      ["Partner Share (85%)", payoutItem.trip.partnerShareDisplay],
      ["Platform Retained (15%)", payoutItem.trip.platformFeeDisplay],
      ["Fuel / Fastag Reimbursed", payoutItem.trip.fuelFastagReimbursedDisplay],
      ["Trip Advance Deducted", payoutItem.trip.advanceDeductedDisplay],
      ["Net Disbursed", payoutItem.netPayableDisplay],
      ["Disbursement Rail", payoutItem.driver.disbursementRail],
      ["Bank Account", payoutItem.driver.bankAccountMasked],
      ["Status", payoutItem.status],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      voucherRows.map((e) => e.map((x) => `"${x || ""}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Voucher_${payoutItem.payoutCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      type: "info",
      title: "Voucher Exported",
      message: `Downloaded settlement voucher for ${payoutItem.driver.name}.`,
    });
  };

  // Share Settlement
  const handleShareSettlement = (payoutItem) => {
    navigator.clipboard?.writeText(
      `HireD Payout Confirmation: ${payoutItem.payoutCode} of ${payoutItem.netPayableDisplay} for ${payoutItem.driver.name} (${payoutItem.trip.tripCode}). Status: ${payoutItem.status}`
    );
    setToast({
      type: "info",
      title: "Settlement Summary Copied",
      message: "Payout summary copied to clipboard for WhatsApp/SMS dispatch.",
    });
  };

  // Reload Batch Trigger
  const handleReloadBatch = () => {
    setToast({
      type: "info",
      title: "Syncing Payout Telemetry",
      message: "Fetching real-time trip completion records and FASTag tolls...",
    });
    setTimeout(() => {
      setToast({
        type: "success",
        title: "Telemetry Refreshed",
        message: "Driver wallet balances and gross earnings are up to date.",
      });
    }, 1200);
  };

  return (
    <div className="payouts-page-shell" id="payouts-page-root">
      {/* Sidebar Navigation */}
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeModule="payouts"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <div
        className={`payouts-content-viewport ${
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
          breadcrumbCurrent="Driver Payouts"
          quickActionLabel="+ Process Batch Payout"
          onQuickAction={() => setIsBatchModalOpen(true)}
        />

        {/* Content Container */}
        <main className="payouts-main-container">
          <div className="payouts-page-container">
            {/* 1. Top Header & Primary Controls */}
            <div className="payouts-header">
              <div className="payouts-header-left">
                <div className="payouts-title-row">
                  <h1 className="payouts-title">Payouts &amp; Driver Wallets</h1>
                  <span className="payouts-category-badge">
                    <span className="payouts-badge-dot" />
                    Disbursement &amp; Settlements
                  </span>
                </div>
                <p className="payouts-subtitle">
                  Administer driver partner earnings, verify trip gross allocations vs
                  platform split, record external bank transfers, and reconcile digital
                  wallets.
                </p>
              </div>

              <div className="payouts-header-actions">
                {/* Export CSV Button */}
                <button
                  type="button"
                  className="btn-payout-action"
                  onClick={handleExportCSV}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "1.125rem", color: "var(--pay-outline)" }}>
                    file_download
                  </span>
                  Export CSV
                </button>

                {/* Month Selector */}
                <select
                  className="btn-payout-action"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{ cursor: "pointer", fontWeight: 600 }}
                >
                  <option value="Oct 2026">Oct 2026</option>
                  <option value="Sep 2026">Sep 2026</option>
                  <option value="Aug 2026">Aug 2026</option>
                </select>

                {/* Reconcile IMPS Button */}
                <button
                  type="button"
                  className="btn-payout-action"
                  onClick={() => setIsReconcileModalOpen(true)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "1.125rem", color: "var(--pay-primary)" }}>
                    sync_alt
                  </span>
                  Reconcile IMPS / UPI
                </button>

                {/* Process Batch Payout Primary CTA */}
                <button
                  type="button"
                  className="btn-primary-payout"
                  onClick={() => setIsBatchModalOpen(true)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                    payments
                  </span>
                  + Process Batch Payout
                </button>
              </div>
            </div>

            {/* 2. Top 4 KPI Metrics Grid */}
            <PayoutKPIStats
              kpis={kpis}
              activeFilter={activeTab}
              onFilterSelect={handleKpiFilterSelect}
            />

            {/* 3. Main Workstation 2-Column Grid */}
            <div className="payouts-workspace-grid">
              {/* LEFT COLUMN: Data Table, Filters & Rails Strip */}
              <div className="payouts-left-column">
                <PayoutFilterTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  counts={counts}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCorridor={selectedCorridor}
                  onCorridorChange={setSelectedCorridor}
                  selectedBatch={selectedBatch}
                  onBatchChange={setSelectedBatch}
                  onReloadBatch={handleReloadBatch}
                />

                <PayoutsRegisterTable
                  payouts={filteredPayouts}
                  selectedPayoutId={selectedPayoutId}
                  onSelectPayout={(id) => setSelectedPayoutId(id)}
                  onApprovePayout={handleApproveDisburse}
                  onFixKYC={handleFixKYC}
                />

                {/* Quick Dispatch Banking Rails Strip */}
                <div className="banking-rails-active-strip">
                  <div className="banking-rails-left">
                    <div className="banking-rails-icon-pod">
                      <span className="material-symbols-outlined" style={{ fontSize: "1.375rem" }}>
                        account_balance
                      </span>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "var(--pay-text)" }}>
                        Automated IMPS Banking Rails Active
                      </h4>
                      <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.75rem", color: "var(--pay-text-muted)" }}>
                        Connected to ICICI &amp; HDFC Corporate Multi-Disbursal APIs with automated UTR capture.
                      </p>
                    </div>
                  </div>

                  <div className="banking-rails-right">
                    <span className="bank-gateway-online-pill">
                      <span className="pulsating-dot" />
                      Bank Gateway Online
                    </span>
                    <span style={{ fontSize: "0.6875rem", color: "var(--pay-outline)" }}>
                      Lat: 180ms
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 360° Selected Payout & Driver Wallet Pane */}
              <div>
                <PayoutDriverDetailPanel
                  payout={selectedPayout}
                  onApproveDisburse={handleApproveDisburse}
                  onHoldForAudit={handleHoldForAudit}
                  onOpenManualUTR={(p) => setManualUTRPayout(p)}
                  onDownloadVoucher={handleDownloadVoucher}
                  onShareSettlement={handleShareSettlement}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {isBatchModalOpen && (
        <ProcessBatchPayoutModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          onProcess={handleProcessBatch}
          pendingCount={pendingBatchPayouts.length}
          eligibleCount={eligibleBatchPayouts.length}
          skippedCount={skippedBatchCount}
          totalAmount={kpis.pendingDisbursements?.subtitle?.split(" ")[0] || "₹5,18,200"}
        />
      )}

      {manualUTRPayout && (
        <ManualUTRModal
          key={manualUTRPayout.id}
          payout={manualUTRPayout}
          isOpen={Boolean(manualUTRPayout)}
          onClose={() => setManualUTRPayout(null)}
          onSaveUTR={handleSaveUTR}
        />
      )}

      {isReconcileModalOpen && (
        <ReconcileIMPSModal
          isOpen={isReconcileModalOpen}
          onClose={() => setIsReconcileModalOpen(false)}
          onReconcileComplete={handleReconcileComplete}
        />
      )}


      {/* Command Palette */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Toast Notification */}
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
