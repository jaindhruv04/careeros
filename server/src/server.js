import express from "express";

const app = express();
const PORT = 5000;

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "CareerOS API is running",
  });
});

app.listen(PORT, () => {
  console.log(`CareerOS API is running on http://localhost:${PORT}`);
});