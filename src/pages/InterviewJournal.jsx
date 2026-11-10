import { useState, useContext } from "react";
import {
  Plus,
  Search,
  MessagesSquare,
  Pencil,
  Trash2,
  Archive,
  RotateCcw,
  SlidersHorizontal,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { InterviewContext } from "../context/InterviewContext";
import ModuleHeader from "../components/ModuleHeader";
import PriorityBadge from "../components/PriorityBadge";
import EditInterviewForm from "../components/EditInterviewForm";
import LaserSkeleton from "../components/LaserSkeleton";

const inputClass =
  "w-full bg-surface-subtle border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";
const selectClass = inputClass;
const textareaClass =
  "w-full bg-surface-subtle border border-border rounded-lg p-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent min-h-[70px] resize-y";

function InterviewJournal() {
  const { interviewEntries, loading, addEntry, updateEntry, deleteEntry } =
    useContext(InterviewContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [company, setCompany] = useState("");
  const [round, setRound] = useState("Technical");
  const [questionsAsked, setQuestionsAsked] = useState("");
  const [myAnswer, setMyAnswer] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [searchText, setSearchText] = useState("");
  const [roundFilter, setRoundFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!company.trim()) return;

    addEntry({
      company,
      round,
      questionsAsked,
      myAnswer,
      mistakes,
      lessonsLearned,
      priority,
      notes,
      archived: false,
    });

    setCompany("");
    setRound("Technical");
    setQuestionsAsked("");
    setMyAnswer("");
    setMistakes("");
    setLessonsLearned("");
    setPriority("Medium");
    setNotes("");
    setShowAddForm(false);
  }

  function handleDelete(id) {
    deleteEntry(id);
  }

  function handleArchive(id) {
    updateEntry(id, { archived: true });
  }

  function handleRestore(id) {
    updateEntry(id, { archived: false });
  }

  function handleChangePriority(id, newPriority) {
    updateEntry(id, { priority: newPriority });
  }

  function handleSaveEdit(entry) {
    updateEntry(entry.id, {
      company: entry.company,
      round: entry.round,
      questionsAsked: entry.questionsAsked,
      myAnswer: entry.myAnswer,
      mistakes: entry.mistakes,
      lessonsLearned: entry.lessonsLearned,
      priority: entry.priority,
      notes: entry.notes,
    });
    setEditingId(null);
  }

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <ModuleHeader
          label="Interview Journal"
          description="Connecting to database and synchronizing debrief records..."
        />
        <LaserSkeleton
          type="tracker"
          message="SCANNING_INTERVIEW_DEBRIEFS..."
        />
      </div>
    );
  }

  const filteredEntries = interviewEntries.filter((entry) => {
    const matchesSearch =
      entry.company.toLowerCase().includes(searchText.toLowerCase()) ||
      (entry.questionsAsked &&
        entry.questionsAsked.toLowerCase().includes(searchText.toLowerCase()));

    const matchesRound = roundFilter === "All" || entry.round === roundFilter;
    const matchesPriority =
      priorityFilter === "All" || entry.priority === priorityFilter;

    return matchesSearch && matchesRound && matchesPriority;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <ModuleHeader
        label="Interview Journal"
        description="Reflect on interview rounds, record actual questions asked, and capture retrospectives."
        action={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg text-xs font-mono font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-accent/10"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? "Close Form" : "Log Interview"}
          </button>
        }
      />

      {/* Add Interview Form */}
      {showAddForm && (
        <div className="rounded-xl bg-surface border border-accent/30 p-5 shadow-xl shadow-accent/5 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <MessagesSquare className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">
              New Interview Debrief
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Company *
                </label>
                <input
                  className={inputClass}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Amazon, Datadog"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Round
                </label>
                <select
                  className={selectClass}
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                >
                  <option value="Online Assessment">Online Assessment</option>
                  <option value="Technical">Technical</option>
                  <option value="Managerial">Managerial</option>
                  <option value="HR">HR</option>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Questions Asked
                </label>
                <textarea
                  className={textareaClass}
                  value={questionsAsked}
                  onChange={(e) => setQuestionsAsked(e.target.value)}
                  placeholder="Coding questions, system architecture, leadership principles..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  My Answer & Strategy
                </label>
                <textarea
                  className={textareaClass}
                  value={myAnswer}
                  onChange={(e) => setMyAnswer(e.target.value)}
                  placeholder="Walkthrough of approach, algorithms used..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Mistakes / Stumbles
                </label>
                <textarea
                  className={textareaClass}
                  value={mistakes}
                  onChange={(e) => setMistakes(e.target.value)}
                  placeholder="Where did you get stuck or get corrected?"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-text-muted mb-1">
                  Lessons Learned
                </label>
                <textarea
                  className={textareaClass}
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  placeholder="Key takeaways to brush up on next..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-text-muted mb-1">
                General Notes
              </label>
              <input
                className={inputClass}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Interviewer feedback, culture fit vibes..."
              />
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
                Save Debrief
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
            placeholder="Search interview debriefs..."
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-text-muted hidden sm:block" />
          <select
            className="bg-surface-subtle border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent font-mono"
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
          >
            <option value="All">All Rounds</option>
            <option value="Online Assessment">Online Assessment</option>
            <option value="Technical">Technical</option>
            <option value="Managerial">Managerial</option>
            <option value="HR">HR</option>
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

      {/* Interview Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl bg-surface border border-dashed border-border p-6">
            <MessagesSquare className="w-10 h-10 text-text-muted mb-3 opacity-60" />
            <p className="text-sm font-medium text-text-primary">
              No interview debriefs found
            </p>
            <p className="text-xs text-text-muted mt-1 max-w-sm">
              {searchText || roundFilter !== "All" || priorityFilter !== "All"
                ? "No entries match your search or filters."
                : "Record your first interview experience to start building your retrospective journal."}
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-xl border p-4 sm:p-5 transition-all duration-150 ${
                entry.archived
                  ? "bg-surface/50 border-border/50 opacity-60"
                  : "bg-surface border-border hover:border-accent/40 shadow-sm"
              }`}
            >
              {editingId === entry.id ? (
                <EditInterviewForm
                  entry={entry}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-text-primary text-base">
                        {entry.company}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-accent/10 text-accent border border-accent/20">
                        {entry.round}
                      </span>
                      {entry.archived && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Archived
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge priority={entry.priority} />
                    </div>
                  </div>

                  {/* Debrief Callout Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {entry.questionsAsked?.trim() && (
                      <div className="p-3 rounded-lg bg-surface-subtle border border-border/60 space-y-1">
                        <div className="flex items-center gap-1.5 text-text-primary font-mono font-semibold">
                          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                          <span>Questions Asked</span>
                        </div>
                        <p className="text-text-secondary leading-relaxed break-words whitespace-pre-line">
                          {entry.questionsAsked}
                        </p>
                      </div>
                    )}

                    {entry.myAnswer?.trim() && (
                      <div className="p-3 rounded-lg bg-surface-subtle border border-border/60 space-y-1">
                        <div className="flex items-center gap-1.5 text-text-primary font-mono font-semibold">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          <span>My Approach</span>
                        </div>
                        <p className="text-text-secondary leading-relaxed break-words whitespace-pre-line">
                          {entry.myAnswer}
                        </p>
                      </div>
                    )}

                    {entry.mistakes?.trim() && (
                      <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 space-y-1">
                        <div className="flex items-center gap-1.5 text-rose-400 font-mono font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Mistakes & Pitfalls</span>
                        </div>
                        <p className="text-rose-300/80 leading-relaxed break-words whitespace-pre-line">
                          {entry.mistakes}
                        </p>
                      </div>
                    )}

                    {entry.lessonsLearned?.trim() && (
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
                          <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Lessons Learned</span>
                        </div>
                        <p className="text-emerald-300/80 leading-relaxed break-words whitespace-pre-line">
                          {entry.lessonsLearned}
                        </p>
                      </div>
                    )}
                  </div>

                  {entry.notes?.trim() && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-subtle border border-border/50 text-xs text-text-secondary">
                      <FileText className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <p className="break-words leading-relaxed">{entry.notes}</p>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-text-muted">
                        Priority:
                      </span>
                      <select
                        className="bg-surface-subtle border border-border rounded-md px-2 py-1 text-xs text-text-primary font-mono focus:outline-none focus:border-accent"
                        value={entry.priority}
                        onChange={(e) => handleChangePriority(entry.id, e.target.value)}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingId(entry.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                        title="Edit Entry"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {!entry.archived ? (
                        <button
                          onClick={() => handleArchive(entry.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Archive</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(entry.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-border text-text-secondary hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                        title="Delete Entry"
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

export default InterviewJournal;
