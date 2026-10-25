import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchOrdersReport } from "../services/reportsApi";

export default function RevenueBillingTab({ grossBilling = 0 }) {
  const [ordersReport, setOrdersReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchOrdersReport();
        setOrdersReport(data);
      } catch (err) {
        console.error("Failed to load revenue orders report:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const total = ordersReport?.total_orders || 0;
  const accepted = ordersReport?.accepted_orders || 0;
  const received = ordersReport?.received_orders || 0;
  const rejected = ordersReport?.rejected_orders || 0;

  const acceptedPct = total > 0 ? Math.round((accepted / total) * 100) : 0;
  const receivedPct = total > 0 ? Math.round((received / total) * 100) : 0;
  const rejectedPct = total > 0 ? Math.round((rejected / total) * 100) : 0;

  const effectiveGross = ordersReport?.gross_billing !== undefined && ordersReport?.gross_billing > 0
    ? ordersReport.gross_billing
    : grossBilling;
  const commissionCut = ordersReport?.commission_cut !== undefined && ordersReport?.commission_cut > 0
    ? Math.round(ordersReport.commission_cut)
    : Math.round(effectiveGross * 0.15);
  const driverPayouts = ordersReport?.driver_payouts !== undefined && ordersReport?.driver_payouts > 0
    ? Math.round(ordersReport.driver_payouts)
    : Math.round(effectiveGross * 0.85);

  const statusRows = [
    {
      status: "Accepted & Dispatched",
      count: accepted,
      pct: `${acceptedPct}%`,
      badge: "Active Billing",
      badgeClass: "success",
      billingState: "Invoiced / In Escrow",
    },
    {
      status: "Received & In Review",
      count: received,
      pct: `${receivedPct}%`,
      badge: "Quote Pending",
      badgeClass: "warning",
      billingState: "Unbilled Pipeline",
    },
    {
      status: "Rejected / Cancelled",
      count: rejected,
      pct: `${rejectedPct}%`,
      badge: "Zero Billing",
      badgeClass: "danger",
      billingState: "Void / Cancelled",
    },
  ];

  return (
    <div className="reports-revenue-tab-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 4 Mini Cards for Revenue Breakdown */}
      <div className="reports-kpi-grid" style={{ marginBottom: "0" }}>
        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Gross Freight Revenue</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-emerald">payments</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">₹{effectiveGross.toLocaleString("en-IN")}</span>
            <span className="reports-kpi-badge badge-emerald">Live Verified</span>
          </div>
          <p className="reports-kpi-subtext">Total billed revenue across completed trips</p>
        </div>

        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Platform Take Rate (15%)</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-indigo">percent</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">₹{commissionCut.toLocaleString("en-IN")}</span>
            <span className="reports-kpi-badge badge-indigo">15.0% Margin</span>
          </div>
          <p className="reports-kpi-subtext">Net platform operations commission</p>
        </div>

        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Driver Disbursals (85%)</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-cyan">account_balance_wallet</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">₹{driverPayouts.toLocaleString("en-IN")}</span>
            <span className="reports-kpi-badge badge-cyan">85.0% Carrier Share</span>
          </div>
          <p className="reports-kpi-subtext">Escrow settlements transferred to drivers</p>
        </div>

        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Total Orders Processed</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-purple">receipt_long</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">{total} Orders</span>
            <span className="reports-kpi-badge badge-purple">{accepted} Accepted</span>
          </div>
          <p className="reports-kpi-subtext">Lifecycle billing & quotation conversions</p>
        </div>
      </div>

      {/* Revenue & Billing Pipeline Table */}
      <div className="reports-corridors-card">
        <div className="reports-corridors-header">
          <div>
            <h2 className="reports-chart-title">Revenue &amp; Billing Reconciliation by Order Stage</h2>
            <p className="reports-chart-subtitle">Itemized freight pipeline conversion and billing lifecycle status</p>
          </div>
          <span className="reports-category-badge">Real-time Stream</span>
        </div>

        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Order Lifecycle Stage</th>
                <th>Order Count</th>
                <th>Volume Share (%)</th>
                <th>Status Classification</th>
                <th className="text-right">Billing Settlement State</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "32px", color: "var(--rep-text-muted)" }}>
                    Loading live billing records...
                  </td>
                </tr>
              ) : (
                statusRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="reports-route-hub-pod">
                        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--rep-primary)" }}>
                          task_alt
                        </span>
                        <span className="reports-route-name">{row.status}</span>
                      </div>
                    </td>
                    <td>
                      <span className="reports-trips-count">{row.count}</span>
                    </td>
                    <td>
                      <span className="reports-trips-count">{row.pct}</span>
                    </td>
                    <td>
                      <span className={`reports-sla-tag ${row.badgeClass}`}>{row.badge}</span>
                    </td>
                    <td className="text-right">
                      <span className="reports-freight-val">{row.billingState}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

RevenueBillingTab.propTypes = {
  grossBilling: PropTypes.number,
};
