import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  const [interviewEntries, setInterviewEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchEntries() {
    try {
      const res = await apiFetch("/interviews");
      if (res.ok) {
        const data = await res.json();
        setInterviewEntries(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  async function addEntry(entryData) {
    const res = await apiFetch("/interviews", {
      method: "POST",
      body: JSON.stringify(entryData),
    });
    if (res.ok) {
      const data = await res.json();
      setInterviewEntries((prev) => {
        return [...prev, data.entry];
      });
    }
  }

  async function updateEntry(id, updates) {
    const res = await apiFetch(`/interviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await fetchEntries();
    }
  }

  async function deleteEntry(id) {
    const res = await apiFetch(`/interviews/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchEntries();
    }
  }

  return (
    <InterviewContext.Provider
      value={{ interviewEntries, loading, addEntry, updateEntry, deleteEntry }}
    >
      {children}
    </InterviewContext.Provider>
  );
}
