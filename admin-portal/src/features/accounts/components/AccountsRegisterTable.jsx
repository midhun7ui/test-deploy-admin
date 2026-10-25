/**
 * AccountsRegisterTable Component
 * High-density financial ledger register with ageing chips, limit meters & actions
 * Modeled after Stitch reference: 8._accounts_credit
 */

import { useState } from "react";

export default function AccountsRegisterTable({
  accounts,
  selectedAccountId,
  onSelectAccount,
  searchQuery,
  onSearchChange,
  onOpenOverride,
  onOpenAdjustLimit,
}) {
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(accounts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAccounts = accounts.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(new Set(currentAccounts.map((a) => a.id)));
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const handleToggleRow = (e, id) => {
    e.stopPropagation();
    const next = new Set(selectedRowIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRowIds(next);
  };

  const getTierClass = (tierType) => {
    switch (tierType) {
      case "prime":
        return "prime";
      case "standard":
        return "standard";
      case "enterprise":
        return "enterprise";
      case "danger":
        return "danger";
      default:
        return "standard";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span className="acc-status-pill active">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--acc-primary)",
              }}
            />
            Active
          </span>
        );
      case "Blocked":
        return (
          <span className="acc-status-pill danger">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--acc-danger)",
              }}
            />
            Blocked
          </span>
        );
      case "Watchlist":
        return (
          <span className="acc-status-pill warning">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--acc-amber)",
              }}
            />
            Watchlist
          </span>
        );
      case "Healthy":
        return (
          <span className="acc-status-pill healthy">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--acc-emerald)",
              }}
            />
            Healthy
          </span>
        );
      default:
        return <span className="acc-status-pill healthy">{status}</span>;
    }
  };

  return (
    <div className="accounts-table-panel">
      {/* Search and Filter Trigger */}
      <div className="accounts-search-row">
        <div className="accounts-search-input-pod">
          <span className="material-symbols-outlined accounts-search-icon">
            search
          </span>
          <input
            type="text"
            className="accounts-search-input"
            placeholder="Search enterprise accounts, GSTIN, ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button type="button" className="btn-filter-trigger">
          <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
            tune
          </span>
          Filter
        </button>
      </div>

      {/* High-Density Register Table */}
      <div className="accounts-table-wrapper">
        <table className="accounts-table">
          <thead>
            <tr>
              <th style={{ width: "32px", paddingRight: "0.25rem" }}>
                <input
                  type="checkbox"
                  onChange={handleToggleSelectAll}
                  checked={
                    currentAccounts.length > 0 &&
                    currentAccounts.every((a) => selectedRowIds.has(a.id))
                  }
                />
              </th>
              <th>Account & Tier</th>
              <th>Terms</th>
              <th>Credit Limit</th>
              <th>Outstanding</th>
              <th>Ageing Spectrum</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--acc-text-muted)" }}>
                  No accounts matching the selected criteria.
                </td>
              </tr>
            ) : (
              currentAccounts.map((acc) => {
                const isSelected = acc.id === selectedAccountId;
                const isBreached = acc.status === "Blocked" || acc.utilizationRate > 100;

                return (
                  <tr
                    key={acc.id}
                    className={`account-row ${isSelected ? "selected" : ""} ${
                      isBreached ? "breached-row" : ""
                    }`}
                    onClick={() => onSelectAccount(acc.id)}
                  >
                    <td style={{ width: "32px", paddingRight: "0.25rem" }}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.has(acc.id)}
                        onChange={(e) => handleToggleRow(e, acc.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td>
                      <div className="account-cell-cluster">
                        <div
                          className={`account-avatar-box ${getTierClass(
                            acc.tierType
                          )}`}
                        >
                          {acc.initials}
                        </div>
                        <div className="account-info-meta">
                          <span className="account-name-text" title={acc.name}>
                            {acc.name}
                          </span>
                          <span className="account-code-sub">
                            {acc.code} · {acc.tier.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="terms-pill">{acc.terms}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>
                        {acc.creditLimitDisplay}
                      </span>
                    </td>
                    <td>
                      <div className="outstanding-figure">
                        <span className={isBreached ? "breached" : ""}>
                          {acc.outstandingDisplay}
                        </span>
                        <div className="outstanding-mini-track">
                          <div
                            className={`outstanding-mini-bar ${
                              isBreached ? "breached" : ""
                            }`}
                            style={{
                              width: `${Math.min(acc.utilizationRate, 100)}%`,
                            }}
                          />
                        </div>
                        <div
                          className={`outstanding-subtext ${
                            isBreached ? "breached" : ""
                          }`}
                        >
                          {acc.utilizationRate}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ageing-chips-cluster">
                        {acc.ageing?.curChip && (
                          <span className="ageing-chip">
                            {acc.ageing.curChip}
                          </span>
                        )}
                        {acc.ageing?.d30Chip && (
                          <span className="ageing-chip secondary">
                            {acc.ageing.d30Chip}
                          </span>
                        )}
                        {acc.ageing?.d60Chip && (
                          <span className="ageing-chip danger">
                            {acc.ageing.d60Chip}
                          </span>
                        )}
                        {acc.ageing?.spectrumSummary && (
                          <span className="ageing-spectrum-summary">
                            {acc.ageing.spectrumSummary}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{getStatusBadge(acc.status)}</td>
                    <td style={{ textAlign: "right" }}>
                      {acc.status === "Blocked" ? (
                        <button
                          type="button"
                          className="btn-table-action danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenOverride(acc);
                          }}
                        >
                          Override
                        </button>
                      ) : acc.status === "Watchlist" ? (
                        <button
                          type="button"
                          className="btn-table-action secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAdjustLimit(acc);
                          }}
                        >
                          Edit Limit
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-table-action primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAccount(acc.id);
                          }}
                        >
                          View Ledger
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="accounts-pagination-footer">
        <div>
          Showing {accounts.length > 0 ? startIndex + 1 : 0} -{" "}
          {Math.min(startIndex + itemsPerPage, accounts.length)} of{" "}
          {accounts.length > 5 ? "84" : accounts.length} enterprise accounts
        </div>
        <div className="pagination-step-controls">
          <button
            type="button"
            className="btn-step-page"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx + 1}
              type="button"
              className={`btn-step-page ${
                currentPage === idx + 1 ? "active" : ""
              }`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            type="button"
            className="btn-step-page"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
