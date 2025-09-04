import { useEffect, useMemo, useRef, useState } from "react";
import MemberCount from "../components/community/MemberCount";
import MembersList from "../components/community/MembersList";
import SearchForm, { Filters } from "../components/community/SearchForm";
import type { Member } from "@/types/member";

const API = import.meta.env.VITE_API_URL ?? "";

export const Community = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // -------- refresh(): fait le fetch immédiat (sans debounce)
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
      const data = await res.json(); // { items, total, page, size }
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

  // -------- Debounce 1s: au lieu de dupliquer le fetch, on appelle refresh()
  useEffect(() => {
    const t = setTimeout(() => {
      void refresh();
    }, 1000);
    return () => clearTimeout(t);
  }, [url]); // change quand filtres/page/size changent

  // Changer la taille → reset page
  const handleChangeSize = (next: number) => {
    setSize(next);
    setPage(1);
  };

  // Après suppression → re-fetch immédiat
  const handleDeleted = async () => {
    await refresh();
    // Optionnel: si la page revient vide (ex: tu as supprimé le dernier item de la dernière page),
    // redescends d'une page puis re-fetch:
    const totalPages = Math.max(1, Math.ceil(total / size));
    if (members.length === 0 && page > 1 && page > totalPages) {
      setPage((p) => p - 1);
      await refresh();
    }
  };

  return (
    <section className="layout">
      <h1>Découvrir la Communauté</h1>
      <SearchForm
        value={filters}
        onChange={setFilters}
        page={page}
        size={size}
        total={total}
        onChangePage={setPage}
        onChangeSize={handleChangeSize}
      />
      {loading && <p>Chargement…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <MemberCount members={members} />
      <MembersList members={members} onDeleted={handleDeleted} />
    </section>
  );
};
