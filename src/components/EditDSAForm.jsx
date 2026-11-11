import { useState } from "react";
import { Check, X } from "lucide-react";

function EditDSAForm({ problem, onSave, onCancel }) {
  const [editedProblem, setEditedProblem] = useState(problem);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setEditedProblem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    setSaveError("");
    try {
      await onSave(editedProblem);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not save changes. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
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
          <label htmlFor="dsa-edit-name" className="block text-[11px] font-mono text-text-muted mb-1">Problem Name</label>
          <input
            id="dsa-edit-name"
            className={inputStyle}
            name="name"
            value={editedProblem.name}
            onChange={handleChange}
            placeholder="e.g. Trapping Rain Water"
            required
          />
        </div>

        <div>
          <label htmlFor="dsa-edit-topic" className="block text-[11px] font-mono text-text-muted mb-1">Topic</label>
          <input
            id="dsa-edit-topic"
            className={inputStyle}
            name="topic"
            value={editedProblem.topic}
            onChange={handleChange}
            placeholder="e.g. Dynamic Programming, Two Pointers"
            required
          />
        </div>

        <div>
          <label htmlFor="dsa-edit-difficulty" className="block text-[11px] font-mono text-text-muted mb-1">Difficulty</label>
          <select
            id="dsa-edit-difficulty"
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
          <label htmlFor="dsa-edit-status" className="block text-[11px] font-mono text-text-muted mb-1">Status</label>
          <select
            id="dsa-edit-status"
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
          <label htmlFor="dsa-edit-priority" className="block text-[11px] font-mono text-text-muted mb-1">Priority</label>
          <select
            id="dsa-edit-priority"
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
          <label htmlFor="dsa-edit-notes" className="block text-[11px] font-mono text-text-muted mb-1">Notes / Approach</label>
          <input
            id="dsa-edit-notes"
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
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono font-medium rounded-lg bg-accent text-bg hover:opacity-90 transition-opacity"
        >
          <Check className="w-3.5 h-3.5" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {saveError && (
        <p role="alert" className="text-sm text-rose-400">
          {saveError}
        </p>
      )}
    </form>
  );
}

export default EditDSAForm;
