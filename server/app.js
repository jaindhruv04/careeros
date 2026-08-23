import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/userRouter.js";
import dsaRouter from "./routes/DSARouter.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/users", userRouter);
app.use("/dsa", dsaRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
