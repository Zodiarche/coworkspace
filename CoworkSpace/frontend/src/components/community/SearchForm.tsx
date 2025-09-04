import { ChangeEvent, useMemo } from "react";

export type MembershipType = "Basic" | "Premium" | "Enterprise";
export type Filters = {
  name: string;
  profession: string;
  membershipType?: MembershipType | "";
};

export default function SearchForm({
  value,
  onChange,
  page,
  size,
  total,
  onChangePage,
  onChangeSize,
}: {
  value: Filters;
  onChange: (next: Filters) => void;
  page: number;
  size: number;
  total: number;
  onChangePage: (next: number) => void;
  onChangeSize: (next: number) => void;
}) {
  const handleInput =
    (key: keyof Filters) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const v = e.target.value;
      onChange({
        ...value,
        [key]:
          key === "membershipType"
            ? v === ""
              ? ""
              : (v as MembershipType)
            : v,
      });
    };

  const totalPages = useMemo(() => {
    const pages = Math.max(1, Math.ceil((total || 0) / Math.max(1, size)));
    return pages;
  }, [total, size]);

  const sizeOptions = [2, 5, 10, 12, 20, 50];

  return (
    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="Nom (ex: sarah)"
        value={value.name}
        onChange={handleInput("name")}
      />
      <input
        type="text"
        placeholder="Profession (ex: developer)"
        value={value.profession}
        onChange={handleInput("profession")}
      />
      <select
        value={value.membershipType ?? ""}
        onChange={handleInput("membershipType")}
      >
        <option value="">Type d’abonnement (tous)</option>
        <option value="Basic">Basic</option>
        <option value="Premium">Premium</option>
        <option value="Enterprise">Enterprise</option>
      </select>

      <select
        aria-label="Page"
        value={page}
        onChange={(e) => onChangePage(Number(e.target.value))}
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <option key={p} value={p}>
            Page {p} / {totalPages}
          </option>
        ))}
      </select>

      <select
        aria-label="Résultats par page"
        value={size}
        onChange={(e) => onChangeSize(Number(e.target.value))}
      >
        {sizeOptions.map((s) => (
          <option key={s} value={s}>
            {s} / page
          </option>
        ))}
      </select>
    </form>
  );
}
