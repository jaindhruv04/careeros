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

function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [goalText, setGoalText] = useState("");

  const { companies } = useContext(CompanyContext);
  const { dsaTopics } = useContext(DSAContext);
  const { interviewEntries } = useContext(InterviewContext);
  const { projects } = useContext(ProjectContext);

  const stats = getOverallStats(
    companies,
    dsaTopics,
    interviewEntries,
    projects,
  );

  const highPriority = getHighPriorityItems(
    companies,
    dsaTopics,
    interviewEntries,
    projects,
  );

  const progress = getProgressStats(
    companies,
    dsaTopics,
    interviewEntries,
    projects,
  );

  const recent = getRecentActivity(
    companies,
    dsaTopics,
    interviewEntries,
    projects,
  );

  const insights = getQuickInsights(
    companies,
    dsaTopics,
    interviewEntries,
    projects,
  );

  function handleAddGoal(e) {
    e.preventDefault();

    if (goalText.trim() === "") return;

    const newGoal = {
      id: Date.now(),
      text: goalText,
      completed: false,
    };

    setGoals([...goals, newGoal]);
    setGoalText("");
  }

  function toggleGoal(goalId) {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal,
      ),
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <hr />

      <h2>Overall Statistics</h2>

      <p>Total Companies: {stats.totalCompanies}</p>
      <p>Total DSA Problems: {stats.totalDSA}</p>
      <p>Total Interview Entries: {stats.totalInterviews}</p>
      <p>Total Projects: {stats.totalProjects}</p>

      <hr />

      <h2>Today's Focus (High Priority)</h2>

      <h3>Companies</h3>
      <ul>
        {highPriority.companies.length === 0 ? (
          <li>No High Priority Companies</li>
        ) : (
          highPriority.companies.map((company) => (
            <li key={company.id}>
              {company.name} ({company.status})
            </li>
          ))
        )}
      </ul>

      <h3>DSA</h3>

      <ul>
        {highPriority.dsaTopics.length === 0 ? (
          <li>No High Priority Problems</li>
        ) : (
          highPriority.dsaTopics.map((problem) => (
            <li key={problem.id}>
              {problem.name} ({problem.status})
            </li>
          ))
        )}
      </ul>

      <h3>Interviews</h3>

      <ul>
        {highPriority.interviews.length === 0 ? (
          <li>No High Priority Interviews</li>
        ) : (
          highPriority.interviews.map((entry) => (
            <li key={entry.id}>
              {entry.company} ({entry.round})
            </li>
          ))
        )}
      </ul>

      <h3>Projects</h3>

      <ul>
        {highPriority.projects.length === 0 ? (
          <li>No High Priority Projects</li>
        ) : (
          highPriority.projects.map((project) => (
            <li key={project.id}>
              {project.name} ({project.status})
            </li>
          ))
        )}
      </ul>

      <hr />

      <h2>Progress</h2>

      <p>Company Success Rate: {progress.companySuccessRate}%</p>
      <p>DSA Solved: {progress.dsaSolvedRate}%</p>
      <p>Project Completion: {progress.projectCompletionRate}%</p>
      <p>Total Offers: {progress.totalOffers}</p>
      <p>Solved Problems: {progress.solvedProblems}</p>
      <p>Completed Projects: {progress.completedProjects}</p>
      <p>Total Interviews: {progress.totalInterviews}</p>

      <hr />

      <h2>Recent Activity</h2>

      <ul>
        {recent.length === 0 ? (
          <li>No Recent Activity</li>
        ) : (
          recent.map((item, index) => (
            <li key={index}>
              [{item.type}] {item.title} - {item.dateAdded}
            </li>
          ))
        )}
      </ul>

      <hr />

      <h2>Quick Insights</h2>

      <p>High Priority Items: {insights.highPriorityItems}</p>
      <p>Problems Needing Revision: {insights.revisionProblems}</p>
      <p>Offers Received: {insights.offers}</p>
      <p>Projects On Hold: {insights.onHoldProjects}</p>

      <hr />

      <h2>Daily Goals</h2>

      <form onSubmit={handleAddGoal}>
        <input
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          placeholder="New Goal"
        />

        <button type="submit">Add Goal</button>
      </form>

      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => toggleGoal(goal.id)}
            />

            {goal.completed ? <s>{goal.text}</s> : goal.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
