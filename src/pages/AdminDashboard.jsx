import { Link } from "react-router-dom";
import Card from "../components/Card";

export default function AdminDashboard() {
  return (
    <Card title="Админ-панель">
      <div className="text-sm text-slate-300">
        В MVP администратор просматривает обращения и статистику.
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to="/admin/incidents"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm"
        >
          Все сообщения
        </Link>
      </div>
    </Card>
  );
}
