import { useState, useContext } from "react";
import { DSAContext } from "../context/DSAContext";

function DSATracker() {
  const { dsaTopics, setDsaTopics } = useContext(DSAContext);

  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [status, setStatus] = useState("Not Started");
  const [revisionNeeded, setRevisionNeeded] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

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

  const filteredTopics = dsaTopics.filter((problem) => {
    const matchesSearch = problem.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === "All" ||
      problem.difficulty === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  });

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

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Solved">Solved</option>
        </select>

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

      <hr />

      <h2>Search & Filter</h2>

      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search by problem name"
      />

      <select
        value={difficultyFilter}
        onChange={(e) => setDifficultyFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <ul>
        {filteredTopics.map((problem) => (
          <li key={problem.id}>
            {problem.name} — {problem.topic} — {problem.difficulty} —{" "}
            {problem.status} —{" "}
            {problem.revisionNeeded ? "Yes" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DSATracker;