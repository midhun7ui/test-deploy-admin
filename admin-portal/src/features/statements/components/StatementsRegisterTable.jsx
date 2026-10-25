import PropTypes from "prop-types";

/**
 * StatementsRegisterTable - High-density ledger table matching Stitch Reference 11:
 * - Columns: Checkbox, Statement / Date, Entity & GSTIN, Period / Trips, Net Balance, Status, Actions
 * - Pagination bar: Showing 1 to 5 of 128 statements • 1 statement selected
 * - Bottom Informational Settlement Cycle Banner with "Cron Job: Active" and "Configure Cron"
 */
export default function StatementsRegisterTable({
  statements,
  selectedStatementId,
  onSelectStatement,
  selectedRowIds,
  onToggleSelectRow,
  onToggleSelectAll,
  currentPage,
  totalPages,
  onPageChange,
  totalItemsCount,
  onDownloadStatement,
  onQuickDispatch,
  onConfigureCron,
}) {
  const isAllSelected =
    statements.length > 0 && statements.every((st) => selectedRowIds.includes(st.id));
  const isSomeSelected =
    statements.some((st) => selectedRowIds.includes(st.id)) && !isAllSelected;

  const renderStatusPill = (st) => {
    switch (st.statusType) {
      case "dispatched":
        return <span className="stmt-status-pill stmt-status-pill--dispatched">Dispatched</span>;
      case "draft":
        return <span className="stmt-status-pill stmt-status-pill--draft">Draft Ready</span>;
      case "reconciled":
        return <span className="stmt-status-pill stmt-status-pill--reconciled">Reconciled</span>;
      case "disputed":
        return <span className="stmt-status-pill stmt-status-pill--disputed">Disputed (POD)</span>;
      default:
        return <span className="stmt-status-pill stmt-status-pill--draft">{st.status}</span>;
    }
  };

  return (
    <div className="stmt-table-card">
      <div className="stmt-table-wrapper">
        <table className="stmt-table">
          <thead>
            <tr>
              <th className="stmt-th stmt-th--checkbox">
                <input
                  type="checkbox"
                  className="stmt-checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isSomeSelected;
                  }}
                  onChange={onToggleSelectAll}
                  aria-label="Select all statements"
                />
              </th>
              <th className="stmt-th">STATEMENT / DATE</th>
              <th className="stmt-th">ENTITY & GSTIN</th>
              <th className="stmt-th">PERIOD / TRIPS</th>
              <th className="stmt-th stmt-th--right">NET BALANCE</th>
              <th className="stmt-th stmt-th--center">STATUS</th>
              <th className="stmt-th stmt-th--right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {statements.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--stmt-text-muted)" }}>
                  No statements match the active filters.
                </td>
              </tr>
            ) : (
              statements.map((st) => {
                const isSelected = selectedStatementId === st.id;
                const isChecked = selectedRowIds.includes(st.id);

                return (
                  <tr
                    key={st.id}
                    className={`stmt-row ${isSelected ? "stmt-row--selected" : ""}`}
                    onClick={() => onSelectStatement(st)}
                  >
                    <td
                      className="stmt-td stmt-td--checkbox"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="stmt-checkbox"
                        checked={isChecked}
                        onChange={() => onToggleSelectRow(st.id)}
                        aria-label={`Select statement ${st.statementNumber}`}
                      />
                    </td>
                    <td className="stmt-td">
                      <div className="stmt-id-cell">
                        <span className="stmt-id-text">{st.statementNumber}</span>
                        <span className="stmt-date-sub">{st.date}</span>
                      </div>
                    </td>
                    <td className="stmt-td">
                      <div className="stmt-entity-cell">
                        <span className="stmt-entity-name">{st.entity.name}</span>
                        <span className="stmt-entity-sub">
                          {st.entity.gstin} · {st.entity.tag}
                        </span>
                      </div>
                    </td>
                    <td className="stmt-td">
                      <div>
                        <span className="stmt-period-text">{st.period}</span>
                        <div className="stmt-trips-sub">{st.tripSummary}</div>
                      </div>
                    </td>
                    <td className="stmt-td stmt-td--right">
                      <div className="stmt-bal-cell">
                        <span
                          className={`stmt-bal-amount ${
                            st.balanceType.includes("Credit") ? "stmt-bal-amount--credit" : ""
                          }`}
                        >
                          {st.netBalanceDisplay}
                        </span>
                        <span className="stmt-bal-type">{st.balanceType}</span>
                      </div>
                    </td>
                    <td className="stmt-td stmt-td--center">{renderStatusPill(st)}</td>
                    <td className="stmt-td stmt-td--right">
                      <div className="stmt-action-btn-group">
                        <button
                          type="button"
                          className="stmt-table-action-btn stmt-table-action-btn--primary"
                          title="Download Statement PDF"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownloadStatement(st);
                          }}
                          aria-label={`Download statement ${st.statementNumber}`}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>download</span>
                        </button>
                        <button
                          type="button"
                          className="stmt-table-action-btn"
                          title="Quick dispatch via WhatsApp & Email"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickDispatch(st);
                          }}
                          aria-label={`Quick dispatch statement ${st.statementNumber}`}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>send</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="stmt-pagination-bar">
        <div className="stmt-pagination-left">
          <span>
            Showing {statements.length === 0 ? 0 : 1} to {statements.length} of {totalItemsCount || statements.length} statements
          </span>
          <span style={{ color: "var(--stmt-outline)" }}>•</span>
          <span className="stmt-selected-count">
            {selectedRowIds.length} statement{selectedRowIds.length === 1 ? "" : "s"} selected
          </span>
        </div>

        <div className="stmt-pagination-controls">
          <button
            type="button"
            className="stmt-page-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_left</span>
          </button>
          {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`stmt-page-btn ${currentPage === page ? "stmt-page-btn--active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            className="stmt-page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
          </button>
        </div>
      </div>

      {/* Informational Settlement Cycle Banner */}
      <div className="stmt-cron-banner">
        <div className="stmt-cron-icon-pod">
          <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>verified</span>
        </div>
        <div className="stmt-cron-content">
          <div className="stmt-cron-headline">
            <span>Automated Fortnightly Settlement Cycle Active</span>
            <span className="stmt-cron-tag">Cron Job: Active</span>
          </div>
          <p className="stmt-cron-desc">
            Statements auto-compile on the 1st and 16th at 00:00 IST including all digital POD signatures, toll fastag surcharges, and debit notes.
          </p>
        </div>
        <button
          type="button"
          className="stmt-cron-link"
          onClick={onConfigureCron}
        >
          Configure Cron
        </button>
      </div>
    </div>
  );
}

StatementsRegisterTable.propTypes = {
  statements: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedStatementId: PropTypes.string,
  onSelectStatement: PropTypes.func.isRequired,
  selectedRowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleSelectRow: PropTypes.func.isRequired,
  onToggleSelectAll: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalItemsCount: PropTypes.number.isRequired,
  onDownloadStatement: PropTypes.func.isRequired,
  onQuickDispatch: PropTypes.func.isRequired,
  onConfigureCron: PropTypes.func.isRequired,
};
