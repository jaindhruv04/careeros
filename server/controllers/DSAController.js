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
        solvedDate: status === "Solved" ? new Date() : null,
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

  // Prisma 7 skips undefined fields, while the user-scoped reads and updates preserve ownership.
  try {
    const problem = await prisma.$transaction(async (tx) => {
      const current = await tx.dSAProblem.findFirst({
        where: { id, userId: req.userId },
        select: { status: true, solvedDate: true },
      });

      if (!current) {
        return null;
      }

      let solvedDate = current.solvedDate;
      if (status !== undefined) {
        if (status === "Solved" && current.status !== "Solved") {
          solvedDate = new Date();
        } else if (status !== "Solved") {
          solvedDate = null;
        }
      }

      const result = await tx.dSAProblem.updateMany({
        where: { id, userId: req.userId },
        data: {
          name,
          topic,
          difficulty,
          status,
          solvedDate,
          priority,
          revisionNeeded,
          notes,
          archived,
        },
      });

      if (result.count === 0) {
        return null;
      }

      return tx.dSAProblem.findFirst({ where: { id, userId: req.userId } });
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

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
