/**
 * Baseline data and constants for HireD Admin Enquiries & CRM module.
 * Initial state starts clean and zeroed; live leads are fetched via REST API.
 */

export const INITIAL_ENQUIRIES_DATA = [];

export const OPS_OWNERS = [
  { id: "unassigned", name: "Unassigned", initials: "UA", color: "#94a3b8" },
  { id: "aparna", name: "Aparna S.", initials: "AS", color: "#7c3aed" },
  { id: "vishnu", name: "Vishnu P.", initials: "VP", color: "#059669" },
  { id: "rajesh", name: "Rajesh K.", initials: "RK", color: "#2563eb" },
];

export const LEAD_SOURCES = [
  { id: "Direct Order", label: "Direct Order", icon: "assignment_turned_in" },
  { id: "Partner Order", label: "Partner Order", icon: "local_shipping" },
  { id: "Website", label: "Website", icon: "language" },
  { id: "Referral", label: "Referral", icon: "group" },
  { id: "Marketplace", label: "Marketplace", icon: "storefront" },
  { id: "Outbound", label: "Outbound", icon: "mail" },
  { id: "Direct Call", label: "Direct Call", icon: "call" },
];

export const PIPELINE_COLUMNS = [
  { id: "New", title: "New", colorDot: "#3b82f6" },
  { id: "Contacted", title: "Contacted", colorDot: "#6366f1" },
  { id: "Qualified", title: "Qualified", colorDot: "#8b5cf6" },
  { id: "Converted", title: "Converted", colorDot: "#10b981" },
  { id: "Lost", title: "Lost", colorDot: "#ef4444" },
];

/**
 * Calculates current KPI statistics based on current enquiries array.
 * Strictly uses live data from the database.
 */
export function computeEnquiryStats(enquiries = []) {
  const safeEnquiries = Array.isArray(enquiries) ? enquiries : [];

  const openEnquiries = safeEnquiries.filter(
    (e) => e.status === "New" || e.status === "Contacted"
  ).length;

  const needsFollowUp = safeEnquiries.filter(
    (e) => e.status === "Contacted"
  ).length;

  const qualifiedLeads = safeEnquiries.filter(
    (e) => e.status === "Qualified"
  );
  const qualifiedCount = qualifiedLeads.length;

  // Calculate annual recurring rate in Lakhs
  const qualifiedAnnualVolume = qualifiedLeads.reduce(
    (acc, curr) => acc + (curr.numericVolume || 0),
    0
  );
  const arrLakhs = (qualifiedAnnualVolume / 100000).toFixed(1);

  const unassignedCount = safeEnquiries.filter(
    (e) => !e.owner && e.status !== "Converted" && e.status !== "Lost"
  ).length;

  return {
    openEnquiries: {
      value: openEnquiries,
      badge: `${openEnquiries} active`,
      label: "across all sources",
      icon: "description",
      theme: "blue",
    },
    needsFollowUp: {
      value: needsFollowUp,
      badge: `${needsFollowUp} pending`,
      label: "contacted, awaiting reply",
      icon: "phone_in_talk",
      theme: "blue",
    },
    qualifiedPipeline: {
      value: qualifiedCount,
      badge: `₹${arrLakhs}L ARR`,
      label: "ready to convert",
      icon: "filter_alt",
      theme: "purple",
    },
    unassignedOwner: {
      value: unassignedCount,
      badge: unassignedCount > 0 ? `${unassignedCount} unassigned` : "All Assigned",
      label: "assign an ops owner",
      icon: "person_alert",
      theme: "red",
    },
  };
}
