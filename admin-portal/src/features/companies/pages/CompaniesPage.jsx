import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import { companiesApi } from "../services/companiesApi";
import {
  MOCK_COMPANIES,
  computeCompanyKPIs,
  computeCompanyTabCounts,
} from "../data/mockCompaniesData";

// Common Dashboard Shell Components
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";

// Companies Management Components
import CompanyKPIStats from "../components/CompanyKPIStats";
import CompaniesRegisterTable from "../components/CompaniesRegisterTable";
import CompanyProfilePanel from "../components/CompanyProfilePanel";
import AddCompanyModal from "../components/AddCompanyModal";
import AdjustCreditModal from "../components/AdjustCreditModal";
import EditSplitModal from "../components/EditSplitModal";
import AddAssociateModal from "../components/AddAssociateModal";
import CredentialsSuccessModal from "../components/CredentialsSuccessModal";

// Styling
import "../styles/companies.css";

export default function CompaniesPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Core Data State
  const [companies, setCompanies] = useState(() => MOCK_COMPANIES);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [liveStats, setLiveStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filtering State
  const [activeTab, setActiveTab] = useState("all");
  const [corridorFilter, setCorridorFilter] = useState("all");

  // Shell & Navigation Drawers
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adjustCreditCompany, setAdjustCreditCompany] = useState(null);
  const [editSplitCompany, setEditSplitCompany] = useState(null);
  const [addAssociateCompany, setAddAssociateCompany] = useState(null);
  const [credentialsModalData, setCredentialsModalData] = useState(null);
  const [associatesUpdateTrigger, setAssociatesUpdateTrigger] = useState(0);


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

  // Fetch live companies and statistics
  const fetchCompaniesData = useCallback(
    async ({ showLoader = false } = {}) => {
      if (showLoader) setIsLoading(true);
      else setIsSyncing(true);

      try {
        const [companiesData, statsData] = await Promise.all([
          companiesApi.getCompanies({
            corridor: corridorFilter,
            status: activeTab,
          }),
          companiesApi.getCompanyStats().catch(() => null),
        ]);

        const list = Array.isArray(companiesData) ? companiesData : [];
        setCompanies(list);
        if (statsData) setLiveStats(statsData);

        // Maintain selection or select first
        if (list.length > 0) {
          setSelectedCompanyId((prev) => {
            const exists = list.some((c) => c.id === prev || c.code === prev);
            return exists ? prev : list[0].id;
          });
        } else {
          setSelectedCompanyId(null);
        }
      } catch (err) {
        console.error("Failed to load companies:", err);
        setToast({
          type: "danger",
          title: "Connection Error",
          message:
            err.response?.data?.error ||
            err.message ||
            "Failed to load corporate directory.",
        });
      } finally {
        setIsLoading(false);
        setIsSyncing(false);
      }
    },
    [activeTab, corridorFilter]
  );

  // Load companies whenever filters change or on initial mount
  useEffect(() => {
    fetchCompaniesData({ showLoader: true });
  }, [fetchCompaniesData]);

  // Compute live KPIs and tab counters (prefer liveStats from backend if available)
  const kpis = useMemo(() => {
    if (liveStats?.kpis) return liveStats.kpis;
    return computeCompanyKPIs(companies);
  }, [liveStats, companies]);

  const counts = useMemo(() => {
    if (liveStats?.counts) return liveStats.counts;
    return computeCompanyTabCounts(companies);
  }, [liveStats, companies]);

  // Selected company object
  const selectedCompany = useMemo(() => {
    return (
      companies.find((c) => c.id === selectedCompanyId || c.code === selectedCompanyId) ||
      companies[0] ||
      null
    );
  }, [companies, selectedCompanyId]);

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
    if (filterId === "credit-breach") {
      setActiveTab("credit-watch");
    } else {
      setActiveTab(filterId);
    }
  };

  // Add Company
  const handleAddCompany = async (newCompanyData) => {
    try {
      setIsSyncing(true);
      const created = await companiesApi.createCompany(newCompanyData);
      setCompanies((prev) => [created, ...prev]);
      setSelectedCompanyId(created.id);
      setIsAddModalOpen(false);

      if (created.partnerAccount) {
        setCredentialsModalData({
          title: "Partner Enterprise Account Provisioned",
          subtitle: `Access credentials generated for ${created.name}`,
          credentials: {
            companyName: created.name,
            companyCode: created.code,
            name: created.partnerAccount.name,
            email: created.partnerAccount.email,
            password: created.partnerAccount.password,
            role: "Partner",
            portalUrl: created.partnerAccount.portalUrl || "http://localhost:5173/login",
          },
        });
      }

      setToast({
        type: "success",
        title: "Company Account Created",
        message: `${created.name} (${created.id}) successfully added to directory.`,
      });
      companiesApi.getCompanyStats().then(setLiveStats).catch(() => {});
      setAssociatesUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Create company error:", err);
      setToast({
        type: "danger",
        title: "Registration Failed",
        message: err.response?.data?.error || "Could not create company account.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Add Associate Action
  const handleAssociateCreated = async (payload) => {
    if (!addAssociateCompany) return;
    try {
      setIsSyncing(true);
      const result = await companiesApi.createCompanyAssociate(addAssociateCompany.id, payload);
      setToast({
        type: "success",
        title: "Associate Account Provisioned",
        message: `Created account for ${result.name} (${result.email}).`,
      });
      setCredentialsModalData({
        title: "Company Associate Account Provisioned",
        subtitle: `Access credentials generated for ${addAssociateCompany.name}`,
        credentials: {
          companyName: addAssociateCompany.name,
          companyCode: addAssociateCompany.code,
          name: result.name,
          email: result.email,
          password: result.generatedPassword,
          role: "Partner",
          portalUrl: result.portalUrl || "http://localhost:5173/login",
        },
      });
      setAssociatesUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Associate creation error:", err);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset Associate Password
  const handleResetAssociatePassword = async (company, associate) => {
    try {
      setIsSyncing(true);
      const result = await companiesApi.resetAssociatePassword(company.id, associate.id);
      setCredentialsModalData({
        title: "Associate Password Reset",
        subtitle: `New credentials generated for ${associate.name || associate.email}`,
        credentials: {
          companyName: company.name,
          companyCode: company.code,
          name: associate.name,
          email: associate.email,
          password: result.newPassword,
          role: "Partner",
          portalUrl: result.portalUrl || "http://localhost:5173/login",
        },
      });
      setToast({
        type: "success",
        title: "Password Reset Successfully",
        message: `New secure password generated for ${associate.email}.`,
      });
    } catch (err) {
      console.error("Password reset error:", err);
      setToast({
        type: "danger",
        title: "Reset Failed",
        message: err.response?.data?.error || "Could not reset associate password.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Associate Active/Blocked Status
  const handleToggleAssociateStatus = async (company, associate) => {
    try {
      setIsSyncing(true);
      const result = await companiesApi.toggleAssociateStatus(company.id, associate.id);
      setToast({
        type: "success",
        title: "Associate Status Updated",
        message: result.message || "Associate status updated.",
      });
      setAssociatesUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Status toggle error:", err);
      setToast({
        type: "danger",
        title: "Action Failed",
        message: err.response?.data?.error || "Could not update associate status.",
      });
    } finally {
      setIsSyncing(false);
    }
  };


  // Save Credit Revision
  const handleSaveCredit = async (companyId, updatedCredit, remarks) => {
    try {
      setIsSyncing(true);
      const updated = await companiesApi.updateCompanyCredit(companyId, {
        creditLimit: updatedCredit.limit,
        terms: updatedCredit.terms,
        securityDeposit: updatedCredit.securityDeposit,
        depositType: updatedCredit.depositType,
        remarks,
      });

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId || c.code === companyId ? updated : c
        )
      );
      setAdjustCreditCompany(null);
      setToast({
        type: "success",
        title: "Credit Revised",
        message: `Credit limit updated to ${updated.credit?.limitDisplay || updatedCredit.limitDisplay} with ${updated.credit?.terms || updatedCredit.terms}. ${remarks ? "Audit logged." : ""}`,
      });
      companiesApi.getCompanyStats().then(setLiveStats).catch(() => {});
    } catch (err) {
      console.error("Credit revision error:", err);
      setToast({
        type: "danger",
        title: "Update Failed",
        message: err.response?.data?.error || "Could not adjust credit limit.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Save Split Revision
  const handleSaveSplit = async (companyId, updatedCommission) => {
    try {
      setIsSyncing(true);
      const updated = await companiesApi.updateCompanySplit(companyId, {
        driverSplit: updatedCommission.driverSplit,
        notes: updatedCommission.notes,
      });

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId || c.code === companyId ? updated : c
        )
      );
      setEditSplitCompany(null);
      setToast({
        type: "success",
        title: "Commission Rules Updated",
        message: `Driver: ${updatedCommission.driverSplit}% · Platform: ${100 - Number(updatedCommission.driverSplit)}% configured successfully.`,
      });
    } catch (err) {
      console.error("Split update error:", err);
      setToast({
        type: "danger",
        title: "Split Configuration Failed",
        message:
          err.response?.data?.error || "Could not update payout split rules.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Suspend / Active
  const handleToggleSuspend = async (company) => {
    try {
      setIsSyncing(true);
      const updated = await companiesApi.toggleCompanyStatus(company.id);
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === company.id || c.code === company.id ? updated : c
        )
      );
      const isNowSuspended = updated.status === "Suspended";
      setToast({
        type: isNowSuspended ? "warning" : "success",
        title: isNowSuspended ? "Account Suspended" : "Account Reactivated",
        message: `${updated.name} is now ${isNowSuspended ? "suspended from new booking dispatches" : "active with live billing"}.`,
      });
      companiesApi.getCompanyStats().then(setLiveStats).catch(() => {});
    } catch (err) {
      console.error("Toggle suspend error:", err);
      setToast({
        type: "danger",
        title: "Action Failed",
        message:
          err.response?.data?.error ||
          "Could not change company account status.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Download Company Dossier
  const handleDownloadDossier = (company) => {
    const dossierData = JSON.stringify(company, null, 2);
    const blob = new Blob([dossierData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${company.code}_dossier.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToast({
      type: "info",
      title: "Dossier Exported",
      message: `Downloaded comprehensive operational record for ${company.shortName}.`,
    });
  };

  // Run Bulk Verification Run
  const handleRunBulkVerification = async () => {
    try {
      setIsSyncing(true);
      const res = await companiesApi.bulkVerifyCompanies();
      const count = res.verifiedCount ?? res.count ?? 0;
      setToast({
        type: "success",
        title: "GSTIN Verification Completed",
        message: `${count} corporate account${count === 1 ? "" : "s"} verified with active status.`,
      });
      await fetchCompaniesData({ showLoader: false });
    } catch (err) {
      console.error("Bulk verification error:", err);
      setToast({
        type: "danger",
        title: "Verification Failed",
        message:
          err.response?.data?.error ||
          "Could not run automated bulk verification.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // View Account Ledger Action
  const handleViewLedger = (company) => {
    setToast({
      type: "info",
      title: "Ledger Accessed",
      message: `Opening corporate settlement ledger & invoices for ${company.shortName}.`,
    });
  };

  // Export Directory CSV
  const handleExportCSV = () => {
    const headers = [
      "Company ID",
      "Company Name",
      "Legal Entity",
      "Tier",
      "Industry",
      "GSTIN",
      "PAN",
      "State",
      "Status",
      "Credit Used",
      "Credit Limit",
      "Payment Terms",
      "Driver Split %",
      "Platform Split %",
      "Contact Person",
      "Contact Phone",
      "Contact Email",
    ];

    const rows = companies.map((c) => [
      c.code,
      `"${c.name}"`,
      `"${c.legalEntity}"`,
      c.tier,
      c.industry,
      c.gstin,
      c.pan,
      `"${c.state}"`,
      c.status,
      c.credit?.used ?? 0,
      c.credit?.limit ?? 0,
      c.credit?.terms ?? "Net 30",
      c.commission?.driverSplit ?? 85,
      c.commission?.platformSplit ?? 15,
      `"${c.contact?.name ?? ""}"`,
      c.contact?.phone ?? "",
      c.contact?.email ?? "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HireD_Company_Accounts_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      type: "success",
      title: "Directory Exported",
      message: `Downloaded CSV directory with ${companies.length} enterprise accounts.`,
    });
  };

  return (
    <div className="companies-page-shell" id="companies-page-root">
      {/* Sidebar Navigation */}
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeModule="companies"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <div
        className={`companies-content-viewport ${
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
          breadcrumbCurrent="Company Accounts"
          quickActionLabel="+ Add Company"
          onQuickAction={() => setIsAddModalOpen(true)}
        />

        {/* Content Container */}
        <main className="companies-main-container">
          <div className="companies-page-container">
            {/* 1. Header & Primary Actions */}
            <div className="companies-header">
              <div className="companies-header-left">
                <div className="companies-title-row">
                  <h1 className="companies-title">Companies</h1>
                  <span className="companies-directory-badge">
                    Partner Directory
                  </span>
                  {isSyncing && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--comp-primary)",
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
                <p className="companies-subtitle">
                  Administer B2B enterprise client accounts, contractual credit
                  limits, GSTIN compliance, and driver payout split configurations.
                </p>
              </div>

              <div className="companies-header-actions">
                {/* Refresh Trigger */}
                <button
                  type="button"
                  className="btn-header-export"
                  onClick={() => fetchCompaniesData({ showLoader: false })}
                  disabled={isSyncing}
                  title="Refresh directory"
                  id="btn-refresh-companies"
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

                {/* Corridor Filter Select */}
                <select
                  className="btn-header-filter"
                  value={corridorFilter}
                  onChange={(e) => setCorridorFilter(e.target.value)}
                  id="select-corridor-filter"
                >
                  <option value="all">All Corridors &amp; Types</option>
                  <option value="Western">
                    Western Corridor (MH-GJ)
                  </option>
                  <option value="Southern">
                    Southern Express (KA-TN)
                  </option>
                  <option value="Golden Quadrilateral">
                    Golden Quadrilateral (North-South)
                  </option>
                  <option value="Eastern">
                    Eastern Freight Corridor (WB-JH)
                  </option>
                </select>

                {/* Export Directory CSV */}
                <button
                  type="button"
                  className="btn-header-export"
                  onClick={handleExportCSV}
                  id="btn-export-directory"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    file_download
                  </span>
                  <span>Export Directory</span>
                </button>

                {/* Add Company Trigger */}
                <button
                  type="button"
                  className="btn-add-company"
                  onClick={() => setIsAddModalOpen(true)}
                  id="btn-add-company-header"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    domain_add
                  </span>
                  <span>+ Add Company</span>
                </button>
              </div>
            </div>

            {/* 2. KPI Summary Ribbon (4 Cards) */}
            <CompanyKPIStats
              kpis={kpis}
              selectedFilter={activeTab}
              onSelectFilter={handleKpiFilterSelect}
            />

            {/* 3. Dual-Column Master-Detail Workspace */}
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4rem",
                  backgroundColor: "var(--comp-card)",
                  borderRadius: "var(--comp-radius-lg)",
                  border: "1px solid var(--comp-border)",
                  color: "var(--comp-text-muted)",
                  gap: "1rem",
                }}
              >
                <span
                  className="material-symbols-outlined animate-spin"
                  style={{ fontSize: "32px", color: "var(--comp-primary)" }}
                >
                  progress_activity
                </span>
                <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  Connecting to live company registry...
                </span>
              </div>
            ) : (
              <div className="companies-workspace-grid">
                {/* Left Column: Table Directory & Filters */}
                <CompaniesRegisterTable
                  companies={companies}
                  selectedCompany={selectedCompany}
                  onSelectCompany={(c) => setSelectedCompanyId(c.id)}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  counts={counts}
                  onRunBulkVerification={handleRunBulkVerification}
                />

                {/* Right Column: Detailed Company Profile Drawer */}
                <CompanyProfilePanel
                  company={selectedCompany}
                  onOpenAdjustCredit={(c) => setAdjustCreditCompany(c)}
                  onOpenEditSplit={(c) => setEditSplitCompany(c)}
                  onDownloadDossier={handleDownloadDossier}
                  onEditCompany={() => {
                    setToast({
                      type: "info",
                      title: "Edit Account",
                      message: "Company details editor opened.",
                    });
                  }}
                  onToggleSuspend={handleToggleSuspend}
                  onViewLedger={handleViewLedger}
                  onOpenAddAssociate={(c) => setAddAssociateCompany(c)}
                  onResetAssociatePassword={handleResetAssociatePassword}
                  onToggleAssociateStatus={handleToggleAssociateStatus}
                  associatesUpdateTrigger={associatesUpdateTrigger}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCompany={handleAddCompany}
      />

      <AdjustCreditModal
        key={adjustCreditCompany?.id || "adjust-credit"}
        isOpen={Boolean(adjustCreditCompany)}
        onClose={() => setAdjustCreditCompany(null)}
        company={adjustCreditCompany}
        onSaveCredit={handleSaveCredit}
      />

      <EditSplitModal
        key={editSplitCompany?.id || "edit-split"}
        isOpen={Boolean(editSplitCompany)}
        onClose={() => setEditSplitCompany(null)}
        company={editSplitCompany}
        onSaveSplit={handleSaveSplit}
      />

      <AddAssociateModal
        key={addAssociateCompany?.id || "add-associate"}
        isOpen={Boolean(addAssociateCompany)}
        onClose={() => setAddAssociateCompany(null)}
        company={addAssociateCompany}
        onAssociateCreated={handleAssociateCreated}
      />

      <CredentialsSuccessModal
        isOpen={Boolean(credentialsModalData)}
        onClose={() => setCredentialsModalData(null)}
        title={credentialsModalData?.title}
        subtitle={credentialsModalData?.subtitle}
        credentials={credentialsModalData?.credentials}
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
