import apiClient from "../../../lib/apiClient";

/**
 * Service for HireD Admin Driver Payouts & Wallet Settlements module.
 * Connects directly to Django REST Framework endpoints under /api/v1/admin/payouts/
 */

export async function fetchPayouts(params = {}) {
  const queryParams = {};
  if (params.tab && params.tab !== "all") queryParams.tab = params.tab;
  if (params.search) queryParams.search = params.search;

  const response = await apiClient.get("/api/v1/admin/payouts/", { params: queryParams });
  return response.data;
}

export async function fetchPayoutStats() {
  const response = await apiClient.get("/api/v1/admin/payouts/stats/");
  return response.data;
}

export async function processBatchPayout(payoutIds = []) {
  const response = await apiClient.post("/api/v1/admin/payouts/batch-process/", { payoutIds });
  return response.data;
}

export async function disburseSinglePayout(payoutId) {
  const response = await apiClient.post(`/api/v1/admin/payouts/${payoutId}/disburse/`);
  return response.data;
}

export async function submitManualUTR(payoutId, utr) {
  const response = await apiClient.post(`/api/v1/admin/payouts/${payoutId}/manual-utr/`, { utr });
  return response.data;
}

export async function reconcileIMPS() {
  const response = await apiClient.post("/api/v1/admin/payouts/reconcile/");
  return response.data;
}
