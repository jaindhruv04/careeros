import { useState } from 'react';

function CompanyTracker() {
  const [companies, setCompanies] = useState([]);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [applicationDate, setApplicationDate] = useState('');
  const [notes, setNotes] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const newCompany = {
      id: Date.now(),
      name,
      role,
      status,
      applicationDate,
      notes
    };

    setCompanies([...companies, newCompany]);

    setName('');
    setRole('');
    setStatus('Applied');
    setApplicationDate('');
    setNotes('');
  }

  return (
    <div>
      <h1>Company Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Company name" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <input value={applicationDate} onChange={(e) => setApplicationDate(e.target.value)} placeholder="Application date" />
        <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
        <button type="submit">Add Company</button>
      </form>

      <ul>
        {companies.map((company) => (
          <li key={company.id}>
            {company.name} — {company.role} — {company.applicationDate} — {company.status} — {company.notes}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyTracker;