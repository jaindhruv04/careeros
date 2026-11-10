function ModuleHeader({ label, description, action }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-4 border-b border-border/60">
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="font-mono text-[11px] font-semibold tracking-wider text-accent uppercase">
            {label}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          {label}
        </h1>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export default ModuleHeader;
