/**
 * HireD Admin Operations Portal — Driver Management & Fleet Compliance Datasets
 * Zero-baseline production registry data and KPI computation utilities.
 */

export const INITIAL_DRIVERS_DATA = [];

/**
 * Computes high-level KPI counts for the top ribbon matching Stitch mockups
 */
export function computeDriverKPIs(driversList = []) {
  const list = Array.isArray(driversList) ? driversList : [];
  const total = list.length;
  const activeCount = list.filter(
    (d) => d.status === "Active" || d.status === "On Trip"
  ).length;
  const availableCount = list.filter((d) => d.status === "Available").length;
  const pendingKycCount = list.filter(
    (d) => d.status === "Pending KYC" || d.kycStatus === "Pending"
  ).length;

  const activePct =
    total > 0 ? `${((activeCount / total) * 100).toFixed(1)}%` : "0.0%";
  const availablePct =
    total > 0 ? `${((availableCount / total) * 100).toFixed(1)}%` : "0.0%";

  return {
    totalDrivers: total,
    totalSubtitle: "Fleet total across all hubs & regional yards",
    totalBadge: "Hubs Global",
    activeCount: activeCount,
    activePercentage: activePct,
    activeSubtitle: "High route utilization on inter-state corridors",
    availableCount: availableCount,
    availablePercentage: availablePct,
    availableSubtitle: "Ready for immediate dispatch assignment",
    pendingKycCount: pendingKycCount,
    pendingBadge: pendingKycCount > 0 ? "Urgent" : "Cleared",
    pendingSubtitle: "KYC & commercial license review needed",
  };
}

/**
 * Computes filter tab counts matching Stitch UI
 */
export function computeDriverTabCounts(driversList = []) {
  const list = Array.isArray(driversList) ? driversList : [];
  return {
    all: list.length,
    active: list.filter((d) => d.status === "Active" || d.status === "On Trip").length,
    available: list.filter((d) => d.status === "Available").length,
    onTrip: list.filter((d) => d.status === "On Trip").length,
    pendingKyc: list.filter(
      (d) => d.status === "Pending KYC" || d.kycStatus === "Pending"
    ).length,
    pendingBank: list.filter(
      (d) =>
        d.bankDetails?.isPending ||
        d.bankDetails?.status === "Pending" ||
        (d.bankDetails?.hasBank && !d.bankDetails?.isActive)
    ).length,
    inactive: list.filter((d) => d.status === "Inactive").length,
  };
}
