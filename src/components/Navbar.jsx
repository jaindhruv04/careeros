import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Code2,
  MessagesSquare,
  FolderGit2,
  BarChart3,
  LogOut,
  Sparkles,
} from "lucide-react";
import { apiFetch } from "../utils/api";

const links = [
  { to: "/", label: "Dashboard", short: "Home", icon: LayoutDashboard },
  { to: "/companies", label: "Companies", short: "Companies", icon: Building2 },
  { to: "/dsa", label: "DSA Tracker", short: "DSA", icon: Code2 },
  { to: "/interviews", label: "Interviews", short: "Interviews", icon: MessagesSquare },
  { to: "/projects", label: "Projects", short: "Projects", icon: FolderGit2 },
  { to: "/analytics", label: "Analytics", short: "Analytics", icon: BarChart3 },
];

function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await apiFetch("/users/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-surface/90 backdrop-blur-md border-r border-border px-4 py-6 flex-col h-screen sticky top-0 z-40">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-emerald-400 flex items-center justify-center shadow-lg shadow-accent/20">
              <Sparkles className="w-4 h-4 text-bg" />
            </div>
            <div>
              <p className="font-mono text-sm font-bold tracking-wider text-text-primary leading-none">
                CAREER<span className="text-accent">OS</span>
              </p>
              <p className="text-[10px] text-text-muted font-mono mt-0.5">DEV WORKSPACE</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-text-muted border border-border">
            v2.0
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          <p className="px-2 text-[11px] font-mono uppercase tracking-wider text-text-muted mb-2 font-medium">
            Navigation
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/25 shadow-sm shadow-accent/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-accent" : "text-text-muted group-hover:text-text-primary"
                      }`}
                    />
                    <span>{link.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User / Session Footer */}
        <div className="pt-4 mt-auto border-t border-border/70">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-rose-400 hover:bg-rose-500/10 transition-colors group"
          >
            <LogOut className="w-4 h-4 text-text-muted group-hover:text-rose-400 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-lg border-t border-border px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-2xl">
        <div className="flex items-center justify-around gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `min-w-0 flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all ${
                    isActive
                      ? "text-accent bg-accent/10 font-medium"
                      : "text-text-muted hover:text-text-primary active:bg-white/5"
                  }`
                }
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] truncate">{link.short}</span>
              </NavLink>
            );
          })}
          <button
            onClick={handleLogout}
            className="min-w-0 flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-text-muted hover:text-rose-400 active:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] truncate">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
