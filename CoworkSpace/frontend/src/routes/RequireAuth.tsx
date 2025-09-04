import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/auth/useAuth";

export default function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return <div>Chargement…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
