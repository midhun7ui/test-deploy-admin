import apiClient from "../../../lib/apiClient";

/**
 * Service for HireD Operations Portal — Runtime Platform Settings.
 * Connects directly to Django REST Framework endpoints under /api/v1/admin/settings/
 */

export async function fetchPlatformSettings() {
  const response = await apiClient.get("/api/v1/admin/settings/");
  return response.data;
}

export async function updatePlatformSettings(data) {
  const response = await apiClient.patch("/api/v1/admin/settings/", data);
  return response.data;
}

export async function fetchPlatformSettingsKPIs() {
  const response = await apiClient.get("/api/v1/admin/settings/stats/");
  return response.data;
}

export async function pingDevicesApi() {
  const response = await apiClient.post("/api/v1/admin/settings/ping-devices/");
  return response.data;
}

export async function testWebhookApi() {
  const response = await apiClient.post("/api/v1/admin/settings/test-webhook/");
  return response.data;
}

export async function purgeCacheApi() {
  const response = await apiClient.post("/api/v1/admin/settings/purge-cache/");
  return response.data;
}

export async function reinitPricingApi() {
  const response = await apiClient.post("/api/v1/admin/settings/reinit-pricing/");
  return response.data;
}

export async function toggleMaintenanceModeApi(enabled) {
  const response = await apiClient.post("/api/v1/admin/settings/toggle-maintenance/", { enabled });
  return response.data;
}

