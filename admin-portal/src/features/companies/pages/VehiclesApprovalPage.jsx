import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser } from "../../Authentication/authState";
import { logout } from "../../Authentication/authApi";
import AdminSidebar from "../../dashboard/components/AdminSidebar";
import AdminNavbar from "../../dashboard/components/AdminNavbar";
import ToastNotification from "../../dashboard/components/ToastNotification";
import CommandPaletteModal from "../../dashboard/components/CommandPaletteModal";
import vehiclesApi from "../services/vehiclesApi";

export default function VehiclesApprovalPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      clearCurrentUser();
      navigate("/login");
    }
  };

  // Data & Filter states
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceSegment, setSourceSegment] = useState("ALL"); // "ALL" | "DRIVER" | "COMPANY"
  const [activeTab, setActiveTab] = useState("ALL"); // "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Shell states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Modals state
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);
  const [rejectingVehicle, setRejectingVehicle] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [dossierVehicle, setDossierVehicle] = useState(null);
  const [assigningDriver, setAssigningDriver] = useState(null);
  const [assignPlateNumber, setAssignPlateNumber] = useState("");
  const [assignVehicleType, setAssignVehicleType] = useState("20T Multi-Axle");
  const [assignVehicleModel, setAssignVehicleModel] = useState("BharatBenz 4028T Multi-Axle");

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await vehiclesApi.listVehicles({
        source: sourceSegment,
        status: activeTab,
        search: searchQuery,
      });
      if (Array.isArray(data)) {
        setVehicles(data);
      }
    } catch (err) {
      console.error("Failed to load vehicles:", err);
      setToast({
        type: "danger",
        title: "Load Error",
        message: "Could not retrieve registered vehicles.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [sourceSegment, activeTab, searchQuery]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Approve Vehicle (handles both Driver own-vehicle request & Company fleet vehicle)
  const handleApprove = async (vehicle) => {
    const isDriver = vehicle.source === "DRIVER";
    const label = isDriver
      ? `driver ${vehicle.driver_name || vehicle.company_name} (Plate: ${vehicle.registration_number})`
      : `company truck ${vehicle.registration_number} (${vehicle.company_name})`;

    if (!window.confirm(`Approve commercial transport vehicle for ${label}?`)) {
      return;
    }

    setIsProcessing(true);
    try {
      if (isDriver) {
        const driverId = vehicle.driver_id || vehicle.raw_id || vehicle.id;
        await vehiclesApi.reviewDriverVehicle(driverId, "approve");
        setToast({
          type: "success",
          title: "Driver Vehicle Approved",
          message: `Vehicle ${vehicle.registration_number} for ${vehicle.driver_name} is now approved and verified for freight dispatches.`,
        });
      } else {
        await vehiclesApi.reviewVehicle(vehicle.id, "approve");
        setToast({
          type: "success",
          title: "Fleet Vehicle Approved",
          message: `Truck ${vehicle.registration_number} status updated to APPROVED. Partner can now allocate it for orders.`,
        });
      }
      fetchVehicles();
    } catch (err) {
      console.error("Approve vehicle error:", err);
      setToast({
        type: "danger",
        title: "Approval Failed",
        message: err.response?.data?.detail || err.response?.data?.error || "Could not approve vehicle.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm Reject
  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectingVehicle) return;

    const isDriver = rejectingVehicle.source === "DRIVER";
    setIsProcessing(true);
    try {
      if (isDriver) {
        const driverId = rejectingVehicle.driver_id || rejectingVehicle.raw_id || rejectingVehicle.id;
        await vehiclesApi.reviewDriverVehicle(driverId, "reject", rejectionReason);
        setToast({
          type: "info",
          title: "Driver Vehicle Rejected",
          message: `Vehicle request for ${rejectingVehicle.driver_name} marked REJECTED. Reason recorded.`,
        });
      } else {
        await vehiclesApi.reviewVehicle(rejectingVehicle.id, "reject", rejectionReason);
        setToast({
          type: "info",
          title: "Fleet Vehicle Rejected",
          message: `Truck ${rejectingVehicle.registration_number} marked REJECTED.`,
        });
      }
      setRejectingVehicle(null);
      setRejectionReason("");
      fetchVehicles();
    } catch (err) {
      console.error("Reject vehicle error:", err);
      setToast({
        type: "danger",
        title: "Rejection Failed",
        message: err.response?.data?.detail || err.response?.data?.error || "Could not reject vehicle.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Assign/Reassign Plate for Driver
  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!assigningDriver) return;

    if (!assignPlateNumber.trim()) {
      alert("Please provide a valid registration plate number.");
      return;
    }

    setIsProcessing(true);
    try {
      const driverId = assigningDriver.driver_id || assigningDriver.raw_id;
      await vehiclesApi.assignDriverVehicle(driverId, {
        vehicleNumber: assignPlateNumber.trim().toUpperCase(),
        vehicleType: assignVehicleType,
        vehicleModel: assignVehicleModel,
      });
      setToast({
        type: "success",
        title: "Vehicle Assigned Successfully",
        message: `Assigned plate ${assignPlateNumber.toUpperCase()} to ${assigningDriver.driver_name}.`,
      });
      setAssigningDriver(null);
      setAssignPlateNumber("");
      fetchVehicles();
    } catch (err) {
      console.error("Assign vehicle error:", err);
      setToast({
        type: "danger",
        title: "Assignment Failed",
        message: err.response?.data?.error || err.response?.data?.detail || "Could not assign vehicle plate.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Counts based on fetched dataset
  const driverVehiclesCount = vehicles.filter((v) => v.source === "DRIVER").length;
  const companyVehiclesCount = vehicles.filter((v) => v.source === "COMPANY").length;
  const pendingCount = vehicles.filter((v) => v.status === "PENDING").length;
  const approvedCount = vehicles.filter((v) => v.status === "APPROVED").length;
  const rejectedCount = vehicles.filter((v) => v.status === "REJECTED").length;

  return (
    <div className="admin-operations-shell" id="vehicles-page-root">
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activeModule="vehicles"
      />

      {/* Main Container */}
      <div className={`admin-main-viewport ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <AdminNavbar
          user={user}
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        <main style={{ padding: "2rem", maxWidth: "1650px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "1.75rem",
              flexWrap: "wrap",
              gap: "1.25rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                  Vehicle Management &amp; Fleet Approvals
                </h1>
                <span
                  style={{
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "999px",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  Admin Compliance
                </span>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "6px 0 0 0", maxWidth: "750px", lineHeight: 1.5 }}>
                Verify and manage commercial driver vehicles and enterprise partner fleet trucks. Review RC books, fitness permits, and insurance compliance.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={fetchVehicles}
                disabled={isLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  color: "#334155",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <span
                  className={`material-symbols-outlined ${isLoading ? "animate-spin" : ""}`}
                  style={{ fontSize: "18px" }}
                >
                  refresh
                </span>
                Refresh List
              </button>
            </div>
          </div>

          {/* Source Category Segment Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div className="vehicle-segment-bar" id="vehicle-source-segment-switch">
              <button
                type="button"
                className={`vehicle-segment-btn ${sourceSegment === "ALL" ? "active" : ""}`}
                onClick={() => setSourceSegment("ALL")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  grid_view
                </span>
                All Registered Vehicles
                <span className="vehicle-segment-count">{vehicles.length}</span>
              </button>

              <button
                type="button"
                className={`vehicle-segment-btn ${sourceSegment === "DRIVER" ? "active" : ""}`}
                onClick={() => setSourceSegment("DRIVER")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#0d9488" }}>
                  badge
                </span>
                Driver Vehicles &amp; Approvals
                {sourceSegment !== "DRIVER" && driverVehiclesCount > 0 && (
                  <span className="vehicle-segment-count">{driverVehiclesCount}</span>
                )}
              </button>

              <button
                type="button"
                className={`vehicle-segment-btn ${sourceSegment === "COMPANY" ? "active" : ""}`}
                onClick={() => setSourceSegment("COMPANY")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#7c3aed" }}>
                  domain
                </span>
                Enterprise Fleet
                {sourceSegment !== "COMPANY" && companyVehiclesCount > 0 && (
                  <span className="vehicle-segment-count">{companyVehiclesCount}</span>
                )}
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#64748b" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
              Live Telemetry &amp; RTO Compliance Sync Active
            </div>
          </div>

          {/* Quick Stats Ribbon */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginBottom: "1.75rem",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "1.25rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {sourceSegment === "DRIVER" ? "Total Driver Vehicles" : sourceSegment === "COMPANY" ? "Enterprise Fleet Trucks" : "Total Vehicles Registered"}
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#64748b" }}>
                  commute
                </span>
              </div>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a", marginTop: "6px" }}>
                {vehicles.length}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                padding: "1.25rem",
                borderRadius: "12px",
                border: "1px solid #fef3c7",
                borderLeft: "4px solid #f59e0b",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Pending Verification
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#f59e0b" }}>
                  hourglass_top
                </span>
              </div>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#d97706", marginTop: "6px" }}>
                {pendingCount}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                padding: "1.25rem",
                borderRadius: "12px",
                border: "1px solid #a7f3d0",
                borderLeft: "4px solid #10b981",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#047857", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Approved &amp; Active
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#10b981" }}>
                  check_circle
                </span>
              </div>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#059669", marginTop: "6px" }}>
                {approvedCount}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#fff",
                padding: "1.25rem",
                borderRadius: "12px",
                border: "1px solid #fecaca",
                borderLeft: "4px solid #ef4444",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#b91c1c", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Rejected / Non-Compliant
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#ef4444" }}>
                  cancel
                </span>
              </div>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#dc2626", marginTop: "6px" }}>
                {rejectedCount}
              </div>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {/* Status Filter Tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              {[
                { id: "ALL", label: "All Statuses" },
                { id: "PENDING", label: `Pending Review (${pendingCount})` },
                { id: "APPROVED", label: `Approved & Active (${approvedCount})` },
                { id: "REJECTED", label: `Rejected (${rejectedCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "0.5rem 0.9rem",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    backgroundColor: activeTab === tab.id ? "#0f172a" : "#f1f5f9",
                    color: activeTab === tab.id ? "#ffffff" : "#475569",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div style={{ position: "relative", minWidth: "320px", flex: 1, maxWidth: "450px" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "18px",
                  color: "#94a3b8",
                }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Search plate, driver, company, make/model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.75rem 0.55rem 2.4rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Vehicles Register Table */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {isLoading ? (
              <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: "36px", color: "#2563eb" }}>
                  progress_activity
                </span>
                <p style={{ marginTop: "10px", fontSize: "0.9rem", fontWeight: 600, color: "#334155" }}>
                  Loading vehicle specifications and compliance dossiers...
                </p>
              </div>
            ) : vehicles.length === 0 ? (
              <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#cbd5e1" }}>
                  no_crash
                </span>
                <p style={{ marginTop: "10px", fontSize: "1rem", fontWeight: 700, color: "#1e293b" }}>
                  No vehicles found
                </p>
                <p style={{ fontSize: "0.85rem", color: "#64748b", maxWidth: "420px", margin: "6px auto 0" }}>
                  No vehicles currently match the selected source segment, status filter, or search query.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                        fontSize: "0.75rem",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <th style={{ padding: "0.9rem 1.25rem" }}>Vehicle &amp; Reg. Plate</th>
                      <th style={{ padding: "0.9rem 1rem" }}>Operator / Ownership</th>
                      <th style={{ padding: "0.9rem 1rem" }}>Type &amp; Capacity</th>
                      <th style={{ padding: "0.9rem 1rem" }}>Exterior Photo</th>
                      <th style={{ padding: "0.9rem 1rem" }}>Compliance Documents</th>
                      <th style={{ padding: "0.9rem 1rem" }}>Status</th>
                      <th style={{ padding: "0.9rem 1.25rem", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => {
                      const isDriver = v.source === "DRIVER";
                      const photoSrc = v.photo_display_url || v.photo_url || v.vehicle_photo;
                      const rcSrc = v.doc_display_url || v.document_url || v.rc_document;
                      const insSrc = v.insurance_doc_url || v.insurance_document;
                      const fitSrc = v.fitness_doc_url || v.fitness_document;
                      const permitSrc = v.permit_doc_url || v.permit_document;

                      return (
                        <tr
                          key={v.id}
                          style={{
                            borderBottom: "1px solid #f1f5f9",
                            fontSize: "0.85rem",
                            color: "#1e293b",
                            transition: "background-color 0.1s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          {/* Reg Plate & Model */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div className="vehicle-license-plate">
                                  <div className="vehicle-plate-ind">IND</div>
                                  <div className="vehicle-plate-num">{v.registration_number || "UNASSIGNED"}</div>
                                </div>
                                <span
                                  className={`vehicle-source-tag ${
                                    isDriver ? "vehicle-source-driver" : "vehicle-source-company"
                                  }`}
                                >
                                  {isDriver ? "Driver" : "Company Fleet"}
                                </span>
                              </div>

                              <span style={{ fontWeight: 600, fontSize: "0.825rem", color: "#334155" }}>
                                {v.vehicle_model || (isDriver ? "Commercial Vehicle" : "Partner Truck")}
                              </span>

                              {v.assigned_since && (
                                <span style={{ fontSize: "0.725rem", color: "#64748b" }}>
                                  Assigned since: {v.assigned_since}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Operator / Ownership */}
                          <td style={{ padding: "1rem 1rem" }}>
                            {isDriver ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div
                                  style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    backgroundColor: "#e0f2fe",
                                    color: "#0369a1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    overflow: "hidden",
                                    flexShrink: 0,
                                  }}
                                >
                                  {v.driver_avatar ? (
                                    <img src={v.driver_avatar} alt={v.driver_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  ) : (
                                    (v.driver_name || "DR").substring(0, 2).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{v.driver_name}</span>
                                    <span style={{ fontSize: "0.7rem", backgroundColor: "#f1f5f9", padding: "1px 6px", borderRadius: "4px", color: "#475569" }}>
                                      {v.driver_id}
                                    </span>
                                  </div>
                                  <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b" }}>
                                    {v.driver_phone || "No phone"}
                                  </span>
                                  <span style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8" }}>
                                    {v.corridor || "Dedicated Corridor"}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#7c3aed" }}>
                                    corporate_fare
                                  </span>
                                  <span style={{ fontWeight: 700, color: "#0f172a" }}>{v.company_name}</span>
                                </div>
                                <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>
                                  Corporate Fleet Partner
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Type & Capacity */}
                          <td style={{ padding: "1rem 1rem" }}>
                            <div>
                              <span style={{ fontWeight: 700, color: "#0f172a" }}>
                                {v.vehicle_type_display || v.vehicle_type}
                              </span>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                                <span style={{ fontSize: "0.775rem", fontWeight: 600, color: "#2563eb", backgroundColor: "#eff6ff", padding: "2px 6px", borderRadius: "4px" }}>
                                  {v.capacity_tonnes} T
                                </span>
                                {v.vehicle_body_type && (
                                  <span style={{ fontSize: "0.725rem", color: "#64748b" }}>
                                    {v.vehicle_body_type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Truck Exterior Photo */}
                          <td style={{ padding: "1rem 1rem" }}>
                            {photoSrc ? (
                              <button
                                type="button"
                                onClick={() => setPreviewPhotoUrl(photoSrc)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: "#f8fafc",
                                  border: "1px solid #e2e8f0",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "0.775rem",
                                  color: "#2563eb",
                                  fontWeight: 600,
                                }}
                              >
                                <img
                                  src={photoSrc}
                                  alt="Truck thumbnail"
                                  style={{ width: "26px", height: "26px", borderRadius: "4px", objectFit: "cover" }}
                                />
                                View Photo
                              </button>
                            ) : (
                              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No photo</span>
                            )}
                          </td>

                          {/* Compliance Documents */}
                          <td style={{ padding: "1rem 1rem" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center" }}>
                              {rcSrc ? (
                                <a
                                  href={rcSrc}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="doc-chip doc-chip-rc"
                                  title="View Registration Certificate (RC)"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                    description
                                  </span>
                                  RC Doc
                                </a>
                              ) : (
                                <span className="doc-chip doc-chip-empty" title="RC Document Missing">
                                  No RC
                                </span>
                              )}

                              {insSrc && (
                                <a
                                  href={insSrc}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="doc-chip doc-chip-insurance"
                                  title={`Insurance: ${v.insurance_validity || "On File"}`}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                    verified_user
                                  </span>
                                  Insurance
                                </a>
                              )}

                              {fitSrc && (
                                <a
                                  href={fitSrc}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="doc-chip doc-chip-fitness"
                                  title={`Fitness Status: ${v.fitness_status || "Certified"}`}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                    health_and_safety
                                  </span>
                                  Fitness
                                </a>
                              )}

                              {permitSrc && (
                                <a
                                  href={permitSrc}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="doc-chip doc-chip-permit"
                                  title={`Goods Permit: ${v.permit_number || "National Permit"}`}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                    local_police
                                  </span>
                                  Permit
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => setDossierVehicle(v)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#64748b",
                                  padding: "2px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                }}
                                title="Open Full Compliance Dossier"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                  info
                                </span>
                              </button>
                            </div>
                          </td>

                          {/* Approval Status */}
                          <td style={{ padding: "1rem 1rem" }}>
                            {v.status === "PENDING" && (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "4px 8px",
                                  borderRadius: "999px",
                                  backgroundColor: "#fef3c7",
                                  color: "#b45309",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  border: "1px solid #fde68a",
                                }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                  pending
                                </span>
                                PENDING
                              </span>
                            )}
                            {v.status === "APPROVED" && (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "4px 8px",
                                  borderRadius: "999px",
                                  backgroundColor: "#ecfdf5",
                                  color: "#047857",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  border: "1px solid #a7f3d0",
                                }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                  check_circle
                                </span>
                                APPROVED
                              </span>
                            )}
                            {v.status === "REJECTED" && (
                              <div>
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 8px",
                                    borderRadius: "999px",
                                    backgroundColor: "#fef2f2",
                                    color: "#b91c1c",
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    border: "1px solid #fecaca",
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                    cancel
                                  </span>
                                  REJECTED
                                </span>
                                {v.rejection_reason && (
                                  <span style={{ display: "block", fontSize: "0.7rem", color: "#dc2626", marginTop: "2px", maxWidth: "160px" }}>
                                    {v.rejection_reason}
                                  </span>
                                )}
                              </div>
                            )}
                            {v.status === "UNASSIGNED" && (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "4px 8px",
                                  borderRadius: "999px",
                                  backgroundColor: "#f1f5f9",
                                  color: "#64748b",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                UNASSIGNED
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                            {v.status === "PENDING" ? (
                              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(v)}
                                  disabled={isProcessing}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "5px 10px",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: "#16a34a",
                                    color: "#ffffff",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    boxShadow: "0 1px 2px rgba(22, 163, 74, 0.2)",
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                    check
                                  </span>
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRejectingVehicle(v);
                                    setRejectionReason("");
                                  }}
                                  disabled={isProcessing}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "5px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #fecaca",
                                    backgroundColor: "#fff",
                                    color: "#dc2626",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                                    close
                                  </span>
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                {isDriver && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAssigningDriver(v);
                                      setAssignPlateNumber(v.registration_number === "Unassigned" ? "" : v.registration_number);
                                      setAssignVehicleType(v.vehicle_type || "20T Multi-Axle");
                                      setAssignVehicleModel(v.vehicle_model || "BharatBenz 4028T Multi-Axle");
                                    }}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      padding: "4px 8px",
                                      borderRadius: "6px",
                                      border: "1px solid #cbd5e1",
                                      backgroundColor: "#ffffff",
                                      color: "#334155",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                      edit
                                    </span>
                                    {v.status === "UNASSIGNED" ? "Assign Plate" : "Edit Plate"}
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setDossierVehicle(v)}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    border: "1px solid #e2e8f0",
                                    backgroundColor: "#f8fafc",
                                    color: "#2563eb",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Dossier
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* High-Res Truck Photo Preview Modal */}
      {previewPhotoUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
          onClick={() => setPreviewPhotoUrl(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "800px",
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>Commercial Truck Exterior Photo</span>
              <button
                type="button"
                onClick={() => setPreviewPhotoUrl(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={{ padding: "1rem", textAlign: "center", backgroundColor: "#020617" }}>
              <img
                src={previewPhotoUrl}
                alt="Truck High-Res Preview"
                style={{ maxHeight: "70vh", maxWidth: "100%", borderRadius: "8px", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingVehicle && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setRejectingVehicle(null)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "100%",
              padding: "1.5rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Reject Vehicle #{rejectingVehicle.registration_number || rejectingVehicle.driver_name}
            </h3>
            <p style={{ fontSize: "0.825rem", color: "#64748b", margin: "6px 0 1rem 0" }}>
              {rejectingVehicle.source === "DRIVER"
                ? `Provide the compliance rejection reason for driver ${rejectingVehicle.driver_name}.`
                : `Provide the compliance reason for rejecting this vehicle. The partner company ${rejectingVehicle.company_name} will be notified.`}
            </p>

            <form onSubmit={handleConfirmReject}>
              <textarea
                rows="3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. RC document unreadable, insurance expired, or truck photo blurred."
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                  boxSizing: "border-box",
                }}
                required
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setRejectingVehicle(null)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#fff",
                    color: "#475569",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    padding: "0.5rem 1.2rem",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#dc2626",
                    color: "#fff",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compliance Dossier Modal */}
      {dossierVehicle && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setDossierVehicle(null)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "14px",
              maxWidth: "680px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "0.05em" }}>
                    {dossierVehicle.registration_number}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      backgroundColor: dossierVehicle.source === "DRIVER" ? "#0d9488" : "#7c3aed",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {dossierVehicle.source === "DRIVER" ? "Driver Commercial Vehicle" : "Enterprise Fleet"}
                  </span>
                </div>
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  {dossierVehicle.vehicle_model || dossierVehicle.vehicle_type}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDossierVehicle(null)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Dossier Content */}
            <div style={{ padding: "1.5rem", maxHeight: "75vh", overflowY: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ padding: "0.85rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "0.725rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                    Registered Operator
                  </span>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginTop: "3px" }}>
                    {dossierVehicle.source === "DRIVER" ? dossierVehicle.driver_name : dossierVehicle.company_name}
                  </div>
                  {dossierVehicle.driver_phone && (
                    <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                      Contact: {dossierVehicle.driver_phone}
                    </span>
                  )}
                </div>

                <div style={{ padding: "0.85rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "0.725rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                    Rated Capacity &amp; Body
                  </span>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginTop: "3px" }}>
                    {dossierVehicle.capacity_tonnes} Metric Tonnes
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                    {dossierVehicle.vehicle_body_type || dossierVehicle.vehicle_type_display || dossierVehicle.vehicle_type}
                  </span>
                </div>
              </div>

              {/* Compliance Badges Grid */}
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155", margin: "0 0 0.75rem 0", textTransform: "uppercase" }}>
                RTO &amp; Transport Compliance Credentials
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* RC */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined" style={{ color: "#2563eb", fontSize: "20px" }}>
                      badge
                    </span>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>Vehicle RC Certificate</span>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b" }}>
                        Reg: {dossierVehicle.rc_number || dossierVehicle.registration_number}
                      </span>
                    </div>
                  </div>
                  {(dossierVehicle.doc_display_url || dossierVehicle.document_url || dossierVehicle.rc_document) ? (
                    <a
                      href={dossierVehicle.doc_display_url || dossierVehicle.document_url || dossierVehicle.rc_document}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "4px 10px", borderRadius: "6px", backgroundColor: "#eff6ff", color: "#1d4ed8", fontSize: "0.775rem", fontWeight: 600, textDecoration: "none" }}
                    >
                      View RC File
                    </a>
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No Doc</span>
                  )}
                </div>

                {/* Insurance */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined" style={{ color: "#059669", fontSize: "20px" }}>
                      verified_user
                    </span>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>Commercial Comprehensive Insurance</span>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b" }}>
                        Validity: {dossierVehicle.insurance_validity || "Active on file"}
                      </span>
                    </div>
                  </div>
                  {(dossierVehicle.insurance_doc_url || dossierVehicle.insurance_document) ? (
                    <a
                      href={dossierVehicle.insurance_doc_url || dossierVehicle.insurance_document}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "4px 10px", borderRadius: "6px", backgroundColor: "#ecfdf5", color: "#047857", fontSize: "0.775rem", fontWeight: 600, textDecoration: "none" }}
                    >
                      View Policy
                    </a>
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>On Record</span>
                  )}
                </div>

                {/* Fitness */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined" style={{ color: "#7c3aed", fontSize: "20px" }}>
                      health_and_safety
                    </span>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>Vehicle Fitness / Pollution Certificate</span>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b" }}>
                        Status: {dossierVehicle.fitness_status || "Certified Valid"} (Expiry: {dossierVehicle.fitness_expiry || "2027"})
                      </span>
                    </div>
                  </div>
                  {(dossierVehicle.fitness_doc_url || dossierVehicle.fitness_document) ? (
                    <a
                      href={dossierVehicle.fitness_doc_url || dossierVehicle.fitness_document}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "4px 10px", borderRadius: "6px", backgroundColor: "#faf5ff", color: "#6b21a8", fontSize: "0.775rem", fontWeight: 600, textDecoration: "none" }}
                    >
                      View Fitness
                    </a>
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Certified</span>
                  )}
                </div>

                {/* National Goods Permit */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined" style={{ color: "#d97706", fontSize: "20px" }}>
                      local_police
                    </span>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>National Goods Permit (All India / State)</span>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b" }}>
                        Permit: {dossierVehicle.permit_number || "NP-KL-2024-99812"} ({dossierVehicle.permit_validity || "Valid"})
                      </span>
                    </div>
                  </div>
                  {(dossierVehicle.permit_doc_url || dossierVehicle.permit_document) ? (
                    <a
                      href={dossierVehicle.permit_doc_url || dossierVehicle.permit_document}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "4px 10px", borderRadius: "6px", backgroundColor: "#fffbeb", color: "#b45309", fontSize: "0.775rem", fontWeight: 600, textDecoration: "none" }}
                    >
                      View Permit
                    </a>
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>National Route</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setDossierVehicle(null)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#0f172a",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Assign / Edit Vehicle Plate Modal */}
      {assigningDriver && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setAssigningDriver(null)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Assign Commercial Vehicle Plate
            </h3>
            <p style={{ fontSize: "0.825rem", color: "#64748b", margin: "6px 0 1.25rem 0" }}>
              Update or register the commercial truck license plate for driver <strong>{assigningDriver.driver_name}</strong> ({assigningDriver.driver_id}).
            </p>

            <form onSubmit={handleConfirmAssign}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Vehicle Plate / Reg. Number
                </label>
                <input
                  type="text"
                  value={assignPlateNumber}
                  onChange={(e) => setAssignPlateNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. KL-07-CC-9921 or MH-12-AB-1234"
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Vehicle Classification
                </label>
                <select
                  value={assignVehicleType}
                  onChange={(e) => setAssignVehicleType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="20T Multi-Axle">20T Multi-Axle (Heavy Commercial)</option>
                  <option value="16T Medium Multi-Axle">16T Medium Multi-Axle</option>
                  <option value="Container (32 ft MXL)">Container (32 ft MXL)</option>
                  <option value="Trailer / Heavy Haul">Trailer / Heavy Haul</option>
                  <option value="Truck (14 ft)">Truck (14 ft)</option>
                  <option value="Truck (17 ft)">Truck (17 ft)</option>
                  <option value="Mini Truck / LCV">Mini Truck / LCV</option>
                </select>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                  Truck Make &amp; Model
                </label>
                <input
                  type="text"
                  value={assignVehicleModel}
                  onChange={(e) => setAssignVehicleModel(e.target.value)}
                  placeholder="e.g. BharatBenz 4028T or Tata Prima 3530.K"
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.85rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setAssigningDriver(null)}
                  style={{
                    padding: "0.55rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#fff",
                    color: "#475569",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    padding: "0.55rem 1.25rem",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Save &amp; Activate Plate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Command Palette */}
      {commandPaletteOpen && (
        <CommandPaletteModal
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onSelectAction={(cmd) => {
            if (cmd.id === "cmd-dash") navigate("/dashboard");
            else if (cmd.id === "cmd-orders") navigate("/orders");
            else if (cmd.id === "cmd-trips") navigate("/trips");
            else if (cmd.id === "cmd-drivers") navigate("/drivers");
            else if (cmd.id === "cmd-vehicles") navigate("/vehicles");
            else if (cmd.id === "cmd-payouts") navigate("/payouts");
            else if (cmd.id === "cmd-invoices") navigate("/invoicing");
          }}
        />
      )}
    </div>
  );
}
