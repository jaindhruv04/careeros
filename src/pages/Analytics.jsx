import { useState, useEffect } from "react";
import {
  BarChart3,
  Target,
  Sparkles,
  Lightbulb,
  Building2,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { apiFetch } from "../utils/api";
import ModuleHeader from "../components/ModuleHeader";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await apiFetch("/analytics");
        if (res.ok) {
          const analytics = await res.json();
          setData(analytics);
        }
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <ModuleHeader label="Analytics" description="Loading your performance telemetry..." />
        <div className="flex flex-col items-center justify-center py-24 text-text-muted">
          <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
          <p className="text-sm font-mono">Aggregating interview & problem stats...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <ModuleHeader label="Analytics" description="Performance telemetry and placement readiness" />
        <div className="rounded-xl bg-surface border border-dashed border-border p-8 text-center">
          <BarChart3 className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-60" />
          <p className="text-sm text-text-muted">No telemetry data available yet.</p>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    Easy: "from-emerald-500 to-teal-400 text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Medium: "from-amber-500 to-yellow-400 text-amber-400 bg-amber-500/10 border-amber-500/20",
    Hard: "from-rose-500 to-red-400 text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <ModuleHeader
        label="Analytics & Telemetry"
        description="Data-driven evaluation of your problem-solving frequency, stage conversions, and growth opportunities."
      />

      {/* Top 2 Cards: DSA & Applications High-Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DSA Performance Card */}
        <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Code2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">
                DSA Problem Telemetry
              </h2>
            </div>
            <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
              {data.dsa.solveRate}% Solved
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-mono font-bold text-text-primary">
                {data.dsa.solved}{" "}
                <span className="text-sm font-normal text-text-muted">
                  / {data.dsa.total} problems
                </span>
              </span>
            </div>
            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(data.dsa.solveRate, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-center">
            <div className="p-2 rounded-lg bg-surface-subtle border border-border/50">
              <p className="text-[10px] font-mono text-text-muted uppercase">In Progress</p>
              <p className="text-sm font-mono font-bold text-amber-400 mt-0.5">
                {data.dsa.inProgress}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-surface-subtle border border-border/50">
              <p className="text-[10px] font-mono text-text-muted uppercase">Need Revise</p>
              <p className="text-sm font-mono font-bold text-rose-400 mt-0.5">
                {data.dsa.needsRevision}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-surface-subtle border border-border/50">
              <p className="text-[10px] font-mono text-text-muted uppercase">Last 7 Days</p>
              <p className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                {data.dsa.solvedLast7Days}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-surface-subtle border border-border/50">
              <p className="text-[10px] font-mono text-text-muted uppercase">Velocity</p>
              <p className="text-sm font-mono font-bold text-text-primary mt-0.5">
                {data.dsa.avgPerDay30d}/day
              </p>
            </div>
          </div>
        </div>

        {/* Company Applications Card */}
        <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">
                Application Funnel
              </h2>
            </div>
            <span className="font-mono text-xs text-text-muted">
              {data.companies.total} total
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-lg bg-surface-subtle border border-border/60">
              <p className="text-[10px] font-mono text-text-muted uppercase">Applied</p>
              <p className="text-xl font-mono font-bold text-sky-400 mt-1">
                {data.companies.statusDistribution.Applied || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border/60">
              <p className="text-[10px] font-mono text-text-muted uppercase">Interviewing</p>
              <p className="text-xl font-mono font-bold text-amber-400 mt-1">
                {data.companies.statusDistribution.Interviewing || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-subtle border border-border/60">
              <p className="text-[10px] font-mono text-text-muted uppercase">Offers</p>
              <p className="text-xl font-mono font-bold text-emerald-400 mt-1">
                {data.companies.statusDistribution.Offer || 0}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border/60">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-text-muted">Interview Conversion</span>
                <span className="font-bold text-sky-400">
                  {data.companies.interviewConversion}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full"
                  style={{ width: `${Math.min(data.companies.interviewConversion, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-text-muted">Offer Conversion</span>
                <span className="font-bold text-emerald-400">
                  {data.companies.offerConversion}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${Math.min(data.companies.offerConversion, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown & Weak Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Solve Rate by Difficulty */}
        <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <h2 className="text-base font-semibold text-text-primary">
              Solve Rate by Difficulty
            </h2>
          </div>

          <div className="space-y-4">
            {Object.entries(data.dsa.solveRateByDifficulty).map(([diff, rate]) => (
              <div key={diff} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-medium text-text-primary">{diff}</span>
                  <span className="font-bold text-text-secondary">{rate}%</span>
                </div>
                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${
                      difficultyColors[diff] || "from-accent to-emerald-400"
                    }`}
                    style={{ width: `${Math.min(rate, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-text-primary">
              Focus Areas & Weak Topics
            </h2>
          </div>

          {data.dsa.weakTopics.length > 0 ? (
            <div className="space-y-2.5">
              {data.dsa.weakTopics.map((topic) => (
                <div
                  key={topic.topic}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-subtle border border-border/70"
                >
                  <span className="text-sm font-medium text-text-primary">
                    {topic.topic}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    {topic.rate}% solve rate
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border rounded-lg bg-surface-subtle/50">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-2" />
              <p className="text-sm font-medium text-text-primary">
                Strong proficiency across all logged topics!
              </p>
              <p className="text-xs text-text-muted mt-1">
                No topic currently falls below your target mastery threshold.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Insights & Recommendations */}
      {(data.insights.length > 0 || data.recommendations.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.insights.length > 0 && (
            <div className="rounded-xl bg-surface border border-border p-6 space-y-3">
              <div className="flex items-center gap-2 text-sky-400">
                <Sparkles className="w-4 h-4" />
                <h2 className="text-base font-semibold text-text-primary">
                  Pattern Insights
                </h2>
              </div>
              <ul className="space-y-2 text-sm">
                {data.insights.map((insight, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-text-secondary leading-relaxed p-2.5 rounded-lg bg-surface-subtle border border-border/50"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.recommendations.length > 0 && (
            <div className="rounded-xl bg-surface border border-accent/30 p-6 space-y-3 shadow-lg shadow-accent/5">
              <div className="flex items-center gap-2 text-accent">
                <Lightbulb className="w-4 h-4" />
                <h2 className="text-base font-semibold text-text-primary">
                  Strategic Recommendations
                </h2>
              </div>
              <ul className="space-y-2 text-sm">
                {data.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-text-secondary leading-relaxed p-2.5 rounded-lg bg-accent/5 border border-accent/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Analytics;
