import { useState } from "react";
import PropTypes from "prop-types";
import { PIPELINE_COLUMNS } from "../data/mockEnquiriesData";

function LeadPipelineKanban({
  enquiries,
  onStatusChange,
  onSelectEnquiry,
  onConvertTrip,
  activeView = "pipeline",
  onToggleView,
  searchQuery,
  onSearchChange,
  onOpenFilter,
}) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Filter based on search query
  const filteredEnquiries = enquiries.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.company.toLowerCase().includes(q) ||
      item.contactPerson.toLowerCase().includes(q) ||
      item.route.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q)
    );
  });

  // Calculate total visible leads
  const visibleCount = filteredEnquiries.length;

  // Drag and drop handlers
  function handleDragStart(e, id) {
    e.dataTransfer.setData("text/plain", id);
    setDraggedId(id);
  }

  function handleDragOver(e, columnId) {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  }

  function handleDragLeave() {
    setDragOverColumn(null);
  }

  function handleDrop(e, targetStatus) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedId;
    if (id && targetStatus) {
      onStatusChange?.(id, targetStatus);
    }
    setDraggedId(null);
    setDragOverColumn(null);
  }

  // Get icon for source
  function getSourceIcon(source) {
    switch (source) {
      case "Direct Order":
        return "assignment_turned_in";
      case "Partner Order":
        return "local_shipping";
      case "Website":
        return "language";
      case "Referral":
        return "group";
      case "Marketplace":
        return "storefront";
      case "Outbound":
        return "mail";
      case "Direct Call":
        return "call";
      default:
        return "tag";
    }
  }

  // Get badge class for priority
  function getPriorityClass(priority) {
    switch (priority) {
      case "High":
        return "priority-pill-high";
      case "Medium":
        return "priority-pill-med";
      case "Low":
        return "priority-pill-low";
      default:
        return "priority-pill-low";
    }
  }

  return (
    <section className="lead-pipeline-section" aria-label="Lead Pipeline View">
      {/* Pipeline Header */}
      <div className="pipeline-header-bar">
        <div className="pipeline-title-cluster">
          <span className="pipeline-blue-dot" />
          <h2 className="pipeline-title">Lead Pipeline</h2>
          <span className="pipeline-count-pill">{visibleCount} shown</span>
        </div>

        <div className="pipeline-controls-cluster">
          {/* Pipeline / List segmented toggle */}
          <div className="view-toggle-segmented" role="tablist">
            <button
              type="button"
              className={`view-btn ${activeView === "pipeline" ? "active" : ""}`}
              onClick={() => onToggleView?.("pipeline")}
              role="tab"
              aria-selected={activeView === "pipeline"}
              id="btn-toggle-view-pipeline"
            >
              Pipeline
            </button>
            <button
              type="button"
              className={`view-btn ${activeView === "list" ? "active" : ""}`}
              onClick={() => onToggleView?.("list")}
              role="tab"
              aria-selected={activeView === "list"}
              id="btn-toggle-view-list"
            >
              List
            </button>
          </div>

          {/* Search Input */}
          <div className="pipeline-search-wrapper">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Search company, contact or location..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pipeline-search-input"
              aria-label="Search pipeline"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => onSearchChange?.("")}
                title="Clear search"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>

          {/* Action icon buttons */}
          <button
            type="button"
            className="pipeline-icon-btn"
            title="Filter pipeline options"
            onClick={onOpenFilter}
            aria-label="Filter"
          >
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* Conditionally render Pipeline Columns (Kanban) or List View */}
      {activeView === "pipeline" ? (
        /* 1. Kanban Columns Board */
        <div className="kanban-columns-grid">
          {PIPELINE_COLUMNS.map((col) => {
            const colCards = filteredEnquiries.filter((item) => item.status === col.id);
            const isOver = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                className={`kanban-column ${isOver ? "drag-over" : ""}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className="column-header">
                  <span
                    className="column-status-dot"
                    style={{ backgroundColor: col.colorDot }}
                  />
                  <span className="column-name">{col.title}</span>
                  <span className="column-item-counter">{colCards.length}</span>
                </div>

                {/* Column Body Cards */}
                <div className="column-cards-container">
                  {colCards.length > 0 ? (
                    colCards.map((card) => (
                      <div
                        key={card.id}
                        className={`lead-kanban-card ${draggedId === card.id ? "is-dragging" : ""}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card.id)}
                        onClick={() => onSelectEnquiry?.(card)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onSelectEnquiry?.(card);
                        }}
                      >
                        {/* Top: Company Name & Priority */}
                        <div className="card-top-row">
                          <strong className="card-company-name">{card.company}</strong>
                          <span className={`priority-pill ${getPriorityClass(card.priority)}`}>
                            {card.priority}
                          </span>
                        </div>

                        {/* Route */}
                        <div className="card-route-row">
                          <span className="route-text">{card.route}</span>
                        </div>

                        {/* Value & Source */}
                        <div className="card-financial-row">
                          <div className="volume-text">
                            <strong>{card.expectedVolume.split(" / ")[0]}</strong>
                            <span className="per-month"> / mo</span>
                          </div>

                          <div className="source-pill">
                            <span className="material-symbols-outlined source-icon">
                              {getSourceIcon(card.source)}
                            </span>
                            <span>{card.source}</span>
                          </div>
                        </div>

                        {/* Footer: Time & Action Button */}
                        <div className="card-footer-row">
                          <span className="card-timestamp">{card.lastUpdate}</span>

                          {card.status === "Converted" ? (
                            <button
                              type="button"
                              className="btn-view-trip"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectEnquiry?.(card);
                              }}
                              title="View converted trip"
                            >
                              <span className="material-symbols-outlined btn-icon">visibility</span>
                              <span>View Trip</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-convert-trip"
                              onClick={(e) => {
                                e.stopPropagation();
                                onConvertTrip?.(card);
                              }}
                              title="Convert enquiry to active order/trip"
                            >
                              <span className="material-symbols-outlined btn-icon">sync_alt</span>
                              <span>Convert to Trip</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Empty state for column (such as Lost) */
                    <div className="kanban-empty-state">
                      <div className="empty-icon-circle">
                        <span className="material-symbols-outlined">inbox</span>
                      </div>
                      <p className="empty-primary-text">No {col.title.toLowerCase()} enquiries</p>
                      <p className="empty-sub-text">
                        Enquiries marked as {col.title.toLowerCase()} will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. Pipeline List View */
        <div className="pipeline-list-container">
          <table className="pipeline-list-table">
            <thead>
              <tr>
                <th>COMPANY & CONTACT</th>
                <th>PIPELINE STAGE</th>
                <th>PRIORITY</th>
                <th>CORRIDOR ROUTE</th>
                <th>MONTHLY VOLUME</th>
                <th>SOURCE</th>
                <th>OWNER</th>
                <th>UPDATED</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((card) => (
                <tr
                  key={card.id}
                  onClick={() => onSelectEnquiry?.(card)}
                  className="pipeline-list-row"
                >
                  <td className="td-company-contact">
                    <div className="company-contact-cell">
                      <strong className="company-name-bold">{card.company}</strong>
                      <span className="contact-person-sub">{card.contactPerson} ({card.id})</span>
                    </div>
                  </td>
                  <td>
                    <select
                      value={card.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onStatusChange?.(card.id, e.target.value)}
                      className={`stage-select-pill stage-${card.status.toLowerCase()}`}
                      aria-label="Change lead stage"
                    >
                      {PIPELINE_COLUMNS.map((col) => (
                        <option key={col.id} value={col.id}>
                          ● {col.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`priority-pill ${getPriorityClass(card.priority)}`}>
                      {card.priority}
                    </span>
                  </td>
                  <td>
                    <span className="route-text">{card.route}</span>
                  </td>
                  <td>
                    <strong>{card.expectedVolume.split(" / ")[0]}</strong>
                    <span className="per-month"> / mo</span>
                  </td>
                  <td>
                    <div className="source-pill">
                      <span className="material-symbols-outlined source-icon">
                        {getSourceIcon(card.source)}
                      </span>
                      <span>{card.source}</span>
                    </div>
                  </td>
                  <td>
                    {card.owner ? (
                      <div className="owner-assigned-cell">
                        <div
                          className="owner-avatar-mini"
                          style={{ backgroundColor: card.owner.color || "#7c3aed" }}
                        >
                          {card.owner.initials}
                        </div>
                        <span className="owner-name-text">{card.owner.name}</span>
                      </div>
                    ) : (
                      <span className="unassigned-text">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <span className="card-timestamp">{card.lastUpdate}</span>
                  </td>
                  <td>
                    {card.status === "Converted" ? (
                      <button
                        type="button"
                        className="btn-view-trip"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEnquiry?.(card);
                        }}
                        title="View converted trip"
                      >
                        <span className="material-symbols-outlined btn-icon">visibility</span>
                        <span>View</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-convert-trip"
                        onClick={(e) => {
                          e.stopPropagation();
                          onConvertTrip?.(card);
                        }}
                        title="Convert to trip"
                      >
                        <span className="material-symbols-outlined btn-icon">sync_alt</span>
                        <span>Convert</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEnquiries.length === 0 && (
            <div className="pipeline-empty-list">
              <span className="material-symbols-outlined empty-search-icon">search_off</span>
              <p>No enquiries found matching your search or filters.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

LeadPipelineKanban.propTypes = {
  enquiries: PropTypes.array.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onSelectEnquiry: PropTypes.func.isRequired,
  onConvertTrip: PropTypes.func.isRequired,
  activeView: PropTypes.string,
  onToggleView: PropTypes.func,
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  onOpenFilter: PropTypes.func,
};

export default LeadPipelineKanban;
