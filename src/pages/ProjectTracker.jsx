import { useState, useContext } from "react";
import {
  Plus,
  Search,
  FolderGit2,
  Pencil,
  Trash2,
  Archive,
  RotateCcw,
  SlidersHorizontal,
  FileText,
  Layers,
} from "lucide-react";
import { ProjectContext } from "../context/ProjectContext";
import ModuleHeader from "../components/ModuleHeader";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import EditProjectForm from "../components/EditProjectForm";
import LaserSkeleton from "../components/LaserSkeleton";

const inputClass =
  "w-full bg-surface-subtle border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";
const selectClass = inputClass;

function ProjectTracker() {
  const { projects, loading, addProject, updateProject, deleteProject } =
    useContext(ProjectContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [techStack, setTechStack] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Planning");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    addProject({
      name,
      techStack,
      progress: Number(progress),
      status,
      priority,
      notes,
      archived: false,
    });

    setName("");
    setTechStack("");
    setProgress(0);
    setStatus("Planning");
    setPriority("Medium");
    setNotes("");
    setShowAddForm(false);
  }

  function handleDelete(id) {
    deleteProject(id);
  }

  function handleArchive(id) {
    updateProject(id, { archived: true });
  }

  function handleRestore(id) {
    updateProject(id, { archived: false });
  }

  function handleChangeStatus(id, newStatus) {
    updateProject(id, { status: newStatus });
  }

  function handleSaveEdit(project) {
    updateProject(project.id, {
      name: project.name,
      techStack: project.techStack,
      progress: Number(project.progress),
      status: project.status,
      priority: project.priority,
      notes: project.notes,
    });
    setEditingId(null);
  }

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <ModuleHeader
          label="Project Tracker"
          description="Connecting to database and synchronizing portfolio projects..."
        />
        <LaserSkeleton
          type="tracker"
          message="SCANNING_PORTFOLIO_PROJECTS..."
        />
      </div>
    );
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (project.techStack &&
        project.techStack.toLowerCase().includes(searchText.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || project.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <ModuleHeader
        label="Project Tracker"
        description="Showcase full-stack engineering depth, track milestone completion, and document tech stacks."
        action={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg text-xs font-mono font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-accent/10"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? "Close Form" : "Add Project"}
          </button>
        }
      />

      {/* Add Project Form */}
      {showAddForm && (
        <div className="rounded-xl bg-surface border border-accent/30 p-5 shadow-xl shadow-accent/5 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <FolderGit2 className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">
              Create New Project
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Project Title *
                </label>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Real-Time Chat Engine"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  className={inputClass}
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. React, Node.js, WebSockets, Postgres"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Progress Percentage ({progress}%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className={inputClass}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Status
                </label>
                <select
                  className={selectClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Priority
                </label>
                <select
                  className={selectClass}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Repository / Demo Notes
                </label>
                <input
                  className={inputClass}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="GitHub URL, architecture highlights..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-mono rounded-lg border border-border text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-bg hover:opacity-90"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-surface border border-border flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="w-full bg-surface-subtle border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search projects by name or technology..."
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-text-muted hidden sm:block" />
          <select
            className="bg-surface-subtle border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent font-mono"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>

          <select
            className="bg-surface-subtle border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent font-mono"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl bg-surface border border-dashed border-border p-6">
            <FolderGit2 className="w-10 h-10 text-text-muted mb-3 opacity-60" />
            <p className="text-sm font-medium text-text-primary">
              No portfolio projects found
            </p>
            <p className="text-xs text-text-muted mt-1 max-w-sm">
              {searchText || statusFilter !== "All" || priorityFilter !== "All"
                ? "No projects match your current filters."
                : "Add your showcase engineering projects to prepare for resume rounds."}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`rounded-xl border p-4 sm:p-5 transition-all duration-150 ${
                project.archived
                  ? "bg-surface/50 border-border/50 opacity-60"
                  : "bg-surface border-border hover:border-accent/40 shadow-sm"
              }`}
            >
              {editingId === project.id ? (
                <EditProjectForm
                  project={project}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-text-primary text-base">
                          {project.name}
                        </h3>
                        {project.archived && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Archived
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={project.status} />
                      <PriorityBadge priority={project.priority} />
                    </div>
                  </div>

                  {/* Tech Stack Chips */}
                  {project.techStack && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-text-muted mr-1" />
                      {project.techStack.split(",").map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-text-secondary border border-border/70"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-text-muted">Progress</span>
                      <span className="font-bold text-accent">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(Math.max(project.progress, 0), 100)}%` }}
                      />
                    </div>
                  </div>

                  {project.notes?.trim() && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-subtle border border-border/50 text-xs text-text-secondary">
                      <FileText className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <p className="break-words leading-relaxed">{project.notes}</p>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-text-muted">
                        Status:
                      </span>
                      <select
                        className="bg-surface-subtle border border-border rounded-md px-2 py-1 text-xs text-text-primary font-mono focus:outline-none focus:border-accent"
                        value={project.status}
                        onChange={(e) => handleChangeStatus(project.id, e.target.value)}
                      >
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingId(project.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                        title="Edit Project"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {!project.archived ? (
                        <button
                          onClick={() => handleArchive(project.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Archive</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(project.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(project.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectTracker;
