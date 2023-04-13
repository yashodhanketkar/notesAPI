import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app: Express = express();
const primsa = new PrismaClient();

app.get("/", async (req: Request, res: Response) => {
  const id = req.query.id;
  const user = req.query.user;

  if (id) {
    const note = await primsa.notes.findUnique({
      where: { id: id.toString() },
      include: {
        createdBy: true,
      },
    });
    res.json(note);
  } else if (user) {
    const note = await primsa.notes.findMany({
      where: {
        createdBy: {
          username: user.toString(),
        },
      },
      include: {
        createdBy: true,
      },
    });
    res.json(note);
  } else {
    const allNotes = await primsa.notes.findMany({
      include: {
        createdBy: true,
      },
    });
    res.json(allNotes);
  }
});

app.post("/", async (req: Request, res: Response) => {
  const newNote = await primsa.notes.create({
    data: req.body,
  });
  res.json(newNote);
});

app.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const newContent = req.body.content;
  const updatedNote = await primsa.notes.update({
    where: { id: id },
    data: { content: newContent },
  });
  res.json(updatedNote);
});

app.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedNote = await primsa.notes.delete({
    where: { id: id },
  });
  res.json(deletedNote);
});

export { app as notesRoute };
