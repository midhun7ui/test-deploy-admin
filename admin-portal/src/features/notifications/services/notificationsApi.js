import apiClient from "../../../lib/apiClient";

/**
 * Service for HireD Admin Alerts & Notifications Outbox module.
 * Connects directly to Django REST Framework endpoints under /api/v1/admin/notifications/
 */

export async function fetchNotifications(params = {}) {
  const queryParams = {};
  if (params.shift) queryParams.shift = params.shift;
  if (params.category && params.category !== "all") queryParams.category = params.category;
  if (params.type && params.type !== "all") queryParams.type = params.type;
  if (params.severity && params.severity !== "all") queryParams.severity = params.severity;
  if (params.search) queryParams.search = params.search;

  const response = await apiClient.get("/api/v1/admin/notifications/", { params: queryParams });
  return response.data;
}

export async function fetchNotificationStats() {
  const response = await apiClient.get("/api/v1/admin/notifications/stats/");
  return response.data;
}

export async function broadcastNotification(payload) {
  const response = await apiClient.post("/api/v1/admin/notifications/broadcast/", payload);
  return response.data;
}

export async function fetchEmailOutbox() {
  const response = await apiClient.get("/api/v1/admin/notifications/outbox/");
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await apiClient.post("/api/v1/admin/notifications/read-all/");
  return response.data;
}

export async function markNotificationRead(id) {
  const response = await apiClient.post(`/api/v1/admin/notifications/${id}/read/`);
  return response.data;
}

export async function dismissNotification(id) {
  const response = await apiClient.delete(`/api/v1/admin/notifications/${id}/`);
  return response.data;
}

export async function acknowledgeNotification(id) {
  const response = await apiClient.post(`/api/v1/admin/notifications/${id}/acknowledge/`);
  return response.data;
}

export async function addNotificationAuditNote(id, text) {
  const response = await apiClient.post(`/api/v1/admin/notifications/${id}/notes/`, { text });
  return response.data;
}

export async function waiveNotificationPenalty(id, reason = "") {
  const response = await apiClient.post(`/api/v1/admin/notifications/${id}/waive-penalty/`, { reason });
  return response.data;
}

export async function fetchWebhookLogs() {
  const response = await apiClient.get("/api/v1/admin/notifications/webhooks/");
  return response.data;
}

export async function fetchAlertRules() {
  const response = await apiClient.get("/api/v1/admin/notifications/rules/");
  return response.data;
}

export async function saveAlertRules(rules) {
  const response = await apiClient.post("/api/v1/admin/notifications/rules/", { rules });
  return response.data;
}

export async function fetchChannelConfig() {
  const response = await apiClient.get("/api/v1/admin/notifications/channel-config/");
  return response.data;
}

export async function saveChannelConfig(config) {
  const response = await apiClient.post("/api/v1/admin/notifications/channel-config/", config);
  return response.data;
}
