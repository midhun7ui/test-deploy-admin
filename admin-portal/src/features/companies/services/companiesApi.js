import apiClient from "../../../lib/apiClient";

/**
 * HireD Admin Operations Portal — Companies Management REST Client
 * Connects to Django Backend endpoints under /api/v1/admin/companies/
 */

export const companiesApi = {
  /**
   * Fetch partner companies list with optional corridor, status tab, industry, and search filters
   */
  async getCompanies({ corridor = "all", status = "all", search = "", industry = "" } = {}) {
    const params = new URLSearchParams();
    if (corridor && corridor !== "all") params.append("corridor", corridor);
    if (status && status !== "all") params.append("status", status);
    if (industry && industry !== "All Industries" && industry !== "all") params.append("industry", industry);
    if (search && search.trim()) params.append("search", search.trim());

    const qs = params.toString() ? `?${params.toString()}` : "";
    const response = await apiClient.get(`/api/v1/admin/companies/${qs}`);
    return response.data;
  },

  /**
   * Fetch live KPI metrics and tab badge counts
   */
  async getCompanyStats() {
    const response = await apiClient.get("/api/v1/admin/companies/stats/");
    return response.data;
  },

  /**
   * Fetch single company dossier
   */
  async getCompanyById(companyId) {
    const response = await apiClient.get(`/api/v1/admin/companies/${companyId}/`);
    return response.data;
  },

  /**
   * Register a new corporate enterprise account
   */
  async createCompany(payload) {
    const response = await apiClient.post("/api/v1/admin/companies/", payload);
    return response.data;
  },

  /**
   * Update partner company attributes
   */
  async updateCompany(companyId, payload) {
    const response = await apiClient.patch(`/api/v1/admin/companies/${companyId}/`, payload);
    return response.data;
  },

  /**
   * Adjust contractual credit limit, payment terms, or security deposit
   */
  async updateCompanyCredit(companyId, creditPayload) {
    const response = await apiClient.post(`/api/v1/admin/companies/${companyId}/credit/`, creditPayload);
    return response.data;
  },

  /**
   * Configure commercial commission and driver/platform split rules
   */
  async updateCompanySplit(companyId, { driverSplit, notes } = {}) {
    const response = await apiClient.post(`/api/v1/admin/companies/${companyId}/split/`, {
      driverSplit,
      notes,
    });
    return response.data;
  },

  /**
   * Toggle company account status between Active and Suspended
   */
  async toggleCompanyStatus(companyId) {
    const response = await apiClient.post(`/api/v1/admin/companies/${companyId}/toggle-status/`);
    return response.data;
  },

  /**
   * Run bulk GSTIN verification for pending KYC accounts
   */
  async bulkVerifyCompanies() {
    const response = await apiClient.post("/api/v1/admin/companies/bulk-verify/");
    return response.data;
  },

  /**
   * Fetch all associates/users belonging to a partner company
   */
  async getCompanyAssociates(companyId) {
    const response = await apiClient.get(`/api/v1/admin/companies/${companyId}/associates/`);
    return response.data;
  },

  /**
   * Provision a new associate account for a partner company
   */
  async createCompanyAssociate(companyId, payload) {
    const response = await apiClient.post(`/api/v1/admin/companies/${companyId}/associates/`, payload);
    return response.data;
  },

  /**
   * Reset password for a company associate
   */
  async resetAssociatePassword(companyId, associateId, payload = {}) {
    const response = await apiClient.post(
      `/api/v1/admin/companies/${companyId}/associates/${associateId}/reset-password/`,
      payload
    );
    return response.data;
  },

  /**
   * Toggle active/blocked status for a company associate
   */
  async toggleAssociateStatus(companyId, associateId) {
    const response = await apiClient.post(
      `/api/v1/admin/companies/${companyId}/associates/${associateId}/toggle-status/`
    );
    return response.data;
  },
};

export default companiesApi;

