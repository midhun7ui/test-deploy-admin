import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { companiesApi } from "../services/companiesApi";

function CompanyProfilePanel({
  company,
  onOpenAdjustCredit,
  onOpenEditSplit,
  onDownloadDossier,
  onEditCompany,
  onToggleSuspend,
  onViewLedger,
  onOpenAddAssociate,
  onResetAssociatePassword,
  onToggleAssociateStatus,
  associatesUpdateTrigger,
}) {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [associates, setAssociates] = useState([]);
  const [loadingAssociates, setLoadingAssociates] = useState(false);
  const [copiedEmailId, setCopiedEmailId] = useState(null);

  const fetchAssociates = useCallback(async () => {
    if (!company) return;
    try {
      setLoadingAssociates(true);
      const res = await companiesApi.getCompanyAssociates(company.id || company.code);
      setAssociates(res.associates || []);
    } catch (err) {
      console.error("Error loading associates:", err);
    } finally {
      setLoadingAssociates(false);
    }
  }, [company]);

  useEffect(() => {
    fetchAssociates();
  }, [fetchAssociates, associatesUpdateTrigger]);

  if (!company) {
    return (
      <div className="company-profile-panel">
        <p style={{ color: "var(--comp-outline)", textAlign: "center" }}>
          Select a company to view the dossier.
        </p>
      </div>
    );
  }

  const subTabs = [
    { id: "overview", label: "Overview" },
    { id: "associates", label: `Associates (${associates.length})` },
    { id: "contracts", label: "Contracts & Split" },
    { id: "trips", label: `Live Trips (${company.metrics.inTransit})` },
    { id: "ledger", label: "Ledger & Invoices" },
    { id: "audit", label: "Audit Log" },
  ];


  const isBreached = company.status === "Credit Breach";

  return (
    <div className="company-profile-panel" id="company-profile-panel">
      {/* Drawer Header */}
      <div className="profile-drawer-header">
        <div className="profile-identity-cluster">
          <div className="profile-avatar-large">{company.initials}</div>
          <div className="profile-titles">
            <h2 className="profile-company-name">
              <span>{company.name}</span>
              {company.gstVerified && (
                <span
                  className="material-symbols-outlined verified-icon"
                  title="Enterprise Verified"
                >
                  verified
                </span>
              )}
            </h2>
            <div className="profile-meta-chips">
              <span className="profile-code">{company.code}</span>
              <span className="profile-dot-divider"></span>
              <span className="profile-tier-pill">{company.tier}</span>
              <span className="profile-dot-divider"></span>
              <span className="profile-active-date">
                Active since {company.activeSince}
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="profile-header-actions">
          <button
            type="button"
            className="btn-profile-action"
            title="Edit Company Details"
            onClick={() => onEditCompany(company)}
            id="btn-edit-company"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            type="button"
            className="btn-profile-action"
            title="Download Account Dossier"
            onClick={() => onDownloadDossier(company)}
            id="btn-download-dossier"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
          </button>
          <button
            type="button"
            className="btn-profile-action danger"
            title={company.status === "Suspended" ? "Reactivate Company" : "Suspend Account"}
            onClick={() => onToggleSuspend(company)}
            id="btn-suspend-company"
          >
            <span className="material-symbols-outlined text-[18px]">
              {company.status === "Suspended" ? "check_circle" : "block"}
            </span>
          </button>
        </div>
      </div>

      {/* Drawer Subtabs */}
      <div className="profile-subtabs" role="tablist">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`profile-subtab-btn ${isActive ? "active" : ""}`}
              onClick={() => setActiveSubTab(tab.id)}
              role="tab"
              aria-selected={isActive}
              id={`subtab-${tab.id}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeSubTab === "overview" && (
        <>
          {/* Section 1: Business & Tax Information */}
          <div className="profile-section-card">
            <div className="section-header-row">
              <span className="section-title">Business &amp; Tax Compliance</span>
              {company.gstVerified ? (
                <span className="section-status-tag emerald">
                  <span className="material-symbols-outlined text-[14px]">
                    check_circle
                  </span>{" "}
                  GST Verified
                </span>
              ) : (
                <span className="section-status-tag" style={{ color: "var(--comp-amber)" }}>
                  <span className="material-symbols-outlined text-[14px]">
                    pending
                  </span>{" "}
                  Verification Pending
                </span>
              )}
            </div>

            <div className="info-2col-grid">
              <div className="info-item">
                <span className="info-label">Legal Entity</span>
                <span className="info-value">{company.legalEntity}</span>
              </div>
              <div className="info-item">
                <span className="info-label">GSTIN Number</span>
                <span className="info-value mono">{company.gstin}</span>
              </div>
              <div className="info-item">
                <span className="info-label">PAN Reference</span>
                <span className="info-value mono">{company.pan}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Registered State</span>
                <span className="info-value">
                  {company.state} ({company.stateCode})
                </span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Operating HQ Address</span>
                <span className="info-value">{company.hqAddress}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Credit Limit & Utilisation */}
          <div className="profile-section-card">
            <div className="section-header-row">
              <span className="section-title">Credit Limit &amp; Utilisation</span>
              <span className="section-terms-pill">{company.credit.terms}</span>
            </div>

            {/* Meter */}
            <div className="credit-meter-box">
              <div className="credit-meter-figures">
                <span>
                  {company.credit.usedDisplay}{" "}
                  <span style={{ color: "var(--comp-outline)", fontSize: "0.6875rem" }}>
                    Used
                  </span>
                </span>
                <span>
                  {company.credit.limitDisplay}{" "}
                  <span style={{ color: "var(--comp-outline)", fontSize: "0.6875rem" }}>
                    Limit
                  </span>
                </span>
              </div>

              <div className="credit-progress-track">
                <div
                  className={`credit-progress-fill ${isBreached ? "breached" : ""}`}
                  style={{
                    width: `${Math.min(100, company.credit.utilizationRate)}%`,
                  }}
                ></div>
              </div>

              <div className="credit-progress-subtext">
                <span
                  style={{
                    color: isBreached
                      ? "var(--comp-danger)"
                      : "var(--comp-primary)",
                    fontWeight: 600,
                  }}
                >
                  {company.credit.utilizationRate}% Utilised
                </span>
                <span
                  style={{
                    color: isBreached
                      ? "var(--comp-danger)"
                      : "var(--comp-emerald)",
                    fontWeight: 600,
                  }}
                >
                  {company.credit.remainingDisplay}
                </span>
              </div>
            </div>

            {/* Overdue Balance & Security Deposit Cards */}
            <div className="deposit-cards-grid">
              <div className="deposit-card">
                <span className="deposit-label">Overdue Balance</span>
                <span
                  className={`deposit-value ${
                    company.credit.overdueBalance === 0 ? "emerald" : ""
                  }`}
                  style={
                    company.credit.overdueBalance > 0
                      ? { color: "var(--comp-danger)" }
                      : {}
                  }
                >
                  ₹{company.credit.overdueBalance.toLocaleString("en-IN")}
                </span>
                <span className="deposit-sub">
                  {company.credit.overdueBalance === 0
                    ? "Clear payment record"
                    : "Immediate follow-up required"}
                </span>
              </div>

              <div className="deposit-card">
                <span className="deposit-label">Security Deposit</span>
                <span className="deposit-value">
                  ₹{company.credit.securityDeposit.toLocaleString("en-IN")}
                </span>
                <span className="deposit-sub">
                  {company.credit.depositType}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Driver Payout & Platform Commission Split */}
          <div className="profile-section-card">
            <div className="section-header-row">
              <span className="section-title">
                Commission &amp; Payout Split
              </span>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--comp-primary)",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "2px",
                }}
                onClick={() => onOpenEditSplit(company)}
                id="btn-edit-split-rules"
              >
                <span>Edit Rules</span>
                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>
              </button>
            </div>

            <div className="commission-row">
              <div className="split-left">
                <div className="split-pct-badge emerald">
                  {company.commission.driverSplit}%
                </div>
                <div>
                  <div className="split-title">
                    {company.commission.driverLabel}
                  </div>
                  <div className="split-desc">
                    {company.commission.driverSubtitle}
                  </div>
                </div>
              </div>
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ color: "var(--comp-emerald)" }}
              >
                account_balance_wallet
              </span>
            </div>

            <div className="commission-row">
              <div className="split-left">
                <div className="split-pct-badge primary">
                  {company.commission.platformSplit}%
                </div>
                <div>
                  <div className="split-title">
                    {company.commission.platformLabel}
                  </div>
                  <div className="split-desc">
                    {company.commission.platformSubtitle}
                  </div>
                </div>
              </div>
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ color: "var(--comp-primary)" }}
              >
                hub
              </span>
            </div>

            <div className="surcharge-callout">
              <span className="material-symbols-outlined text-[14px]" style={{ color: "var(--comp-primary)" }}>
                info
              </span>
              <span>{company.commission.notes}</span>
            </div>
          </div>

          {/* Section 4: Operational Performance Metrics */}
          <div className="metrics-4box-grid">
            <div className="metric-mini-box">
              <span className="metric-mini-value">{company.metrics.trips30d}</span>
              <span className="metric-mini-label">Trips 30D</span>
            </div>
            <div className="metric-mini-box">
              <span className="metric-mini-value primary">
                {company.metrics.inTransit}
              </span>
              <span className="metric-mini-label">In Transit</span>
            </div>
            <div className="metric-mini-box">
              <span className="metric-mini-value emerald">
                {company.metrics.slaRate}
              </span>
              <span className="metric-mini-label">SLA Rate</span>
            </div>
            <div className="metric-mini-box">
              <span className="metric-mini-value">
                {company.metrics.billed30d}
              </span>
              <span className="metric-mini-label">Billed 30D</span>
            </div>
          </div>

          {/* Key Contact Person Card */}
          <div className="contact-person-card">
            <div className="contact-person-left">
              <div className="contact-avatar-circle">
                {company.contact.initials}
              </div>
              <div>
                <div className="contact-person-name">
                  {company.contact.name}
                </div>
                <div className="contact-person-role">
                  {company.contact.designation} · {company.contact.email}
                </div>
              </div>
            </div>

            <a
              href={`tel:${company.contact.phone.replace(/\s+/g, "")}`}
              className="btn-contact-call"
              title="Call primary contact"
              id="btn-call-company-contact"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
            </a>
          </div>

          {/* Profile Bottom Action Footer */}
          <div className="profile-footer-actions">
            <button
              type="button"
              className="btn-adjust-credit"
              onClick={() => onOpenAdjustCredit(company)}
              id="btn-adjust-credit-action"
            >
              Adjust Credit
            </button>
            <button
              type="button"
              className="btn-view-ledger"
              onClick={() => onViewLedger(company)}
              id="btn-view-ledger-action"
            >
              View Account Ledger
            </button>
          </div>
        </>
      )}

      {/* TAB CONTENT: Company Associates */}
      {activeSubTab === "associates" && (
        <div className="profile-section-card" style={{ gap: "0.875rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span className="section-title">Company Associates &amp; Logins</span>
              <p style={{ margin: "2px 0 0 0", fontSize: "0.6875rem", color: "var(--comp-outline)" }}>
                B2B portal users authorized for {company.name}
              </p>
            </div>
            <button
              type="button"
              className="btn-submit"
              style={{
                padding: "0.35rem 0.75rem",
                fontSize: "0.75rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
              onClick={() => onOpenAddAssociate(company)}
              id="btn-add-associate"
            >
              <span className="material-symbols-outlined text-[15px]">person_add</span>
              <span>Add Associate</span>
            </button>
          </div>

          {loadingAssociates ? (
            <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--comp-outline)", fontSize: "0.8125rem" }}>
              Loading company associates...
            </div>
          ) : associates.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                background: "var(--comp-surface-raised, rgba(255,255,255,0.02))",
                borderRadius: "8px",
                border: "1px dashed var(--comp-border)",
              }}
            >
              <span className="material-symbols-outlined text-[32px]" style={{ color: "var(--comp-outline)", marginBottom: "0.5rem" }}>
                group_off
              </span>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--comp-text-main)" }}>
                No Associates Registered
              </div>
              <p style={{ margin: "0.25rem 0 1rem 0", fontSize: "0.75rem", color: "var(--comp-outline)" }}>
                Create an associate account to generate email &amp; password for partner portal access.
              </p>
              <button
                type="button"
                className="btn-submit"
                style={{ padding: "0.375rem 0.875rem", fontSize: "0.75rem" }}
                onClick={() => onOpenAddAssociate(company)}
              >
                + Provision Associate Credentials
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {associates.map((assoc) => {
                const initials = (assoc.name || "PA")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={assoc.id}
                    style={{
                      background: "var(--comp-surface-raised, rgba(255,255,255,0.02))",
                      border: "1px solid var(--comp-border)",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.625rem",
                    }}
                  >
                    {/* Header row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: assoc.isBlocked ? "rgba(239, 68, 68, 0.2)" : "var(--comp-primary)",
                            color: assoc.isBlocked ? "#ef4444" : "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--comp-text-main)" }}>
                            {assoc.name}
                          </div>
                          <div style={{ fontSize: "0.6875rem", color: "var(--comp-outline)" }}>
                            {assoc.phone ? assoc.phone : "No phone"} • Registered {assoc.createdAt}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`status-pill ${assoc.isBlocked ? "suspended" : "active"}`}
                        style={{ fontSize: "0.6875rem", padding: "0.2rem 0.5rem" }}
                      >
                        {assoc.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>

                    {/* Email row with copy */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "var(--comp-surface-sunken, rgba(0,0,0,0.15))",
                        padding: "0.4rem 0.625rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                      }}
                    >
                      <span style={{ color: "var(--comp-text-main)", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {assoc.email}
                      </span>
                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: copiedEmailId === assoc.id ? "#10b981" : "var(--comp-primary)",
                          display: "flex",
                          alignItems: "center",
                          padding: 0,
                        }}
                        title="Copy Email"
                        onClick={() => {
                          navigator.clipboard.writeText(assoc.email);
                          setCopiedEmailId(assoc.id);
                          setTimeout(() => setCopiedEmailId(null), 2000);
                        }}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {copiedEmailId === assoc.id ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>

                    {/* Card Actions Footer */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "0.5rem",
                        paddingTop: "0.35rem",
                        borderTop: "1px solid var(--comp-border)",
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "1px solid var(--comp-border)",
                          borderRadius: "6px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.6875rem",
                          color: "var(--comp-text-main)",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                        title="Generate new password for this associate"
                        onClick={() => onResetAssociatePassword(company, assoc)}
                      >
                        <span className="material-symbols-outlined text-[14px]">lock_reset</span>
                        <span>Reset Password</span>
                      </button>

                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: `1px solid ${assoc.isBlocked ? "#10b981" : "#ef4444"}`,
                          borderRadius: "6px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.6875rem",
                          color: assoc.isBlocked ? "#10b981" : "#ef4444",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                        onClick={() => onToggleAssociateStatus(company, assoc)}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {assoc.isBlocked ? "check_circle" : "block"}
                        </span>
                        <span>{assoc.isBlocked ? "Unblock" : "Block"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Alternate subtabs placeholders with rich operational details */}
      {activeSubTab === "contracts" && (
        <div className="profile-section-card" style={{ gap: "1rem" }}>
          <span className="section-title">Active Freight Contracts</span>
          <div className="deposit-card" style={{ gap: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>Contract #CNT-2024-MH89</strong>
              <span className="status-pill active">Active</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--comp-text-muted)" }}>
              Full Truckload (FTL) Corridor Service Level Agreement with committed 95% on-time guarantee.
            </p>
            <div style={{ fontSize: "0.6875rem", color: "var(--comp-outline)" }}>
              Valid: 01 Feb 2024 - 31 Jan 2027 • Billing Cycle: Monthly Consolidated
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "trips" && (
        <div className="profile-section-card" style={{ gap: "0.75rem" }}>
          <span className="section-title">Live Dispatched Shipments</span>
          <div className="deposit-card" style={{ gap: "0.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong style={{ color: "var(--comp-primary)" }}>#TRP-10482</strong>
              <span className="status-pill active">In Transit</span>
            </div>
            <div style={{ fontSize: "0.75rem" }}>Bhiwandi Hub ➔ Chakan MIDC via NH-48</div>
            <div style={{ fontSize: "0.6875rem", color: "var(--comp-outline)" }}>
              Vehicle: MH-12 AB 1334 (24T) • Driver: Ramesh Kumar • ETA: 1h 15m
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "ledger" && (
        <div className="profile-section-card" style={{ gap: "0.75rem" }}>
          <span className="section-title">Recent Tax Invoices</span>
          <div className="deposit-card" style={{ gap: "0.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>INV-2026-092</strong>
              <span className="status-pill active">Paid</span>
            </div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>₹14,50,000 (Incl. 18% GST)</div>
            <div style={{ fontSize: "0.6875rem", color: "var(--comp-outline)" }}>
              Dated: 30 Sep 2026 • Settled via NEFT Ref: HDFC9928192
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "audit" && (
        <div className="profile-section-card" style={{ gap: "0.75rem" }}>
          <span className="section-title">Account Activity Trail</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.75rem" }}>
            <div>
              <strong>GSTIN Re-verified</strong> via MCA Portal (API Check)
              <div style={{ fontSize: "0.625rem", color: "var(--comp-outline)" }}>
                08 Oct 2026, 14:22 • System Automated
              </div>
            </div>
            <div>
              <strong>Credit limit adjusted</strong> to ₹15,00,000 by Finance Head
              <div style={{ fontSize: "0.625rem", color: "var(--comp-outline)" }}>
                15 Sep 2026, 11:05 • Admin (ops@hired.in)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CompanyProfilePanel.propTypes = {
  company: PropTypes.object,
  onOpenAdjustCredit: PropTypes.func.isRequired,
  onOpenEditSplit: PropTypes.func.isRequired,
  onDownloadDossier: PropTypes.func.isRequired,
  onEditCompany: PropTypes.func.isRequired,
  onToggleSuspend: PropTypes.func.isRequired,
  onViewLedger: PropTypes.func.isRequired,
  onOpenAddAssociate: PropTypes.func,
  onResetAssociatePassword: PropTypes.func,
  onToggleAssociateStatus: PropTypes.func,
  associatesUpdateTrigger: PropTypes.number,
};

export default CompanyProfilePanel;

