function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-warning/15 text-warning",
    Medium: "bg-white/5 text-text-muted",
    Low: "bg-white/5 text-text-muted",
  };
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded ${styles[priority]}`}>
      {priority}
    </span>
  );
}

export default PriorityBadge;