import PropTypes from "prop-types";

function SupportTicketsTable({
  tickets,
  loading = false,
  onInspect,
  onResolve,
  onQuickStatusChange,
}) {
  if (loading && tickets.length === 0) {
    return (
      <div className="b2b-support-table-card" style={{ padding: "4rem", textAlign: "center" }}>
        <div
          className="spinner"
          style={{
            margin: "0 auto 1rem auto",
            width: "32px",
            height: "32px",
            border: "3px solid #e2e8f0",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>
          Synchronizing partner tickets with database...
        </p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="b2b-support-table-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "0.75rem" }}
        >
          inbox
        </span>
        <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.15rem", fontWeight: 700 }}>
          No support tickets found
        </h3>
        <p style={{ color: "#64748b", fontSize: "0.875rem", maxWidth: "420px", margin: "0 auto" }}>
          There are currently no tickets matching your active filter criteria or no issues have been raised by partner companies.
        </p>
      </div>
    );
  }

  return (
    <div className="b2b-support-table-card">
      <div className="b2b-support-table-wrapper">
        <table className="b2b-support-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Partner Company</th>
              <th>Subject &amp; Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Conversation</th>
              <th>Submitted / Updated</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => {
              const isResolved = ticket.status === "Resolved" || ticket.status === "Closed";
              const isUrgent =
                ticket.priority === "Urgent" && (ticket.status === "Open" || ticket.status === "In Progress");

              return (
                <tr key={ticket.id} className={isUrgent ? "row-urgent" : ""}>
                  {/* Ticket ID */}
                  <td>
                    <button
                      type="button"
                      className="tkt-id-badge"
                      onClick={() => onInspect(ticket)}
                      title="Inspect ticket details and conversation"
                    >
                      {ticket.id}
                    </button>
                  </td>

                  {/* Partner Company */}
                  <td>
                    <div className="company-cell">
                      <span className="company-name">{ticket.company_name || "Enterprise Partner"}</span>
                      <span className="company-sub">
                        <span>{ticket.company_code || "CMP-2026"}</span>
                        {ticket.contact_person && <span>• {ticket.contact_person}</span>}
                      </span>
                    </div>
                  </td>

                  {/* Subject & Category */}
                  <td>
                    <div className="subject-cell">
                      <span className="subject-title">{ticket.subject}</span>
                      <span className="subject-category">
                        <span className="material-symbols-outlined" style={{ fontSize: "0.85rem" }}>
                          label
                        </span>
                        <span>{ticket.category}</span>
                      </span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td>
                    <span className={`priority-pill ${ticket.priority.toLowerCase()}`}>
                      {ticket.priority === "Urgent" && "⚡ "}
                      {ticket.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`status-badge ${ticket.status.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {isResolved && "✓ "}
                      {ticket.status}
                    </span>
                  </td>

                  {/* Conversation info */}
                  <td>
                    <div className="conversation-preview">
                      <span className="conversation-count">
                        {ticket.messages_count || 1} {ticket.messages_count === 1 ? "msg" : "msgs"}
                      </span>
                      {ticket.last_message ? (
                        <span className="conversation-snippet" title={ticket.last_message.message}>
                          <strong>{ticket.last_message.sender_type}:</strong> {ticket.last_message.message}
                        </span>
                      ) : (
                        <span className="conversation-snippet" title={ticket.description}>
                          {ticket.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Timestamps */}
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "0.775rem", color: "#64748b" }}>
                      <span>{ticket.createdAt}</span>
                      {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Upd: {ticket.updatedAt}</span>
                      )}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td style={{ textAlign: "right" }}>
                    <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                      {!isResolved && (
                        <button
                          type="button"
                          className="btn-resolve-quick"
                          onClick={() => onResolve(ticket)}
                          title="Quick resolve this problem"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-inspect"
                        onClick={() => onInspect(ticket)}
                      >
                        Inspect &amp; Reply →
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

SupportTicketsTable.propTypes = {
  tickets: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  onInspect: PropTypes.func.isRequired,
  onResolve: PropTypes.func.isRequired,
  onQuickStatusChange: PropTypes.func,
};

export default SupportTicketsTable;
