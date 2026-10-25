/**
 * Runtime platform configurations & system settings data definitions for HireD Operations Portal.
 * Compliant with SOC-2 Type II audit logging and ISO 27001 platform standards.
 */

export function buildSettingsKPIs(backendKPIs = null, currentSettings = null) {
  if (Array.isArray(backendKPIs) && backendKPIs.length > 0) {
    return backendKPIs;
  }

  const commission = currentSettings?.freight?.platformCommission ?? 15.0;
  const hubsCount = currentSettings?.entity?.hubs?.length ?? 0;
  const integrationsCount = currentSettings?.integrations?.length ?? 4;
  const buildVersion = currentSettings?.maintenance?.buildVersion ?? "v2.8.4-prod";

  return [
    {
      id: "platform-take",
      label: "DEFAULT PLATFORM TAKE",
      value: `${Number(commission).toFixed(1)}%`,
      badge: "Target Cut",
      badgeType: "primary",
      subtitle: "Applied across non-custom enterprise contracts",
      icon: "percent",
    },
    {
      id: "corridors",
      label: "CORRIDORS CONFIGURED",
      value: `${hubsCount} Hubs`,
      badge: hubsCount > 0 ? "Active Nodes" : "0 Hubs",
      badgeType: "secondary",
      subtitle: "Spanning regional logistics networks",
      icon: "alt_route",
    },
    {
      id: "gateways",
      label: "CONNECTED SERVICES",
      value: `${integrationsCount} Services`,
      badge: "100% SLA",
      badgeType: "success",
      subtitle: "AWS RDS, S3, SES, SNS, Location, Cache",
      icon: "hub",
    },
    {
      id: "config-hash",
      label: "CONFIG IMMUTABLE HASH",
      value: buildVersion,
      badge: "SOC2",
      badgeType: "tertiary",
      subtitle: "sha256:4a8f9c2d1840e7...",
      icon: "security",
    },
  ];
}

export const mockSettingsKPIs = buildSettingsKPIs();

export const mockSettingsTabs = [
  { id: "general", label: "General & Entity Profile", icon: "domain" },
  { id: "freight", label: "Freight Commission & Rate Cards", icon: "receipt_long" },
  { id: "gateways", label: "Payment Gateways & Escrow", icon: "account_balance_wallet" },
  { id: "webhooks", label: "Fleet Telemetry & GPS", icon: "sensors" },
  { id: "messaging", label: "Messaging & Alerts", icon: "chat" },
  { id: "security", label: "Security & Audit Defaults", icon: "verified_user" },
];

export const initialPlatformSettings = {
  // General & Entity Profile
  entity: {
    legalName: "HireD Logistics Private Limited",
    gstin: "32AAACH2941K1Z5",
    pan: "AAACH2941K",
    email: "admin@hired.in",
    phone: "+91 98470 12345",
    hqAddress: "Infopark Kochi, Phase II, Kakkanad, Kochi, Kerala - 682042",
    logoName: "HireD Logistics Brand Mark",
    hubs: [
      { id: "hub-1", name: "West Hub (Mumbai / Pune)", code: "WH-BOM" },
      { id: "hub-2", name: "North Hub (Delhi NCR)", code: "NH-DEL" },
      { id: "hub-3", name: "South Hub (Bengaluru / Kochi)", code: "SH-BLR" },
      { id: "hub-4", name: "East Hub (Kolkata)", code: "EH-CCU" },
    ],
  },

  // Freight Commission & Tariffs
  freight: {
    platformCommission: 15.0,
    tdsDeductionText: "1.5% TDS (Sec 194C) + 18% GST on Fee",
    minBaseFareText: "₹4,500 / 100km Base Payload",
    detentionSurchargeText: "₹350 / hr after 3 hours dwell",
    fuelAutoIndexing: true,
    heavyHaulMultiplier: "1.25x for payload >25 MT",
    nightTransitAllowance: "₹500 / night (23:00 - 05:00)",
  },

  // Escrow, Disbursal & FASTag
  escrow: {
    autoDisburseOnEPod: true,
    singleAdminPayoutCap: "₹5,00,000",
    driverWalletTripFloor: "₹1,500",
    fastagAutoTopup: "Recharge ₹2,500 < ₹800",
    escrowBank: "HDFC Bank Dedicated Freight Escrow",
    cmsPartner: "ICICI Corporate CMS Instant Rails",
  },

  // AIS-140 GPS Gateways & Telemetry
  telemetryAdapters: [
    {
      id: "tel-1",
      name: "AWS Location Fleet Tracking",
      desc: "Real-time Vehicle GPS Streams",
      status: "Active",
      icon: "pin_drop",
    },
    {
      id: "tel-2",
      name: "Minda AIS-140 VTS Stream",
      desc: "Active on Commercial Fleet Units",
      status: "Active",
      icon: "satellite_alt",
    },
  ],

  // Real Third-Party & Infrastructure Integrations Health
  integrations: [
    {
      id: "int-database",
      name: "AWS RDS PostgreSQL",
      desc: "hired_db · Primary Relational Engine",
      status: "healthy",
      health_label: "Active",
      icon: "database",
      category: "Database",
    },
    {
      id: "int-s3",
      name: "AWS S3 Cloud Storage",
      desc: "hired-assets-s3 · Documents & Assets",
      status: "healthy",
      health_label: "Live",
      icon: "cloud_done",
      category: "Storage",
    },
    {
      id: "int-ses",
      name: "AWS SES Email Gateway",
      desc: "midhunmohanan470@gmail.com · Transactional",
      status: "healthy",
      health_label: "Live",
      icon: "mail",
      category: "Email",
    },
    {
      id: "int-sns",
      name: "AWS SNS SMS Gateway",
      desc: "Transactional SMS Route · OTP Delivery",
      status: "healthy",
      health_label: "Operational",
      icon: "sms",
      category: "SMS",
    },
    {
      id: "int-location",
      name: "AWS Location Service",
      desc: "hired-map-client · Geocoding & Routes",
      status: "healthy",
      health_label: "Active",
      icon: "pin_drop",
      category: "Maps & Telemetry",
    },
    {
      id: "int-cache",
      name: "Platform Cache Engine",
      desc: "hired-cache · Memory Key-Value Store",
      status: "healthy",
      health_label: "0ms",
      icon: "cached",
      category: "Cache",
    },
  ],

  // Outbound Webhook
  webhooks: {
    targetUrl: "https://api.hired.in/v1/ops/telemetry",
    signingSecret: "whsec_89df201bfa829471cb921e4",
    subscribedEvents: [
      "trip.created",
      "trip.sla_breach",
      "invoice.dispatched",
      "driver.kyc_alert",
      "payout.settled",
    ],
  },

  // Messaging & Alerts
  messaging: {
    whatsappVendor: "Meta Cloud API (WABA ID: 981240182)",
    dltSenderId: "HIREDL",
    dltEntityId: "11015682910023",
    urgentEscalationPhone: "+91 94471 23456",
    emailGateway: "Amazon SES (ap-south-1)",
  },

  // Security Defaults
  security: {
    sessionTimeoutMins: 30,
    mfaEnforced: true,
    auditLogLevel: "ALL_MUTATIONS_AND_READS",
    vpnSubnet: "10.240.0.0/16",
    hardwareTokenRequiredForPayout: true,
  },

  // Platform Maintenance & Cache
  maintenance: {
    maintenanceMode: false,
    lastConfigSync: "Synced with production cluster",
    clusterRegion: "AP-South-1 (Mumbai)",
    buildVersion: "v2.8.4-prod",
  },
};
