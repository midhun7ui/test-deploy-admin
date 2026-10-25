import apiClient from "../../../lib/apiClient";

/**
 * REST API client for HireD Admin Portal B2B Partner Support Desk.
 * Manages partner ticket queues, operational responses, and problem resolutions.
 */
export const supportAdminApi = {
  /**
   * List all partner support tickets with optional filtering.
   * @param {Object} [params]
   * @param {string} [params.status]
   * @param {string} [params.priority]
   * @param {string} [params.category]
   * @param {number} [params.company_id]
   * @param {string} [params.search]
   * @returns {Promise<{tickets: Array, stats: Object}>}
   */
  async getTickets(params = {}) {
    const cleanParams = {};
    if (params.status && params.status !== "All") {
      cleanParams.status = params.status;
    }
    if (params.priority && params.priority !== "All") {
      cleanParams.priority = params.priority;
    }
    if (params.category && params.category !== "All") {
      cleanParams.category = params.category;
    }
    if (params.company_id) {
      cleanParams.company_id = params.company_id;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }

    const response = await apiClient.get("/api/v1/admin/support/tickets/", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Fetch live operations KPI stats for B2B partner support.
   * @returns {Promise<Object>}
   */
  async getStats() {
    const response = await apiClient.get("/api/v1/admin/support/tickets/stats/");
    return response.data;
  },

  /**
   * Fetch full ticket dossier including company details and complete conversation thread.
   * @param {string} ticketId
   * @returns {Promise<Object>}
   */
  async getTicketDetails(ticketId) {
    const response = await apiClient.get(`/api/v1/admin/support/tickets/${ticketId}/`);
    return response.data;
  },

  /**
   * Post an official operational response to the partner ticket.
   * @param {string} ticketId
   * @param {string} message
   * @param {string} [newStatus]
   * @returns {Promise<Object>}
   */
  async sendReply(ticketId, message, newStatus = null) {
    const payload = { message };
    if (newStatus) {
      payload.new_status = newStatus;
    }
    const response = await apiClient.post(
      `/api/v1/admin/support/tickets/${ticketId}/reply/`,
      payload
    );
    return response.data;
  },

  /**
   * Transition ticket status (e.g. Resolved, In Progress, Closed, Open) with an optional resolution note.
   * @param {string} ticketId
   * @param {string} status
   * @param {string} [resolutionNote]
   * @param {string} [priority]
   * @returns {Promise<Object>}
   */
  async updateStatus(ticketId, status, resolutionNote = "", priority = null) {
    const payload = { status };
    if (resolutionNote) {
      payload.resolution_note = resolutionNote;
    }
    if (priority) {
      payload.priority = priority;
    }
    const response = await apiClient.post(
      `/api/v1/admin/support/tickets/${ticketId}/status/`,
      payload
    );
    return response.data;
  },

  /**
   * General patch for updating priority, category, or status.
   * @param {string} ticketId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateTicket(ticketId, updateData) {
    const response = await apiClient.patch(
      `/api/v1/admin/support/tickets/${ticketId}/`,
      updateData
    );
    return response.data;
  },
};

export default supportAdminApi;
