import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cc_theme";
const ThemeContext = createContext(null);

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.remove("theme-dark", "theme-light");
    document.documentElement.classList.add(`theme-${theme}`);
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isLight: theme === "light",
      setTheme,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
