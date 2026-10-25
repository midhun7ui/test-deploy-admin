/**
 * Datasets and KPI helpers for Accounts & Credit (Financial Risk & Ledger)
 * Modeled after Stitch reference: 8._accounts_credit
 * Sanitized for live production baseline metrics.
 */

export const MOCK_ACCOUNTS = [];

/**
 * Computes high-level KPI metrics from accounts list
 */
export function computeAccountKPIs(accountsList = []) {
  const list = Array.isArray(accountsList) ? accountsList : [];
  const totalOutstandingVal = list.reduce((sum, a) => sum + (Number(a.outstanding) || 0), 0);
  const totalCreditLimitVal = list.reduce((sum, a) => sum + (Number(a.creditLimit) || 0), 0);
  const portfolioUtilisation = totalCreditLimitVal > 0
    ? `${((totalOutstandingVal / totalCreditLimitVal) * 100).toFixed(1)}%`
    : "0.0%";
  const blockedCount = list.filter((a) => a.status === "Blocked").length;
  const delinquent90dVal = list.reduce((sum, a) => sum + (Number(a.ageing?.d90) || 0), 0);

  const formatCurr = (v) => `₹${Math.round(v).toLocaleString("en-IN")}`;

  return {
    totalOutstanding: {
      value: formatCurr(totalOutstandingVal),
      badge: `${list.length} Lines`,
      badgeType: "danger",
      subtitle: `Across ${list.length} active credit accounts`,
      progressPct: Math.min(100, Math.round((totalOutstandingVal / (totalCreditLimitVal || 1)) * 100)),
    },
    portfolioUtilisation: {
      value: portfolioUtilisation,
      badge: "Safe Cap < 85%",
      badgeType: "safe",
      subtitle: `${formatCurr(Math.max(0, totalCreditLimitVal - totalOutstandingVal))} buffer before ceiling`,
      progress1Pct: Math.min(100, Math.round((totalOutstandingVal / (totalCreditLimitVal || 1)) * 100)),
      progress2Pct: 0,
    },
    delinquent90d: {
      value: formatCurr(delinquent90dVal),
      badge: delinquent90dVal > 0 ? "High Risk" : "Zero Breaches",
      badgeType: delinquent90dVal > 0 ? "danger" : "safe",
      subtitle: `${list.filter((a) => (a.ageing?.d90 || 0) > 0).length} accounts flagged for dunning`,
      progressPct: delinquent90dVal > 0 ? 30 : 0,
    },
    blockedAccounts: {
      value: blockedCount,
      badge: blockedCount > 0 ? "Action Required" : "All Clear",
      badgeType: blockedCount > 0 ? "danger" : "safe",
      subtitle: "Bookings automatically halted via risk controls",
      progressPct: Math.min(100, blockedCount * 25),
    },
  };
}

/**
 * Computes filter tab counts matching Stitch UI
 */
export function computeAccountTabCounts(accountsList = []) {
  const list = Array.isArray(accountsList) ? accountsList : [];
  return {
    all: list.length,
    active: list.filter((a) => a.status === "Active").length,
    watchlist: list.filter((a) => a.status === "Watchlist").length,
    breached: list.filter((a) => a.status === "Blocked" || (Number(a.utilizationRate) || 0) > 100).length,
    healthy: list.filter((a) => a.status === "Healthy").length,
  };
}
