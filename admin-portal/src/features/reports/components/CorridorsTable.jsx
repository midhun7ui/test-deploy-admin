import { useState, useMemo } from "react";
import PropTypes from "prop-types";

export default function CorridorsTable({ corridors }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCorridors = useMemo(() => {
    if (!searchTerm.trim()) return corridors;
    const q = searchTerm.toLowerCase();
    return corridors.filter(
      (c) =>
        (c.origin && c.origin.toLowerCase().includes(q)) ||
        (c.destination && c.destination.toLowerCase().includes(q)) ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q))
    );
  }, [corridors, searchTerm]);

  return (
    <div className="reports-corridors-card">
      <div className="reports-corridors-header">
        <div>
          <h2 className="reports-chart-title">
            Top Performing Corridors &amp; SLA Adherence
          </h2>
          <p className="reports-chart-subtitle">
            Live corridor transit velocity, trip frequency, and SLA tolerance
            scores
          </p>
        </div>

        <div className="reports-corridors-search-box">
          <span className="material-symbols-outlined">filter_list</span>
          <input
            type="text"
            className="reports-corridors-search-input"
            placeholder="Search route hub..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Corridor &amp; Route Hub</th>
              <th>Trip Volume</th>
              <th className="text-right">Freight Value</th>
              <th>Avg Transit Duration</th>
              <th>On-Time SLA</th>
            </tr>
          </thead>
          <tbody>
            {filteredCorridors.map((row) => {
              const origin = row.origin || row.name?.split("➔")[0]?.trim() || "Origin";
              const destination = row.destination || row.name?.split("➔")[1]?.trim() || "Destination";
              const trips = row.trips ?? row.tripsVolume ?? 0;
              const freightVal = row.freightValue || row.revenueContribution || "₹0.00";
              const avgTransit = row.avgTransit || row.avgTransitFormatted || "2.5h";
              const targetTransit = row.targetTransit || "3.0h";
              const slaScore = row.slaScore || `${row.onTimeRate || 100}%`;
              const slaStatus = row.slaStatus || "Optimal";
              const volumePct = row.volumePct || 50;

              return (
                <tr key={row.id}>
                  {/* Corridor & Route Hub */}
                  <td>
                    <div className="reports-route-hub-pod">
                      <span className="material-symbols-outlined">fmd_good</span>
                      <span>{origin}</span>
                      <span className="arrow">➔</span>
                      <span>{destination}</span>
                    </div>
                  </td>

                  {/* Trip Volume */}
                  <td>
                    <div className="reports-volume-pod">
                      <span className="reports-volume-count">
                        {trips} Trips
                      </span>
                      <div className="reports-volume-track">
                        <div
                          className="reports-volume-fill"
                          style={{ width: `${volumePct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Freight Value */}
                  <td className="text-right">
                    <span className="reports-freight-value">
                      {freightVal}
                    </span>
                  </td>

                  {/* Avg Transit Duration */}
                  <td>
                    <div className="reports-duration-pod">
                      <span
                        className={`actual ${
                          row.isTransitAlert ? "alert" : ""
                        }`}
                      >
                        {avgTransit}
                      </span>
                      <span className="target">(Target {targetTransit})</span>
                    </div>
                  </td>

                  {/* On-Time SLA */}
                  <td>
                    <span
                      className={`reports-sla-pill ${
                        row.isSlaAlert ? "alert" : ""
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        {row.isSlaAlert ? "warning" : "check_circle"}
                      </span>
                      <span>
                        {slaScore} {slaStatus}
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredCorridors.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "24px", color: "var(--rep-outline)" }}>
                  No corridors matching &ldquo;{searchTerm}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

CorridorsTable.propTypes = {
  corridors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      origin: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      trips: PropTypes.number.isRequired,
      volumePct: PropTypes.number.isRequired,
      freightValue: PropTypes.string.isRequired,
      avgTransit: PropTypes.string.isRequired,
      targetTransit: PropTypes.string.isRequired,
      isTransitAlert: PropTypes.bool.isRequired,
      slaScore: PropTypes.string.isRequired,
      slaStatus: PropTypes.string.isRequired,
      isSlaAlert: PropTypes.bool.isRequired,
    })
  ).isRequired,
};
