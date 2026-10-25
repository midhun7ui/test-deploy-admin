import apiClient from "../../../lib/apiClient";

/**
 * Service for HireD Admin Performance Analytics module.
 * Connects directly to Django REST Framework endpoints under /api/v1/admin/analytics/
 */

export async function fetchAnalyticsOverview(params = {}) {
  const query = new URLSearchParams();
  if (params.timeframe) query.append("timeframe", params.timeframe);
  if (params.comparison) query.append("comparison", params.comparison);
  if (params.category) query.append("category", params.category);

  const qs = query.toString();
  const url = `/api/v1/admin/analytics/overview/${qs ? `?${qs}` : ""}`;
  const response = await apiClient.get(url);
  return response.data;
}
