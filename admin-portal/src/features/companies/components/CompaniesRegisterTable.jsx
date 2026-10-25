import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import CompanyStatusTabs from "./CompanyStatusTabs";

function CompaniesRegisterTable({
  companies,
  selectedCompany,
  onSelectCompany,
  activeTab,
  onTabChange,
  counts,
  onRunBulkVerification,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedIds, setSelectedIds] = useState([selectedCompany?.id || "CMP-2026-001"]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter companies based on tab, industry, and search query
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      // Tab filter
      if (activeTab === "active" && c.status !== "Active") return false;
      if (activeTab === "pending-kyc" && c.status !== "Pending KYC") return false;
      if (activeTab === "credit-watch" && c.status !== "Credit Watch") return false;
      if (activeTab === "suspended" && c.status !== "Suspended") return false;

      // Industry filter
      if (selectedIndustry !== "All Industries" && c.industry !== selectedIndustry) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(query);
        const matchGstin = c.gstin.toLowerCase().includes(query);
        const matchContact = c.contact.name.toLowerCase().includes(query);
        const matchCode = c.code.toLowerCase().includes(query);
        const matchPhone = c.contact.phone.toLowerCase().includes(query);
        if (!matchName && !matchGstin && !matchContact && !matchCode && !matchPhone) {
          return false;
        }
      }

      return true;
    });
  }, [companies, activeTab, selectedIndustry, searchQuery]);

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / PAGE_SIZE));
  const currentPageClamped = Math.min(currentPage, totalPages);
  const paginatedCompanies = useMemo(() => {
    const start = (currentPageClamped - 1) * PAGE_SIZE;
    return filteredCompanies.slice(start, start + PAGE_SIZE);
  }, [filteredCompanies, currentPageClamped]);

  const handleToggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredCompanies.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="companies-table-panel">
      {/* Filter Card: Tabs & Search Controls */}
      <div className="companies-filter-card">
        <CompanyStatusTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          counts={counts}
        />

        <div className="companies-search-row">
          <div className="companies-search-input-pod">
            <span className="material-symbols-outlined companies-search-icon">
              search
            </span>
            <input
              type="text"
              className="companies-search-input"
              placeholder="Search company, GSTIN, contact person, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="input-company-search"
            />
          </div>

          <div className="companies-search-extras">
            <select
              className="companies-industry-select"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              id="select-company-industry"
            >
              <option value="All Industries">All Industries</option>
              <option value="Cement & Heavy Goods">Cement & Heavy Goods</option>
              <option value="Cold Chain & FMCG">Cold Chain & FMCG</option>
              <option value="Pharma & Chemicals">Pharma & Chemicals</option>
              <option value="Automotive & Spares">Automotive & Spares</option>
            </select>

            <button
              type="button"
              className="btn-filter-tune"
              title="Filter settings"
              id="btn-company-filter-tune"
            >
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Companies Master Data Table Card */}
      <div className="companies-table-card">
        <div className="companies-table-wrapper">
          <table className="companies-table" id="companies-master-table">
            <thead>
              <tr>
                <th style={{ width: "38px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredCompanies.length > 0 &&
                      selectedIds.length === filteredCompanies.length
                    }
                    onChange={handleToggleSelectAll}
                    id="checkbox-select-all-companies"
                  />
                </th>
                <th>Company / Tier</th>
                <th>Contact Details</th>
                <th>GSTIN & State</th>
                <th style={{ textAlign: "right" }}>Credit / Split</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCompanies.map((c) => {
                const isSelectedRow = selectedCompany?.id === c.id;
                const isChecked = selectedIds.includes(c.id);

                return (
                  <tr
                    key={c.id}
                    className={`company-row ${isSelectedRow ? "selected" : ""}`}
                    onClick={() => onSelectCompany(c)}
                    id={`company-row-${c.id}`}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleToggleRow(c.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        id={`checkbox-company-${c.id}`}
                      />
                    </td>

                    <td>
                      <div className="company-cell-cluster">
                        <div className={`company-avatar-box ${c.tierType}`}>
                          {c.initials}
                        </div>
                        <div className="company-info-meta">
                          <div className="company-name-row">
                            <span className="company-name-text">
                              {c.shortName}
                            </span>
                            {c.gstVerified && (
                              <span
                                className="material-symbols-outlined verified-icon"
                                title="GST & KYC Verified"
                              >
                                verified
                              </span>
                            )}
                          </div>
                          <div className="company-tags-row">
                            <span className={`company-tier-chip ${c.tierType}`}>
                              {c.tier}
                            </span>
                            <span className="company-code-text">{c.code}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-name">{c.contact.name}</div>
                      <div className="contact-phone">{c.contact.phone}</div>
                    </td>

                    <td>
                      <div className="gstin-code">{c.gstin}</div>
                      <div className="gstin-state">{c.state}</div>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div
                        className={`credit-amount ${
                          c.status === "Credit Breach" ? "breached" : ""
                        }`}
                      >
                        {c.credit.usedDisplay}{" "}
                        <span className="credit-limit-denom">
                          / {c.credit.limitDisplay}
                        </span>
                      </div>
                      <div
                        className={`split-subtitle ${
                          c.status === "Credit Breach"
                            ? "breached"
                            : c.status === "Credit Watch"
                            ? "warning"
                            : ""
                        }`}
                      >
                        {c.credit.splitSummary}
                      </div>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <span className={`status-pill ${c.statusType}`}>
                        {c.status === "Active" && (
                          <span className="status-dot"></span>
                        )}
                        {c.status}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn-row-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCompany(c);
                        }}
                        title="View Company Dossier"
                        id={`btn-view-${c.id}`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          visibility
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredCompanies.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No company accounts found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="companies-pagination-footer">
          <span className="pagination-range-text">
            Showing{" "}
            <strong>
              {filteredCompanies.length === 0
                ? "0"
                : `${(currentPageClamped - 1) * PAGE_SIZE + 1} - ${Math.min(
                    currentPageClamped * PAGE_SIZE,
                    filteredCompanies.length
                  )}`}
            </strong>{" "}
            of <strong>{filteredCompanies.length}</strong> companies
          </span>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                type="button"
                className="btn-page-step"
                disabled={currentPageClamped <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                title="Previous page"
                id="btn-page-prev"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chevron_left
                </span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`btn-page-step ${currentPageClamped === num ? "active" : ""}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                className="btn-page-step"
                disabled={currentPageClamped >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                title="Next page"
                id="btn-page-next"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Operations Banner: Bulk GSTIN & KYC Verification */}
      <div className="companies-ops-banner">
        <div className="banner-left">
          <div className="banner-icon-pod">
            <span className="material-symbols-outlined text-[20px]">
              assignment_turned_in
            </span>
          </div>
          <div>
            <h4 className="banner-title">
              Bulk GSTIN &amp; KYC Verification Run
            </h4>
            <p className="banner-desc">
              {(counts?.pendingKyc || 0) > 0
                ? `${counts.pendingKyc} pending account${counts.pendingKyc > 1 ? "s are" : " is"} queued for automated MCA and GST portal verification.`
                : "All registered enterprise corporate accounts have active verified GSTIN status."}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-run-verification"
          onClick={onRunBulkVerification}
          disabled={(counts?.pendingKyc || 0) === 0}
          id="btn-run-bulk-verification"
        >
          Run Verification
        </button>
      </div>
    </div>
  );
}

CompaniesRegisterTable.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedCompany: PropTypes.object,
  onSelectCompany: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  counts: PropTypes.object.isRequired,
  onRunBulkVerification: PropTypes.func.isRequired,
};

export default CompaniesRegisterTable;
