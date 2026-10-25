import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

/**
 * DocumentPreviewModal
 * Comprehensive Document Viewer & Preview Modal for Ops Admin
 * Supports high-resolution Image zooming/rotation, embedded PDF preview,
 * secure direct new-tab viewing, and digital compliance record inspection.
 */
export default function DocumentPreviewModal({
  isOpen,
  document: doc,
  driver,
  onClose,
  onVerifyDoc,
  isVerified = false,
  zIndex = 1200,
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Reset transforms whenever modal opens or active document changes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setImageLoading(true);
      setImageError(false);
      setCopySuccess(false);
    }
  }, [isOpen, doc?.id, doc?.file_url]);

  // Keyboard shortcut listener for convenient ops navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        setZoom((prev) => Math.min(prev + 0.25, 3.5));
      } else if (e.key === "-" || e.key === "_") {
        setZoom((prev) => Math.max(prev - 0.25, 0.5));
      } else if (e.key.toLowerCase() === "r") {
        setRotation((prev) => (prev + 90) % 360);
      } else if (e.key === "0") {
        setZoom(1);
        setRotation(0);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const fileUrl = doc?.file_url || doc?.fileUrl || "";
  const isPdf =
    doc?.file_type === "pdf" ||
    (fileUrl && fileUrl.toLowerCase().includes(".pdf"));
  const hasFile = Boolean(fileUrl);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleCopyNumber = () => {
    if (!doc?.number) return;
    navigator.clipboard.writeText(doc.number);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleOpenInNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) return;
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = blobUrl;
      const ext = isPdf ? ".pdf" : ".png";
      const sanitizedName = (doc?.name || "document")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_");
      link.download = `${driver?.name || "driver"}_${sanitizedName}${ext}`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback direct open/download
      window.open(fileUrl, "_blank");
    }
  };

  if (!isOpen || !doc) return null;

  const isDocApproved =
    isVerified || doc.status === "Verified" || doc.status === "Valid";

  return (
    <div
      className="driver-modal-backdrop"
      style={{ zIndex }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-preview-modal-title"
    >
      <div
        className="driver-modal-card driver-doc-preview-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "880px",
          width: "92vw",
          height: "88vh",
          maxHeight: "880px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--driver-surface)",
        }}
      >
        {/* Header Bar */}
        <div className="driver-modal-header" style={{ padding: "1rem 1.35rem" }}>
          <div className="driver-modal-header-left">
            <div
              className="driver-modal-icon-pod"
              style={{
                backgroundColor: isDocApproved
                  ? "var(--driver-emerald-bg)"
                  : "var(--driver-surface-high)",
                color: isDocApproved
                  ? "var(--driver-emerald-text)"
                  : "var(--driver-primary)",
              }}
            >
              <span className="material-symbols-outlined">
                {isDocApproved
                  ? "verified"
                  : isPdf
                  ? "picture_as_pdf"
                  : "assignment_ind"}
              </span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h3
                  id="doc-preview-modal-title"
                  className="driver-modal-title"
                  style={{ fontSize: "1.05rem" }}
                >
                  {doc.name}
                </h3>
                <span
                  className="driver-pill"
                  style={{
                    backgroundColor: isDocApproved
                      ? "var(--driver-emerald-bg)"
                      : "var(--driver-amber-bg)",
                    color: isDocApproved
                      ? "var(--driver-emerald-text)"
                      : "var(--driver-amber-text)",
                    fontSize: "0.7rem",
                    padding: "0.15rem 0.55rem",
                  }}
                >
                  {isDocApproved ? "Verified & Valid" : doc.statusBadge || doc.status || "Pending Review"}
                </span>
              </div>
              <p className="driver-modal-subtitle" style={{ fontSize: "0.775rem" }}>
                {driver?.name} ({driver?.phone || "No phone"}) • No:{" "}
                <strong style={{ color: "var(--driver-text-main)" }}>
                  {doc.number || "Not specified"}
                </strong>
                {doc.expiryDate ? ` • ${doc.expiryDate}` : ""}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            {hasFile && !isPdf && (
              <>
                <button
                  type="button"
                  className="driver-preview-tool-btn"
                  onClick={handleZoomIn}
                  title="Zoom In (+)"
                  aria-label="Zoom In"
                >
                  <span className="material-symbols-outlined">zoom_in</span>
                </button>
                <button
                  type="button"
                  className="driver-preview-tool-btn"
                  onClick={handleZoomOut}
                  title="Zoom Out (-)"
                  aria-label="Zoom Out"
                >
                  <span className="material-symbols-outlined">zoom_out</span>
                </button>
                <button
                  type="button"
                  className="driver-preview-tool-btn"
                  onClick={handleRotate}
                  title="Rotate 90° (R)"
                  aria-label="Rotate"
                >
                  <span className="material-symbols-outlined">rotate_right</span>
                </button>
                <button
                  type="button"
                  className="driver-preview-tool-btn"
                  onClick={handleReset}
                  title="Reset View (0)"
                  aria-label="Reset View"
                >
                  <span className="material-symbols-outlined">restart_alt</span>
                </button>
                <div
                  style={{
                    width: "1px",
                    height: "22px",
                    backgroundColor: "var(--driver-surface-high)",
                    margin: "0 0.2rem",
                  }}
                />
              </>
            )}

            {hasFile && (
              <>
                <button
                  type="button"
                  className="driver-preview-tool-btn"
                  onClick={handleOpenInNewTab}
                  title="Open Original in New Tab"
                  aria-label="Open in New Tab"
                >
                  <span className="material-symbols-outlined">open_in_new</span>
                </button>
                <button
                  type="button"
                  className="driver-preview-tool-btn"
                  onClick={handleDownload}
                  title="Download Document"
                  aria-label="Download Document"
                >
                  <span className="material-symbols-outlined">download</span>
                </button>
              </>
            )}

            <button
              type="button"
              className="driver-modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
              style={{ marginLeft: "0.5rem" }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Document Content Viewport */}
        <div
          className="driver-doc-viewer-viewport"
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#0d131f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasFile ? (
            isPdf ? (
              <div style={{ width: "100%", height: "100%" }}>
                <iframe
                  src={`${fileUrl}#toolbar=1`}
                  title={doc.name}
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              </div>
            ) : (
              <div
                className="driver-doc-image-container"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "auto",
                  padding: "1.5rem",
                  userSelect: "none",
                }}
              >
                {imageLoading && !imageError && (
                  <div
                    style={{
                      position: "absolute",
                      color: "#94a3b8",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "28px", animation: "spin 1s linear infinite" }}
                    >
                      progress_activity
                    </span>
                    <span>Loading Document...</span>
                  </div>
                )}

                {imageError ? (
                  <div
                    style={{
                      color: "#f87171",
                      textAlign: "center",
                      padding: "2rem",
                      maxWidth: "400px",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "40px", marginBottom: "0.75rem", color: "#f87171" }}
                    >
                      broken_image
                    </span>
                    <h4 style={{ color: "#ffffff", margin: "0 0 0.5rem" }}>
                      Could not load document preview
                    </h4>
                    <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: "0 0 1rem" }}>
                      The file link may have expired or is blocked by network policy. You can try opening it in a new window.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenInNewTab}
                      className="driver-btn-action-tile"
                      style={{ margin: "0 auto", backgroundColor: "#1e293b", color: "#fff" }}
                    >
                      <span className="material-symbols-outlined">open_in_new</span>
                      <span>Open File Directly</span>
                    </button>
                  </div>
                ) : (
                  <img
                    src={fileUrl}
                    alt={`${doc.name} for ${driver?.name}`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: "center center",
                      transition: "transform 0.15s ease-out",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                      borderRadius: "6px",
                    }}
                  />
                )}
              </div>
            )
          ) : (
            /* Digital Compliance Card when no scan is attached */
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
              }}
            >
              <div
                style={{
                  maxWidth: "520px",
                  width: "100%",
                  backgroundColor: "#161f30",
                  border: "1px solid #233149",
                  borderRadius: "14px",
                  padding: "1.75rem",
                  color: "#e2e8f0",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    marginBottom: "1.25rem",
                    borderBottom: "1px solid #233149",
                    paddingBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(59, 130, 246, 0.15)",
                      color: "#60a5fa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.1rem", color: "#ffffff" }}>
                      Digital Government Registry Record
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      Sarathi Parivahan &amp; UIDAI Digital Verification Dossier
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    fontSize: "0.8125rem",
                  }}
                >
                  <div>
                    <span style={{ color: "#94a3b8", display: "block", fontSize: "0.7rem", marginBottom: "0.15rem" }}>
                      DOCUMENT TYPE
                    </span>
                    <strong style={{ color: "#ffffff" }}>{doc.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block", fontSize: "0.7rem", marginBottom: "0.15rem" }}>
                      REGISTERED NUMBER
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <strong style={{ color: "#60a5fa", fontFamily: "monospace" }}>
                        {doc.number || "Not provided"}
                      </strong>
                      {doc.number && (
                        <button
                          type="button"
                          onClick={handleCopyNumber}
                          style={{
                            background: "none",
                            border: "none",
                            color: copySuccess ? "#34d399" : "#94a3b8",
                            cursor: "pointer",
                            padding: 0,
                          }}
                          title="Copy Document Number"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                            {copySuccess ? "check" : "content_copy"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block", fontSize: "0.7rem", marginBottom: "0.15rem" }}>
                      DRIVER HOLDER
                    </span>
                    <span style={{ color: "#ffffff" }}>{driver?.name}</span>
                  </div>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block", fontSize: "0.7rem", marginBottom: "0.15rem" }}>
                      VALIDITY / EXPIRY
                    </span>
                    <span style={{ color: "#34d399" }}>{doc.expiryDate || "Valid till 2030"}</span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "1.25rem",
                    padding: "0.75rem 0.85rem",
                    backgroundColor: "rgba(30, 41, 59, 0.6)",
                    borderRadius: "8px",
                    border: "1px dashed #334155",
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: "#38bdf8", fontSize: "18px" }}>
                    info
                  </span>
                  <span>
                    No physical scanned image was uploaded for this record. The details have been registered directly from onboarding records.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className="driver-modal-actions"
          style={{
            padding: "0.85rem 1.35rem",
            backgroundColor: "var(--driver-surface)",
            borderTop: "1px solid var(--driver-surface-high)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isDocApproved
                  ? "var(--driver-emerald)"
                  : "var(--driver-amber)",
              }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--driver-text-muted)" }}>
              {isDocApproved
                ? "Document is verified and in active compliance"
                : "Awaiting Ops compliance audit and approval"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {hasFile && (
              <button
                type="button"
                onClick={handleOpenInNewTab}
                style={{
                  height: "36px",
                  padding: "0 0.85rem",
                  backgroundColor: "var(--driver-surface-low)",
                  border: "1px solid var(--driver-surface-high)",
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  color: "var(--driver-text-main)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  open_in_new
                </span>
                <span>Open in Tab</span>
              </button>
            )}

            {onVerifyDoc && !isDocApproved && (
              <button
                type="button"
                onClick={() => {
                  onVerifyDoc(doc.id);
                  onClose();
                }}
                className="driver-btn-verified-green"
                style={{
                  height: "36px",
                  padding: "0 1.15rem",
                  fontSize: "0.8125rem",
                  borderRadius: "8px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  check_circle
                </span>
                <span>Verify &amp; Approve Document</span>
              </button>
            )}

            <button
              type="button"
              className="driver-btn-modal-cancel"
              onClick={onClose}
              style={{ height: "36px", padding: "0 1rem" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DocumentPreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  document: PropTypes.object,
  driver: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onVerifyDoc: PropTypes.func,
  isVerified: PropTypes.bool,
  zIndex: PropTypes.number,
};
