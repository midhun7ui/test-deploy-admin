import { useState } from "react";
import PropTypes from "prop-types";

const QUICK_RESOLUTIONS = [
  "Trip amount discrepancy verified and adjusted in final statement ledger.",
  "Order record located and synchronized with dispatch corridor.",
  "Platform vs driver commission split clarified in statement details.",
  "Vehicle documentation verified with RTO compliance desk.",
  "System access restored and notification preferences updated.",
];

function TicketResolutionModal({ ticket, isOpen, onClose, onConfirm, isSubmitting = false }) {
  const [resolutionNote, setResolutionNote] = useState("");
  const [resolutionStatus, setResolutionStatus] = useState("Resolved");

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      ticketId: ticket.id,
      status: resolutionStatus,
      resolutionNote: resolutionNote.trim(),
    });
  };

  const applyTemplate = (text) => {
    setResolutionNote(text);
  };

  return (
    <div className="b2b-modal-overlay" onClick={onClose}>
      <div className="b2b-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="b2b-modal-header">
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase" }}>
              Problem Resolution Console
            </span>
            <h2 className="b2b-modal-title">Resolve Ticket {ticket.id}</h2>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="b2b-modal-body">
            {/* Ticket & Partner summary */}
            <div style={{ background: "#f8fafc", padding: "0.85rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>{ticket.subject}</span>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{ticket.category}</span>
              </div>
              <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                Partner: <strong>{ticket.company_name}</strong> ({ticket.company_code})
              </span>
            </div>

            {/* Quick Resolution Templates */}
            <div>
              <label style={{ display: "block", fontSize: "0.775rem", fontWeight: 700, color: "#64748b", marginBottom: "0.4rem" }}>
                Quick Resolution Templates:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {QUICK_RESOLUTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn-snippet"
                    onClick={() => applyTemplate(item)}
                  >
                    + {item.slice(0, 38)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Explanation */}
            <div>
              <label htmlFor="resolution-note" style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
                Operational Resolution Note &amp; Explanation *
              </label>
              <textarea
                id="resolution-note"
                rows={4}
                className="drawer-composer-textarea"
                placeholder="Explain the solution, reconciliation, or action taken by operations desk so the partner has full visibility..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                required
              />
              <span style={{ fontSize: "0.725rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                This note will be posted directly to the partner support thread and will trigger an in-app confirmation notification.
              </span>
            </div>

            {/* Target Status */}
            <div>
              <label htmlFor="resolution-status" style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#64748b", marginBottom: "0.3rem" }}>
                Set Final Status:
              </label>
              <select
                id="resolution-status"
                className="b2b-support-select"
                value={resolutionStatus}
                onChange={(e) => setResolutionStatus(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="Resolved">Resolved (Problem fixed; partner can review)</option>
                <option value="Closed">Closed (Concluded and archived)</option>
              </select>
            </div>
          </div>

          <div className="b2b-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-resolve-and-close"
              disabled={isSubmitting || !resolutionNote.trim()}
            >
              {isSubmitting ? "Resolving..." : "Confirm & Send Resolution"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

TicketResolutionModal.propTypes = {
  ticket: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default TicketResolutionModal;
