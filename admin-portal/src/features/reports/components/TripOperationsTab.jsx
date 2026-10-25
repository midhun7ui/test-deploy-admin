import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchTripsReport } from "../services/reportsApi";

export default function TripOperationsTab({ corridors = [] }) {
  const [tripsData, setTripsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchTripsReport();
        const results = Array.isArray(data?.results) ? data.results : [];
        setTripsData(results);
      } catch (err) {
        console.error("Failed to load trips report:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalTrips = tripsData.reduce((acc, curr) => acc + (curr.total_trips || 0), 0);
  const completedTrips = tripsData.reduce((acc, curr) => acc + (curr.completed_trips || 0), 0);
  const ongoingTrips = tripsData.reduce((acc, curr) => acc + (curr.ongoing_trips || 0), 0);
  const totalValue = tripsData.reduce((acc, curr) => acc + (curr.total_value || 0), 0);
  const onTimeRate = totalTrips > 0 ? `${Math.round((completedTrips / totalTrips) * 100)}%` : "100%";

  return (
    <div className="reports-trips-tab-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 4 Operations KPI Cards */}
      <div className="reports-kpi-grid" style={{ marginBottom: "0" }}>
        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Total Consignments</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-indigo">local_shipping</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">{totalTrips}</span>
            <span className="reports-kpi-badge badge-indigo">Fleet Dispatches</span>
          </div>
          <p className="reports-kpi-subtext">Across inter-state highway transit corridors</p>
        </div>

        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Completed &amp; ePOD Verified</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-emerald">task_alt</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">{completedTrips}</span>
            <span className="reports-kpi-badge badge-emerald">{onTimeRate} Delivery SLA</span>
          </div>
          <p className="reports-kpi-subtext">Verified against electronic proof of delivery</p>
        </div>

        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Ongoing / In-Transit</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-cyan">near_me</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">{ongoingTrips}</span>
            <span className="reports-kpi-badge badge-cyan">Active In-Transit</span>
          </div>
          <p className="reports-kpi-subtext">Actively monitored on regional routes</p>
        </div>

        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Delivered Freight Value</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-purple">currency_rupee</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">₹{Math.round(totalValue).toLocaleString("en-IN")}</span>
            <span className="reports-kpi-badge badge-purple">Settled Trips</span>
          </div>
          <p className="reports-kpi-subtext">Closed trip gross settlement ledger</p>
        </div>
      </div>

      {/* Monthly Trip Operations Summary */}
      <div className="reports-corridors-card">
        <div className="reports-corridors-header">
          <div>
            <h2 className="reports-chart-title">Monthly Trip Operations Performance</h2>
            <p className="reports-chart-subtitle">Aggregated consignment counts, closed volumes, and fulfillment rates</p>
          </div>
          <span className="reports-category-badge">Operational Records</span>
        </div>

        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Billing Period</th>
                <th>Total Dispatched</th>
                <th>Completed (ePOD)</th>
                <th>Ongoing Live</th>
                <th>Total Value (₹)</th>
                <th className="text-right">Fulfillment Rate</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--rep-text-muted)" }}>
                    Loading monthly trip operations...
                  </td>
                </tr>
              ) : tripsData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--rep-text-muted)" }}>
                    No trip operations recorded for this period.
                  </td>
                </tr>
              ) : (
                tripsData.map((row, idx) => {
                  const rate = row.total_trips > 0 ? Math.round((row.completed_trips / row.total_trips) * 100) : 100;
                  return (
                    <tr key={idx}>
                      <td>
                        <div className="reports-route-hub-pod">
                          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--rep-primary)" }}>
                            date_range
                          </span>
                          <span className="reports-route-name">{row.period}</span>
                        </div>
                      </td>
                      <td>
                        <span className="reports-trips-count">{row.total_trips} Trips</span>
                      </td>
                      <td>
                        <span className="reports-trips-count">{row.completed_trips}</span>
                      </td>
                      <td>
                        <span className="reports-trips-count">{row.ongoing_trips}</span>
                      </td>
                      <td>
                        <span className="reports-freight-val">₹{Math.round(row.total_value).toLocaleString("en-IN")}</span>
                      </td>
                      <td className="text-right">
                        <span className={`reports-sla-tag ${rate >= 90 ? "success" : "warning"}`}>{rate}% Rate</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Corridor Level Operations Breakdown */}
      {corridors.length > 0 && (
        <div className="reports-corridors-card">
          <div className="reports-corridors-header">
            <div>
              <h2 className="reports-chart-title">Corridor Transit Adherence &amp; Route Velocity</h2>
              <p className="reports-chart-subtitle">Highway corridor performance benchmarks and fulfillment</p>
            </div>
          </div>

          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Route Corridor</th>
                  <th>Trip Volume</th>
                  <th className="text-right">Freight Value</th>
                  <th>Avg Duration</th>
                  <th className="text-right">SLA Score</th>
                </tr>
              </thead>
              <tbody>
                {corridors.map((c) => {
                  const trips = c.trips ?? c.tripsVolume ?? 0;
                  const freightVal = c.freightValue || c.revenueContribution || "₹0.00";
                  const avgDuration = c.avgDuration || c.avgTransitFormatted || "2.5h";
                  const rawScore = typeof c.slaScore === 'number' ? c.slaScore : (parseFloat(c.slaScore) || 100);
                  const displayScore = typeof c.slaScore === 'string' && c.slaScore.includes('%') ? c.slaScore : `${c.slaScore || 100}%`;

                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="reports-route-hub-pod">
                          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--rep-primary)" }}>
                            alt_route
                          </span>
                          <div>
                            <div className="reports-route-name">{c.name || `${c.origin} ➔ ${c.destination}`}</div>
                            <div className="reports-route-sub">{c.corridorCode}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="reports-trips-count">{trips} Trips</span>
                      </td>
                      <td className="text-right">
                        <span className="reports-freight-val">{freightVal}</span>
                      </td>
                      <td>
                        <span className="reports-trips-count">{avgDuration}</span>
                      </td>
                      <td className="text-right">
                        <span className={`reports-sla-tag ${rawScore >= 95 ? "success" : "warning"}`}>{displayScore}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

TripOperationsTab.propTypes = {
  corridors: PropTypes.array,
};
