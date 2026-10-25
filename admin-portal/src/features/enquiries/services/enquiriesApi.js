import apiClient from "../../../lib/apiClient";

/**
 * REST API client for Admin Enquiries & CRM module.
 * All requests automatically carry JWT Bearer authorization.
 */
export const enquiriesApi = {
  /**
   * Fetch all CRM enquiries with optional filters.
   * @param {Object} [params] - { status, priority, source, owner, q, period }
   * @returns {Promise<Array>}
   */
  async getEnquiries(params = {}) {
    const response = await apiClient.get("/api/v1/admin/enquiries/", { params });
    return response.data;
  },

  /**
   * Fetch live KPI stats for Enquiries pipeline.
   * @returns {Promise<Object>}
   */
  async getEnquiryStats() {
    const response = await apiClient.get("/api/v1/admin/enquiries/stats/");
    return response.data;
  },

  /**
   * Get single enquiry details with timeline events.
   * @param {string} enquiryId
   * @returns {Promise<Object>}
   */
  async getEnquiryDetails(enquiryId) {
    const response = await apiClient.get(`/api/v1/admin/enquiries/${enquiryId}/`);
    return response.data;
  },

  /**
   * Create a new freight enquiry.
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async createEnquiry(payload) {
    const response = await apiClient.post("/api/v1/admin/enquiries/", payload);
    return response.data;
  },

  /**
   * Update enquiry fields (status, priority, owner, notes).
   * @param {string} enquiryId
   * @param {Object} patchData
   * @returns {Promise<Object>}
   */
  async updateEnquiry(enquiryId, patchData) {
    const response = await apiClient.patch(
      `/api/v1/admin/enquiries/${enquiryId}/`,
      patchData
    );
    return response.data;
  },

  /**
   * Append an interaction note or discovery call log to the timeline.
   * @param {string} enquiryId
   * @param {Object} noteData - { title, desc, author }
   * @returns {Promise<Object>}
   */
  async addTimelineNote(enquiryId, noteData) {
    const response = await apiClient.post(
      `/api/v1/admin/enquiries/${enquiryId}/notes/`,
      noteData
    );
    return response.data;
  },

  /**
   * Convert qualified enquiry to live active Trip.
   * @param {string} enquiryId
   * @param {Object} conversionData - { tripAmount, driverSharePct, platformSharePct, vehicleType, pickupDate, cargoType }
   * @returns {Promise<Object>}
   */
  async convertTrip(enquiryId, conversionData) {
    const response = await apiClient.post(
      `/api/v1/admin/enquiries/${enquiryId}/convert-trip/`,
      conversionData
    );
    return response.data;
  },

  /**
   * Delete an enquiry.
   * @param {string} enquiryId
   * @returns {Promise<void>}
   */
  async deleteEnquiry(enquiryId) {
    await apiClient.delete(`/api/v1/admin/enquiries/${enquiryId}/`);
  },
};

export default enquiriesApi;
