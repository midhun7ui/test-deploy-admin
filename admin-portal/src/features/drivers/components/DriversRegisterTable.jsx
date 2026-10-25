import PropTypes from "prop-types";

/**
 * Driver Register Master Table (Left 58% Column)
 * Interactive data table with row selection, search, status pills, and pagination
 */
export default function DriversRegisterTable({
  drivers,
  selectedDriverId,
  onSelectDriver,
  searchQuery,
  onSearchChange,
  onAssignTrip,
  onVerifyKyc,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
}) {
  function formatINR(val) {
    if (typeof val !== "number") return val;
    return `₹${val.toLocaleString("en-IN")}`;
  }

  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // KYC Docs Badge Resolver
  function renderKycBadge(kycStatus, completedCount, totalCountDoc) {
    if (kycStatus === "Verified") {
      return (
        <span className="driver-pill pill-available">
          <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
            verified
          </span>
          <span>Verified</span>
        </span>
      );
    }
    if (kycStatus === "Expired") {
      return (
        <span className="driver-pill pill-expired">
          <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
            warning
          </span>
          <span>Expired DL</span>
        </span>
      );
    }
    const pendingCount = (totalCountDoc || 5) - (completedCount || 3);
    return (
      <span className="driver-pill pill-pending-kyc">
        <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
          schedule
        </span>
        <span>Pending ({pendingCount > 0 ? pendingCount : 2})</span>
      </span>
    );
  }

  // Driver Bank Status Badge Resolver
  function renderBankBadge(bankDetails) {
    if (!bankDetails || !bankDetails.hasBank) {
      return (
        <span className="driver-bank-tag none" title="No bank account added">
          <span className="material-symbols-outlined" style={{ fontSize: "11px" }}>account_balance</span>
          <span>No Bank</span>
        </span>
      );
    }
    if (bankDetails.isActive || bankDetails.status === "Active") {
      return (
        <span className="driver-bank-tag active" title="Bank Account Approved & Verified">
          <span className="material-symbols-outlined" style={{ fontSize: "11px" }}>check_circle</span>
          <span>Bank Approved</span>
        </span>
      );
    }
    if (bankDetails.isRejected || bankDetails.status === "Rejected") {
      return (
        <span className="driver-bank-tag rejected" title="Bank Account Denied">
          <span className="material-symbols-outlined" style={{ fontSize: "11px" }}>cancel</span>
          <span>Bank Denied</span>
        </span>
      );
    }
    return (
      <span className="driver-bank-tag pending" title="Bank Account Pending Approval">
        <span className="material-symbols-outlined" style={{ fontSize: "11px" }}>hourglass_top</span>
        <span>Bank Pending</span>
      </span>
    );
  }

  // Driver Status Badge Resolver
  function renderStatusBadge(status) {
    switch (status) {
      case "On Trip":
        return (
          <span className="driver-pill pill-ontrip">
            <span className="driver-pulse-green" style={{ backgroundColor: "var(--driver-primary)" }} />
            <span>On Trip</span>
          </span>
        );
      case "Available":
        return <span className="driver-pill pill-available">Available</span>;
      case "Pending KYC":
        return <span className="driver-pill pill-pending-kyc">Pending KYC</span>;
      case "Inactive":
      default:
        return <span className="driver-pill pill-inactive">Inactive</span>;
    }
  }

  return (
    <div className="driver-register-card" id="driver-register-card">
      {/* Search & Quick Filters Bar */}
      <div className="driver-filter-top-bar">
        <div className="driver-search-controls-row">
          <div className="driver-search-wrapper">
            <span className="material-symbols-outlined driver-search-icon">search</span>
            <input
              type="text"
              className="driver-search-input"
              placeholder="Search driver name, phone, license number, or vehicle..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              id="input-driver-search"
            />
            {searchQuery && (
              <button
                type="button"
                className="driver-search-clear"
                onClick={() => onSearchChange("")}
                title="Clear search"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  close
                </span>
              </button>
            )}
          </div>

          <button
            type="button"
            className="driver-tune-btn"
            title="Filter Settings"
            id="btn-driver-filter"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>
              tune
            </span>
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll Support */}
      <div className="driver-table-wrapper">
        <table className="driver-table" id="driver-master-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: "1.25rem" }}>Driver</th>
              <th>Phone</th>
              <th>Assigned Vehicle</th>
              <th>KYC Docs</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Wallet</th>
              <th style={{ textAlign: "center", paddingRight: "1.25rem" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "36px", color: "var(--driver-text-outline)" }}
                  >
                    badge
                  </span>
                  <p style={{ fontWeight: "700", marginTop: "0.5rem" }}>No drivers matching criteria</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--driver-text-muted)" }}>
                    Try clearing search queries or switching filter tabs
                  </p>
                </td>
              </tr>
            ) : (
              drivers.map((driver) => {
                const isSelected = driver.id === selectedDriverId;

                return (
                  <tr
                    key={driver.id}
                    className={`${isSelected ? "row-selected" : ""}`}
                    onClick={() => onSelectDriver(driver.id)}
                    id={`driver-row-${driver.id}`}
                  >
                    <td style={{ paddingLeft: "1.25rem" }}>
                      <div className="driver-avatar-cluster">
                        <div className="driver-avatar-box">
                          {driver.avatar ? (
                            <img
                              src={driver.avatar}
                              alt={driver.name}
                              className="driver-img-circle"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : (
                            <div className="driver-initials-circle">{driver.initials}</div>
                          )}
                          <span
                            className={
                              driver.status === "Pending KYC"
                                ? "driver-pending-ring-dot"
                                : "driver-online-ring-dot"
                            }
                          />
                        </div>

                        <div>
                          <div className="driver-name-text">
                            <span>{driver.name}</span>
                            {isSelected && (
                              <span
                                className="material-symbols-outlined driver-selected-icon"
                                title="Active Selection"
                              >
                                radio_button_checked
                              </span>
                            )}
                          </div>
                          <div className="driver-sub-rating-trips">
                            {driver.tripsCompleted > 0 ? (
                              <>
                                <span>{driver.rating} ★</span> •{" "}
                                <span>{driver.tripsCompleted} trips</span>
                              </>
                            ) : (
                              <span style={{ color: "var(--driver-amber)", fontWeight: "600" }}>
                                New Onboarding
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="driver-phone-mono">{driver.phone}</span>
                    </td>

                    <td>
                      <div className="driver-vehicle-cluster">
                        {driver.vehicle?.isAssigned && driver.vehicle?.number && driver.vehicle?.number !== "None" ? (
                          <>
                            <span className="driver-vehicle-no">{driver.vehicle?.number}</span>
                            <span className="driver-vehicle-type-sub">
                              {driver.vehicle?.type}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="driver-vehicle-no" style={{ color: "var(--driver-text-outline)" }}>
                              None
                            </span>
                            <span className="driver-vehicle-type-sub" style={{ color: "var(--driver-amber)" }}>
                              Unassigned
                            </span>
                          </>
                        )}
                      </div>
                    </td>


                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "flex-start" }}>
                        {renderKycBadge(
                          driver.kycStatus,
                          driver.kycCompletedCount,
                          driver.kycTotalCount
                        )}
                        {renderBankBadge(driver.bankDetails)}
                      </div>
                    </td>

                    <td>{renderStatusBadge(driver.status)}</td>

                    <td style={{ textAlign: "right" }}>
                      <span className="driver-wallet-bold">
                        {formatINR(driver.wallet?.availableBalance)}
                      </span>
                    </td>

                    <td style={{ textAlign: "center", paddingRight: "1.25rem" }} onClick={(e) => e.stopPropagation()}>
                      {driver.status === "Available" ? (
                        <button
                          type="button"
                          className="driver-row-action-btn btn-assign-neutral"
                          onClick={() => onAssignTrip(driver)}
                          title="Assign trip to driver"
                        >
                          Assign Trip
                        </button>
                      ) : driver.status === "Pending KYC" ? (
                        <button
                          type="button"
                          className="driver-row-action-btn btn-verify-amber"
                          onClick={() => onVerifyKyc(driver)}
                          title="Review & Verify KYC"
                        >
                          Verify
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="driver-row-action-btn btn-view-blue"
                          onClick={() => onSelectDriver(driver.id)}
                          title="Inspect Driver Profile"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="driver-pagination-row">
        <span>
          Showing <strong>{startRecord} - {endRecord}</strong> of{" "}
          <strong>{totalCount}</strong> drivers
        </span>

        <div className="driver-pagination-controls">
          <button
            type="button"
            className="driver-page-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            title="Previous Page"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              chevron_left
            </span>
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNo) => (
            <button
              key={pageNo}
              type="button"
              className={`driver-page-btn ${pageNo === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(pageNo)}
            >
              {pageNo}
            </button>
          ))}

          {totalPages > 5 && <span style={{ padding: "0 4px", color: "var(--driver-text-outline)" }}>...</span>}

          {totalPages > 5 && (
            <button
              type="button"
              className={`driver-page-btn ${totalPages === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          )}

          <button
            type="button"
            className="driver-page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            title="Next Page"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

DriversRegisterTable.propTypes = {
  drivers: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedDriverId: PropTypes.string,
  onSelectDriver: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onAssignTrip: PropTypes.func.isRequired,
  onVerifyKyc: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
