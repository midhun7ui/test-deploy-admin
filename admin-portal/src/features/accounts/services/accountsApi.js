import apiClient from "../../../lib/apiClient";

/**
 * HireD Admin Operations Portal — Accounts & Credit Control REST Client
 * Connects to Django Backend endpoints under /api/v1/admin/accounts/
 */

export const accountsApi = {
  /**
   * Fetch credit risk account ledger records with status & search filters
   */
  async getAccounts({ status = "all", search = "", month = "" } = {}) {
    const params = new URLSearchParams();
    if (status && status !== "all") params.append("status", status);
    if (search && search.trim()) params.append("search", search.trim());
    if (month && month !== "all") params.append("month", month);

    const qs = params.toString() ? `?${params.toString()}` : "";
    const response = await apiClient.get(`/api/v1/admin/accounts/${qs}`);
    return response.data;
  },

  /**
   * Fetch portfolio credit utilization and high-level KPI metrics
   */
  async getAccountStats() {
    const response = await apiClient.get("/api/v1/admin/accounts/stats/");
    return response.data;
  },

  /**
   * Revise sanctioned credit limit, terms, and bank guarantee deposit
   */
  async adjustCreditLimit(accountId, { creditLimit, terms, securityDeposit, depositType, remarks } = {}) {
    const response = await apiClient.post(`/api/v1/admin/accounts/${accountId}/adjust/`, {
      creditLimit,
      terms,
      securityDeposit,
      depositType,
      remarks,
    });
    return response.data;
  },

  /**
   * Issue a commercial credit note against an account
   */
  async issueCreditNote(accountId, { amount, reasonCode, invoiceRef } = {}) {
    const response = await apiClient.post(`/api/v1/admin/accounts/${accountId}/credit-note/`, {
      amount,
      reasonCode,
      invoiceRef,
    });
    return response.data;
  },

  /**
   * Grant emergency temporary dispatch override for breached/halted accounts
   */
  async grantDispatchOverride(accountId, { duration = "48 Hours", bufferAmount = 500000, approver = "" } = {}) {
    const response = await apiClient.post(`/api/v1/admin/accounts/${accountId}/override/`, {
      duration,
      bufferAmount,
      approver,
    });
    return response.data;
  },

  /**
   * Halt or resume bookings dispatch for an account
   */
  async toggleHaltBookings(accountId) {
    const response = await apiClient.post(`/api/v1/admin/accounts/${accountId}/toggle-halt/`);
    return response.data;
  },
};

export default accountsApi;
