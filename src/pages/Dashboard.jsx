import { useState, useContext } from "react";
import {
  Building2,
  Code2,
  MessagesSquare,
  FolderGit2,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Target,
  Clock,
  AlertCircle,
  Award,
} from "lucide-react";
import { CompanyContext } from "../context/CompanyContext";
import { DSAContext } from "../context/DSAContext";
import { InterviewContext } from "../context/InterviewContext";
import { ProjectContext } from "../context/ProjectContext";
import {
  getOverallStats,
  getHighPriorityItems,
  getProgressStats,
  getRecentActivity,
  getQuickInsights,
} from "../utils/dashboardUtils";
import ModuleHeader from "../components/ModuleHeader";
import PriorityBadge from "../components/PriorityBadge";
import LaserSkeleton from "../components/LaserSkeleton";

function StatTile({ icon: Icon, label, value, subtext, gradient, glow }) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-surface border border-border p-5 transition-all duration-200 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-wider text-text-muted font-medium">
          {label}
        </p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr ${gradient} ${glow} shadow-sm`}
        >
          <Icon className="h-4 w-4 text-bg" />
        </div>
      </div>
      <div className="mt-4">
        <p className="font-mono text-3xl font-bold tracking-tight text-text-primary">
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-text-muted mt-1 font-mono">{subtext}</p>
        )}
      </div>
    </div>
  );
}

function ProgressRow({ label, percent, count, color = "bg-accent" }) {
  return (
    <div className="group space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-medium text-text-primary">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">{count}</span>
          <span className="font-bold text-accent px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20">
            {percent}%
          </span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border/60 p-[1px]">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

function Dashboard() {
  const [goals, setGoals] = useState([
    { id: 1, text: "Solve 2 LeetCode Mediums", completed: false },
    { id: 2, text: "Follow up with recruiter for SWE role", completed: true },
  ]);
  const [goalText, setGoalText] = useState("");

  const { companies, loading: compLoading } = useContext(CompanyContext);
  const { dsaTopics, loading: dsaLoading } = useContext(DSAContext);
  const { interviewEntries, loading: intLoading } = useContext(InterviewContext);
  const { projects, loading: projLoading } = useContext(ProjectContext);

  const isLoading = compLoading || dsaLoading || intLoading || projLoading;

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <ModuleHeader
          label="Dashboard"
          description="Connecting to backend deployment and compiling workspace telemetry..."
        />
        <LaserSkeleton
          type="dashboard"
          message="SCANNING_CLUSTER_TELEMETRY..."
        />
      </div>
    );
  }

  const stats = getOverallStats(companies, dsaTopics, interviewEntries, projects);
  const highPriority = getHighPriorityItems(companies, dsaTopics, interviewEntries, projects);
  const progress = getProgressStats(companies, dsaTopics, interviewEntries, projects);
  const recent = getRecentActivity(companies, dsaTopics, interviewEntries, projects);
  const insights = getQuickInsights(companies, dsaTopics, interviewEntries, projects);

  function handleAddGoal(e) {
    e.preventDefault();
    if (!goalText.trim()) return;
    setGoals([
      ...goals,
      { id: Date.now(), text: goalText.trim(), completed: false },
    ]);
    setGoalText("");
  }

  function toggleGoal(goalId) {
    setGoals(
      goals.map((g) => (g.id === goalId ? { ...g, completed: !g.completed } : g))
    );
  }

  function deleteGoal(goalId) {
    setGoals(goals.filter((g) => g.id !== goalId));
  }

  const allHighPriority = [
    ...highPriority.companies.map((c) => ({ ...c, kind: "Company" })),
    ...highPriority.dsaTopics.map((d) => ({ ...d, kind: "DSA" })),
    ...highPriority.interviews.map((i) => ({ ...i, kind: "Interview", name: i.company })),
    ...highPriority.projects.map((p) => ({ ...p, kind: "Project" })),
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <ModuleHeader
        label="Dashboard"
        description="Comprehensive overview of your placement preparation and applications."
      />

      {/* Top Bento Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          icon={Building2}
          label="Companies"
          value={stats.totalCompanies}
          subtext="Applications tracked"
          gradient="from-blue-400 to-indigo-500"
          glow="shadow-blue-500/20"
        />
        <StatTile
          icon={Code2}
          label="DSA Problems"
          value={stats.totalDSA}
          subtext={`${progress.solvedProblems} solved`}
          gradient="from-emerald-400 to-teal-500"
          glow="shadow-emerald-500/20"
        />
        <StatTile
          icon={MessagesSquare}
          label="Interviews"
          value={stats.totalInterviews}
          subtext="Rounds logged"
          gradient="from-amber-400 to-orange-500"
          glow="shadow-amber-500/20"
        />
        <StatTile
          icon={FolderGit2}
          label="Projects"
          value={stats.totalProjects}
          subtext={`${progress.completedProjects} completed`}
          gradient="from-purple-400 to-pink-500"
          glow="shadow-purple-500/20"
        />
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Focus & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Focus */}
          <div className="rounded-xl bg-surface border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                <h2 className="font-semibold text-text-primary text-sm tracking-wide">
                  High Priority Focus
                </h2>
              </div>
              <span className="font-mono text-xs text-text-muted">
                {allHighPriority.length} pending
              </span>
            </div>

            {allHighPriority.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border/80 rounded-lg bg-surface-subtle/50">
                <Sparkles className="w-8 h-8 text-accent/60 mb-2" />
                <p className="text-sm font-medium text-text-primary">
                  All clear for today!
                </p>
                <p className="text-xs text-text-muted mt-1">
                  No urgent high-priority items require your immediate attention.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {allHighPriority.map((item) => (
                  <div
                    key={`${item.kind}-${item.id}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-subtle border border-border/70 hover:border-accent/40 transition-colors"
                  >
                    <div className="min-w-0 flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-white/5 text-text-muted border border-border">
                        {item.kind}
                      </span>
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.name}
                      </p>
                    </div>
                    <PriorityBadge priority={item.priority} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Analytics */}
          <div className="rounded-xl bg-surface border border-border p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-accent" />
                <h2 className="font-semibold text-text-primary text-sm tracking-wide">
                  Conversion & Completion Rates
                </h2>
              </div>
            </div>

            <div className="space-y-5">
              <ProgressRow
                label="Offer Conversion Rate"
                percent={progress.companySuccessRate}
                count={`${progress.totalOffers} total offers`}
                color="bg-emerald-400"
              />
              <ProgressRow
                label="DSA Problem Solved Rate"
                percent={progress.dsaSolvedRate}
                count={`${progress.solvedProblems} solved`}
                color="bg-accent"
              />
              <ProgressRow
                label="Project Completion Rate"
                percent={progress.projectCompletionRate}
                count={`${progress.completedProjects} done`}
                color="bg-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Quick Insights & Goals */}
        <div className="space-y-6">
          {/* Quick Insights */}
          <div className="rounded-xl bg-surface border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-accent" />
              <h2 className="font-semibold text-text-primary text-sm tracking-wide">
                Quick Insights
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-surface-subtle border border-border/60">
                <p className="text-[11px] font-mono text-text-muted uppercase">Urgent</p>
                <p className="text-lg font-mono font-bold text-rose-400 mt-0.5">
                  {insights.highPriorityItems}
                </p>
                <p className="text-[10px] text-text-muted">High priority</p>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border/60">
                <p className="text-[11px] font-mono text-text-muted uppercase">Revision</p>
                <p className="text-lg font-mono font-bold text-amber-400 mt-0.5">
                  {insights.revisionProblems}
                </p>
                <p className="text-[10px] text-text-muted">DSA questions</p>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border/60">
                <p className="text-[11px] font-mono text-text-muted uppercase">Offers</p>
                <p className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                  {insights.offers}
                </p>
                <p className="text-[10px] text-text-muted">Received</p>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-border/60">
                <p className="text-[11px] font-mono text-text-muted uppercase">On Hold</p>
                <p className="text-lg font-mono font-bold text-text-muted mt-0.5">
                  {insights.onHoldProjects}
                </p>
                <p className="text-[10px] text-text-muted">Projects</p>
              </div>
            </div>
          </div>

          {/* Daily Goals Checklist */}
          <div className="rounded-xl bg-surface border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <h2 className="font-semibold text-text-primary text-sm tracking-wide">
                  Daily Goals
                </h2>
              </div>
              <span className="font-mono text-xs text-text-muted">
                {goals.filter((g) => g.completed).length}/{goals.length} done
              </span>
            </div>

            <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
              <input
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="What is your focus today?"
                className="w-full min-w-0 bg-surface-subtle border border-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="shrink-0 flex items-center justify-center p-2 rounded-lg bg-accent text-bg hover:opacity-90 transition-opacity"
                title="Add goal"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2">
              {goals.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">
                  No goals added yet. Add one above!
                </p>
              ) : (
                goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="group flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-surface-subtle transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className="flex items-center gap-2.5 min-w-0 text-left flex-1"
                    >
                      {goal.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-text-muted shrink-0 group-hover:text-accent transition-colors" />
                      )}
                      <span
                        className={`text-xs break-words leading-relaxed ${
                          goal.completed
                            ? "text-text-muted line-through"
                            : "text-text-primary"
                        }`}
                      >
                        {goal.text}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteGoal(goal.id)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-rose-400 p-1 transition-opacity"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline Feed */}
      <div className="rounded-xl bg-surface border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-accent" />
          <h2 className="font-semibold text-text-primary text-sm tracking-wide">
            Recent Activity Log
          </h2>
        </div>

        {recent.length === 0 ? (
          <p className="text-xs text-text-muted py-4">No recent activities recorded yet.</p>
        ) : (
          <div className="divide-y divide-border/50">
            {recent.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                    {item.type}
                  </span>
                  <p className="text-sm text-text-primary truncate font-medium">
                    {item.title}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs text-text-muted">
                  {item.dateAdded}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
