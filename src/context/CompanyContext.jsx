import { createContext, useReducer } from "react";

export const CompanyContext = createContext();

function companyReducer(state, action) {
  switch (action.type) {
    case "ADD_COMPANY":
      return [...state, action.payload];

    case "DELETE_COMPANY":
      return state.filter((company) => company.id !== action.payload);

    case "EDIT_COMPANY":
      return state.map((company) =>
        company.id === action.payload.id
          ? { ...company, ...action.payload }
          : company
      );

    case "CHANGE_STATUS":
      return state.map((company) =>
        company.id === action.payload.id
          ? { ...company, status: action.payload.status }
          : company
      );

    case "ARCHIVE_COMPANY":
      return state.map((company) =>
        company.id === action.payload
          ? { ...company, archived: true }
          : company
      );

    case "RESTORE_COMPANY":
      return state.map((company) =>
        company.id === action.payload
          ? { ...company, archived: false }
          : company
      );

    default:
      return state;
  }
}

export function CompanyProvider({ children }) {
  const [companies, dispatch] = useReducer(companyReducer, []);

  return (
    <CompanyContext.Provider value={{ companies, dispatch }}>
      {children}
    </CompanyContext.Provider>
  );
}