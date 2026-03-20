import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/client";
import {
  clearAuth,
  clearPendingAuth,
  getPendingAuth,
  getToken,
  getUser,
  setAuth,
  setPendingAuth,
} from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUserState] = useState(getUser());
  const isAuthed = Boolean(token);

  async function login(loginValue, password) {
    const { data } = await api.post("/api/auth/login", {
      login: loginValue,
      password,
    });

    if (data?.token && data?.user) {
      setAuth(data.token, data.user);
      clearPendingAuth();
      setToken(data.token);
      setUserState(data.user);
      return data;
    }

    if (data?.token && !data?.user) {
      const authToken = data.token;
      const { data: profile } = await api.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setAuth(authToken, profile);
      clearPendingAuth();
      setToken(authToken);
      setUserState(profile);
      return { token: authToken, user: profile };
    }

    throw new Error("Неверный ответ сервера при входе");
  }

  async function register(payload) {
    const { data } = await api.post("/api/auth/register", {
      login: payload.login,
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
    });

    clearAuth();
    setToken(null);
    setUserState(null);

    if (data?.token && data?.user) {
      setPendingAuth(data.token, data.user);
    }

    return data;
  }

  function restorePendingAuth(loginValue) {
    const pending = getPendingAuth();
    const lookup = String(loginValue || "").trim().toLowerCase();

    if (!pending?.token || !pending?.user) {
      return false;
    }

    const pendingEmail = String(pending.user.email || "").trim().toLowerCase();
    const pendingLogin = String(pending.user.login || "").trim().toLowerCase();

    if (lookup !== pendingEmail && lookup !== pendingLogin) {
      return false;
    }

    return false;
  }

  function setUserSafe(nextUserOrUpdater) {
    setUserState((currentUser) => {
      const resolvedUser =
        typeof nextUserOrUpdater === "function"
          ? nextUserOrUpdater(currentUser)
          : nextUserOrUpdater;

      const authToken = getToken();

      if (authToken) {
        setAuth(authToken, resolvedUser);
      } else {
        localStorage.setItem("cc_user", JSON.stringify(resolvedUser));
      }

      return resolvedUser;
    });
  }

  function logout() {
    clearAuth();
    setToken(null);
    setUserState(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role || "user",
      isAuthed,
      login,
      register,
      logout,
      restorePendingAuth,
      setUser: setUserSafe,
    }),
    [token, user, isAuthed]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}