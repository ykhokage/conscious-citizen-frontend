import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/client";
import { clearAuth, getToken, getUser, setAuth } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser()); // {id, login, email, role, emailVerified?}

  const isAuthed = !!token;

  async function login(login, password) {
    const { data } = await api.post("/api/auth/login", { login, password });

    // ✅ нормальный ответ
    if (data?.token && data?.user) {
      setAuth(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return data;
    }

    // fallback: если бек когда-то отдавал только token
    if (data?.token && !data?.user) {
      const t = data.token;
      const { data: profile } = await api.get("/api/profile", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setAuth(t, profile);
      setToken(t);
      setUser(profile);
      return { token: t, user: profile };
    }

    throw new Error("Неверный ответ сервера при входе");
  }

  // ✅ РЕГИСТРАЦИЯ: НЕ логиним, а сохраняем token+user и возвращаем ответ
  async function register(payload) {
    const { login: l, email, password } = payload;

    const { data } = await api.post("/api/auth/register", {
      login: l,
      email,
      password,
      confirmPassword: payload.confirmPassword, // если твоя схема требует confirmPassword
    });

    // бек возвращает: { user, token, ... }
    if (data?.token && data?.user) {
      setAuth(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
    }

    return data;
  }

  // ✅ чтобы VerifyEmail мог обновить пользователя в контексте
  function setUserSafe(nextUser) {
    const t = getToken();
    if (t) {
      setAuth(t, nextUser);
    } else {
      // если вдруг токена нет — просто сохраним user как есть
      localStorage.setItem("user", JSON.stringify(nextUser));
    }
    setUser(nextUser);
  }

  function logout() {
    clearAuth();
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed,
      role: user?.role || "user",
      login,
      register,
      logout,
      setUser: setUserSafe, // ✅ экспортируем для VerifyEmail
    }),
    [token, user, isAuthed]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}