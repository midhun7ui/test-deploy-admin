import apiClient from "../../../lib/apiClient";

/**
 * REST API client for Admin Orders Control Desk module.
 * All requests automatically carry JWT Bearer authorization.
 */
export const ordersApi = {
  /**
   * Fetch all orders with optional filters.
   * @param {Object} [params] - { status, vehicle, search, period, ordering }
   * @returns {Promise<Array>}
   */
  async getOrders(params = {}) {
    const response = await apiClient.get("/api/v1/admin/orders/", { params });
    return response.data;
  },

  /**
   * Fetch live KPI stats and pipeline tab badge counts.
   * @returns {Promise<Object>}
   */
  async getOrderStats() {
    const response = await apiClient.get("/api/v1/admin/orders/stats/");
    return response.data;
  },

  /**
   * Get single order details with full dossier, timeline, and notes.
   * @param {string|number} orderId
   * @returns {Promise<Object>}
   */
  async getOrderDetails(orderId) {
    const response = await apiClient.get(`/api/v1/admin/orders/${orderId}/`);
    return response.data;
  },

  /**
   * Create and book a new enterprise transport order.
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async createOrder(payload) {
    const response = await apiClient.post("/api/v1/admin/orders/", payload);
    return response.data;
  },

  /**
   * Accept an order and allocate a driver to dispatch as a live trip.
   * @param {string|number} orderId
   * @param {Object} payload - { driver: { id, name }, departureSchedule, opsRemarks }
   * @returns {Promise<Object>}
   */
  async acceptOrder(orderId, payload) {
    const response = await apiClient.post(
      `/api/v1/admin/orders/${orderId}/accept/`,
      payload
    );
    return response.data;
  },

  /**
   * Reject an order with recorded reason code and remarks.
   * @param {string|number} orderId
   * @param {Object} payload - { reasonCode, remarks }
   * @returns {Promise<Object>}
   */
  async rejectOrder(orderId, payload) {
    const response = await apiClient.post(
      `/api/v1/admin/orders/${orderId}/reject/`,
      payload
    );
    return response.data;
  },

  /**
   * Add internal operations note to an order.
   * @param {string|number} orderId
   * @param {string} text
   * @returns {Promise<Object>}
   */
  async addNote(orderId, text) {
    const response = await apiClient.post(
      `/api/v1/admin/orders/${orderId}/notes/`,
      { text }
    );
    return response.data;
  },

  /**
   * Fetch verified active driver pool for dispatch allocation.
   * @returns {Promise<Array>}
   */
  async getDriversPool() {
    const response = await apiClient.get("/api/v1/admin/orders/drivers/");
    return response.data;
  },

  /**
   * Fetch enterprise shipper companies for new order booking.
   * @returns {Promise<Array>}
   */
  async getClientsList() {
    const response = await apiClient.get("/api/v1/admin/orders/clients/");
    return response.data;
  },
};

export default ordersApi;
