import { prisma } from "../lib/prisma.js";

function getEntryId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function createEntry(req, res) {
  try {
    const {
      company,
      round,
      questionsAsked,
      myAnswer,
      mistakes,
      lessonsLearned,
      priority,
      notes,
      archived,
    } = req.body;

    const entry = await prisma.interviewEntry.create({
      data: {
        company,
        round,
        questionsAsked,
        myAnswer,
        mistakes,
        lessonsLearned,
        priority,
        notes,
        archived: archived ?? false,
        userId: req.userId,
      },
    });

    return res.status(201).json({ message: "Entry added", entry });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function getAllEntries(req, res) {
  try {
    const entries = await prisma.interviewEntry.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(entries);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function getEntry(req, res) {
  const id = getEntryId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid entry ID" });
  }

  try {
    const entry = await prisma.interviewEntry.findFirst({
      where: { id, userId: req.userId },
    });

    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    return res.json(entry);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function updateEntry(req, res) {
  const id = getEntryId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid entry ID" });
  }

  const {
    company,
    round,
    questionsAsked,
    myAnswer,
    mistakes,
    lessonsLearned,
    priority,
    notes,
    archived,
  } = req.body;

  try {
    const existing = await prisma.interviewEntry.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Entry not found" });
    }

    const entry = await prisma.interviewEntry.update({
      where: { id },
      data: {
        company,
        round,
        questionsAsked,
        myAnswer,
        mistakes,
        lessonsLearned,
        priority,
        notes,
        archived,
      },
    });

    return res.status(200).json(entry);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function deleteEntry(req, res) {
  const id = getEntryId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid entry ID" });
  }

  try {
    const deleted = await prisma.interviewEntry.deleteMany({
      where: { id, userId: req.userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Entry not found" });
    }

    return res.status(200).json({ message: "Entry deleted" });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export { createEntry, getAllEntries, getEntry, updateEntry, deleteEntry };
