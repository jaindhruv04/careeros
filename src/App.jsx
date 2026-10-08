import { Outlet, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CompanyTracker from "./pages/CompanyTracker.jsx";
import DSATracker from "./pages/DSATracker.jsx";
import InterviewJournal from "./pages/InterviewJournal.jsx";
import ProjectTracker from "./pages/ProjectTracker.jsx";
import Analytics from "./pages/Analytics.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AIChat from "./components/AIChat.jsx";

import { CompanyProvider } from "./context/CompanyContext";
import { DSAProvider } from "./context/DSAContext";
import { InterviewProvider } from "./context/InterviewContext";
import { ProjectProvider } from "./context/ProjectContext";

function AuthenticatedLayout() {
  return (
    <CompanyProvider>
      <DSAProvider>
        <InterviewProvider>
          <ProjectProvider>
            <div className="flex min-h-screen overflow-x-hidden bg-bg">
              <Navbar />
              <main className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-24 md:px-8 md:pb-8 lg:px-10">
                <Outlet />
              </main>
              <AIChat />
            </div>
          </ProjectProvider>
        </InterviewProvider>
      </DSAProvider>
    </CompanyProvider>
  );
}

function App() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/companies" element={<CompanyTracker />} />
        <Route path="/dsa" element={<DSATracker />} />
        <Route path="/interviews" element={<InterviewJournal />} />
        <Route path="/projects" element={<ProjectTracker />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
