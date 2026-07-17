import { useState, useContext } from "react";
import { InterviewContext } from "../context/InterviewContext";
import { getDateAdded } from "../utils/dateUtils";
import ModuleHeader from "../components/ModuleHeader";
import PriorityBadge from "../components/PriorityBadge";

const inputClass = "bg-bg border border-border rounded px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";
const textareaClass = inputClass + " w-full min-h-[60px]";
const selectClass = inputClass;
const buttonClass = "px-4 py-2 text-sm font-mono border border-border rounded text-text-primary hover:border-accent hover:text-accent transition-colors";

function InterviewJournal() {
  const { interviewEntries, setInterviewEntries } = useContext(InterviewContext);

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
    const matchesSearch = entry.company.toLowerCase().includes(searchText.toLowerCase());
    const matchesRound = roundFilter === "All" || entry.round === roundFilter;
    const matchesPriority = priorityFilter === "All" || entry.priority === priorityFilter;
    return matchesSearch && matchesRound && matchesPriority;
  });

  return (
    <div className="max-w-4xl">
      <ModuleHeader label="Interview Journal" />

      <div className="bg-surface border border-border rounded-lg p-4 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <input className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" />
            <select className={selectClass} value={round} onChange={(e) => setRound(e.target.value)}>
              <option value="">Select round</option>
              <option value="Online Assessment">Online assessment</option>
              <option value="Technical">Technical</option>
              <option value="Managerial">Managerial</option>
              <option value="HR">HR</option>
            </select>
            <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <textarea className={textareaClass} value={questionsAsked} onChange={(e) => setQuestionsAsked(e.target.value)} placeholder="Questions asked" />
          <textarea className={textareaClass} value={myAnswer} onChange={(e) => setMyAnswer(e.target.value)} placeholder="My answer" />
          <textarea className={textareaClass} value={mistakes} onChange={(e) => setMistakes(e.target.value)} placeholder="Mistakes" />
          <textarea className={textareaClass} value={lessonsLearned} onChange={(e) => setLessonsLearned(e.target.value)} placeholder="Lessons learned" />
          <textarea className={textareaClass} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" />
          <button type="submit" className={buttonClass + " self-start"}>Add entry</button>
        </form>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input className={inputClass} value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search by company" />
        <select className={selectClass} value={roundFilter} onChange={(e) => setRoundFilter(e.target.value)}>
          <option value="All">All rounds</option>
          <option value="Online Assessment">Online assessment</option>
          <option value="Technical">Technical</option>
          <option value="Managerial">Managerial</option>
          <option value="HR">HR</option>
        </select>
        <select className={selectClass} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <ul className="flex flex-col gap-3">
        {filteredEntries.map((entry) => (
          <li key={entry.id} className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-text-primary font-medium">{entry.company} <span className="text-text-muted font-normal">— {entry.round}</span></p>
              <PriorityBadge priority={entry.priority} />
            </div>
            <p className="text-sm text-text-muted mb-1">Added: {entry.dateAdded}</p>
            <p className="text-sm text-text-muted mb-1"><span className="text-text-primary">Questions:</span> {entry.questionsAsked}</p>
            <p className="text-sm text-text-muted mb-1"><span className="text-text-primary">My answer:</span> {entry.myAnswer}</p>
            <p className="text-sm text-text-muted mb-1"><span className="text-text-primary">Mistakes:</span> {entry.mistakes}</p>
            <p className="text-sm text-text-muted mb-1"><span className="text-text-primary">Lessons learned:</span> {entry.lessonsLearned}</p>
            {entry.notes?.trim() !== "" && (
              <p className="text-sm text-text-muted">Notes: {entry.notes}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InterviewJournal;