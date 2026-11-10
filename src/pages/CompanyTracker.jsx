import { useState, useContext } from "react";
import {
  Plus,
  Search,
  Building2,
  Calendar,
  Pencil,
  Trash2,
  Archive,
  RotateCcw,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { CompanyContext } from "../context/CompanyContext";
import ModuleHeader from "../components/ModuleHeader";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import EditCompanyForm from "../components/EditCompanyForm";

const inputClass =
  "w-full bg-surface-subtle border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";
const selectClass = inputClass;

function CompanyTracker() {
  const { companies, addCompany, updateCompany, deleteCompany } =
    useContext(CompanyContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [applicationDate, setApplicationDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    addCompany({
      id: Date.now(),
      name,
      role,
      status,
      applicationDate,
      priority,
      notes,
      archived: false,
    });
    setName("");
    setRole("");
    setStatus("Applied");
    setApplicationDate("");
    setPriority("Medium");
    setNotes("");
    setShowAddForm(false);
  }

  function deleteComp(id) {
    deleteCompany(id);
  }
  function archiveCompany(id) {
    updateCompany(id, { archived: true });
  }
  function restoreCompany(id) {
    updateCompany(id, { archived: false });
  }
  function changeStatus(id, newStatus) {
    updateCompany(id, { status: newStatus });
  }
  function saveEdit(company) {
    updateCompany(company.id, company);
    setEditingId(null);
  }

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (company.role && company.role.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus =
      statusFilter === "All" || company.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All" || company.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <ModuleHeader
        label="Company Tracker"
        description="Track your job applications, stages, interviews, and offers in one place."
        action={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg text-xs font-mono font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-accent/10"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? "Close Form" : "Add Company"}
          </button>
        }
      />

      {/* Add Company Collapsible Card */}
      {showAddForm && (
        <div className="rounded-xl bg-surface border border-accent/30 p-5 shadow-xl shadow-accent/5 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">
              New Application
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Company Name *
                </label>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Google, Stripe"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Target Role *
                </label>
                <input
                  className={inputClass}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Fullstack Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Application Status
                </label>
                <select
                  className={selectClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Application Date
                </label>
                <input
                  className={inputClass}
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
                  placeholder="e.g. 2026-11-10"
                />
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
                  Notes
                </label>
                <input
                  className={inputClass}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Referral name, job link..."
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
                Save Application
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
            placeholder="Search by company or role..."
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
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
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

      {/* Companies List */}
      <div className="space-y-3">
        {filteredCompanies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl bg-surface border border-dashed border-border p-6">
            <Building2 className="w-10 h-10 text-text-muted mb-3 opacity-60" />
            <p className="text-sm font-medium text-text-primary">
              No applications found
            </p>
            <p className="text-xs text-text-muted mt-1 max-w-sm">
              {searchText || statusFilter !== "All" || priorityFilter !== "All"
                ? "Try adjusting your search criteria or filters."
                : "Get started by adding your first job application above."}
            </p>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div
              key={company.id}
              className={`rounded-xl border p-4 sm:p-5 transition-all duration-150 ${
                company.archived
                  ? "bg-surface/50 border-border/50 opacity-60"
                  : "bg-surface border-border hover:border-accent/40 shadow-sm"
              }`}
            >
              {editingId === company.id ? (
                <EditCompanyForm
                  company={company}
                  onSave={saveEdit}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-text-primary text-base">
                          {company.name}
                        </h3>
                        <span className="text-text-muted text-sm">—</span>
                        <span className="text-text-secondary text-sm font-medium">
                          {company.role}
                        </span>
                        {company.archived && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Archived
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={company.status} />
                      <PriorityBadge priority={company.priority} />
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted font-mono pt-1">
                    {company.applicationDate?.trim() && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-text-muted" />
                        <span>Applied: {company.applicationDate}</span>
                      </div>
                    )}
                    {company.createdAt && (
                      <div className="flex items-center gap-1.5">
                        <span>
                          Added: {new Date(company.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {company.notes?.trim() && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-subtle border border-border/50 text-xs text-text-secondary">
                      <FileText className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <p className="break-words leading-relaxed">{company.notes}</p>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-text-muted">
                        Stage:
                      </span>
                      <select
                        className="bg-surface-subtle border border-border rounded-md px-2 py-1 text-xs text-text-primary font-mono focus:outline-none focus:border-accent"
                        value={company.status}
                        onChange={(e) => changeStatus(company.id, e.target.value)}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingId(company.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                        title="Edit Application"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {!company.archived ? (
                        <button
                          onClick={() => archiveCompany(company.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Archive</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => restoreCompany(company.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteComp(company.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                        title="Delete Application"
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

export default CompanyTracker;
