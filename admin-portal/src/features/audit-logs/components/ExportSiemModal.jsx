import { useState } from "react";
import PropTypes from "prop-types";

export default function ExportSiemModal({ isOpen, onClose, onExportConfirm }) {
  const [siemTarget, setSiemTarget] = useState("splunk");
  const [timeWindow, setTimeWindow] = useState("7d");
  const [includePayloadDiffs, setIncludePayloadDiffs] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onExportConfirm?.({ siemTarget, timeWindow, includePayloadDiffs });
      onClose();
    }, 600);
  };

  return (
    <div className="audit-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="audit-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="audit-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--audit-primary-container)" }}>
              cloud_download
            </span>
            <h3 className="audit-modal-title">Export Telemetry to Enterprise SIEM</h3>
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
          <div className="admin-form-group">
            <label className="admin-form-label">SIEM / Ingestion Target</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                className={`audit-page-btn ${siemTarget === "splunk" ? "active" : ""}`}
                style={{ height: "36px" }}
                onClick={() => setSiemTarget("splunk")}
              >
                Splunk HEC Stream
              </button>
              <button
                type="button"
                className={`audit-page-btn ${siemTarget === "datadog" ? "active" : ""}`}
                style={{ height: "36px" }}
                onClick={() => setSiemTarget("datadog")}
              >
                Datadog Cloud SIEM
              </button>
              <button
                type="button"
                className={`audit-page-btn ${siemTarget === "cloudwatch" ? "active" : ""}`}
                style={{ height: "36px" }}
                onClick={() => setSiemTarget("cloudwatch")}
              >
                AWS CloudWatch Logs
              </button>
              <button
                type="button"
                className={`audit-page-btn ${siemTarget === "syslog" ? "active" : ""}`}
                style={{ height: "36px" }}
                onClick={() => setSiemTarget("syslog")}
              >
                Raw Syslog (RFC 5424)
              </button>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Export Time Window</label>
            <select
              className="admin-form-select"
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
            >
              <option value="24h">Last 24 Hours (Realtime Stream)</option>
              <option value="7d">Last 7 Days (Standard Audit Batch)</option>
              <option value="30d">Last 30 Days (Full Billing Cycle)</option>
              <option value="q3">Q3 FY26 (Complete Quarterly Ledger)</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={includePayloadDiffs}
                onChange={(e) => setIncludePayloadDiffs(e.target.checked)}
              />
              <span>Include full JSON before/after mutation diff payloads</span>
            </label>
          </div>
        </div>

        <div className="audit-modal-footer">
          <button type="button" className="audit-btn-secondary" onClick={onClose} disabled={isExporting}>
            Cancel
          </button>
          <button
            type="button"
            className="audit-btn-primary"
            onClick={handleExport}
            disabled={isExporting}
            id="btn-confirm-siem-export"
          >
            <span className="material-symbols-outlined">
              {isExporting ? "hourglass_empty" : "send"}
            </span>
            <span>{isExporting ? "Streaming Telemetry..." : "Initiate SIEM Dispatch"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

ExportSiemModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExportConfirm: PropTypes.func.isRequired,
};
