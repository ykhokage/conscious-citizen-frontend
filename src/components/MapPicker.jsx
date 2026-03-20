import { useEffect, useRef } from "react";
import L from "leaflet";
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

export default function MapPicker({ initial = { lat: 53.1959, lon: 50.1002 }, onPick }) {
  const shellRef = useRef(null);
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const layerRef = useRef(null);
  const providerIndexRef = useRef(0);
  const onPickRef = useRef(onPick);

  onPickRef.current = onPick;

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return undefined;

    const center = [initial.lat, initial.lon];

    const map = L.map(mapNodeRef.current, {
      zoomControl: true,
      preferCanvas: true,
      scrollWheelZoom: true,
      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false,
    }).setView(center, 13);

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

      let tileErrors = 0;
      let tileLoaded = false;

      nextLayer.on("load", () => {
        tileLoaded = true;
      });

      nextLayer.on("tileerror", () => {
        tileErrors += 1;

        if (tileLoaded || tileErrors < 3) return;

        const fallbackIndex = providerIndexRef.current + 1;
        if (fallbackIndex < TILE_PROVIDERS.length) {
          switchLayer(fallbackIndex);
        }
      });

      nextLayer.addTo(mapRef.current);
    };

    switchLayer(0);

    const marker = L.marker(center, { draggable: true }).addTo(map);
    markerRef.current = marker;

    marker.on("dragend", () => {
      const point = marker.getLatLng();
      onPickRef.current?.(point.lat, point.lng);
    });

    map.on("click", (event) => {
      marker.setLatLng(event.latlng);
      onPickRef.current?.(event.latlng.lat, event.latlng.lng);
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

    const timeoutA = window.setTimeout(invalidate, 60);
    const timeoutB = window.setTimeout(invalidate, 220);

    return () => {
      window.clearTimeout(timeoutA);
      window.clearTimeout(timeoutB);
      resizeObserver.disconnect();
      markerRef.current = null;
      layerRef.current?.off();
      layerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const next = L.latLng(initial.lat, initial.lon);
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
