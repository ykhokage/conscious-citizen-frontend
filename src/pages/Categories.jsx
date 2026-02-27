import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Categories() {
  const nav = useNavigate();

  function choose(category) {
    sessionStorage.setItem("cc_category", category);
    nav("/map");
  }

  return (
    <div className="grid gap-4">
      <Card title="Рубрики">
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => choose("parking")}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5 hover:bg-slate-900 text-left"
          >
            <div className="text-lg font-semibold">Неправильная парковка</div>
            <div className="text-sm text-slate-300 mt-1">
              Сообщить о нарушении правил парковки
            </div>
          </button>

          <button
            onClick={() => choose("products")}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-5 hover:bg-slate-900 text-left"
          >
            <div className="text-lg font-semibold">Просроченные товары</div>
            <div className="text-sm text-slate-300 mt-1">
              Сообщить о продаже просроченных товаров
            </div>
          </button>
        </div>

        <div className="mt-4">
          <Button variant="ghost" onClick={() => nav("/my-incidents")}>
            Перейти к моим сообщениям
          </Button>
        </div>
      </Card>
    </div>
  );
}
