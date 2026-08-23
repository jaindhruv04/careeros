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

export { createProblem };
