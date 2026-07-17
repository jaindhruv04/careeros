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
    <CompanyProvider>
      <DSAProvider>
        <InterviewProvider>
          <ProjectProvider>
            <div className="flex min-h-screen bg-bg">
              <Navbar />
              <main className="flex-1 px-10 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/companies" element={<CompanyTracker />} />
                  <Route path="/dsa" element={<DSATracker />} />
                  <Route path="/interviews" element={<InterviewJournal />} />
                  <Route path="/projects" element={<ProjectTracker />} />
                </Routes>
              </main>
            </div>
          </ProjectProvider>
        </InterviewProvider>
      </DSAProvider>
    </CompanyProvider>
  );
}

export default App;