import { createContext, useState, useEffect, useRef } from "react";
import { apiFetch } from "../utils/api";

export const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  const [interviewEntries, setInterviewEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const fetchRequestId = useRef(0);

  async function fetchEntries() {
    const requestId = ++fetchRequestId.current;
    setLoading(true);
    setLoadError(false);
    try {
      const [res] = await Promise.all([
        apiFetch("/interviews"),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      if (!res.ok) throw new Error("Interviews request failed");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid interviews response");
      if (requestId !== fetchRequestId.current) return;
      setInterviewEntries(data);
    } catch {
      if (requestId === fetchRequestId.current) setLoadError(true);
    } finally {
      if (requestId === fetchRequestId.current) setLoading(false);
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
    if (!res.ok) throw new Error("Could not save the entry. Please try again.");
    const data = await res.json();
    if (!data?.entry) throw new Error("Save response was invalid.");
    setInterviewEntries((prev) => [...prev, data.entry]);
    return data.entry;
  }

  async function updateEntry(id, updates) {
    const res = await apiFetch(`/interviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Could not save changes. Please try again.");
    const data = await res.json();
    const updated = data?.entry ?? { ...updates, id };
    setInterviewEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  }

  async function deleteEntry(id) {
    const res = await apiFetch(`/interviews/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Could not delete the entry. Please try again.");
    setInterviewEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <InterviewContext.Provider
      value={{ interviewEntries, loading, loadError, retryFetchEntries: fetchEntries, addEntry, updateEntry, deleteEntry }}
    >
      {children}
    </InterviewContext.Provider>
  );
}
