import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRouter from "./routes/userRouter.js";
import dsaRouter from "./routes/DSARouter.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/users", userRouter);
app.use("/dsa", dsaRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
