import { useState, useContext } from "react";
import { DSAContext } from "../context/DSAContext";
import { getDateAdded } from "../utils/dateUtils";
import ModuleHeader from "../components/ModuleHeader";
import PriorityBadge from "../components/PriorityBadge";
import EditDSAForm from "../components/EditDSAForm";

const inputClass =
  "bg-bg border border-border rounded px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";

const selectClass = inputClass;

const buttonClass =
  "px-4 py-2 text-sm font-mono border border-border rounded text-text-primary hover:border-accent hover:text-accent transition-colors";

function DSATracker() {
  const { dsaTopics, dispatch } = useContext(DSAContext);

  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [status, setStatus] = useState("Not Started");
  const [revisionNeeded, setRevisionNeeded] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [searchText, setSearchText] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [revisionFilter, setRevisionFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    const newDsaTopic = {
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
    };

    dispatch({
      type: "ADD_DSA",
      payload: newDsaTopic,
    });

    setName("");
    setTopic("");
    setDifficulty("Easy");
    setStatus("Not Started");
    setRevisionNeeded(false);
    setPriority("Medium");
    setNotes("");
  }

  function deleteDSA(id) {
    dispatch({
      type: "DELETE_DSA",
      payload: id,
    });
  }

  function archiveDSA(id) {
    dispatch({
      type: "ARCHIVE_DSA",
      payload: id,
    });
  }

  function restoreDSA(id) {
    dispatch({
      type: "RESTORE_DSA",
      payload: id,
    });
  }

  function changeStatus(id, status) {
    dispatch({
      type: "CHANGE_STATUS",
      payload: {
        id,
        status,
      },
    });
  }

  function saveEdit(problem) {
    dispatch({
      type: "EDIT_DSA",
      payload: problem,
    });

    setEditingId(null);
  }

  const filteredTopics = dsaTopics.filter((problem) => {
    const matchesSearch = problem.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

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
    <div className="max-w-4xl">
      <ModuleHeader label="DSA Tracker" />

      <div className="bg-surface border border-border rounded-lg p-4 mb-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-3 items-center"
        >
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Problem name"
          />

          <input
            className={inputClass}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic"
          />

          <select
            className={selectClass}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            className={selectClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Not Started">Not started</option>
            <option value="In Progress">In progress</option>
            <option value="Solved">Solved</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={revisionNeeded}
              onChange={(e) => setRevisionNeeded(e.target.checked)}
              className="accent-accent"
            />
            Needs revision
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

          <input
            className={inputClass}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
          />

          <button type="submit" className={buttonClass}>
            Add problem
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className={inputClass}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by problem name"
        />

        <select
          className={selectClass}
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="All">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          className={selectClass}
          value={revisionFilter}
          onChange={(e) => setRevisionFilter(e.target.value)}
        >
          <option value="All">All problems</option>
          <option value="Yes">Needs revision</option>
          <option value="No">No revision needed</option>
        </select>

        <select
          className={selectClass}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <ul className="flex flex-col gap-3">
        {filteredTopics.map((problem) =>
          editingId === problem.id ? (
            <EditDSAForm
              key={problem.id}
              problem={problem}
              inputClass={inputClass}
              selectClass={selectClass}
              buttonClass={buttonClass}
              onSave={saveEdit}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <li
              key={problem.id}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-primary font-medium">
                  {problem.name}
                  <span className="text-text-muted font-normal">
                    {" "}
                    — {problem.topic}
                  </span>
                </p>

                <PriorityBadge priority={problem.priority} />
              </div>

              <p className="text-sm text-text-muted mb-1">
                {problem.difficulty} · {problem.status}
              </p>

              <p className="text-sm mb-1">
                {problem.revisionNeeded ? (
                  <span className="text-warning">Needs revision</span>
                ) : (
                  <span className="text-text-muted">No revision needed</span>
                )}
              </p>

              <p className="text-sm text-text-muted mb-2">
                Added: {problem.dateAdded}
              </p>

              {problem.notes?.trim() !== "" && (
                <p className="text-sm text-text-muted mb-3">
                  <span className="text-text-primary">Notes:</span>{" "}
                  {problem.notes}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  className={buttonClass}
                  onClick={() => setEditingId(problem.id)}
                >
                  Edit
                </button>

                <button
                  className={buttonClass}
                  onClick={() => deleteDSA(problem.id)}
                >
                  Delete
                </button>

                {problem.archived ? (
                  <button
                    className={buttonClass}
                    onClick={() => restoreDSA(problem.id)}
                  >
                    Restore
                  </button>
                ) : (
                  <button
                    className={buttonClass}
                    onClick={() => archiveDSA(problem.id)}
                  >
                    Archive
                  </button>
                )}

                <select
                  className={selectClass}
                  value={problem.status}
                  onChange={(e) => changeStatus(problem.id, e.target.value)}
                >
                  <option value="Not Started">Not started</option>
                  <option value="In Progress">In progress</option>
                  <option value="Solved">Solved</option>
                </select>
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

export default DSATracker;
