import { useState } from "react";
import { Check, X } from "lucide-react";

function EditCompanyForm({ company, onSave, onCancel }) {
  const [editedCompany, setEditedCompany] = useState(company);

  function handleChange(e) {
    const { name, value } = e.target;
    setEditedCompany((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(editedCompany);
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
          Edit Application
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Company</label>
          <input
            className={inputStyle}
            name="name"
            value={editedCompany.name}
            onChange={handleChange}
            placeholder="Company name"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Role</label>
          <input
            className={inputStyle}
            name="role"
            value={editedCompany.role}
            onChange={handleChange}
            placeholder="e.g. Frontend Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Status</label>
          <select
            className={inputStyle}
            name="status"
            value={editedCompany.status}
            onChange={handleChange}
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Priority</label>
          <select
            className={inputStyle}
            name="priority"
            value={editedCompany.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Application Date</label>
          <input
            className={inputStyle}
            name="applicationDate"
            value={editedCompany.applicationDate || ""}
            onChange={handleChange}
            placeholder="e.g. 2026-11-10"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-text-muted mb-1">Notes</label>
          <input
            className={inputStyle}
            name="notes"
            value={editedCompany.notes || ""}
            onChange={handleChange}
            placeholder="Referral, job ID, tech stack..."
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

export default EditCompanyForm;
