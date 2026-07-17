import { useState, useContext } from "react";
import { CompanyContext } from "../context/CompanyContext";
import { getDateAdded } from "../utils/dateUtils";
import ModuleHeader from "../components/ModuleHeader";
import PriorityBadge from "../components/PriorityBadge";

const inputClass = "bg-bg border border-border rounded px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";
const selectClass = inputClass;
const buttonClass = "px-4 py-2 text-sm font-mono border border-border rounded text-text-primary hover:border-accent hover:text-accent transition-colors";

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
    const matchesSearch = company.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "All" || company.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || company.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="max-w-4xl">
      <ModuleHeader label="Company Tracker" />

      <div className="bg-surface border border-border rounded-lg p-4 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-center">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Company name" />
          <input className={inputClass} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
          <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input className={inputClass} value={applicationDate} onChange={(e) => setApplicationDate(e.target.value)} placeholder="Application date" />
          <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" />
          <button type="submit" className={buttonClass}>Add company</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input className={inputClass} value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search by company name" />
        <select className={selectClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select className={selectClass} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <ul className="flex flex-col gap-3">
        {filteredCompanies.map((company) => (
          <li key={company.id} className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-text-primary font-medium">{company.name} <span className="text-text-muted font-normal">— {company.role}</span></p>
              <PriorityBadge priority={company.priority} />
            </div>
            <p className="text-sm text-text-muted mb-1">Status: <span className="text-text-primary">{company.status}</span></p>
            {company.applicationDate.trim() !== "" && (
              <p className="text-sm text-text-muted mb-1">Application date: {company.applicationDate}</p>
            )}
            <p className="text-sm text-text-muted mb-1">Added: {company.dateAdded}</p>
            {company.notes?.trim() !== "" && (
              <p className="text-sm text-text-muted">Notes: {company.notes}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyTracker;