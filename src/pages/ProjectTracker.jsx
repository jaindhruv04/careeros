import { useState, useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";
import { getDateAdded } from "../utils/dateUtils";
import ModuleHeader from "../components/ModuleHeader";
import PriorityBadge from "../components/PriorityBadge";

const inputClass = "bg-bg border border-border rounded px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";
const selectClass = inputClass;
const buttonClass = "px-4 py-2 text-sm font-mono border border-border rounded text-text-primary hover:border-accent hover:text-accent transition-colors";

function ProjectTracker() {
  const { projects, setProjects } = useContext(ProjectContext);

  const [name, setName] = useState("");
  const [techStack, setTechStack] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Planning");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  function handleSubmit(e) {
    e.preventDefault();

    const project = {
      id: Date.now(),
      name,
      techStack,
      progress,
      status,
      priority,
      dateAdded: getDateAdded(),
      notes,
    };

    setProjects([...projects, project]);

    setName("");
    setTechStack("");
    setProgress(0);
    setStatus("Planning");
    setPriority("Medium");
    setNotes("");
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="max-w-4xl">
      <ModuleHeader label="Project Tracker" />

      <div className="bg-surface border border-border rounded-lg p-4 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-center">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
          <input className={inputClass} value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="Tech stack" />
          <input type="number" min="0" max="100" className={inputClass + " w-24"} value={progress} onChange={(e) => setProgress(Number(e.target.value))} placeholder="Progress" />
          <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Planning">Planning</option>
            <option value="In Progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On hold</option>
          </select>
          <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" />
          <button type="submit" className={buttonClass}>Add project</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input className={inputClass} value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search by project name" />
        <select className={selectClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All statuses</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On hold</option>
        </select>
        <select className={selectClass} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <ul className="flex flex-col gap-3">
        {filteredProjects.map((project) => (
          <li key={project.id} className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-text-primary font-medium">{project.name} <span className="text-text-muted font-normal">— {project.techStack}</span></p>
              <PriorityBadge priority={project.priority} />
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden mb-2 w-48">
              <div className="h-full bg-accent rounded-full" style={{ width: `${project.progress}%` }} />
            </div>
            <p className="text-sm text-text-muted mb-1">{project.progress}% · {project.status}</p>
            <p className="text-sm text-text-muted mb-1">Added: {project.dateAdded}</p>
            {project.notes?.trim() !== "" && (
              <p className="text-sm text-text-muted">Notes: {project.notes}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectTracker;