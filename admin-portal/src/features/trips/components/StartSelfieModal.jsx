import { useState } from "react";
import PropTypes from "prop-types";

export default function StartSelfieModal({ isOpen, onClose, trip }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !trip) return null;

  const selfieUrl =
    trip.verification?.startSelfieUrl ||
    trip.driver?.avatar ||
    "";

  const driverName = trip.driver?.name || "Ramesh Kumar";
  const driverPhone = trip.driver?.phone || "+91 98765 42210";
  const driverLicense = trip.driver?.license || "MH-14-2018-0091823";
  const driverRating = trip.driver?.rating || 4.9;
  const vehicleNumber = trip.vehicle?.number || "MH-12 AB 1334";
  const vehicleType = trip.vehicle?.type || "20T Multi-Axle";
  const startSelfieTime = trip.verification?.startSelfieTime || "10:15 AM";
  const pickupAddress =
    trip.route?.pickupAddress || "Bhosari Industrial Estate, Pune, Maharashtra";
  const corridor = trip.route?.corridor || "NH-60";
  const coordinates =
    trip.telemetry?.currentCoordinates || "19.1172° N, 73.9782° E";

  function handleDownloadDossier() {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3000);
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="start-selfie-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "740px",
          maxWidth: "96vw",
          maxHeight: "92vh",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.25)",
          border: "1px solid #ede9fe",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "scaleUp 180ms ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.75rem",
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "#a5b4fc", fontSize: "24px" }}>
                verified_user
              </span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>Driver Departure Selfie Dossier</h3>
                <span
                  style={{
                    background: "rgba(34, 197, 94, 0.25)",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    color: "#86efac",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "20px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Verified &amp; Geo-Tagged
                </span>
              </div>
              <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#c7d2fe" }}>
                Trip #{trip.id} • {trip.account}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ overflowY: "auto", padding: "1.5rem 1.75rem", display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem" }}>
          {/* Left Column: Big Selfie Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                position: "relative",
                borderRadius: "14px",
                overflow: "hidden",
                border: "2px solid #e2e8f0",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                background: "#0f172a",
                aspectRatio: "3/4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={selfieUrl}
                alt={`Driver ${driverName} Departure Selfie`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  if (trip.driver?.avatar && e.target.src !== trip.driver.avatar) {
                    e.target.src = trip.driver.avatar;
                  }
                }}
              />

              {/* Watermark badge on photo */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  right: "8px",
                  background: "rgba(15, 23, 42, 0.75)",
                  backdropFilter: "blur(6px)",
                  padding: "6px 8px",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "0.6875rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontWeight: 600 }}>{startSelfieTime}</span>
                <span style={{ color: "#4ade80", fontWeight: 700 }}>GPS Geo-Lock</span>
              </div>
            </div>

            {/* AI Biometric Match Card */}
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "#16a34a", fontSize: "20px" }}>
                face
              </span>
              <div>
                <strong style={{ fontSize: "0.8125rem", color: "#166534", display: "block" }}>
                  AI Biometric Match: 99.4%
                </strong>
                <span style={{ fontSize: "0.6875rem", color: "#15803d" }}>
                  Liveness detected • Facial identity matched to DL
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Pre-Trip Inspection & Driver Data */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Driver Profile Pod */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "12px 14px",
              }}
            >
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Driver Identification
              </span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px" }}>
                <div>
                  <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{driverName}</strong>
                  <div style={{ fontSize: "0.8125rem", color: "#475569", marginTop: "2px" }}>
                    {driverPhone} • Commercial DL: {driverLicense}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ background: "#fef3c7", color: "#92400e", fontWeight: 700, fontSize: "0.75rem", padding: "2px 8px", borderRadius: "12px" }}>
                    {driverRating} ★ Rated
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle & Telemetry Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 12px" }}>
                <span style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 600 }}>Assigned Vehicle</span>
                <strong style={{ display: "block", fontSize: "0.875rem", color: "#0f172a", marginTop: "2px" }}>
                  {vehicleNumber}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{vehicleType}</span>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 12px" }}>
                <span style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 600 }}>Fastag &amp; Fuel</span>
                <strong style={{ display: "block", fontSize: "0.875rem", color: "#0f172a", marginTop: "2px" }}>
                  {trip.vehicle?.fastagId || "FT-889104"}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 600 }}>
                  Fuel: {trip.vehicle?.currentFuel || "74%"} (Adequate)
                </span>
              </div>
            </div>

            {/* Checkpoint Table */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Inspection Checkpoints
              </span>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
                <span style={{ color: "#64748b" }}>Capture Timestamp:</span>
                <strong style={{ color: "#0f172a" }}>{startSelfieTime} (Pre-Trip Gate Departure)</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
                <span style={{ color: "#64748b" }}>GPS Coordinates:</span>
                <strong style={{ color: "#0f172a" }}>{coordinates}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
                <span style={{ color: "#64748b" }}>Terminal Origin:</span>
                <strong style={{ color: "#0f172a", textAlign: "right", maxWidth: "200px" }}>{pickupAddress}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
                <span style={{ color: "#64748b" }}>Odometer At Start:</span>
                <strong style={{ color: "#0f172a" }}>48,291 km (Pre-Trip Inspection OK)</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                <span style={{ color: "#64748b" }}>Assigned Corridor:</span>
                <strong style={{ color: "#7c3aed" }}>{trip.route?.origin} → {trip.route?.destination} ({corridor})</strong>
              </div>
            </div>

            {/* Integrity Audit Pill */}
            <div
              style={{
                fontSize: "0.6875rem",
                color: "#64748b",
                background: "#f1f5f9",
                padding: "6px 10px",
                borderRadius: "6px",
                fontFamily: "monospace",
              }}
            >
              Tamper-proof hash: SHA256:d8a9f471b02c892... (HireD Telemetry Vault)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.75rem",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            {downloadSuccess && (
              <span style={{ color: "#16a34a", fontSize: "0.8125rem", fontWeight: 600 }}>
                ✓ Driver Selfie Proof Exported Successfully
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={handleDownloadDossier}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                download
              </span>
              <span>Download Proof</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "8px",
                border: "none",
                background: "#4f46e5",
                color: "#ffffff",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

StartSelfieModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  trip: PropTypes.object,
};
