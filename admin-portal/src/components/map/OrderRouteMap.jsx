import { useEffect, useState } from "react";
import AwsRouteMap from "./AwsRouteMap";
import {
  calculateRoute,
  geocodeText,
} from "../../lib/awsLocationService";

const FALLBACK_CITY_COORDS = {
  Kochi: [76.2673, 9.9312],
  Ernakulam: [76.2999, 9.9816],
  Bengaluru: [77.5946, 12.9716],
  Bangalore: [77.5946, 12.9716],
  Kozhikode: [75.7804, 11.2588],
  Calicut: [75.7804, 11.2588],
  Thrissur: [76.2144, 10.5276],
  Chennai: [80.2707, 13.0827],
  Coimbatore: [76.9558, 11.0168],
  Kollam: [76.6141, 8.8932],
  Hyderabad: [78.4867, 17.385],
  Kannur: [75.3704, 11.8745],
  Mangaluru: [74.856, 12.9141],
  Mangalore: [74.856, 12.9141],
  Alappuzha: [76.3388, 9.4981],
  Palakkad: [76.6548, 10.7867],
  Trivandrum: [76.9366, 8.5241],
  Thiruvananthapuram: [76.9366, 8.5241],
  Mumbai: [72.8777, 19.076],
  Delhi: [77.209, 28.6139],
};

function getPredefinedCoords(cityName) {
  if (!cityName) return null;
  const trimmed = cityName.trim();
  for (const [key, coords] of Object.entries(FALLBACK_CITY_COORDS)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase())) {
      return coords;
    }
  }
  return null;
}

export default function OrderRouteMap({
  pickupCity,
  deliveryCity,
  pickupLabel,
  deliveryLabel,
  pickupCoords: propPickupCoords = null,
  deliveryCoords: propDeliveryCoords = null,
  liveLocation = null,
  height = "340px",
}) {
  const [resolvedPickup, setResolvedPickup] = useState(propPickupCoords);
  const [resolvedDelivery, setResolvedDelivery] = useState(propDeliveryCoords);
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Resolve coordinates
  useEffect(() => {
    let isCancelled = false;

    async function resolveLocations() {
      setLoading(true);
      setErrorMsg(null);

      let pCoords = propPickupCoords || getPredefinedCoords(pickupCity);
      let dCoords = propDeliveryCoords || getPredefinedCoords(deliveryCity);

      if (!pCoords && pickupCity) {
        try {
          const geo = await geocodeText(pickupCity);
          if (geo?.position) pCoords = geo.position;
        } catch (err) {
          console.warn("Geocoding pickup failed:", err);
        }
      }

      if (!dCoords && deliveryCity) {
        try {
          const geo = await geocodeText(deliveryCity);
          if (geo?.position) dCoords = geo.position;
        } catch (err) {
          console.warn("Geocoding delivery failed:", err);
        }
      }

      if (isCancelled) return;

      setResolvedPickup(pCoords);
      setResolvedDelivery(dCoords);

      if (pCoords && dCoords) {
        try {
          const route = await calculateRoute(pCoords, dCoords);
          if (!isCancelled && route) {
            setRouteGeometry(route.geometry);
            setRouteStats({
              distanceKm: route.distanceKm,
              durationFormatted: route.durationFormatted,
              majorRoads: route.majorRoads,
            });
          }
        } catch (err) {
          console.error("AWS Route calculation error:", err);
          if (!isCancelled) {
            setErrorMsg("Could not calculate road route. Showing pins.");
          }
        }
      } else if (!pCoords || !dCoords) {
        setErrorMsg("Unable to locate one or both cities.");
      }

      if (!isCancelled) setLoading(false);
    }

    resolveLocations();

    return () => {
      isCancelled = true;
    };
  }, [pickupCity, deliveryCity, propPickupCoords, propDeliveryCoords]);

  if (!pickupCity && !deliveryCity && !resolvedPickup && !resolvedDelivery) {
    return (
      <div className="order-route-map-fallback">
        <span>Route map unavailable</span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <AwsRouteMap
        pickupCoords={resolvedPickup}
        deliveryCoords={resolvedDelivery}
        pickupLabel={pickupLabel || pickupCity || "Pickup"}
        deliveryLabel={deliveryLabel || deliveryCity || "Delivery"}
        routeGeometry={routeGeometry}
        routeStats={routeStats}
        isLoadingRoute={loading}
        liveLocation={liveLocation}
        interactive={false}
        height={height}
      />
      {errorMsg && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            zIndex: 4,
            background: "rgba(15, 23, 42, 0.8)",
            color: "#f87171",
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          {errorMsg}
        </div>
      )}
    </div>
  );
}