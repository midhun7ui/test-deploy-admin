import PropTypes from "prop-types";
import { LEAD_SOURCES, OPS_OWNERS, PIPELINE_COLUMNS } from "../data/mockEnquiriesData";

function EnquiryFilterModal({
  isOpen,
  onClose,
  filters,
  onChangeFilter,
  onResetFilters,
}) {
  if (!isOpen) return null;

  return (
    <div className="enquiry-modal-backdrop" onClick={onClose}>
      <div
        className="enquiry-modal-card filter-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
      >
        <div className="modal-header-band">
          <div className="modal-title-pod">
            <span className="material-symbols-outlined modal-header-icon">tune</span>
            <div>
              <h3 id="filter-modal-title" className="modal-main-heading">
                Filter Pipeline & Enquiries
              </h3>
              <p className="modal-sub-heading">Refine views by status, source, and owner</p>
            </div>
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

        <div className="filter-modal-body">
          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-group-label">Status</label>
            <div className="filter-chips-grid">
              <button
                type="button"
                className={`filter-chip ${filters.status === "ALL" ? "chip-active" : ""}`}
                onClick={() => onChangeFilter("status", "ALL")}
              >
                All Statuses
              </button>
              {PIPELINE_COLUMNS.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  className={`filter-chip ${filters.status === col.id ? "chip-active" : ""}`}
                  onClick={() => onChangeFilter("status", col.id)}
                >
                  {col.title}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="filter-group">
            <label className="filter-group-label">Priority</label>
            <div className="filter-chips-grid">
              {["ALL", "High", "Medium", "Low"].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`filter-chip ${filters.priority === p ? "chip-active" : ""}`}
                  onClick={() => onChangeFilter("priority", p)}
                >
                  {p === "ALL" ? "All Priorities" : `${p} Priority`}
                </button>
              ))}
            </div>
          </div>

          {/* Source Filter */}
          <div className="filter-group">
            <label className="filter-group-label">Lead Source</label>
            <div className="filter-chips-grid">
              <button
                type="button"
                className={`filter-chip ${filters.source === "ALL" ? "chip-active" : ""}`}
                onClick={() => onChangeFilter("source", "ALL")}
              >
                All Sources
              </button>
              {LEAD_SOURCES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`filter-chip ${filters.source === s.id ? "chip-active" : ""}`}
                  onClick={() => onChangeFilter("source", s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Owner Filter */}
          <div className="filter-group">
            <label className="filter-group-label">Assigned Ops Owner</label>
            <div className="filter-chips-grid">
              <button
                type="button"
                className={`filter-chip ${filters.owner === "ALL" ? "chip-active" : ""}`}
                onClick={() => onChangeFilter("owner", "ALL")}
              >
                All Owners
              </button>
              <button
                type="button"
                className={`filter-chip ${filters.owner === "unassigned" ? "chip-active" : ""}`}
                onClick={() => onChangeFilter("owner", "unassigned")}
              >
                Unassigned
              </button>
              {OPS_OWNERS.filter((o) => o.id !== "unassigned").map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`filter-chip ${filters.owner === o.name ? "chip-active" : ""}`}
                  onClick={() => onChangeFilter("owner", o.name)}
                >
                  {o.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer-actions">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onResetFilters}
          >
            Reset All
          </button>
          <button
            type="button"
            className="btn-modal-submit"
            onClick={onClose}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

EnquiryFilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
};

export default EnquiryFilterModal;
