import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/auth/useAuth";

export default function RequireAuth() {
  const { user, loading } = useAuth();
  console.log("RequireAuth user:", user, " loading:", loading);
  if (loading) return <div>Chargement…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
