/**
 * AccountCreditDetailPanel Component
 * 360° Account Credit & Live Ledger Detail Panel
 * Modeled after Stitch reference: 8._accounts_credit
 */

import { useState } from "react";

export default function AccountCreditDetailPanel({
  account,
  onOpenAdjustLimit,
  onOpenOverride,
  onToggleHaltBookings,
  onDownloadStatement,
}) {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  if (!account) {
    return (
      <div className="account-detail-panel">
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--acc-text-muted)" }}>
          Select an account to view credit analysis and live ledger.
        </div>
      </div>
    );
  }

  const isBreached = account.status === "Blocked" || account.utilizationRate > 100;
  const isBlocked = account.status === "Blocked";

  return (
    <div className="account-detail-panel">
      {/* 1. Hero Identity Header */}
      <div className="detail-hero-header">
        <div className="detail-identity-cluster">
          <div
            className={`detail-avatar-box ${
              isBreached ? "bg-danger" : ""
            }`}
            style={{
              backgroundColor: isBreached
                ? "var(--acc-danger)"
                : "var(--acc-primary)",
            }}
          >
            {account.initials}
          </div>
          <div className="detail-titles">
            <div className="detail-name-row">
              <h3 className="detail-account-name">{account.name}</h3>
              <span className="detail-terms-badge">{account.terms}</span>
            </div>
            <span className="detail-entity-subtext">
              {account.code} · GSTIN: {account.gstin}
            </span>
          </div>
        </div>

        <div className="detail-quick-tools">
          <button
            type="button"
            className="btn-quick-icon"
            title="Download Statement"
            onClick={() => onDownloadStatement && onDownloadStatement(account)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
              description
            </span>
          </button>
          <button
            type="button"
            className="btn-quick-icon"
            title="Account Settings"
            onClick={() => onOpenAdjustLimit(account)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
              settings
            </span>
          </button>
        </div>
      </div>

      {/* 2. Detail Subtabs */}
      <div className="detail-tabs-bar">
        <button
          type="button"
          className={`detail-tab-btn ${activeSubTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveSubTab("overview")}
        >
          Credit Overview
        </button>
        <button
          type="button"
          className={`detail-tab-btn ${activeSubTab === "ledger" ? "active" : ""}`}
          onClick={() => setActiveSubTab("ledger")}
        >
          Ledger
        </button>
        <button
          type="button"
          className={`detail-tab-btn ${activeSubTab === "invoices" ? "active" : ""}`}
          onClick={() => setActiveSubTab("invoices")}
        >
          Invoices (14)
        </button>
        <button
          type="button"
          className={`detail-tab-btn ${activeSubTab === "guarantees" ? "active" : ""}`}
          onClick={() => setActiveSubTab("guarantees")}
        >
          Guarantees
        </button>
      </div>

      {/* 3. Sanctioned Credit Utilisation Gauge Card */}
      <div className="credit-gauge-card">
        <div className="gauge-header-row">
          <span className="gauge-title">Sanctioned Credit Utilisation</span>
          <span
            className={`gauge-pct-badge ${isBreached ? "breached" : ""}`}
          >
            {account.utilizationRate}% Utilised
          </span>
        </div>

        <div className="gauge-progress-track">
          <div
            className={`gauge-progress-fill ${isBreached ? "breached" : ""}`}
            style={{ width: `${Math.min(account.utilizationRate, 100)}%` }}
          />
        </div>

        <div className="gauge-stats-3col">
          <div className="gauge-stat-box">
            <span className="gauge-stat-label">CREDIT LIMIT</span>
            <span className="gauge-stat-val">{account.creditLimitDisplay}</span>
          </div>
          <div className="gauge-stat-box">
            <span className="gauge-stat-label">UTILISED</span>
            <span
              className={`gauge-stat-val ${
                isBreached ? "danger" : "primary"
              }`}
            >
              {account.outstandingDisplay}
            </span>
          </div>
          <div className="gauge-stat-box">
            <span className="gauge-stat-label">AVAILABLE BUFFER</span>
            <span
              className={`gauge-stat-val ${
                account.availableBuffer < 0 ? "danger" : ""
              }`}
            >
              {account.availableBufferDisplay}
            </span>
          </div>
        </div>

        <div className="bank-guarantee-line">
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "1rem", color: "var(--acc-primary)" }}
            >
              verified_user
            </span>
            <span>
              Bank Guarantee on File: {account.bankGuaranteeDisplay} ({account.guaranteeRef})
            </span>
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.625rem",
              color: "var(--acc-primary)",
              letterSpacing: "0.05em",
            }}
          >
            VERIFIED
          </span>
        </div>
      </div>

      {/* 4. Outstanding Ageing Analysis Card */}
      <div className="ageing-analysis-card">
        <div className="ageing-header-row">
          <span className="ageing-title">Outstanding Ageing Analysis</span>
          <span
            className={`ageing-standing-tag ${
              isBreached ? "danger" : ""
            }`}
          >
            {account.ageing?.standing || "Good Standing"}
          </span>
        </div>

        {/* Stacked Ageing Spectrum Bar */}
        <div className="ageing-stacked-bar">
          <div
            className="ageing-segment"
            style={{
              width: `${account.ageing?.currentPct || 70}%`,
              backgroundColor: "var(--acc-primary)",
            }}
            title={`Current: ${account.ageing?.currentDisplay}`}
          />
          <div
            className="ageing-segment"
            style={{
              width: `${account.ageing?.d30Pct || 25}%`,
              backgroundColor: "var(--acc-secondary-container)",
            }}
            title={`1-30 Days: ${account.ageing?.d30Display}`}
          />
          <div
            className="ageing-segment"
            style={{
              width: `${account.ageing?.d60Pct || 0}%`,
              backgroundColor: "var(--acc-amber)",
            }}
            title={`31-60 Days: ${account.ageing?.d60Display}`}
          />
          <div
            className="ageing-segment"
            style={{
              width: `${account.ageing?.d90Pct || 0}%`,
              backgroundColor: "var(--acc-danger)",
            }}
            title={`60+ Days: ${account.ageing?.d90Display}`}
          />
        </div>

        {/* 4-Box Grid */}
        <div className="ageing-grid-4col">
          <div className="ageing-box">
            <span className="ageing-box-header">CURRENT</span>
            <span className="ageing-box-amt">{account.ageing?.currentDisplay}</span>
            <span className="ageing-box-sub">
              {account.ageing?.currentPct ? `${account.ageing.currentPct}%` : "—"}
            </span>
          </div>

          <div className="ageing-box">
            <span className="ageing-box-header">1-30 DAYS</span>
            <span className="ageing-box-amt">{account.ageing?.d30Display}</span>
            <span className="ageing-box-sub secondary">
              {account.ageing?.d30Pct ? `${account.ageing.d30Pct}%` : "—"}
            </span>
          </div>

          <div className="ageing-box">
            <span className="ageing-box-header">31-60 DAYS</span>
            <span className="ageing-box-amt">{account.ageing?.d60Display}</span>
            <span className="ageing-box-sub outline">
              {account.ageing?.d60Pct ? `${account.ageing.d60Pct}%` : "0%"}
            </span>
          </div>

          <div className="ageing-box">
            <span className="ageing-box-header">60+ DAYS</span>
            <span
              className="ageing-box-amt"
              style={{
                color:
                  account.ageing?.d90 > 0
                    ? "var(--acc-danger)"
                    : "var(--acc-text)",
              }}
            >
              {account.ageing?.d90Display}
            </span>
            <span className="ageing-box-sub outline">
              {account.ageing?.d90Pct ? `${account.ageing.d90Pct}%` : "0%"}
            </span>
          </div>
        </div>

        <div className="ageing-dispatch-note">
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "1.125rem",
              color: isBreached ? "var(--acc-danger)" : "var(--acc-primary)",
            }}
          >
            {isBreached ? "warning" : "check_circle"}
          </span>
          <span>{account.ageing?.note}</span>
        </div>
      </div>

      {/* 5. Recent Transactions List */}
      <div className="recent-transactions-card">
        <div className="transactions-header-row">
          <span className="transactions-title">Recent Transactions</span>
          <button
            type="button"
            className="btn-view-all-tx"
            onClick={() => setActiveSubTab("ledger")}
          >
            View Full Statement
          </button>
        </div>

        <div className="transactions-list">
          {(account.transactions || []).slice(0, 4).map((tx) => (
            <div key={tx.id} className="transaction-row">
              <div className="transaction-left">
                <div
                  className={`transaction-icon-pod ${
                    tx.type === "payment" ? "payment" : ""
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "1rem" }}
                  >
                    {tx.icon}
                  </span>
                </div>
                <div className="transaction-titles">
                  <span className="transaction-title-text">{tx.title}</span>
                  <span className="transaction-subtext">{tx.subtitle}</span>
                </div>
              </div>

              <div className="transaction-right">
                <span
                  className={`transaction-amount ${
                    tx.amountType || "debit"
                  }`}
                >
                  {tx.amount}
                </span>
                <span className="transaction-bal">{tx.balanceAfter}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Operational Credit Controls & Action Triggers */}
      <div className="detail-bottom-actions">
        <div className="actions-2button-grid">
          <button
            type="button"
            className="btn-control-secondary"
            onClick={() => onOpenAdjustLimit(account)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              edit
            </span>
            Edit Limit (₹)
          </button>

          <button
            type="button"
            className={isBlocked ? "btn-control-secondary" : "btn-control-danger"}
            onClick={() => onToggleHaltBookings(account)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
              {isBlocked ? "check_circle" : "block"}
            </span>
            {isBlocked ? "Resume Bookings" : "Halt Bookings"}
          </button>
        </div>

        <button
          type="button"
          className="btn-control-primary-wide"
          onClick={() => onOpenOverride(account)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>
            bolt
          </span>
          Grant 48h Temporary Override
        </button>

        <div className="billing-statement-reminder-box">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "1rem", color: "var(--acc-outline)", marginTop: 1 }}
          >
            info
          </span>
          <span>
            Scheduled auto-dunning email dispatched 2 days ago. Next reminder: 16 Oct 2026.
          </span>
        </div>
      </div>
    </div>
  );
}
