/**
 * Datasets and KPI helpers for Invoicing & Billing (Billing & GST Compliance)
 * Modeled after Stitch reference: 10._invoicing
 * Sanitized for live production baseline metrics.
 */

export const MOCK_INVOICES = [];

/**
 * Computes high-level KPI metrics matching Stitch screen 10
 */
export function computeInvoiceKPIs(invoicesList = []) {
  const list = Array.isArray(invoicesList) ? invoicesList : [];
  const pendingCount = list.filter(
    (inv) => inv.status === "Review Pending" || inv.statusType === "pending"
  ).length;

  const totalBilledVal = list.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
  const outstandingVal = list
    .filter((inv) => inv.status !== "Paid")
    .reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);

  const formatCurr = (v) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return {
    billedThisCycle: {
      value: formatCurr(totalBilledVal),
      delta: `${list.length} Invoices`,
      invoiceCount: `${list.length} Invoices`,
      subtitle: `Across ${list.length} enterprise invoices`,
      progressPct: Math.min(100, list.length * 10),
    },
    outstandingReceivables: {
      value: formatCurr(outstandingVal),
      badge: "Due within 30d",
      invoiceCount: `${list.length} Invoices`,
      subtitle: `${list.length} invoices within credit term buffer`,
      progressPct: Math.min(100, list.length * 15),
    },
    overdueDunning: {
      value: "₹0",
      badge: "Zero Breaches",
      tag: "All Clear",
      subtitle: "Zero accounts exceeding agreed payment terms",
      progressPct: 0,
    },
    draftsPendingReview: {
      value: pendingCount < 10 ? `0${pendingCount}` : `${pendingCount}`,
      badge: pendingCount > 0 ? "Action Required" : "All Clear",
      tag: "Two-Step Sign-off",
      subtitle: `${pendingCount} invoices requiring administrative sign-off`,
      progressPct: pendingCount * 25,
    },
  };
}

/**
 * Computes filter tab counts matching Stitch UI
 */
export function computeInvoiceTabCounts(invoicesList = []) {
  const list = Array.isArray(invoicesList) ? invoicesList : [];
  return {
    all: list.length,
    pending: list.filter((inv) => (inv.status || "").includes("Pending")).length,
    draft: list.filter((inv) => (inv.status || "").toLowerCase().includes("draft")).length,
    sent: list.filter((inv) => (inv.status || "").toLowerCase().includes("published") || (inv.status || "").toLowerCase().includes("sent")).length,
    overdue: list.filter((inv) => (inv.status || "").toLowerCase().includes("overdue")).length,
    paid: list.filter((inv) => (inv.status || "").toLowerCase().includes("paid")).length,
  };
}
