import { useState } from "react";
import PropTypes from "prop-types";

export default function ExportConfigModal({ isOpen, onClose, configData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(configData, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hired-platform-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="settings-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="settings-modal-content"
        style={{ maxWidth: "680px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px", color: "var(--settings-primary)" }}
            >
              data_object
            </span>
            <h3 className="settings-modal-title">Export Platform Configuration JSON</h3>
          </div>
          <button
            type="button"
            className="settings-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "var(--settings-text-secondary)", margin: 0 }}>
          Cryptographically serialized state tree of runtime platform variables, entity certificates, and billing coordinates.
        </p>

        <div
          style={{
            maxHeight: "340px",
            overflowY: "auto",
            backgroundColor: "var(--settings-card-low)",
            border: "1px solid var(--settings-border)",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#a5b4fc",
              lineHeight: "1.4",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {jsonString}
          </pre>
        </div>

        <div className="settings-modal-actions">
          <button
            type="button"
            className="settings-btn-secondary"
            onClick={handleCopy}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              {copied ? "check" : "content_copy"}
            </span>
            <span>{copied ? "Copied" : "Copy to Clipboard"}</span>
          </button>

          <button
            type="button"
            className="settings-btn-primary"
            onClick={handleDownload}
            id="btn-download-config-json"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              download
            </span>
            <span>Download .json</span>
          </button>
        </div>
      </div>
    </div>
  );
}

ExportConfigModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  configData: PropTypes.object.isRequired,
};
