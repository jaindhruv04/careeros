import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { apiFetch } from "../utils/api";

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

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-bg flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[130px]" />
      <div className="pointer-events-none fixed bottom-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="relative w-full max-w-md rounded-2xl bg-surface/85 backdrop-blur-xl border border-border/80 p-8 shadow-2xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-accent to-emerald-400 text-bg shadow-lg shadow-accent/20 mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Career<span className="text-accent">OS</span>
          </h1>
          <p className="text-xs text-text-secondary">
            Sign in to access your placement preparation telemetry
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-text-muted">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="w-full bg-surface-subtle border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-text-muted">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="w-full bg-surface-subtle border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 px-4 text-sm font-semibold text-bg hover:opacity-90 transition-opacity shadow-md shadow-accent/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-text-muted pt-2 border-t border-border/60">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-medium text-accent hover:underline transition-all"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
