import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DocumentPreviewModal from "./DocumentPreviewModal";

/**
 * Driver Profile & Compliance Panel (Right 42% Column)
 * Sticky inspector showing credentials, KYC compliance, current telemetry, and payouts
 */
export default function DriverProfilePanel({
  driver,
  onAssignTrip,
  onVerifyKyc,
  onPreviewDoc,
  onReassignVehicle,
  onCallDriver,
  onSuspendDriver,
  onVerifyBank,
  initialSubtab,
}) {
  const [activeSubtab, setActiveSubtab] = useState(initialSubtab || "kyc"); // 'overview' | 'kyc' | 'bank' | 'trips' | 'wallet' | 'performance'
  const [panelPreviewDoc, setPanelPreviewDoc] = useState(null);
  const [showFullAccount, setShowFullAccount] = useState(false);
  const [isProcessingBank, setIsProcessingBank] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showDenyConfirm, setShowDenyConfirm] = useState(false);

  useEffect(() => {
    if (initialSubtab) {
      setActiveSubtab(initialSubtab);
    }
  }, [initialSubtab]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleBankAction = async (newStatus, reason = "") => {
    if (!onVerifyBank || isProcessingBank) return;
    setIsProcessingBank(true);
    try {
      await onVerifyBank(driver, newStatus, reason);
      setShowDenyConfirm(false);
      setRejectionReason("");
    } finally {
      setIsProcessingBank(false);
    }
  };


  if (!driver) {
    return (
      <aside className="driver-profile-panel">
        <div className="driver-profile-card">
          <div style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "48px", color: "var(--driver-text-outline)", marginBottom: "1rem" }}
            >
              badge
            </span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", margin: "0 0 0.5rem" }}>
              Select a Driver
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--driver-text-muted)", margin: 0 }}>
              Click any driver row to inspect compliance documents, telemetry, and digital wallet.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  function formatINR(val) {
    if (typeof val !== "number") return val;
    return `₹${val.toLocaleString("en-IN")}`;
  }

  const isVerified = driver.kycStatus === "Verified";
  const isPending = driver.kycStatus === "Pending";
  const isOnTrip = driver.status === "On Trip";

  return (
    <aside className="driver-profile-panel" id="driver-profile-panel" aria-label="Driver inspection details">
      <div className="driver-profile-card">
        {/* Header Banner with Status Badges */}
        <div className="driver-profile-header">
          <div className="driver-profile-heading-group">
            <h2 className="driver-profile-h2">Driver Profile</h2>
            {isVerified && (
              <span className="driver-pill pill-available">
                <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                  verified_user
                </span>
                <span>Active / Verified</span>
              </span>
            )}
            {isPending && (
              <span className="driver-pill pill-pending-kyc">
                <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                  pending_actions
                </span>
                <span>Pending KYC</span>
              </span>
            )}
            {driver.kycStatus === "Expired" && (
              <span className="driver-pill pill-expired">
                <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                  warning
                </span>
                <span>License Expired</span>
              </span>
            )}
          </div>

          <div>
            {isOnTrip && driver.currentAssignment?.tripId ? (
              <span className="driver-pill pill-ontrip">
                <span className="driver-pulse-green" style={{ backgroundColor: "var(--driver-primary)" }} />
                <span>On Trip: #{driver.currentAssignment.tripId}</span>
              </span>
            ) : driver.status === "Available" ? (
              <span className="driver-pill pill-available">
                <span>Available for Dispatch</span>
              </span>
            ) : (
              <span className="driver-pill pill-inactive">
                <span>{driver.status}</span>
              </span>
            )}
          </div>
        </div>

        {/* Profile Snapshot */}
        <div className="driver-snapshot-box">
          <div className="driver-snapshot-top">
            {driver.avatar ? (
              <img
                src={driver.avatar}
                alt={driver.name}
                className="driver-snapshot-avatar-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            {!driver.avatar && (
              <div className="driver-snapshot-initials-lg">{driver.initials}</div>
            )}

            <div className="driver-snapshot-info">
              <div className="driver-snapshot-name-row">
                <h3 className="driver-snapshot-name">{driver.name}</h3>
                <div className="driver-rating-star-cluster">
                  {driver.tripsCompleted > 0 && driver.rating ? (
                    <>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1", color: "var(--driver-amber)" }}
                      >
                        star
                      </span>
                      <span>{driver.rating}</span>
                      <span style={{ color: "var(--driver-text-outline)", fontWeight: "normal" }}>
                        ({driver.tripsCompleted} {driver.tripsCompleted === 1 ? "trip" : "trips"})
                      </span>
                    </>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "var(--driver-amber-text)",
                        backgroundColor: "var(--driver-amber-bg)",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "6px",
                      }}
                    >
                      New Driver • 0 trips
                    </span>
                  )}
                </div>

              </div>

              <div className="driver-contact-list">
                <div className="driver-contact-item">
                  <span className="material-symbols-outlined driver-contact-icon">call</span>
                  <span className="driver-phone-mono">{driver.phone}</span>
                </div>
                <div className="driver-contact-item" title={driver.email}>
                  <span className="material-symbols-outlined driver-contact-icon">mail</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {driver.email}
                  </span>
                </div>
                {driver.emergencyContact && (
                  <div className="driver-contact-item">
                    <span className="material-symbols-outlined driver-contact-icon">emergency</span>
                    <span>
                      Emergency:{" "}
                      <strong style={{ color: "var(--driver-text-main)" }}>
                        {driver.emergencyContact.phone}
                      </strong>{" "}
                      ({driver.emergencyContact.relation})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons (3 Buttons in a row) */}
          <div className="driver-action-buttons-grid">
            <button
              type="button"
              className="driver-btn-action-tile btn-action-assign"
              onClick={() => onAssignTrip(driver)}
              title="Assign Trip"
              id="btn-profile-assign-trip"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                local_shipping
              </span>
              <span>Assign Trip</span>
            </button>

            <button
              type="button"
              className="driver-btn-action-tile btn-action-call"
              onClick={() => onCallDriver(driver)}
              title="Contact Driver"
              id="btn-profile-call-driver"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--driver-primary)" }}>
                call
              </span>
              <span>Call Driver</span>
            </button>

            <button
              type="button"
              className="driver-btn-action-tile btn-action-suspend"
              onClick={() => onSuspendDriver(driver)}
              title="Suspend Driver"
              id="btn-profile-suspend-driver"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                block
              </span>
              <span>Suspend</span>
            </button>
          </div>
        </div>

        {/* Detail Sub-Navigation Tabs */}
        <div className="driver-detail-subtabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeSubtab === "overview"}
            className={`driver-subtab-btn ${activeSubtab === "overview" ? "active" : ""}`}
            onClick={() => setActiveSubtab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubtab === "kyc"}
            className={`driver-subtab-btn ${activeSubtab === "kyc" ? "active" : ""}`}
            onClick={() => setActiveSubtab("kyc")}
          >
            KYC &amp; Docs
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubtab === "bank"}
            className={`driver-subtab-btn ${activeSubtab === "bank" ? "active" : ""}`}
            onClick={() => setActiveSubtab("bank")}
            id="subtab-driver-management-bank"
          >
            <span>Management Bank</span>
            {driver.bankDetails?.isPending ? (
              <span className="driver-tab-sub-dot-amber" title="Pending Bank Verification" />
            ) : driver.bankDetails?.isActive ? (
              <span className="driver-tab-sub-dot-green" title="Bank Verified" />
            ) : null}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubtab === "trips"}
            className={`driver-subtab-btn ${activeSubtab === "trips" ? "active" : ""}`}
            onClick={() => setActiveSubtab("trips")}
          >
            Trips
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubtab === "wallet"}
            className={`driver-subtab-btn ${activeSubtab === "wallet" ? "active" : ""}`}
            onClick={() => setActiveSubtab("wallet")}
          >
            Wallet
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubtab === "performance"}
            className={`driver-subtab-btn ${activeSubtab === "performance" ? "active" : ""}`}
            onClick={() => setActiveSubtab("performance")}
          >
            Performance
          </button>
        </div>

        {/* Subtab Content Area */}
        <div className="driver-subtab-body">
          {/* TAB 1: KYC & Documents */}
          {activeSubtab === "kyc" && (
            <div className="driver-compliance-section">
              <div className="driver-compliance-header">
                <span className="driver-compliance-title">Mandatory Compliance Checklist</span>
                <span
                  className="driver-compliance-count-badge"
                  style={{
                    backgroundColor: isVerified ? "var(--driver-emerald-bg)" : "var(--driver-amber-bg)",
                    color: isVerified ? "var(--driver-emerald-text)" : "var(--driver-amber-text)",
                  }}
                >
                  {driver.kycCompletedCount || 5} / {driver.kycTotalCount || 5} Complete
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {(driver.complianceDocs || []).map((doc) => {
                  const isDocVerified = doc.status === "Verified" || doc.status === "Valid";
                  return (
                    <div key={doc.id} className="driver-compliance-doc-card">
                      <div className="driver-doc-left">
                        <span
                          className={`material-symbols-outlined ${
                            isDocVerified ? "driver-doc-icon-valid" : "driver-doc-icon-pending"
                          }`}
                        >
                          {isDocVerified ? "check_circle" : "schedule"}
                        </span>
                        <div className="driver-doc-texts">
                          <span className="driver-doc-name">{doc.name}</span>
                          <span className="driver-doc-meta">
                            {doc.number} • {doc.expiryDate}
                          </span>
                        </div>
                      </div>

                      <div className="driver-doc-right">
                        <span
                          className="driver-pill"
                          style={{
                            backgroundColor: isDocVerified
                              ? "var(--driver-emerald-bg)"
                              : doc.status === "Expired"
                              ? "var(--driver-error-container)"
                              : "var(--driver-amber-bg)",
                            color: isDocVerified
                              ? "var(--driver-emerald-text)"
                              : doc.status === "Expired"
                              ? "var(--driver-error-text)"
                              : "var(--driver-amber-text)",
                          }}
                        >
                          {doc.statusBadge || doc.status}
                        </span>

                        {doc.hasViewLink && (
                          <button
                            type="button"
                            className="driver-doc-view-link"
                            onClick={() => {
                              if (onPreviewDoc) {
                                onPreviewDoc(doc, driver);
                              } else {
                                setPanelPreviewDoc(doc);
                              }
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "0.2rem 0.4rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              color: "var(--driver-primary)",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                            }}
                            title={`Inspect ${doc.name}`}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                              visibility
                            </span>
                            <span>View</span>
                          </button>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: Management Bank */}
          {activeSubtab === "bank" && (
            <div className="driver-bank-section" id="driver-management-bank-section">
              <div className="driver-compliance-header">
                <span className="driver-compliance-title">Settlement Bank Account Management</span>
                <span
                  className="driver-compliance-count-badge"
                  style={{
                    backgroundColor:
                      driver.bankDetails?.isActive
                        ? "var(--driver-emerald-bg)"
                        : driver.bankDetails?.isRejected
                        ? "var(--driver-error-container)"
                        : "var(--driver-amber-bg)",
                    color:
                      driver.bankDetails?.isActive
                        ? "var(--driver-emerald-text)"
                        : driver.bankDetails?.isRejected
                        ? "var(--driver-error-text)"
                        : "var(--driver-amber-text)",
                  }}
                >
                  {driver.bankDetails?.status || (driver.bankDetails?.hasBank ? "Pending" : "Not Added")}
                </span>
              </div>

              {/* Status Banner with Payout Eligibility notice */}
              {driver.bankDetails?.isActive ? (
                <div className="driver-bank-status-banner approved">
                  <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "var(--driver-emerald)" }}>
                    verified
                  </span>
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--driver-emerald-text)", display: "block" }}>
                      Bank Account Approved &amp; Active
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--driver-text-muted)", marginTop: "2px", display: "block" }}>
                      This bank account is verified. Automated IMPS &amp; NEFT earnings distributions to this driver are <strong>UNLOCKED &amp; AUTHORIZED</strong>.
                    </span>
                  </div>
                </div>
              ) : driver.bankDetails?.isRejected ? (
                <div className="driver-bank-status-banner rejected">
                  <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "var(--driver-error-text)" }}>
                    cancel
                  </span>
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--driver-error-text)", display: "block" }}>
                      Bank Account Denied / Rejected
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--driver-text-muted)", marginTop: "2px", display: "block" }}>
                      This bank account was denied. Payout distributions to this driver are <strong>BLOCKED</strong> until a valid account is approved.
                    </span>
                  </div>
                </div>
              ) : driver.bankDetails?.hasBank ? (
                <div className="driver-bank-status-banner pending">
                  <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "var(--driver-amber)" }}>
                    hourglass_top
                  </span>
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--driver-amber-text)", display: "block" }}>
                      Pending Administrative Verification
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--driver-text-muted)", marginTop: "2px", display: "block" }}>
                      Driver has submitted bank account credentials. Payout distributions are <strong>BLOCKED</strong> until operations supervisor review.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="driver-bank-status-banner none">
                  <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "var(--driver-text-outline)" }}>
                    account_balance
                  </span>
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--driver-text-main)", display: "block" }}>
                      No Bank Account Linked
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--driver-text-muted)", marginTop: "2px", display: "block" }}>
                      The driver has not added bank details yet. Payout distributions cannot be processed until bank details are linked and approved.
                    </span>
                  </div>
                </div>
              )}

              {/* Bank Details Specs Card */}
              {driver.bankDetails?.hasBank ? (
                <div className="driver-bank-details-card">
                  <div className="driver-bank-detail-row">
                    <span className="driver-bank-label">Bank Institution</span>
                    <span className="driver-bank-value">
                      <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--driver-primary)" }}>
                        account_balance
                      </span>
                      {driver.bankDetails?.bankName || "Unknown Bank"}
                    </span>
                  </div>

                  <div className="driver-bank-detail-row">
                    <span className="driver-bank-label">Beneficiary Name</span>
                    <span className="driver-bank-value">
                      {driver.bankDetails?.accountHolderName || driver.name}
                      {driver.name && (
                        <span
                          style={{
                            fontSize: "0.65rem",
                            backgroundColor: "var(--driver-emerald-bg)",
                            color: "var(--driver-emerald-text)",
                            padding: "1px 6px",
                            borderRadius: "4px",
                            fontWeight: 600,
                          }}
                        >
                          Matched
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="driver-bank-detail-row">
                    <span className="driver-bank-label">Account Number</span>
                    <span className="driver-bank-value" style={{ fontFamily: "monospace" }}>
                      {showFullAccount
                        ? driver.bankDetails?.accountNumber
                        : driver.bankDetails?.accountNumberMasked || `•••• ${driver.bankDetails?.accountNumber?.slice(-4) || "—"}`}
                      <button
                        type="button"
                        onClick={() => setShowFullAccount((prev) => !prev)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--driver-primary)",
                          padding: "2px 4px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                        title={showFullAccount ? "Mask Account Number" : "Reveal Account Number"}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                          {showFullAccount ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(driver.bankDetails?.accountNumber, "acc")}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: copiedKey === "acc" ? "var(--driver-emerald)" : "var(--driver-text-outline)",
                          padding: "2px 4px",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                        title="Copy Account Number"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                          {copiedKey === "acc" ? "done" : "content_copy"}
                        </span>
                      </button>
                    </span>
                  </div>

                  <div className="driver-bank-detail-row">
                    <span className="driver-bank-label">IFSC Code</span>
                    <span className="driver-bank-value" style={{ fontFamily: "monospace" }}>
                      {driver.bankDetails?.ifscCode || "—"}
                      {driver.bankDetails?.ifscCode && (
                        <button
                          type="button"
                          onClick={() => handleCopy(driver.bankDetails?.ifscCode, "ifsc")}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: copiedKey === "ifsc" ? "var(--driver-emerald)" : "var(--driver-text-outline)",
                            padding: "2px 4px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                          title="Copy IFSC Code"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                            {copiedKey === "ifsc" ? "done" : "content_copy"}
                          </span>
                        </button>
                      )}
                    </span>
                  </div>

                  <div className="driver-bank-detail-row">
                    <span className="driver-bank-label">Disbursement Rail</span>
                    <span className="driver-bank-value" style={{ color: "var(--driver-primary)" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                        bolt
                      </span>
                      IMPS 24x7 Direct Rail
                    </span>
                  </div>

                  <div className="driver-bank-detail-row">
                    <span className="driver-bank-label">Payout Status</span>
                    <span
                      className="driver-bank-value"
                      style={{
                        color: driver.bankDetails?.isActive ? "var(--driver-emerald)" : "var(--driver-amber)",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                        {driver.bankDetails?.isActive ? "check_circle" : "block"}
                      </span>
                      {driver.bankDetails?.isActive
                        ? "Payouts Active (Approved)"
                        : "Payouts Disabled (Approval Required)"}
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Action Buttons: Approve or Deny */}
              {driver.bankDetails?.hasBank ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                  {showDenyConfirm ? (
                    <div
                      style={{
                        padding: "1rem",
                        backgroundColor: "var(--driver-surface-low)",
                        borderRadius: "8px",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.65rem",
                      }}
                    >
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--driver-error-text)" }}>
                        Confirm Denial of Bank Account
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--driver-text-muted)" }}>
                        Denying this account will immediately block all payout distributions for {driver.name}.
                      </span>
                      <input
                        type="text"
                        placeholder="Reason for denial (e.g. Invalid IFSC, Name mismatch)..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        style={{
                          height: "36px",
                          padding: "0 0.75rem",
                          borderRadius: "6px",
                          border: "1px solid var(--driver-surface-high)",
                          backgroundColor: "var(--driver-surface)",
                          color: "var(--driver-text-main)",
                          fontSize: "0.785rem",
                          outline: "none",
                        }}
                      />
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="driver-btn-action-tile"
                          style={{ height: "34px", padding: "0 0.85rem", background: "none" }}
                          onClick={() => setShowDenyConfirm(false)}
                          disabled={isProcessingBank}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn-deny-bank"
                          style={{ height: "34px", flex: "none", padding: "0 1rem" }}
                          onClick={() => handleBankAction("Rejected", rejectionReason)}
                          disabled={isProcessingBank}
                        >
                          {isProcessingBank ? "Processing..." : "Confirm Denial"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      {!driver.bankDetails?.isActive && (
                        <button
                          type="button"
                          className="btn-approve-bank"
                          onClick={() => handleBankAction("Active")}
                          disabled={isProcessingBank}
                          id="btn-profile-approve-bank"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                            check_circle
                          </span>
                          <span>{isProcessingBank ? "Approving..." : "Approve Bank Account"}</span>
                        </button>
                      )}

                      {!driver.bankDetails?.isRejected && (
                        <button
                          type="button"
                          className="btn-deny-bank"
                          onClick={() => setShowDenyConfirm(true)}
                          disabled={isProcessingBank}
                          id="btn-profile-deny-bank"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                            cancel
                          </span>
                          <span>Deny Bank Account</span>
                        </button>
                      )}

                      {driver.bankDetails?.isActive && (
                        <div style={{ width: "100%", textAlign: "center" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--driver-emerald-text)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>verified</span>
                            Account verified. Payouts can be distributed.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--driver-text-muted)", fontSize: "0.8rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "var(--driver-text-outline)", marginBottom: "0.5rem" }}>
                    credit_card_off
                  </span>
                  <p style={{ margin: 0, fontWeight: 600 }}>No Bank Details Available</p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem" }}>
                    The driver can link their bank account using the HireD Driver mobile application.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Overview & Current Assignment Telemetry */}
          {activeSubtab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {driver.currentAssignment ? (
                <div className="driver-telemetry-box">
                  <div className="driver-telemetry-header">
                    <span className="driver-telemetry-heading">Current Assignment &amp; Telemetry</span>
                    <span className="driver-telemetry-trip-code">
                      Active Trip #{driver.currentAssignment.tripId}
                    </span>
                  </div>

                  <div className="driver-telemetry-card">
                    <div className="driver-telemetry-route-row">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="material-symbols-outlined" style={{ color: "var(--driver-primary)", fontSize: "20px" }}>
                          navigation
                        </span>
                        <div>
                          <div className="driver-telemetry-origin-dest">
                            {driver.currentAssignment.origin} → {driver.currentAssignment.destination}
                          </div>
                          <div className="driver-telemetry-payload">
                            {driver.currentAssignment.payload}
                          </div>
                        </div>
                      </div>
                      <span className="driver-telemetry-dist">
                        {driver.currentAssignment.distanceKm} km total
                      </span>
                    </div>

                    <div className="driver-telemetry-status-strip">
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="driver-pulse-green" />
                        <span>
                          GPS Live: <strong>{driver.currentAssignment.corridorRoute}</strong>
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>
                          Speed: <strong>{driver.currentAssignment.currentSpeed}</strong>
                        </span>
                        <span style={{ color: "var(--driver-primary)", fontWeight: "700" }}>
                          ETA: {driver.currentAssignment.eta}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="driver-telemetry-box" style={{ textAlign: "center", padding: "2rem 1rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "var(--driver-text-outline)" }}>
                    local_shipping
                  </span>
                  <p style={{ fontWeight: "700", marginTop: "0.5rem", marginBottom: "0.25rem" }}>
                    No Active Trip Assignment
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--driver-text-muted)", margin: 0 }}>
                    Driver is currently available for dispatch on {driver.corridor}.
                  </p>
                </div>
              )}

              {/* Assigned Vehicle Specs */}
              <div style={{ padding: "0.85rem 1rem", backgroundColor: "var(--driver-surface-low)", borderRadius: "8px", border: "1px solid var(--driver-surface-high)" }}>
                <span className="driver-compliance-title">Assigned Fleet Vehicle</span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.4rem" }}>
                  <div>
                    {driver.vehicle?.isAssigned && driver.vehicle?.number && driver.vehicle?.number !== "None" ? (
                      <>
                        <strong style={{ fontSize: "0.85rem", color: "var(--driver-text-main)" }}>
                          {driver.vehicle?.number}
                        </strong>
                        <div style={{ fontSize: "0.725rem", color: "var(--driver-text-muted)" }}>
                          {driver.vehicle?.type} • {driver.vehicle?.bodyType}
                        </div>
                      </>
                    ) : (
                      <>
                        <strong style={{ fontSize: "0.85rem", color: "var(--driver-text-muted)" }}>
                          None
                        </strong>
                        <div style={{ fontSize: "0.725rem", color: "var(--driver-amber-text)" }}>
                          Awaiting Admin Fleet Vehicle Assignment
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onReassignVehicle(driver)}
                    style={{
                      background: "none",
                      border: "1px solid var(--driver-surface-high)",
                      borderRadius: "6px",
                      padding: "0.3rem 0.65rem",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      color: "var(--driver-primary)",
                      cursor: "pointer",
                      backgroundColor: "var(--driver-surface)",
                    }}
                  >
                    {driver.requestedVehicle?.hasRequest
                      ? "Review Request"
                      : driver.vehicle?.isAssigned && driver.vehicle?.number && driver.vehicle?.number !== "None"
                      ? "Change Vehicle"
                      : "Assign Vehicle"}
                  </button>
                </div>

                {driver.requestedVehicle?.hasRequest && (
                  <div
                    style={{
                      marginTop: "0.6rem",
                      padding: "0.65rem 0.85rem",
                      background: "linear-gradient(135deg, rgba(81, 69, 245, 0.08) 0%, rgba(99, 102, 241, 0.03) 100%)",
                      border: "1.5px dashed rgba(81, 69, 245, 0.35)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span className="material-symbols-outlined" style={{ color: "var(--driver-primary)", fontSize: "20px" }}>
                        stars
                      </span>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--driver-primary)" }}>
                          Driver Requested Own Vehicle: {driver.requestedVehicle.number}
                        </div>
                        <div style={{ fontSize: "0.6875rem", color: "var(--driver-text-muted)" }}>
                          {driver.requestedVehicle.type} • Pending Review
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onReassignVehicle(driver)}
                      style={{
                        background: "var(--driver-primary)",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.3rem 0.65rem",
                        fontSize: "0.6875rem",
                        fontWeight: "700",
                        color: "#ffffff",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        boxShadow: "0 2px 4px rgba(81, 69, 245, 0.25)",
                      }}
                    >
                      <span>Review</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: Trip History */}
          {activeSubtab === "trips" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <span className="driver-compliance-title">Completed Corridor Trips</span>
              {(driver.recentTrips && driver.recentTrips.length > 0) ? (
                driver.recentTrips.map((tr) => (
                  <div
                    key={tr.id}
                    style={{
                      padding: "0.85rem 1rem",
                      backgroundColor: "var(--driver-surface-low)",
                      borderRadius: "8px",
                      border: "1px solid var(--driver-surface-high)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.8125rem", color: "var(--driver-text-main)" }}>
                        {tr.route}
                      </strong>
                      <div style={{ fontSize: "0.7rem", color: "var(--driver-text-muted)" }}>
                        #{tr.id} • {tr.date}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "0.85rem", color: "var(--driver-text-main)" }}>
                        {formatINR(tr.fare)}
                      </strong>
                      <div style={{ fontSize: "0.7rem", color: "#f59e0b", fontWeight: "700" }}>
                        ★ {tr.rating}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--driver-text-muted)", fontSize: "0.8rem" }}>
                  No trip history available for this profile.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Wallet & Settlements */}
          {activeSubtab === "wallet" && (
            <div className="driver-wallet-section">
              <div className="driver-wallet-header">
                <span className="driver-wallet-title">Driver Wallet &amp; Payout Summary</span>
                <span style={{ fontSize: "0.7rem", color: "var(--driver-text-outline)" }}>
                  {driver.wallet?.payoutMode} Payout Enabled
                </span>
              </div>

              <div className="driver-wallet-grid-2col">
                <div className="driver-wallet-card">
                  <span className="driver-wallet-card-label">Available Balance</span>
                  <div className="driver-wallet-card-amount">
                    {formatINR(driver.wallet?.availableBalance)}
                  </div>
                  <span className="driver-wallet-card-sub">Ready for withdrawal</span>
                </div>

                <div className="driver-wallet-card">
                  <span className="driver-wallet-card-label">Total Lifetime Earned</span>
                  <div className="driver-wallet-card-amount">
                    {formatINR(driver.wallet?.lifetimeEarned)}
                  </div>
                  <span style={{ fontSize: "0.6875rem", color: "var(--driver-text-muted)" }}>
                    Across {driver.tripsCompleted} completed trips
                  </span>
                </div>
              </div>

              <div className="driver-wallet-history-strip">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--driver-primary)" }}>
                    payments
                  </span>
                  <span>
                    Last settlement:{" "}
                    <strong>{formatINR(driver.wallet?.lastSettlementAmount)}</strong> transferred via{" "}
                    {driver.wallet?.payoutMode} on <strong>{driver.wallet?.lastSettlementDate}</strong>
                  </span>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--driver-emerald)" }}>
                  check
                </span>
              </div>

              <button
                type="button"
                className="driver-btn-wallet-ledger"
                onClick={() => alert(`Opening ledger for ${driver.name}`)}
              >
                <span>View Wallet Ledger &amp; Payouts</span>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  arrow_forward
                </span>
              </button>
            </div>
          )}

          {/* TAB 5: Performance */}
          {activeSubtab === "performance" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <span className="driver-compliance-title">Quarterly Driver Telemetry Scores</span>
              {driver.tripsCompleted > 0 && driver.performance?.hasTelemetry ? (
                <div className="driver-wallet-grid-2col">
                  <div className="driver-wallet-card">
                    <span className="driver-wallet-card-label">Safety Score</span>
                    <div className="driver-wallet-card-amount" style={{ color: "var(--driver-emerald)" }}>
                      {driver.performance?.safetyScore}
                    </div>
                    <span className="driver-wallet-card-sub">{driver.performance?.safetyScoreSub || "No harsh braking alerts"}</span>
                  </div>

                  <div className="driver-wallet-card">
                    <span className="driver-wallet-card-label">On-Time Delivery</span>
                    <div className="driver-wallet-card-amount" style={{ color: "var(--driver-primary)" }}>
                      {driver.performance?.onTimeDeliveryRate}
                    </div>
                    <span style={{ fontSize: "0.6875rem", color: "var(--driver-text-muted)" }}>
                      {driver.performance?.onTimeDeliverySub || "Corridor benchmark: 95%"}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: "1.25rem",
                    backgroundColor: "var(--driver-surface-low)",
                    borderRadius: "10px",
                    border: "1px dashed var(--driver-surface-high)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        backgroundColor: "var(--driver-amber-bg)",
                        color: "var(--driver-amber-text)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        analytics
                      </span>
                    </div>
                    <div>
                      <strong style={{ fontSize: "0.8125rem", color: "var(--driver-text-main)", display: "block" }}>
                        No Telemetry Data Recorded Yet
                      </strong>
                      <span style={{ fontSize: "0.725rem", color: "var(--driver-text-muted)" }}>
                        Telemetry &amp; safety scores are computed dynamically from completed freight trips
                      </span>
                    </div>
                  </div>

                  <div className="driver-wallet-grid-2col">
                    <div className="driver-wallet-card" style={{ opacity: 0.65, backgroundColor: "var(--driver-surface)" }}>
                      <span className="driver-wallet-card-label">Safety Score</span>
                      <div className="driver-wallet-card-amount" style={{ color: "var(--driver-text-outline)" }}>
                        N/A
                      </div>
                      <span className="driver-wallet-card-sub">0 trips completed</span>
                    </div>

                    <div className="driver-wallet-card" style={{ opacity: 0.65, backgroundColor: "var(--driver-surface)" }}>
                      <span className="driver-wallet-card-label">On-Time Delivery</span>
                      <div className="driver-wallet-card-amount" style={{ color: "var(--driver-text-outline)" }}>
                        N/A
                      </div>
                      <span style={{ fontSize: "0.6875rem", color: "var(--driver-text-muted)" }}>
                        Awaiting trip history
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Verification Bottom Action Bar */}
        <div className="driver-profile-bottom-bar">
          <button
            type="button"
            className="driver-btn-verified-green"
            onClick={() => onVerifyKyc(driver)}
            id="btn-footer-verify-docs"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              verified
            </span>
            <span>{isVerified ? "✓ Documents Verified" : "Review & Verify Documents"}</span>
          </button>

          <button
            type="button"
            className="driver-btn-reassign-vehicle"
            onClick={() => onReassignVehicle(driver)}
            id="btn-footer-reassign-vehicle"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: driver.requestedVehicle?.hasRequest ? "var(--driver-primary)" : "var(--driver-text-outline)" }}>
              {driver.requestedVehicle?.hasRequest
                ? "stars"
                : driver.vehicle?.isAssigned && driver.vehicle?.number !== "None"
                ? "swap_horiz"
                : "add_circle"}
            </span>
            <span>
              {driver.requestedVehicle?.hasRequest
                ? "Review Requested Vehicle"
                : driver.vehicle?.isAssigned && driver.vehicle?.number !== "None"
                ? "Re-assign Fleet Vehicle"
                : "Assign Fleet Vehicle"}
            </span>
          </button>

        </div>
      </div>

      {/* Embedded Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={Boolean(panelPreviewDoc)}
        document={panelPreviewDoc}
        driver={driver}
        onClose={() => setPanelPreviewDoc(null)}
      />
    </aside>
  );
}

DriverProfilePanel.propTypes = {
  driver: PropTypes.object,
  onAssignTrip: PropTypes.func.isRequired,
  onVerifyKyc: PropTypes.func.isRequired,
  onPreviewDoc: PropTypes.func,
  onReassignVehicle: PropTypes.func.isRequired,
  onCallDriver: PropTypes.func.isRequired,
  onSuspendDriver: PropTypes.func.isRequired,
  onVerifyBank: PropTypes.func,
  initialSubtab: PropTypes.string,
};

