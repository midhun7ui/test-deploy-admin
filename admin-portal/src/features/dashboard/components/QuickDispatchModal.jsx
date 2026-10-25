import { useState } from "react";
import PropTypes from "prop-types";

const ENTERPRISE_CLIENTS = [
  { id: "c1", name: "Apex Freight Logistics Ltd", defaultRate: "48,000" },
  { id: "c2", name: "Blue Dart Surface Express", defaultRate: "42,000" },
  { id: "c3", name: "Reliance Retail Logistics Ltd", defaultRate: "52,000" },
  { id: "c4", name: "Western Dedicated Fleet Operators", defaultRate: "65,000" },
  { id: "c5", name: "Sharma Heavy Haulage Fleet", defaultRate: "70,000" },
];

const CORRIDORS = [
  { id: "corr-1", label: "Pune Logistics Hub → Ahmedabad Inland Depot (NH-48)", origin: "Pune", dest: "Ahmedabad", dist: "524 km" },
  { id: "corr-2", label: "Alappuzha Terminal → Ernakulam Container Hub (NH-544)", origin: "Alappuzha", dest: "Ernakulam", dist: "68 km" },
  { id: "corr-3", label: "Kottayam Freight Yard → Idukki Plant (NH-183)", origin: "Kottayam", dest: "Idukki", dist: "110 km" },
  { id: "corr-4", label: "Bengaluru Peenya → Chennai Ennore Freight Corridor (NH-48)", origin: "Bengaluru", dest: "Chennai", dist: "348 km" },
  { id: "corr-5", label: "Mumbai Port Terminal → Surat Logistics Hub (NH-48)", origin: "Mumbai", dest: "Surat", dist: "280 km" },
];

const DRIVERS = [
  { id: "5", name: "abhi", vehicle: "MH-12-AB-1185", rating: "4.9 ★", phone: "9846386442", category: "20T Multi-Axle", avatar: "/media/driver/profiles/DRV-002/driver_abhi.jpg" },
  { id: "3", name: "Mohanan", vehicle: "MH-12-AB-1111", rating: "5.0 ★", phone: "+91 98460 12345", category: "24T Multi-Axle", avatar: "/media/driver/profiles/DRV-001/driver_mohanan.jpg" },
];

export default function QuickDispatchModal({ isOpen, onClose, onDispatchSuccess }) {
  const [clientId, setClientId] = useState(ENTERPRISE_CLIENTS[0].id);
  const [corridorId, setCorridorId] = useState(CORRIDORS[0].id);
  const [driverId, setDriverId] = useState(DRIVERS[0].id);
  const [vehicleType, setVehicleType] = useState("20T Multi-Axle");
  const [priority, setPriority] = useState("Standard");
  const [rate, setRate] = useState("42000");
  const [cargoDetails, setCargoDetails] = useState("Automotive Assemblies & Castings (18.5T)");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectedClient = ENTERPRISE_CLIENTS.find((c) => c.id === clientId) || ENTERPRISE_CLIENTS[0];
  const selectedCorridor = CORRIDORS.find((c) => c.id === corridorId) || CORRIDORS[0];
  const selectedDriver = DRIVERS.find((d) => d.id === driverId) || DRIVERS[0];

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedTripId = `TRP-${Math.floor(10000 + Math.random() * 90000)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      onDispatchSuccess?.({
        tripId: generatedTripId,
        client: selectedClient.name,
        corridor: selectedCorridor.label,
        driver: selectedDriver.name,
        vehicle: selectedDriver.vehicle,
        rate,
        priority,
      });
      onClose();
    }, 400);
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="quick-dispatch-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "680px",
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
                local_shipping
              </span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>Quick Corridor Dispatch</h3>
                <span
                  style={{
                    background: "rgba(79, 70, 229, 0.4)",
                    border: "1px solid rgba(165, 180, 252, 0.3)",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "20px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Live Roster
                </span>
              </div>
              <p style={{ margin: "2px 0 0", fontSize: "0.8125rem", color: "#c7d2fe" }}>
                Allocate verified standby driver &amp; dispatch trip telemetry immediately
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: "auto", padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Row 1: Enterprise Client & Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Enterprise Client Account
              </label>
              <select
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  const cl = ENTERPRISE_CLIENTS.find((c) => c.id === e.target.value);
                  if (cl) setRate(cl.defaultRate.replace(/,/g, ""));
                }}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                {ENTERPRISE_CLIENTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                SLA Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                <option value="Standard">Standard Corridor (±30m SLA)</option>
                <option value="Expedited">Expedited Express (Priority)</option>
                <option value="Critical">Critical High SLA (Penalty Safe)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Freight Corridor Selection */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Active Freight Corridor &amp; Route
            </label>
            <select
              value={corridorId}
              onChange={(e) => setCorridorId(e.target.value)}
              style={{
                width: "100%",
                padding: "0.625rem 0.75rem",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "0.875rem",
                background: "#f8fafc",
                color: "#0f172a",
                fontWeight: 600,
                outline: "none",
              }}
            >
              {CORRIDORS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} ({c.dist})
                </option>
              ))}
            </select>
          </div>

          {/* Row 3: Available Standby Driver & Vehicle Type */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Verified Standby Driver Assignment
              </label>
              <select
                value={driverId}
                onChange={(e) => {
                  setDriverId(e.target.value);
                  const d = DRIVERS.find((drv) => drv.id === e.target.value);
                  if (d) setVehicleType(d.category);
                }}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} • {d.vehicle} ({d.rating})
                  </option>
                ))}
              </select>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px", fontSize: "0.75rem", color: "#16a34a", fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span>
                <span>Active Commercial Permit &amp; KYC Approved</span>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Vehicle Classification
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                <option value="20T Multi-Axle">20T Multi-Axle Container</option>
                <option value="32T Heavy Commercial">32T Heavy Trailer</option>
                <option value="14T Medium LCV">14T Medium LCV</option>
                <option value="16T Reefer / Cold Box">16T Reefer / Cold Chain</option>
              </select>
            </div>
          </div>

          {/* Row 4: Cargo Details & Rate */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Cargo Description &amp; Payload Weight
              </label>
              <input
                type="text"
                value={cargoDetails}
                onChange={(e) => setCargoDetails(e.target.value)}
                placeholder="e.g. 500 Bags OPC Cement • 22.5T"
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontWeight: 500,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Agreed Freight Fare (₹)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontWeight: 700 }}>
                  ₹
                </span>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.75rem 0.625rem 1.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    background: "#f8fafc",
                    color: "#0f172a",
                    fontWeight: 700,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Row 5: Operations Notes */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Dispatcher Notes / Loading Bay Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Expedited dock clearance at Gate 2. Driver notified via HireD Driver App."
              style={{
                width: "100%",
                padding: "0.625rem 0.75rem",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "0.8125rem",
                background: "#f8fafc",
                color: "#0f172a",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "12px",
              paddingTop: "1rem",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.625rem 1.5rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                color: "#ffffff",
                fontSize: "0.875rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                send
              </span>
              <span>{isSubmitting ? "Dispatching Route..." : "Confirm & Dispatch Load"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

QuickDispatchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDispatchSuccess: PropTypes.func,
};
