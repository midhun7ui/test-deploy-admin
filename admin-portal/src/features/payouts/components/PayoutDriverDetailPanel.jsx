/**
 * PayoutDriverDetailPanel Component
 * 360° Selected Payout & Driver Digital Wallet Inspector Pane
 * Renders exact real driver profile, calculations, wallet transactions, and documents.
 */

import { useState } from "react";

export default function PayoutDriverDetailPanel({
  payout,
  onApproveDisburse,
  onHoldForAudit,
  onOpenManualUTR,
  onDownloadVoucher,
  onShareSettlement,
}) {
  const [activeInnerTab, setActiveInnerTab] = useState("breakdown");

  if (!payout) {
    return (
      <div className="payout-detail-panel">
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--pay-text-muted)" }}>
          Select a payout record to inspect calculation breakdown and driver digital wallet.
        </div>
      </div>
    );
  }

  const { driver, trip } = payout;
  const netAmountDisplay = payout.netPayableDisplay || payout.netPayoutDisplay || "₹0.00";
  const driverFirstName = driver.name ? driver.name.split(" ")[0] : "Driver";

  return (
    <div className="payout-detail-panel">
      {/* 1. Driver Profile Hero Header */}
      <div className="payout-driver-hero-header">
        <div className="driver-identity-cluster">
          <div className="driver-photo-box">
            {driver.photo ? (
              <img
                src={driver.photo}
                alt={driver.name}
                className="driver-photo-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div
                className="driver-avatar-pod"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "var(--pay-radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  backgroundColor: "var(--pay-primary-glow)",
                  color: "var(--pay-primary)",
                }}
              >
                {driver.initials}
              </div>
            )}
            {driver.isOnline && <span className="driver-online-indicator" />}
          </div>

          <div className="driver-titles-cluster">
            <div className="driver-name-verified">
              <h3 className="driver-name-text">{driver.name}</h3>
              {driver.isVerified && (
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1.125rem", color: "var(--pay-primary)" }}
                  title="KYC Verified"
                >
                  verified
                </span>
              )}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--pay-text-muted)" }}>
              ID: {driver.driverCode} •{" "}
              <strong style={{ color: "var(--pay-text)" }}>{driver.phone}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <button
            type="button"
            className="btn-reload-batch"
            style={{ width: "2rem", height: "2rem", border: "none" }}
            title="Download Payout Voucher"
            onClick={() => onDownloadVoucher && onDownloadVoucher(payout)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
              receipt
            </span>
          </button>
          <button
            type="button"
            className="btn-reload-batch"
            style={{ width: "2rem", height: "2rem", border: "none" }}
            title="Share Settlement"
            onClick={() => onShareSettlement && onShareSettlement(payout)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
              share
            </span>
          </button>
        </div>
      </div>

      {/* 2. Rating & Metrics Row */}
      <div className="driver-metrics-3col">
        <div className="driver-metric-box">
          <span className="driver-metric-label">Rating</span>
          <span className="driver-metric-val" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
            {driver.rating}{" "}
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "0.85rem", color: "#f59e0b", fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          </span>
        </div>
        <div className="driver-metric-box">
          <span className="driver-metric-label">Trips Done</span>
          <span className="driver-metric-val">{driver.tripsDone} Trips</span>
        </div>
        <div className="driver-metric-box">
          <span className="driver-metric-label">Compliance</span>
          <span
            className="driver-metric-val"
            style={{
              color: driver.isVerified || driver.compliance?.includes("Verified")
                ? "var(--pay-emerald)"
                : "var(--pay-amber)",
            }}
          >
            {driver.compliance}
          </span>
        </div>
      </div>

      {/* 3. Inner Pane Tabs */}
      <div className="payout-inner-tabs-bar">
        <button
          type="button"
          className={`payout-inner-tab-btn ${activeInnerTab === "breakdown" ? "active" : ""}`}
          onClick={() => setActiveInnerTab("breakdown")}
        >
          Payout Breakdown
        </button>
        <button
          type="button"
          className={`payout-inner-tab-btn ${activeInnerTab === "wallet" ? "active" : ""}`}
          onClick={() => setActiveInnerTab("wallet")}
        >
          Wallet Ledger
        </button>
        <button
          type="button"
          className={`payout-inner-tab-btn ${activeInnerTab === "trip" ? "active" : ""}`}
          onClick={() => setActiveInnerTab("trip")}
        >
          Trip Details
        </button>
        <button
          type="button"
          className={`payout-inner-tab-btn ${activeInnerTab === "kyc" ? "active" : ""}`}
          onClick={() => setActiveInnerTab("kyc")}
        >
          Bank &amp; KYC
        </button>
      </div>

      {/* Tab Content */}
      {activeInnerTab === "breakdown" && (
        <>
          {/* Payout Calculation & Split Detailed Card */}
          <div className="calculation-breakdown-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--pay-outline)" }}>
                Calculation Breakdown
              </span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--pay-primary)" }}>
                {trip.tripCode} ({trip.origin} → {trip.destination})
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div className="breakdown-line-row">
                <span style={{ color: "var(--pay-text-muted)" }}>Agreed Gross Trip Rate</span>
                <span style={{ fontWeight: 600 }}>{trip.grossAmountDisplay}</span>
              </div>

              <div className="partner-share-highlight-box">
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>
                    arrow_downward
                  </span>
                  Partner Contract Share ({trip.splitPct || 70}%)
                </span>
                <span style={{ fontWeight: 700 }}>{trip.partnerShareDisplay}</span>
              </div>

              <div className="breakdown-line-row" style={{ padding: "0 0.25rem" }}>
                <span style={{ color: "var(--pay-text-muted)" }}>
                  Platform Retained Fee ({trip.platformFeePct || (100 - (trip.splitPct || 70))}%)
                </span>
                <span style={{ color: "var(--pay-outline)" }}>
                  {trip.platformFeeDisplay}
                </span>
              </div>

              <div className="breakdown-line-row" style={{ padding: "0 0.25rem" }}>
                <span style={{ color: "var(--pay-text-muted)" }}>Fuel / Fastag Reimbursed</span>
                <span style={{ fontWeight: 600, color: "var(--pay-emerald)" }}>
                  {trip.fuelFastagReimbursedDisplay || "+₹0.00"}
                </span>
              </div>

              <div className="breakdown-line-row" style={{ padding: "0 0.25rem" }}>
                <span style={{ color: "var(--pay-danger)" }}>Trip Advance Deducted (Disbursed)</span>
                <span style={{ fontWeight: 600, color: "var(--pay-danger)" }}>
                  {trip.advanceDeductedDisplay || "-₹0.00"}
                </span>
              </div>

              <div className="dashed-divider-line" />

              <div className="net-payable-highlight-pod">
                <div>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--pay-outline)", display: "block" }}>
                    Net Payable to {driverFirstName}
                  </span>
                  <span style={{ fontSize: "0.6875rem", color: "var(--pay-text-muted)" }}>
                    After 1% TDS Sec 194C deduction
                  </span>
                </div>
                <span style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--pay-primary)" }}>
                  {netAmountDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Digital Wallet Balance Status Section */}
          <div className="virtual-wallet-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", color: "var(--pay-outline)" }}>
                Virtual Driver Wallet
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.6875rem", fontWeight: 700, color: "var(--pay-emerald)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--pay-emerald)" }} />
                Active Ledger
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--pay-text)" }}>
                  {driver.walletBalanceDisplay}
                </span>
                <span style={{ fontSize: "0.6875rem", color: "var(--pay-outline)", display: "block" }}>
                  Current Withdrawable Balance
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--pay-text)" }}>
                  {driver.lifetimeSettledDisplay}
                </span>
                <span style={{ fontSize: "0.6875rem", color: "var(--pay-outline)", display: "block" }}>
                  Lifetime Settled
                </span>
              </div>
            </div>
          </div>

          {/* External Banking & Beneficiary Specs */}
          <div className="banking-specs-list">
            <div className="banking-spec-row">
              <span className="banking-spec-label">Bank &amp; Account</span>
              <span className="banking-spec-val">{driver.bankAccountMasked}</span>
            </div>
            <div className="banking-spec-row">
              <span className="banking-spec-label">IFSC Code</span>
              <span className="banking-spec-val">{driver.ifscCode}</span>
            </div>
            <div className="banking-spec-row">
              <span className="banking-spec-label">Beneficiary Match</span>
              <span
                className="banking-spec-val"
                style={{
                  color: driver.beneficiaryMatch?.includes("100%")
                    ? "var(--pay-emerald)"
                    : "var(--pay-outline)",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {driver.beneficiaryMatch?.includes("100%") && (
                  <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>
                    check
                  </span>
                )}
                {driver.beneficiaryName} ({driver.beneficiaryMatch})
              </span>
            </div>
            <div className="banking-spec-row">
              <span className="banking-spec-label">Disbursement Rail</span>
              <span className="banking-spec-val" style={{ color: "var(--pay-primary)" }}>
                {driver.disbursementRail}
              </span>
            </div>
            <div className="banking-spec-row">
              <span className="banking-spec-label">Bank Approval</span>
              <span
                className="banking-spec-val"
                style={{
                  color: driver.bankStatus === "Active" || driver.isBankApproved
                    ? "var(--pay-emerald)"
                    : "var(--pay-amber)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>
                  {driver.bankStatus === "Active" || driver.isBankApproved ? "verified" : "hourglass_top"}
                </span>
                {driver.bankStatus === "Active" || driver.isBankApproved ? "Approved" : (driver.bankStatus || "Pending Approval")}
              </span>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="payout-action-buttons-stack">
            {!(driver.bankStatus === "Active" || driver.isBankApproved) && (
              <div
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "var(--pay-radius-md)",
                  padding: "0.75rem 0.85rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  fontSize: "0.75rem",
                  color: "var(--pay-amber)",
                  marginBottom: "0.25rem",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1.125rem", flexShrink: 0 }}>
                  lock
                </span>
                <div>
                  <strong style={{ display: "block", color: "var(--pay-amber)" }}>
                    Payout Blocked — Bank Account Not Approved
                  </strong>
                  <span>
                    Only approved bank accounts can receive payouts. Current status is <strong>{driver.bankStatus || "Pending"}</strong>. Approve the account in Driver Management to disburse.
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              className="btn-approve-disburse"
              onClick={() => {
                if (driver.bankStatus !== "Active" && !driver.isBankApproved) return;
                onApproveDisburse(payout);
              }}
              disabled={driver.bankStatus !== "Active" && !driver.isBankApproved}
              style={{
                opacity: (driver.bankStatus === "Active" || driver.isBankApproved) ? 1 : 0.5,
                cursor: (driver.bankStatus === "Active" || driver.isBankApproved) ? "pointer" : "not-allowed",
              }}
              title={
                (driver.bankStatus === "Active" || driver.isBankApproved)
                  ? "Approve & execute instant IMPS disbursement"
                  : `Payout distribution blocked: Driver bank status is ${driver.bankStatus || "Pending"}. Only approved accounts can receive payouts.`
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
                {(driver.bankStatus === "Active" || driver.isBankApproved) ? "verified_user" : "lock"}
              </span>
              {(driver.bankStatus === "Active" || driver.isBankApproved)
                ? `Approve & Disburse Payout (${netAmountDisplay})`
                : `Blocked: Bank ${driver.bankStatus || "Pending"}`}
            </button>

            <div className="payout-2button-grid">
              <button
                type="button"
                className="btn-payout-secondary"
                onClick={() => onHoldForAudit(payout)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "var(--pay-amber)" }}>
                  pause_circle
                </span>
                Hold for Audit
              </button>

              <button
                type="button"
                className="btn-payout-secondary"
                onClick={() => onOpenManualUTR(payout)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "var(--pay-outline)" }}>
                  history_edu
                </span>
                Manual UTR
              </button>
            </div>

            <p style={{ fontSize: "0.6875rem", color: "var(--pay-outline)", textAlign: "center", margin: "0.25rem 0 0 0", lineHeight: 1.35 }}>
              Disbursements are strictly logged under GST &amp; Section 194C guidelines. Funds are transferred via direct verified bank rails.
            </p>
          </div>
        </>
      )}

      {/* 4. Real Driver Wallet Ledger Tab */}
      {activeInnerTab === "wallet" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "var(--pay-text)" }}>
              Digital Wallet Transactions
            </span>
            <span style={{ fontSize: "0.6875rem", color: "var(--pay-outline)" }}>
              Available: <strong>{driver.walletBalanceDisplay}</strong>
            </span>
          </div>

          {driver.walletTransactions && driver.walletTransactions.length > 0 ? (
            driver.walletTransactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  padding: "0.75rem",
                  backgroundColor: "var(--pay-card-low)",
                  borderRadius: "var(--pay-radius-md)",
                  border: "1px solid var(--pay-border-card)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                  <span style={{ color: "var(--pay-text)" }}>{tx.description}</span>
                  <span
                    style={{
                      color: tx.amount >= 0 ? "var(--pay-emerald)" : "var(--pay-danger)",
                      fontWeight: 700,
                    }}
                  >
                    {tx.amountDisplay}
                  </span>
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--pay-outline)", marginTop: 4 }}>
                  {tx.date} {tx.tripCode ? `· ${tx.tripCode}` : ""} ·{" "}
                  {tx.type === "credit_trip_share" ? "Credit to Wallet" : tx.type}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                color: "var(--pay-outline)",
                backgroundColor: "var(--pay-card-low)",
                borderRadius: "var(--pay-radius-md)",
              }}
            >
              No wallet transactions recorded for {driver.name}.
            </div>
          )}
        </div>
      )}

      {/* 5. Real Trip Details Tab */}
      {activeInnerTab === "trip" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.75rem" }}>
          <div style={{ fontWeight: 700, color: "var(--pay-text)" }}>
            Assigned Freight &amp; Telemetry
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <div style={{ padding: "0.6rem", backgroundColor: "var(--pay-card-low)", borderRadius: "var(--pay-radius-md)" }}>
              <span style={{ color: "var(--pay-outline)", display: "block", fontSize: "0.6875rem" }}>Vehicle</span>
              <strong style={{ color: "var(--pay-text)" }}>{driver.vehicleNumber}</strong>
            </div>
            <div style={{ padding: "0.6rem", backgroundColor: "var(--pay-card-low)", borderRadius: "var(--pay-radius-md)" }}>
              <span style={{ color: "var(--pay-outline)", display: "block", fontSize: "0.6875rem" }}>Classification</span>
              <strong style={{ color: "var(--pay-text)" }}>{driver.vehicleTonnage}</strong>
            </div>
          </div>

          {driver.vehicleModel && (
            <div style={{ padding: "0.6rem", backgroundColor: "var(--pay-card-low)", borderRadius: "var(--pay-radius-md)" }}>
              <span style={{ color: "var(--pay-outline)", display: "block", fontSize: "0.6875rem" }}>Vehicle Model</span>
              <strong style={{ color: "var(--pay-text)" }}>{driver.vehicleModel}</strong>
            </div>
          )}

          <div style={{ padding: "0.6rem", backgroundColor: "var(--pay-card-low)", borderRadius: "var(--pay-radius-md)" }}>
            <span style={{ color: "var(--pay-outline)", display: "block", fontSize: "0.6875rem" }}>Corridor Transit Route</span>
            <strong style={{ color: "var(--pay-text)" }}>{trip.corridor}</strong>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <div style={{ padding: "0.6rem", backgroundColor: "var(--pay-card-low)", borderRadius: "var(--pay-radius-md)" }}>
              <span style={{ color: "var(--pay-outline)", display: "block", fontSize: "0.6875rem" }}>Cargo Type</span>
              <strong style={{ color: "var(--pay-text)", textTransform: "capitalize" }}>{trip.cargoType}</strong>
            </div>
            <div style={{ padding: "0.6rem", backgroundColor: "var(--pay-card-low)", borderRadius: "var(--pay-radius-md)" }}>
              <span style={{ color: "var(--pay-outline)", display: "block", fontSize: "0.6875rem" }}>Settlement Status</span>
              <strong style={{ color: "var(--pay-primary)" }}>{payout.status}</strong>
            </div>
          </div>

          <div style={{ padding: "0.6rem", backgroundColor: "var(--pay-card-low)", borderRadius: "var(--pay-radius-md)" }}>
            <span style={{ color: "var(--pay-outline)", display: "block", fontSize: "0.6875rem" }}>Pickup &amp; Delivery Locations</span>
            <div style={{ marginTop: 2, color: "var(--pay-text)" }}>
              <strong>From:</strong> {trip.pickupAddress || trip.origin}
            </div>
            <div style={{ marginTop: 2, color: "var(--pay-text)" }}>
              <strong>To:</strong> {trip.deliveryAddress || trip.destination}
            </div>
          </div>
        </div>
      )}

      {/* 6. Real Statutory KYC & Bank Profile Tab */}
      {activeInnerTab === "kyc" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.75rem" }}>
          <div style={{ fontWeight: 700, color: "var(--pay-text)" }}>
            Statutory KYC &amp; Bank Profile
          </div>

          {/* Real Documents */}
          <div style={{ padding: "0.75rem", backgroundColor: "var(--pay-card-low)", borderRadius: "var(--pay-radius-md)" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--pay-outline)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              Uploaded Compliance Documents
            </div>
            {driver.documents && driver.documents.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {driver.documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.3rem 0",
                      borderBottom: "1px dashed var(--pay-border-card)",
                    }}
                  >
                    <div>
                      <strong style={{ color: "var(--pay-text)" }}>{doc.type}</strong>
                      <div style={{ fontSize: "0.6875rem", color: "var(--pay-outline)" }}>
                        {doc.expiry}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "1rem",
                        backgroundColor:
                          doc.status === "Verified"
                            ? "var(--pay-emerald-bg)"
                            : "var(--pay-amber-bg)",
                        color:
                          doc.status === "Verified"
                            ? "var(--pay-emerald)"
                            : "var(--pay-amber)",
                      }}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "var(--pay-outline)", padding: "0.5rem 0" }}>
                No statutory compliance documents uploaded.
              </div>
            )}
          </div>

          {/* Real Bank Account Verification Status */}
          <div style={{ padding: "0.75rem", backgroundColor: "var(--pay-card-low)", borderRadius: "var(--pay-radius-md)" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--pay-outline)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              Bank Account Verification
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <span>Bank Name</span>
              <strong style={{ color: "var(--pay-text)" }}>{driver.bankName}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <span>Account Number</span>
              <strong style={{ color: "var(--pay-text)" }}>{driver.bankAccountMasked}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <span>IFSC Code</span>
              <strong style={{ color: "var(--pay-text)" }}>{driver.ifscCode}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Verification Status</span>
              <strong
                style={{
                  color:
                    driver.bankStatus === "Active"
                      ? "var(--pay-emerald)"
                      : driver.bankStatus === "Pending"
                      ? "var(--pay-amber)"
                      : "var(--pay-outline)",
                }}
              >
                {driver.bankStatus}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
