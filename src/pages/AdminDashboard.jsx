import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="панель администратора"
        title="Админ-кабинет"
        description="Быстрый переход к просмотру обращений, ручной модерации, редактированию и удалению кейсов."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Модерация" description="Основной сценарий администратора: открыть список, проверить содержимое и принять решение.">
          <p className="text-sm leading-6 text-black/65">
            На странице обращений доступны поиск, фильтры, удаление, редактирование текста и собственные служебные метки.
          </p>
        </Card>

        <Card title="Все обращения" description="Перейти к административному списку доносов и жалоб.">
          <Link to="/admin/incidents">
            <Button variant="secondary">Открыть список</Button>
          </Link>
        </Card>

        <Card title="Примечание" description="Служебные метки администратора работают без изменения API.">
          <p className="text-sm leading-6 text-black/65">
            Метки вроде «в обработке», «рассматривается» или «готово» сохраняются локально в браузере администратора,
            а текст самого обращения редактируется через текущий backend.
          </p>
        </Card>
      </div>
    </div>
  );
}
