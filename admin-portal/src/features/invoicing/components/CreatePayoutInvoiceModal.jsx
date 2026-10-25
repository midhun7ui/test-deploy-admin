import { useState, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * CreatePayoutInvoiceModal - Dialog for generating Section 194C compliant Driver Payout Settlement Vouchers
 */
export default function CreatePayoutInvoiceModal({
  isOpen,
  onClose,
  uninvoicedTrips = [],
  onGeneratePayoutInvoice,
  isSyncing = false,
}) {
  const [selectedTripId, setSelectedTripId] = useState(
    uninvoicedTrips.length > 0 ? String(uninvoicedTrips[0].id) : ""
  );
  const [tdsRate, setTdsRate] = useState(1.0);
  const [utrNumber, setUtrNumber] = useState("");
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  // Active selected trip
  const activeTrip = useMemo(() => {
    return uninvoicedTrips.find((t) => String(t.id) === String(selectedTripId)) || uninvoicedTrips[0] || null;
  }, [uninvoicedTrips, selectedTripId]);

  if (!isOpen) return null;

  const grossFreight = activeTrip ? Number(activeTrip.trip_amount || 48000) : 48000;
  const sharePct = 70; // 70% standard driver share
  const grossEarnings = Math.round((grossFreight * sharePct) / 100);
  const rateTds = Number(tdsRate);
  const tdsAmount = Math.round((grossEarnings * rateTds) / 100);
  const netPayout = grossEarnings - tdsAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetId = selectedTripId || (activeTrip ? activeTrip.id : 1);
    onGeneratePayoutInvoice({
      trip_id: targetId,
      tds_rate: rateTds,
      utr_number: utrNumber.trim(),
    });
  };

  const handleBatchGenerate = async () => {
    setIsBatchRunning(true);
    try {
      await onGeneratePayoutInvoice({
        trip_id: "all_uninvoiced",
        tds_rate: rateTds,
        utr_number: "",
      });
    } finally {
      setIsBatchRunning(false);
    }
  };

  return (
    <div className="inv-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="inv-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "660px" }}
      >
        <div className="inv-modal-header" style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" }}>
          <div className="inv-modal-title-group">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "1.25rem" }}>💵</span>
              <h3 className="inv-modal-title" style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                Generate Driver Settlement Voucher
              </h3>
            </div>
            <p className="inv-modal-sub" style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
              Disburse driver trip earnings with statutory TDS withholding under Section 194C of Income Tax Act.
            </p>
          </div>
          <button
            type="button"
            className="inv-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            style={{ border: "none", background: "transparent", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="inv-modal-form" style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* Trip Selection */}
          <div className="inv-form-group">
            <label className="inv-form-label" style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "6px", display: "block" }}>
              Select Settled Trip / Driver:
            </label>
            {uninvoicedTrips.length > 0 ? (
              <select
                className="inv-form-select"
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.9rem",
                  backgroundColor: "#fff",
                }}
              >
                {uninvoicedTrips.map((t) => (
                  <option key={t.id} value={t.id}>
                    TRP-{String(t.id).padStart(4, "0")} ({t.driver_name}) — {t.route} [Gross: ₹{Number(t.trip_amount).toLocaleString("en-IN")}]
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ padding: "0.75rem", backgroundColor: "#f1f5f9", borderRadius: "8px", fontSize: "0.85rem", color: "#475569" }}>
                All current trips have generated vouchers! You can re-generate for a specific trip ID:
                <input
                  type="number"
                  placeholder="Trip ID e.g. 1"
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  style={{ width: "100%", marginTop: "8px", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>
            )}
          </div>

          {/* Active Trip & Driver Info Box */}
          {activeTrip && (
            <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.85rem", fontSize: "0.85rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <span style={{ color: "#64748b" }}>Driver Beneficiary:</span>{" "}
                  <strong>{activeTrip.driver_name}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Corridor / Route:</span>{" "}
                  <strong>{activeTrip.route}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Gross Freight:</span>{" "}
                  <strong style={{ color: "#065f46" }}>₹{Number(activeTrip.trip_amount).toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Driver Share %:</span>{" "}
                  <span style={{ padding: "2px 6px", background: "#dcfce7", color: "#166534", borderRadius: "4px", fontWeight: 600 }}>70.00%</span>
                </div>
              </div>
            </div>
          )}

          {/* TDS Compliance & UTR Inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="inv-form-group">
              <label className="inv-form-label" style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "4px", display: "block" }}>
                TDS Withholding Rate (Sec 194C):
              </label>
              <select
                value={tdsRate}
                onChange={(e) => setTdsRate(Number(e.target.value))}
                style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
              >
                <option value={1.0}>1.0% — Individual / HUF Driver Contractor</option>
                <option value={2.0}>2.0% — Corporate / Fleet Entity</option>
                <option value={0.0}>0.0% — Nil TDS (Valid Sec 194C(6) Declaration)</option>
              </select>
            </div>

            <div className="inv-form-group">
              <label className="inv-form-label" style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "4px", display: "block" }}>
                Bank UTR / Transaction Reference:
              </label>
              <input
                type="text"
                placeholder="Auto-generate if empty (e.g. UTR2026102401)"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
              />
            </div>
          </div>

          {/* Payout Computation Card */}
          <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.85rem" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e3a8a", marginBottom: "6px" }}>
              DISBURSEMENT SUMMARY:
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
              <span>Gross Driver Share (70%):</span>
              <strong>₹{grossEarnings.toLocaleString("en-IN")}.00</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#dc2626", marginBottom: "4px" }}>
              <span>Less: TDS u/s 194C ({rateTds}%):</span>
              <span>-₹{tdsAmount.toLocaleString("en-IN")}.00</span>
            </div>
            <div style={{ borderTop: "1px solid #cbd5e1", marginTop: "6px", paddingTop: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
              <span style={{ fontWeight: 700, color: "#065f46" }}>Net Disbursed Payout:</span>
              <strong style={{ color: "#059669", fontSize: "1.1rem" }}>₹{netPayout.toLocaleString("en-IN")}.00</strong>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
            {uninvoicedTrips.length > 1 ? (
              <button
                type="button"
                onClick={handleBatchGenerate}
                disabled={isBatchRunning || isSyncing}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #059669",
                  color: "#059669",
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {isBatchRunning ? "Batch Generating..." : `⚡ Batch Generate All (${uninvoicedTrips.length})`}
              </button>
            ) : <div />}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "0.6rem 1.2rem",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSyncing || isBatchRunning}
                style={{
                  padding: "0.6rem 1.4rem",
                  backgroundColor: "#059669",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {isSyncing ? "Generating..." : "Generate Payout Voucher"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

CreatePayoutInvoiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  uninvoicedTrips: PropTypes.array,
  onGeneratePayoutInvoice: PropTypes.func.isRequired,
  isSyncing: PropTypes.bool,
};
