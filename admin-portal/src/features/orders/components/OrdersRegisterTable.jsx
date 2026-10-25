import PropTypes from "prop-types";

/**
 * High Density Orders Register Table with live search, vehicle fleet filter,
 * multi-select checkboxes, row selection highlighting, and pagination
 */
export default function OrdersRegisterTable({
  orders,
  selectedOrderId,
  onSelectOrder,
  checkedOrderIds,
  onToggleCheckOrder,
  onToggleCheckAll,
  searchQuery,
  onSearchChange,
  vehicleFilter,
  onVehicleFilterChange,
  onAcceptOrder,
  onRejectOrder,
  onViewTrip,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
}) {
  const allChecked = orders.length > 0 && orders.every((o) => checkedOrderIds.includes(o.id));
  const someChecked = orders.some((o) => checkedOrderIds.includes(o.id)) && !allChecked;

  // Format currency in Indian numbering system
  function formatINR(val) {
    if (typeof val !== "number") return val;
    return `₹${val.toLocaleString("en-IN")}`;
  }

  // Status Badge Class Resolver
  function getStatusBadge(status) {
    switch (status) {
      case "Pending Review":
        return <span className="order-status-pill status-pending-review">Pending Review</span>;
      case "Accepted":
        return <span className="order-status-pill status-accepted">Accepted</span>;
      case "Converted to Trip":
        return <span className="order-status-pill status-converted">Converted</span>;
      case "Rejected":
        return <span className="order-status-pill status-rejected">Rejected</span>;
      default:
        return <span className="order-status-pill status-accepted">{status}</span>;
    }
  }

  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="orders-register-card" id="orders-register-card">
      {/* Search and Vehicle Filter Bar */}
      <div className="orders-filter-controls-row">
        <div className="orders-search-box-wrapper">
          <span className="material-symbols-outlined orders-search-icon">search</span>
          <input
            type="text"
            className="orders-search-input"
            placeholder="Search by Order ID, partner company, route..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            id="input-orders-search"
          />
          {searchQuery && (
            <button
              type="button"
              className="orders-search-clear-btn"
              onClick={() => onSearchChange("")}
              title="Clear search"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                close
              </span>
            </button>
          )}
        </div>

        <div className="orders-fleet-filter-cluster">
          <div className="orders-fleet-select-wrapper">
            <select
              className="orders-fleet-select"
              value={vehicleFilter}
              onChange={(e) => onVehicleFilterChange(e.target.value)}
              id="select-vehicle-fleet"
            >
              <option value="all">Vehicle: All Fleet</option>
              <option value="Heavy Truck (20T+)">Heavy Truck (20T+)</option>
              <option value="LCV (14ft / 16T)">LCV (14ft / 16T)</option>
              <option value="Container / 32ft MXL">Container / 32ft MXL</option>
            </select>
            <span className="material-symbols-outlined select-chevron-icon">expand_more</span>
          </div>

          <button
            type="button"
            className="orders-tune-btn"
            title="Filter Settings"
            id="btn-filter-settings"
          >
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* High Density Table */}
      <div className="orders-table-wrapper">
        <table className="orders-table" id="orders-master-table">
          <thead>
            <tr>
              <th className="th-checkbox">
                <input
                  type="checkbox"
                  className="orders-table-checkbox"
                  checked={allChecked}
                  ref={(input) => {
                    if (input) input.indeterminate = someChecked;
                  }}
                  onChange={onToggleCheckAll}
                  aria-label="Select all orders"
                />
              </th>
              <th>Order ID</th>
              <th>Company</th>
              <th>Route &amp; Schedule</th>
              <th>Vehicle / Ton</th>
              <th className="text-right">Amount</th>
              <th className="text-center">Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="orders-empty-row">
                  <div className="orders-empty-state">
                    <span className="material-symbols-outlined empty-icon">inbox</span>
                    <p className="empty-title">No orders matching criteria</p>
                    <p className="empty-desc">Try clearing filters or search terms</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isSelected = order.id === selectedOrderId;
                const isChecked = checkedOrderIds.includes(order.id);

                return (
                  <tr
                    key={order.id}
                    className={`${isSelected ? "row-selected" : ""}`}
                    onClick={() => onSelectOrder(order.id)}
                    id={`order-row-${order.id}`}
                  >
                    <td
                      className="td-checkbox"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <input
                        type="checkbox"
                        className="orders-table-checkbox"
                        checked={isChecked}
                        onChange={() => onToggleCheckOrder(order.id)}
                        aria-label={`Select order ${order.id}`}
                      />
                    </td>

                    <td>
                      <div className="order-id-cluster">
                        {isSelected && <span className="order-active-pulse-dot" />}
                        <span
                          className={`order-id-text ${
                            isSelected ? "order-id-highlight" : ""
                          }`}
                        >
                          #{order.id}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="order-company-cluster">
                        <span className="order-company-primary">
                          {order.companyShort || order.company}
                        </span>
                        <span className="order-account-type-sub">
                          {order.accountType || order.accountCategory}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="order-route-cluster">
                        <div className="order-route-locations">
                          <span>{order.route?.origin}</span>
                          <span
                            className={`material-symbols-outlined order-route-arrow ${
                              isSelected ? "arrow-active" : ""
                            }`}
                          >
                            arrow_forward
                          </span>
                          <span>{order.route?.destination}</span>
                        </div>
                        <span className="order-schedule-sub">
                          {order.route?.pickupSchedule || order.createdAt}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="order-vehicle-cluster">
                        <span className="order-vehicle-type-txt">
                          {order.vehicle?.type?.split(" (")[0] || order.vehicle?.type}
                        </span>
                        <span className="order-cargo-classification">
                          {order.cargo?.classification || "Commercial"}
                        </span>
                      </div>
                    </td>

                    <td className="text-right">
                      <span className="order-price-bold">
                        {formatINR(order.commercials?.amount)}
                      </span>
                    </td>

                    <td className="text-center">
                      {getStatusBadge(order.status)}
                    </td>

                    <td
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="order-row-action-cluster">
                        <button
                          type="button"
                          className="order-btn-icon-action btn-view-inspect"
                          onClick={() => onSelectOrder(order.id)}
                          title="Inspect Order Details"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>

                        {order.status === "Pending Review" && (
                          <button
                            type="button"
                            className="order-btn-icon-action btn-accept-action"
                            onClick={() => onAcceptOrder(order)}
                            title="Accept & Dispatch Trip"
                          >
                            <span className="material-symbols-outlined">local_shipping</span>
                          </button>
                        )}

                        {order.status === "Accepted" && (
                          <button
                            type="button"
                            className="order-btn-icon-action btn-accept-action"
                            onClick={() => onAcceptOrder(order)}
                            title="Assign Driver & Convert to Trip"
                          >
                            <span className="material-symbols-outlined">local_shipping</span>
                          </button>
                        )}

                        {order.status === "Converted to Trip" && (
                          <button
                            type="button"
                            className="order-btn-icon-action btn-trip-link"
                            onClick={() => onViewTrip?.(order.convertedTripId || order.id)}
                            title="Open Connected B2B Trip"
                          >
                            <span className="material-symbols-outlined">open_in_new</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="order-btn-icon-action btn-more-menu"
                          onClick={() => onRejectOrder(order)}
                          title="Order Options"
                        >
                          <span className="material-symbols-outlined">more_vert</span>
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

      {/* Pagination Footer */}
      <div className="orders-pagination-row">
        <span className="orders-pagination-info">
          Showing <span className="font-semibold">{startRecord} - {endRecord}</span> of{" "}
          <span className="font-semibold">{totalCount}</span> orders
        </span>

        <div className="orders-pagination-controls">
          <button
            type="button"
            className="orders-page-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            title="Previous Page"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNo) => (
            <button
              key={pageNo}
              type="button"
              className={`orders-page-btn ${pageNo === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(pageNo)}
            >
              {pageNo}
            </button>
          ))}

          {totalPages > 5 && <span className="orders-page-ellipsis">...</span>}

          {totalPages > 5 && (
            <button
              type="button"
              className={`orders-page-btn ${totalPages === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          )}

          <button
            type="button"
            className="orders-page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            title="Next Page"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

OrdersRegisterTable.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedOrderId: PropTypes.string,
  onSelectOrder: PropTypes.func.isRequired,
  checkedOrderIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleCheckOrder: PropTypes.func.isRequired,
  onToggleCheckAll: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  vehicleFilter: PropTypes.string.isRequired,
  onVehicleFilterChange: PropTypes.func.isRequired,
  onAcceptOrder: PropTypes.func.isRequired,
  onRejectOrder: PropTypes.func.isRequired,
  onViewTrip: PropTypes.func,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
