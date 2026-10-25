import PropTypes from "prop-types";

export default function AuditLogEventStream({
  events,
  selectedEventId,
  onSelectEvent,
  currentPage,
  totalPages,
  onPageChange,
  totalEventsCount = "1,42,890",
}) {
  return (
    <div className="audit-stream-pane" id="audit-log-event-stream">
      {/* Event Cards List */}
      {events.length === 0 ? (
        <div className="audit-event-card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "var(--audit-outline)" }}>
            find_in_page
          </span>
          <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "var(--audit-text-muted)" }}>
            No audit log telemetry events match the current filter criteria.
          </p>
        </div>
      ) : (
        events.map((evt) => {
          const isSelected = selectedEventId === evt.id;
          return (
            <div
              key={evt.id}
              className={`audit-event-card ${isSelected ? "selected-event" : ""}`}
              onClick={() => onSelectEvent(evt)}
              id={`audit-event-card-${evt.id}`}
            >
              {/* Top Row */}
              <div className="audit-event-card-top">
                <div className="audit-event-icon-cluster">
                  <div className={`audit-event-icon-box ${evt.severityClass || "primary"}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                      {evt.icon || "receipt_long"}
                    </span>
                  </div>
                  <div>
                    <div className="audit-event-code-title">
                      <span>{evt.code}</span>
                      <span className={`audit-kpi-pill ${evt.severityClass || "primary"}`}>
                        {evt.severity}
                      </span>
                      <span className="audit-kpi-pill secondary">
                        {evt.governanceBadge}
                      </span>
                    </div>
                    <p className="audit-event-narrative">{evt.narrative}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="audit-event-date-col">
                  <span className="audit-event-date-text">{evt.date}</span>
                  <span className="audit-event-time-text">{evt.time}</span>
                </div>
              </div>

              {/* Bottom Context Strip */}
              <div className="audit-event-meta-strip">
                <div className="audit-event-actor-text" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--audit-outline)" }}>
                    badge
                  </span>
                  <span>
                    Actor: <strong>{evt.actor.name}</strong> ({evt.actor.empId})
                  </span>
                  <span style={{ color: "var(--audit-outline)" }}>•</span>
                  <span style={{ fontFamily: "monospace", color: "var(--audit-outline)" }}>{evt.actor.ip}</span>
                </div>

                <div className="audit-event-target-text" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>
                    Target: <strong>{evt.target}</strong>
                  </span>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--audit-primary)" }}>
                    chevron_right
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Pagination Footer */}
      <div className="audit-pagination-bar">
        <span style={{ fontSize: "12px", color: "var(--audit-text-muted)" }}>
          Showing <strong style={{ color: "var(--audit-text)" }}>1 – {events.length}</strong> of{" "}
          <strong style={{ color: "var(--audit-text)" }}>{totalEventsCount}</strong> recorded telemetry events
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            type="button"
            className="audit-page-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Prev
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className={`audit-page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <span style={{ padding: "0 4px", color: "var(--audit-outline)", fontSize: "12px" }}>…</span>
          <button
            type="button"
            className={`audit-page-btn ${currentPage === totalPages ? "active" : ""}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
          <button
            type="button"
            className="audit-page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Compliance Notice Banner */}
      <div className="audit-compliance-banner">
        <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--audit-primary)", flexShrink: 0, marginTop: "2px" }}>
          verified
        </span>
        <div style={{ fontSize: "12px", color: "var(--audit-text-muted)", lineHeight: 1.45 }}>
          <strong style={{ color: "var(--audit-text)" }}>Immutable WORM Storage Architecture:</strong> HireD audit event logs are streamed directly to AWS S3 Object Lock (Compliance Mode) with immutable retention for 7 years as mandated by Reserve Bank of India (RBI) payment gateway and Ministry of Road Transport &amp; Highways (MoRTH) digital transport directives.
        </div>
      </div>
    </div>
  );
}

AuditLogEventStream.propTypes = {
  events: PropTypes.array.isRequired,
  selectedEventId: PropTypes.string,
  onSelectEvent: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalEventsCount: PropTypes.string,
};
