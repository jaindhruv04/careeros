import { createContext, useState, useEffect, useRef } from "react";
import { apiFetch } from "../utils/api";

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const fetchRequestId = useRef(0);

  async function fetchProjects() {
    const requestId = ++fetchRequestId.current;
    setLoading(true);
    setLoadError(false);
    try {
      const [res] = await Promise.all([
        apiFetch("/projects"),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      if (!res.ok) throw new Error("Projects request failed");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid projects response");
      if (requestId !== fetchRequestId.current) return;
      setProjects(data);
    } catch {
      if (requestId === fetchRequestId.current) setLoadError(true);
    } finally {
      if (requestId === fetchRequestId.current) setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function addProject(projectData) {
    const res = await apiFetch("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
    if (!res.ok) throw new Error("Could not save the project. Please try again.");
    const data = await res.json();
    if (!data?.project) throw new Error("Save response was invalid.");
    setProjects((prev) => [...prev, data.project]);
    return data.project;
  }

  async function updateProject(id, updates) {
    const res = await apiFetch(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Could not save changes. Please try again.");
    const data = await res.json();
    const updated = data?.project ?? { ...updates, id };
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  }

  async function deleteProject(id) {
    const res = await apiFetch(`/projects/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Could not delete the project. Please try again.");
    fetchRequestId.current += 1;
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <ProjectContext.Provider
      value={{ projects, loading, loadError, retryFetchProjects: fetchProjects, addProject, updateProject, deleteProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
