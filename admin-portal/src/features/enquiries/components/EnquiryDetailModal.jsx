import { useState } from "react";
import PropTypes from "prop-types";
import { OPS_OWNERS } from "../data/mockEnquiriesData";

function EnquiryDetailModal({
  isOpen,
  onClose,
  enquiry,
  onStatusChange,
  onAssignOwner,
  onConvertTrip,
  onAddTimelineNote,
}) {
  const [newNote, setNewNote] = useState("");

  if (!isOpen || !enquiry) return null;

  function handleOwnerSelect(e) {
    const selectedId = e.target.value;
    const newOwner =
      selectedId === "unassigned"
        ? null
        : OPS_OWNERS.find((o) => o.id === selectedId) || null;
    onAssignOwner(enquiry.id, newOwner);
  }

  function handleAddNoteSubmit(e) {
    e.preventDefault();
    if (!newNote.trim()) return;

    onAddTimelineNote(enquiry.id, {
      title: "Note Added by Admin",
      desc: newNote.trim(),
      author: "Admin Ops",
    });
    setNewNote("");
  }

  return (
    <div className="enquiry-modal-backdrop" onClick={onClose}>
      <div
        className="enquiry-modal-card enquiry-detail-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-detail-heading"
      >
        {/* Detail Header */}
        <div className="detail-modal-header">
          <div className="detail-header-left">
            <span className="detail-enquiry-id">{enquiry.id}</span>
            <span className={`detail-status-pill status-${enquiry.status.toLowerCase()}`}>
              ● {enquiry.status}
            </span>
            <span className="detail-priority-pill">{enquiry.priority} Priority</span>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Company Title Bar */}
        <div className="detail-company-banner">
          <div className="company-info-block">
            <h2 id="enquiry-detail-heading" className="detail-company-title">
              {enquiry.company}
            </h2>
            <div className="company-sub-meta">
              <span className="meta-source-tag">Source: {enquiry.source}</span>
              <span className="meta-separator">•</span>
              <span className="meta-date">Created: {enquiry.createdAt}</span>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="detail-quick-actions-toolbar">
            {enquiry.status !== "Contacted" && enquiry.status !== "Converted" && (
              <button
                type="button"
                className="btn-toolbar-action"
                onClick={() => onStatusChange(enquiry.id, "Contacted")}
                title="Mark contacted"
              >
                <span className="material-symbols-outlined">call</span>
                <span>Contacted</span>
              </button>
            )}

            {enquiry.status !== "Qualified" && enquiry.status !== "Converted" && (
              <button
                type="button"
                className="btn-toolbar-action"
                onClick={() => onStatusChange(enquiry.id, "Qualified")}
                title="Mark qualified"
              >
                <span className="material-symbols-outlined">check_circle</span>
                <span>Qualify</span>
              </button>
            )}

            {enquiry.status !== "Converted" ? (
              <button
                type="button"
                className="btn-toolbar-convert"
                onClick={() => {
                  onClose();
                  onConvertTrip(enquiry);
                }}
                title="Convert to live trip"
              >
                <span className="material-symbols-outlined">sync_alt</span>
                <span>Convert to Trip</span>
              </button>
            ) : (
              <div className="converted-badge-box">
                <span className="material-symbols-outlined">task_alt</span>
                <span>Converted: {enquiry.convertedTripId || "Trip Dispatched"}</span>
              </div>
            )}

            {enquiry.status !== "Lost" && (
              <button
                type="button"
                className="btn-toolbar-lost"
                onClick={() => onStatusChange(enquiry.id, "Lost")}
                title="Mark lead as lost"
              >
                <span className="material-symbols-outlined">cancel</span>
                <span>Lost</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="detail-body-grid">
          {/* Left Column: Dossier Information */}
          <div className="detail-info-pane">
            <div className="detail-section-card">
              <h4 className="section-card-title">Commercial & Corridor Requirements</h4>
              <div className="card-keyvalues-grid">
                <div className="kv-item">
                  <span className="kv-label">Freight Route</span>
                  <strong className="kv-val">{enquiry.route}</strong>
                </div>
                <div className="kv-item">
                  <span className="kv-label">Expected Monthly Volume</span>
                  <strong className="kv-val highlight-val">{enquiry.expectedVolume}</strong>
                </div>
                <div className="kv-item">
                  <span className="kv-label">Fleet / Vehicle Spec</span>
                  <span className="kv-val">{enquiry.vehicleRequirement || "Standard Taurus"}</span>
                </div>
                <div className="kv-item">
                  <span className="kv-label">Last Activity</span>
                  <span className="kv-val">{enquiry.lastUpdate}</span>
                </div>
              </div>
            </div>

            <div className="detail-section-card">
              <h4 className="section-card-title">Contact Information</h4>
              <div className="card-keyvalues-grid">
                <div className="kv-item">
                  <span className="kv-label">Contact Person</span>
                  <span className="kv-val">{enquiry.contactPerson}</span>
                </div>
                <div className="kv-item">
                  <span className="kv-label">Phone</span>
                  <a href={`tel:${enquiry.phone}`} className="kv-val link-phone">
                    {enquiry.phone}
                  </a>
                </div>
                <div className="kv-item full-width">
                  <span className="kv-label">Email</span>
                  <a href={`mailto:${enquiry.email}`} className="kv-val link-email">
                    {enquiry.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="detail-section-card">
              <h4 className="section-card-title">Assigned Operations Owner</h4>
              <div className="owner-assignment-row">
                <div className="owner-preview-pod">
                  {enquiry.owner ? (
                    <div
                      className="owner-avatar-medium"
                      style={{ backgroundColor: enquiry.owner.color || "#7c3aed" }}
                    >
                      {enquiry.owner.initials}
                    </div>
                  ) : (
                    <div className="owner-avatar-medium unassigned">
                      <span className="material-symbols-outlined">person_off</span>
                    </div>
                  )}
                  <div>
                    <strong className="owner-current-name">
                      {enquiry.owner ? enquiry.owner.name : "Unassigned Lead"}
                    </strong>
                    <span className="owner-sub-title">
                      {enquiry.owner ? enquiry.owner.email : "Assign to team member"}
                    </span>
                  </div>
                </div>

                <div className="owner-select-wrapper">
                  <select
                    className="owner-change-select"
                    value={enquiry.owner ? (enquiry.owner.name.startsWith("Aparna") ? "aparna" : enquiry.owner.name.startsWith("Vishnu") ? "vishnu" : "rajesh") : "unassigned"}
                    onChange={handleOwnerSelect}
                    aria-label="Assign owner"
                  >
                    {OPS_OWNERS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Operational Notes */}
            <div className="detail-section-card">
              <h4 className="section-card-title">Freight Specifications & Requirements</h4>
              <p className="detail-notes-text">{enquiry.notes}</p>
            </div>
          </div>

          {/* Right Column: Activity History & Timeline */}
          <div className="detail-timeline-pane">
            <h4 className="section-card-title">Activity & Audit Timeline</h4>

            {/* Add Note Form */}
            <form onSubmit={handleAddNoteSubmit} className="add-note-subform">
              <textarea
                rows={2}
                placeholder="Log a call, client requirement or note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="add-note-textarea"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="btn-add-note"
              >
                <span className="material-symbols-outlined">send</span>
                <span>Post Note</span>
              </button>
            </form>

            {/* Timeline Stream */}
            <div className="timeline-events-list">
              {enquiry.timeline && enquiry.timeline.length > 0 ? (
                enquiry.timeline.map((evt, idx) => (
                  <div key={evt.id || idx} className="timeline-event-item">
                    <div className="event-bullet-point" />
                    <div className="event-content-box">
                      <div className="event-meta-line">
                        <strong className="event-title">{evt.title}</strong>
                        <span className="event-time">{evt.timestamp}</span>
                      </div>
                      <p className="event-desc">{evt.desc}</p>
                      <span className="event-author">Logged by: {evt.author}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-events-text">No activity history recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

EnquiryDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  enquiry: PropTypes.object,
  onStatusChange: PropTypes.func.isRequired,
  onAssignOwner: PropTypes.func.isRequired,
  onConvertTrip: PropTypes.func.isRequired,
  onAddTimelineNote: PropTypes.func.isRequired,
};

export default EnquiryDetailModal;
