function ModuleHeader({ label }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
      <p className="font-mono text-xs tracking-widest text-text-muted uppercase">
        Module: {label}
      </p>
    </div>
  );
}

export default ModuleHeader;