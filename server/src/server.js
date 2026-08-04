import express from "express";
import prisma from "./lib/prisma.js";

const app = express();
app.use(express.json());

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


const PORT = 5000;


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




app.listen(PORT, () => {
  console.log(`CareerOS API is running on http://localhost:${PORT}`);
});