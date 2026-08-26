import { prisma } from "../lib/prisma.js";

function getProblemId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function createProblem(req, res) {
  try {
    const {
      name,
      topic,
      difficulty,
      status,
      priority,
      revisionNeeded,
      notes,
      archived,
    } = req.body;

    const problem = await prisma.dSAProblem.create({
      data: {
        name,
        topic,
        difficulty,
        status,
        priority,
        revisionNeeded,
        notes,
        archived,
        userId: req.userId,
      },
    });

    return res.status(201).json({ message: "Problem added", problem });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function getAllProblems(req, res) {
  try {
    const problems = await prisma.dSAProblem.findMany({
      where: { userId: req.userId },
    });

    return res.json(problems);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function getProblem(req, res) {
  const id = getProblemId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid problem ID" });
  }

  try {
    const problem = await prisma.dSAProblem.findFirst({
      where: { id, userId: req.userId },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    return res.json(problem);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function updateProblem(req, res) {
  const id = getProblemId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid problem ID" });
  }

  const {
    name,
    topic,
    difficulty,
    status,
    priority,
    revisionNeeded,
    notes,
    archived,
  } = req.body;

  try {
    const existingProblem = await prisma.dSAProblem.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingProblem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const problem = await prisma.dSAProblem.update({
      where: { id },
      data: {
        name,
        topic,
        difficulty,
        status,
        priority,
        revisionNeeded,
        notes,
        archived,
      },
    });

    return res.status(200).json(problem);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function deleteProblem(req, res) {
  const id = getProblemId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid problem ID" });
  }

  try {
    const deletedProblem = await prisma.dSAProblem.deleteMany({
      where: { id, userId: req.userId },
    });

    if (deletedProblem.count === 0) {
      return res.status(404).json({ error: "Problem not found" });
    }

    return res.status(200).json({ message: "Problem deleted" });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export {
  createProblem,
  getAllProblems,
  getProblem,
  updateProblem,
  deleteProblem,
};
