import { useState, useContext } from "react";
import { CompanyContext } from "../context/CompanyContext";
import { getDateAdded } from "../utils/dateUtils";

function CompanyTracker() {
  const { companies, setCompanies } = useContext(CompanyContext);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [applicationDate, setApplicationDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  function handleSubmit(e) {
    e.preventDefault();

    const newCompany = {
      id: Date.now(),
      name,
      role,
      status,
      applicationDate,
      dateAdded: getDateAdded(applicationDate),
      priority,
      notes,
    };

    setCompanies([...companies, newCompany]);

    setName("");
    setRole("");
    setStatus("Applied");
    setApplicationDate("");
    setPriority("Medium");
    setNotes("");
  }

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || company.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || company.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div>
      <h1>Company Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Company name"
        />

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          value={applicationDate}
          onChange={(e) => setApplicationDate(e.target.value)}
          placeholder="Application date"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />

        <button type="submit">Add Company</button>
      </form>

      <hr />

      <h2>Search & Filter</h2>

      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search by company name"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
      >
        <option value="All">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <ul>
        {filteredCompanies.map((company) => (
          <li key={company.id}>
            <strong>{company.name}</strong> — {company.role} — {company.status}

            {company.applicationDate.trim() !== "" && (
              <div>
                <strong>Application Date:</strong>{" "}
                {company.applicationDate}
              </div>
            )}

            <div>
              <strong>Priority:</strong> {company.priority}
            </div>

            <div>
              <strong>Date Added:</strong> {company.dateAdded}
            </div>

            {company.notes.trim() !== "" && (
              <div>
                <strong>Notes:</strong> {company.notes}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyTracker;