import { createContext, useReducer } from "react";

export const ProjectContext = createContext();

function projectReducer(state, action) {
  switch (action.type) {
    case "ADD_PROJECT":
      return [...state, action.payload];

    case "DELETE_PROJECT":
      return state.filter((project) => project.id !== action.payload);

    case "EDIT_PROJECT":
      return state.map((project) =>
        project.id === action.payload.id
          ? { ...project, ...action.payload }
          : project
      );

    case "CHANGE_STATUS":
      return state.map((project) =>
        project.id === action.payload.id
          ? { ...project, status: action.payload.status }
          : project
      );

    case "ARCHIVE_PROJECT":
      return state.map((project) =>
        project.id === action.payload
          ? { ...project, archived: true }
          : project
      );

    case "RESTORE_PROJECT":
      return state.map((project) =>
        project.id === action.payload
          ? { ...project, archived: false }
          : project
      );

    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [projects, dispatch] = useReducer(projectReducer, []);

  return (
    <ProjectContext.Provider value={{ projects, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}