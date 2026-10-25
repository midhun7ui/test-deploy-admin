/**
 * Datasets and helpers for Company Accounts (Partner Directory)
 * Live production zero-baseline metrics and empty dataset initialization.
 */

export const MOCK_COMPANIES = [];

/**
 * Compute KPI metrics based on company dataset
 */
export function computeCompanyKPIs(companiesList = []) {
  const list = Array.isArray(companiesList) ? companiesList : [];
  const totalRegistered = list.length;
  const activeCount = list.filter((c) => c.status === "Active").length;
  const pendingKycCount = list.filter((c) => c.status === "Pending KYC").length;
  const creditBreachesCount = list.filter((c) => c.status === "Credit Breach").length;

  return {
    total: {
      count: totalRegistered,
      subtitle: "registered",
      footnote: `${activeCount} active enterprise contracts`,
    },
    active: {
      count: activeCount,
      badge: `${activeCount} Active`,
      subtitle: "Operational accounts with live billing",
    },
    pendingKyc: {
      count: pendingKycCount,
      badge: pendingKycCount > 0 ? "Action Required" : "All Clear",
      subtitle: "GSTIN & documentation under review",
    },
    creditBreaches: {
      count: creditBreachesCount,
      badge: creditBreachesCount > 0 ? "Limit Breached" : "Zero Breaches",
      subtitle: "Outstanding exceeding approved credit",
    },
  };
}

/**
 * Compute tab counter badges based on company figures
 */
export function computeCompanyTabCounts(companiesList = []) {
  const list = Array.isArray(companiesList) ? companiesList : [];
  return {
    all: list.length,
    active: list.filter((c) => c.status === "Active").length,
    pendingKyc: list.filter((c) => c.status === "Pending KYC").length,
    creditWatch: list.filter((c) => c.status === "Credit Watch").length,
    suspended: list.filter((c) => c.status === "Suspended").length,
  };
}
