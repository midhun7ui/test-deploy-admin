import { useState } from "react";
import PropTypes from "prop-types";

export default function ExportAccessLogModal({ isOpen, onClose, onExportConfirm }) {
  const [format, setFormat] = useState("csv");
  const [dateRange, setDateRange] = useState("oct2026");
  const [includeIps, setIncludeIps] = useState(true);
  const [includeMfa, setIncludeMfa] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onExportConfirm?.({ format, dateRange, includeIps, includeMfa });
      onClose();
    }, 600);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--admin-primary-container)" }}>
              file_download
            </span>
            <h3 className="admin-modal-title">Export Enterprise Access Log</h3>
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

        {/* Body */}
        <div className="admin-modal-body">
          <div className="admin-form-group">
            <label className="admin-form-label">Export File Format</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                className={`admin-page-btn ${format === "csv" ? "active" : ""}`}
                style={{ height: "36px" }}
                onClick={() => setFormat("csv")}
              >
                CSV Table
              </button>
              <button
                type="button"
                className={`admin-page-btn ${format === "json" ? "active" : ""}`}
                style={{ height: "36px" }}
                onClick={() => setFormat("json")}
              >
                JSON Raw Log
              </button>
              <button
                type="button"
                className={`admin-page-btn ${format === "pdf" ? "active" : ""}`}
                style={{ height: "36px" }}
                onClick={() => setFormat("pdf")}
              >
                Signed Audit PDF
              </button>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Temporal Scope</label>
            <select
              className="admin-form-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="24h">Last 24 Hours (Realtime Stream)</option>
              <option value="7d">Last 7 Days (Weekly Audit Cycle)</option>
              <option value="oct2026">Full Month: 01 Oct – 31 Oct 2026</option>
              <option value="q3">Q3 FY26 (Fiscal Quarter)</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Data Fields &amp; Cryptographic Signatures</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeIps}
                  onChange={(e) => setIncludeIps(e.target.checked)}
                />
                <span>Include Corporate IP Whitelist and Ingress Subnets</span>
              </label>
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeMfa}
                  onChange={(e) => setIncludeMfa(e.target.checked)}
                />
                <span>Include FIDO2 / YubiKey Hardware Token Registration Hashes</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="admin-modal-footer">
          <button type="button" className="admin-btn-secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleExport}
            disabled={isExporting}
            id="btn-confirm-export"
          >
            <span className="material-symbols-outlined">
              {isExporting ? "hourglass_empty" : "download"}
            </span>
            <span>{isExporting ? "Compiling Logs..." : "Download Access Log"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

ExportAccessLogModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExportConfirm: PropTypes.func.isRequired,
};
