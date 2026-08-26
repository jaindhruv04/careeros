import { NavLink, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const links = [
  { to: "/", label: "Dashboard", short: "Home" },
  { to: "/companies", label: "Companies", short: "Companies" },
  { to: "/dsa", label: "DSA", short: "DSA" },
  { to: "/interviews", label: "Interviews", short: "Interviews" },
  { to: "/projects", label: "Projects", short: "Projects" },
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
      <aside className="hidden md:flex w-56 shrink-0 bg-surface border-r border-border px-4 py-6 flex-col gap-1 h-screen sticky top-0">
        <p className="font-mono text-sm tracking-widest text-accent mb-8 px-2">
          CAREER<span className="text-text-primary">OS</span>
        </p>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm font-mono tracking-wide transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-text-primary hover:bg-white/5"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded text-left text-sm font-mono tracking-wide text-text-muted transition-colors hover:text-text-primary hover:bg-white/5"
          >
            Logout
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface/95 backdrop-blur border-t border-border px-1 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `min-w-0 flex-1 flex items-center justify-center rounded px-1 py-2 text-[10px] font-mono tracking-tight transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted active:text-text-primary"
                }`
              }
            >
              {link.short}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="min-w-0 flex-1 px-1 py-2 rounded text-[10px] font-mono tracking-tight text-text-muted active:text-text-primary"
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
