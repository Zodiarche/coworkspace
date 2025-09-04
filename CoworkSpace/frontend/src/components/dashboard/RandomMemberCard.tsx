import { useEffect, useState } from "react";
import { Member } from "../../types/member";

const RandomMemberCard = () => {
  const [randomMember, setRandomMember] = useState<Member | null>(null);

  const fetchRandomMember = async () => {
    // const response = await fetch("/api/members/random");
    // const data = await response.json();
    const data: Member = {
      id: "1",
      gender: "male",
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      birthdate: "1990-01-01",
      city: "New York",
      country: "USA",
      photo: "/images/john_doe.jpg",
      profession: "Software Engineer",
      company: "Tech Corp",
      skills: ["JavaScript", "React", "Node.js"],
      membershipType: "Premium",
      joinDate: "2020-01-01",
      bio: "Passionate about web development.",
      linkedinUrl: "https://www.linkedin.com/in/johndoe",
      isManager: false,
    };
    setRandomMember(data);
  };
  useEffect(() => {
    fetchRandomMember();
  }, []);

  if (!randomMember) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="random-member-card">
      <img src={randomMember.photo} alt={randomMember.firstname} />
      <h2>
        {randomMember.firstname} {randomMember.lastname}
      </h2>
      <p>{randomMember.profession}</p>
      <p>
        {randomMember.skills.map((skill, index) => (
          <span key={index} className="skill">
            {skill}
          </span>
        ))}
      </p>
      <p>{randomMember.bio}</p>
      <p>
        <button onClick={fetchRandomMember}>Découvrir un autre membre</button>
      </p>
    </div>
  );
};

export default RandomMemberCard;
