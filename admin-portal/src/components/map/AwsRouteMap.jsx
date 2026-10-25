import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  getAwsMapStyleUrl,
  reverseGeocode,
} from "../../lib/awsLocationService";
import "../../styles/awsMap.css";

/**
 * Modern interactive AWS Location Service Map component.
 * Features:
 * - MapLibre GL JS vector map powered by Amazon Location Service V2 (Standard Style)
 * - Visual Pickup (A) & Delivery (B) markers
 * - Connecting road route polyline with dynamic framing
 * - Real-time Route summary metrics (Distance, Transit duration, Roads)
 * - Click-to-place pin mode with automatic reverse-geocoding
 */
export default function AwsRouteMap({
  pickupCoords, // [lng, lat]
  deliveryCoords, // [lng, lat]
  pickupLabel = "Pickup",
  deliveryLabel = "Delivery",
  routeGeometry, // [[lng, lat], ...]
  routeStats, // { distanceKm, durationFormatted, majorRoads }
  isLoadingRoute = false,
  onMapClickLocation, // ({ type: 'pickup' | 'delivery', coords: [lng, lat], address, city }) => void
  activePinMode = null, // 'pickup' | 'delivery' | null
  setActivePinMode = () => {},
  height = "380px",
  interactive = true,
  defaultStyle = "Hybrid", // Hybrid (Recommended for HireD), Satellite, Standard
  showStyleSwitcher = true,
  liveLocation = null, // { latitude, longitude, heading, speed, driver_name }
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const deliveryMarkerRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const routeGeometryRef = useRef(routeGeometry);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentStyle, setCurrentStyle] = useState(defaultStyle);
  const [isGeocodingClick, setIsGeocodingClick] = useState(false);

  useEffect(() => {
    routeGeometryRef.current = routeGeometry;
  }, [routeGeometry]);

  // Helper to add or update route geometry layers safely
  const applyRouteLayers = (mapInstance, coords) => {
    if (!mapInstance || !mapInstance.isStyleLoaded()) return;
    const sourceId = "aws-route-source";
    const casingLayerId = "aws-route-casing";
    const lineLayerId = "aws-route-line";

    if (coords && coords.length > 1) {
      const geojson = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coords,
        },
      };

      if (mapInstance.getSource(sourceId)) {
        mapInstance.getSource(sourceId).setData(geojson);
      } else {
        mapInstance.addSource(sourceId, {
          type: "geojson",
          data: geojson,
        });

        // Dark outer casing for optimal contrast against both satellite imagery and light roads
        mapInstance.addLayer({
          id: casingLayerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#020617",
            "line-width": 8,
            "line-opacity": 0.75,
          },
        });

        // Vibrant cyan-blue route polyline
        mapInstance.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#38bdf8",
            "line-width": 4.5,
            "line-opacity": 1.0,
          },
        });
      }
    } else {
      if (mapInstance.getLayer(lineLayerId)) mapInstance.removeLayer(lineLayerId);
      if (mapInstance.getLayer(casingLayerId)) mapInstance.removeLayer(casingLayerId);
      if (mapInstance.getSource(sourceId)) mapInstance.removeSource(sourceId);
    }
  };

  // Handle style switching (Hybrid, Satellite, Standard)
  const handleStyleChange = (styleId) => {
    if (styleId === currentStyle) return;
    setCurrentStyle(styleId);
    const map = mapRef.current;
    if (!map) return;

    const onStyleData = () => {
      if (map.isStyleLoaded()) {
        map.off("styledata", onStyleData);
        if (routeGeometryRef.current && routeGeometryRef.current.length > 1) {
          applyRouteLayers(map, routeGeometryRef.current);
        }
      }
    };

    map.on("styledata", onStyleData);
    map.setStyle(getAwsMapStyleUrl(styleId));
  };

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter = pickupCoords ||
      deliveryCoords || [76.2673, 9.9312]; // Default to Kochi, Kerala

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getAwsMapStyleUrl(currentStyle),
      center: initialCenter,
      zoom: 9,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }),
      "top-right"
    );

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.on("load", () => {
      setMapLoaded(true);
      map.resize();
    });

    map.on("styledata", () => {
      if (map.isStyleLoaded()) {
        setMapLoaded(true);
      }
    });

    map.on("error", (e) => {
      console.error("MapLibre error event:", e);
    });

    window.__awsMap = map;
    mapRef.current = map;

    // Handle container resize
    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(mapContainerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
    };
  }, []);

  // Handle map click for manual pin placement
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = async (e) => {
      if (!activePinMode || !onMapClickLocation) return;

      const { lng, lat } = e.lngLat;
      try {
        setIsGeocodingClick(true);
        const geo = await reverseGeocode(lng, lat);
        onMapClickLocation({
          type: activePinMode,
          coords: [lng, lat],
          city: geo?.city || "",
          address: geo?.formattedAddress || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        });
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        onMapClickLocation({
          type: activePinMode,
          coords: [lng, lat],
          city: "",
          address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        });
      } finally {
        setIsGeocodingClick(false);
      }
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [activePinMode, onMapClickLocation]);

  // Update cursor based on activePinMode
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getCanvas()) return;
    map.getCanvas().style.cursor = activePinMode ? "crosshair" : "";
  }, [activePinMode]);

  // Sync Pickup Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (pickupCoords && pickupCoords.length === 2) {
      if (!pickupMarkerRef.current) {
        const el = document.createElement("div");
        el.className = "aws-map-marker aws-map-marker-pickup";
        el.innerHTML = `
          <div class="marker-pulse"></div>
          <div class="marker-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>A</span>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<strong>Pickup Point</strong><br/>${pickupLabel}`
        );

        pickupMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat(pickupCoords)
          .setPopup(popup)
          .addTo(map);
      } else {
        pickupMarkerRef.current.setLngLat(pickupCoords);
      }
    } else if (pickupMarkerRef.current) {
      pickupMarkerRef.current.remove();
      pickupMarkerRef.current = null;
    }
  }, [pickupCoords, pickupLabel, mapLoaded]);

  // Sync Delivery Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (deliveryCoords && deliveryCoords.length === 2) {
      if (!deliveryMarkerRef.current) {
        const el = document.createElement("div");
        el.className = "aws-map-marker aws-map-marker-delivery";
        el.innerHTML = `
          <div class="marker-pulse"></div>
          <div class="marker-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span>B</span>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<strong>Delivery Destination</strong><br/>${deliveryLabel}`
        );

        deliveryMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat(deliveryCoords)
          .setPopup(popup)
          .addTo(map);
      } else {
        deliveryMarkerRef.current.setLngLat(deliveryCoords);
      }
    } else if (deliveryMarkerRef.current) {
      deliveryMarkerRef.current.remove();
      deliveryMarkerRef.current = null;
    }
  }, [deliveryCoords, deliveryLabel, mapLoaded]);

  // Sync Live Driver Location Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (
      liveLocation &&
      liveLocation.latitude != null &&
      liveLocation.longitude != null
    ) {
      const driverLngLat = [
        Number(liveLocation.longitude),
        Number(liveLocation.latitude),
      ];

      if (!driverMarkerRef.current) {
        const el = document.createElement("div");
        el.className = "aws-map-marker aws-map-marker-driver";
        el.innerHTML = `
          <div class="marker-pulse marker-pulse-driver"></div>
          <div class="marker-badge marker-badge-driver">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <span>LIVE</span>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<strong>Assigned Driver</strong><br/>${liveLocation.driver_name || "Driver"}<br/><small>Speed: ${liveLocation.speed || 0} km/h</small>`
        );

        driverMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat(driverLngLat)
          .setPopup(popup)
          .addTo(map);
      } else {
        driverMarkerRef.current.setLngLat(driverLngLat);
      }
    } else if (driverMarkerRef.current) {
      driverMarkerRef.current.remove();
      driverMarkerRef.current = null;
    }
  }, [liveLocation, mapLoaded]);

  // Sync Route GeoJSON Layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    applyRouteLayers(map, routeGeometry);

    if (routeGeometry && routeGeometry.length > 1) {
      // Fit map bounds to show complete route
      const bounds = new maplibregl.LngLatBounds();
      routeGeometry.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, {
        padding: { top: 70, bottom: 70, left: 70, right: 70 },
        maxZoom: 14,
        animate: true,
        duration: 900,
      });
    } else {
      // Fit bounds to single available marker
      if (pickupCoords && !deliveryCoords) {
        map.flyTo({ center: pickupCoords, zoom: 11 });
      } else if (deliveryCoords && !pickupCoords) {
        map.flyTo({ center: deliveryCoords, zoom: 11 });
      }
    }
  }, [routeGeometry, mapLoaded, pickupCoords, deliveryCoords]);

  return (
    <div className="aws-route-map-wrapper" style={{ height }}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="aws-map-container" />

      {/* Top Controls Bar: Pin Modes (Left) & Map Style Filters (Right) */}
      <div className="aws-map-top-bar">
        {/* Pin Mode Selection Pill */}
        {interactive && onMapClickLocation ? (
          <div className="aws-map-pin-controls">
            <button
              type="button"
              className={`pin-btn ${activePinMode === "pickup" ? "active-pickup" : ""}`}
              onClick={() =>
                setActivePinMode(activePinMode === "pickup" ? null : "pickup")
              }
            >
              <span className="dot dot-pickup"></span>
              {activePinMode === "pickup" ? "Click map for Pickup" : "Pin Pickup"}
            </button>
            <button
              type="button"
              className={`pin-btn ${activePinMode === "delivery" ? "active-delivery" : ""}`}
              onClick={() =>
                setActivePinMode(activePinMode === "delivery" ? null : "delivery")
              }
            >
              <span className="dot dot-delivery"></span>
              {activePinMode === "delivery" ? "Click map for Delivery" : "Pin Delivery"}
            </button>
          </div>
        ) : (
          <div />
        )}

        {/* AWS Map Style Switcher (Hybrid, Satellite, Street) */}
        {showStyleSwitcher && (
          <div className="aws-map-style-controls" role="group" aria-label="Map style filters">
            <button
              type="button"
              className={`style-pill-btn ${currentStyle === "Hybrid" ? "active" : ""}`}
              onClick={() => handleStyleChange("Hybrid")}
              title="Hybrid: Satellite Imagery with Roads & Labels (Recommended for HireD)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
              <span>Hybrid</span>
              <span className="style-recommended-badge">HireD</span>
            </button>

            <button
              type="button"
              className={`style-pill-btn ${currentStyle === "Satellite" ? "active" : ""}`}
              onClick={() => handleStyleChange("Satellite")}
              title="Satellite: Pure Photographic Satellite Imagery"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span>Satellite</span>
            </button>

            <button
              type="button"
              className={`style-pill-btn ${currentStyle === "Standard" ? "active" : ""}`}
              onClick={() => handleStyleChange("Standard")}
              title="Street: Standard Vector Navigation & Roads"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              <span>Street</span>
            </button>
          </div>
        )}
      </div>

      {/* Geocoding Click Spinner Banner */}
      {isGeocodingClick && (
        <div className="aws-map-status-banner">
          <div className="spinner-sm"></div>
          <span>Resolving address from map...</span>
        </div>
      )}

      {/* Loading Route Spinner */}
      {isLoadingRoute && (
        <div className="aws-map-status-banner">
          <div className="spinner-sm"></div>
          <span>Calculating road route via AWS Location Service...</span>
        </div>
      )}

      {/* Route Summary Pill */}
      {routeStats && !isLoadingRoute && (
        <div className="aws-map-stats-pill">
          <div className="stat-item">
            <span className="stat-label">DISTANCE</span>
            <span className="stat-val">{routeStats.distanceKm} km</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-label">EST. TIME</span>
            <span className="stat-val">{routeStats.durationFormatted}</span>
          </div>
          {routeStats.majorRoads && routeStats.majorRoads.length > 0 && (
            <>
              <div className="stat-divider"></div>
              <div className="stat-item stat-item-roads">
                <span className="stat-label">PRIMARY ROUTE</span>
                <span className="stat-val stat-val-roads" title={routeStats.majorRoads.join(", ")}>
                  {routeStats.majorRoads[0]}
                </span>
              </div>
            </>
          )}
          <div className="stat-badge-aws">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <span>AWS MAPS</span>
          </div>
        </div>
      )}
    </div>
  );
}
