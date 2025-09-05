import React from "react";
import { useNavigate } from "react-router-dom";
import MemberCount from "../components/community/MemberCount";
import MembersList from "../components/community/MembersList";
import SearchForm from "../components/community/SearchForm";
import { useCommunity } from "../hooks/useCommunity";

const Community = () => {
  const navigate = useNavigate();
  const {
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
  } = useCommunity();

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

      <p>
        <button onClick={() => navigate("/members/add")}>
          Ajouter un membre
        </button>
      </p>

      {loading && <p>Chargement…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <MemberCount members={members} />
      <MembersList members={members} onDeleted={handleDeleted} />
    </section>
  );
};

export default Community;
