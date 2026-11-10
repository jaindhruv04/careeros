import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCompanies() {
    try {
      const [res] = await Promise.all([
        apiFetch("/companies"),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      }
    } finally {
      setLoading(false);
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
    if (res.ok) {
      const data = await res.json();
      setCompanies((prev) => {
        return [...prev, data.company];
      });
    }
  }

  async function updateCompany(id, updates) {
    const res = await apiFetch(`/companies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await fetchCompanies();
    }
  }

  async function deleteCompany(id) {
    const res = await apiFetch(`/companies/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchCompanies();
    }
  }

  return (
    <CompanyContext.Provider
      value={{ companies, loading, addCompany, updateCompany, deleteCompany }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

