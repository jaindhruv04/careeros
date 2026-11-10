function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  const dots = {
    High: "bg-rose-400 animate-pulse",
    Medium: "bg-amber-400",
    Low: "bg-zinc-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-medium border ${
        styles[priority] || styles.Low
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dots[priority] || dots.Low}`}
      />
      {priority}
    </span>
  );
}

export default PriorityBadge;
