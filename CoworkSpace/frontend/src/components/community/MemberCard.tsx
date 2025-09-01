interface Member {
  id: string;
  firstname: string;
  lastname: string;
  profession: string;
  city: string;
  country: string;
  photo: string;
}

export default function MemberCard({ member }: { member: Member }) {
  return (
    <div className="member-card">
      <img
        className="member-photo"
        src={member.photo}
        alt={`${member.firstname} ${member.lastname}`}
      />
      <div className="member-info">
        <h3>
          {member.firstname} {member.lastname}
        </h3>
        <p>{member.profession}</p>
        <p className="location">
          {member.city}, {member.country}
        </p>
      </div>
    </div>
  );
}
