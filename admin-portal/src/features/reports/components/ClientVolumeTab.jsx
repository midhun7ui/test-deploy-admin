import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClientOrderVolume } from "../services/reportsApi";

export default function ClientVolumeTab() {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchClientOrderVolume();
        const results = Array.isArray(data?.results) ? data.results : [];
        setClientData(results);
      } catch (err) {
        console.error("Failed to load client order volume report:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalCompanies = clientData.length;
  const totalOrders = clientData.reduce((acc, curr) => acc + (curr.order_count || 0), 0);
  const totalCompleted = clientData.reduce((acc, curr) => acc + (curr.completed_trips || 0), 0);
  const totalVolume = clientData.reduce((acc, curr) => acc + (curr.total_volume || 0), 0);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clientData;
    const q = searchQuery.toLowerCase().trim();
    return clientData.filter((c) =>
      c.company_name?.toLowerCase().includes(q)
    );
  }, [clientData, searchQuery]);

  return (
    <div className="reports-clients-tab-container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 4 Client KPI Summary Cards */}
      <div className="reports-kpi-grid" style={{ marginBottom: "0" }}>
        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Active Enterprise Shippers</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-indigo">corporate_fare</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">{totalCompanies}</span>
            <span className="reports-kpi-badge badge-indigo">B2B Partners</span>
          </div>
          <p className="reports-kpi-subtext">Contracted corporate enterprise clients</p>
        </div>

        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Total Orders Placed</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-cyan">shopping_bag</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">{totalOrders}</span>
            <span className="reports-kpi-badge badge-cyan">Load Bookings</span>
          </div>
          <p className="reports-kpi-subtext">Across full-truckload (FTL) corridors</p>
        </div>

        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Completed Consignments</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-emerald">task_alt</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">{totalCompleted}</span>
            <span className="reports-kpi-badge badge-emerald">Delivered</span>
          </div>
          <p className="reports-kpi-subtext">Delivered on-time without discrepancies</p>
        </div>

        <div className="reports-kpi-card">
          <div className="reports-kpi-header">
            <span className="reports-kpi-title">Total Billed Volume</span>
            <span className="material-symbols-outlined reports-kpi-icon icon-purple">payments</span>
          </div>
          <div className="reports-kpi-value-row">
            <span className="reports-kpi-number">₹{Math.round(totalVolume).toLocaleString("en-IN")}</span>
            <span className="reports-kpi-badge badge-purple">Escrow Settled</span>
          </div>
          <p className="reports-kpi-subtext">Aggregate enterprise billing ledger</p>
        </div>
      </div>

      {/* Client Order Volume Register Table */}
      <div className="reports-corridors-card">
        <div className="reports-corridors-header">
          <div>
            <h2 className="reports-chart-title">Client Order Volume &amp; Fulfillment Breakdown</h2>
            <p className="reports-chart-subtitle">Aggregated consignment volume, completion velocity, and on-time SLA per enterprise client</p>
          </div>

          <div className="reports-corridors-search-box">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              className="reports-corridors-search-input"
              placeholder="Filter company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Enterprise Shipper Account</th>
                <th>Orders Placed</th>
                <th>Completed Trips</th>
                <th className="text-right">Freight Volume (₹)</th>
                <th>On-Time Delivery SLA</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--rep-text-muted)" }}>
                    Loading client order volume...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--rep-text-muted)" }}>
                    No client order volume data found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const rate = client.on_time_rate ?? 100;
                  return (
                    <tr key={client.company_id}>
                      <td>
                        <div className="reports-route-hub-pod">
                          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--rep-primary)" }}>
                            domain
                          </span>
                          <div>
                            <div className="reports-route-name">{client.company_name}</div>
                            <div className="reports-route-sub">Client #{client.company_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="reports-trips-count">{client.order_count} Orders</span>
                      </td>
                      <td>
                        <span className="reports-trips-count">{client.completed_trips}</span>
                      </td>
                      <td className="text-right">
                        <span className="reports-freight-val">₹{Math.round(client.total_volume).toLocaleString("en-IN")}</span>
                      </td>
                      <td>
                        <span className={`reports-sla-tag ${rate >= 95 ? "success" : "warning"}`}>{rate}% On-Time</span>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="reports-btn-secondary"
                          style={{ height: "30px", fontSize: "12px", padding: "0 10px" }}
                          onClick={() => navigate("/companies")}
                        >
                          View Account
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
