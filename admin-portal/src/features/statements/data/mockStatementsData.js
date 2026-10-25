/**
 * Baseline data and KPI helpers for Statements & Monthly Ledger
 * Modeled after Stitch reference: 11._statements
 * Zero-baseline metrics cleanly computed from real database statements.
 */

export const MOCK_STATEMENTS = [];

export function computeStatementKPIs(statementsList = []) {
  const safeList = Array.isArray(statementsList) ? statementsList : [];
  const total = safeList.length;

  const totalBilled = safeList.reduce((acc, s) => acc + (Number(s.netBalance) || 0), 0);
  const dispatchedCount = safeList.filter(
    (s) => s.statusType === "dispatched" || s.status === "Dispatched"
  ).length;
  const pendingCount = safeList.filter(
    (s) => s.statusType === "pending" || s.status === "Pending Verification" || s.status === "Draft"
  ).length;

  const b2bCount = safeList.filter((s) => s.categoryTab === "b2b" || s.entityType?.includes("B2B")).length;
  const fleetCount = safeList.filter((s) => s.categoryTab === "fleet" || s.entityType?.includes("Fleet")).length;

  const dispatchPct = total > 0 ? Math.round((dispatchedCount / total) * 100) : 0;
  const billedPct = total > 0 ? 100 : 0;

  return {
    statementsGenerated: {
      label: "Statements Generated",
      value: String(total),
      trend: total > 0 ? `${total} this cycle` : "0 this cycle",
      subtext: `${b2bCount} Enterprise B2B · ${fleetCount} Fleet Owners`,
      progressPct: total > 0 ? 100 : 0,
    },
    consolidatedBilling: {
      label: "Consolidated Billing",
      value: `₹${totalBilled.toLocaleString("en-IN")}`,
      trend: total > 0 ? `${billedPct}% billed` : "0% billed",
      subtext: "Total freight billables across all routes",
      progressPct: billedPct,
    },
    pendingReconciliation: {
      label: "Pending Reconciliation",
      value: String(pendingCount),
      trend: pendingCount > 0 ? "Action Needed" : "Zero Pending",
      subtext: `${pendingCount} statements awaiting verification signoff`,
      progressPct: total > 0 ? Math.round((pendingCount / total) * 100) : 0,
    },
    automatedDispatch: {
      label: "Automated Dispatch",
      value: `${dispatchedCount} / ${total}`,
      trend: `${dispatchPct}% Sent`,
      subtext: "Email trigger live · WhatsApp API synced",
      progressPct: dispatchPct,
    },
  };
}

export function computeStatementTabCounts(statementsList = []) {
  const safeList = Array.isArray(statementsList) ? statementsList : [];
  const allCount = safeList.length;
  const b2bCount = safeList.filter((s) => s.categoryTab === "b2b" || s.entityType?.includes("B2B")).length;
  const fleetCount = safeList.filter((s) => s.categoryTab === "fleet" || s.entityType?.includes("Fleet")).length;
  const pendingCount = safeList.filter((s) => s.statusType === "pending" || s.status?.includes("Pending")).length;
  const disputedCount = safeList.filter((s) => s.status === "Disputed" || s.status?.includes("Dispute")).length;

  return {
    all: allCount,
    b2b: b2bCount,
    fleet: fleetCount,
    pending: pendingCount,
    disputed: disputedCount,
  };
}
