import apiClient from "../../../lib/apiClient";

export const vehiclesApi = {
  /**
   * List vehicles across the platform with filtering by source ("all", "company", "driver").
   * @param {Object} [params]
   * @param {string} [params.status] - "ALL", "PENDING", "APPROVED", "REJECTED", "UNASSIGNED"
   * @param {string} [params.search] - Registration number, model, driver name, company name
   * @param {string} [params.source] - "all" | "company" | "driver"
   * @returns {Promise<Array>}
   */
  async listVehicles(params = {}) {
    const cleanParams = {};
    if (params.status && params.status !== "ALL") {
      cleanParams.status = params.status;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }
    if (params.source && params.source !== "ALL") {
      cleanParams.source = params.source;
    }

    const response = await apiClient.get("/api/v1/admin/vehicles/", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Specifically list driver-owned / assigned vehicles.
   */
  async listDriverVehicles(params = {}) {
    const cleanParams = {};
    if (params.status && params.status !== "ALL") {
      cleanParams.status = params.status;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }

    const response = await apiClient.get("/api/v1/admin/vehicles/drivers/", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * Approve or reject a commercial driver vehicle request or registration.
   * @param {number|string} driverId
   * @param {"approve"|"reject"} action
   * @param {string} [rejectionReason]
   */
  async reviewDriverVehicle(driverId, action, rejectionReason = "") {
    const payload = { action };
    if (action === "reject") {
      payload.rejection_reason = rejectionReason || "Vehicle documentation or inspection failed compliance standards.";
      payload.reason = payload.rejection_reason;
    }

    const response = await apiClient.post(
      `/api/v1/admin/vehicles/drivers/${driverId}/review/`,
      payload
    );
    return response.data;
  },

  /**
   * Assign or update a vehicle plate to a driver directly.
   */
  async assignDriverVehicle(driverId, { vehicleNumber, vehicleType = "", vehicleModel = "" } = {}) {
    const response = await apiClient.post(
      `/api/v1/admin/drivers/${driverId}/reassign-vehicle/`,
      {
        vehicleNumber,
        vehicleType,
        vehicleModel,
      }
    );
    return response.data;
  },

  /**
   * Approve or reject an enterprise company fleet vehicle.
   * @param {number|string} vehicleId
   * @param {"approve"|"reject"} action
   * @param {string} [rejectionReason]
   * @returns {Promise<Object>}
   */
  async reviewVehicle(vehicleId, action, rejectionReason = "") {
    const payload = { action };
    if (action === "reject") {
      payload.rejection_reason = rejectionReason || "Documents or vehicle photo do not meet platform compliance standards.";
    }

    const response = await apiClient.post(
      `/api/v1/admin/vehicles/${vehicleId}/review/`,
      payload
    );
    return response.data;
  },
};

export default vehiclesApi;

