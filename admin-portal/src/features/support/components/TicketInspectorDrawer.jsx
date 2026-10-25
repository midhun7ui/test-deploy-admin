import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { supportAdminApi } from "../services/supportAdminApi";

const QUICK_REPLIES = [
  "We are reviewing your request with our operations dispatch team.",
  "The statement discrepancy has been verified and adjusted in your ledger.",
  "Order tracking corridor updated; active driver assigned.",
  "Please provide the corresponding trip ID or invoice number for faster reconciliation.",
  "Your account settings and notification preferences have been restored.",
];

function TicketInspectorDrawer({
  ticketId,
  isOpen,
  onClose,
  onTicketUpdated,
  onOpenResolveModal,
}) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const conversationEndRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !ticketId) {
      setTicket(null);
      return;
    }

    let isMounted = true;

    async function loadDetails(silent = false) {
      try {
        if (!silent) setLoading(true);
        setError(null);
        const data = await supportAdminApi.getTicketDetails(ticketId);
        if (isMounted) {
          setTicket(data);
        }
      } catch (err) {
        if (isMounted && !silent) {
          setError(err?.response?.data?.detail || "Could not load support ticket details.");
        }
      } finally {
        if (isMounted && !silent) {
          setLoading(false);
        }
      }
    }

    loadDetails(false);

    // Live background polling while drawer is open
    pollingRef.current = setInterval(() => {
      if (!document.hidden) {
        loadDetails(true);
      }
    }, 6000);

    return () => {
      isMounted = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isOpen, ticketId]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  if (!isOpen) return null;

  // Handle send reply
  const handleSendReply = async (targetStatus = null) => {
    const text = replyMessage.trim();
    if (!text) return;

    try {
      setIsSendingReply(true);
      const updated = await supportAdminApi.sendReply(ticketId, text, targetStatus);
      setTicket(updated);
      setReplyMessage("");
      if (onTicketUpdated) onTicketUpdated(updated);
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to submit support reply.");
    } finally {
      setIsSendingReply(false);
    }
  };

  // Handle direct status change
  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await supportAdminApi.updateStatus(ticketId, newStatus);
      setTicket(updated);
      if (onTicketUpdated) onTicketUpdated(updated);
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to update ticket status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle priority change
  const handlePriorityChange = async (newPriority) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await supportAdminApi.updateTicket(ticketId, { priority: newPriority });
      setTicket(updated);
      if (onTicketUpdated) onTicketUpdated(updated);
    } catch (err) {
      alert(err?.response?.data?.detail || "Failed to update priority.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const isResolved = ticket?.status === "Resolved" || ticket?.status === "Closed";

  return (
    <div className="b2b-support-drawer-overlay" onClick={onClose}>
      <div className="b2b-support-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="b2b-support-drawer-header">
          <div className="drawer-header-left">
            <span className="drawer-tkt-id">{ticket?.id || ticketId}</span>
            {ticket && (
              <span className={`status-badge ${ticket.status.toLowerCase().replace(/\s+/g, "-")}`}>
                {isResolved && "✓ "}
                {ticket.status}
              </span>
            )}
            {ticket && (
              <span className={`priority-pill ${ticket.priority.toLowerCase()}`}>
                {ticket.priority}
              </span>
            )}
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            title="Close Drawer"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
            <div
              className="spinner"
              style={{
                margin: "0 auto 1rem auto",
                width: "28px",
                height: "28px",
                border: "3px solid #e2e8f0",
                borderTopColor: "#3b82f6",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              Loading ticket conversation and company dossier...
            </p>
          </div>
        ) : error || !ticket ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#ef4444" }}>
            <p>{error || "Ticket not found."}</p>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <div className="b2b-support-drawer-body">
            {/* Quick Status Control Ribbon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                background: "#f1f5f9",
                borderRadius: "8px",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>
                  Status:
                </span>
                <select
                  className="b2b-support-select"
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdatingStatus}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569" }}>
                  Priority:
                </span>
                <select
                  className="b2b-support-select"
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  disabled={isUpdatingStatus}
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {!isResolved && onOpenResolveModal && (
                <button
                  type="button"
                  className="btn-resolve-quick"
                  onClick={() => onOpenResolveModal(ticket)}
                  style={{ padding: "0.35rem 0.75rem", fontSize: "0.775rem" }}
                >
                  ✓ Mark Resolved
                </button>
              )}
            </div>

            {/* Partner Company Dossier */}
            <div className="drawer-dossier-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2563eb", textTransform: "uppercase" }}>
                  Partner Company Dossier
                </span>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Multi-tenant verified</span>
              </div>

              <div className="dossier-grid">
                <div className="dossier-item">
                  <span className="dossier-label">Company Name</span>
                  <span className="dossier-val">{ticket.company_name}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Company Code</span>
                  <span className="dossier-val">{ticket.company_code}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Contact Person</span>
                  <span className="dossier-val">{ticket.contact_person || ticket.created_by_name}</span>
                </div>
                <div className="dossier-item">
                  <span className="dossier-label">Email / Phone</span>
                  <span className="dossier-val">
                    {ticket.contact_email} {ticket.contact_phone ? `• ${ticket.contact_phone}` : ""}
                  </span>
                </div>
                {ticket.company_details && (
                  <>
                    <div className="dossier-item">
                      <span className="dossier-label">Corridor &amp; City</span>
                      <span className="dossier-val">
                        {ticket.company_details.corridor} ({ticket.company_details.city})
                      </span>
                    </div>
                    <div className="dossier-item">
                      <span className="dossier-label">Tier / GSTIN</span>
                      <span className="dossier-val">
                        {ticket.company_details.tier} • {ticket.company_details.gstin}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Original Problem Card */}
            <div className="drawer-subject-card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>
                  Category: {ticket.category}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  Logged {ticket.createdAt}
                </span>
              </div>
              <h3 className="drawer-subject-title">{ticket.subject}</h3>
              <p className="drawer-subject-desc">{ticket.description}</p>
            </div>

            {/* Conversation Stream */}
            <div className="drawer-conversation-stream">
              <div className="drawer-stream-header">
                <h4 className="drawer-stream-title">
                  Conversation Thread ({(ticket.messages || []).length} updates)
                </h4>
                <span style={{ fontSize: "0.725rem", color: "#059669", fontWeight: 600 }}>
                  ● Live Sync Active
                </span>
              </div>

              {(!ticket.messages || ticket.messages.length === 0) ? (
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", fontStyle: "italic" }}>
                  No messages recorded yet.
                </p>
              ) : (
                ticket.messages.map((msg) => {
                  const isSupport =
                    msg.sender_type === "HireD Support" ||
                    msg.sender === "HireD Support";

                  return (
                    <div
                      key={msg.id}
                      className={`msg-bubble ${isSupport ? "from-support" : "from-partner"}`}
                    >
                      <div className="msg-bubble-meta">
                        <span className="msg-sender-name">
                          {isSupport ? "🛡️ HireD Operations" : `👤 Partner (${ticket.company_name})`}
                        </span>
                        <span>{msg.createdAt}</span>
                      </div>
                      <p className="msg-text">{msg.message}</p>
                    </div>
                  );
                })
              )}
              <div ref={conversationEndRef} />
            </div>
          </div>
        )}

        {/* Footer Composer */}
        {ticket && (
          <div className="drawer-composer-card">
            {/* Quick response template chips */}
            <div className="drawer-quick-snippets">
              {QUICK_REPLIES.map((snippet, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="btn-snippet"
                  onClick={() => setReplyMessage(snippet)}
                >
                  + {snippet.slice(0, 32)}...
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              className="drawer-composer-textarea"
              placeholder="Type an official operational response to the partner company..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              disabled={isSendingReply}
            />

            {/* Actions */}
            <div className="drawer-composer-footer">
              <span style={{ fontSize: "0.725rem", color: "#64748b" }}>
                Replies are delivered immediately to the B2B portal.
              </span>

              <div className="drawer-composer-actions">
                <button
                  type="button"
                  className="btn-send-reply"
                  onClick={() => handleSendReply("In Progress")}
                  disabled={isSendingReply || !replyMessage.trim()}
                >
                  {isSendingReply ? "Sending..." : "Send Reply"}
                </button>

                {!isResolved && (
                  <button
                    type="button"
                    className="btn-resolve-and-close"
                    onClick={() => handleSendReply("Resolved")}
                    disabled={isSendingReply || !replyMessage.trim()}
                    title="Send message and mark ticket as Resolved"
                  >
                    Send &amp; Resolve ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

TicketInspectorDrawer.propTypes = {
  ticketId: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onTicketUpdated: PropTypes.func,
  onOpenResolveModal: PropTypes.func,
};

export default TicketInspectorDrawer;
