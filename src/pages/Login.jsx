import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiFetch } from "../utils/api";

const inputClass =
  "w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";

const buttonClass =
  "w-full px-4 py-2 text-sm font-mono border border-border rounded text-text-primary hover:border-accent hover:text-accent transition-colors";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await apiFetch("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to sign in");
        return;
      }

      // Verify that the authentication cookie can actually be used
      // before navigating into the protected application.
      const sessionRes = await apiFetch("/users/me");

      if (!sessionRes.ok) {
        setError("Login succeeded, but your session could not be verified. Please try again.");
        return;
      }

      navigate("/");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="bg-surface border border-border rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-text-primary font-mono text-xl font-semibold mb-1">
          CareerOS
        </h1>
        <p className="text-text-muted text-sm mb-6">Sign in to your account</p>

        {error && (
          <p className="text-red-400 text-sm mb-4 border border-red-400/30 bg-red-400/10 rounded px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-text-muted text-xs font-mono">Email</label>
            <input
              className={inputClass}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-text-muted text-xs font-mono">
              Password
            </label>
            <input
              className={inputClass}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button type="submit" className={buttonClass} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-text-muted text-sm mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
