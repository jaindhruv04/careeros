import { useState, useContext } from "react";
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

function StatTile({ label, value }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <p className="text-xs text-text-muted font-mono uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-mono text-text-primary">{value}</p>
    </div>
  );
}

function ProgressRow({ label, percent, count }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-mono text-text-muted mb-1">
        <span>{label}</span>
        <span>{percent}% · {count}</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [goalText, setGoalText] = useState("");

  const { companies } = useContext(CompanyContext);
  const { dsaTopics } = useContext(DSAContext);
  const { interviewEntries } = useContext(InterviewContext);
  const { projects } = useContext(ProjectContext);

  const stats = getOverallStats(companies, dsaTopics, interviewEntries, projects);
  const highPriority = getHighPriorityItems(companies, dsaTopics, interviewEntries, projects);
  const progress = getProgressStats(companies, dsaTopics, interviewEntries, projects);
  const recent = getRecentActivity(companies, dsaTopics, interviewEntries, projects);
  const insights = getQuickInsights(companies, dsaTopics, interviewEntries, projects);

  function handleAddGoal(e) {
    e.preventDefault();
    if (goalText.trim() === "") return;

    setGoals([...goals, { id: Date.now(), text: goalText, completed: false }]);
    setGoalText("");
  }

  function toggleGoal(goalId) {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  }

  const allHighPriority = [
    ...highPriority.companies.map((c) => ({ ...c, kind: "Company" })),
    ...highPriority.dsaTopics.map((d) => ({ ...d, kind: "DSA" })),
    ...highPriority.interviews.map((i) => ({ ...i, kind: "Interview", name: i.company })),
    ...highPriority.projects.map((p) => ({ ...p, kind: "Project" })),
  ];

  return (
    <div className="max-w-4xl">
      <ModuleHeader label="Dashboard" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <StatTile label="Companies" value={stats.totalCompanies} />
        <StatTile label="DSA problems" value={stats.totalDSA} />
        <StatTile label="Interviews" value={stats.totalInterviews} />
        <StatTile label="Projects" value={stats.totalProjects} />
      </div>

      <h2 className="font-mono text-sm text-text-primary tracking-wide mb-3">Today's focus</h2>
      <div className="bg-surface border border-border rounded-lg p-4 mb-10">
        {allHighPriority.length === 0 ? (
          <p className="text-sm text-text-muted">No high priority items right now.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {allHighPriority.map((item) => (
              <li key={`${item.kind}-${item.id}`} className="flex items-center justify-between text-sm">
                <span className="text-text-primary">{item.name} <span className="text-text-muted">({item.kind})</span></span>
                <PriorityBadge priority={item.priority} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2 className="font-mono text-sm text-text-primary tracking-wide mb-3">Progress</h2>
      <div className="bg-surface border border-border rounded-lg p-4 mb-10">
        <ProgressRow label="Company success rate" percent={progress.companySuccessRate} count={`${progress.totalOffers} offers`} />
        <ProgressRow label="DSA solved rate" percent={progress.dsaSolvedRate} count={`${progress.solvedProblems} solved`} />
        <ProgressRow label="Project completion" percent={progress.projectCompletionRate} count={`${progress.completedProjects} done`} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div>
          <h2 className="font-mono text-sm text-text-primary tracking-wide mb-3">Recent activity</h2>
          <div className="bg-surface border border-border rounded-lg p-4">
            {recent.length === 0 ? (
              <p className="text-sm text-text-muted">Nothing logged yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {recent.map((item, index) => (
                  <li key={index} className="text-sm text-text-primary">
                    <span className="text-accent font-mono text-xs">[{item.type}]</span> {item.title}
                    <span className="text-text-muted"> · {item.dateAdded}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-mono text-sm text-text-primary tracking-wide mb-3">Quick insights</h2>
          <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-2 text-sm">
            <p className="text-text-primary">High priority items <span className="text-text-muted">— {insights.highPriorityItems}</span></p>
            <p className="text-text-primary">Needs revision <span className="text-text-muted">— {insights.revisionProblems}</span></p>
            <p className="text-text-primary">Offers received <span className="text-text-muted">— {insights.offers}</span></p>
            <p className="text-text-primary">Projects on hold <span className="text-text-muted">— {insights.onHoldProjects}</span></p>
          </div>
        </div>
      </div>

      <h2 className="font-mono text-sm text-text-primary tracking-wide mb-3">Daily goals</h2>
      <div className="bg-surface border border-border rounded-lg p-4">
        <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
          <input
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            placeholder="Add a goal"
            className="flex-1 bg-bg border border-border rounded px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          />
          <button type="submit" className="px-4 py-2 text-sm font-mono border border-border rounded text-text-primary hover:border-accent hover:text-accent transition-colors">
            Add
          </button>
        </form>

        <ul className="flex flex-col gap-2">
          {goals.map((goal) => (
            <li key={goal.id} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => toggleGoal(goal.id)}
                className="accent-accent"
              />
              <span className={goal.completed ? "text-text-muted line-through" : "text-text-primary"}>
                {goal.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
