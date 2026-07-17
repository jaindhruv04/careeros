import { createContext, useState } from "react";

export const DSAContext = createContext();

export function DSAProvider({ children }) {
  const [dsaTopics, setDsaTopics] = useState([]);

  return (
    <DSAContext.Provider value={{ dsaTopics, setDsaTopics }}>
      {children}
    </DSAContext.Provider>
  );
}