import { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { apiFetch } from "../utils/api";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/dsa", label: "DSA", icon: Code2 },
  { to: "/interviews", label: "Interviews", icon: MessagesSquare },
  { to: "/projects", label: "Projects", icon: FolderGit2 },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await apiFetch("/users/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-border/80 shadow-sm">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Left */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-emerald-400 flex items-center justify-center shadow-lg shadow-accent/20">
            <Sparkles className="w-4 h-4 text-bg" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold tracking-wider text-text-primary">
              CAREER<span className="text-accent">OS</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-text-muted border border-border">
              v2.0
            </span>
          </div>
        </NavLink>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-surface-subtle border border-border/70">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/25 shadow-sm shadow-accent/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04] border border-transparent"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? "text-accent" : "text-text-muted"
                      }`}
                    />
                    <span>{link.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-text-secondary hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            title="Sign out of account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 border border-border/60 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-accent" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/80 bg-surface/98 backdrop-blur-xl px-4 py-4 space-y-1 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/25"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-2 mt-2 border-t border-border/60">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
