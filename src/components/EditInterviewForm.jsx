import { useState } from "react";
import { Check, X } from "lucide-react";

function EditInterviewForm({ entry, onSave, onCancel }) {
  const [editedEntry, setEditedEntry] = useState(entry);

  function handleChange(e) {
    const { name, value } = e.target;
    setEditedEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(editedEntry);
  }

  const inputStyle =
    "w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";
  const textareaStyle =
    "w-full bg-surface border border-border rounded-lg p-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent min-h-[70px] resize-y";

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-xl bg-surface-subtle border border-accent/30 space-y-4"
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-2">
        <p className="text-xs font-mono font-semibold text-accent uppercase tracking-wider">
          Edit Interview Journal Entry
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Company</label>
          <input
            className={inputStyle}
            name="company"
            value={editedEntry.company}
            onChange={handleChange}
            placeholder="Company name"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Interview Round</label>
          <select
            className={inputStyle}
            name="round"
            value={editedEntry.round}
            onChange={handleChange}
          >
            <option value="Online Assessment">Online Assessment</option>
            <option value="Technical">Technical</option>
            <option value="Managerial">Managerial</option>
            <option value="HR">HR</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Priority</label>
          <select
            className={inputStyle}
            name="priority"
            value={editedEntry.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Questions Asked</label>
          <textarea
            className={textareaStyle}
            name="questionsAsked"
            value={editedEntry.questionsAsked || ""}
            onChange={handleChange}
            placeholder="System design, behavioral, coding questions..."
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">My Response & Approach</label>
          <textarea
            className={textareaStyle}
            name="myAnswer"
            value={editedEntry.myAnswer || ""}
            onChange={handleChange}
            placeholder="How did you structure your answer?"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Mistakes / Areas of Confusion</label>
          <textarea
            className={textareaStyle}
            name="mistakes"
            value={editedEntry.mistakes || ""}
            onChange={handleChange}
            placeholder="Edge cases missed, hesitation points..."
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Key Lessons & Retrospective</label>
          <textarea
            className={textareaStyle}
            name="lessonsLearned"
            value={editedEntry.lessonsLearned || ""}
            onChange={handleChange}
            placeholder="What to study or revise before the next round..."
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono text-text-muted mb-1">Additional Notes</label>
        <input
          className={inputStyle}
          name="notes"
          value={editedEntry.notes || ""}
          onChange={handleChange}
          placeholder="Interviewer vibe, salary discussion, next steps..."
        />
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

export default EditInterviewForm;
