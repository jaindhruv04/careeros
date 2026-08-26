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

    return res.status(201).json({
      message: "User Created Successfully",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const checkUser = await prisma.user.findUnique({ where: { email } });

    if (!checkUser) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    if (await bcrypt.compare(password, checkUser.password)) {
      const token = jwt.sign({ userId: checkUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({ message: "Login successful", token });
    }

    return res.status(401).json({ error: "Invalid Email or Password" });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

function logoutUser(req, res) {
  return res.status(200).json({ message: "Logged out" });
}

async function getCurrentUser(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true },
    });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export { registerUser, getAllUsers, loginUser, logoutUser, getCurrentUser };
