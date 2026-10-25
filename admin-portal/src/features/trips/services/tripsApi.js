import apiClient from "../../../lib/apiClient";

/**
 * REST API client for Admin B2B Trips Control Room module.
 * Provides live telemetry, corridor monitoring, driver assignment, and status controls.
 * All requests automatically carry JWT Bearer authorization via apiClient.
 */
export const tripsApi = {
  /**
   * Fetch all trips with optional filters.
   * @param {Object} [params] - { status, tonnage, search }
   * @returns {Promise<Array>}
   */
  async getTrips(params = {}) {
    const response = await apiClient.get("/api/v1/admin/trips/", { params });
    return response.data;
  },

  /**
   * Fetch live KPI metrics and tab counts.
   * @returns {Promise<Object>}
   */
  async getTripStats() {
    const response = await apiClient.get("/api/v1/admin/trips/stats/");
    return response.data;
  },

  /**
   * Get full dossier for a single trip.
   * @param {string|number} tripId - e.g. "TRP-10482" or 10482
   * @returns {Promise<Object>}
   */
  async getTripDetails(tripId) {
    const response = await apiClient.get(`/api/v1/admin/trips/${tripId}/`);
    return response.data;
  },

  /**
   * Create and dispatch a new B2B Trip.
   * @param {Object} payload - { client_name, origin, destination, cargo_type, tonnage, driver_id, rate, notes }
   * @returns {Promise<Object>}
   */
  async createTrip(payload) {
    const response = await apiClient.post("/api/v1/admin/trips/", payload);
    return response.data;
  },

  /**
   * Assign or reassign a driver to an existing trip.
   * @param {string|number} tripId
   * @param {Object} payload - { driver_id, vehicle_type, notes, status }
   * @returns {Promise<Object>}
   */
  async assignDriver(tripId, payload) {
    const response = await apiClient.post(
      `/api/v1/admin/trips/${tripId}/assign-driver/`,
      payload
    );
    return response.data;
  },

  /**
   * Mark trip as delivered and closed with verified ePOD.
   * @param {string|number} tripId
   * @returns {Promise<Object>}
   */
  async markDelivered(tripId) {
    const response = await apiClient.post(
      `/api/v1/admin/trips/${tripId}/mark-delivered/`,
      {}
    );
    return response.data;
  },

  /**
   * Cancel a trip with recorded reason.
   * @param {string|number} tripId
   * @param {string} reason
   * @returns {Promise<Object>}
   */
  async cancelTrip(tripId, reason) {
    const response = await apiClient.post(
      `/api/v1/admin/trips/${tripId}/cancel/`,
      { reason }
    );
    return response.data;
  },

  /**
   * Fetch active, verified drivers pool for dispatch assignment.
   * @returns {Promise<Array>}
   */
  async getDriversPool() {
    const response = await apiClient.get("/api/v1/admin/trips/drivers/");
    return response.data;
  },
};

export default tripsApi;
