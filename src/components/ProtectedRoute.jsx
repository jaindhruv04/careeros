import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await apiFetch("/users/me");
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    }

    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted font-mono text-sm">
          Checking session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
