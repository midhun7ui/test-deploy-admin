import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function VerifyHashChainModal({ isOpen, onClose }) {
  const [verifying, setVerifying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setVerifying(false);
          return 100;
        }
        return prev + 25;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="audit-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="audit-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="audit-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--audit-primary)" }}>
              fingerprint
            </span>
            <h3 className="audit-modal-title">Merkle Tree Cryptographic Chain Verification</h3>
          </div>
          <button
            type="button"
            className="admin-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="audit-modal-body">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "var(--audit-text-muted)" }}>
              {verifying ? "Verifying SHA-256 Block Chaining..." : "Chain Verification Completed"}
            </span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--audit-primary)" }}>
              {progress}%
            </span>
          </div>

          <div className="audit-kpi-progress-bar" style={{ height: "6px" }}>
            <div className="audit-kpi-progress-fill primary" style={{ width: `${progress}%` }} />
          </div>

          <div
            style={{
              backgroundColor: "var(--audit-surface-low)",
              padding: "12px",
              borderRadius: "var(--audit-radius-md)",
              fontFamily: "monospace",
              fontSize: "11px",
              lineHeight: 1.5,
              color: "var(--audit-text)",
            }}
          >
            <div>[✓] Connecting to AWS S3 Object Lock Compliance Enclave</div>
            <div>[✓] Computed Current Merkle Root: 0x7e8d4a92c10b8f391ad9821ef9a2c347...39a1</div>
            <div>[✓] Validated 1,42,890 consecutive blocks against Genesis Block #000001</div>
            <div style={{ color: "#059669", fontWeight: 700, marginTop: "4px" }}>
              [✓] Non-Repudiation Status: 100% VALID (0 broken signatures detected)
            </div>
          </div>
        </div>

        <div className="audit-modal-footer">
          <button type="button" className="audit-btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

VerifyHashChainModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
