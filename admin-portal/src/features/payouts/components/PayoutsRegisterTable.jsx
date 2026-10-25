/**
 * PayoutsRegisterTable Component
 * High-density driver payout register table with gross-vs-net calculations, badges & rails strip
 * Modeled after Stitch reference: 9._payouts_driver_wallets
 */

import { useState } from "react";

export default function PayoutsRegisterTable({
  payouts,
  selectedPayoutId,
  onSelectPayout,
  onApprovePayout,
  onFixKYC,
}) {
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(payouts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayouts = payouts.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(new Set(currentPayouts.map((p) => p.id)));
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

  const getStatusBadge = (status) => {
    if (status.includes("Pending")) {
      return <span className="payout-status-badge pending">{status}</span>;
    }
    if (status.includes("Settled")) {
      return <span className="payout-status-badge settled">{status}</span>;
    }
    if (status.includes("Hold") || status.includes("Issue")) {
      return <span className="payout-status-badge failed">{status}</span>;
    }
    if (status.includes("Processing")) {
      return <span className="payout-status-badge processing">{status}</span>;
    }
    return <span className="payout-status-badge ready">{status}</span>;
  };

  return (
    <div className="payouts-table-panel">
      {/* High-Density Data Table */}
      <div className="payouts-table-wrapper">
        <table className="payouts-table">
          <thead>
            <tr>
              <th style={{ width: "36px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  onChange={handleToggleSelectAll}
                  checked={
                    currentPayouts.length > 0 &&
                    currentPayouts.every((p) => selectedRowIds.has(p.id))
                  }
                />
              </th>
              <th>Payout ID &amp; Date</th>
              <th>Driver &amp; Vehicle</th>
              <th>Trip &amp; Corridor</th>
              <th style={{ textAlign: "right" }}>Gross Val</th>
              <th style={{ textAlign: "right" }}>Deductions</th>
              <th style={{ textAlign: "right" }}>Net Payable</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPayouts.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: "2.5rem 1rem",
                    color: "var(--pay-text-muted)",
                  }}
                >
                  No payout records matching the current criteria.
                </td>
              </tr>
            ) : (
              currentPayouts.map((p) => {
                const isSelected = p.id === selectedPayoutId;

                return (
                  <tr
                    key={p.id}
                    className={`payout-row ${isSelected ? "selected" : ""}`}
                    onClick={() => onSelectPayout(p.id)}
                  >
                    <td
                      style={{ textAlign: "center" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRowIds.has(p.id)}
                        onChange={(e) => handleToggleRow(e, p.id)}
                      />
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: isSelected ? "var(--pay-primary)" : "var(--pay-text)",
                          }}
                        >
                          {p.payoutCode}
                        </span>
                        <span style={{ fontSize: "0.6875rem", color: "var(--pay-text-muted)" }}>
                          {p.timestamp}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div className="driver-avatar-pod">
                          {p.driver.initials}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                          <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                            {p.driver.name}
                          </span>
                          <span
                            style={{
                              fontSize: "0.6875rem",
                              color: "var(--pay-text-muted)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {p.driver.vehicle}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600 }}>{p.trip.tripCode}</span>
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            color: "var(--pay-text-muted)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          {p.trip.origin}{" "}
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "0.75rem", color: "var(--pay-outline)" }}
                          >
                            arrow_forward
                          </span>{" "}
                          {p.trip.destination}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <span style={{ fontWeight: 700 }}>{p.grossValDisplay}</span>
                        <span style={{ fontSize: "0.6875rem", color: "var(--pay-outline)" }}>
                          {p.trip.splitRatioText}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--pay-danger)",
                        }}
                      >
                        {p.deductionsDisplay}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color:
                            p.status.includes("Hold")
                              ? "var(--pay-danger)"
                              : isSelected
                              ? "var(--pay-primary)"
                              : "var(--pay-text)",
                        }}
                      >
                        {p.netPayableDisplay || p.netPayoutDisplay || "—"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {getStatusBadge(p.status)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "0.35rem",
                        }}
                      >
                        {p.status === "Pending Approval" ? (
                          p.driver?.bankStatus === "Active" || p.driver?.isBankApproved ? (
                            <button
                              type="button"
                              className="btn-table-approve"
                              onClick={(e) => {
                                e.stopPropagation();
                                onApprovePayout(p);
                              }}
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-table-approve"
                              style={{
                                opacity: 0.7,
                                cursor: "not-allowed",
                                backgroundColor: "var(--pay-card-low)",
                                color: "var(--pay-amber)",
                                border: "1px dashed rgba(245, 158, 11, 0.4)",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Cannot disburse payout: ${p.driver.name}'s bank account is ${p.driver.bankStatus || 'Pending Approval'}. Please approve the bank account in Driver Management.`);
                              }}
                              title={`Bank account ${p.driver.bankStatus || "Pending"}. Payout blocked until approved.`}
                            >
                              Bank Pending
                            </button>
                          )
                        ) : p.status.includes("Hold") ? (
                          <button
                            type="button"
                            className="btn-table-fixkyc"
                            onClick={(e) => {
                              e.stopPropagation();
                              onFixKYC(p);
                            }}
                          >
                            Fix KYC
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-reload-batch"
                            style={{ width: "1.75rem", height: "1.75rem", border: "none" }}
                            title="View Details"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPayout(p.id);
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                              visibility
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn-reload-batch"
                          style={{ width: "1.75rem", height: "1.75rem", border: "none" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPayout(p.id);
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                            more_vert
                          </span>
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
      <div className="payouts-pagination-footer">
        <div>
          Showing {payouts.length > 0 ? startIndex + 1 : 0} -{" "}
          {Math.min(startIndex + itemsPerPage, payouts.length)} of{" "}
          <strong style={{ color: "var(--pay-text)" }}>
            {payouts.length}
          </strong>{" "}
          payout record{payouts.length === 1 ? "" : "s"}
        </div>

        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <button
              type="button"
              className="btn-reload-batch"
              style={{ width: "1.75rem", height: "1.75rem" }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                chevron_left
              </span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={currentPage === page ? "btn-table-approve" : "btn-reload-batch"}
                style={{
                  minWidth: "1.75rem",
                  height: "1.75rem",
                  padding: "0 0.4rem",
                  backgroundColor: currentPage === page ? "var(--pay-primary)" : "transparent",
                  color: currentPage === page ? "#ffffff" : "var(--pay-text)",
                }}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="btn-reload-batch"
              style={{ width: "1.75rem", height: "1.75rem" }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                chevron_right
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
