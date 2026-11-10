export function StatusBadge({ status }) {
  const config = {
    // Companies & Projects
    Applied: {
      bg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      dot: "bg-sky-400",
    },
    Interviewing: {
      bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      dot: "bg-amber-400 animate-pulse",
    },
    Offer: {
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    Rejected: {
      bg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      dot: "bg-rose-400",
    },
    Planning: {
      bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      dot: "bg-blue-400",
    },
    "In Progress": {
      bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      dot: "bg-amber-400",
    },
    Completed: {
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    "On Hold": {
      bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      dot: "bg-zinc-400",
    },

    // DSA
    Solved: {
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    "Not Started": {
      bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      dot: "bg-zinc-400",
    },

    // Difficulty
    Easy: {
      bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    Medium: {
      bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      dot: "bg-amber-400",
    },
    Hard: {
      bg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      dot: "bg-rose-400",
    },
  };

  const style = config[status] || {
    bg: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
    dot: "bg-zinc-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${style.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

export default StatusBadge;
