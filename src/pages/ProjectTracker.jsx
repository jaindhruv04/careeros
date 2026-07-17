import { useState, useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";

function ProjectTracker() {
  const { projects, setProjects } = useContext(ProjectContext);

  const [name, setName] = useState("");
  const [techStack, setTechStack] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const project = {
      id: Date.now(),
      name,
      techStack,
      progress,
      status,
    };

    setProjects([...projects, project]);

    setName("");
    setTechStack("");
    setProgress(0);
    setStatus("");
  }

  return (
    <div>
      <h1>Project Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
        />

        <input
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          placeholder="Tech Stack"
        />

        <input
          type="number"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          placeholder="Progress"
        />

        <input
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Status"
        />

        <button type="submit">Add Project</button>
      </form>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name} - {project.techStack} - {project.progress}% -{" "}
            {project.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectTracker;