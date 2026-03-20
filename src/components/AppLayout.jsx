import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  const location = useLocation();
  const isStandalone = ["/", "/login", "/register", "/verify-email", "/reset-password", "/team"].includes(location.pathname);

  return (
    <div className="page-grid page-surface min-h-screen text-[color:var(--theme-fg)]">
      <Navbar />
      <main className={isStandalone ? "pb-16" : "app-container pb-16 pt-10 sm:pt-14"}>
        <Outlet />
      </main>
    </div>
  );
}
