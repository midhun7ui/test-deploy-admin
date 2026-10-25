import PropTypes from "prop-types";

export default function PaymentEscrowTab({ escrow, onChangeEscrow }) {
  return (
    <section className="settings-section-card">
      <div className="settings-section-header">
        <div className="settings-section-title-wrap">
          <div className="settings-section-title-row">
            <span className="material-symbols-outlined">payments</span>
            <h2 className="settings-section-title">
              Escrow, Disbursal & FASTag Automation
            </h2>
          </div>
          <p className="settings-section-desc">
            Control automatic wallet releases, FASTag highway tolling buffers, and enterprise escrow security rules.
          </p>
        </div>
        <span className="settings-tag-pill">IMPS / NEFT</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Toggle Row 1 */}
        <div className="settings-toggle-card">
          <div className="settings-toggle-card-info">
            <span className="settings-toggle-card-title">
              Auto-Disburse to Driver Wallet on e-POD Verification
            </span>
            <span className="settings-toggle-card-desc">
              Instantly clear remaining freight payout balance via ICICI Connected Banking when consignee digitally signs
            </span>
          </div>
          <label className="switch-container">
            <input
              type="checkbox"
              checked={escrow.autoDisburseOnEPod}
              onChange={(e) => onChangeEscrow("autoDisburseOnEPod", e.target.checked)}
              id="switch-auto-disburse-epod"
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Input Row Grid */}
        <div className="settings-form-grid">
          <div className="settings-form-group">
            <label className="settings-label" htmlFor="payout-cap">
              Single Admin Payout Cap
            </label>
            <input
              id="payout-cap"
              type="text"
              className="settings-input mono"
              value={escrow.singleAdminPayoutCap}
              onChange={(e) => onChangeEscrow("singleAdminPayoutCap", e.target.value)}
            />
            <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
              Disbursements &gt; ₹5L require dual-signatory consensus
            </span>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="wallet-floor">
              Driver Wallet Trip Floor
            </label>
            <input
              id="wallet-floor"
              type="text"
              className="settings-input mono"
              value={escrow.driverWalletTripFloor}
              onChange={(e) => onChangeEscrow("driverWalletTripFloor", e.target.value)}
            />
            <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
              Mandatory buffer for trip locking & transit reserves
            </span>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="fastag-trigger">
              FASTag Auto-Topup Trigger
            </label>
            <input
              id="fastag-trigger"
              type="text"
              className="settings-input mono"
              value={escrow.fastagAutoTopup}
              onChange={(e) => onChangeEscrow("fastagAutoTopup", e.target.value)}
            />
            <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
              Direct auto-debit trigger from HireD Escrow nodal pool
            </span>
          </div>

          <div className="settings-form-group">
            <label className="settings-label" htmlFor="escrow-bank">
              Escrow Nodal Bank
            </label>
            <input
              id="escrow-bank"
              type="text"
              className="settings-input"
              value={escrow.escrowBank}
              onChange={(e) => onChangeEscrow("escrowBank", e.target.value)}
            />
            <span style={{ fontSize: "11px", color: "var(--settings-text-muted)" }}>
              RBI-mandated dedicated tripartite escrow account
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

PaymentEscrowTab.propTypes = {
  escrow: PropTypes.shape({
    autoDisburseOnEPod: PropTypes.bool.isRequired,
    singleAdminPayoutCap: PropTypes.string.isRequired,
    driverWalletTripFloor: PropTypes.string.isRequired,
    fastagAutoTopup: PropTypes.string.isRequired,
    escrowBank: PropTypes.string.isRequired,
    cmsPartner: PropTypes.string.isRequired,
  }).isRequired,
  onChangeEscrow: PropTypes.func.isRequired,
};
