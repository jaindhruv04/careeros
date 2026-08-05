import express from "express";
import prisma from "./lib/prisma.js";

const app = express();
app.use(express.json());
const PORT = 5000;

app.post("/api/companies", async (req, res) => {
  const { name, status, priority } = req.body;

  const company = await prisma.company.create({
    data: {
      name,
      status,
      priority,
    },
  });

  res.status(201).json({
    message: "Company created",
    company,
  });
});

app.get("/api/companies", async (req, res) => {
  const { status } = req.query;

  const companies = await prisma.company.findMany({
    where: status ? { status } : {},
  });

  res.status(200).json({
    count: companies.length,
    companies,
  });
});

app.get("/api/companies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const company = await prisma.company.findUnique({ where: { id } });

    if (company === null) {
      res.status(404).json({ error: "Company not found" });
    } else {
      res.status(200).json(company);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/companies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const company = await prisma.company.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json(company);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/companies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.company.delete({ where: { id } });
    res.status(200).json({ message: "Company deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`CareerOS API is running on http://localhost:${PORT}`);
});
