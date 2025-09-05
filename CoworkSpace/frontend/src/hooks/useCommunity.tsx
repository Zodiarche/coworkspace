import { useEffect, useMemo, useRef, useState } from "react";
import type { Member } from "@/types/member";
import type { Filters } from "../components/community/SearchForm";

const API = import.meta.env.VITE_API_URL ?? "";

type StatusError = string | null;

export const useCommunity = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StatusError>(null);

  const [filters, setFilters] = useState<Filters>({
    name: "",
    profession: "",
    membershipType: "",
  });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [total, setTotal] = useState(0);

  const url = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("size", String(size));
    if (filters.name.trim()) qs.set("name", filters.name.trim());
    if (filters.profession.trim())
      qs.set("profession", filters.profession.trim());
    if (filters.membershipType)
      qs.set("membershipType", String(filters.membershipType));
    const base = API ? `${API}/members` : `/members`;
    return `${base}?${qs.toString()}`;
  }, [filters, page, size]);

  const abortRef = useRef<AbortController | null>(null);

  // fetch immédiat (sans debounce)
  const refresh = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        credentials: "include",
        signal: controller.signal,
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = await res.json();
          msg = j.error || msg;
        } catch {}
        throw new Error(msg);
      }
      const data = await res.json(); // { items, total, page, size } | Member[]
      setMembers(Array.isArray(data) ? data : data.items ?? []);
      if (typeof data.total === "number") setTotal(data.total);
      if (typeof data.page === "number") setPage(data.page);
      if (typeof data.size === "number") setSize(data.size);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setError(e.message || "Erreur de chargement");
        setMembers([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounce 1s -> appelle refresh()
  useEffect(() => {
    const t = setTimeout(() => {
      void refresh();
    }, 1000);
    return () => clearTimeout(t);
  }, [url]); // change quand filtres/page/size changent

  // Changer la taille -> reset page
  const handleChangeSize = (next: number) => {
    setSize(next);
    setPage(1);
  };

  // Après suppression -> re-fetch immédiat + éventuel recul de page
  const handleDeleted = async () => {
    await refresh();
    const totalPages = Math.max(1, Math.ceil(total / size));
    if (members.length === 0 && page > 1 && page > totalPages) {
      setPage((p) => p - 1);
      await refresh();
    }
  };

  return {
    members,
    loading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    size,
    total,
    handleChangeSize,
    handleDeleted,
    refresh,
  };
};
