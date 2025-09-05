import { useDashboard } from "../hooks/useDashboard";
import RandomMemberCard from "../components/dashboard/RandomMemberCard";

const Dashboard = () => {
  const { randomMember, fetchRandomMember, status, message } = useDashboard();

  return (
    <section className="layout">
      <h2>Bienvenue sur le tableau de bord !</h2>

      {status === "error" && <p style={{ color: "red" }}>{message}</p>}

      <RandomMemberCard member={randomMember} />

      <button onClick={fetchRandomMember}>Charger un membre aléatoire</button>
    </section>
  );
};
export default Dashboard;
