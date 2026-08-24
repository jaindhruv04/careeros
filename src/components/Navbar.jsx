import { NavLink, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/companies", label: "Companies" },
  { to: "/dsa", label: "DSA" },
  { to: "/interviews", label: "Interviews" },
  { to: "/projects", label: "Projects" },
];

function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await apiFetch("/users/logout", { method: "POST" });
    } finally {
      navigate("/login", { replace: true });
    }
  }
  return (
    <aside className="w-56 shrink-0 bg-surface border-r border-border px-4 py-6 flex flex-col gap-1 h-screen sticky top-0">
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
  );
}

export default Navbar;
