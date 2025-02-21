import { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        // Add avatar images using Random User API
        const updatedTeam = data.map((member, index) => ({
          ...member,
          avatar: `https://randomuser.me/api/portraits/men/${index + 1}.jpg`, // Assigning a random avatar
          role: "Software Engineer", // You can modify roles manually or dynamically
          profile: `https://example.com/team/${member.id}`, // Example profile link
        }));
        setTeam(updatedTeam);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching team:", error));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Team Members</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-[#1e293b] p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h2 className="text-xl font-semibold">{member.name}</h2>
                  <p className="text-gray-400 text-sm">{member.role}</p>
                </div>
              </div>
              <a
                // href={member.profile}
                href="https://linkedin.com/in/swapnilahmedshishir"
                target="_blank"
                className="mt-4 inline-block text-blue-400 hover:text-blue-300"
              >
                View Profile →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
