import apiClient from "../../../lib/apiClient";

/**
 * Service for HireD Admin Audit Logs & Security Telemetry module.
 * Connects directly to Django REST Framework endpoints under /api/v1/admin/audit-logs/
 */

export async function fetchAuditLogs(params = {}) {
  const queryParams = {};
  if (params.category && params.category !== "all") queryParams.category = params.category;
  if (params.severity && params.severity !== "all") queryParams.severity = params.severity;
  if (params.search) queryParams.search = params.search;

  const response = await apiClient.get("/api/v1/admin/audit-logs/", { params: queryParams });
  return response.data;
}

export async function fetchAuditStats() {
  const response = await apiClient.get("/api/v1/admin/audit-logs/stats/");
  return response.data;
}

export async function exportAuditLogs(format = "JSON-SIEM") {
  const response = await apiClient.post("/api/v1/admin/audit-logs/export/", { format });
  return response.data;
}
