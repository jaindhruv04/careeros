import { createContext, useReducer } from "react";

export const DSAContext = createContext();

function dsaReducer(state, action) {
  switch (action.type) {
    case "ADD_DSA":
      return [...state, action.payload];

    case "DELETE_DSA":
      return state.filter((problem) => problem.id !== action.payload);

    case "EDIT_DSA":
      return state.map((problem) =>
        problem.id === action.payload.id
          ? { ...problem, ...action.payload }
          : problem
      );

    case "CHANGE_STATUS":
      return state.map((problem) =>
        problem.id === action.payload.id
          ? { ...problem, status: action.payload.status }
          : problem
      );

    case "ARCHIVE_DSA":
      return state.map((problem) =>
        problem.id === action.payload
          ? { ...problem, archived: true }
          : problem
      );

    case "RESTORE_DSA":
      return state.map((problem) =>
        problem.id === action.payload
          ? { ...problem, archived: false }
          : problem
      );

    default:
      return state;
  }
}

export function DSAProvider({ children }) {
  const [dsaTopics, dispatch] = useReducer(dsaReducer, []);

  return (
    <DSAContext.Provider value={{ dsaTopics, dispatch }}>
      {children}
    </DSAContext.Provider>
  );
}