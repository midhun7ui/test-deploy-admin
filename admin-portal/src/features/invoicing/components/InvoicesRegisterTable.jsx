import PropTypes from "prop-types";

/**
 * InvoicesRegisterTable - High-density enterprise register table matching Stitch Reference 10:
 * - Columns: Checkbox, Invoice # & Date, Client / Account, Period & Trips, Taxable + GST, Total Amt, Status, Action
 * - Pagination bar: Showing 1-5 of 38 invoices with page buttons
 * - Bottom Guardrail Banner: Two-Step Invoice Verification Guardrail Active [COMPLIANCE LOCK: ENFORCED]
 */
export default function InvoicesRegisterTable({
  invoices,
  selectedInvoiceId,
  onSelectInvoice,
  selectedRowIds,
  onToggleSelectRow,
  onToggleSelectAll,
  currentPage,
  totalPages,
  onPageChange,
  totalItemsCount,
  onActionClick,
}) {
  const isAllSelected =
    invoices.length > 0 && invoices.every((inv) => selectedRowIds.includes(inv.id));
  const isSomeSelected =
    invoices.some((inv) => selectedRowIds.includes(inv.id)) && !isAllSelected;

  const renderStatusPill = (inv) => {
    switch (inv.statusType) {
      case "pending":
        return (
          <span className="inv-status-pill inv-status-pill--pending">
            <span className="inv-status-dot" />
            {inv.status}
          </span>
        );
      case "overdue":
        return (
          <span className="inv-status-pill inv-status-pill--overdue">
            <span className="inv-status-dot" />
            {inv.status}
          </span>
        );
      case "reconciled":
        return (
          <span className="inv-status-pill inv-status-pill--reconciled">
            <span className="inv-status-dot" />
            {inv.status}
          </span>
        );
      case "due":
      default:
        return (
          <span className="inv-status-pill inv-status-pill--due">
            <span className="inv-status-dot" />
            {inv.status}
          </span>
        );
    }
  };

  const renderActionButton = (inv) => {
    switch (inv.statusType) {
      case "pending":
        return (
          <button
            type="button"
            className="inv-action-btn inv-action-btn--primary"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick("review", inv);
            }}
          >
            Review
          </button>
        );
      case "overdue":
        return (
          <button
            type="button"
            className="inv-action-btn inv-action-btn--danger"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick("notice", inv);
            }}
          >
            Notice
          </button>
        );
      case "reconciled":
        return (
          <button
            type="button"
            className="inv-action-btn inv-action-btn--subtle"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick("receipt", inv);
            }}
          >
            Receipt
          </button>
        );
      case "due":
      default:
        return (
          <button
            type="button"
            className="inv-action-btn inv-action-btn--subtle"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick("remind", inv);
            }}
          >
            Remind
          </button>
        );
    }
  };

  return (
    <div className="inv-table-card">
      <div className="inv-table-wrapper">
        <table className="inv-table">
          <thead>
            <tr>
              <th className="inv-th inv-th--checkbox">
                <input
                  type="checkbox"
                  className="inv-checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isSomeSelected;
                  }}
                  onChange={onToggleSelectAll}
                  aria-label="Select all invoices on page"
                />
              </th>
              <th className="inv-th">INVOICE # & DATE</th>
              <th className="inv-th">CLIENT / ACCOUNT</th>
              <th className="inv-th">PERIOD & TRIPS</th>
              <th className="inv-th">TAXABLE + GST</th>
              <th className="inv-th">TOTAL AMT</th>
              <th className="inv-th">STATUS</th>
              <th className="inv-th inv-th--action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="inv-empty-cell">
                  <div className="inv-empty-state">
                    <span className="material-symbols-outlined inv-empty-icon">description</span>
                    <div className="inv-empty-title">No invoices found</div>
                    <div className="inv-empty-desc">
                      Try clearing filters or search terms to inspect other invoices.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const isSelected = selectedInvoiceId === inv.id;
                const isChecked = selectedRowIds.includes(inv.id);

                return (
                  <tr
                    key={inv.id}
                    className={`inv-row ${isSelected ? "inv-row--selected" : ""}`}
                    onClick={() => onSelectInvoice(inv)}
                  >
                    <td
                      className="inv-td inv-td--checkbox"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="inv-checkbox"
                        checked={isChecked}
                        onChange={() => onToggleSelectRow(inv.id)}
                        aria-label={`Select invoice ${inv.invoiceNumber}`}
                      />
                    </td>
                    <td className="inv-td">
                      <div className="inv-num-cell">
                        <span className="inv-code-bold">{inv.invoiceNumber}</span>
                        <span className="inv-date-sub">{inv.date}</span>
                      </div>
                    </td>
                    <td className="inv-td">
                      <div className="inv-client-cell">
                        <span className="inv-client-name">{inv.account.shortName}</span>
                        <span className="inv-client-sub">
                          {inv.account.code} • GSTIN: {inv.account.gstin}
                        </span>
                      </div>
                    </td>
                    <td className="inv-td">
                      <div>
                        <span className="inv-period-pill">{inv.period}</span>
                        <div className="inv-trips-sub">{inv.tripSummary}</div>
                      </div>
                    </td>
                    <td className="inv-td">
                      <div>
                        <div className="inv-taxable-val">{inv.taxableValueDisplay}</div>
                        <div className="inv-gst-sub">{inv.gstDisplay}</div>
                      </div>
                    </td>
                    <td className="inv-td">
                      <div className="inv-total-val">{inv.totalAmountDisplay}</div>
                    </td>
                    <td className="inv-td">{renderStatusPill(inv)}</td>
                    <td className="inv-td inv-td--action">{renderActionButton(inv)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="inv-pagination-bar">
        <div className="inv-pagination-text">
          Showing 1 - {Math.min(invoices.length, 5)} of {totalItemsCount} invoices
        </div>
        <div className="inv-pagination-controls">
          <button
            type="button"
            className="inv-page-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_left</span>
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className={`inv-page-btn ${currentPage === page ? "inv-page-btn--active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <span className="inv-page-ellipsis">...</span>
          <button
            type="button"
            className={`inv-page-btn ${currentPage === totalPages ? "inv-page-btn--active" : ""}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
          <button
            type="button"
            className="inv-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
          </button>
        </div>
      </div>

      {/* Bottom Compliance Guardrail Active Banner */}
      <div className="inv-guardrail-banner">
        <div className="inv-guardrail-icon-pod">
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>verified_user</span>
        </div>
        <div className="inv-guardrail-content">
          <div className="inv-guardrail-headline-row">
            <h4 className="inv-guardrail-title">Two-Step Invoice Verification Guardrail Active</h4>
            <span className="inv-guardrail-badge">COMPLIANCE LOCK: ENFORCED</span>
          </div>
          <p className="inv-guardrail-desc">
            All invoices above ₹5,00,000 require secondary sign-off from Finance Controller or Operations Director before auto-dispatch to GST portal and client ERP.
          </p>
        </div>
      </div>
    </div>
  );
}

InvoicesRegisterTable.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedInvoiceId: PropTypes.string,
  onSelectInvoice: PropTypes.func.isRequired,
  selectedRowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleSelectRow: PropTypes.func.isRequired,
  onToggleSelectAll: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalItemsCount: PropTypes.number.isRequired,
  onActionClick: PropTypes.func.isRequired,
};
