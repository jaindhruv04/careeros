import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/userRouter.js";
import dsaRouter from "./routes/DSARouter.js";
import companyRouter from "./routes/companyRouter.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  }),
);

app.use("/users", userRouter);
app.use("/dsa", dsaRouter);
app.use("/companies", companyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
