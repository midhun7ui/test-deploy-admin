import apiClient from "../../../lib/apiClient";

/**
 * HireD Admin Operations Portal — Drivers Management REST Client
 * Connects to Django Backend endpoints under /api/v1/admin/drivers/
 */

export const driversApi = {
  /**
   * Fetch drivers list with optional corridor, status tab, and search filters
   */
  async getDrivers({ corridor = "all", status = "all", search = "" } = {}) {
    const params = new URLSearchParams();
    if (corridor && corridor !== "all") params.append("corridor", corridor);
    if (status && status !== "all") params.append("status", status);
    if (search && search.trim()) params.append("search", search.trim());

    const qs = params.toString() ? `?${params.toString()}` : "";
    const response = await apiClient.get(`/api/v1/admin/drivers/${qs}`);
    return response.data;
  },

  /**
   * Fetch live KPI metrics and tab badge counts
   */
  async getDriverStats() {
    const response = await apiClient.get("/api/v1/admin/drivers/stats/");
    return response.data;
  },

  /**
   * Fetch complete dossier for a single driver
   */
  async getDriverDetails(driverId) {
    const response = await apiClient.get(`/api/v1/admin/drivers/${driverId}/`);
    return response.data;
  },

  /**
   * Onboard a new driver account
   */
  async onboardDriver(payload) {
    const response = await apiClient.post("/api/v1/admin/drivers/", payload);
    return response.data;
  },

  /**
   * Review and verify KYC compliance documents
   */
  async verifyKyc(driverId, { isFullyApproved = true, verifiedCount = 5, adminNotes = "" } = {}) {
    const response = await apiClient.post(`/api/v1/admin/drivers/${driverId}/verify-kyc/`, {
      isFullyApproved,
      verifiedCount,
      adminNotes,
    });
    return response.data;
  },

  /**
   * Review and approve ('Active') or deny ('Rejected') driver bank details
   */
  async verifyBank(driverId, { status = "Active", reason = "" } = {}) {
    const response = await apiClient.post(`/api/v1/admin/drivers/${driverId}/verify-bank/`, {
      status,
      reason,
    });
    return response.data;
  },

  /**
   * Toggle driver suspension / active status
   */
  async toggleStatus(driverId) {
    const response = await apiClient.post(`/api/v1/admin/drivers/${driverId}/toggle-status/`);
    return response.data;
  },

  /**
   * Reassign vehicle license plate, approve own vehicle request, or reject
   */
  async reassignVehicle(driverId, { vehicleNumber = "", vehicleType = "", action = "", reason = "" } = {}) {
    const response = await apiClient.post(`/api/v1/admin/drivers/${driverId}/reassign-vehicle/`, {
      vehicleNumber,
      vehicleType,
      action,
      reason,
    });
    return response.data;
  },

  /**
   * Fetch live available corridor trips awaiting driver allocation
   */
  async getAvailableTrips() {
    const response = await apiClient.get("/api/v1/admin/drivers/available-trips/");
    return response.data;
  },

  /**
   * Assign a freight trip to a driver
   */
  async assignTrip(driverId, { tripId, departureSlot = "" }) {
    const response = await apiClient.post(`/api/v1/admin/drivers/${driverId}/assign-trip/`, {
      tripId,
      departureSlot,
    });
    return response.data;
  },
};

export default driversApi;
