export function formatDateTime(value) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function formatShortDate(value) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function categoryLabel(value) {
  switch (value) {
    case "parking":
      return "Неправильная парковка";
    case "products":
      return "Просроченные товары";
    default:
      return value || "Без рубрики";
  }
}

export function statusLabel(value) {
  switch (value) {
    case "draft":
      return "Черновик";
    case "published":
      return "Опубликовано";
    case "in_progress":
      return "В работе";
    case "resolved":
      return "Решено";
    default:
      return value || "Без статуса";
  }
}

export function initials(name = "") {
  return name
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
