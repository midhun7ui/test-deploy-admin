/**
 * Datasets & KPI helpers for Section 14: Notification Center & Incident Activity Stream.
 * Live zero-baseline data initialization. Real events are fetched via notificationsApi.
 */

export function buildNotificationsKPIs(items = [], stats = null) {
  const safeItems = Array.isArray(items) ? items : [];
  const criticalCount = safeItems.filter(
    (i) => i.type === "critical" || i.category === "critical"
  ).length;
  const complianceCount = safeItems.filter(
    (i) => i.category === "compliance"
  ).length;
  const financeCount = safeItems.filter(
    (i) => i.category === "finance" || i.category === "webhooks"
  ).length;
  const broadcastCount = safeItems.filter(
    (i) => i.category === "telemetry" || i.tag === "Fleet Broadcast" || i.type === "broadcast"
  ).length;

  return {
    critical: {
      count: criticalCount,
      formattedCount: String(criticalCount).padStart(2, "0"),
      label: "Critical Alerts",
      badge: stats?.activeAlerts?.badge || (criticalCount > 0 ? "Action Required" : "All Clear"),
      subtext: stats?.activeAlerts?.subtitle || (criticalCount > 0 ? "Immediate intervention needed" : "Zero critical escalations"),
      footerText: criticalCount > 0 ? `${criticalCount} active priority alerts` : "All systems normal",
      type: "critical",
    },
    compliance: {
      count: complianceCount,
      formattedCount: String(complianceCount).padStart(2, "0"),
      label: "Compliance Warnings",
      badge: complianceCount > 0 ? "Action Required" : "Compliant",
      subtext: complianceCount > 0 ? "Document renewal required" : "All documents in order",
      footerText: complianceCount > 0 ? `${complianceCount} warnings pending` : "0 warnings pending",
      type: "warning",
    },
    financial: {
      count: financeCount,
      formattedCount: String(financeCount).padStart(2, "0"),
      label: "Financial & Webhooks",
      badge: stats?.outboxSuccessRate?.value || "100% Delivery",
      subtext: "Auto-reconciled events today",
      footerText: stats?.outboxSuccessRate?.subtitle || "0 dropped webhooks",
      type: "financial",
    },
    broadcasts: {
      count: broadcastCount,
      formattedCount: String(broadcastCount).padStart(2, "0"),
      label: "Operations Broadcasts",
      badge: "Sync Active",
      subtext: stats?.dispatchesToday?.subtitle || "Dispatched to drivers & clients",
      footerText: `${safeItems.length} total messages in history`,
      type: "broadcast",
    },
  };
}

export const MOCK_NOTIFICATIONS_KPIS = buildNotificationsKPIs([]);

export const MOCK_NOTIFICATION_ITEMS = [];

export const MOCK_CHANNELS_HEALTH = {
  status: "Operational",
  summary: "All Event Dispatchers Operational",
  channels: [
    { name: "WhatsApp Business API", metric: "99.8% delivery", latency: "32ms avg", status: "healthy" },
    { name: "Webhook Gateway", metric: "0 failed retries", latency: "14ms avg", status: "healthy" },
    { name: "SMS Tier-1 Route", metric: "DLT Active", latency: "420ms avg", status: "healthy" },
    { name: "Push Queue", metric: "Active", latency: "8ms avg", status: "healthy" },
  ],
};

export const MOCK_ALERT_RULES = [
  {
    id: "rule-1",
    name: "Corridor SLA Transit Delay > 45m",
    category: "Operations",
    severity: "Critical",
    channels: ["WhatsApp", "SMS", "In-App"],
    enabled: true,
    description: "Triggers escalation when live vehicle GPS falls 45 minutes behind scheduled ETA.",
  },
  {
    id: "rule-2",
    name: "FASTag Blacklist / Gate Stall > 30m",
    category: "Operations",
    severity: "Critical",
    channels: ["In-App", "SMS"],
    enabled: true,
    description: "Alerts dispatch control when commercial vehicle is stationary at toll plaza > 30 mins.",
  },
  {
    id: "rule-3",
    name: "Driver Document Expiry ≤ 7 Days",
    category: "Compliance",
    severity: "Warning",
    channels: ["WhatsApp", "In-App"],
    enabled: true,
    description: "Notifies driver and admin ops when fitness, license, or permit enters 7-day expiry window.",
  },
  {
    id: "rule-4",
    name: "Bank IMPS / Payout Gateway Rejection",
    category: "Finance",
    severity: "Critical",
    channels: ["In-App", "SMS", "Email"],
    enabled: true,
    description: "Freezes disputed transaction and alerts accounts team on beneficiary title mismatch.",
  },
  {
    id: "rule-5",
    name: "Cold Chain Temperature Excursion > 2°C",
    category: "Operations",
    severity: "Critical",
    channels: ["WhatsApp", "In-App", "Direct Call"],
    enabled: true,
    description: "Alerts shipper ops and nearest support depot if reefer temperature exceeds preset tolerance.",
  },
];

export const MOCK_WEBHOOK_LOGS = [];
