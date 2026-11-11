import { useState, useContext } from "react";
import {
  Plus,
  Search,
  Code2,
  Pencil,
  Trash2,
  Archive,
  RotateCcw,
  FileText,
  SlidersHorizontal,
  RotateCcw as RevisionIcon,
} from "lucide-react";
import { DSAContext } from "../context/DSAContext";
import { getDateAdded } from "../utils/dateUtils";
import ModuleHeader from "../components/ModuleHeader";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import EditDSAForm from "../components/EditDSAForm";
import LaserSkeleton from "../components/LaserSkeleton";

const inputClass =
  "w-full bg-surface-subtle border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";
const selectClass = inputClass;

function DSATracker() {
  const {
    dsaTopics,
    loading,
    loadError,
    retryFetchProblems,
    addProblem,
    deleteProblem,
    updateProblem,
  } = useContext(DSAContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [status, setStatus] = useState("Not Started");
  const [revisionNeeded, setRevisionNeeded] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [actionError, setActionError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [revisionFilter, setRevisionFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || isSaving) return;
    setIsSaving(true);
    setSubmitError("");
    try {
      await addProblem({
        id: Date.now(),
        name,
        topic,
        difficulty,
        status,
        revisionNeeded,
        priority,
        dateAdded: getDateAdded(),
        notes,
        archived: false,
      });
      setName("");
      setTopic("");
      setDifficulty("Easy");
      setStatus("Not Started");
      setRevisionNeeded(false);
      setPriority("Medium");
      setNotes("");
      setShowAddForm(false);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not save the problem. Please check your connection and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function runProblemAction(action) {
    setActionError("");
    try {
      await action();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "The action failed. Please try again.",
      );
    }
  }

  function deleteDSA(id) {
    return runProblemAction(() => deleteProblem(id));
  }

  function archiveDSA(id) {
    return runProblemAction(() => updateProblem(id, { archived: true }));
  }

  function restoreDSA(id) {
    return runProblemAction(() => updateProblem(id, { archived: false }));
  }

  function changeStatus(id, newStatus) {
    return runProblemAction(() => updateProblem(id, { status: newStatus }));
  }

  function toggleRevision(problem) {
    return runProblemAction(() =>
      updateProblem(problem.id, { revisionNeeded: !problem.revisionNeeded }),
    );
  }

  async function saveEdit(problem) {
    await updateProblem(problem.id, problem);
    setEditingId(null);
  }

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <ModuleHeader
          label="DSA Tracker"
          description="Connecting to database and synchronizing problem telemetry..."
        />
        <LaserSkeleton
          type="tracker"
          message="SCANNING_DSA_PROBLEMS..."
        />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <ModuleHeader
          label="DSA Tracker"
          description="Master data structures and algorithms with active revision tracking and difficulty analytics."
        />
        <div
          role="alert"
          className="rounded-xl bg-surface border border-border p-6 text-center"
        >
          <p className="text-sm font-medium text-text-primary">
            Unable to load your DSA problems
          </p>
          <p className="text-xs text-text-muted mt-1">
            Check your connection and retry. Your problem list could not be confirmed.
          </p>
          <button
            type="button"
            onClick={retryFetchProblems}
            className="mt-4 px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-bg hover:opacity-90"
          >
            Retry loading problems
          </button>
        </div>
      </div>
    );
  }

  const filteredTopics = dsaTopics.filter((problem) => {
    const matchesSearch =
      problem.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (problem.topic && problem.topic.toLowerCase().includes(searchText.toLowerCase()));
    const matchesDifficulty =
      difficultyFilter === "All" || problem.difficulty === difficultyFilter;
    const matchesRevision =
      revisionFilter === "All" ||
      (revisionFilter === "Yes" && problem.revisionNeeded) ||
      (revisionFilter === "No" && !problem.revisionNeeded);
    const matchesPriority =
      priorityFilter === "All" || problem.priority === priorityFilter;
    return (
      matchesSearch && matchesDifficulty && matchesRevision && matchesPriority
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <ModuleHeader
        label="DSA Tracker"
        description="Master data structures and algorithms with active revision tracking and difficulty analytics."
        action={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg text-xs font-mono font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-accent/10"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? "Close Form" : "Add Problem"}
          </button>
        }
      />

      {/* Add Problem Collapsible Form */}
      {showAddForm && (
        <div className="rounded-xl bg-surface border border-accent/30 p-5 shadow-xl shadow-accent/5 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">
              Log New Problem
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label htmlFor="dsa-add-name" className="block text-[11px] font-mono text-text-muted mb-1">
                  Problem Name *
                </label>
                <input
                  id="dsa-add-name"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. LRU Cache, 3Sum"
                  required
                />
              </div>

              <div>
                <label htmlFor="dsa-add-topic" className="block text-[11px] font-mono text-text-muted mb-1">
                  Topic / Category *
                </label>
                <input
                  id="dsa-add-topic"
                  className={inputClass}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Graphs, DP, Trees"
                  required
                />
              </div>

              <div>
                <label htmlFor="dsa-add-difficulty" className="block text-[11px] font-mono text-text-muted mb-1">
                  Difficulty
                </label>
                <select
                  id="dsa-add-difficulty"
                  className={selectClass}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label htmlFor="dsa-add-status" className="block text-[11px] font-mono text-text-muted mb-1">
                  Status
                </label>
                <select
                  id="dsa-add-status"
                  className={selectClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Solved">Solved</option>
                </select>
              </div>

              <div>
                <label htmlFor="dsa-add-priority" className="block text-[11px] font-mono text-text-muted mb-1">
                  Priority
                </label>
                <select
                  id="dsa-add-priority"
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
                <label htmlFor="dsa-add-notes" className="block text-[11px] font-mono text-text-muted mb-1">
                  Key Intuition / Notes
                </label>
                <input
                  id="dsa-add-notes"
                  className={inputClass}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Binary search on answers, O(N log N)..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs font-mono text-text-primary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={revisionNeeded}
                  onChange={(e) => setRevisionNeeded(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-surface accent-accent"
                />
                Mark as Needs Revision
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-mono rounded-lg border border-border text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-bg hover:opacity-90"
                >
                  {isSaving ? "Saving..." : "Save Problem"}
                </button>
              </div>
            </div>
            {submitError && (
              <p role="alert" className="text-sm text-rose-400">
                {submitError}
              </p>
            )}
          </form>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-xl bg-surface border border-border flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            aria-label="Search DSA problems or topics"
            className="w-full bg-surface-subtle border border-border rounded-lg pl-9 pr-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search problems or topics..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-text-muted hidden sm:block" />
          <select
            aria-label="Filter by difficulty"
            className="bg-surface-subtle border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent font-mono"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            aria-label="Filter by revision status"
            className="bg-surface-subtle border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent font-mono"
            value={revisionFilter}
            onChange={(e) => setRevisionFilter(e.target.value)}
          >
            <option value="All">All Problems</option>
            <option value="Yes">Needs Revision</option>
            <option value="No">No Revision</option>
          </select>

          <select
            aria-label="Filter by priority"
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

      {actionError && (
        <p role="alert" className="text-sm text-rose-400">
          {actionError}
        </p>
      )}

      {/* Problems List */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl bg-surface border border-dashed border-border p-6">
            <Code2 className="w-10 h-10 text-text-muted mb-3 opacity-60" />
            <p className="text-sm font-medium text-text-primary">
              No DSA problems found
            </p>
            <p className="text-xs text-text-muted mt-1 max-w-sm">
              {searchText ||
              difficultyFilter !== "All" ||
              revisionFilter !== "All" ||
              priorityFilter !== "All"
                ? "No problems match your current search or filters."
                : "Add your first DSA practice problem to track your solving streak."}
            </p>
          </div>
        ) : (
          filteredTopics.map((problem) => (
            <div
              key={problem.id}
              className={`rounded-xl border p-4 sm:p-5 transition-all duration-150 ${
                problem.archived
                  ? "bg-surface/50 border-border/50 opacity-60"
                  : "bg-surface border-border hover:border-accent/40 shadow-sm"
              }`}
            >
              {editingId === problem.id ? (
                <EditDSAForm
                  problem={problem}
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
                          {problem.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-text-secondary border border-border">
                          {problem.topic}
                        </span>
                        {problem.archived && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Archived
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={problem.difficulty} />
                      <StatusBadge status={problem.status} />
                      <PriorityBadge priority={problem.priority} />
                    </div>
                  </div>

                  {/* Metadata and Revision Status */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    <button
                      onClick={() => toggleRevision(problem)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                        problem.revisionNeeded
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                          : "text-text-muted hover:text-text-primary bg-white/5 border border-border"
                      }`}
                    >
                      <RevisionIcon className="w-3 h-3" />
                      <span>
                        {problem.revisionNeeded
                          ? "Needs Revision"
                          : "Revision Not Needed"}
                      </span>
                    </button>

                    {problem.createdAt && (
                      <span className="text-text-muted">
                        Added: {new Date(problem.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Approach / Notes */}
                  {problem.notes?.trim() && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-subtle border border-border/50 text-xs text-text-secondary">
                      <FileText className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <p className="break-words leading-relaxed">{problem.notes}</p>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-text-muted">
                        Status:
                      </span>
                      <select
                        aria-label={`Change status for ${problem.name}`}
                        className="bg-surface-subtle border border-border rounded-md px-2 py-1 text-xs text-text-primary font-mono focus:outline-none focus:border-accent"
                        value={problem.status}
                        onChange={(e) => changeStatus(problem.id, e.target.value)}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Solved">Solved</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingId(problem.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                        title="Edit Problem"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {!problem.archived ? (
                        <button
                          onClick={() => archiveDSA(problem.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Archive</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => restoreDSA(problem.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteDSA(problem.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                        title="Delete Problem"
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

export default DSATracker;
