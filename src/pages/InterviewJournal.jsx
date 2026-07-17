import { useState } from "react";

function InterviewJournal() {
  const [interviewEntries, setInterviewEntries] = useState([]);

  const [company, setCompany] = useState("");
  const [round, setRound] = useState("");
  const [questionsAsked, setQuestionsAsked] = useState("");
  const [myAnswer, setMyAnswer] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");

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

  return (
    <div>
      <h1>Interview Journal</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
        />

        <input
          value={round}
          onChange={(e) => setRound(e.target.value)}
          placeholder="Round"
        />

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

      <ul>
        {interviewEntries.map((entry) => (
          <li key={entry.id}>
            {entry.company} - {entry.round} - {entry.questionsAsked} -{" "}
            {entry.myAnswer} - {entry.mistakes} - {entry.lessonsLearned}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InterviewJournal;