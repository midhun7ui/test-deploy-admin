import PropTypes from "prop-types";

function PendingOrdersQueue({
  orders,
  onAcceptOrder,
  onRejectOrder,
  onViewAllOrders,
}) {
  const hasOrders = orders && orders.length > 0;

  return (
    <article className="dashboard-card pending-orders-card" id="card-pending-orders">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon-pill icon-amber">
            <span className="material-symbols-outlined">assignment_late</span>
          </div>
          <div>
            <h3 className="card-title">Pending Orders &amp; Review Queue</h3>
            <p className="card-subtitle">
              Commercial review required before driver assignment &amp; corridor dispatch
            </p>
          </div>
        </div>

        <div className="card-header-actions">
          <button
            type="button"
            className="action-btn secondary-btn"
            id="btn-view-all-orders"
            onClick={onViewAllOrders}
          >
            <span>All Orders ({orders ? orders.length : 0})</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

      {!hasOrders ? (
        <div className="orders-empty-state" style={{ padding: "2.5rem 1rem", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: "#f59e0b", display: "block", marginBottom: "0.5rem" }}>
            check_circle
          </span>
          <h4 style={{ margin: "0 0 0.25rem 0", color: "#1e293b", fontWeight: 600 }}>Review Queue Cleared</h4>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#64748b" }}>
            No pending commercial orders requiring review. All corridors are currently dispatched or pending new requests.
          </p>
        </div>
      ) : (
        <div className="orders-queue-list">
          {orders.map((order) => (
            <div key={order.id} className="order-queue-row">
              {/* Left: Code, Urgency & Route */}
              <div className="order-main-info">
                <div className="order-top-row">
                  <strong className="order-code">{order.id}</strong>
                  <span
                    className={`urgency-tag ${
                      order.urgency === "High" ? "urgency-high" : "urgency-med"
                    }`}
                  >
                    {order.urgency} Urgency
                  </span>
                  <span className="order-partner">{order.partner}</span>
                </div>

                <div className="order-sub-route">
                  <span className="material-symbols-outlined route-pin-icon">location_on</span>
                  <span className="route-name">{order.route}</span>
                  <span className="route-bullet">·</span>
                  <span className="cargo-spec">
                    {order.weight} · {order.vehicleType}
                  </span>
                </div>
              </div>

              {/* Center: Quote & Scheduled Pickup */}
              <div className="order-commercial-info">
                <div className="quote-box">
                  <span className="quote-label">Agreed Quote</span>
                  <strong className="quote-value">{order.quoteAmount}</strong>
                </div>
                <div className="pickup-box">
                  <span className="pickup-label">Requested Pickup</span>
                  <span className="pickup-val">{order.requestedPickup}</span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="order-action-buttons">
                <button
                  type="button"
                  className="action-btn success-btn small-btn"
                  id={`btn-accept-${order.id}`}
                  onClick={() => onAcceptOrder?.(order)}
                  title="Accept order and create active trip"
                >
                  <span className="material-symbols-outlined">check</span>
                  <span>Accept</span>
                </button>

                <button
                  type="button"
                  className="action-btn danger-btn small-btn"
                  id={`btn-reject-${order.id}`}
                  onClick={() => onRejectOrder?.(order)}
                  title="Reject order quote"
                >
                  <span className="material-symbols-outlined">close</span>
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

PendingOrdersQueue.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object),
  onAcceptOrder: PropTypes.func.isRequired,
  onRejectOrder: PropTypes.func.isRequired,
  onViewAllOrders: PropTypes.func,
};

export default PendingOrdersQueue;
