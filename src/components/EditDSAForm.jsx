import { useState } from "react";

function EditDSAForm({
  problem,
  inputClass,
  selectClass,
  buttonClass,
  onSave,
  onCancel,
}) {
  const [editedProblem, setEditedProblem] = useState(problem);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setEditedProblem({
      ...editedProblem,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(editedProblem);
  }

  return (
    <li className="bg-surface border border-border rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className={inputClass}
          name="name"
          value={editedProblem.name}
          onChange={handleChange}
          placeholder="Problem name"
        />

        <input
          className={inputClass}
          name="topic"
          value={editedProblem.topic}
          onChange={handleChange}
          placeholder="Topic"
        />

        <select
          className={selectClass}
          name="difficulty"
          value={editedProblem.difficulty}
          onChange={handleChange}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          className={selectClass}
          name="status"
          value={editedProblem.status}
          onChange={handleChange}
        >
          <option value="Not Started">Not started</option>
          <option value="In Progress">In progress</option>
          <option value="Solved">Solved</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-text-muted">
          <input
            type="checkbox"
            name="revisionNeeded"
            checked={editedProblem.revisionNeeded}
            onChange={handleChange}
            className="accent-accent"
          />
          Needs revision
        </label>

        <select
          className={selectClass}
          name="priority"
          value={editedProblem.priority}
          onChange={handleChange}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input
          className={inputClass}
          name="notes"
          value={editedProblem.notes}
          onChange={handleChange}
          placeholder="Notes"
        />

        <div className="flex gap-2">
          <button type="submit" className={buttonClass}>
            Save
          </button>

          <button
            type="button"
            className={buttonClass}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </li>
  );
}

export default EditDSAForm;