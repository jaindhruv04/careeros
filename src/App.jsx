import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CompanyTracker from "./pages/CompanyTracker.jsx";
import DSATracker from "./pages/DSATracker.jsx";
import InterviewJournal from "./pages/InterviewJournal.jsx";
import ProjectTracker from "./pages/ProjectTracker.jsx";

import { CompanyProvider } from "./context/CompanyContext";
import { DSAProvider } from "./context/DSAContext";
import { InterviewProvider } from "./context/InterviewContext";
import { ProjectProvider } from "./context/ProjectContext";

function App() {
  return (
    <>
      <Navbar />
      <CompanyProvider>
        <DSAProvider>
          <InterviewProvider>
            <ProjectProvider>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/companies" element={<CompanyTracker />} />
                <Route path="/dsa" element={<DSATracker />} />
                <Route path="/interviews" element={<InterviewJournal />} />
                <Route path="/projects" element={<ProjectTracker />} />
              </Routes>
            </ProjectProvider>
          </InterviewProvider>
        </DSAProvider>
      </CompanyProvider>
    </>
  );
}

export default App;