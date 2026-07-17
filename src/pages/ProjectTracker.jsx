import { useState, useContext } from "react";
import { InterviewContext } from "../context/InterviewContext";

function InterviewJournal() {
  const { interviewEntries, setInterviewEntries } =
    useContext(InterviewContext);

  const [company, setCompany] = useState("");
  const [round, setRound] = useState("");
  const [questionsAsked, setQuestionsAsked] = useState("");
  const [myAnswer, setMyAnswer] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");

  const [searchText, setSearchText] = useState("");
  const [roundFilter, setRoundFilter] = useState("All");

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
    };

    setInterviewEntries([...interviewEntries, interviewEntry]);

    setCompany("");
    setRound("");
    setQuestionsAsked("");
    setMyAnswer("");
    setMistakes("");
    setLessonsLearned("");
  }

  const filteredEntries = interviewEntries.filter((entry) => {
    const matchesSearch = entry.company
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesRound =
      roundFilter === "All" || entry.round === roundFilter;

    return matchesSearch && matchesRound;
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
          <option value="Online Assessment">Online Assessment</option>
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

        <button type="submit">Add Entry</button>
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
        <option value="Online Assessment">Online Assessment</option>
        <option value="Technical">Technical</option>
        <option value="Managerial">Managerial</option>
        <option value="HR">HR</option>
      </select>

      <ul>
        {filteredEntries.map((entry) => (
          <li key={entry.id}>
            {entry.company} - {entry.round} - {entry.questionsAsked} -{" "}
            {entry.myAnswer} - {entry.mistakes} -{" "}
            {entry.lessonsLearned}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InterviewJournal;