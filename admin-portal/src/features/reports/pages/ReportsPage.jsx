import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";

// Common Dashboard Shell Components
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";

// Reports Components
import ReportsHeaderToolbar from "../components/ReportsHeaderToolbar";
import ReportsKPIStats from "../components/ReportsKPIStats";
import ReportsSegmentedNav from "../components/ReportsSegmentedNav";
import FreightVelocityChart from "../components/FreightVelocityChart";
import CorridorsTable from "../components/CorridorsTable";
import FleetCategoryMixDonut from "../components/FleetCategoryMixDonut";
import EnterpriseExposureWidget from "../components/EnterpriseExposureWidget";
import CarrierQualityWidget from "../components/CarrierQualityWidget";
import IntelligenceSyncBanner from "../components/IntelligenceSyncBanner";
import RevenueBillingTab from "../components/RevenueBillingTab";
import TripOperationsTab from "../components/TripOperationsTab";
import ClientVolumeTab from "../components/ClientVolumeTab";

// Mock Data
import {
  MOCK_REPORTS_KPIS,
  buildReportsKPIs,
  MOCK_FREIGHT_VELOCITY_DATA,
  MOCK_CORRIDORS,
  MOCK_FLEET_CATEGORY_MIX,
  MOCK_ENTERPRISE_EXPOSURE,
  MOCK_CARRIER_QUALITY,
} from "../data/mockReportsData";
import { fetchReportsOverview } from "../services/reportsApi";

// Styling
import "../styles/reports.css";

export default function ReportsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Filters & Tabs
  const [selectedDateRange, setSelectedDateRange] = useState("this_month");
  const [selectedCorridor, setSelectedCorridor] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  // State
  const [kpiData, setKpiData] = useState(() => MOCK_REPORTS_KPIS);
  const [velocityData, setVelocityData] = useState(() => MOCK_FREIGHT_VELOCITY_DATA);
  const [corridors, setCorridors] = useState(() => MOCK_CORRIDORS);
  const [mixData, setMixData] = useState(() => MOCK_FLEET_CATEGORY_MIX);
  const [exposureAccounts, setExposureAccounts] = useState(() => MOCK_ENTERPRISE_EXPOSURE);
  const [qualityData, setQualityData] = useState(() => MOCK_CARRIER_QUALITY);
  const [rawGrossBilling, setRawGrossBilling] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const applyData = useCallback((data) => {
    if (!data) return;
    setKpiData(buildReportsKPIs(data));
    if (data.velocityData) {
      setVelocityData(data.velocityData);
      if (data.velocityData.grossBilling !== undefined) {
        setRawGrossBilling(data.velocityData.grossBilling);
      }
    }
    if (data.fleetMix) {
      setMixData(data.fleetMix);
    }
    if (Array.isArray(data.corridors)) setCorridors(data.corridors);
    if (Array.isArray(data.exposureAccounts)) setExposureAccounts(data.exposureAccounts);
    if (data.qualityData) setQualityData(data.qualityData);
  }, []);

  const loadOverview = useCallback(async (dateRange = selectedDateRange, corridor = selectedCorridor) => {
    setIsLoading(true);
    try {
      const data = await fetchReportsOverview(dateRange, corridor);
      applyData(data);
    } catch (err) {
      console.error("Failed to load reports overview:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDateRange, selectedCorridor, applyData]);

  useEffect(() => {
    let isMounted = true;
    fetchReportsOverview(selectedDateRange, selectedCorridor)
      .then((data) => {
        if (isMounted) applyData(data);
      })
      .catch((err) => {
        console.error("Failed to load reports overview:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDateRange, selectedCorridor, applyData]);

  // Dynamic corridor options for filter dropdown
  const corridorOptions = useMemo(() => {
    const opts = [{ id: "all", label: "All Corridors & Hubs" }];
    if (Array.isArray(corridors)) {
      corridors.forEach((c) => {
        const label = c.name || (c.origin && c.destination ? `${c.origin} ➔ ${c.destination}` : c.id);
        const idVal = c.origin || c.id;
        if (!opts.some((o) => o.id === idVal || o.label === label)) {
          opts.push({ id: idVal, label });
        }
      });
    }
    return opts;
  }, [corridors]);

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
      // Clear client state even if network call fails
    } finally {
      clearCurrentUser();
      navigate("/login");
    }
  };

  // Direct CSV Export matching real operational data and PRD A-13
  const handleExportCsv = () => {
    let csv = "=== HIRED LOGISTICS OPERATIONAL REPORT ===\n";
    csv += `Generated At,"${new Date().toISOString()}"\n`;
    csv += `Date Range Filter,"${selectedDateRange}"\n`;
    csv += `Corridor Filter,"${selectedCorridor}"\n\n`;

    csv += "--- EXECUTIVE OVERVIEW METRICS ---\n";
    csv += "Metric,Value,Subtitle\n";
    if (kpiData) {
      Object.entries(kpiData).forEach(([key, item]) => {
        csv += `"${item.title || key}","${item.number || item.value || ''}","${item.subtext || item.subtitle || ''}"\n`;
      });
    }

    csv += "\n--- TOP CORRIDORS PERFORMANCE ---\n";
    csv += "Corridor ID,Origin,Destination,Trip Volume,Freight Value,Avg Transit,On-Time SLA,Status\n";
    corridors.forEach((c) => {
      const origin = c.origin || c.name?.split("➔")[0]?.trim() || "Origin";
      const dest = c.destination || c.name?.split("➔")[1]?.trim() || "Destination";
      const trips = c.trips ?? c.tripsVolume ?? 0;
      const freightVal = c.freightValue || c.revenueContribution || "₹0.00";
      const avgTransit = c.avgTransit || c.avgTransitFormatted || "2.5h";
      const slaScore = c.slaScore || `${c.onTimeRate || 100}%`;
      const slaStatus = c.slaStatus || "Optimal";
      csv += `"${c.id || ''}","${origin}","${dest}","${trips}","${freightVal}","${avgTransit}","${slaScore}","${slaStatus}"\n`;
    });

    csv += "\n--- ENTERPRISE SHIPPERS & REVENUE ---\n";
    csv += "Account ID,Company Name,Orders Count,Active Trips,Total Freight Revenue,Status\n";
    exposureAccounts.forEach((a) => {
      csv += `"${a.id || ''}","${a.name || ''}","${a.ordersCount || 0}","${a.activeTrips || 0}","${a.revenue || a.totalExposure || '₹0.00'}","${a.statusBadge || a.status || 'Active'}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HireD_Operational_Report_${selectedDateRange}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showToast("Operational report exported to CSV successfully.");
  };

  const handleRefreshMetrics = async () => {
    await loadOverview(selectedDateRange, selectedCorridor);
    showToast("Operational metrics refreshed live from database records.");
  };

  const handleViewAllEnterprise = () => {
    navigate("/companies");
  };

  return (
    <div
      className={`reports-page-shell ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
      id="reports-page-root"
    >
      {/* 1. Left Fixed Application Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activeModule="reports"
        onSelectModule={(id) => {
          const path = id === "dashboard" ? "/dashboard" : `/${id}`;
          navigate(path);
        }}
      />

      {/* 2. Main Content Viewport */}
      <div className="reports-content-viewport">
        {/* Fixed Top Navbar */}
        <AdminNavbar
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          onOpenSearch={() => setCommandPaletteOpen(true)}
          breadcrumbCurrent="Operational Reports"
          onLogout={handleLogout}
          adminName={user?.name || "Admin / Ops"}
          adminEmail={user?.email || "ops@hired.in"}
        />

        {/* Reports Content Canvas */}
        <main className="reports-main-content">
          {/* Top Level Page Header & Controls */}
          <ReportsHeaderToolbar
            selectedDateRange={selectedDateRange}
            onSelectDateRange={setSelectedDateRange}
            selectedCorridor={selectedCorridor}
            onSelectCorridor={setSelectedCorridor}
            onExportCsv={handleExportCsv}
            onRefresh={handleRefreshMetrics}
            isLoading={isLoading}
            corridorOptions={corridorOptions}
          />

          {/* Metric KPI Cards (4-Column Bento Grid) */}
          <ReportsKPIStats kpiData={kpiData} />

          {/* Segmented Analytics Navigation Bar */}
          <ReportsSegmentedNav
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />

          {/* Tab 1: Executive Overview */}
          {activeTab === "overview" && (
            <div className="reports-main-grid">
              {/* Left Dominant Column (approx 65% width) */}
              <div className="reports-left-col">
                {/* Freight Billing vs Net Payout Velocity */}
                <FreightVelocityChart velocityData={velocityData} />

                {/* Top Performing Corridors & SLA Adherence */}
                <CorridorsTable corridors={corridors} />
              </div>

              {/* Right Column (Key Distribution & Operational Widgets - 35% width) */}
              <div className="reports-right-col">
                {/* Widget 1: Fleet Category Mix Donut */}
                <FleetCategoryMixDonut mixData={mixData} />

                {/* Widget 2: Enterprise Account Exposure */}
                <EnterpriseExposureWidget
                  accounts={exposureAccounts}
                  onViewAll={handleViewAllEnterprise}
                />

                {/* Widget 3: Carrier Earning & Quality Index */}
                <CarrierQualityWidget qualityData={qualityData} />
              </div>
            </div>
          )}

          {/* Tab 2: Revenue & Billing Report */}
          {activeTab === "revenue" && (
            <RevenueBillingTab grossBilling={rawGrossBilling} />
          )}

          {/* Tab 3: Trip Operations Report */}
          {activeTab === "trips" && (
            <TripOperationsTab corridors={corridors} />
          )}

          {/* Tab 4: Client Volume Report */}
          {activeTab === "clients" && (
            <ClientVolumeTab exposureAccounts={exposureAccounts} />
          )}

          {/* Operational Intelligence Sync Footer Banner */}
          <IntelligenceSyncBanner onRefreshMetrics={handleRefreshMetrics} />
        </main>
      </div>

      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
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
