import { useState } from "react";

function DSATracker() {
  const [dsaTopics, setDsaTopics] = useState([]);

  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [status, setStatus] = useState("Not Started");
  const [revisionNeeded, setRevisionNeeded] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const newDsaTopic = {
      id: Date.now(),
      name,
      topic,
      difficulty,
      status,
      revisionNeeded,
    };

    setDsaTopics([...dsaTopics, newDsaTopic]);

    setName("");
    setTopic("");
    setDifficulty("Easy");
    setStatus("Not Started");
    setRevisionNeeded(false);
  }

  return (
    <div>
      <h1>DSA Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="DSA Topic"
        />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic"
        />
        <input
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          placeholder="Difficulty"
        />
        <input
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Status"
        />
        <label>
          <input
            type="checkbox"
            checked={revisionNeeded}
            onChange={(e) => setRevisionNeeded(e.target.checked)}
          />
          Needs Revision
        </label>
        <button type="submit">Add DSA Topic</button>
      </form>

      <ul>
        {dsaTopics.map((problem) => (
          <li key={problem.id}>
            {problem.name} — {problem.topic} — {problem.difficulty} —{" "}
            {problem.status} — {problem.revisionNeeded ? "Yes" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DSATracker;
