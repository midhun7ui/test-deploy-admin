import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Reject / Cancel Order Modal
 * Provides standardized rejection reason codes and notes to partner
 */
export default function RejectOrderModal({ isOpen, order, onClose, onConfirmReject }) {
  const [reasonCode, setReasonCode] = useState("capacity");
  const [remarks, setRemarks] = useState("");

  if (!isOpen || !order) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onConfirmReject({
      orderId: order.id,
      reasonCode,
      remarks,
    });
  }

  return (
    <div className="order-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="order-modal-card"
        style={{ maxWidth: "520px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="order-modal-header">
          <div className="order-modal-header-left">
            <div className="order-modal-icon icon-danger">
              <span className="material-symbols-outlined">cancel</span>
            </div>
            <div>
              <h3 className="order-modal-title">Reject Transport Order</h3>
              <p className="order-modal-sub">
                Order #{order.id} • {order.company}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="order-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="order-modal-body">
            <div className="order-form-group">
              <label className="order-form-label" htmlFor="select-reject-reason">
                Rejection Reason Code <span className="req">*</span>
              </label>
              <select
                id="select-reject-reason"
                className="order-form-select"
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value)}
              >
                <option value="capacity">Fleet capacity unavailable in transit corridor</option>
                <option value="tariff">Commercial rate below corridor operating floor</option>
                <option value="specs">Cargo tonnage/dimension exceeds vehicle safety limits</option>
                <option value="client_request">Client requested order cancellation</option>
                <option value="corridor_closed">Corridor route impassable / weather restriction</option>
              </select>
            </div>

            <div className="order-form-group">
              <label className="order-form-label" htmlFor="textarea-reject-remarks">
                Explanation for Partner Log &amp; Audit Trail
              </label>
              <textarea
                id="textarea-reject-remarks"
                className="order-form-textarea"
                placeholder="Provide details for why this booking could not be dispatched..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <div className="order-modal-actions" style={{ padding: "1rem 1.5rem" }}>
            <button
              type="button"
              className="order-btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="order-btn-modal-danger"
              id="btn-confirm-reject-order"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                cancel
              </span>
              <span>Confirm Order Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

RejectOrderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  order: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onConfirmReject: PropTypes.func.isRequired,
};
