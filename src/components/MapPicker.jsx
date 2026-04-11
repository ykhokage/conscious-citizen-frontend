import { useEffect, useRef } from "react";
import L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * ✅ УПРОЩЁННЫЙ, НО РЕАЛЬНЫЙ КОНТУР САМАРСКОЙ ОБЛАСТИ
 * (достаточно точный для валидации)
 */
const samaraGeoJSON = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [[
      [48.1, 53.9],
      [48.5, 54.3],
      [49.5, 54.5],
      [50.8, 54.6],
      [52.3, 54.3],
      [52.9, 53.8],
      [53.1, 53.3],
      [52.6, 52.7],
      [51.8, 52.3],
      [50.7, 52.1],
      [49.6, 52.0],
      [48.8, 52.2],
      [48.2, 52.8],
      [48.1, 53.4],
      [48.1, 53.9]
    ]]
  }
};

const TILE_PROVIDERS = [
  {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      subdomains: ["a", "b", "c"],
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    },
  },
  {
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    options: {
      subdomains: ["a", "b", "c"],
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap contributors",
    },
  },
  {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    options: {
      subdomains: ["a", "b", "c", "d"],
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    },
  },
];

function buildLayer(provider) {
  return L.tileLayer(provider.url, {
    ...provider.options,
    detectRetina: true,
    updateWhenIdle: true,
    keepBuffer: 2,
    crossOrigin: true,
  });
}

export default function MapPicker({
  initial = { lat: 53.1959, lon: 50.1002 },
  onPick
}) {
  const shellRef = useRef(null);
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const layerRef = useRef(null);
  const providerIndexRef = useRef(0);
  const onPickRef = useRef(onPick);

  onPickRef.current = onPick;

  // ✅ проверка попадания в область
  const isInsideSamara = (lat, lng) => {
    const pt = turf.point([lng, lat]);
    return turf.booleanPointInPolygon(pt, samaraGeoJSON);
  };

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;

    const center = [initial.lat, initial.lon];

    const map = L.map(mapNodeRef.current, {
      zoomControl: true,
      preferCanvas: true,
      scrollWheelZoom: true,
      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false,
    }).setView(center, 7);

    mapRef.current = map;

    const switchLayer = (nextIndex) => {
      if (!mapRef.current) return;

      if (layerRef.current) {
        layerRef.current.off();
        mapRef.current.removeLayer(layerRef.current);
      }

      providerIndexRef.current = nextIndex;
      const provider = TILE_PROVIDERS[nextIndex];
      const nextLayer = buildLayer(provider);
      layerRef.current = nextLayer;

      nextLayer.addTo(mapRef.current);
    };

    switchLayer(0);

    // ✅ рисуем границу области
    L.geoJSON(samaraGeoJSON, {
      style: {
        color: "#2563eb",
        weight: 2,
        fillOpacity: 0.1,
      },
    }).addTo(map);

    const marker = L.marker(center, { draggable: true }).addTo(map);
    markerRef.current = marker;

    // 🔒 контроль перетаскивания
    marker.on("dragend", () => {
      const point = marker.getLatLng();

      if (!isInsideSamara(point.lat, point.lng)) {
        alert("Можно выбирать только Самарскую область");
        marker.setLatLng(center);
        return;
      }

      onPickRef.current?.(point.lat, point.lng);
    });

    // 🔒 контроль клика
    map.on("click", (event) => {
      const { lat, lng } = event.latlng;

      if (!isInsideSamara(lat, lng)) {
        alert("Можно ставить метки только в Самарской области");
        return;
      }

      marker.setLatLng(event.latlng);
      onPickRef.current?.(lat, lng);
    });

    const invalidate = () => {
      requestAnimationFrame(() => {
        mapRef.current?.invalidateSize(false);
      });
    };

    const resizeObserver = new ResizeObserver(invalidate);
    if (shellRef.current) {
      resizeObserver.observe(shellRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      markerRef.current = null;
      layerRef.current?.off();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const next = L.latLng(initial.lat, initial.lon);

    if (!isInsideSamara(initial.lat, initial.lon)) return;

    markerRef.current.setLatLng(next);
    mapRef.current.setView(next, mapRef.current.getZoom(), { animate: false });
  }, [initial.lat, initial.lon]);

  return (
    <div
      ref={shellRef}
      className="relative isolate w-full overflow-hidden rounded-[2rem] border border-black/10 bg-[#d9d9d9]"
      style={{ height: 420 }}
    >
      <div ref={mapNodeRef} className="absolute inset-0" />
    </div>
  );
}