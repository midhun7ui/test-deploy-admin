/**
 * HireD Admin Operations Portal — Orders Management Definitions & Configuration
 * Zero-baseline production configuration.
 * Real orders are fetched dynamically from the live REST API via ordersApi.
 */

export const INITIAL_ORDERS_DATA = [];

export const AVAILABLE_DRIVERS_POOL = [];

/**
 * Computes high-level KPI counts for the top ribbon
 */
export function computeOrderStats(orders) {
  const safeList = Array.isArray(orders) ? orders : [];
  const total = safeList.length;
  const pending = safeList.filter((o) => o.status === "Pending Review").length;
  const accepted = safeList.filter((o) => o.status === "Accepted" || o.status === "Converted to Trip").length;
  const rejected = safeList.filter((o) => o.status === "Rejected").length;

  const rejectedRate = total > 0 ? `${round((rejected / total) * 100, 1)}% rate` : "0.0% rate";

  return {
    totalOrders: total,
    totalOrdersTrending: "+14.2%",
    totalOrdersSubtitle: `${total} active registered orders`,
    pendingReview: pending,
    pendingActionBadge: pending > 0 ? "Requires action" : "Review queue clear",
    pendingSubtitle: "Avg turnaround: < 25 mins",
    acceptedOrders: accepted,
    acceptedBadge: "Active status",
    acceptedSubtitle: "Ready for dispatch / trip creation",
    rejectedOrders: rejected,
    rejectedRateBadge: rejectedRate,
    rejectedSubtitle: "Pricing or fleet mismatch",
  };
}

function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

/**
 * Computes counts for each pipeline tab
 */
export function computeOrderTabCounts(orders) {
  const safeList = Array.isArray(orders) ? orders : [];
  return {
    all: safeList.length,
    pending: safeList.filter((o) => o.status === "Pending Review").length,
    accepted: safeList.filter((o) => o.status === "Accepted").length,
    converted: safeList.filter((o) => o.status === "Converted to Trip").length,
    rejected: safeList.filter((o) => o.status === "Rejected").length,
  };
}
