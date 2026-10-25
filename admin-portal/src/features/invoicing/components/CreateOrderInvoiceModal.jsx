import { useState, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * CreateOrderInvoiceModal - Dialog for generating compliant Rule 46 GST Tax Invoices for individual orders
 */
export default function CreateOrderInvoiceModal({
  isOpen,
  onClose,
  uninvoicedOrders = [],
  onGenerateOrderInvoice,
  isSyncing = false,
}) {
  const [selectedOrderId, setSelectedOrderId] = useState(
    uninvoicedOrders.length > 0 ? String(uninvoicedOrders[0].id) : ""
  );
  const [gstRate, setGstRate] = useState(18);
  const [isInterState, setIsInterState] = useState(false);
  const [isRcm, setIsRcm] = useState(false);
  const [placeOfSupply, setPlaceOfSupply] = useState("32-Kerala");
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  // Active selected order details
  const activeOrder = useMemo(() => {
    return uninvoicedOrders.find((o) => String(o.id) === String(selectedOrderId)) || uninvoicedOrders[0] || null;
  }, [uninvoicedOrders, selectedOrderId]);

  if (!isOpen) return null;

  const taxableAmount = activeOrder ? Number(activeOrder.trip_amount || 48000) : 48000;
  const rate = Number(gstRate);
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  
  if (isInterState) {
    igst = Math.round((taxableAmount * rate) / 100);
  } else {
    cgst = Math.round((taxableAmount * (rate / 2)) / 100);
    sgst = Math.round((taxableAmount * (rate / 2)) / 100);
  }
  const totalTax = cgst + sgst + igst;
  const grandTotal = taxableAmount + totalTax;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderId && (!activeOrder || !activeOrder.id)) return;
    const targetId = selectedOrderId || (activeOrder ? activeOrder.id : 1);
    onGenerateOrderInvoice({
      order_id: targetId,
      gst_rate: rate,
      is_inter_state: isInterState,
      is_rcm: isRcm,
      place_of_supply: placeOfSupply,
    });
  };

  const handleBatchGenerate = async () => {
    setIsBatchRunning(true);
    try {
      await onGenerateOrderInvoice({
        order_id: "all_uninvoiced",
        gst_rate: rate,
        is_inter_state: isInterState,
        is_rcm: isRcm,
        place_of_supply: placeOfSupply,
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
              <span style={{ fontSize: "1.25rem" }}>📄</span>
              <h3 className="inv-modal-title" style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                Generate Order GST Tax Invoice
              </h3>
            </div>
            <p className="inv-modal-sub" style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
              Issue statutory B2B Tax Invoice (Rule 46 CGST) under SAC 996511 (Goods Transport Agency).
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
          {/* Order Selection */}
          <div className="inv-form-group">
            <label className="inv-form-label" style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "6px", display: "block" }}>
              Select Un-invoiced Order:
            </label>
            {uninvoicedOrders.length > 0 ? (
              <select
                className="inv-form-select"
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.9rem",
                  backgroundColor: "#fff",
                }}
              >
                {uninvoicedOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    ORD-{String(o.id).padStart(4, "0")} — {o.company_name} ({o.pickup_location} → {o.drop_location}) [₹{Number(o.trip_amount).toLocaleString("en-IN")}]
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ padding: "0.75rem", backgroundColor: "#f1f5f9", borderRadius: "8px", fontSize: "0.85rem", color: "#475569" }}>
                All current orders have generated invoices! You can still re-generate by entering an Order ID below.
                <input
                  type="number"
                  placeholder="Order ID e.g. 1"
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  style={{ width: "100%", marginTop: "8px", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>
            )}
          </div>

          {/* Active Order Summary Card */}
          {activeOrder && (
            <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.85rem", fontSize: "0.85rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <span style={{ color: "#64748b" }}>Billed Partner:</span>{" "}
                  <strong>{activeOrder.company_name}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Route:</span>{" "}
                  <strong>{activeOrder.pickup_location} → {activeOrder.drop_location}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>Base Freight:</span>{" "}
                  <strong style={{ color: "#1e3a8a" }}>₹{Number(activeOrder.trip_amount).toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>SAC Code:</span>{" "}
                  <span style={{ padding: "2px 6px", background: "#e0e7ff", color: "#3730a3", borderRadius: "4px", fontWeight: 600 }}>996511</span>
                </div>
              </div>
            </div>
          )}

          {/* GST Configuration Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="inv-form-group">
              <label className="inv-form-label" style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "4px", display: "block" }}>
                GST Rate Schedule:
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
              >
                <option value={18}>18% Forward Charge (Standard with ITC)</option>
                <option value={5}>5% GTA Concession (Without ITC)</option>
              </select>
            </div>

            <div className="inv-form-group">
              <label className="inv-form-label" style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "4px", display: "block" }}>
                Supply Type:
              </label>
              <select
                value={isInterState ? "inter" : "intra"}
                onChange={(e) => setIsInterState(e.target.value === "inter")}
                style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
              >
                <option value="intra">Intra-State (CGST + SGST)</option>
                <option value="inter">Inter-State (IGST)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="inv-form-group">
              <label className="inv-form-label" style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "4px", display: "block" }}>
                Place of Supply:
              </label>
              <input
                type="text"
                value={placeOfSupply}
                onChange={(e) => setPlaceOfSupply(e.target.value)}
                style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
              />
            </div>

            <div className="inv-form-group" style={{ display: "flex", alignItems: "center", paddingTop: "1.2rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isRcm}
                  onChange={(e) => setIsRcm(e.target.checked)}
                />
                <span style={{ fontWeight: 600 }}>Reverse Charge (RCM Sec 9(3))</span>
              </label>
            </div>
          </div>

          {/* Live Calculation Box */}
          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.85rem" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#166534", marginBottom: "6px" }}>
              TAX COMPUTATION PREVIEW:
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "4px" }}>
              <span>Taxable Value (SAC 996511):</span>
              <strong>₹{taxableAmount.toLocaleString("en-IN")}.00</strong>
            </div>
            {!isInterState ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#475569" }}>
                  <span>CGST ({rate / 2}%):</span>
                  <span>+₹{cgst.toLocaleString("en-IN")}.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#475569" }}>
                  <span>SGST ({rate / 2}%):</span>
                  <span>+₹{sgst.toLocaleString("en-IN")}.00</span>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#475569" }}>
                <span>IGST ({rate}%):</span>
                <span>+₹{igst.toLocaleString("en-IN")}.00</span>
              </div>
            )}
            <div style={{ borderTop: "1px solid #86efac", marginTop: "6px", paddingTop: "6px", display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
              <span style={{ fontWeight: 700, color: "#14532d" }}>Invoice Grand Total:</span>
              <strong style={{ color: "#14532d", fontSize: "1.05rem" }}>₹{grandTotal.toLocaleString("en-IN")}.00</strong>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
            {uninvoicedOrders.length > 1 ? (
              <button
                type="button"
                onClick={handleBatchGenerate}
                disabled={isBatchRunning || isSyncing}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #1e3a8a",
                  color: "#1e3a8a",
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {isBatchRunning ? "Batch Generating..." : `⚡ Batch Generate All (${uninvoicedOrders.length})`}
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
                  backgroundColor: "#1e3a8a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {isSyncing ? "Generating Invoice..." : "Generate GST Invoice"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateOrderInvoiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  uninvoicedOrders: PropTypes.array,
  onGenerateOrderInvoice: PropTypes.func.isRequired,
  isSyncing: PropTypes.bool,
};
