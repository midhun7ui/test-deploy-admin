import { useState } from "react";
import PropTypes from "prop-types";

/**
 * AssignVehicleModal
 * Allows admin to either:
 * 1. Review and 1-click approve/reject the driver's own requested commercial vehicle (with RC doc & photo preview)
 * 2. Manually allocate and assign a company fleet vehicle (if driver has not requested any vehicle, or to override)
 */
export default function AssignVehicleModal({
  isOpen,
  driver,
  onClose,
  onAssignSuccess,
  onPreviewDoc,
}) {
  const [vehicleNumber, setVehicleNumber] = useState(
    driver?.vehicle?.isAssigned && driver?.vehicle?.number !== "None"
      ? driver?.vehicle?.number
      : ""
  );
  const [vehicleType, setVehicleType] = useState(
    driver?.vehicle?.type && driver?.vehicle?.type !== "None"
      ? driver?.vehicle?.type
      : "20T Multi-Axle"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !driver) return null;

  const requestedVehicle = driver.requestedVehicle;
  const hasPendingRequest = Boolean(
    requestedVehicle &&
      (requestedVehicle.hasRequest || requestedVehicle.status === "PENDING") &&
      requestedVehicle.number
  );

  const handleApproveOwnVehicle = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onAssignSuccess({
        driverId: driver.id,
        action: "approve_request",
        vehicleNumber: requestedVehicle.number,
        vehicleType: requestedVehicle.type,
      });
      onClose();
    } catch (err) {
      console.error("Failed to approve driver vehicle:", err);
      setError(err.response?.data?.error || err.message || "Failed to approve driver's vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectOwnVehicle = async () => {
    const reason = prompt(
      "Enter reason for rejecting this vehicle request (driver will be notified):",
      "Vehicle RC documentation or registration could not be verified."
    );
    if (!reason || !reason.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onAssignSuccess({
        driverId: driver.id,
        action: "reject_request",
        reason: reason.trim(),
      });
      onClose();
    } catch (err) {
      console.error("Failed to reject driver vehicle:", err);
      setError(err.response?.data?.error || err.message || "Failed to reject vehicle request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignFleetVehicle = async (e) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      setError("Please provide a valid vehicle license plate number.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onAssignSuccess({
        driverId: driver.id,
        action: "assign_fleet",
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        vehicleType: vehicleType.trim(),
      });
      onClose();
    } catch (err) {
      console.error("Failed to assign fleet vehicle:", err);
      setError(err.response?.data?.error || err.message || "Failed to assign vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewRequestedDoc = (docType, url, title) => {
    if (!url) return;
    if (onPreviewDoc) {
      onPreviewDoc(
        {
          id: `req-${docType}`,
          name: title,
          title: title,
          file_url: url,
          fileUrl: url,
          raw_file_url: url,
          hasViewLink: true,
          status: "Pending Review",
        },
        driver
      );
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="driver-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id="modal-assign-vehicle"
    >
      <div
        className="driver-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "580px", width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div className="driver-modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--driver-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(81, 69, 245, 0.12)",
                color: "var(--driver-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
                local_shipping
              </span>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: "700", color: "var(--driver-text)" }}>
                Assign Commercial Vehicle
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "var(--driver-text-muted)" }}>
                Driver: <strong style={{ color: "var(--driver-text)" }}>{driver.name}</strong> ({driver.id}) • {driver.phone}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="driver-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--driver-text-outline)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
          </button>
        </div>

        <div className="driver-modal-body" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", overflowY: "auto" }}>
          {error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "8px",
                color: "#ef4444",
                fontSize: "0.8125rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* DRIVER OWN-VEHICLE REQUEST REVIEW SECTION */}
          {hasPendingRequest && (
            <div
              style={{
                background: "linear-gradient(180deg, rgba(81, 69, 245, 0.06) 0%, rgba(81, 69, 245, 0.02) 100%)",
                border: "1.5px solid rgba(81, 69, 245, 0.25)",
                borderRadius: "12px",
                padding: "1.15rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span className="material-symbols-outlined" style={{ color: "var(--driver-primary)", fontSize: "18px" }}>
                    stars
                  </span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: "700", color: "var(--driver-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Driver Requested Own Vehicle
                  </span>
                </div>
                <span
                  style={{
                    padding: "0.2rem 0.55rem",
                    borderRadius: "12px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#b45309",
                    fontSize: "0.6875rem",
                    fontWeight: "700",
                  }}
                >
                  Pending Admin Approval
                </span>
              </div>

              {/* Vehicle Specs Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  background: "var(--driver-card-bg, #ffffff)",
                  padding: "0.875rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid var(--driver-border)",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--driver-text-muted)", textTransform: "uppercase" }}>
                    Vehicle Plate / Reg No.
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: "800", color: "var(--driver-primary)", letterSpacing: "0.03em" }}>
                    {requestedVehicle.number}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--driver-text-muted)", textTransform: "uppercase" }}>
                    Classification / Type
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--driver-text)" }}>
                    {requestedVehicle.type}
                  </div>
                </div>

                {requestedVehicle.model && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: "0.6875rem", color: "var(--driver-text-muted)", textTransform: "uppercase" }}>
                      Make &amp; Commercial Model
                    </div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: "500", color: "var(--driver-text)" }}>
                      {requestedVehicle.model}
                    </div>
                  </div>
                )}
              </div>

              {/* Document Previews */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {requestedVehicle.rcUrl ? (
                  <button
                    type="button"
                    onClick={() => handlePreviewRequestedDoc("rc", requestedVehicle.rcUrl, `Registration Certificate (RC) - ${requestedVehicle.number}`)}
                    style={{
                      flex: 1,
                      minWidth: "180px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      background: "#ffffff",
                      border: "1px solid var(--driver-border)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      color: "var(--driver-text)",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--driver-primary)" }}>
                      description
                    </span>
                    <div style={{ textAlign: "left", flex: 1, overflow: "hidden" }}>
                      <div style={{ fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        View RC Document
                      </div>
                      <div style={{ fontSize: "0.6875rem", color: "var(--driver-text-muted)" }}>Click to inspect</div>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--driver-text-outline)" }}>
                      visibility
                    </span>
                  </button>
                ) : (
                  <div style={{ fontSize: "0.75rem", color: "var(--driver-text-muted)", fontStyle: "italic" }}>
                    No RC document attached
                  </div>
                )}

                {requestedVehicle.photoUrl && (
                  <button
                    type="button"
                    onClick={() => handlePreviewRequestedDoc("photo", requestedVehicle.photoUrl, `Vehicle Photo - ${requestedVehicle.number}`)}
                    style={{
                      flex: 1,
                      minWidth: "180px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      background: "#ffffff",
                      border: "1px solid var(--driver-border)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      color: "var(--driver-text)",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#10b981" }}>
                      photo_camera
                    </span>
                    <div style={{ textAlign: "left", flex: 1, overflow: "hidden" }}>
                      <div style={{ fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        View Vehicle Photo
                      </div>
                      <div style={{ fontSize: "0.6875rem", color: "var(--driver-text-muted)" }}>Exterior verification</div>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--driver-text-outline)" }}>
                      visibility
                    </span>
                  </button>
                )}
              </div>

              {/* 1-Click Action Buttons for Driver's Request */}
              <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.25rem" }}>
                <button
                  type="button"
                  onClick={handleApproveOwnVehicle}
                  disabled={isSubmitting}
                  style={{
                    flex: 2,
                    height: "2.5rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    fontSize: "0.8125rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    boxShadow: "0 2px 6px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>{isSubmitting ? "Approving..." : "Approve & Assign Requested Vehicle"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRejectOwnVehicle}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    height: "2.5rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    background: "rgba(239, 68, 68, 0.06)",
                    color: "#ef4444",
                    fontSize: "0.8125rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.3rem",
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  <span>Reject</span>
                </button>
              </div>
            </div>
          )}

          {/* DIVIDER IF DRIVER HAS REQUEST */}
          {hasPendingRequest && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.25rem 0" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--driver-border)" }} />
              <span style={{ fontSize: "0.6875rem", fontWeight: "700", color: "var(--driver-text-outline)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Or Assign Different Fleet Vehicle
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--driver-border)" }} />
            </div>
          )}

          {/* STANDARD FLEET VEHICLE ALLOCATION FORM */}
          <form onSubmit={handleAssignFleetVehicle} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.8125rem", fontWeight: "600", color: "var(--driver-text)" }} htmlFor="input-vehicle-plate">
                Commercial Vehicle Plate Number <span style={{ color: "var(--driver-primary)" }}>*</span>
              </label>
              <input
                id="input-vehicle-plate"
                type="text"
                placeholder="e.g. MH-12 AB 9942 or KL-07 CD 8821"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                style={{
                  height: "2.5rem",
                  padding: "0 0.85rem",
                  borderRadius: "8px",
                  border: "1.5px solid var(--driver-border)",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  outline: "none",
                }}
                required
              />
              <span style={{ fontSize: "0.72rem", color: "var(--driver-text-muted)" }}>
                Standard fleet vehicle plate number to bind for upcoming logistics corridors.
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.8125rem", fontWeight: "600", color: "var(--driver-text)" }} htmlFor="select-vehicle-type">
                Vehicle Classification &amp; Body Type
              </label>
              <select
                id="select-vehicle-type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={{
                  height: "2.5rem",
                  padding: "0 0.85rem",
                  borderRadius: "8px",
                  border: "1.5px solid var(--driver-border)",
                  fontSize: "0.875rem",
                  outline: "none",
                  backgroundColor: "#ffffff",
                }}
              >
                <option value="20T Multi-Axle">20T Multi-Axle (Standard Heavy Freight)</option>
                <option value="14T Container">14T Container (Closed Body Express)</option>
                <option value="28T Multi-Axle Trailer">28T Multi-Axle Trailer</option>
                <option value="32T Heavy Haulage Trailer">32T Heavy Haulage Trailer</option>
                <option value="10T Open High Tarpaulin">10T Open High Tarpaulin</option>
                <option value="3T Light Commercial Vehicle">3T Light Commercial Vehicle (LCV)</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                style={{
                  height: "2.4rem",
                  padding: "0 1.25rem",
                  borderRadius: "8px",
                  border: "1px solid var(--driver-border)",
                  background: "#ffffff",
                  color: "var(--driver-text-muted)",
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !vehicleNumber.trim()}
                id="btn-confirm-assign-vehicle"
                style={{
                  height: "2.4rem",
                  padding: "0 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--driver-primary)",
                  color: "#ffffff",
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  boxShadow: "0 2px 6px rgba(81, 69, 245, 0.3)",
                }}
              >
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>{isSubmitting ? "Assigning..." : "Assign Fleet Vehicle"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

AssignVehicleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  driver: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onAssignSuccess: PropTypes.func.isRequired,
  onPreviewDoc: PropTypes.func,
};
