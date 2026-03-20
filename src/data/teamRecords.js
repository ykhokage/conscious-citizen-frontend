const memberProfiles = [
  {
    name: "Евгения Воробьева",
    role: "PM",
    summary:
      "Вела проект, собирала требования, синхронизировала команду и держала общий темп работы до финального результата.",
    imageSrc: "https://storage.yandexcloud.net/denisl/team/evgeniya.jpg",
  },
  {
    name: "Денис Ларин",
    role: "Technical Lead",
    summary:
      "Отвечал за технический каркас проекта, ключевые решения по архитектуре и за то, чтобы все части продукта сошлись в одну систему.",
    imageSrc: "https://storage.yandexcloud.net/denisl/team/denis.jpg",
  },
  {
    name: "Даниил Емелин",
    role: "Frontend",
    summary:
      "Собирал интерфейсы, страницы и компоненты, занимался пользовательским сценарием и подключением фронта к рабочим данным.",
    imageSrc: "https://storage.yandexcloud.net/denisl/team/daniil.jpg",
  },
  {
    name: "Максим Нехаев",
    role: "Backend",
    summary:
      "Работал над серверной логикой, API и обработкой данных, чтобы пользовательские сценарии работали стабильно и без ручных обходов.",
    imageSrc: "https://storage.yandexcloud.net/denisl/team/maksim.jpg",
  },
  {
    name: "Александр Райков",
    role: "Backend",
    summary:
      "Поддерживал серверную часть, маршруты и интеграции, помогал доводить внутреннюю логику и обмен данными до рабочего состояния.",
    imageSrc: "https://storage.yandexcloud.net/denisl/team/alexandra.jpg",
  },
  {
    name: "Михаил Мухтулов",
    role: "QA Tester",
    summary:
      "Проверял сценарии, искал баги, валидировал пользовательские потоки и помогал довести проект до более аккуратного состояния.",
    imageSrc: "https://storage.yandexcloud.net/denisl/team/mikhail.jpg",
  },
];

export const teamRecords = memberProfiles.map((profile, index) => ({
  id: index + 1,
  code: `member-${index + 1}`,
  roleLabel: "команда проекта",
  name: profile.name,
  role: profile.role,
  imageSrc: profile.imageSrc,
  summary: profile.summary,
}));