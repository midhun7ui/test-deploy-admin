import apiClient from "../../../lib/apiClient";

/**
 * HireD Admin Operations Portal — Invoicing REST Client
 * Connects to Django Backend endpoints under /api/v1/admin/invoices/
 */

export function transformInvoiceRecord(raw) {
  if (!raw) return null;
  const numId = raw.id;
  const invStr = typeof numId === "number" ? `INV-2026-${String(numId).padStart(4, "0")}` : String(numId);
  const totalBase = parseFloat(raw.total_trip_amount || 0);
  const gst = totalBase * 0.18;
  const gross = totalBase + gst;

  let statusLabel = "Draft";
  let statusType = "draft";
  let curStep = 1;

  if (raw.status === "pending_verification") {
    statusLabel = "Review Pending";
    statusType = "pending";
    curStep = 2;
  } else if (raw.status === "verified") {
    statusLabel = "Verified";
    statusType = "verified";
    curStep = 3;
  } else if (raw.status === "published") {
    statusLabel = "Published";
    statusType = "sent";
    curStep = 4;
  }

  const compName = raw.company_name || "Enterprise Client";
  const words = compName.split(" ");
  const initials = words.length >= 2 ? `${words[0][0]}${words[1][0]}`.toUpperCase() : compName.slice(0, 2).toUpperCase();

  return {
    id: invStr,
    numericId: numId,
    invoiceNumber: `#${invStr}`,
    date: raw.created_at
      ? new Date(raw.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "14 Oct 2026",
    account: {
      id: `ACC-2026-${String(raw.company_id || 1).padStart(3, "0")}`,
      code: `ACC-2026-${String(raw.company_id || 1).padStart(3, "0")}`,
      name: compName,
      shortName: compName,
      initials,
      gstin: "27AABCS1429B1Z2",
      isVerified: true,
      billingCycle: `${raw.month || 10}/${raw.year || 2026} Monthly Billing Cycle`,
      creditTerms: "Net 30 Days",
      virtualAccount: `VA-HIRED-${initials}`,
      ifsc: "HDFC0000060",
    },
    period: `${raw.month || 10}/${raw.year || 2026}`,
    tripCount: raw.trip_count || (raw.items ? raw.items.length : 0),
    tripSummary: `${raw.trip_count || (raw.items ? raw.items.length : 0)} Closed Trips`,
    podVerifiedPct: 100,
    baseFreight: totalBase,
    baseFreightDisplay: `₹${totalBase.toLocaleString("en-IN")}`,
    loadingDetention: 0,
    loadingDetentionDisplay: "₹0.00",
    taxableValue: totalBase,
    taxableValueDisplay: `₹${totalBase.toLocaleString("en-IN")}`,
    taxableValueFullDisplay: `₹${totalBase.toFixed(2)}`,
    cgst: gst / 2,
    cgstDisplay: `+₹${(gst / 2).toLocaleString("en-IN")}`,
    sgst: gst / 2,
    sgstDisplay: `+₹${(gst / 2).toLocaleString("en-IN")}`,
    gstTotal: gst,
    gstDisplay: `+₹${gst.toLocaleString("en-IN")} GST`,
    totalAmount: gross,
    totalAmountDisplay: `₹${gross.toLocaleString("en-IN")}`,
    status: statusLabel,
    statusType: statusType,
    actionLabel: curStep === 2 ? "Review" : curStep === 3 ? "Publish" : "View",
    workflow: {
      currentStep: curStep,
      totalSteps: 4,
      stepTitle:
        curStep === 1
          ? "Draft Invoice Created"
          : curStep === 2
          ? "Draft Invoice Awaiting Admin Verification"
          : curStep === 3
          ? "Admin Verified — Ready to Publish"
          : "Invoice Published to B2B Partner Portal",
      stepSubtitle: raw.verified_at ? `Verified on ${new Date(raw.verified_at).toLocaleString()}` : "Automated billing checks passed",
      steps: [
        { number: 1, name: "Consolidated", author: "Ops Admin", date: "Auto", isDone: curStep >= 1 },
        { number: 2, name: "Verification", author: "Admin 1", date: "Pending", isDone: curStep >= 2 },
        { number: 3, name: "Approval", author: "Admin 2", date: "Pending", isDone: curStep >= 3 },
        { number: 4, name: "Published", author: "Client Sent", date: "Portal", isDone: curStep >= 4 },
      ],
    },
  };
}

export const invoicingApi = {
  /**
   * Fetch all invoices with optional company, status, year, month filters
   */
  async getInvoices({ company_id, status, year, month } = {}) {
    const params = new URLSearchParams();
    if (company_id && company_id !== "ALL") params.append("company_id", company_id);
    if (status && status !== "ALL") params.append("status", status.toLowerCase());
    if (year) params.append("year", year);
    if (month) params.append("month", month);

    const qs = params.toString() ? `?${params.toString()}` : "";
    const response = await apiClient.get(`/api/v1/admin/invoices/${qs}`);
    const list = Array.isArray(response.data) ? response.data : [];
    return list.map(transformInvoiceRecord);
  },

  /**
   * Fetch live KPI metrics and tab badge counts
   */
  async getInvoiceStats() {
    const response = await apiClient.get("/api/v1/admin/invoices/stats/");
    return response.data;
  },

  /**
   * Fetch single invoice with line items and verification logs
   */
  async getInvoiceById(id) {
    const numericId = typeof id === "string" ? id.replace(/\D/g, "") : id;
    const response = await apiClient.get(`/api/v1/admin/invoices/${numericId}/`);
    return transformInvoiceRecord(response.data);
  },

  /**
   * Generate a monthly draft invoice from closed trips
   */
  async generateInvoice({ company_id, month = 10, year = 2026 } = {}) {
    const response = await apiClient.post("/api/v1/admin/invoices/generate/", {
      company_id,
      month,
      year,
    });
    return transformInvoiceRecord(response.data);
  },

  /**
   * Submit draft invoice for administrative verification
   */
  async submitInvoice(id) {
    const numericId = typeof id === "string" ? id.replace(/\D/g, "") : id;
    const response = await apiClient.post(`/api/v1/admin/invoices/${numericId}/submit/`);
    return transformInvoiceRecord(response.data);
  },

  /**
   * Verify/Sign-off invoice
   */
  async verifyInvoice(id, { status = "approved", reason = "Administrative verification verified against PODs" } = {}) {
    const numericId = typeof id === "string" ? id.replace(/\D/g, "") : id;
    const response = await apiClient.post(`/api/v1/admin/invoices/${numericId}/verifications/`, {
      status,
      reason,
    });
    return transformInvoiceRecord(response.data);
  },

  /**
   * Publish verified invoice to B2B partner portal
   */
  async publishInvoice(id) {
    const numericId = typeof id === "string" ? id.replace(/\D/g, "") : id;
    const response = await apiClient.post(`/api/v1/admin/invoices/${numericId}/publish/`);
    return transformInvoiceRecord(response.data);
  },

  /**
   * Fetch Order Tax Invoices (GST Rule 46) & uninvoiced orders
   */
  async getOrderInvoices({ company_id, status, search } = {}) {
    const params = new URLSearchParams();
    if (company_id && company_id !== "ALL") params.append("company_id", company_id);
    if (status && status !== "ALL") params.append("status", status.toLowerCase());
    if (search && search.trim()) params.append("search", search.trim());

    const qs = params.toString() ? `?${params.toString()}` : "";
    const response = await apiClient.get(`/api/v1/admin/order-invoices/${qs}`);
    return response.data;
  },

  /**
   * Generate Order Tax Invoice (individual order or all uninvoiced)
   */
  async generateOrderInvoice({ order_id, gst_rate = 18.0, is_rcm = false, place_of_supply = "32-Kerala", is_inter_state = false } = {}) {
    const response = await apiClient.post("/api/v1/admin/order-invoices/generate/", {
      order_id,
      gst_rate,
      is_rcm,
      place_of_supply,
      is_inter_state,
    });
    return response.data;
  },

  /**
   * Download / Get S3 PDF for Order Tax Invoice
   */
  async getOrderInvoicePdf(id) {
    const response = await apiClient.get(`/api/v1/admin/order-invoices/${id}/pdf/`);
    return response.data;
  },

  /**
   * Fetch Driver Payout Settlement Vouchers (TDS Sec 194C)
   */
  async getPayoutInvoices({ driver_id, status, search } = {}) {
    const params = new URLSearchParams();
    if (driver_id && driver_id !== "ALL") params.append("driver_id", driver_id);
    if (status && status !== "ALL") params.append("status", status.toLowerCase());
    if (search && search.trim()) params.append("search", search.trim());

    const qs = params.toString() ? `?${params.toString()}` : "";
    const response = await apiClient.get(`/api/v1/admin/payout-invoices/${qs}`);
    return response.data;
  },

  /**
   * Generate Driver Payout Settlement Voucher (individual trip or all settled)
   */
  async generatePayoutInvoice({ trip_id, tds_rate = 1.0, utr_number = "" } = {}) {
    const response = await apiClient.post("/api/v1/admin/payout-invoices/generate/", {
      trip_id,
      tds_rate,
      utr_number,
    });
    return response.data;
  },

  /**
   * Download / Get S3 PDF for Driver Payout Settlement Voucher
   */
  async getPayoutInvoicePdf(id) {
    const response = await apiClient.get(`/api/v1/admin/payout-invoices/${id}/pdf/`);
    return response.data;
  },

  /**
   * Fetch Consolidated GST & Billing Compliance KPIs
   */
  async getBillingGstStats() {
    const response = await apiClient.get("/api/v1/admin/billing/stats/");
    return response.data;
  },
};

export default invoicingApi;

