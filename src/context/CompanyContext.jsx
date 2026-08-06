import { createContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    async function fetchCompanies() {
      const res = await apiFetch("/api/companies");
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies);
      }
    }
    fetchCompanies();
  }, []);

  async function addCompany(companyData) {
    const res = await apiFetch("/api/companies", {
      method: "POST",
      body: JSON.stringify(companyData),
    });

    if (res.ok) {
      const data = await res.json();
      setCompanies((prev) => [...prev, data.company]);
    }
  }

  return (
    <CompanyContext.Provider value={{ companies , addCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}
