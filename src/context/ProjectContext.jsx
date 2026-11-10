import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    try {
      const res = await apiFetch("/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } finally {
      setLoading(false);
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
    if (res.ok) {
      const data = await res.json();
      setProjects((prev) => {
        return [...prev, data.project];
      });
    }
  }

  async function updateProject(id, updates) {
    const res = await apiFetch(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await fetchProjects();
    }
  }

  async function deleteProject(id) {
    const res = await apiFetch(`/projects/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchProjects();
    }
  }

  return (
    <ProjectContext.Provider
      value={{ projects, loading, addProject, updateProject, deleteProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
