import { prisma } from "../lib/prisma.js";

function getCompanyId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function createCompany(req, res) {
  try {
    const {
      name,
      role,
      status,
      applicationDate,
      priority,
      notes,
      archived,
    } = req.body;

    const company = await prisma.company.create({
      data: {
        name,
        role,
        status,
        applicationDate,
        priority,
        notes,
        archived,
        userId: req.userId,
      },
    });

    return res.status(201).json({ message: "Company added", company });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function getAllCompanies(req, res) {
  try {
    const companies = await prisma.company.findMany({
      where: { userId: req.userId },
    });

    return res.json(companies);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function getCompany(req, res) {
  const id = getCompanyId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  try {
    const company = await prisma.company.findFirst({
      where: { id, userId: req.userId },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.json(company);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function updateCompany(req, res) {
  const id = getCompanyId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  const {
    name,
    role,
    status,
    applicationDate,
    priority,
    notes,
    archived,
  } = req.body;

  try {
    const existingCompany = await prisma.company.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        name,
        role,
        status,
        applicationDate,
        priority,
        notes,
        archived,
      },
    });

    return res.status(200).json(company);
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function deleteCompany(req, res) {
  const id = getCompanyId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  try {
    const deletedCompany = await prisma.company.deleteMany({
      where: { id, userId: req.userId },
    });

    if (deletedCompany.count === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(200).json({ message: "Company deleted" });
  } catch {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};
