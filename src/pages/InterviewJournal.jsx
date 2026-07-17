import { useState, useContext } from "react";
import { InterviewContext } from "../context/InterviewContext";
import { getDateAdded } from "../utils/dateUtils";

function InterviewJournal() {
  const { interviewEntries, setInterviewEntries } =
    useContext(InterviewContext);

  const [company, setCompany] = useState("");
  const [round, setRound] = useState("");
  const [questionsAsked, setQuestionsAsked] = useState("");
  const [myAnswer, setMyAnswer] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [searchText, setSearchText] = useState("");
  const [roundFilter, setRoundFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  function handleSubmit(e) {
    e.preventDefault();

    const interviewEntry = {
      id: Date.now(),
      company,
      round,
      questionsAsked,
      myAnswer,
      mistakes,
      lessonsLearned,
      priority,
      dateAdded: getDateAdded(),
      notes,
    };

    setInterviewEntries([...interviewEntries, interviewEntry]);

    setCompany("");
    setRound("");
    setQuestionsAsked("");
    setMyAnswer("");
    setMistakes("");
    setLessonsLearned("");
    setPriority("Medium");
    setNotes("");
  }

  const filteredEntries = interviewEntries.filter((entry) => {
    const matchesSearch = entry.company
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesRound =
      roundFilter === "All" || entry.round === roundFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      entry.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesRound &&
      matchesPriority
    );
  });

  return (
    <div>
      <h1>Interview Journal</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
        />

        <select
          value={round}
          onChange={(e) => setRound(e.target.value)}
        >
          <option value="">Select Round</option>
          <option value="Online Assessment">
            Online Assessment
          </option>
          <option value="Technical">Technical</option>
          <option value="Managerial">Managerial</option>
          <option value="HR">HR</option>
        </select>

        <textarea
          value={questionsAsked}
          onChange={(e) => setQuestionsAsked(e.target.value)}
          placeholder="Questions Asked"
        />

        <textarea
          value={myAnswer}
          onChange={(e) => setMyAnswer(e.target.value)}
          placeholder="My Answer"
        />

        <textarea
          value={mistakes}
          onChange={(e) => setMistakes(e.target.value)}
          placeholder="Mistakes"
        />

        <textarea
          value={lessonsLearned}
          onChange={(e) => setLessonsLearned(e.target.value)}
          placeholder="Lessons Learned"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />

        <button type="submit">
          Add Entry
        </button>
      </form>

      <hr />

      <h2>Search & Filter</h2>

      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search by company"
      />

      <select
        value={roundFilter}
        onChange={(e) => setRoundFilter(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Online Assessment">
          Online Assessment
        </option>
        <option value="Technical">Technical</option>
        <option value="Managerial">Managerial</option>
        <option value="HR">HR</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
      >
        <option value="All">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <ul>
        {filteredEntries.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.company}</strong> - {entry.round}

            <div>
              <strong>Priority:</strong> {entry.priority}
            </div>

            <div>
              <strong>Date Added:</strong> {entry.dateAdded}
            </div>

            <div>
              <strong>Questions:</strong> {entry.questionsAsked}
            </div>

            <div>
              <strong>My Answer:</strong> {entry.myAnswer}
            </div>

            <div>
              <strong>Mistakes:</strong> {entry.mistakes}
            </div>

            <div>
              <strong>Lessons Learned:</strong> {entry.lessonsLearned}
            </div>

            {entry.notes?.trim() !== "" && (
              <div>
                <strong>Notes:</strong> {entry.notes}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InterviewJournal;