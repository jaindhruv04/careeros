import { prisma } from "../lib/prisma.js";

function getProjectId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function createProject(req, res) {
  try {
    const { name, techStack, progress, status, priority, notes, archived } =
      req.body;

    const project = await prisma.project.create({
      data: {
        name,
        techStack,
        progress: progress ?? 0,
        status,
        priority,
        notes,
        archived: archived ?? false,
        userId: req.userId,
      },
    });

    return res.status(201).json({ message: "Project added", project });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function getAllProjects(req, res) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
    });

    return res.json(projects);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function getProject(req, res) {
  const id = getProjectId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  try {
    const project = await prisma.project.findFirst({
      where: { id, userId: req.userId },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.json(project);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function updateProject(req, res) {
  const id = getProjectId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  const { name, techStack, progress, status, priority, notes, archived } =
    req.body;

  try {
    const existing = await prisma.project.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = await prisma.project.update({
      where: { id },
      data: { name, techStack, progress, status, priority, notes, archived },
    });

    return res.status(200).json(project);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function deleteProject(req, res) {
  const id = getProjectId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid project ID" });
  }

  try {
    const deleted = await prisma.project.deleteMany({
      where: { id, userId: req.userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({ message: "Project deleted" });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export { createProject, getAllProjects, getProject, updateProject, deleteProject };
