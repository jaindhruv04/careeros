import { prisma } from "../lib/prisma.js";

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
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getAllProblems(req, res) {
  try {
    const problems = await prisma.dSAProblem.findMany({
      where: { userId: req.userId },
    });

    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getProblem(req, res) {
  const id = req.params.id;
  try {
    const problem = await prisma.dSAProblem.findUnique({
      where: { id: Number(id) },
    });

    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateProblem(req, res) {
  const id = Number(req.params.id);
  try {
    const problem = await prisma.dSAProblem.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteProblem(req, res) {
  const id = Number(req.params.id);
  try {
    let deletedProblem = await prisma.dSAProblem.delete({ where: { id } });
    res.status(200).send("Problem Deleted", deleteProblem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {
  createProblem,
  getAllProblems,
  getProblem,
  updateProblem,
  deleteProblem,
};
