import { createContext, useState } from "react";

export const InterviewContext = createContext();

export function InterviewProvider({ children }) {
  const [interviewEntries, setInterviewEntries] = useState([]);

  return (
    <InterviewContext.Provider
      value={{ interviewEntries, setInterviewEntries }}
    >
      {children}
    </InterviewContext.Provider>
  );
}