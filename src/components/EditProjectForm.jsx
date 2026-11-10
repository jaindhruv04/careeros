import { useState } from "react";
import { Check, X } from "lucide-react";

function EditProjectForm({ project, onSave, onCancel }) {
  const [editedProject, setEditedProject] = useState(project);

  function handleChange(e) {
    const { name, value } = e.target;
    setEditedProject((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(editedProject);
  }

  const inputStyle =
    "w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-xl bg-surface-subtle border border-accent/30 space-y-4"
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <p className="text-xs font-mono font-semibold text-accent uppercase tracking-wider">
          Edit Project
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Project Name</label>
          <input
            className={inputStyle}
            name="name"
            value={editedProject.name}
            onChange={handleChange}
            placeholder="e.g. Distributed Cache"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Tech Stack</label>
          <input
            className={inputStyle}
            name="techStack"
            value={editedProject.techStack}
            onChange={handleChange}
            placeholder="e.g. Go, Redis, Docker"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Progress ({editedProject.progress}%)</label>
          <input
            type="number"
            min="0"
            max="100"
            className={inputStyle}
            name="progress"
            value={editedProject.progress}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Status</label>
          <select
            className={inputStyle}
            name="status"
            value={editedProject.status}
            onChange={handleChange}
          >
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Priority</label>
          <select
            className={inputStyle}
            name="priority"
            value={editedProject.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Notes / Links</label>
          <input
            className={inputStyle}
            name="notes"
            value={editedProject.notes || ""}
            onChange={handleChange}
            placeholder="GitHub repo URL, deployment link..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-medium rounded-lg bg-accent text-bg hover:opacity-90 transition-opacity"
        >
          <Check className="w-3.5 h-3.5" />
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default EditProjectForm;
