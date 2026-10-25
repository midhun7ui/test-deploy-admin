import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import { invoicingApi } from "../services/invoicingApi";
import {
  MOCK_INVOICES,
  computeInvoiceKPIs,
  computeInvoiceTabCounts,
} from "../data/mockInvoicingData";

// Common Dashboard Shell Components
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";

// Invoicing Feature Components
import InvoiceKPIStats from "../components/InvoiceKPIStats";
import InvoiceFilterTabs from "../components/InvoiceFilterTabs";
import InvoicesRegisterTable from "../components/InvoicesRegisterTable";
import InvoiceDetailPanel from "../components/InvoiceDetailPanel";
import CreateInvoiceModal from "../components/CreateInvoiceModal";
import RequestRevisionModal from "../components/RequestRevisionModal";
import InvoicePreviewModal from "../components/InvoicePreviewModal";

// GST Compliance & Per-Order / Payout Modals
import CreateOrderInvoiceModal from "../components/CreateOrderInvoiceModal";
import CreatePayoutInvoiceModal from "../components/CreatePayoutInvoiceModal";
import OrderInvoiceDetailModal from "../components/OrderInvoiceDetailModal";
import PayoutInvoiceDetailModal from "../components/PayoutInvoiceDetailModal";

// Styling
import "../styles/invoicing.css";

export default function InvoicingPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Active Main Hub Tab: "orders" | "payouts" | "statements"
  const [hubMode, setHubMode] = useState("orders");

  // Core Data State - Statements
  const [invoices, setInvoices] = useState(() => MOCK_INVOICES);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [liveStats, setLiveStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Core Data State - Order Invoices
  const [orderInvoices, setOrderInvoices] = useState([]);
  const [uninvoicedOrders, setUninvoicedOrders] = useState([]);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("ALL");

  // Core Data State - Driver Payout Vouchers
  const [payoutInvoices, setPayoutInvoices] = useState([]);
  const [uninvoicedTrips, setUninvoicedTrips] = useState([]);
  const [payoutSearchQuery, setPayoutSearchQuery] = useState("");
  const [payoutStatusFilter, setPayoutStatusFilter] = useState("ALL");

  // Unified Billing & GST Stats
  const [gstBillingStats, setGstBillingStats] = useState(null);

  // Filtering & Search State (for Consolidated Statements)
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("Oct 2026");

  // Selection & Pagination
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals & Drawers State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [revisionInvoice, setRevisionInvoice] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);

  // Modals for Orders & Payouts
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);
  const [isCreatePayoutModalOpen, setIsCreatePayoutModalOpen] = useState(false);
  const [selectedOrderInvoiceDetail, setSelectedOrderInvoiceDetail] = useState(null);
  const [selectedPayoutInvoiceDetail, setSelectedPayoutInvoiceDetail] = useState(null);

  // Shell State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ id: Date.now(), message, type });
  };

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

  // Fetch live invoices and stats across all categories
  const fetchAllData = useCallback(
    async ({ showLoader = false } = {}) => {
      if (showLoader) setIsLoading(true);
      else setIsSyncing(true);

      try {
        const [invoicesData, statsData, orderInvData, payoutInvData, billingStatsData] = await Promise.all([
          invoicingApi.getInvoices({
            company_id: companyFilter,
            status: activeTab,
          }).catch(() => []),
          invoicingApi.getInvoiceStats().catch(() => null),
          invoicingApi.getOrderInvoices().catch(() => ({ invoices: [], uninvoiced_orders: [] })),
          invoicingApi.getPayoutInvoices().catch(() => ({ payouts: [], uninvoiced_trips: [] })),
          invoicingApi.getBillingGstStats().catch(() => null),
        ]);

        const list = Array.isArray(invoicesData) ? invoicesData : [];
        setInvoices(list);
        if (statsData) setLiveStats(statsData);

        if (orderInvData) {
          setOrderInvoices(orderInvData.invoices || []);
          setUninvoicedOrders(orderInvData.uninvoiced_orders || []);
        }

        if (payoutInvData) {
          setPayoutInvoices(payoutInvData.payouts || []);
          setUninvoicedTrips(payoutInvData.uninvoiced_trips || []);
        }

        if (billingStatsData) {
          setGstBillingStats(billingStatsData);
        }

        if (list.length > 0) {
          setSelectedInvoiceId((prev) => {
            const exists = list.some((inv) => inv.id === prev || inv.invoiceNumber === prev);
            return exists ? prev : list[0].id;
          });
        }
      } catch (err) {
        console.error("Failed to load invoicing data:", err);
        showToast(err.response?.data?.error || err.message || "Failed to load invoicing data.", "danger");
      } finally {
        setIsLoading(false);
        setIsSyncing(false);
      }
    },
    [companyFilter, activeTab]
  );

  useEffect(() => {
    fetchAllData({ showLoader: invoices.length === 0 });
  }, [fetchAllData]);

  // Order Invoices Filtering
  const filteredOrderInvoices = useMemo(() => {
    return orderInvoices.filter((inv) => {
      if (orderStatusFilter !== "ALL" && inv.status !== orderStatusFilter.toLowerCase()) {
        return false;
      }
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchesNum = (inv.invoice_number || "").toLowerCase().includes(q);
        const matchesCompany = (inv.company_name || "").toLowerCase().includes(q);
        const matchesOrder = `ord-${inv.order_id}`.includes(q);
        const matchesRoute = `${inv.pickup_location} ${inv.drop_location}`.toLowerCase().includes(q);
        if (!matchesNum && !matchesCompany && !matchesOrder && !matchesRoute) return false;
      }
      return true;
    });
  }, [orderInvoices, orderStatusFilter, orderSearchQuery]);

  // Payout Invoices Filtering
  const filteredPayoutInvoices = useMemo(() => {
    return payoutInvoices.filter((p) => {
      if (payoutStatusFilter !== "ALL" && p.status !== payoutStatusFilter.toLowerCase()) {
        return false;
      }
      if (payoutSearchQuery.trim()) {
        const q = payoutSearchQuery.toLowerCase().trim();
        const matchesNum = (p.invoice_number || "").toLowerCase().includes(q);
        const matchesDriver = (p.driver_name || "").toLowerCase().includes(q);
        const matchesUtr = (p.utr_number || "").toLowerCase().includes(q);
        const matchesPan = (p.driver_pan || "").toLowerCase().includes(q);
        if (!matchesNum && !matchesDriver && !matchesUtr && !matchesPan) return false;
      }
      return true;
    });
  }, [payoutInvoices, payoutStatusFilter, payoutSearchQuery]);

  // Dynamic KPI and Tab Counts for Consolidated Statements
  const kpiData = useMemo(() => {
    if (liveStats?.kpis) return liveStats.kpis;
    return computeInvoiceKPIs(invoices);
  }, [liveStats, invoices]);

  const tabCounts = useMemo(() => {
    if (liveStats?.counts) return liveStats.counts;
    return computeInvoiceTabCounts(invoices);
  }, [liveStats, invoices]);

  const companyOptions = useMemo(() => {
    const names = new Set(invoices.map((inv) => inv.account?.shortName || inv.account?.name).filter(Boolean));
    return Array.from(names);
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (activeTab === "pending" && inv.statusType !== "pending") return false;
      if (activeTab === "draft" && inv.statusType !== "draft") return false;
      if (activeTab === "sent" && inv.statusType !== "sent") return false;
      if (activeTab === "overdue" && inv.statusType !== "overdue") return false;
      if (activeTab === "paid" && inv.statusType !== "reconciled" && inv.status !== "Paid") return false;

      if (companyFilter !== "ALL" && inv.account?.shortName !== companyFilter && inv.account?.name !== companyFilter) {
        return false;
      }

      if (statusFilter !== "ALL" && inv.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesInvoiceNum = (inv.invoiceNumber || "").toLowerCase().includes(query);
        const matchesAccountName = (inv.account?.name || "").toLowerCase().includes(query);
        const matchesAccountCode = (inv.account?.code || "").toLowerCase().includes(query);
        const matchesGstin = (inv.account?.gstin || "").toLowerCase().includes(query);
        const matchesPeriod = (inv.period || "").toLowerCase().includes(query);
        if (
          !matchesInvoiceNum &&
          !matchesAccountName &&
          !matchesAccountCode &&
          !matchesGstin &&
          !matchesPeriod
        ) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, activeTab, companyFilter, statusFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / 10));

  const selectedInvoice = useMemo(() => {
    return (
      invoices.find((inv) => inv.id === selectedInvoiceId) ||
      filteredInvoices[0] ||
      invoices[0] ||
      null
    );
  }, [invoices, selectedInvoiceId, filteredInvoices]);

  const handleToggleSelectRow = (id) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const pageIds = filteredInvoices.map((inv) => inv.id);
    const isAll = pageIds.every((id) => selectedRowIds.includes(id));
    if (isAll) {
      setSelectedRowIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedRowIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setCompanyFilter("ALL");
    setStatusFilter("ALL");
    showToast("Filters reset to default view.", "info");
  };

  // Actions - Monthly Statements
  const handleApproveInvoice = async (invoice) => {
    try {
      setIsSyncing(true);
      const res = await invoicingApi.verifyInvoice(invoice.numericId || invoice.id);
      setInvoices((prev) =>
        prev.map((item) => (item.id === invoice.id || item.numericId === invoice.numericId ? res : item))
      );
      showToast(
        `Invoice ${invoice.invoiceNumber} verified & signed off! E-invoicing IRN generated.`,
        "success"
      );
      invoicingApi.getInvoiceStats().then(setLiveStats).catch(() => {});
    } catch (err) {
      console.error("Approve invoice error:", err);
      showToast(err.response?.data?.detail || "Could not sign off invoice.", "danger");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenRevisionModal = (invoice) => {
    setRevisionInvoice(invoice);
  };

  const handleSubmitRevision = ({ invoiceId, reasonCategory, notes }) => {
    setInvoices((prev) =>
      prev.map((item) => {
        if (item.id === invoiceId) {
          return {
            ...item,
            status: "Revision Needed",
            statusType: "pending",
            workflow: {
              ...item.workflow,
              stepTitle: "Revision Requested by Sr. Admin",
              stepSubtitle: `Reason: ${reasonCategory}. Notes: ${notes}`,
            },
          };
        }
        return item;
      })
    );
    showToast(`Revision request logged for ${invoiceId}. Ops admin notified.`, "warning");
  };

  const handleCreateInvoice = async (newInvoiceData) => {
    try {
      setIsSyncing(true);
      const created = await invoicingApi.generateInvoice({
        company_id: newInvoiceData.company_id || 1,
        month: 10,
        year: 2026,
      });
      setInvoices((prev) => [created, ...prev]);
      setSelectedInvoiceId(created.id);
      setIsCreateModalOpen(false);
      showToast(`Consolidated invoice ${created.invoiceNumber} created and queued!`, "success");
      invoicingApi.getInvoiceStats().then(setLiveStats).catch(() => {});
    } catch (err) {
      console.error("Generate invoice error:", err);
      showToast(err.response?.data?.detail || "Could not generate invoice.", "danger");
    } finally {
      setIsSyncing(false);
    }
  };

  // Actions - Generate Order Invoice
  const handleGenerateOrderInvoice = async (data) => {
    try {
      setIsSyncing(true);
      const res = await invoicingApi.generateOrderInvoice(data);
      if (Array.isArray(res.invoices)) {
        showToast(`Batch generated ${res.count} Order Tax Invoices!`, "success");
      } else {
        showToast(`Tax Invoice ${res.invoice_number} generated successfully!`, "success");
      }
      setIsCreateOrderModalOpen(false);
      fetchAllData({ showLoader: false });
    } catch (err) {
      console.error("Generate order invoice error:", err);
      showToast(err.response?.data?.detail || "Could not generate order invoice.", "danger");
    } finally {
      setIsSyncing(false);
    }
  };

  // Actions - Generate Driver Payout Voucher
  const handleGeneratePayoutInvoice = async (data) => {
    try {
      setIsSyncing(true);
      const res = await invoicingApi.generatePayoutInvoice(data);
      if (Array.isArray(res.payouts)) {
        showToast(`Batch generated ${res.count} driver settlement vouchers!`, "success");
      } else {
        showToast(`Payout Voucher ${res.invoice_number} generated with TDS Sec 194C withholding!`, "success");
      }
      setIsCreatePayoutModalOpen(false);
      fetchAllData({ showLoader: false });
    } catch (err) {
      console.error("Generate payout voucher error:", err);
      showToast(err.response?.data?.detail || "Could not generate payout voucher.", "danger");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleActionClick = async (action, invoice) => {
    setSelectedInvoiceId(invoice.id);
    switch (action) {
      case "review":
        showToast(`Reviewing ${invoice.invoiceNumber}. Verify items in the inspector panel.`, "info");
        break;
      case "remind":
        showToast(
          `Payment reminder triggered for ${invoice.account.shortName} (${invoice.invoiceNumber}) via WhatsApp & Email.`,
          "success"
        );
        break;
      case "notice":
        showToast(
          `Legal dunning notice & credit hold alert issued to ${invoice.account.shortName}.`,
          "warning"
        );
        break;
      case "receipt":
        setPreviewInvoice(invoice);
        break;
      default:
        break;
    }
  };

  const handleCopyVirtualAccount = (accountNumber) => {
    navigator.clipboard?.writeText(accountNumber);
    showToast(`Virtual Account ${accountNumber} copied to clipboard!`, "info");
  };

  const handleExportCSV = () => {
    const headers = [
      "Invoice Number",
      "Date",
      "Client Name",
      "Account Code",
      "GSTIN",
      "Period",
      "Trips Count",
      "Taxable Value (INR)",
      "CGST (INR)",
      "SGST (INR)",
      "Total Amount (INR)",
      "Status",
    ];

    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      `"${inv.date}"`,
      `"${inv.account?.name || ""}"`,
      inv.account?.code || "",
      inv.account?.gstin || "",
      inv.period,
      inv.tripCount,
      inv.taxableValue,
      inv.cgst,
      inv.sgst,
      inv.totalAmount,
      inv.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HireD_Invoices_${selectedMonth.replace(" ", "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredInvoices.length} invoices as CSV.`, "success");
  };

  return (
    <div className="invoicing-page-shell">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeKey="invoicing"
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Viewport Shell */}
      <div className={`invoicing-content-viewport ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Navbar */}
        <AdminNavbar
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          breadcrumbCurrent="Invoicing & GST Compliance"
          user={user}
          onLogout={handleLogout}
        />

        {/* Invoicing Page Body */}
        <main className="invoicing-main-container">
          <div className="inv-page-container">
            {/* Top Page Header */}
            <header className="inv-header">
              <div className="inv-header-title-group">
                <div className="inv-header-title-row" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <h1 className="inv-title" style={{ margin: 0 }}>Invoicing</h1>
                  <span className="inv-category-pill" style={{ backgroundColor: "#1e3a8a", color: "#fff", fontWeight: 700 }}>
                    BILLING &amp; GST COMPLIANCE
                  </span>
                  {isSyncing && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--inv-primary)",
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
                <p className="inv-subtitle">
                  Generate statutory GST Tax Invoices for each order, driver payout vouchers with Sec 194C TDS, and monthly enterprise statements.
                </p>
              </div>

              <div className="inv-header-actions">
                <button
                  type="button"
                  className="inv-btn-secondary"
                  onClick={() => fetchAllData({ showLoader: false })}
                  disabled={isSyncing}
                >
                  <span className={`material-symbols-outlined ${isSyncing ? "animate-spin" : ""}`} style={{ fontSize: "18px" }}>
                    refresh
                  </span>
                  Refresh
                </button>

                {hubMode === "orders" && (
                  <button
                    type="button"
                    className="inv-btn-primary"
                    onClick={() => setIsCreateOrderModalOpen(true)}
                    style={{ backgroundColor: "#1e3a8a", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
                    Generate Order Invoice
                  </button>
                )}

                {hubMode === "payouts" && (
                  <button
                    type="button"
                    className="inv-btn-primary"
                    onClick={() => setIsCreatePayoutModalOpen(true)}
                    style={{ backgroundColor: "#047857", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
                    Generate Payout Voucher
                  </button>
                )}

                {hubMode === "statements" && (
                  <button
                    type="button"
                    className="inv-btn-primary"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
                    Create Statement
                  </button>
                )}
              </div>
            </header>

            {/* GST Compliance Registration Banner */}
            <section
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
                padding: "1rem 1.25rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "8px", backgroundColor: "#1e3a8a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                  🏛️
                </div>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
                    HireD Freight Logistics Private Limited
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    GSTIN: <strong style={{ color: "#1e3a8a" }}>32AAACH8821K1ZZ</strong> | PAN: <strong>AAACH8821K</strong> | SAC: <strong style={{ color: "#047857" }}>996511</strong> (Road Transport)
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ padding: "6px 12px", backgroundColor: "#eff6ff", borderRadius: "6px", border: "1px solid #bfdbfe", textAlign: "right" }}>
                  <div style={{ fontSize: "0.7rem", color: "#1e40af", fontWeight: 600 }}>TOTAL FREIGHT BILLED</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e3a8a" }}>
                    ₹{Number(gstBillingStats?.overview?.total_freight_billed || 96000).toLocaleString("en-IN")}
                  </div>
                </div>
                <div style={{ padding: "6px 12px", backgroundColor: "#f0fdf4", borderRadius: "6px", border: "1px solid #bbf7d0", textAlign: "right" }}>
                  <div style={{ fontSize: "0.7rem", color: "#166534", fontWeight: 600 }}>GST ACCRUED (18%)</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#15803d" }}>
                    ₹{Number(gstBillingStats?.overview?.total_gst_collected || 17280).toLocaleString("en-IN")}
                  </div>
                </div>
                <div style={{ padding: "6px 12px", backgroundColor: "#fef3c7", borderRadius: "6px", border: "1px solid #fde68a", textAlign: "right" }}>
                  <div style={{ fontSize: "0.7rem", color: "#92400e", fontWeight: 600 }}>TDS WITHHELD (194C)</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#b45309" }}>
                    ₹{Number(gstBillingStats?.overview?.total_tds_deducted || 336).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </section>

            {/* Hub Switcher Tabs */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                borderBottom: "2px solid #e2e8f0",
                paddingBottom: "4px",
              }}
            >
              <button
                type="button"
                onClick={() => setHubMode("orders")}
                style={{
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  border: "none",
                  backgroundColor: "transparent",
                  color: hubMode === "orders" ? "#1e3a8a" : "#64748b",
                  borderBottom: hubMode === "orders" ? "3px solid #1e3a8a" : "3px solid transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📦 Order Tax Invoices</span>
                <span style={{ fontSize: "0.75rem", backgroundColor: hubMode === "orders" ? "#1e3a8a" : "#e2e8f0", color: hubMode === "orders" ? "#fff" : "#475569", padding: "2px 7px", borderRadius: "12px" }}>
                  {orderInvoices.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setHubMode("payouts")}
                style={{
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  border: "none",
                  backgroundColor: "transparent",
                  color: hubMode === "payouts" ? "#047857" : "#64748b",
                  borderBottom: hubMode === "payouts" ? "3px solid #047857" : "3px solid transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>🚚 Driver Payout Vouchers (TDS 194C)</span>
                <span style={{ fontSize: "0.75rem", backgroundColor: hubMode === "payouts" ? "#047857" : "#e2e8f0", color: hubMode === "payouts" ? "#fff" : "#475569", padding: "2px 7px", borderRadius: "12px" }}>
                  {payoutInvoices.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setHubMode("statements")}
                style={{
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  border: "none",
                  backgroundColor: "transparent",
                  color: hubMode === "statements" ? "#5145f5" : "#64748b",
                  borderBottom: hubMode === "statements" ? "3px solid #5145f5" : "3px solid transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>📑 Consolidated B2B Statements</span>
                <span style={{ fontSize: "0.75rem", backgroundColor: hubMode === "statements" ? "#5145f5" : "#e2e8f0", color: hubMode === "statements" ? "#fff" : "#475569", padding: "2px 7px", borderRadius: "12px" }}>
                  {invoices.length}
                </span>
              </button>
            </div>

            {/* TAB 1: ORDER TAX INVOICES */}
            {hubMode === "orders" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Search & Actions Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1, minWidth: "260px" }}>
                    <input
                      type="text"
                      placeholder="Search by Invoice #, Order ID, Partner Company, Route..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      style={{
                        padding: "0.55rem 0.9rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                        width: "100%",
                        maxWidth: "420px",
                      }}
                    />
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      style={{ padding: "0.55rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem", backgroundColor: "#fff" }}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="GENERATED">Generated</option>
                      <option value="PAID">Paid</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    {uninvoicedOrders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleGenerateOrderInvoice({ order_id: "all_uninvoiced" })}
                        style={{
                          padding: "0.55rem 1rem",
                          borderRadius: "6px",
                          backgroundColor: "#f0fdf4",
                          border: "1px solid #86efac",
                          color: "#166534",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        ⚡ Batch Generate Uninvoiced Orders ({uninvoicedOrders.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Invoices Table */}
                <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#475569" }}>
                        <th style={{ padding: "12px 16px" }}>Invoice #</th>
                        <th style={{ padding: "12px 16px" }}>Order Ref</th>
                        <th style={{ padding: "12px 16px" }}>Billed Partner</th>
                        <th style={{ padding: "12px 16px" }}>Corridor Route</th>
                        <th style={{ padding: "12px 16px", textAlign: "right" }}>Taxable Freight</th>
                        <th style={{ padding: "12px 16px", textAlign: "right" }}>GST (CGST+SGST)</th>
                        <th style={{ padding: "12px 16px", textAlign: "right" }}>Total Amount</th>
                        <th style={{ padding: "12px 16px" }}>Status</th>
                        <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrderInvoices.length === 0 ? (
                        <tr>
                          <td colSpan="9" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                            No order tax invoices match your filter. Click <strong>Generate Order Invoice</strong> above!
                          </td>
                        </tr>
                      ) : (
                        filteredOrderInvoices.map((inv) => (
                          <tr key={inv.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1e3a8a" }}>
                              {inv.invoice_number}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ padding: "2px 6px", backgroundColor: "#eff6ff", color: "#1e40af", borderRadius: "4px", fontWeight: 600 }}>
                                ORD-{String(inv.order_id).padStart(4, "0")}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                              {inv.company_name}
                              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                GSTIN: {inv.company_gstin || "32AABCB1234F1Z8"}
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#334155" }}>
                              {inv.pickup_location} → {inv.drop_location}
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600 }}>
                              ₹{Number(inv.taxable_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right", color: "#475569" }}>
                              ₹{Number(inv.total_tax).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 800, color: "#0f172a" }}>
                              ₹{Number(inv.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ padding: "3px 8px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                                {inv.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderInvoiceDetail(inv)}
                                  style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", backgroundColor: "#fff", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                                >
                                  View
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (inv.pdf_url) window.open(inv.pdf_url, "_blank");
                                    else window.open(`/api/v1/admin/order-invoices/${inv.id}/pdf/?download=1`, "_blank");
                                  }}
                                  style={{ padding: "4px 8px", borderRadius: "4px", border: "none", backgroundColor: "#1e3a8a", color: "#fff", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                                >
                                  PDF
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: DRIVER PAYOUT VOUCHERS */}
            {hubMode === "payouts" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Search & Actions Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: 1, minWidth: "260px" }}>
                    <input
                      type="text"
                      placeholder="Search by Voucher #, Driver Name, UTR, PAN..."
                      value={payoutSearchQuery}
                      onChange={(e) => setPayoutSearchQuery(e.target.value)}
                      style={{
                        padding: "0.55rem 0.9rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                        width: "100%",
                        maxWidth: "420px",
                      }}
                    />
                    <select
                      value={payoutStatusFilter}
                      onChange={(e) => setPayoutStatusFilter(e.target.value)}
                      style={{ padding: "0.55rem 0.8rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.85rem", backgroundColor: "#fff" }}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="DISBURSED">Disbursed</option>
                      <option value="PENDING">Pending</option>
                      <option value="RECONCILED">Reconciled</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    {uninvoicedTrips.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleGeneratePayoutInvoice({ trip_id: "all_uninvoiced" })}
                        style={{
                          padding: "0.55rem 1rem",
                          borderRadius: "6px",
                          backgroundColor: "#f0fdf4",
                          border: "1px solid #86efac",
                          color: "#166534",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        ⚡ Batch Generate Uninvoiced Payouts ({uninvoicedTrips.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Driver Payouts Table */}
                <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#475569" }}>
                        <th style={{ padding: "12px 16px" }}>Voucher #</th>
                        <th style={{ padding: "12px 16px" }}>Driver Name</th>
                        <th style={{ padding: "12px 16px" }}>PAN / Account</th>
                        <th style={{ padding: "12px 16px" }}>Trip Ref</th>
                        <th style={{ padding: "12px 16px", textAlign: "right" }}>Gross Share</th>
                        <th style={{ padding: "12px 16px", textAlign: "right" }}>TDS (194C)</th>
                        <th style={{ padding: "12px 16px", textAlign: "right" }}>Net Disbursed</th>
                        <th style={{ padding: "12px 16px" }}>UTR Ref</th>
                        <th style={{ padding: "12px 16px" }}>Status</th>
                        <th style={{ padding: "12px 16px", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayoutInvoices.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                            No driver payout settlement vouchers match your filter. Click <strong>Generate Payout Voucher</strong> above!
                          </td>
                        </tr>
                      ) : (
                        filteredPayoutInvoices.map((p) => (
                          <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "12px 16px", fontWeight: 700, color: "#047857" }}>
                              {p.invoice_number}
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                              {p.driver_name}
                              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                {p.driver_phone || "+91 98000 00000"}
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#334155" }}>
                              <strong>{p.driver_pan || "AAAPB9912C"}</strong>
                              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                A/C: {p.account_number || "XXXXXXXX4589"}
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ padding: "2px 6px", backgroundColor: "#f0fdf4", color: "#065f46", borderRadius: "4px", fontWeight: 600 }}>
                                TRP-{String(p.trip_id || 1).padStart(4, "0")}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600 }}>
                              ₹{Number(p.gross_payout).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right", color: "#dc2626" }}>
                              -₹{Number(p.tds_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 800, color: "#047857" }}>
                              ₹{Number(p.net_payout).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#475569" }}>
                              {p.utr_number || "IMPS-SETTLED"}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{ padding: "3px 8px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                                {p.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedPayoutInvoiceDetail(p)}
                                  style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", backgroundColor: "#fff", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                                >
                                  View
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (p.pdf_url) window.open(p.pdf_url, "_blank");
                                    else window.open(`/api/v1/admin/payout-invoices/${p.id}/pdf/?download=1`, "_blank");
                                  }}
                                  style={{ padding: "4px 8px", borderRadius: "4px", border: "none", backgroundColor: "#047857", color: "#fff", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
                                >
                                  PDF
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: CONSOLIDATED B2B STATEMENTS */}
            {hubMode === "statements" && (
              <>
                {/* 4 Top KPI Cards */}
                <InvoiceKPIStats
                  kpiData={kpiData}
                  selectedFilter={activeTab}
                  onSelectFilter={(tabId) => setActiveTab(tabId)}
                />

                {/* 6 Pipeline Tabs + Filter Controls */}
                <InvoiceFilterTabs
                  currentTab={activeTab}
                  onTabChange={setActiveTab}
                  tabCounts={tabCounts}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  companyFilter={companyFilter}
                  onCompanyFilterChange={setCompanyFilter}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  companyOptions={companyOptions}
                  onResetFilters={handleResetFilters}
                />

                {/* Master-Detail 2-Column Section */}
                {isLoading ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4rem",
                      backgroundColor: "var(--inv-card-bg)",
                      borderRadius: "var(--inv-radius-lg)",
                      border: "1px solid var(--inv-border)",
                      color: "var(--inv-text-muted)",
                      gap: "1rem",
                    }}
                  >
                    <span
                      className="material-symbols-outlined animate-spin"
                      style={{ fontSize: "32px", color: "var(--inv-primary)" }}
                    >
                      progress_activity
                    </span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      Connecting to live billing &amp; GST registry...
                    </span>
                  </div>
                ) : (
                  <div className="inv-master-detail-layout">
                    {/* Left Column: Register Table */}
                    <div className="inv-table-column">
                      <InvoicesRegisterTable
                        invoices={filteredInvoices}
                        selectedInvoiceId={selectedInvoice?.id}
                        onSelectInvoice={(inv) => setSelectedInvoiceId(inv.id)}
                        selectedRowIds={selectedRowIds}
                        onToggleSelectRow={handleToggleSelectRow}
                        onToggleSelectAll={handleToggleSelectAll}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItemsCount={filteredInvoices.length}
                        onActionClick={handleActionClick}
                      />
                    </div>

                    {/* Right Column: Selected Invoice Inspector Panel */}
                    <div className="inv-inspector-column">
                      <InvoiceDetailPanel
                        invoice={selectedInvoice}
                        onApprove={handleApproveInvoice}
                        onRequestRevision={handleOpenRevisionModal}
                        onPreviewPDF={(inv) => setPreviewInvoice(inv)}
                        onCopyVirtualAccount={handleCopyVirtualAccount}
                        onExportSingleCSV={(inv) => showToast(`CSV dataset generated for ${inv.invoiceNumber}.`, "info")}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateInvoice={handleCreateInvoice}
      />

      <CreateOrderInvoiceModal
        isOpen={isCreateOrderModalOpen}
        onClose={() => setIsCreateOrderModalOpen(false)}
        uninvoicedOrders={uninvoicedOrders}
        onGenerateOrderInvoice={handleGenerateOrderInvoice}
        isSyncing={isSyncing}
      />

      <CreatePayoutInvoiceModal
        isOpen={isCreatePayoutModalOpen}
        onClose={() => setIsCreatePayoutModalOpen(false)}
        uninvoicedTrips={uninvoicedTrips}
        onGeneratePayoutInvoice={handleGeneratePayoutInvoice}
        isSyncing={isSyncing}
      />

      <OrderInvoiceDetailModal
        invoice={selectedOrderInvoiceDetail}
        isOpen={Boolean(selectedOrderInvoiceDetail)}
        onClose={() => setSelectedOrderInvoiceDetail(null)}
      />

      <PayoutInvoiceDetailModal
        payout={selectedPayoutInvoiceDetail}
        isOpen={Boolean(selectedPayoutInvoiceDetail)}
        onClose={() => setSelectedPayoutInvoiceDetail(null)}
      />

      <RequestRevisionModal
        key={revisionInvoice?.id || "revision-modal"}
        isOpen={Boolean(revisionInvoice)}
        invoice={revisionInvoice}
        onClose={() => setRevisionInvoice(null)}
        onSubmitRevision={handleSubmitRevision}
      />

      <InvoicePreviewModal
        key={previewInvoice?.id || "preview-modal"}
        isOpen={Boolean(previewInvoice)}
        invoice={previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        onPrint={() => showToast("Preparing printable PDF document...", "info")}
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
