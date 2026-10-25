import apiClient from "../../../lib/apiClient";

/**
 * Service for HireD Admin Users & RBAC Permissions Matrix module.
 * Connects directly to Django REST Framework endpoints under /api/v1/admin/
 */

export async function fetchStaffUsers(params = {}) {
  const queryParams = {};
  if (params.role && params.role !== "all") queryParams.role = params.role;
  if (params.search) queryParams.search = params.search;

  const response = await apiClient.get("/api/v1/admin/staff/", { params: queryParams });
  return response.data;
}

export async function fetchStaffStats() {
  const response = await apiClient.get("/api/v1/admin/staff/stats/");
  return response.data;
}

export async function inviteStaffUser(payload) {
  const response = await apiClient.post("/api/v1/admin/staff/invite/", payload);
  return response.data;
}

export async function updateStaffRole(userId, role) {
  const response = await apiClient.patch(`/api/v1/admin/staff/${userId}/role/`, { role });
  return response.data;
}

export async function toggleBlockUser(userId, isBlocked) {
  const response = await apiClient.patch(`/api/v1/admin/users/${userId}/block/`, { is_blocked: isBlocked });
  return response.data;
}
