import { createContext, useReducer, useEffect } from "react";

export const InterviewContext = createContext();

function interviewReducer(state, action) {
  switch (action.type) {
    case "ADD_INTERVIEW":
      return [...state, action.payload];

    case "DELETE_INTERVIEW":
      return state.filter((entry) => entry.id !== action.payload);

    case "EDIT_INTERVIEW":
      return state.map((entry) =>
        entry.id === action.payload.id
          ? { ...entry, ...action.payload }
          : entry
      );

    case "CHANGE_PRIORITY":
      return state.map((entry) =>
        entry.id === action.payload.id
          ? { ...entry, priority: action.payload.priority }
          : entry
      );

    case "ARCHIVE_INTERVIEW":
      return state.map((entry) =>
        entry.id === action.payload
          ? { ...entry, archived: true }
          : entry
      );

    case "RESTORE_INTERVIEW":
      return state.map((entry) =>
        entry.id === action.payload
          ? { ...entry, archived: false }
          : entry
      );

    default:
      return state;
  }
}

export function InterviewProvider({ children }) {
  const storedInterviewEntries =
    JSON.parse(localStorage.getItem("interviewEntries")) || [];

  const [interviewEntries, dispatch] = useReducer(
    interviewReducer,
    storedInterviewEntries
  );

  useEffect(() => {
    localStorage.setItem(
      "interviewEntries",
      JSON.stringify(interviewEntries)
    );
  }, [interviewEntries]);

  return (
    <InterviewContext.Provider value={{ interviewEntries, dispatch }}>
      {children}
    </InterviewContext.Provider>
  );
}