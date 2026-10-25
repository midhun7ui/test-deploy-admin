import apiClient from "../../../lib/apiClient";

/**
 * Service for HireD Admin Reports & Analytics module.
 * Connects directly to Django REST Framework endpoints under /api/v1/admin/reports/
 */

export async function fetchReportsOverview(dateRange = "this_month", corridor = "all") {
  const params = {};
  if (dateRange) params.date_range = dateRange;
  if (corridor && corridor !== "all") params.corridor = corridor;
  const response = await apiClient.get("/api/v1/admin/reports/overview/", { params });
  return response.data;
}

export async function fetchClientOrderVolume() {
  const response = await apiClient.get("/api/v1/admin/reports/client-order-volume/");
  return response.data;
}

export async function fetchTripsReport() {
  const response = await apiClient.get("/api/v1/admin/reports/trips/");
  return response.data;
}

export async function fetchOrdersReport() {
  const response = await apiClient.get("/api/v1/admin/reports/orders/");
  return response.data;
}
