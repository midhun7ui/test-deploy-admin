/**
 * AWS Location Service helper client for B2B Portal.
 * Uses Amazon Location Service V2 APIs with API Key authentication:
 * - geo-maps: Vector tile style descriptor
 * - geo-places: Autocomplete, GetPlace, ReverseGeocode
 * - geo-routes: CalculateRoutes (geometry, distance, duration, turn-by-turn)
 */

const AWS_GEO_API_KEY =
  import.meta.env.VITE_AWS_GEO_API_KEY ||
  "v1.public.eyJqdGkiOiIyYWExNjlhNS1hNTdlLTRlZjMtYjg5YS1iMzAxYTM0MmE1YWEifQ4RZepw_B5tYfb6t1qwWooHNYt9ZEX0RLiPMRvaWj7moq0RxJfIlu7vkyFMrXBxLMlLwoxg83ERR8NxlpQ4-qZ2cwFgi7wyDrLK-ZFkH0iQljj2g8k0D3SzWb76i6SF3TWpG9Zy-VQxPOp5QNFygVwU-Lh-FVSD_i_iHugtmLOKpbklpshQc1eUk9OhiIVEKQ93IrgDYjxZOqp7mGMyf2yGi45qkaYMMqpNZxlCxcTpCjfeKojFZfkUxSEaYGj8NAzGwKAbpoGTc8GUrK1kSQIItyGSG77IDE5EYbERdhdvCqNnEwx1APgPFmFdrbvcAHJqQ8uzrKN5puE3GksMKOo.Njg1MGZlZTUtYTI2ZS00MDdlLWJjNDktMDNmZDlkNzVmMjQ0";

const AWS_GEO_REGION = import.meta.env.VITE_AWS_GEO_REGION || "ap-south-1";
const AWS_MAP_STYLE = import.meta.env.VITE_AWS_MAP_STYLE || "Hybrid";

export const AWS_MAP_STYLES = [
  { id: "Hybrid", label: "Hybrid", badge: "RECOMMENDED", description: "Satellite Imagery with Road Network & Labels" },
  { id: "Satellite", label: "Satellite", badge: "SATELLITE", description: "Pure Photographic Satellite Imagery" },
  { id: "Standard", label: "Street Map", badge: "VECTOR", description: "Standard Vector Navigation & Roads" },
  { id: "Monochrome", label: "Monochrome", badge: "DARK/LIGHT", description: "Minimalist High-Contrast Map" },
];

export const awsLocationConfig = {
  apiKey: AWS_GEO_API_KEY,
  region: AWS_GEO_REGION,
  style: AWS_MAP_STYLE,
};

/**
 * Returns the MapLibre style descriptor URL for AWS Location Service V2 Maps.
 */
export function getAwsMapStyleUrl(style = AWS_MAP_STYLE) {
  return `https://maps.geo.${AWS_GEO_REGION}.amazonaws.com/v2/styles/${style}/descriptor?key=${AWS_GEO_API_KEY}`;
}

/**
 * Autocomplete address search via AWS Location geo-places.
 * @param {string} queryText - User's search input.
 * @param {Array<number>} [biasPosition] - Optional [longitude, latitude] to bias results nearby.
 * @returns {Promise<Array<{placeId: string, title: string, label: string, placeType: string}>>}
 */
export async function autocompletePlaces(queryText, biasPosition) {
  if (!queryText || queryText.trim().length < 2) return [];

  const body = {
    QueryText: queryText.trim(),
    Filter: {
      IncludeCountries: ["IND"],
    },
  };

  if (biasPosition && biasPosition.length === 2) {
    body.BiasPosition = biasPosition;
  }

  const res = await fetch(
    `https://places.geo.${AWS_GEO_REGION}.amazonaws.com/v2/autocomplete?key=${AWS_GEO_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    throw new Error(`AWS Location autocomplete failed (${res.status})`);
  }

  const data = await res.json();
  return (data.ResultItems || []).map((item) => ({
    placeId: item.PlaceId,
    title: item.Title,
    label: item.Address?.Label || item.Title,
    placeType: item.PlaceType,
  }));
}

/**
 * Retrieves precise coordinates and address details for a given placeId.
 * @param {string} placeId
 * @returns {Promise<{position: [number, number], title: string, address: object, city: string}>}
 */
export async function getPlaceDetails(placeId) {
  if (!placeId) return null;

  const res = await fetch(
    `https://places.geo.${AWS_GEO_REGION}.amazonaws.com/v2/place/${encodeURIComponent(placeId)}?key=${AWS_GEO_API_KEY}`
  );

  if (!res.ok) {
    throw new Error(`AWS Location getPlace failed (${res.status})`);
  }

  const data = await res.json();
  const position = data.Position; // [lng, lat]
  const address = data.Address || {};
  const city =
    address.Locality ||
    address.SubRegion?.Name ||
    address.Region?.Name ||
    data.Title?.split(",")?.[0]?.trim() ||
    "";

  return {
    placeId: data.PlaceId,
    position, // [lng, lat]
    title: data.Title,
    address,
    city,
    formattedAddress: address.Label || data.Title,
    mapView: data.MapView,
  };
}

/**
 * Reverse geocodes coordinates to a human-readable place.
 * @param {number} lng
 * @param {number} lat
 * @returns {Promise<{placeId: string, title: string, city: string, formattedAddress: string, position: [number, number]}>}
 */
export async function reverseGeocode(lng, lat) {
  const res = await fetch(
    `https://places.geo.${AWS_GEO_REGION}.amazonaws.com/v2/reverse-geocode?key=${AWS_GEO_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        QueryPosition: [Number(lng), Number(lat)],
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`AWS Location reverse geocode failed (${res.status})`);
  }

  const data = await res.json();
  const first = (data.ResultItems || [])[0];
  if (!first) return null;

  const address = first.Address || {};
  const city =
    address.Locality ||
    address.SubRegion?.Name ||
    address.District ||
    address.Region?.Name ||
    first.Title?.split(",")?.[0]?.trim() ||
    "";

  return {
    placeId: first.PlaceId,
    title: first.Title,
    city,
    formattedAddress: address.Label || first.Title,
    position: first.Position || [lng, lat],
  };
}

/**
 * Calculates road route between 2 points via AWS Location Service geo-routes.
 * @param {[number, number]} origin - [lng, lat]
 * @param {[number, number]} destination - [lng, lat]
 * @returns {Promise<{
 *   geometry: Array<[number, number]>,
 *   distanceMeters: number,
 *   distanceKm: string,
 *   durationSeconds: number,
 *   durationFormatted: string,
 *   majorRoads: Array<string>,
 *   steps: Array<object>
 * }>}
 */
export async function calculateRoute(origin, destination) {
  if (!origin || !destination || origin.length !== 2 || destination.length !== 2) {
    return null;
  }

  const res = await fetch(
    `https://routes.geo.${AWS_GEO_REGION}.amazonaws.com/v2/routes?key=${AWS_GEO_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Origin: [Number(origin[0]), Number(origin[1])],
        Destination: [Number(destination[0]), Number(destination[1])],
        LegGeometryFormat: "Simple",
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AWS Route Calculation failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const route = data.Routes?.[0];
  if (!route) {
    throw new Error("No route found between selected locations.");
  }

  const leg = route.Legs?.[0] || {};
  const lineString = leg.Geometry?.LineString || [];
  const distanceMeters = route.Summary?.Distance || 0;
  const durationSeconds = route.Summary?.Duration || 0;

  const majorRoads = (route.MajorRoadLabels || [])
    .map((m) => m.RoadName?.Value || m.RouteNumber?.Value)
    .filter(Boolean);

  const steps = (leg.VehicleLegDetails?.TravelSteps || []).map((step) => ({
    type: step.Type,
    distanceMeters: step.Distance,
    durationSeconds: step.Duration,
    instruction: step.Instruction || step.Type,
    turn: step.TurnStepDetails?.SteeringDirection,
  }));

  return {
    geometry: lineString, // [[lng, lat], [lng, lat], ...]
    distanceMeters,
    distanceKm: (distanceMeters / 1000).toFixed(1),
    durationSeconds,
    durationFormatted: formatDuration(durationSeconds),
    majorRoads,
    steps,
  };
}

/**
 * Format duration in seconds to human-readable string (e.g., '1 hr 25 min' or '45 min').
 */
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "0 min";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hr${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes} min` : ""}`.trim();
  }
  return `${minutes} min`;
}

/**
 * Geocodes a free-text location/city string into coordinates and place info.
 * @param {string} text
 * @returns {Promise<{position: [number, number], city: string, formattedAddress: string} | null>}
 */
export async function geocodeText(text) {
  if (!text || text.trim().length < 2) return null;
  try {
    const results = await autocompletePlaces(text);
    if (!results || results.length === 0) return null;
    const details = await getPlaceDetails(results[0].placeId);
    return details;
  } catch (err) {
    console.error("geocodeText error:", err);
    return null;
  }
}

