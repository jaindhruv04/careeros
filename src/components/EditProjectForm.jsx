import { useState } from "react";

function EditProjectForm({
  project,
  inputClass,
  selectClass,
  buttonClass,
  onSave,
  onCancel,
}) {
  const [editedProject, setEditedProject] = useState(project);

  function handleChange(e) {
    const { name, value } = e.target;

    setEditedProject({
      ...editedProject,
      [name]: name === "progress" ? Number(value) : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(editedProject);
  }

  return (
    <li className="bg-surface border border-border rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className={inputClass}
          name="name"
          value={editedProject.name}
          onChange={handleChange}
          placeholder="Project name"
        />

        <input
          className={inputClass}
          name="techStack"
          value={editedProject.techStack}
          onChange={handleChange}
          placeholder="Tech stack"
        />

        <input
          type="number"
          min="0"
          max="100"
          className={inputClass}
          name="progress"
          value={editedProject.progress}
          onChange={handleChange}
        />

        <select
          className={selectClass}
          name="status"
          value={editedProject.status}
          onChange={handleChange}
        >
          <option value="Planning">Planning</option>
          <option value="In Progress">In progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On hold</option>
        </select>

        <select
          className={selectClass}
          name="priority"
          value={editedProject.priority}
          onChange={handleChange}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input
          className={inputClass}
          name="notes"
          value={editedProject.notes}
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

export default EditProjectForm;