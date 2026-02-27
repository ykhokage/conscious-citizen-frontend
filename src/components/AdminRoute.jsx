import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminRoute({ children }) {
  const { isAuthed, role } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/categories" replace />;
  return children;
}
