import express from "express";
import prisma from "./lib/prisma.js";
import authRouter from "./routes/auth.js";
import { protect } from "./middleware/auth.js";

const app = express();
const PORT = 5000;
app.use(express.json());

app.use("/api/auth", authRouter);

app.post("/api/companies", protect, async (req, res) => {
  try {
    const { name, status, priority } = req.body;
    const validStatuses = ["Applied", "Interview", "Offer", "Rejected"];
    const validPriorities = ["High", "Medium", "Low"];

    if (!name || !status || !priority) {
      return res
        .status(400)
        .json({ error: "name, status, and priority are required" });
    }

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: "Invalid priority value" });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const company = await prisma.company.create({
      data: {
        name,
        status,
        priority,
        userId: req.userId,
      },
    });

    res.status(201).json({
      message: "Company created",
      company,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/companies", protect, async (req, res) => {
  try {
    const { status } = req.query;
    const companies = await prisma.company.findMany({
      where: status ? { status, userId: req.userId } : { userId: req.userId },
    });
    res.status(200).json({ count: companies.length, companies });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/companies/:id", protect, async (req, res) => {
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

app.patch("/api/companies/:id", protect, async (req, res) => {
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

app.delete("/api/companies/:id", protect, async (req, res) => {
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
