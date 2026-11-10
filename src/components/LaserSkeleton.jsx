import { useState, useEffect } from "react";
import { Sparkles, Terminal, Activity } from "lucide-react";

const TIPS = [
  "Render free-tier instances sleep after 15 min of inactivity and take ~30s to spin up.",
  "STAR Method: Structure behavioral interview answers as Situation, Task, Action, Result.",
  "DSA Insight: Sliding window and Two-pointer approaches often reduce O(N²) array problems to O(N).",
  "System Design: Prefer eventual consistency over strict consistency when horizontal scaling is critical.",
  "Interview Tip: Always communicate your thought process and trade-offs out loud before coding.",
];

export function LaserSkeleton({
  type = "dashboard",
  message = "CONNECTING_TO_INSTANCE...",
}) {
  const [seconds, setSeconds] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 6000);

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl border border-accent/30 bg-surface/80 p-6 overflow-hidden cyber-grid backdrop-blur-md shadow-2xl">
      {/* Laser Scanning Beam with High-Intensity Glow */}
      <div className="pointer-events-none absolute inset-x-0 z-30 animate-laser">
        {/* Intense Laser Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent to-transparent laser-glow" />
        {/* Soft Trailing Glow Flare */}
        <div className="h-16 w-full bg-gradient-to-t from-accent/20 via-accent/5 to-transparent -translate-y-full blur-xs" />
      </div>

      {/* Telemetry Status Bar Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 border border-accent/30 text-accent shadow-sm shadow-accent/20">
            <Activity className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                {message}
              </span>
              <span className="inline-block h-3.5 w-1.5 bg-accent animate-pulse" />
            </div>
            <p className="text-[11px] font-mono text-text-muted mt-0.5">
              Live link sync · elapsed:{" "}
              <span className="text-text-primary font-semibold">{seconds}s</span>
            </p>
          </div>
        </div>

        {/* Dynamic Tip Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle border border-border text-xs text-text-secondary max-w-md">
          <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
          <p className="truncate text-[11px] font-mono">{TIPS[tipIndex]}</p>
        </div>
      </div>

      {/* Vivid Skeleton Body */}
      {type === "dashboard" && (
        <div className="space-y-6">
          {/* Bento Stat Tiles Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-surface-subtle/90 border border-border/90 p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 rounded bg-zinc-700/80 animate-pulse" />
                  <div className="h-9 w-9 rounded-lg bg-zinc-800 border border-white/10 animate-pulse" />
                </div>
                <div className="space-y-2 pt-1">
                  <div className="h-8 w-16 rounded-md bg-accent/20 border border-accent/30 animate-pulse" />
                  <div className="h-3 w-28 rounded bg-zinc-700/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* 2-Column Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl bg-surface-subtle/90 border border-border/90 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="h-4 w-36 rounded bg-zinc-700/90 animate-pulse" />
                <div className="h-3 w-16 rounded bg-zinc-800 animate-pulse" />
              </div>
              <div className="space-y-3 pt-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-4 w-12 rounded bg-zinc-800 border border-white/10 animate-pulse" />
                      <div className="h-4 w-40 rounded bg-zinc-700/80 animate-pulse" />
                    </div>
                    <div className="h-4 w-16 rounded-full bg-accent/15 border border-accent/25 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-surface-subtle/90 border border-border/90 p-5 space-y-4 shadow-sm">
              <div className="h-4 w-28 rounded bg-zinc-700/90 animate-pulse pb-2 border-b border-border/60" />
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-surface border border-border/80 space-y-2"
                  >
                    <div className="h-2.5 w-14 rounded bg-zinc-700/70 animate-pulse" />
                    <div className="h-6 w-10 rounded bg-zinc-700 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {type === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-surface-subtle/90 border border-border/90 p-6 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-44 rounded bg-zinc-700/90 animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-accent/20 border border-accent/30 animate-pulse" />
                </div>
                <div className="h-2.5 w-full rounded-full bg-zinc-800 border border-white/5 animate-pulse overflow-hidden">
                  <div className="h-full w-2/3 bg-accent/40 rounded-full" />
                </div>
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="p-2.5 rounded-lg bg-surface border border-border/70 h-14 animate-pulse space-y-1.5"
                    >
                      <div className="h-2 w-10 rounded bg-zinc-700/60" />
                      <div className="h-4 w-8 rounded bg-zinc-700" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-surface-subtle/90 border border-border/90 p-6 space-y-3.5 shadow-sm"
              >
                <div className="h-4 w-44 rounded bg-zinc-700/90 animate-pulse mb-3" />
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-3 w-16 rounded bg-zinc-700/80 animate-pulse" />
                      <div className="h-3 w-8 rounded bg-zinc-700/80 animate-pulse" />
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-zinc-700/80 animate-pulse"
                        style={{ width: `${60 - j * 15}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "tracker" && (
        <div className="space-y-4">
          <div className="h-12 w-full rounded-xl bg-surface-subtle/90 border border-border/90 flex items-center px-4 gap-3">
            <div className="w-4 h-4 rounded bg-zinc-700 animate-pulse" />
            <div className="h-3.5 w-64 rounded bg-zinc-700/70 animate-pulse" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-surface-subtle/90 border border-border/90 p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-52 rounded bg-zinc-700/90 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-5 w-20 rounded-full bg-accent/20 border border-accent/30 animate-pulse" />
                  <div className="h-5 w-16 rounded-full bg-zinc-800 border border-white/10 animate-pulse" />
                </div>
              </div>
              <div className="h-3 w-40 rounded bg-zinc-700/60 animate-pulse" />
              <div className="h-10 w-full rounded-lg bg-surface border border-border/70 flex items-center px-3 animate-pulse">
                <div className="h-3 w-3/4 rounded bg-zinc-700/50" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cyberpunk Footer Watermark */}
      <div className="relative z-10 flex items-center justify-between pt-4 mt-6 border-t border-border/60 text-[10px] font-mono text-text-muted">
        <span className="flex items-center gap-1">
          <Terminal className="w-3 h-3 text-accent" />
          CAREEROS_KERNEL_v2.0
        </span>
        <span className="uppercase text-accent font-semibold tracking-wider">
          Render Cluster Deployment Scan Active
        </span>
      </div>
    </div>
  );
}

export default LaserSkeleton;
