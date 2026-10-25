import { useState } from "react";
import PropTypes from "prop-types";

export default function SecurityPoliciesWidget({ policies, onUpdatePolicies }) {
  const [localPolicies, setLocalPolicies] = useState(policies);

  const handleToggleZeroTrust = () => {
    const updated = { ...localPolicies, zeroTrustEnforced: !localPolicies.zeroTrustEnforced };
    setLocalPolicies(updated);
    onUpdatePolicies?.(updated);
  };

  const handleTimeoutChange = (val) => {
    const updated = { ...localPolicies, sessionTimeoutMinutes: parseInt(val, 10) };
    setLocalPolicies(updated);
    onUpdatePolicies?.(updated);
  };

  const handleDualAdminChange = (val) => {
    const updated = { ...localPolicies, dualAdminThreshold: val };
    setLocalPolicies(updated);
    onUpdatePolicies?.(updated);
  };

  return (
    <div className="admin-policies-grid" id="security-policies-widget">
      {/* Policy Card 1: Authentication & MFA */}
      <div className="admin-policy-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 className="admin-policy-title">Zero-Trust &amp; MFA Enforcement</h3>
            <p className="admin-policy-desc">Multi-factor security protocols and hardware key mandates.</p>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "var(--admin-primary-container)" }}>
            security
          </span>
        </div>

        <div className="admin-policy-item">
          <div>
            <strong style={{ fontSize: "12.5px", color: "var(--admin-text)" }}>Zero-Trust Architecture Mode</strong>
            <p className="admin-policy-desc">Strict perimeter check on every API call and state transition.</p>
          </div>
          <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={localPolicies.zeroTrustEnforced}
              onChange={handleToggleZeroTrust}
              style={{ width: "18px", height: "18px", accentColor: "var(--admin-primary-container)" }}
            />
          </label>
        </div>

        <div className="admin-policy-item">
          <div>
            <strong style={{ fontSize: "12.5px", color: "var(--admin-text)" }}>MFA Policy Requirement</strong>
            <p className="admin-policy-desc">Allowed verification factors for operational and financial staff.</p>
          </div>
          <span className="admin-kpi-pill success">FIDO2 + TOTP</span>
        </div>

        <div className="admin-policy-item">
          <div>
            <strong style={{ fontSize: "12.5px", color: "var(--admin-text)" }}>New Staff Grace Period</strong>
            <p className="admin-policy-desc">Time allowed for MFA enrollment before automated account freeze.</p>
          </div>
          <span className="admin-kpi-pill warning">24 Hours</span>
        </div>
      </div>

      {/* Policy Card 2: Session & Consensus Governance */}
      <div className="admin-policy-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 className="admin-policy-title">Session &amp; Consensus Governance</h3>
            <p className="admin-policy-desc">Dual-authorization guardrails and automated idle session locks.</p>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "var(--admin-primary-container)" }}>
            policy
          </span>
        </div>

        <div className="admin-policy-item">
          <div>
            <strong style={{ fontSize: "12.5px", color: "var(--admin-text)" }}>Session Idle Timeout</strong>
            <p className="admin-policy-desc">Terminates browser session after inactivity.</p>
          </div>
          <select
            className="admin-form-select"
            style={{ width: "130px", height: "32px", fontSize: "12px" }}
            value={localPolicies.sessionTimeoutMinutes}
            onChange={(e) => handleTimeoutChange(e.target.value)}
          >
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">60 Minutes</option>
            <option value="120">2 Hours</option>
          </select>
        </div>

        <div className="admin-policy-item">
          <div>
            <strong style={{ fontSize: "12.5px", color: "var(--admin-text)" }}>Dual-Admin Consensus Floor</strong>
            <p className="admin-policy-desc">Financial disbursements exceeding limit require 2 approvals.</p>
          </div>
          <select
            className="admin-form-select"
            style={{ width: "130px", height: "32px", fontSize: "12px" }}
            value={localPolicies.dualAdminThreshold}
            onChange={(e) => handleDualAdminChange(e.target.value)}
          >
            <option value="₹5,00,000">₹5,00,000</option>
            <option value="₹10,00,000">₹10,00,000</option>
            <option value="₹25,00,000">₹25,00,000</option>
            <option value="₹50,00,000">₹50,00,000</option>
          </select>
        </div>

        <div className="admin-policy-item">
          <div>
            <strong style={{ fontSize: "12.5px", color: "var(--admin-text)" }}>Failed Login Lockout</strong>
            <p className="admin-policy-desc">Account temporarily locked after consecutive password failures.</p>
          </div>
          <span className="admin-kpi-pill secondary">5 Attempts</span>
        </div>
      </div>

      {/* Policy Card 3 & 4 (Full Width): Corporate IP CIDR Boundaries */}
      <div className="admin-policy-card" style={{ gridColumn: "span 2" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 className="admin-policy-title">Corporate VPN &amp; Hub IP CIDR Boundaries</h3>
            <p className="admin-policy-desc">
              Restricts administrative console logins to verified corporate subnets and branch headquarters.
            </p>
          </div>
          <button type="button" className="admin-btn-secondary" style={{ height: "32px", fontSize: "11.5px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
            <span>Add CIDR Subnet</span>
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-matrix-table">
            <thead>
              <tr>
                <th>Subnet Label</th>
                <th>CIDR Boundary</th>
                <th>Physical Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {localPolicies.ipBoundaries.map((b, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{b.label}</td>
                  <td>
                    <code style={{ background: "var(--admin-surface-low)", padding: "2px 6px", borderRadius: "4px" }}>
                      {b.subnet}
                    </code>
                  </td>
                  <td>{b.location}</td>
                  <td>
                    <span className="admin-kpi-pill success">Strict Allowed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

SecurityPoliciesWidget.propTypes = {
  policies: PropTypes.object.isRequired,
  onUpdatePolicies: PropTypes.func.isRequired,
};
