import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

function EnquiriesTable({
  enquiries,
  onSelectEnquiry,
  onConvertTrip,
  onAddEnquiry,
  onExport,
  onStatusChange,
  onAssignOwner,
  onDeleteEnquiry,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close actions menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pagination calculation
  const totalCount = enquiries.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const paginatedData = enquiries.slice(startIndex, endIndex);

  // Select all checkbox handler
  const allCurrentSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(item.id));

  function handleToggleSelectAll() {
    if (allCurrentSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedData.some((item) => item.id === id))
      );
    } else {
      const newIds = paginatedData.map((item) => item.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...newIds])));
    }
  }

  function handleToggleRow(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Source badge style
  function getSourceBadgeClass(source) {
    switch (source) {
      case "Direct Order":
        return "badge-source-direct-order";
      case "Partner Order":
        return "badge-source-partner-order";
      case "Website":
        return "badge-source-website";
      case "Referral":
        return "badge-source-referral";
      case "Marketplace":
        return "badge-source-marketplace";
      case "Outbound":
        return "badge-source-outbound";
      default:
        return "badge-source-default";
    }
  }

  // Status badge style
  function getStatusBadgeClass(status) {
    switch (status) {
      case "New":
        return "badge-status-new";
      case "Contacted":
        return "badge-status-contacted";
      case "Qualified":
        return "badge-status-qualified";
      case "Converted":
        return "badge-status-converted";
      case "Lost":
        return "badge-status-lost";
      default:
        return "badge-status-default";
    }
  }

  return (
    <section className="all-enquiries-table-section" aria-label="All Enquiries Register">
      {/* Table Section Header */}
      <div className="table-section-header">
        <div className="table-title-cluster">
          <span className="material-symbols-outlined table-header-icon">view_list</span>
          <h2 className="table-title">All Enquiries</h2>
          <span className="table-counter-pill">{totalCount} enquiries</span>
        </div>

        <div className="table-actions-cluster">
          {selectedIds.length > 0 && (
            <span className="selected-counter-indicator">
              {selectedIds.length} selected
            </span>
          )}

          <button
            type="button"
            className="btn-table-outline"
            id="btn-export-enquiries"
            onClick={onExport}
            title="Export CSV spreadsheet of enquiries"
          >
            <span className="material-symbols-outlined btn-icon">download</span>
            <span>Export</span>
          </button>

          <button
            type="button"
            className="btn-table-primary"
            id="btn-add-enquiry-table"
            onClick={onAddEnquiry}
            title="Add a new lead / enquiry"
          >
            <span className="material-symbols-outlined btn-icon">add</span>
            <span>Add Enquiry</span>
          </button>
        </div>
      </div>

      {/* Main Table Responsive Shell */}
      <div className="enquiries-table-wrapper">
        <table className="enquiries-data-table" id="table-enquiries">
          <thead>
            <tr>
              <th className="th-checkbox">
                <input
                  type="checkbox"
                  checked={allCurrentSelected}
                  onChange={handleToggleSelectAll}
                  aria-label="Select all enquiries on this page"
                />
              </th>
              <th className="th-id">ENQUIRY ID</th>
              <th className="th-company">COMPANY</th>
              <th className="th-contact">CONTACT PERSON</th>
              <th className="th-phone">PHONE</th>
              <th className="th-route">ROUTE / REQUIREMENT</th>
              <th className="th-volume">EXPECTED VOLUME</th>
              <th className="th-source">SOURCE</th>
              <th className="th-status">STATUS</th>
              <th className="th-owner">OWNER</th>
              <th className="th-update">LAST UPDATE</th>
              <th className="th-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: "3.5rem 1rem", color: "#64748b" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: "#94a3b8" }}>
                      inbox
                    </span>
                    <strong style={{ color: "#1e293b", fontSize: "1rem" }}>No enquiries found</strong>
                    <span style={{ fontSize: "0.875rem" }}>
                      New quotation leads and enterprise enquiries will appear here.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className={`enquiry-tr ${isSelected ? "row-selected" : ""}`}
                  >
                    {/* Row Checkbox */}
                    <td className="td-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(item.id)}
                        aria-label={`Select ${item.id}`}
                      />
                    </td>

                    {/* Enquiry ID */}
                    <td className="td-id">
                      <button
                        type="button"
                        className="link-enquiry-id"
                        onClick={() => onSelectEnquiry?.(item)}
                        title={`View details for ${item.id}`}
                      >
                        {item.id}
                      </button>
                    </td>

                    {/* Company Name */}
                    <td className="td-company">
                      <strong
                        className="company-name-clickable"
                        onClick={() => onSelectEnquiry?.(item)}
                      >
                        {item.company}
                      </strong>
                    </td>

                    {/* Contact Person */}
                    <td className="td-contact">{item.contactPerson}</td>

                    {/* Phone */}
                    <td className="td-phone">
                      <span className="phone-monospace">{item.phone}</span>
                    </td>

                    {/* Route */}
                    <td className="td-route">
                      <span className="route-inline">{item.route}</span>
                    </td>

                    {/* Expected Volume */}
                    <td className="td-volume">
                      <strong className="volume-val">
                        {item.expectedVolume.split(" / ")[0]}
                      </strong>
                      <span className="volume-unit"> / mo</span>
                    </td>

                    {/* Source */}
                    <td className="td-source">
                      <span className={`pill-source ${getSourceBadgeClass(item.source)}`}>
                        {item.source}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="td-status">
                      <span className={`pill-status ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Owner */}
                    <td className="td-owner">
                      {item.owner ? (
                        <div className="owner-assigned-cell">
                          <div
                            className="owner-avatar-mini"
                            style={{ backgroundColor: item.owner.color || "#7c3aed" }}
                          >
                            {item.owner.initials}
                          </div>
                          <span className="owner-name-text">{item.owner.name}</span>
                        </div>
                      ) : (
                        <div className="owner-unassigned-cell">
                          <span className="material-symbols-outlined unassigned-icon">
                            person_off
                          </span>
                          <span className="unassigned-text">Unassigned</span>
                        </div>
                      )}
                    </td>

                    {/* Last Update */}
                    <td className="td-update">{item.lastUpdate}</td>

                    {/* Actions Dropdown */}
                    <td className="td-actions">
                      <div className="actions-menu-wrapper" ref={activeMenuId === item.id ? menuRef : null}>
                        <button
                          type="button"
                          className="btn-dots-menu"
                          onClick={() =>
                            setActiveMenuId(activeMenuId === item.id ? null : item.id)
                          }
                          title="Actions menu"
                          aria-label="Actions"
                        >
                          <span className="material-symbols-outlined">more_horiz</span>
                        </button>

                        {activeMenuId === item.id && (
                          <div className="actions-popover-menu">
                            <button
                              type="button"
                              className="popover-menu-item"
                              onClick={() => {
                                setActiveMenuId(null);
                                onSelectEnquiry?.(item);
                              }}
                            >
                              <span className="material-symbols-outlined">visibility</span>
                              <span>View Details</span>
                            </button>

                            {item.status !== "Converted" && (
                              <button
                                type="button"
                                className="popover-menu-item highlight-item"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onConvertTrip?.(item);
                                }}
                              >
                                <span className="material-symbols-outlined">sync_alt</span>
                                <span>Convert to Trip</span>
                              </button>
                            )}

                            <div className="popover-menu-divider" />

                            <button
                              type="button"
                              className="popover-menu-item"
                              onClick={() => {
                                setActiveMenuId(null);
                                onStatusChange?.(item.id, "Contacted");
                              }}
                            >
                              <span className="material-symbols-outlined">call</span>
                              <span>Mark as Contacted</span>
                            </button>

                            <button
                              type="button"
                              className="popover-menu-item"
                              onClick={() => {
                                setActiveMenuId(null);
                                onStatusChange?.(item.id, "Qualified");
                              }}
                            >
                              <span className="material-symbols-outlined">check_circle</span>
                              <span>Mark as Qualified</span>
                            </button>

                            <button
                              type="button"
                              className="popover-menu-item"
                              onClick={() => {
                                setActiveMenuId(null);
                                onAssignOwner?.(item);
                              }}
                            >
                              <span className="material-symbols-outlined">person_add</span>
                              <span>Assign Owner</span>
                            </button>

                            <button
                              type="button"
                              className="popover-menu-item danger-item"
                              onClick={() => {
                                setActiveMenuId(null);
                                onStatusChange?.(item.id, "Lost");
                              }}
                            >
                              <span className="material-symbols-outlined">cancel</span>
                              <span>Mark as Lost</span>
                            </button>

                            <button
                              type="button"
                              className="popover-menu-item danger-item"
                              onClick={() => {
                                setActiveMenuId(null);
                                onDeleteEnquiry?.(item.id);
                              }}
                            >
                              <span className="material-symbols-outlined">delete</span>
                              <span>Delete Enquiry</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Bar */}
      <div className="table-pagination-footer">
        <div className="pagination-info-text">
          Showing <strong>{totalCount === 0 ? 0 : startIndex + 1}</strong> to <strong>{endIndex}</strong> of{" "}
          <strong>{totalCount}</strong> enquiries
        </div>

        <div className="pagination-controls-pod">
          {/* Previous Page */}
          <button
            type="button"
            className="pagination-nav-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            title="Previous page"
            aria-label="Previous page"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                type="button"
                className={`pagination-num-btn ${currentPage === pageNum ? "active-page" : ""
                  }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            type="button"
            className="pagination-nav-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            title="Next page"
            aria-label="Next page"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Page size dropdown */}
          <div className="page-size-selector">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="select-page-size"
              aria-label="Rows per page"
            >
              <option value={8}>8 / page</option>
              <option value={10}>10 / page</option>
              <option value={12}>12 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

EnquiriesTable.propTypes = {
  enquiries: PropTypes.array.isRequired,
  onSelectEnquiry: PropTypes.func.isRequired,
  onConvertTrip: PropTypes.func.isRequired,
  onAddEnquiry: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onAssignOwner: PropTypes.func.isRequired,
  onDeleteEnquiry: PropTypes.func.isRequired,
};

export default EnquiriesTable;
