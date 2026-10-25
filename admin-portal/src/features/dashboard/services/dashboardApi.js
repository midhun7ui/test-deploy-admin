import apiClient from "../../../lib/apiClient";

/**
 * REST API Client for HireD Admin Operations Dashboard.
 * All requests automatically carry the JWT Bearer token via apiClient interceptor.
 */
export const dashboardApi = {
  /**
   * Fetch complete operations dashboard overview including 7 KPIs,
   * Revenue/Billing summary, Driver Payout summary, Active trips,
   * Pending orders queue, and Recent activities.
   * @param {string} [period="month"] - "today" | "week" | "month" | "quarter"
   * @returns {Promise<Object>}
   */
  async getDashboardSummary(period = "month") {
    const response = await apiClient.get("/api/v1/admin/dashboard/summary/", {
      params: { period },
    });
    return response.data;
  },

  /**
   * Fetch active trips currently moving along highway transit corridors.
   * @returns {Promise<Array>}
   */
  async getActiveTrips() {
    const response = await apiClient.get("/api/v1/admin/dashboard/active-trips/");
    return response.data;
  },

  /**
   * Fetch pending orders queue requiring commercial quote review.
   * @returns {Promise<Array>}
   */
  async getPendingOrders() {
    const response = await apiClient.get("/api/v1/admin/dashboard/pending-orders/");
    return response.data;
  },

  /**
   * Accept an order quote and convert it into an active trip.
   * @param {string|number} orderId - Order ID e.g. "ORD-8942" or 8942
   * @param {Object} [payload] - Optional trip params { trip_amount, driver_id, eta }
   * @returns {Promise<Object>}
   */
  async acceptOrder(orderId, payload = {}) {
    const cleanId = String(orderId).replace("ORD-", "").trim();
    const response = await apiClient.post(
      `/api/v1/admin/orders/${cleanId}/accept/`,
      payload
    );
    return response.data;
  },

  /**
   * Reject an order quote with reason.
   * @param {string|number} orderId - Order ID
   * @param {string|Object} [reasonPayload] - { reason: "..." } or string
   * @returns {Promise<Object>}
   */
  async rejectOrder(orderId, reasonPayload = {}) {
    const cleanId = String(orderId).replace("ORD-", "").trim();
    const payload =
      typeof reasonPayload === "string"
        ? { reason: reasonPayload }
        : reasonPayload;
    const response = await apiClient.post(
      `/api/v1/admin/orders/${cleanId}/reject/`,
      payload
    );
    return response.data;
  },
};

export default dashboardApi;
