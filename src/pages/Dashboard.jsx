import { useState, useContext } from "react";
import { CompanyContext } from "../context/CompanyContext";
import { DSAContext } from "../context/DSAContext";
import { InterviewContext } from "../context/InterviewContext";
import { ProjectContext } from "../context/ProjectContext";

function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [goalText, setGoalText] = useState("");

  const { companies } = useContext(CompanyContext);
  const { dsaTopics } = useContext(DSAContext);
  const { interviewEntries } = useContext(InterviewContext);
  const { projects } = useContext(ProjectContext);

  function handleAddGoal(e) {
    e.preventDefault();

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
        goal.id === goalId
          ? { ...goal, completed: !goal.completed }
          : goal
      )
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Application Summary</h2>
      <p>Total Applications: {companies.length}</p>
      <p>Total DSA Topics: {dsaTopics.length}</p>
      <p>Total Interview Entries: {interviewEntries.length}</p>
      <p>Total Projects: {projects.length}</p>

      <h2>Daily Goals</h2>

      <form onSubmit={handleAddGoal}>
        <input
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          placeholder="New goal"
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