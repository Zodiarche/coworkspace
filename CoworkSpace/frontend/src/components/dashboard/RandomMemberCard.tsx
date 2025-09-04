import { Member } from "../../types/member";

const RandomMemberCard = ({ member }: { member: Member | null }) => {
  if (!member) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="random-member-card">
      <img src={member.photo} alt={member.firstname} />
      <h2>
        {member.firstname} {member.lastname}
      </h2>
      <p>{member.profession}</p>
      <p>
        {member.skills.map((skill, index) => (
          <span key={index} className="skill">
            {skill}
          </span>
        ))}
      </p>
      <p>{member.bio}</p>
    </div>
  );
};

export default RandomMemberCard;
