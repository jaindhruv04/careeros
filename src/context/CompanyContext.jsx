import { createContext, useState, useEffect, useRef } from "react";
import { apiFetch } from "../utils/api";

export const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const fetchRequestId = useRef(0);

  async function fetchCompanies() {
    const requestId = ++fetchRequestId.current;
    setLoading(true);
    setLoadError(false);
    try {
      const [res] = await Promise.all([
        apiFetch("/companies"),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      if (!res.ok) throw new Error("Companies request failed");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid companies response");
      if (requestId !== fetchRequestId.current) return;
      setCompanies(data);
    } catch {
      if (requestId === fetchRequestId.current) setLoadError(true);
    } finally {
      if (requestId === fetchRequestId.current) setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function addCompany(companyData) {
    const res = await apiFetch("/companies", {
      method: "POST",
      body: JSON.stringify(companyData),
    });
    if (!res.ok) throw new Error("Could not save the company. Please try again.");
    const data = await res.json();
    if (!data?.company) throw new Error("Save response was invalid.");
    setCompanies((prev) => [...prev, data.company]);
    return data.company;
  }

  async function updateCompany(id, updates) {
    const res = await apiFetch(`/companies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Could not save changes. Please try again.");
    const data = await res.json();
    const updated = data?.company ?? { ...updates, id };
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  }

  async function deleteCompany(id) {
    const res = await apiFetch(`/companies/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Could not delete the company. Please try again.");
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <CompanyContext.Provider
      value={{ companies, loading, loadError, retryFetchCompanies: fetchCompanies, addCompany, updateCompany, deleteCompany }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

