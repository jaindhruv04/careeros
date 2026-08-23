import express from "express";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use(express.json());

app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
