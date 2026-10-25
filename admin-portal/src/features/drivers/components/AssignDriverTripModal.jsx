import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Assign Trip Modal
 * Allocates an available freight corridor trip to the selected driver
 */
export default function AssignDriverTripModal({
  isOpen,
  driver,
  onClose,
  onConfirmAssign,
  trips = [],
}) {
  const [selectedTripId, setSelectedTripId] = useState("");
  const [departureSlot, setDepartureSlot] = useState("Within 45 mins (Immediate)");

  useEffect(() => {
    if (trips && trips.length > 0) {
      setSelectedTripId((prev) => (trips.some((t) => t.id === prev) ? prev : trips[0].id));
    } else {
      setSelectedTripId("");
    }
  }, [trips]);

  if (!isOpen || !driver) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedTripId) return;

    const chosenTrip = trips.find((t) => t.id === selectedTripId);
    if (!chosenTrip) return;

    onConfirmAssign({
      driverId: driver.id,
      trip: chosenTrip,
      departureSlot,
    });
  }

  const hasTrips = trips && trips.length > 0;

  return (
    <div className="driver-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="driver-modal-card"
        style={{ maxWidth: "600px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="driver-modal-header">
          <div className="driver-modal-header-left">
            <div className="driver-modal-icon-pod">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <div>
              <h3 className="driver-modal-title">Assign Corridor Freight Trip</h3>
              <p className="driver-modal-subtitle">
                Driver: {driver.name} • {driver.vehicle?.number} ({driver.vehicle?.type})
              </p>
            </div>
          </div>
          <button
            type="button"
            className="driver-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="driver-modal-body">
            <div className="driver-form-group">
              <label className="driver-form-label" htmlFor="select-trip-to-assign">
                Select Available Corridor Trip <span className="req">*</span>
              </label>

              {!hasTrips ? (
                <div
                  style={{
                    padding: "2rem 1.5rem",
                    textAlign: "center",
                    backgroundColor: "var(--driver-surface-low)",
                    borderRadius: "8px",
                    border: "1px dashed var(--driver-surface-high)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "32px", color: "var(--driver-text-outline)", marginBottom: "0.5rem" }}
                  >
                    route
                  </span>
                  <p style={{ margin: "0 0 0.25rem", fontWeight: "700", fontSize: "0.875rem", color: "var(--driver-text-main)" }}>
                    No Unassigned Trips Available
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--driver-text-muted)" }}>
                    Accept transport orders in Orders Management or create new corridor trips to dispatch drivers.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {trips.map((trip) => {
                    const isPicked = selectedTripId === trip.id;

                    return (
                      <label
                        key={trip.id}
                        htmlFor={`opt-trip-${trip.id}`}
                        style={{
                          padding: "0.85rem 1rem",
                          borderRadius: "8px",
                          backgroundColor: isPicked ? "#f7f6ff" : "var(--driver-surface-low)",
                          border: `1.5px solid ${isPicked ? "var(--driver-primary-container)" : "var(--driver-surface-high)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <input
                            type="radio"
                            name="tripRadio"
                            id={`opt-trip-${trip.id}`}
                            value={trip.id}
                            checked={isPicked}
                            onChange={() => setSelectedTripId(trip.id)}
                            style={{ accentColor: "var(--driver-primary-container)" }}
                          />
                          <div>
                            <strong style={{ fontSize: "0.8125rem", color: "var(--driver-text-main)" }}>
                              {trip.origin} → {trip.destination}
                            </strong>
                            <div style={{ fontSize: "0.7rem", color: "var(--driver-text-muted)" }}>
                              #{trip.id} • {trip.cargo} • {trip.distanceKm} km
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <strong style={{ fontSize: "0.875rem", color: "var(--driver-primary)" }}>
                            ₹{trip.freightAmount.toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {hasTrips && (
              <div className="driver-form-group">
                <label className="driver-form-label" htmlFor="select-departure-window">
                  Required Departure Window
                </label>
                <select
                  className="driver-form-input"
                  id="select-departure-window"
                  value={departureSlot}
                  onChange={(e) => setDepartureSlot(e.target.value)}
                >
                  <option value="Within 45 mins (Immediate)">Within 45 mins (Immediate Dispatch)</option>
                  <option value="Today Evening (18:00 - 20:00)">Today Evening (18:00 - 20:00)</option>
                  <option value="Tomorrow Early Morning (06:00)">Tomorrow Early Morning (06:00)</option>
                </select>
              </div>
            )}
          </div>

          <div className="driver-modal-footer">
            <button
              type="button"
              className="driver-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="driver-btn-primary"
              disabled={!hasTrips || !selectedTripId}
              id="btn-confirm-trip-assignment"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                check
              </span>
              <span>Confirm &amp; Dispatch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AssignDriverTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  driver: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onConfirmAssign: PropTypes.func.isRequired,
  trips: PropTypes.array,
};
