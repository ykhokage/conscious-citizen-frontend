import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

const categories = [
  {
    id: "parking",
    title: "Неправильная парковка",
    description: "Сообщить о машине, которая мешает проходу, проезду, общественному транспорту или припаркована с нарушением.",
  },
  {
    id: "products",
    title: "Просроченные товары",
    description: "Зафиксировать факт продажи просроченных продуктов, нарушений хранения или маркировки в торговой точке.",
  },
];

export default function Categories() {
  const navigate = useNavigate();

  function choose(category) {
    sessionStorage.setItem("cc_category", category);
    navigate("/map");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="новое обращение"
        title="Выберите рубрику"
        description="Сначала определим тип проблемы. Дальше вы отметите точку на карте, уточните адрес и заполните описание."
        actions={
          <Button variant="secondary" onClick={() => navigate("/my-incidents") }>
            Мои обращения
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {categories.map((category) => (
          <button key={category.id} type="button" onClick={() => choose(category.id)} className="text-left">
            <Card className="h-full transition hover:-translate-y-1 hover:shadow-[14px_14px_0_rgba(0,0,0,0.12)]">
              <div className="text-xs uppercase tracking-[0.22em] text-black/40">0{category.id === "parking" ? 1 : 2}</div>
              <div className="mt-4 text-3xl font-black uppercase leading-tight tracking-tight">{category.title}</div>
              <p className="mt-4 text-sm leading-6 text-black/65">{category.description}</p>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-black/70">
                Продолжить →
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
