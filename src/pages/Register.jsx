import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Field from "../components/Field";
import { useAuth } from "../auth/AuthContext";

function AgreementModal({ open, onClose, onAccept }) {
  const scrollRef = useRef(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  useEffect(() => {
    if (open) {
      setScrolledToEnd(false);
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
        }
      });
    }
  }, [open]);

  if (!open) return null;

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;

    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 12;
    if (isAtBottom) {
      setScrolledToEnd(true);
    }
  }

  function handleOverlayMouseDown(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 px-4 py-6"
      onMouseDown={handleOverlayMouseDown}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] bg-[#f5f2ee] text-black shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-semibold text-black shadow-md transition hover:scale-105"
          aria-label="Закрыть"
        >
          ×
        </button>

        <div className="border-b border-black/10 px-6 py-6 sm:px-8 sm:py-7">
          <div className="text-[11px] uppercase tracking-[0.28em] text-black/45">
            Условия использования
          </div>
          <h2 className="mt-3 text-2xl font-black uppercase leading-none sm:text-3xl">
            Правила проекта
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
            Ознакомьтесь с правилами проекта, пользовательским соглашением и
            политикой обработки данных перед регистрацией.
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[52vh] overflow-y-auto px-6 py-6 sm:px-8"
        >
          <div className="space-y-6 text-[15px] leading-7 text-black/80">
            <section>
              <h3 className="text-base font-extrabold uppercase text-black">
                1. Правила проекта
              </h3>
              <p className="mt-2">
                Пользователь обязуется использовать сервис добросовестно,
                размещать только достоверную информацию об инцидентах и не
                публиковать материалы, содержащие оскорбления, угрозы, спам,
                заведомо ложные сведения, запрещённый контент или данные,
                нарушающие законодательство. Пользователь несёт ответственность
                за корректность отправляемых обращений, фотофиксации и иной
                информации, загружаемой в систему.
              </p>
            </section>

            <section>
              <h3 className="text-base font-extrabold uppercase text-black">
                2. Пользовательское соглашение
              </h3>
              <p className="mt-2">
                Сервис предоставляет пользователю возможность регистрироваться в
                системе, формировать обращения, сохранять историю заявок,
                получать уведомления и использовать доступный функционал
                платформы в рамках её назначения. Использование сервиса означает
                согласие пользователя с установленными правилами, порядком
                обработки данных и обязанностью не предпринимать действий,
                нарушающих стабильность работы системы, права других
                пользователей или действующее законодательство.
              </p>
            </section>

            <section>
              <h3 className="text-base font-extrabold uppercase text-black">
                3. Политика обработки данных
              </h3>
              <p className="mt-2">
                При регистрации и дальнейшем использовании сервиса могут
                обрабатываться персональные данные пользователя, включая логин,
                адрес электронной почты, номер телефона, а также сведения,
                добровольно указанные в профиле и обращениях. Эти данные
                используются для авторизации, связи с пользователем,
                подтверждения email, отправки уведомлений, обработки обращений и
                обеспечения корректной работы платформы.
              </p>
            </section>

            <section>
              <h3 className="text-base font-extrabold uppercase text-black">
                4. Подтверждение согласия
              </h3>
              <p className="mt-2">
                Нажимая кнопку принятия условий, пользователь подтверждает, что
                ознакомился с правилами проекта, пользовательским соглашением и
                политикой обработки данных, понимает их содержание и принимает
                их в полном объёме.
              </p>
            </section>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-black/10 bg-[#f5f2ee] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="text-sm text-black/50">
            {scrolledToEnd
              ? "Текст прочитан до конца. Можно принять условия."
              : "Прокрутите текст до конца, чтобы активировать кнопку."}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="ghost" size="lg" onClick={onClose}>
              Закрыть
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={onAccept}
              disabled={!scrolledToEnd}
              className="min-w-[170px]"
            >
              Принять
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeRules: false,
    subscribe: true,
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [agreementOpen, setAgreementOpen] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (!form.agreeRules) {
      setError(
        "Необходимо ознакомиться с правилами проекта, пользовательским соглашением и политикой обработки данных"
      );
      return;
    }

    setBusy(true);

    try {
      await register(form);
      localStorage.setItem("pendingEmail", form.email.trim().toLowerCase());
      localStorage.setItem("lastEmail", form.email.trim().toLowerCase());
      navigate("/verify-email");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Не удалось зарегистрироваться");
    } finally {
      setBusy(false);
    }
  }

  function openAgreement(event) {
    event.preventDefault();
    setAgreementOpen(true);
  }

  function acceptAgreement() {
    setForm((current) => ({ ...current, agreeRules: true }));
    setAgreementOpen(false);
  }

  return (
    <>
      <div className="app-container pt-14 sm:pt-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="pt-4">
            <div className="section-kicker">новый аккаунт</div>
            <h1 className="mt-4 text-5xl font-black uppercase leading-[0.95] sm:text-6xl">
              Регистрация
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-[color:var(--muted-fg)] sm:text-base">
              Создайте учётную запись, чтобы сохранять обращения, получать уведомления и
              подтверждать подачу фотофиксации.
            </p>
          </div>

          <Card
            title="Создание профиля"
            description="После регистрации нужно подтвердить email кодом из письма."
            className="max-w-3xl justify-self-end"
          >
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
              <Field
                label="Логин"
                value={form.login}
                onChange={(event) =>
                  setForm((current) => ({ ...current, login: event.target.value }))
                }
                placeholder="ykhokage"
              />

              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="mail@example.com"
              />

              <Field
                label="Пароль"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="Минимум 8 символов"
              />

              <Field
                label="Подтверждение пароля"
                type="password"
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
                placeholder="Повторите пароль"
              />

              <div className="md:col-span-2 rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/75">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.agreeRules}
                    readOnly
                    tabIndex={-1}
                    className="mt-1 pointer-events-none opacity-90"
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={openAgreement}
                    className="text-left leading-6 text-black/75 underline decoration-black/30 underline-offset-4 transition hover:text-black"
                  >
                    Я согласен с правилами проекта, пользовательским соглашением и
                    политикой обработки данных.
                  </button>
                </div>
              </div>

              <label className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/75">
                <input
                  type="checkbox"
                  checked={form.subscribe}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, subscribe: event.target.checked }))
                  }
                  className="mt-1"
                />
                <span>
                  Получать новости проекта и полезные напоминания о статусах заявок.
                </span>
              </label>

              {error && (
                <div className="md:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                <Button type="submit" size="lg" disabled={busy} className="min-w-[220px]">
                  {busy ? "Создаём..." : "Зарегистрироваться"}
                </Button>

                <Link to="/login">
                  <Button type="button" size="lg">
                    Уже есть аккаунт
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <AgreementModal
        open={agreementOpen}
        onClose={() => setAgreementOpen(false)}
        onAccept={acceptAgreement}
      />
    </>
  );
}