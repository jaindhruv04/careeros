import { useState, useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";

function ProjectTracker() {
  const { projects, setProjects } = useContext(ProjectContext);

  const [name, setName] = useState("");
  const [techStack, setTechStack] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Planning");
  const [notes, setNotes] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  function handleSubmit(e) {
    e.preventDefault();

    const project = {
      id: Date.now(),
      name,
      techStack,
      progress,
      status,
      notes,
    };

    setProjects([...projects, project]);

    setName("");
    setTechStack("");
    setProgress(0);
    setStatus("Planning");
    setNotes("");
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>

        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />

        <button type="submit">Add Project</button>
      </form>

      <hr />

      <h2>Search & Filter</h2>

      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search by project name"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Planning">Planning</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="On Hold">On Hold</option>
      </select>

      <ul>
        {filteredProjects.map((project) => (
          <li key={project.id}>
            <strong>{project.name}</strong> - {project.techStack} -{" "}
            {project.progress}% - {project.status}

            {project.notes?.trim() !== "" && (
              <div>
                <strong>Notes:</strong> {project.notes}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectTracker;