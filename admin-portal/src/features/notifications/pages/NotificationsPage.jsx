import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";

import AdminNavbar from "../../dashboard/components/AdminNavbar";
import AdminSidebar from "../../dashboard/components/AdminSidebar";

import NotificationsHeaderToolbar from "../components/NotificationsHeaderToolbar";
import NotificationsKPIStats from "../components/NotificationsKPIStats";
import NotificationsSegmentedNav from "../components/NotificationsSegmentedNav";
import NotificationsFilterBar from "../components/NotificationsFilterBar";
import NotificationsStreamList from "../components/NotificationsStreamList";
import NotificationInspectorPanel from "../components/NotificationInspectorPanel";
import NotificationChannelsHealthBar from "../components/NotificationChannelsHealthBar";

import AlertRulesSubscriptionsModal from "../components/AlertRulesSubscriptionsModal";
import WebhookLogsModal from "../components/WebhookLogsModal";
import BroadcastAlertModal from "../components/BroadcastAlertModal";
import ChannelConfigModal from "../components/ChannelConfigModal";

import {
  MOCK_NOTIFICATIONS_KPIS,
  MOCK_NOTIFICATION_ITEMS,
  MOCK_CHANNELS_HEALTH,
  MOCK_ALERT_RULES,
  MOCK_WEBHOOK_LOGS,
  buildNotificationsKPIs,
} from "../data/mockNotificationsData";

import {
  fetchNotifications,
  fetchNotificationStats,
  broadcastNotification,
  markAllNotificationsRead,
  markNotificationRead,
  dismissNotification,
  acknowledgeNotification,
  addNotificationAuditNote,
  waiveNotificationPenalty,
  fetchWebhookLogs,
  fetchAlertRules,
  saveAlertRules,
  fetchChannelConfig,
  saveChannelConfig,
} from "../services/notificationsApi";

import "../styles/notifications.css";

function NotificationsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Sidebar and Shell Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filters & Tabs State
  const [selectedShift, setSelectedShift] = useState("24h");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [isAutoPolling, setIsAutoPolling] = useState(true);

  // Notifications Data State
  const [kpiData, setKpiData] = useState(MOCK_NOTIFICATIONS_KPIS);
  const [notificationItems, setNotificationItems] = useState(MOCK_NOTIFICATION_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals & Aux Data State
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isWebhookLogsModalOpen, setIsWebhookLogsModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isChannelConfigModalOpen, setIsChannelConfigModalOpen] = useState(false);

  const [webhookLogs, setWebhookLogs] = useState(() => MOCK_WEBHOOK_LOGS);
  const [alertRules, setAlertRules] = useState(() => MOCK_ALERT_RULES);
  const [channelConfig, setChannelConfig] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Navigation handler
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

  // Filter notification items
  const filteredItems = useMemo(() => {
    return notificationItems.filter((item) => {
      // Category Tab filter
      if (activeTab !== "all" && item.category !== activeTab) {
        return false;
      }

      // Severity filter
      if (severityFilter !== "all" && item.type !== severityFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = (item.description || item.message || "").toLowerCase().includes(query);
        const matchesCorridor = (item.corridor || "").toLowerCase().includes(query);
        const matchesAccount = (item.account || "").toLowerCase().includes(query);
        const matchesDriver = item.metadata?.driverName?.toLowerCase().includes(query);
        const matchesTrip = item.metadata?.tripId?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCorridor && !matchesAccount && !matchesDriver && !matchesTrip) {
          return false;
        }
      }

      return true;
    });
  }, [notificationItems, activeTab, severityFilter, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: notificationItems.length,
      critical: notificationItems.filter((i) => i.category === "critical").length,
      compliance: notificationItems.filter((i) => i.category === "compliance").length,
      finance: notificationItems.filter((i) => i.category === "finance").length,
      telemetry: notificationItems.filter((i) => i.category === "telemetry").length,
      webhooks: notificationItems.filter((i) => i.category === "webhooks").length,
    };
  }, [notificationItems]);

  // Total unread count
  const unreadCount = useMemo(() => {
    return notificationItems.filter((i) => i.unread).length;
  }, [notificationItems]);

  // Selected item object
  const selectedItem = useMemo(() => {
    return notificationItems.find((i) => i.id === selectedItemId) || filteredItems[0] || null;
  }, [notificationItems, selectedItemId, filteredItems]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  // Mark all as read with backend persistence
  const handleMarkAllRead = async () => {
    setNotificationItems((prev) => prev.map((item) => ({ ...item, unread: false })));
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Select item & mark as read with backend persistence
  const handleSelectItem = async (item) => {
    setSelectedItemId(item.id);
    if (item.unread) {
      setNotificationItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, unread: false } : i))
      );
      try {
        const rawId = item.raw_id || parseInt(String(item.id).replace(/\D/g, ""), 10);
        if (rawId) await markNotificationRead(rawId);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

  // Dismiss item with backend persistence
  const handleDismissItem = async (id) => {
    const itemToDismiss = notificationItems.find((i) => i.id === id);
    setNotificationItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItemId === id) {
      const remaining = notificationItems.filter((i) => i.id !== id);
      if (remaining.length > 0) {
        setSelectedItemId(remaining[0].id);
      }
    }
    if (itemToDismiss) {
      try {
        const rawId = itemToDismiss.raw_id || parseInt(String(id).replace(/\D/g, ""), 10);
        if (rawId) await dismissNotification(rawId);
      } catch (err) {
        console.error("Failed to dismiss notification:", err);
      }
    }
  };

  // Action Click from stream card
  const handleActionClick = (actionType, item) => {
    setSelectedItemId(item.id);
    if (actionType === "assign") {
      alert(`Incident Manager assigned to Trip ${item.metadata?.tripId || item.title}. Escalation packet delivered to regional ops coordinator.`);
    } else if (actionType === "review_kyc") {
      alert(`Opening KYC review record for ${item.metadata?.driverName}.`);
    } else if (actionType === "ping_whatsapp") {
      alert(`WhatsApp document upload advisory re-sent to ${item.metadata?.driverName} (${item.metadata?.driverPhone}).`);
    } else if (actionType === "view_statement") {
      navigate("/statements");
    } else if (actionType === "view_trip") {
      navigate("/trips");
    }
  };

  // Inspector actions: Acknowledge with backend persistence
  const handleAcknowledge = async (item) => {
    const rawId = item.raw_id || parseInt(String(item.id).replace(/\D/g, ""), 10);
    try {
      const res = await acknowledgeNotification(rawId);
      if (res && res.notification) {
        setNotificationItems((prev) =>
          prev.map((i) => (i.id === item.id ? res.notification : i))
        );
        return;
      }
    } catch (err) {
      console.error("Failed to acknowledge notification on backend:", err);
    }

    // Local fallback
    setNotificationItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              unread: false,
              tag: "Support Dispatched",
              timeline: [
                ...i.timeline,
                {
                  time: "Just now",
                  title: `Support Dispatched by ${user?.name || "Admin"}`,
                  desc: "Incident acknowledged. Mechanical support en-route.",
                  status: "success",
                },
              ],
            }
          : i
      )
    );
  };

  const handleCallDriver = (item) => {
    alert(`Initiating WebRTC direct voice line to ${item.metadata?.driverName || "driver"} (${item.metadata?.driverPhone || "phone"}).`);
  };

  // Inspector actions: Waive Penalty with backend persistence
  const handleWaivePenalty = async (item) => {
    const rawId = item.raw_id || parseInt(String(item.id).replace(/\D/g, ""), 10);
    const reason = `SLA transit penalty waiver approved by ${user?.name || "Admin Operations"}. Reason: Highway toll sensor failure.`;
    try {
      const res = await waiveNotificationPenalty(rawId, reason);
      if (res && res.notification) {
        setNotificationItems((prev) =>
          prev.map((i) => (i.id === item.id ? res.notification : i))
        );
        return;
      }
    } catch (err) {
      console.error("Failed to waive penalty on backend:", err);
    }
    alert(`SLA transit penalty waiver request submitted for Trip ${item.metadata?.tripId || item.id}. Reason: Highway toll sensor failure.`);
  };

  // Inspector actions: Add Audit Note with backend persistence
  const handleAddAuditNote = async (itemId, noteText) => {
    const target = notificationItems.find((i) => i.id === itemId);
    const rawId = target?.raw_id || parseInt(String(itemId).replace(/\D/g, ""), 10);
    try {
      const res = await addNotificationAuditNote(rawId, noteText);
      if (res && res.notification) {
        setNotificationItems((prev) =>
          prev.map((i) => (i.id === itemId ? res.notification : i))
        );
        return;
      }
    } catch (err) {
      console.error("Failed to save audit note on backend:", err);
    }

    // Local fallback
    setNotificationItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newNote = {
            id: `note-${Date.now()}`,
            author: `${user?.name || "Admin Ops"} (Shift Lead)`,
            time: "Just now",
            text: noteText,
          };
          return {
            ...item,
            auditNotes: [...(item.auditNotes || []), newNote],
          };
        }
        return item;
      })
    );
  };

  // Save rules handler
  const handleSaveRules = async (rules) => {
    try {
      const res = await saveAlertRules(rules);
      if (res && res.rules) setAlertRules(res.rules);
    } catch (err) {
      console.error("Failed to save alert rules:", err);
    }
  };

  // Save channel config handler
  const handleSaveChannelConfig = async (config) => {
    try {
      const res = await saveChannelConfig(config);
      if (res) setChannelConfig(res);
    } catch (err) {
      console.error("Failed to save channel config:", err);
    }
  };

  // Live Data Loader
  const loadNotificationsAndStats = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [items, stats, logs, rules, config] = await Promise.all([
        fetchNotifications({ shift: selectedShift }),
        fetchNotificationStats().catch(() => null),
        fetchWebhookLogs().catch(() => []),
        fetchAlertRules().catch(() => MOCK_ALERT_RULES),
        fetchChannelConfig().catch(() => null),
      ]);
      const safeItems = Array.isArray(items) ? items : [];
      setNotificationItems(safeItems);
      setKpiData(buildNotificationsKPIs(safeItems, stats));
      if (Array.isArray(logs) && logs.length > 0) setWebhookLogs(logs);
      if (Array.isArray(rules) && rules.length > 0) setAlertRules(rules);
      if (config) setChannelConfig(config);

      setSelectedItemId((prev) => {
        if (prev && safeItems.some((i) => i.id === prev)) return prev;
        return safeItems.length > 0 ? safeItems[0].id : "";
      });
    } catch (err) {
      console.error("Failed to load notifications from backend:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [selectedShift]);

  // Initial load & shift change
  useEffect(() => {
    loadNotificationsAndStats(false);
  }, [loadNotificationsAndStats]);

  // Live Auto-Polling
  useEffect(() => {
    if (!isAutoPolling) return;
    const interval = setInterval(() => {
      loadNotificationsAndStats(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [isAutoPolling, loadNotificationsAndStats]);

  // Send Broadcast via live backend API
  const handleSendBroadcast = async (broadcastData) => {
    try {
      await broadcastNotification({
        title: broadcastData.title,
        message: broadcastData.message,
        corridor: broadcastData.corridor,
        severity: broadcastData.severity,
        channels: broadcastData.channels,
        type: broadcastData.severity === "critical" ? "alert" : "system",
      });
      await loadNotificationsAndStats(true);
    } catch (err) {
      console.error("Failed to dispatch broadcast to backend:", err);
      // Fallback local update
      const newBroadcastItem = {
        id: `notif-bc-${Date.now()}`,
        type: broadcastData.severity === "critical" ? "critical" : "warning",
        category: "telemetry",
        title: broadcastData.title,
        tag: "Fleet Broadcast",
        time: "Just now",
        timestamp: new Date().toLocaleString("en-IN"),
        unread: true,
        corridor: broadcastData.corridor === "all" ? "All Corridors" : broadcastData.corridor,
        account: "Highway Ops Broadcast",
        description: broadcastData.message,
        metadata: {
          tripId: "FLEET-BROADCAST",
          vehicleNumber: "All Corridor Fleets",
          driverName: "Emergency Ops Desk",
          locationName: "Regional Corridors",
        },
        timeline: [
          {
            time: "Just now",
            title: "Broadcast Dispatched",
            desc: "Dispatched to active fleet drivers.",
            status: "success",
          },
        ],
        automatedTriggers: ["Real-time push dispatched to active drivers."],
        auditNotes: [],
      };
      setNotificationItems((prev) => [newBroadcastItem, ...prev]);
      setSelectedItemId(newBroadcastItem.id);
    }
  };

  return (
    <div
      className={`notifications-page-shell ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
      id="notifications-page-root"
    >
      {/* 1. Left Fixed Application Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activeModule="notifications"
        onSelectModule={handleSidebarNavigate}
      />

      {/* 2. Content Viewport with Sidebar Clearance */}
      <div className="notifications-content-viewport">
        {/* Fixed Top Navbar with Clearance */}
        <AdminNavbar
          onToggleSidebar={() => setMobileSidebarOpen(true)}
          onOpenSearch={() => {}}
          onLogout={handleLogout}
          user={user}
          breadcrumbCurrent="Notification Center"
          unreadCount={unreadCount}
        />

        {/* 3. Main Content Canvas */}
        <main className="notifications-main-content">
          {/* Header & Controls Toolbar */}
          <NotificationsHeaderToolbar
            selectedShift={selectedShift}
            onSelectShift={(shift) => {
              setSelectedShift(shift);
              setCurrentPage(1);
            }}
            onMarkAllRead={handleMarkAllRead}
            onOpenRulesModal={() => setIsRulesModalOpen(true)}
            onOpenChannelsModal={() => setIsChannelConfigModalOpen(true)}
            onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
          />

          {/* 4-Card Alert Summary Bento Grid */}
          <NotificationsKPIStats
            kpiData={kpiData}
            onFilterByKPI={(category) => setActiveTab(category)}
          />

          {/* Dual-Pane Workspace */}
          <div className="notifications-workspace-grid">
            {/* LEFT PANE: Event Stream & Filtered Activity Feed */}
            <div className="notifications-left-pane">
              {/* Segmented Navigation Tabs */}
              <NotificationsSegmentedNav
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                counts={tabCounts}
              />

              {/* Advanced Filter and Search Bar */}
              <NotificationsFilterBar
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  setCurrentPage(1);
                }}
                severityFilter={severityFilter}
                onSeverityChange={(s) => {
                  setSeverityFilter(s);
                  setCurrentPage(1);
                }}
                channelFilter={channelFilter}
                onChannelChange={setChannelFilter}
                isAutoPolling={isAutoPolling}
                onToggleAutoPoll={() => setIsAutoPolling((p) => !p)}
              />

              {/* Feed Stream List */}
              <NotificationsStreamList
                items={paginatedItems}
                selectedItemId={selectedItem?.id}
                onSelectItem={handleSelectItem}
                onDismissItem={handleDismissItem}
                onActionClick={handleActionClick}
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
                onNextPage={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                totalItemsCount={filteredItems.length}
              />
            </div>

            {/* RIGHT PANE: Selected Alert Deep-Dive & Action Console */}
            <div className="notifications-right-pane">
              <NotificationInspectorPanel
                selectedItem={selectedItem}
                onAcknowledge={handleAcknowledge}
                onCallDriver={handleCallDriver}
                onWaivePenalty={handleWaivePenalty}
                onAddAuditNote={handleAddAuditNote}
              />
            </div>
          </div>

          {/* Bottom Dispatcher Channels Health Bar */}
          <NotificationChannelsHealthBar
            channelsHealth={MOCK_CHANNELS_HEALTH}
            onOpenWebhookLogs={() => setIsWebhookLogsModalOpen(true)}
            onOpenChannelConfig={() => setIsChannelConfigModalOpen(true)}
          />
        </main>
      </div>

      {/* Interactive Modals */}
      <AlertRulesSubscriptionsModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        rules={alertRules}
        onSaveRules={handleSaveRules}
      />

      <WebhookLogsModal
        isOpen={isWebhookLogsModalOpen}
        onClose={() => setIsWebhookLogsModalOpen(false)}
        logs={webhookLogs}
      />

      <BroadcastAlertModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onSendBroadcast={handleSendBroadcast}
      />

      <ChannelConfigModal
        isOpen={isChannelConfigModalOpen}
        onClose={() => setIsChannelConfigModalOpen(false)}
        channelConfig={channelConfig}
        onSaveConfig={handleSaveChannelConfig}
      />
    </div>
  );
}

export default NotificationsPage;
