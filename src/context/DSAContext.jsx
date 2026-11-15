import { createContext, useState, useEffect, useRef } from "react";
import { apiFetch } from "../utils/api";

export const DSAContext = createContext();

export function DSAProvider({ children }) {
  const [dsaTopics, setDsaTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const fetchRequestId = useRef(0);

  async function fetchProblems({ isRetry = false } = {}) {
    const requestId = ++fetchRequestId.current;
    setLoading(true);
    setLoadError(false);
    try {
      const requests = [apiFetch("/dsa")];
      if (!isRetry) {
        requests.push(new Promise((resolve) => setTimeout(resolve, 800)));
      }
      const [res] = await Promise.all(requests);
      if (!res.ok) throw new Error("DSA problems request failed");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid DSA problems response");
      if (requestId !== fetchRequestId.current) return false;
      setDsaTopics(data);
      return true;
    } catch {
      if (requestId === fetchRequestId.current) setLoadError(true);
      return false;
    } finally {
      if (requestId === fetchRequestId.current) setLoading(false);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, []);

  async function addProblem(problemData) {
    try {
      const res = await apiFetch("/dsa", {
        method: "POST",
        body: JSON.stringify(problemData),
      });
      if (!res.ok) throw new Error("Save request failed");
      const data = await res.json();
      if (!data?.problem) throw new Error("Save response was invalid");
      setDsaTopics((prev) => [...prev, data.problem]);
      return data.problem;
    } catch {
      throw new Error("Could not save the problem. Check your connection and try again.");
    }
  }

  async function updateProblem(id, updates) {
    const {
      name,
      topic,
      difficulty,
      status,
      priority,
      revisionNeeded,
      notes,
      archived,
    } = updates;
    const patch = Object.fromEntries(
      Object.entries({ name, topic, difficulty, status, priority, revisionNeeded, notes, archived })
        .filter(([, v]) => v !== undefined),
    );

    const res = await apiFetch(`/dsa/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      throw new Error("Could not save changes. Please try again.");
    }

    const updatedProblem = await res.json();
    if (!updatedProblem || updatedProblem.id !== id) {
      throw new Error("The server returned an invalid problem update.");
    }

    setDsaTopics((prev) =>
      prev.map((problem) => (problem.id === id ? updatedProblem : problem)),
    );
    return updatedProblem;
  }

  async function deleteProblem(id) {
    const res = await apiFetch(`/dsa/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Could not delete the problem. Please try again.");
    }

    setDsaTopics((prev) => prev.filter((problem) => problem.id !== id));
  }

  return (
    <DSAContext.Provider
      value={{
        dsaTopics,
        loading,
        loadError,
        retryFetchProblems: () => fetchProblems({ isRetry: true }),
        addProblem,
        updateProblem,
        deleteProblem,
      }}
    >
      {children}
    </DSAContext.Provider>
  );
}
