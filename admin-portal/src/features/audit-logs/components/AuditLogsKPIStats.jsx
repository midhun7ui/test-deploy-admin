import PropTypes from "prop-types";

export default function AuditLogsKPIStats({ kpis }) {
  return (
    <div className="audit-logs-kpi-grid" id="audit-logs-kpi-bento">
      {/* Card 1: Total Events Logged */}
      <div className="audit-kpi-card" id="kpi-total-events">
        <div>
          <div className="audit-kpi-top-row">
            <p className="audit-kpi-label">Total Events Logged</p>
            <div className="audit-kpi-icon-box primary">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>receipt_long</span>
            </div>
          </div>
          <div className="audit-kpi-metrics-row">
            <span className="audit-kpi-value">{kpis.totalEvents.value}</span>
            <span className="audit-kpi-pill success">
              <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>arrow_upward</span>
              {kpis.totalEvents.label}
            </span>
          </div>
          <p className="audit-kpi-bottom-meta">{kpis.totalEvents.subtitle}</p>
        </div>
        <div className="audit-kpi-progress-bar">
          <div
            className="audit-kpi-progress-fill primary"
            style={{ width: `${kpis.totalEvents.capacity}%` }}
          />
        </div>
      </div>

      {/* Card 2: Privileged RBAC Shifts */}
      <div className="audit-kpi-card" id="kpi-privileged-shifts">
        <div>
          <div className="audit-kpi-top-row">
            <p className="audit-kpi-label">Privileged RBAC Shifts</p>
            <div className="audit-kpi-icon-box error">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>admin_panel_settings</span>
            </div>
          </div>
          <div className="audit-kpi-metrics-row">
            <span className="audit-kpi-value">{kpis.privilegedShifts.value}</span>
            <span className="audit-kpi-pill error">
              {kpis.privilegedShifts.label}
            </span>
          </div>
          <p className="audit-kpi-bottom-meta">{kpis.privilegedShifts.subtitle}</p>
        </div>
        <div className="audit-kpi-progress-bar">
          <div
            className="audit-kpi-progress-fill error"
            style={{ width: `${kpis.privilegedShifts.capacity}%` }}
          />
        </div>
      </div>

      {/* Card 3: Financial Mutations */}
      <div className="audit-kpi-card" id="kpi-financial-mutations">
        <div>
          <div className="audit-kpi-top-row">
            <p className="audit-kpi-label">Financial Mutations</p>
            <div className="audit-kpi-icon-box primary">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>currency_rupee</span>
            </div>
          </div>
          <div className="audit-kpi-metrics-row">
            <span className="audit-kpi-value">{kpis.financialMutations.value}</span>
            <span className="audit-kpi-pill primary">
              {kpis.financialMutations.label}
            </span>
          </div>
          <p className="audit-kpi-bottom-meta">{kpis.financialMutations.subtitle}</p>
        </div>
        <div className="audit-kpi-progress-bar">
          <div
            className="audit-kpi-progress-fill secondary"
            style={{ width: `${kpis.financialMutations.capacity}%` }}
          />
        </div>
      </div>

      {/* Card 4: Chain Integrity */}
      <div className="audit-kpi-card" id="kpi-chain-integrity">
        <div>
          <div className="audit-kpi-top-row">
            <p className="audit-kpi-label">Chain Integrity</p>
            <div className="audit-kpi-icon-box secondary">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>shield</span>
            </div>
          </div>
          <div className="audit-kpi-metrics-row">
            <span className="audit-kpi-value">{kpis.chainIntegrity.value}</span>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--audit-primary)" }} title="Zero hash mismatches">
              check_circle
            </span>
          </div>
          <p className="audit-kpi-bottom-meta">{kpis.chainIntegrity.subtitle}</p>
        </div>
        <div className="audit-kpi-progress-bar">
          <div
            className="audit-kpi-progress-fill primary"
            style={{ width: `${kpis.chainIntegrity.capacity}%` }}
          />
        </div>
      </div>
    </div>
  );
}

AuditLogsKPIStats.propTypes = {
  kpis: PropTypes.shape({
    totalEvents: PropTypes.object.isRequired,
    privilegedShifts: PropTypes.object.isRequired,
    financialMutations: PropTypes.object.isRequired,
    chainIntegrity: PropTypes.object.isRequired,
  }).isRequired,
};
