import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/auth/useAuth";

export default function RequireAdmin() {
  const { user, loading } = useAuth();
  if (loading) return <div>Chargement…</div>;
  return user?.isManager ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
