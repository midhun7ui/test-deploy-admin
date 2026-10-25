import apiClient from "../../../lib/apiClient";

/**
 * Service for HireD Admin Statements & Monthly Ledger module.
 * Connects directly to Django REST Framework endpoints under /api/v1/admin/statements/
 */

export async function fetchStatements(params = {}) {
  const queryParams = {};
  if (params.tab && params.tab !== "all") queryParams.tab = params.tab;
  if (params.search) queryParams.search = params.search;
  if (params.cycle && params.cycle !== "ALL") queryParams.cycle = params.cycle;
  if (params.entity && params.entity !== "ALL") queryParams.entity = params.entity;
  if (params.status && params.status !== "ALL") queryParams.status = params.status;

  const response = await apiClient.get("/api/v1/admin/statements/", { params: queryParams });
  return response.data;
}

export async function fetchStatementStats() {
  const response = await apiClient.get("/api/v1/admin/statements/stats/");
  return response.data;
}

export async function generateStatementRun(payload = {}) {
  const response = await apiClient.post("/api/v1/admin/statements/generate/", payload);
  return response.data;
}

export async function sendStatementEmail(statementId) {
  const response = await apiClient.post(`/api/v1/admin/statements/${statementId}/send-email/`);
  return response.data;
}

export async function sendStatementWhatsApp(statementId) {
  const response = await apiClient.post(`/api/v1/admin/statements/${statementId}/send-whatsapp/`);
  return response.data;
}

export async function flagStatementDiscrepancy(statementId, reason) {
  const response = await apiClient.post(`/api/v1/admin/statements/${statementId}/flag/`, { reason });
  return response.data;
}
