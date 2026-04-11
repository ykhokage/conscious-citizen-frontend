import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Button from "../components/Button";
import Card from "../components/Card";
import Field from "../components/Field";
import MapPicker from "../components/MapPicker";
import PageHeader from "../components/PageHeader";
import { categoryLabel } from "../utils/format";

async function fallbackReverse(lat, lon) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("accept-language", "ru");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error("reverse failed");

  const data = await response.json();
  return { address: data?.display_name || "" };
}

async function fallbackSearch(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");
  url.searchParams.set("q", query);
  url.searchParams.set("accept-language", "ru");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error("search failed");

  const data = await response.json();
  return {
    items: (data || []).map((item) => ({
      address: item.display_name,
      lat: item.lat,
      lon: item.lon,
    })),
  };
}

export default function MapStep() {
  const navigate = useNavigate();
  const category = sessionStorage.getItem("cc_category") || "parking";

  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [address, setAddress] = useState("");
  const [manual, setManual] = useState("");
  const [serviceWarning, setServiceWarning] = useState("");
  const [busy, setBusy] = useState(false);

  const title = useMemo(() => categoryLabel(category), [category]);
  const effectiveAddress = address.trim() || manual.trim();
  const canProceed = Boolean(coords.lat && coords.lon && effectiveAddress);

  const reverse = useCallback(async (lat, lon) => {
    setServiceWarning("");

    try {
      const { data } = await api.get("/api/geo/reverse", { params: { lat, lon } });
      const resolvedAddress = data?.address || "";
      setAddress(resolvedAddress);

      if (data?.inServiceArea === false && data?.message) {
        setServiceWarning(data.message);
      }
      return;
    } catch {
      try {
        const data = await fallbackReverse(lat, lon);
        const resolvedAddress = data?.address || "";
        if (resolvedAddress) {
          setAddress(resolvedAddress);
          return;
        }
      } catch {}

      if (!address.trim() && manual.trim()) {
        setAddress(manual.trim());
      }
    }
  }, [address, manual]);

  async function searchAddress() {
    if (!manual.trim()) return;

    setBusy(true);
    setServiceWarning("");

    try {
      let data;

      try {
        const response = await api.get("/api/geo/search", { params: { q: manual } });
        data = response.data;
      } catch {
        data = await fallbackSearch(manual);
      }

      const first = data?.items?.[0];

      if (!first) {
        setAddress(manual.trim());
        return;
      }

      const nextCoords = { lat: Number(first.lat), lon: Number(first.lon) };
      setAddress(first.address || manual.trim());
      setCoords(nextCoords);
      await reverse(nextCoords.lat, nextCoords.lon);
    } catch {
      setAddress(manual.trim());
    } finally {
      setBusy(false);
    }
  }

  const handlePick = useCallback((lat, lon) => {
    setCoords({ lat, lon });
    reverse(lat, lon);
  }, [reverse]);

  function next() {
    sessionStorage.setItem("cc_lat", String(coords.lat));
    sessionStorage.setItem("cc_lon", String(coords.lon));
    sessionStorage.setItem("cc_address", effectiveAddress);
    sessionStorage.setItem("cc_category", category);
    navigate("/incident/create");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="геометка"
        title="Укажите место"
        description="Отметьте точку на карте или найдите адрес вручную."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card title="Карта" description={`Рубрика: ${title.toLowerCase()}`} className="overflow-hidden">
          <MapPicker onPick={handlePick} />
        </Card>

        <Card title="Адрес">
          <div className="space-y-4">
            <Field
              label="Выбранный адрес"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Адрес появится после выбора точки"
            />

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Field
                label="Поиск адреса"
                value={manual}
                onChange={(event) => setManual(event.target.value)}
                placeholder="Начните вводить адрес"
              />
              <div className="sm:self-end">
                <Button type="button" variant="secondary" size="lg" onClick={searchAddress} disabled={busy || !manual.trim()}>
                  Найти
                </Button>
              </div>
            </div>

            {serviceWarning && (
              <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {serviceWarning}
              </div>
            )}

            {coords.lat && coords.lon && (
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/65">
                lat: {coords.lat.toFixed(6)} · lon: {coords.lon.toFixed(6)}
              </div>
            )}

            <div className="pt-2">
              <Button type="button" size="lg" onClick={next} disabled={!canProceed} className="w-full sm:w-auto">
                Далее
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}