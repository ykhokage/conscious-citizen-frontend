import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/client";
import { clearAuth, getToken, getUser, setAuth } from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser()); // {id, login, email, role}

  const isAuthed = !!token;

  async function login(login, password) {
    const { data } = await api.post("/api/auth/login", { login, password });
    if (data?.token && data?.user) {
      setAuth(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return;
    }
    if (data?.token && !data?.user) {
      const t = data.token;
      const { data: profile } = await api.get("/api/profile", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setAuth(t, profile);
      setToken(t);
      setUser(profile);
      return;
    }
    throw new Error("Неверный ответ сервера при входе");
  }

  async function register(payload) {
    const { login: l, email, password } = payload;
    await api.post("/api/auth/register", { login: l, email, password });
    await login(l, password);
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
