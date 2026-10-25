import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AVAILABLE_DRIVERS_POOL } from "../data/mockTripsData";
import { tripsApi } from "../services/tripsApi";

function AssignDriverModal({ isOpen, onClose, trip, onAssignDriverConfirm }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      setLoadingDrivers(true);
      tripsApi
        .getDriversPool()
        .then((data) => {
          if (isMounted && Array.isArray(data)) {
            setDrivers(data);
            setSelectedDriverId(data[0]?.id || null);
          }
        })
        .catch(() => {
          if (isMounted) {
            setDrivers([]);
            setSelectedDriverId(null);
          }
        })
        .finally(() => {
          if (isMounted) setLoadingDrivers(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  if (!isOpen || !trip) return null;

  function handleConfirm() {
    const chosen = drivers.find((d) => d.id === selectedDriverId);
    if (!chosen) return;
    onAssignDriverConfirm(trip.id, chosen);
    onClose();
  }

  return (
    <div className="trip-modal-backdrop" onClick={onClose}>
      <div className="trip-assign-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="trip-assign-header">
          <div className="trip-assign-header-left">
            <span className="material-symbols-outlined trip-assign-icon">person_add</span>
            <div>
              <h2 className="trip-assign-title">Assign Driver to #{trip.id}</h2>
              <p className="trip-assign-sub">
                {trip.account} • {trip.route?.origin} → {trip.route?.destination}
              </p>
            </div>
          </div>
          <button type="button" className="trip-modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="trip-assign-body">
          <div className="trip-assign-warning-banner">
            <span className="material-symbols-outlined text-error text-[18px]">warning</span>
            <span>Immediate dispatch required. Nearby verified drivers with active commercial permits:</span>
          </div>

          {loadingDrivers && (
            <div className="py-4 text-center text-body-sm text-on-surface-variant flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              <span>Loading verified driver dispatch roster...</span>
            </div>
          )}

          {!loadingDrivers && drivers.length === 0 ? (
            <div className="py-8 px-4 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-outline-variant rounded-lg bg-surface-container-lowest my-2">
              <span className="material-symbols-outlined text-[32px] text-amber-500">wifi_off</span>
              <p className="font-medium text-body-md text-on-surface">No Online Drivers Available</p>
              <p className="text-body-xs text-on-surface-variant max-w-sm">
                Only drivers who are currently ONLINE in their mobile driver app are eligible for trip dispatch. Drivers can toggle their status to Online in their app.
              </p>
            </div>
          ) : (
            <div className="trip-assign-driver-list">
              {drivers.map((driver) => {
                const isSelected = selectedDriverId === driver.id;
                return (
                  <div
                    key={driver.id}
                    className={`trip-assign-driver-card ${isSelected ? "driver-card-selected" : ""}`}
                    onClick={() => setSelectedDriverId(driver.id)}
                  >
                    <div className="trip-assign-driver-left">
                      <input
                        type="radio"
                        name="driverSelection"
                        checked={isSelected}
                        onChange={() => setSelectedDriverId(driver.id)}
                        className="trip-assign-radio"
                      />
                      <div className="trip-assign-driver-details">
                        <div className="trip-assign-driver-name-row">
                          <span className="trip-assign-driver-name">{driver.name}</span>
                          <span className="trip-driver-rating-badge">{driver.rating || 5.0} ★</span>
                        </div>
                        <div className="trip-assign-driver-vehicle">
                          {driver.vehicleNumber || "Unassigned"} • {driver.vehicleType || "20T Multi-Axle"}
                        </div>
                        <div className="trip-assign-driver-location">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          <span>{driver.currentLocation || "Regional Freight Depot"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="trip-assign-driver-right">
                      <span className="trip-assign-eta-badge">{driver.etaMinutes || 15} mins ETA</span>
                      <span className="trip-assign-ready-badge">Ready to Dispatch</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="trip-create-actions">
            <button type="button" className="trip-btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="trip-btn-modal-submit"
              onClick={handleConfirm}
              disabled={!selectedDriverId || drivers.length === 0}
              style={{
                opacity: !selectedDriverId || drivers.length === 0 ? 0.5 : 1,
                cursor: !selectedDriverId || drivers.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Confirm &amp; Dispatch Driver</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

AssignDriverModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  trip: PropTypes.object,
  onAssignDriverConfirm: PropTypes.func.isRequired,
};

export default AssignDriverModal;
