import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app: Express = express();
const prisma = new PrismaClient();

app.get("/", async (req: Request, res: Response) => {
  const allUsers = await prisma.users.findMany();
  res.json(allUsers);
});

app.get("/:id", async (req: Request, res: Response) => {
  const user = await prisma.users.findUnique({
    where: { id: req.params.id },
  });
  res.json(user);
});

app.post("/", async (req: Request, res: Response) => {
  const newUser = await prisma.users.create({
    data: req.body,
  });
  res.status(201).json(newUser);
});

app.put("/:id", async (req: Request, res: Response) => {
  const newPassword = req.body.password;
  const updatedUser = await prisma.users.update({
    where: { id: req.params.id },
    data: { password: newPassword },
  });
  res.json(updatedUser);
});

app.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedNote = await prisma.users.delete({
    where: { id: id },
  });
  res.json(deletedNote);
});

export { app as usersRoute };
