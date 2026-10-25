import { useState } from "react";
import PropTypes from "prop-types";

function TripRegisterTable({
  trips,
  selectedTripId,
  onSelectTrip,
  searchQuery,
  onSearchChange,
  tonnageFilter,
  onTonnageChange,
  sortBy,
  onSortChange,
  onTrackLive,
  onAssignDriver,
  onOpenReport,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const tonnageOptions = [
    { id: "ALL", label: "All Fleet" },
    { id: "heavy", label: "Heavy Truck (20T+)" },
    { id: "medium", label: "Medium LCV (10T-16T)" },
    { id: "multi_axle", label: "Multi-Axle Trailer" },
    { id: "reefer", label: "Reefer / Cold Box" },
  ];

  // Pagination calculation
  const totalTrips = trips.length;
  const totalPages = Math.ceil(totalTrips / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentTrips = trips.slice(startIndex, startIndex + pageSize);

  // Status badge styling helper
  function getStatusBadge(status) {
    switch (status) {
      case "In Transit":
        return <span className="trip-status-pill pill-in-transit">In Transit</span>;
      case "At Pickup":
        return <span className="trip-status-pill pill-at-pickup">At Pickup</span>;
      case "Awaiting Driver":
        return <span className="trip-status-pill pill-awaiting-driver">Awaiting Driver</span>;
      case "Delivered":
        return <span className="trip-status-pill pill-delivered">Delivered</span>;
      case "Delayed":
        return <span className="trip-status-pill pill-delayed">Delayed</span>;
      case "Scheduled":
        return <span className="trip-status-pill pill-scheduled">Scheduled</span>;
      default:
        return <span className="trip-status-pill pill-default">{status}</span>;
    }
  }

  // SLA badge styling helper
  function getSlaBadge(sla) {
    switch (sla) {
      case "On Time":
        return (
          <span className="trip-sla-pill sla-on-time">
            <span className="trip-sla-dot dot-blue"></span> On Time
          </span>
        );
      case "At Risk":
        return (
          <span className="trip-sla-pill sla-at-risk">
            <span className="trip-sla-dot dot-amber"></span> At Risk
          </span>
        );
      case "Delayed":
        return (
          <span className="trip-sla-pill sla-delayed">
            Delayed
          </span>
        );
      case "POD Verified":
        return (
          <span className="trip-sla-pill sla-pod-verified">
            POD Verified
          </span>
        );
      default:
        return <span className="trip-sla-pill sla-default">{sla}</span>;
    }
  }

  return (
    <div className="trip-register-card">
      {/* Search, Secondary Filters and Fleet Category Pills */}
      <div className="trip-toolbar-container">
        <div className="trip-search-row">
          <div className="trip-search-field-wrap">
            <span className="material-symbols-outlined trip-search-icon">search</span>
            <input
              type="text"
              className="trip-search-input"
              placeholder="Search trip ID, account, driver, vehicle..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              id="input-trip-search"
            />
            {searchQuery && (
              <button
                type="button"
                className="trip-search-clear-btn"
                onClick={() => onSearchChange("")}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          <div className="trip-actions-row">
            <button
              type="button"
              className="trip-btn-secondary"
              onClick={() => onSortChange(sortBy === "eta" ? "id" : "eta")}
              title="Filter by status or corridor"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Filter By</span>
            </button>
            <button
              type="button"
              className="trip-btn-secondary"
              onClick={() => onSortChange(sortBy === "eta" ? "urgent" : "eta")}
              title="Sort criteria"
            >
              <span className="material-symbols-outlined text-[16px]">sort</span>
              <span>Sort: {sortBy === "eta" ? "Live ETA" : "Priority"}</span>
            </button>
          </div>
        </div>

        {/* Fleet Tonnage Category Pills */}
        <div className="trip-tonnage-chips-row">
          <span className="trip-tonnage-label">Tonnage:</span>
          {tonnageOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`trip-tonnage-chip ${
                tonnageFilter === opt.id ? "tonnage-chip-active" : "tonnage-chip-inactive"
              }`}
              onClick={() => onTonnageChange(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comprehensive Trip Register Table */}
      <div className="trip-table-wrapper">
        <table className="trip-register-table" id="table-trip-register">
          <thead>
            <tr>
              <th className="th-trip-id">Trip ID</th>
              <th className="th-account">Account / Shipper</th>
              <th className="th-route">Route &amp; Mileage</th>
              <th className="th-driver">Driver / Vehicle</th>
              <th className="th-status">Status</th>
              <th className="th-sla">SLA</th>
              <th className="th-actions text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTrips.length === 0 ? (
              <tr>
                <td colSpan={7} className="trip-table-empty">
                  <div className="trip-empty-state">
                    <span className="material-symbols-outlined text-4xl text-outline">local_shipping</span>
                    <p className="font-semibold text-on-surface mt-2">No matching trips found</p>
                    <p className="text-body-sm text-on-surface-variant">
                      Try clearing search terms or selecting another status filter tab.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentTrips.map((trip) => {
                const isSelected = selectedTripId === trip.id;
                const isAwaiting = trip.status === "Awaiting Driver" || !trip.driver;

                let rowClass = "trip-table-row";
                if (isSelected) rowClass += " trip-row-selected";
                if (isAwaiting) rowClass += " trip-row-awaiting";

                return (
                  <tr
                    key={trip.id}
                    className={rowClass}
                    onClick={() => onSelectTrip(trip.id)}
                    id={`trip-row-${trip.id}`}
                  >
                    {/* Trip ID */}
                    <td className="td-trip-id">
                      <div className="trip-id-cluster">
                        <span
                          className={`trip-dot-marker ${
                            isAwaiting
                              ? "dot-error"
                              : trip.status === "Delivered"
                              ? "dot-delivered"
                              : "dot-primary"
                          }`}
                        ></span>
                        <span
                          className={`trip-id-code font-bold ${
                            isSelected ? "text-primary" : "text-on-surface"
                          }`}
                        >
                          {trip.id}
                        </span>
                      </div>
                      <span className="trip-category-sub">{trip.category}</span>
                    </td>

                    {/* Account / Shipper */}
                    <td className="td-account">
                      <div className="trip-account-name">{trip.account}</div>
                      <span className="trip-contract-id">Contract ID: {trip.contractId}</span>
                    </td>

                    {/* Route & Mileage */}
                    <td className="td-route">
                      <div className="trip-route-corridor">
                        <span>{trip.route.origin}</span>
                        <span className="material-symbols-outlined trip-arrow-icon">trending_flat</span>
                        <span>{trip.route.destination}</span>
                      </div>
                      <span className="trip-mileage-sub">
                        {trip.route.distanceKm} km • {trip.route.corridor}
                      </span>
                    </td>

                    {/* Driver / Vehicle */}
                    <td className="td-driver">
                      {trip.driver ? (
                        <>
                          <div className="trip-driver-name">{trip.driver.shortName}</div>
                          <div className="trip-vehicle-num">{trip.vehicle?.number || "Unassigned"}</div>
                        </>
                      ) : (
                        <>
                          <div className="trip-unassigned-alert">
                            <span className="material-symbols-outlined text-[16px]">error</span>
                            <span>Unassigned</span>
                          </div>
                          <div className="trip-unassigned-sub">Driver cancelled</div>
                        </>
                      )}
                    </td>

                    {/* Status */}
                    <td className="td-status">{getStatusBadge(trip.status)}</td>

                    {/* SLA */}
                    <td className="td-sla">{getSlaBadge(trip.sla)}</td>

                    {/* Actions */}
                    <td className="td-actions text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="trip-row-actions-group">
                        {isAwaiting ? (
                          <button
                            type="button"
                            className="trip-btn-assign-driver"
                            onClick={() => onAssignDriver(trip)}
                            title="Assign available driver immediately"
                          >
                            <span className="material-symbols-outlined text-[15px]">person_add</span>
                            <span>Assign Driver</span>
                          </button>
                        ) : trip.status === "Delivered" ? (
                          <button
                            type="button"
                            className="trip-btn-action-light"
                            onClick={() => onOpenReport(trip)}
                            title="View electronic proof of delivery"
                          >
                            <span className="material-symbols-outlined text-[15px]">description</span>
                            <span>Trip Report</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="trip-btn-action-live"
                            onClick={() => onTrackLive(trip)}
                            title="Live GPS corridor tracking"
                          >
                            <span className="material-symbols-outlined text-[15px]">radar</span>
                            <span>Track Live</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="trip-btn-action-more"
                          onClick={() => onSelectTrip(trip.id)}
                          title="View detailed trip specs"
                        >
                          <span className="material-symbols-outlined text-[16px]">more_vert</span>
                        </button>
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
      <div className="trip-pagination-bar">
        <div className="trip-pagination-info">
          <span>
            Showing <strong className="text-on-surface">{totalTrips > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + pageSize, totalTrips)}</strong> of {totalTrips} active operations
          </span>
        </div>
        <div className="trip-pagination-controls">
          <button
            type="button"
            className="trip-page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            title="Previous page"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`trip-page-num ${page === currentPage ? "trip-page-num-active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="trip-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            title="Next page"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

TripRegisterTable.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedTripId: PropTypes.string,
  onSelectTrip: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  tonnageFilter: PropTypes.string.isRequired,
  onTonnageChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onTrackLive: PropTypes.func.isRequired,
  onAssignDriver: PropTypes.func.isRequired,
  onOpenReport: PropTypes.func.isRequired,
};

export default TripRegisterTable;
