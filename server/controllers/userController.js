import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function registerUser(req, res) {
  try {
    const { email, name, password } = req.body;

    const checkUser = await prisma.user.findUnique({ where: { email } });

    if (checkUser) {
      return res.status(400).json({ error: "Account already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hash,
      },
    });

    return res.status(201).json({ message: "User Created Successfully", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const checkUser = await prisma.user.findUnique({ where: { email } });

    if (!checkUser) {
      return res.status(401).send("Invalid Email or Password");
    }

    if (await bcrypt.compare(password, checkUser.password)) {
      const token = jwt.sign({ userId: checkUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({ message: "Login successful", token });
    } else {
      return res.status(401).send("Invalid Email or Password");
    }
  } catch (error) {
    return res.status(401).send("Something Went Wrong");
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export { registerUser, getAllUsers, loginUser };
