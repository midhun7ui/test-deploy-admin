import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DocumentPreviewModal from "./DocumentPreviewModal";

/**
 * Verify KYC & Compliance Documents Modal
 * Allows ops admins to review uploaded documents, check statuses, view docs, and activate drivers
 */
export default function VerifyKycModal({ isOpen, driver, onClose, onConfirmVerify }) {
  const [verifiedDocIds, setVerifiedDocIds] = useState(() => {
    if (!driver?.complianceDocs) return [];
    return driver.complianceDocs
      .filter((d) => d.status === "Verified" || d.status === "Valid")
      .map((d) => d.id);
  });
  const [adminNotes, setAdminNotes] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    if (driver?.complianceDocs) {
      setVerifiedDocIds(
        driver.complianceDocs
          .filter((d) => d.status === "Verified" || d.status === "Valid")
          .map((d) => d.id)
      );
    }
  }, [driver]);

  if (!isOpen || !driver) return null;

  function toggleDoc(id) {
    setVerifiedDocIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleApprove(e) {
    e.preventDefault();
    onConfirmVerify({
      driverId: driver.id,
      isFullyApproved: true,
      verifiedCount: 5,
      adminNotes,
    });
  }

  function handleReject(e) {
    e.preventDefault();
    onConfirmVerify({
      driverId: driver.id,
      isFullyApproved: false,
      verifiedCount: verifiedDocIds.length,
      adminNotes: adminNotes || "Document re-upload requested by Ops Admin",
    });
  }

  return (
    <>
      <div className="driver-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <div
          className="driver-modal-card"
          style={{ maxWidth: "640px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="driver-modal-header">
            <div className="driver-modal-header-left">
              <div
                className="driver-modal-icon-pod"
                style={{
                  backgroundColor: "var(--driver-emerald-bg)",
                  color: "var(--driver-emerald)",
                }}
              >
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <h3 className="driver-modal-title">Review Compliance &amp; KYC</h3>
                <p className="driver-modal-subtitle">
                  {driver.name} ({driver.phone}) • Vehicle:{" "}
                  {driver.vehicle?.isAssigned && driver.vehicle?.number && driver.vehicle?.number !== "None"
                    ? driver.vehicle.number
                    : "None"}
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

          <div className="driver-modal-body">
            <div style={{ fontSize: "0.75rem", color: "var(--driver-text-muted)" }}>
              Review mandatory regulatory documents against RTO database records and government portal API. Click <strong>View Doc</strong> to inspect any document:
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {(driver.complianceDocs || []).map((doc) => {
                const isChecked = verifiedDocIds.includes(doc.id);

                return (
                  <div
                    key={doc.id}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      backgroundColor: "var(--driver-surface-low)",
                      border: `1.5px solid ${isChecked ? "var(--driver-emerald)" : "var(--driver-surface-high)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <label
                      htmlFor={`chk-doc-${doc.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        cursor: "pointer",
                        flex: 1,
                        margin: 0,
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`chk-doc-${doc.id}`}
                        checked={isChecked}
                        onChange={() => toggleDoc(doc.id)}
                        style={{
                          accentColor: "var(--driver-emerald)",
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                        }}
                      />
                      <div>
                        <strong
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--driver-text-main)",
                            display: "block",
                          }}
                        >
                          {doc.name}
                        </strong>
                        <span style={{ fontSize: "0.7rem", color: "var(--driver-text-muted)" }}>
                          {doc.number} • {doc.expiryDate}
                        </span>
                      </div>
                    </label>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPreviewDoc(doc);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          padding: "0.32rem 0.65rem",
                          borderRadius: "6px",
                          backgroundColor: "var(--driver-surface)",
                          border: "1px solid var(--driver-surface-high)",
                          color: "var(--driver-primary)",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        title={`View & inspect ${doc.name}`}
                        className="driver-btn-view-doc-trigger"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                          visibility
                        </span>
                        <span>View Doc</span>
                      </button>

                      <span
                        className="driver-pill"
                        style={{
                          backgroundColor: isChecked
                            ? "var(--driver-emerald-bg)"
                            : "var(--driver-amber-bg)",
                          color: isChecked
                            ? "var(--driver-emerald-text)"
                            : "var(--driver-amber-text)",
                        }}
                      >
                        {isChecked ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="driver-form-group">
              <label className="driver-form-label" htmlFor="txt-kyc-notes">
                Operations Audit Remarks
              </label>
              <textarea
                id="txt-kyc-notes"
                className="driver-form-textarea"
                placeholder="e.g. Verified with Sarathi Parivahan portal & background verification cleared..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                style={{ minHeight: "65px" }}
              />
            </div>
          </div>

          <div className="driver-modal-actions">
            <button
              type="button"
              className="driver-btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReject}
              style={{
                height: "38px",
                padding: "0 1rem",
                backgroundColor: "var(--driver-surface-low)",
                color: "var(--driver-amber-text)",
                border: "1px solid var(--driver-amber)",
                borderRadius: "8px",
                fontSize: "0.8125rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Request Re-upload
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="driver-btn-verified-green"
              style={{ height: "38px", padding: "0 1.25rem", flex: "none" }}
              id="btn-confirm-approve-kyc"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                check_circle
              </span>
              <span>Approve &amp; Activate Driver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={Boolean(previewDoc)}
        document={previewDoc}
        driver={driver}
        onClose={() => setPreviewDoc(null)}
        onVerifyDoc={(id) => {
          if (!verifiedDocIds.includes(id)) {
            toggleDoc(id);
          }
        }}
        isVerified={previewDoc ? verifiedDocIds.includes(previewDoc.id) : false}
      />
    </>
  );
}

VerifyKycModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  driver: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onConfirmVerify: PropTypes.func.isRequired,
};

