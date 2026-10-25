/**
 * HireD Operations Portal — B2B Trips Control Room Configuration & Definitions
 * Live production zero-baseline configuration.
 * Real trips are fetched dynamically via tripsApi.
 */

export const INITIAL_TRIPS_DATA = [];

export const AVAILABLE_DRIVERS_POOL = [];

export const CORRIDOR_OPTIONS = [
  "NH-48 (Delhi - Mumbai - Chennai)",
  "NH-44 (Srinagar - Kanyakumari)",
  "NH-60 (Pune - Nashik)",
  "NH-544 (Salem - Kochi)",
  "NH-163 (Hyderabad - Warangal)",
  "NH-53 (Surat - Kolkata)",
  "NH-27 (Porbandar - Silchar)",
];

export const VEHICLE_TONNAGE_OPTIONS = [
  { label: "Medium LCV (10T-16T)", value: "medium" },
  { label: "Heavy Truck (20T+)", value: "heavy" },
  { label: "Multi-Axle Trailer (28T-40T)", value: "multi_axle" },
  { label: "Reefer / Cold Box (-20°C to +4°C)", value: "reefer" },
];

export const ENTERPRISE_CLIENTS = [
  { name: "Apex Freight Logistics Ltd", contractId: "SHM-1", creditDays: 30 },
  { name: "Blue Dart Surface Express", contractId: "SHM-2", creditDays: 30 },
  { name: "Reliance Retail Logistics Ltd", contractId: "SHM-3", creditDays: 45 },
  { name: "Western Dedicated Fleet Operators", contractId: "SHM-4", creditDays: 30 },
  { name: "Sharma Heavy Haulage Fleet", contractId: "SHM-5", creditDays: 30 },
];

/**
 * Calculates current KPI statistics based on live trips list
 */
export function computeTripStats(trips) {
  const safeList = Array.isArray(trips) ? trips : [];
  const activeCount = safeList.filter((t) => t.status !== "Delivered" && t.status !== "Cancelled").length;
  const inTransitCount = safeList.filter((t) => t.status === "In Transit").length;
  const atDockCount = safeList.filter((t) => t.status === "At Pickup" || t.status === "Scheduled").length;
  const awaitingCount = safeList.filter((t) => t.status === "Awaiting Driver" || !t.driver).length;
  const delayedCount = safeList.filter((t) => t.status === "Delayed" || t.sla === "Delayed").length;
  const deliveredCount = safeList.filter((t) => t.status === "Delivered").length;

  let slaRate = "100.0%";
  if (deliveredCount > 0 || delayedCount > 0) {
    const totalFinishedOrDelayed = deliveredCount + delayedCount;
    const rate = Math.round((deliveredCount / totalFinishedOrDelayed) * 1000) / 10;
    slaRate = `${rate}%`;
  }

  return {
    activeTrips: activeCount,
    inTransit: inTransitCount,
    atDock: atDockCount,
    slaRate: slaRate,
    slaChange: "+1.8%",
    slaTarget: "Target 95.0% SLA corridor benchmark",
    awaitingDriver: awaitingCount,
    avgDispatchDelay: activeCount > 0 ? "< 20 mins" : "0 mins",
    delayedCount: delayedCount,
    criticalCount: delayedCount > 0 ? 1 : 0,
    delayedCongestionNotice: delayedCount > 0 ? "Corridor incident logged" : "Real-time corridor telemetry active",
  };
}
