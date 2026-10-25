import PropTypes from "prop-types";

function DetailModal({ isOpen, onClose, data, type }) {
  if (!isOpen || !data) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="detail-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="detail-modal-header">
          <div className="modal-title-group">
            <span className="modal-type-tag">{type?.toUpperCase() || "RECORD"}</span>
            <h3 className="modal-title">{data.title || data.id || "Operational Record"}</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="detail-modal-body">
          {type === "activity" && (
            <div className="activity-detail-view">
              <div className="detail-badge-line">
                <span className={`activity-badge badge-${data.severity || "info"}`}>
                  {data.badge || "Live Update"}
                </span>
                <span className="detail-time-text">{data.timestamp}</span>
              </div>
              <p className="detail-full-description">{data.description}</p>
              {data.entityCode && (
                <div className="detail-entity-card">
                  <span className="entity-label">Associated Entity Reference</span>
                  <strong className="entity-code">{data.entityCode}</strong>
                </div>
              )}
            </div>
          )}

          {type === "trip" && (
            <div className="trip-detail-view">
              <div className="detail-meta-grid">
                <div className="meta-block">
                  <span className="meta-label">Route</span>
                  <strong className="meta-val">{data.route}</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Distance</span>
                  <strong className="meta-val">{data.distance}</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Client Partner</span>
                  <strong className="meta-val">{data.partner}</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Cargo Specification</span>
                  <strong className="meta-val">{data.cargo}</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Assigned Driver</span>
                  <strong className="meta-val">{data.driverName}</strong>
                  <span className="meta-sub">{data.driverPhone}</span>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Vehicle</span>
                  <strong className="meta-val">{data.vehicleNo}</strong>
                  <span className="meta-sub">{data.vehicleType}</span>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Live Progress</span>
                  <strong className="meta-val text-blue">{data.progressPct}% Completed</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Estimated Arrival</span>
                  <strong className="meta-val text-green">{data.eta}</strong>
                </div>
              </div>
            </div>
          )}

          {type === "order" && (
            <div className="order-detail-view">
              <div className="detail-meta-grid">
                <div className="meta-block">
                  <span className="meta-label">Order Code</span>
                  <strong className="meta-val">{data.id}</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Client Company</span>
                  <strong className="meta-val">{data.partner}</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Route</span>
                  <strong className="meta-val">{data.route}</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Weight &amp; Vehicle</span>
                  <strong className="meta-val">{data.weight} ({data.vehicleType})</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Agreed Commercial Quote</span>
                  <strong className="meta-val text-purple">{data.quoteAmount}</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Requested Loading Time</span>
                  <strong className="meta-val">{data.requestedPickup}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="detail-modal-footer">
          <button type="button" className="action-btn secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

DetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
  type: PropTypes.string,
};

export default DetailModal;
