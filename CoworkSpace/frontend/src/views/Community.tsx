import { useEffect, useMemo, useRef, useState } from "react";
import MemberCount from "../components/community/MemberCount";
import MembersList from "../components/community/MembersList";
import type { Member } from "@/types/member";
import SearchForm, { Filters } from "../components/community/SearchForm";

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
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    if (filters.name.trim()) params.set("name", filters.name.trim());
    if (filters.profession.trim())
      params.set("profession", filters.profession.trim());
    if (filters.membershipType)
      params.set("membershipType", String(filters.membershipType));
    const base = API ? `${API}/members` : `/members`;
    return `${base}?${params.toString()}`;
  }, [filters, page, size]);

  // annuler les requêtes obsolètes
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      (async () => {
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
          const data = await res.json();
          setMembers(Array.isArray(data) ? data : data.items ?? []);
          if (data && typeof data.total === "number") setTotal(data.total);
          if (data && typeof data.page === "number") setPage(data.page); // garde la vérité serveur
          if (data && typeof data.size === "number") setSize(data.size);
        } catch (e: any) {
          if (e.name === "AbortError") return;
          setError(e.message || "Erreur de chargement");
          setMembers([]);
          setTotal(0);
        } finally {
          setLoading(false);
        }
      })();
    }, 300);
    return () => clearTimeout(t);
  }, [url]);

  const handleChangeSize = (next: number) => {
    setSize(next);
    setPage(1);
  };

  return (
    <section className="layout">
      <h1>Découvrir la Communauté</h1>
      <p>
        Rencontrez des professionnels passionnés, échangez vos compétences et
        développez votre réseau.
      </p>

      <SearchForm
        value={filters}
        onChange={setFilters}
        page={page}
        size={size}
        total={total}
        onChangePage={setPage}
        onChangeSize={handleChangeSize}
      />

      <MemberCount members={members} />
      <MembersList members={members} />
    </section>
  );
};
