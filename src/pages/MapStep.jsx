import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Field from "../components/Field";
import MapPicker from "../components/MapPicker";
import api from "../api/client";

export default function MapStep() {
  const nav = useNavigate();
  const category = sessionStorage.getItem("cc_category") || "parking";

  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [address, setAddress] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [manual, setManual] = useState("");
  const [canProceed, setCanProceed] = useState(false);

  async function reverse(lat, lon) {
    setStatusMsg("");
    setCanProceed(false);
    try {
      const { data } = await api.get("/api/geo/reverse", { params: { lat, lon } });
      setAddress(data?.address || "");
      if (data?.inServiceArea) {
        setCanProceed(true);
      } else {
        setCanProceed(false);
        setStatusMsg(
          data?.message ||
            "В данном районе проект пока не работает. Выберите адрес в зоне работы."
        );
      }
    } catch {
      setStatusMsg("Не удалось получить адрес. Проверьте подключение/сервис.");
      setCanProceed(false);
    }
  }

  async function searchAddress(q) {
    setStatusMsg("");
    try {
      const { data } = await api.get("/api/geo/search", { params: { q } });
      const first = data?.items?.[0];
      if (!first) {
        setStatusMsg("Адрес не найден");
        return;
      }
      setManual(first.address);
      setAddress(first.address);
      setCoords({ lat: Number(first.lat), lon: Number(first.lon) });
      await reverse(Number(first.lat), Number(first.lon));
    } catch {
      setStatusMsg("Ошибка поиска адреса");
    }
  }

  function onPick(lat, lon) {
    setCoords({ lat, lon });
    reverse(lat, lon);
  }

  function next() {
    sessionStorage.setItem("cc_lat", String(coords.lat));
    sessionStorage.setItem("cc_lon", String(coords.lon));
    sessionStorage.setItem("cc_address", address);
    sessionStorage.setItem("cc_category", category);
    nav("/incident/create");
  }

  useEffect(() => {
    setCanProceed(false);
    setStatusMsg("");
  }, []);

  return (
    <div className="grid gap-4">
      <Card
        title="Выбор места на карте"
        right={
          <span className="text-xs text-slate-400">
            Рубрика: {category === "parking" ? "парковка" : "просрочка"}
          </span>
        }
      >
        <div className="grid gap-3">
          <MapPicker onPick={onPick} />

          <div className="grid sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <Field
                label="Адрес события (авто)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Адрес появится после выбора точки"
              />
            </div>
            <Button onClick={next} disabled={!canProceed}>
              Далее
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <Field
                label="Или введите адрес вручную"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="Начните вводить адрес…"
              />
            </div>
            <Button variant="ghost" onClick={() => searchAddress(manual)} disabled={!manual}>
              Найти
            </Button>
          </div>

          {statusMsg && (
            <div className="text-sm text-amber-300">{statusMsg}</div>
          )}
          {coords.lat && (
            <div className="text-xs text-slate-400">
              lat: {coords.lat.toFixed(6)} | lon: {coords.lon.toFixed(6)}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
