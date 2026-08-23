import { prisma } from "../lib/prisma.js";

async function registerUser(req, res) {
  try {
    const { email, name, password } = req.body;
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
    return res.status(201).json({ message: "User Created Successfully", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
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

export { registerUser, getAllUsers };
