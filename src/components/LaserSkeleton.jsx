import { useState, useEffect } from "react";
import { Sparkles, Terminal, Activity, Scan } from "lucide-react";

const TIPS = [
  "Render free-tier instances sleep after 15 min of inactivity and take ~30s to spin up.",
  "STAR Method: Structure behavioral interview answers as Situation, Task, Action, Result.",
  "DSA Insight: Sliding window and Two-pointer approaches often reduce O(N²) array problems to O(N).",
  "System Design: Prefer eventual consistency over strict consistency when horizontal scaling is critical.",
  "Interview Tip: Always communicate your thought process and trade-offs out loud before coding.",
];

function XRayBoneSkull() {
  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* HUD Corner Brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent/60" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent/60" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent/60" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent/60" />

      {/* Diagnostic Watermark Tags */}
      <div className="absolute top-3 left-4 text-[9px] font-mono text-accent/70 tracking-widest">
        BIO_SCAN // CHASSIS_01
      </div>
      <div className="absolute top-3 right-4 text-[9px] font-mono text-text-muted tracking-widest">
        λ: 488nm (X-RAY)
      </div>

      {/* Cyber X-Ray Bone Skeleton SVG */}
      <svg
        viewBox="0 0 200 240"
        className="w-44 h-52 drop-shadow-[0_0_18px_rgba(45,212,191,0.5)] my-2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cranium Skull Vault */}
        <path
          d="M 60 90 C 50 50, 70 20, 100 20 C 130 20, 150 50, 140 90 C 145 105, 138 120, 135 125 C 130 135, 120 145, 120 155 L 80 155 C 80 145, 70 135, 65 125 C 62 120, 55 105, 60 90 Z"
          stroke="#2dd4bf"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cranial Suture & Diagnostic Lines */}
        <path
          d="M 75 35 Q 100 45 125 35"
          stroke="#2dd4bf"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          opacity="0.7"
        />
        <path
          d="M 100 20 L 100 55"
          stroke="#2dd4bf"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          opacity="0.7"
        />

        {/* Eye Sockets (Deep Orbitals) */}
        <ellipse
          cx="80"
          cy="85"
          rx="15"
          ry="18"
          stroke="#2dd4bf"
          strokeWidth="2"
          fill="#0b0d11"
        />
        <ellipse
          cx="120"
          cy="85"
          rx="15"
          ry="18"
          stroke="#2dd4bf"
          strokeWidth="2"
          fill="#0b0d11"
        />

        {/* Glowing Cyber Optic Cores */}
        <circle cx="80" cy="85" r="4" fill="#2dd4bf" className="animate-pulse" />
        <circle cx="120" cy="85" r="4" fill="#2dd4bf" className="animate-pulse" />

        {/* Nasal Cavity Piriform Aperture */}
        <path
          d="M 100 96 L 93 116 L 107 116 Z"
          stroke="#2dd4bf"
          strokeWidth="1.8"
          fill="#0b0d11"
        />

        {/* Zygomatic Arch (Cheekbones) */}
        <path d="M 58 95 L 68 112 L 80 118" stroke="#2dd4bf" strokeWidth="1.8" />
        <path d="M 142 95 L 132 112 L 120 118" stroke="#2dd4bf" strokeWidth="1.8" />

        {/* Maxilla & Dental Matrix (Teeth) */}
        <rect
          x="85"
          y="132"
          width="30"
          height="18"
          rx="3"
          stroke="#2dd4bf"
          strokeWidth="1.8"
        />
        <line x1="100" y1="132" x2="100" y2="150" stroke="#2dd4bf" strokeWidth="1.2" />
        <line x1="92" y1="132" x2="92" y2="150" stroke="#2dd4bf" strokeWidth="1.2" />
        <line x1="108" y1="132" x2="108" y2="150" stroke="#2dd4bf" strokeWidth="1.2" />
        <line x1="85" y1="141" x2="115" y2="141" stroke="#2dd4bf" strokeWidth="1.2" />

        {/* Mandible (Jawbone) */}
        <path
          d="M 75 145 L 82 170 L 118 170 L 125 145"
          stroke="#2dd4bf"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Cervical Spine (Vertebrae Column) */}
        <rect
          x="94"
          y="176"
          width="12"
          height="6"
          rx="2"
          stroke="#2dd4bf"
          strokeWidth="1.6"
          fill="#13161c"
        />
        <rect
          x="93"
          y="185"
          width="14"
          height="6"
          rx="2"
          stroke="#2dd4bf"
          strokeWidth="1.6"
          fill="#13161c"
        />
        <rect
          x="92"
          y="194"
          width="16"
          height="7"
          rx="2"
          stroke="#2dd4bf"
          strokeWidth="1.6"
          fill="#13161c"
        />
        <rect
          x="90"
          y="204"
          width="20"
          height="7"
          rx="2"
          stroke="#2dd4bf"
          strokeWidth="1.6"
          fill="#13161c"
        />

        {/* Clavicles (Collarbones) */}
        <path
          d="M 38 206 Q 70 194 90 205"
          stroke="#2dd4bf"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M 162 206 Q 130 194 110 205"
          stroke="#2dd4bf"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Ribcage Arches (Bones) */}
        <path
          d="M 44 220 Q 70 210 90 215"
          stroke="#2dd4bf"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 156 220 Q 130 210 110 215"
          stroke="#2dd4bf"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 40 234 Q 70 224 90 229"
          stroke="#2dd4bf"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 160 234 Q 130 224 110 229"
          stroke="#2dd4bf"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>

      <div className="flex items-center gap-2 mt-1">
        <Scan className="w-3.5 h-3.5 text-accent animate-spin" />
        <span className="font-mono text-[11px] font-bold tracking-widest text-accent uppercase">
          X-RAY BONE SKELETON SCAN ACTIVE
        </span>
      </div>
    </div>
  );
}

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
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl border border-accent/40 bg-surface/90 p-6 overflow-hidden cyber-grid backdrop-blur-md shadow-2xl">
      {/* Laser Scanning Beam with High-Intensity MRI Glow */}
      <div className="pointer-events-none absolute inset-x-0 z-30 animate-laser">
        {/* Intense Laser Line */}
        <div className="h-[2.5px] w-full bg-gradient-to-r from-transparent via-accent to-transparent laser-glow" />
        {/* Soft Trailing Glow Flare */}
        <div className="h-20 w-full bg-gradient-to-t from-accent/25 via-accent/5 to-transparent -translate-y-full blur-xs" />
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

      {/* Center Showcase: Sci-Fi Bone Skeleton MRI Scanner */}
      <div className="mb-8 rounded-xl bg-surface-subtle/80 border border-accent/30 shadow-inner">
        <XRayBoneSkull />
      </div>

      {/* Vivid Skeleton UI Wireframe Placeholders */}
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
          {[...Array(2)].map((_, i) => (
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
          Biometric MRI Deployment Scan Active
        </span>
      </div>
    </div>
  );
}

export default LaserSkeleton;
