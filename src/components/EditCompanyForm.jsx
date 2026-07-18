import { useState } from "react";

function EditCompanyForm({
  company,
  inputClass,
  selectClass,
  buttonClass,
  onSave,
  onCancel,
}) {
  const [editedCompany, setEditedCompany] = useState(company);

  function handleChange(e) {
    const { name, value } = e.target;

    setEditedCompany({
      ...editedCompany,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(editedCompany);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
    >
      <input
        className={inputClass}
        name="name"
        value={editedCompany.name}
        onChange={handleChange}
        placeholder="Company"
      />

      <input
        className={inputClass}
        name="role"
        value={editedCompany.role}
        onChange={handleChange}
        placeholder="Role"
      />

      <select
        className={selectClass}
        name="status"
        value={editedCompany.status}
        onChange={handleChange}
      >
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      <input
        className={inputClass}
        name="applicationDate"
        value={editedCompany.applicationDate}
        onChange={handleChange}
      />

      <select
        className={selectClass}
        name="priority"
        value={editedCompany.priority}
        onChange={handleChange}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <input
        className={inputClass}
        name="notes"
        value={editedCompany.notes}
        onChange={handleChange}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className={buttonClass}
        >
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
  );
}

export default EditCompanyForm;