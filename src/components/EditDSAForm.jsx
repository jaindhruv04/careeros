import { useState } from "react";
import { Check, X } from "lucide-react";

function EditDSAForm({ problem, onSave, onCancel }) {
  const [editedProblem, setEditedProblem] = useState(problem);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setEditedProblem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(editedProblem);
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
          Edit DSA Problem
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Problem Name</label>
          <input
            className={inputStyle}
            name="name"
            value={editedProblem.name}
            onChange={handleChange}
            placeholder="e.g. Trapping Rain Water"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Topic</label>
          <input
            className={inputStyle}
            name="topic"
            value={editedProblem.topic}
            onChange={handleChange}
            placeholder="e.g. Dynamic Programming, Two Pointers"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Difficulty</label>
          <select
            className={inputStyle}
            name="difficulty"
            value={editedProblem.difficulty}
            onChange={handleChange}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Status</label>
          <select
            className={inputStyle}
            name="status"
            value={editedProblem.status}
            onChange={handleChange}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Solved">Solved</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Priority</label>
          <select
            className={inputStyle}
            name="priority"
            value={editedProblem.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Notes / Approach</label>
          <input
            className={inputStyle}
            name="notes"
            value={editedProblem.notes || ""}
            onChange={handleChange}
            placeholder="Key intuition, time complexity..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <label className="flex items-center gap-2 text-xs font-mono text-text-primary cursor-pointer select-none">
          <input
            type="checkbox"
            name="revisionNeeded"
            checked={editedProblem.revisionNeeded}
            onChange={handleChange}
            className="w-4 h-4 rounded border-border bg-surface accent-accent"
          />
          Flag as Needs Revision
        </label>
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

export default EditDSAForm;
