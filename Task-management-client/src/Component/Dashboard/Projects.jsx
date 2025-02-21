import { useEffect, useState } from "react";
import { FolderKanban, Loader2 } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=6")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#1e293b] p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <FolderKanban size={28} className="text-blue-500" />
                <h2 className="text-xl font-semibold">{project.name}</h2>
              </div>
              <p className="text-gray-400">{project.description}</p>
              <a
                href={project.link}
                className="mt-4 inline-block text-blue-400 hover:text-blue-300"
              >
                View Project →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
