import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export const DSAContext = createContext();

export function DSAProvider({ children }) {
  const [dsaTopics, setDsaTopics] = useState([]);

  async function fetchProblems() {
    const res = await apiFetch("/dsa");
    if (res.ok) {
      const data = await res.json();
      setDsaTopics(data);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, []);

  async function addProblem(problemData) {
    const res = await apiFetch("/dsa", {
      method: "POST",
      body: JSON.stringify(problemData),
    });
    if (res.ok) {
      const data = await res.json();
      setDsaTopics((prev) => {
        return [...prev, data.problem];
      });
    }
  }

  async function updateProblem(id, updates) {
    const res = await apiFetch(`/dsa/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await fetchProblems();
    }
  }

  async function deleteProblem(id) {
    const res = await apiFetch(`/dsa/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchProblems();
    }
  }

  return (
    <DSAContext.Provider
      value={{ dsaTopics, addProblem, updateProblem, deleteProblem }}
    >
      {children}
    </DSAContext.Provider>
  );
}
