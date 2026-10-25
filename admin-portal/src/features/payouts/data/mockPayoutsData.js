/**
 * Baseline data and KPI helpers for Payouts & Driver Wallets (Disbursement & Settlements)
 * Modeled after Stitch reference: 9._payouts_driver_wallets
 * Zero-baseline metrics cleanly computed from real database payouts.
 */

export const MOCK_PAYOUTS = [];

/**
 * Computes live high-level KPI metrics matching Stitch screen 9
 */
export function computePayoutKPIs(payoutsList = []) {
  const safeList = Array.isArray(payoutsList) ? payoutsList : [];
  const total = safeList.length;

  const totalPayableVal = safeList.reduce((acc, p) => acc + (Number(p.netPayout) || 0), 0);
  const pendingItems = safeList.filter(
    (p) => p.status === "Pending Approval" || p.statusType === "pending"
  );
  const pendingAmount = pendingItems.reduce((acc, p) => acc + (Number(p.netPayout) || 0), 0);
  const pendingCount = pendingItems.length;

  const settledItems = safeList.filter(
    (p) => p.status === "Settled" || p.statusType === "settled"
  );
  const settledAmount = settledItems.reduce((acc, p) => acc + (Number(p.netPayout) || 0), 0);

  const failedItems = safeList.filter(
    (p) => (p.status && p.status.includes("Hold")) || p.statusType === "failed"
  );
  const failedAmount = failedItems.reduce((acc, p) => acc + (Number(p.netPayout) || 0), 0);
  const failedCount = failedItems.length;

  return {
    totalPayable: {
      value: `₹${totalPayableVal.toLocaleString("en-IN")}`,
      badge: total > 0 ? "Active Queue" : "Zero Queue",
      badgeType: "primary",
      subtitle: `Net driver earnings queued across ${total} trips`,
      progressPct: total > 0 ? 100 : 0,
    },
    pendingDisbursements: {
      value: String(pendingCount),
      badge: pendingCount > 0 ? "Action Required" : "All Clear",
      badgeType: pendingCount > 0 ? "amber" : "emerald",
      subtitle: `₹${pendingAmount.toLocaleString("en-IN")} pending ops approval & OTP match`,
      progressPct: total > 0 ? Math.round((pendingCount / total) * 100) : 0,
    },
    paidThisCycle: {
      value: `₹${settledAmount.toLocaleString("en-IN")}`,
      badge: "On Schedule",
      badgeType: "emerald",
      subtitle: `${settledItems.length} successful IMPS/NEFT transfers`,
      progressPct: total > 0 ? Math.round((settledItems.length / total) * 100) : 0,
    },
    failedOnHold: {
      value: String(failedCount),
      badge: failedCount > 0 ? "High Priority" : "Zero Exceptions",
      badgeType: failedCount > 0 ? "danger" : "emerald",
      subtitle: `₹${failedAmount.toLocaleString("en-IN")} failed due to IFSC / bank mismatch`,
      progressPct: total > 0 ? Math.round((failedCount / total) * 100) : 0,
    },
  };
}

/**
 * Computes pipeline filter tab counters matching Stitch UI
 */
export function computePayoutTabCounts(payoutsList = []) {
  const safeList = Array.isArray(payoutsList) ? payoutsList : [];
  return {
    all: safeList.length,
    pending: safeList.filter((p) => p.status?.includes("Pending") || p.statusType === "pending").length,
    ready: safeList.filter((p) => p.status?.includes("Ready") || p.statusType === "ready").length,
    settled: safeList.filter((p) => p.status?.includes("Settled") || p.statusType === "settled").length,
    failed: safeList.filter((p) => (p.status && p.status.includes("Hold")) || p.statusType === "failed").length,
  };
}
