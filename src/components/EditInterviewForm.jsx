import { useState } from "react";

function EditInterviewForm({
  entry,
  inputClass,
  textareaClass,
  selectClass,
  buttonClass,
  onSave,
  onCancel,
}) {
  const [editedEntry, setEditedEntry] = useState(entry);

  function handleChange(e) {
    const { name, value } = e.target;

    setEditedEntry({
      ...editedEntry,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(editedEntry);
  }

  return (
    <li className="bg-surface border border-border rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          <input
            className={inputClass}
            name="company"
            value={editedEntry.company}
            onChange={handleChange}
            placeholder="Company"
          />

          <select
            className={selectClass}
            name="round"
            value={editedEntry.round}
            onChange={handleChange}
          >
            <option value="Online Assessment">Online assessment</option>
            <option value="Technical">Technical</option>
            <option value="Managerial">Managerial</option>
            <option value="HR">HR</option>
          </select>

          <select
            className={selectClass}
            name="priority"
            value={editedEntry.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <textarea
          className={textareaClass}
          name="questionsAsked"
          value={editedEntry.questionsAsked}
          onChange={handleChange}
          placeholder="Questions asked"
        />

        <textarea
          className={textareaClass}
          name="myAnswer"
          value={editedEntry.myAnswer}
          onChange={handleChange}
          placeholder="My answer"
        />

        <textarea
          className={textareaClass}
          name="mistakes"
          value={editedEntry.mistakes}
          onChange={handleChange}
          placeholder="Mistakes"
        />

        <textarea
          className={textareaClass}
          name="lessonsLearned"
          value={editedEntry.lessonsLearned}
          onChange={handleChange}
          placeholder="Lessons learned"
        />

        <textarea
          className={textareaClass}
          name="notes"
          value={editedEntry.notes}
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

export default EditInterviewForm;