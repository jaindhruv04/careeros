import { prisma } from "../lib/prisma.js";

async function getMyCompanies(userId) {
  const companies = await prisma.company.findMany({
    where: {
      userId,
      archived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return companies;
}

async function getMyDsaProblems(userId) {
  const problems = await prisma.dSAProblem.findMany({
    where: {
      userId,
      archived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return problems;
}

async function createDsaProblem(userId, data) {
  const problem = await prisma.dSAProblem.create({
    data: {
      name: data.name,
      topic: data.topic,
      difficulty: data.difficulty,
      status: data.status,
      priority: data.priority,
      revisionNeeded: data.revisionNeeded ?? false,
      notes: data.notes ?? null,
      userId,
    },
  });

  return problem;
}

async function deleteDsaProblem(userId, problemId) {
  const problem = await prisma.dSAProblem.deleteMany({
    where: {
      id: problemId,
      userId,
    },
  });

  return problem;
}

export { getMyCompanies, getMyDsaProblems, createDsaProblem, deleteDsaProblem };
