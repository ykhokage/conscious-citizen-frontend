import { useEffect, useMemo, useState } from "react";
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

export default function MapPicker({
  initial = { lat: 53.1959, lon: 50.1002 },
  onPick,
}) {
  const [map, setMap] = useState(null);

  const center = useMemo(() => [initial.lat, initial.lon], [initial]);

  useEffect(() => {
    if (map) return;
    const m = L.map("map", { zoomControl: true }).setView(center, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);

    const mk = L.marker(center, { draggable: true }).addTo(m);

    mk.on("dragend", () => {
      const p = mk.getLatLng();
      onPick?.(p.lat, p.lng);
    });

    m.on("click", (e) => {
      mk.setLatLng(e.latlng);
      onPick?.(e.latlng.lat, e.latlng.lng);
    });

    setMap(m);
    onPick?.(initial.lat, initial.lon);

    return () => {
      m.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id="map"
      className="h-[420px] w-full rounded-2xl overflow-hidden border border-slate-800"
    />
  );
}
