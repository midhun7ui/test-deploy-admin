import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";

import AdminNavbar from "../../dashboard/components/AdminNavbar";
import AdminSidebar from "../../dashboard/components/AdminSidebar";

import AnalyticsHeaderToolbar from "../components/AnalyticsHeaderToolbar";
import AnalyticsKPIStats from "../components/AnalyticsKPIStats";
import AnalyticsSegmentedNav from "../components/AnalyticsSegmentedNav";
import BookingVelocityChart from "../components/BookingVelocityChart";
import HubDwellBarChart from "../components/HubDwellBarChart";
import FleetDeadheadWidget from "../components/FleetDeadheadWidget";
import CapacityBottleneckRadar from "../components/CapacityBottleneckRadar";
import EnterpriseDemandMatrix from "../components/EnterpriseDemandMatrix";

import SimulateDemandModal from "../components/SimulateDemandModal";
import CohortDeepDiveModal from "../components/CohortDeepDiveModal";
import ExportAnalyticsModal from "../components/ExportAnalyticsModal";

import {
  MOCK_ANALYTICS_KPIS,
  MOCK_BOOKING_VELOCITY_DAYS,
  MOCK_HUB_DWELL_METRICS,
  MOCK_DEADHEAD_OPTIMIZATION,
  MOCK_CORRIDOR_BOTTLENECKS,
  MOCK_ENTERPRISE_VELOCITY_COHORTS,
  MOCK_TIME_PRESETS,
  MOCK_COMPARISON_MODELS,
  MOCK_FLEET_CATEGORIES,
} from "../data/mockAnalyticsData";
import { fetchAnalyticsOverview } from "../services/analyticsApi";

import "../styles/analytics.css";

export default function PerformanceAnalyticsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Core Real Data State
  const [kpiData, setKpiData] = useState(() => MOCK_ANALYTICS_KPIS);
  const [dailyData, setDailyData] = useState(() => MOCK_BOOKING_VELOCITY_DAYS);
  const [hubMetrics, setHubMetrics] = useState(() => MOCK_HUB_DWELL_METRICS);
  const [deadheadData, setDeadheadData] = useState(() => MOCK_DEADHEAD_OPTIMIZATION);
  const [bottlenecks, setBottlenecks] = useState(() => MOCK_CORRIDOR_BOTTLENECKS);
  const [cohorts, setCohorts] = useState(() => MOCK_ENTERPRISE_VELOCITY_COHORTS);
  const [footerMetrics, setFooterMetrics] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Sidebar shell state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filters state
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [selectedComparison, setSelectedComparison] = useState("prev_period");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeNavTab, setActiveNavTab] = useState("velocity");

  // Modals state
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedCohortItem, setSelectedCohortItem] = useState(null);

  const isInitialLoadRef = useRef(true);

  // Load Real Data from Backend
  const loadData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setIsLoading(true);
      const res = await fetchAnalyticsOverview({
        timeframe: selectedTimeframe,
        comparison: selectedComparison,
        category: selectedCategory,
      });

      if (res) {
        if (res.kpiData) setKpiData(res.kpiData);
        if (Array.isArray(res.dailyData)) setDailyData(res.dailyData);
        if (Array.isArray(res.hubMetrics)) setHubMetrics(res.hubMetrics);
        if (res.deadheadData) setDeadheadData(res.deadheadData);
        if (Array.isArray(res.bottlenecks)) setBottlenecks(res.bottlenecks);
        if (Array.isArray(res.cohorts)) setCohorts(res.cohorts);
        if (res.footerMetrics) setFooterMetrics(res.footerMetrics);
        setLastSync(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to load real performance analytics data:", err);
    } finally {
      if (!isBackground) setIsLoading(false);
    }
  }, [selectedTimeframe, selectedComparison, selectedCategory]);

  // Trigger on filter changes
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // 30s Realtime Telemetry Auto-Sync
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle Dimension Navigation Scroll
  const handleNavSelect = (tabId) => {
    setActiveNavTab(tabId);
    let targetId = null;
    if (tabId === "velocity") targetId = "widget-velocity";
    else if (tabId === "tonnage") targetId = "widget-tonnage";
    else if (tabId === "dwell") targetId = "widget-dwell";
    else if (tabId === "retention") targetId = "widget-retention";

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("analytics-highlight-focus");
        setTimeout(() => {
          el.classList.remove("analytics-highlight-focus");
        }, 1600);
      }
    }
  };

  const handleSidebarNavigate = (id) => {
    const path = id === "dashboard" ? "/dashboard" : `/${id}`;
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Fallback local clear
    } finally {
      clearCurrentUser();
      navigate("/login");
    }
  };

  return (
    <div
      className={`analytics-page-shell ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
      id="analytics-page-root"
    >
      {/* 1. Fixed Left Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activeModule="analytics"
        onSelectModule={handleSidebarNavigate}
      />

      {/* 2. Content Viewport with Sidebar Clearance */}
      <div className="analytics-content-viewport">
        {/* Fixed Top Navbar with Clearance */}
        <AdminNavbar
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          breadcrumbCurrent="Performance Analytics"
          onLogout={handleLogout}
          adminName={user?.name || "Admin / Ops"}
          adminEmail={user?.email || "ops@hired.in"}
        />

        {/* 3. Main Content Canvas with Navbar Clearance */}
        <main className="analytics-main-content">
          {/* Header & Controls Toolbar */}
          <AnalyticsHeaderToolbar
            selectedTimeframe={selectedTimeframe}
            onSelectTimeframe={setSelectedTimeframe}
            selectedComparison={selectedComparison}
            onSelectComparison={setSelectedComparison}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            timePresets={MOCK_TIME_PRESETS}
            comparisonModels={MOCK_COMPARISON_MODELS}
            fleetCategories={MOCK_FLEET_CATEGORIES}
          />

          {/* 4-Card Executive KPI Bento Grid with Live Database Data */}
          <AnalyticsKPIStats kpiData={kpiData} />

          {/* Segmented Analytics Dimension Navigation Bar */}
          <AnalyticsSegmentedNav
            activeTab={activeNavTab}
            onSelectTab={handleNavSelect}
          />

          {/* Main Two-Column Analytics Layout */}
          <div className="analytics-main-grid">
            {/* Left Dominant Column (approx 65% width) */}
            <div className="analytics-left-col">
              {/* Primary Visual: Booking Velocity & Fulfillment Pacing */}
              <BookingVelocityChart
                dailyData={dailyData}
                footerMetrics={footerMetrics}
              />

              {/* Secondary Visual: Hub Loading Dwell & Turnaround */}
              <HubDwellBarChart
                hubMetrics={hubMetrics}
                onSelectHub={(hub) => setSelectedCohortItem(hub)}
              />
            </div>

            {/* Right Column: Risk & Bottleneck Widgets (approx 35% width) */}
            <div className="analytics-right-col">
              {/* Widget 1: Fleet Deadhead & Empty Miles Optimizer */}
              <FleetDeadheadWidget deadheadData={deadheadData} />

              {/* Widget 2: Corridor Capacity Bottleneck Radar */}
              <CapacityBottleneckRadar
                bottlenecks={bottlenecks}
                onSelectCorridor={(corr) => setSelectedCohortItem(corr)}
              />

              {/* Widget 3: Enterprise Demand Acceleration Matrix */}
              <EnterpriseDemandMatrix
                cohorts={cohorts}
                onSelectAccount={(acc) => setSelectedCohortItem(acc)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Modal Dialogs with Real Context Data */}
      <SimulateDemandModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        corridors={bottlenecks}
        totalBookings={dailyData.reduce((acc, d) => acc + (d.confirmed || 0), 0) || 2}
      />

      <CohortDeepDiveModal
        isOpen={!!selectedCohortItem}
        onClose={() => setSelectedCohortItem(null)}
        cohortItem={selectedCohortItem}
      />

      <ExportAnalyticsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        dailyData={dailyData}
        hubMetrics={hubMetrics}
        deadheadData={deadheadData}
        cohorts={cohorts}
      />
    </div>
  );
}
