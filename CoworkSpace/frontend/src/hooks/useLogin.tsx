import { useState } from "react";
import { useAuth } from "../contexts/auth/index";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("sarah.martin@example.com");
  const [password, setPassword] = useState("sarah.martin");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("login");
    const ok = await login(email, password);
    console.log("ok : ", ok);
    if (ok) navigate("/community");
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
}
