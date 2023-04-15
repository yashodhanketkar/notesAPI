import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app: Express = express();
const primsa = new PrismaClient();

/**
 * @openapi
 * /notes:
 *   get:
 *     description: Return list of notes.
 *     parameters:
 *       - in: query
 *         name: id
 *         type: string
 *         description: ID of the note to get.
 *       - in: query
 *         name: user
 *         type: string
 *         value: admin
 *         description: Username of the note creator.
 *     responses:
 *       200:
 *         description: Returns list of all notes.
 */
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

/**
 * @openapi
 * /notes/:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/newnote"
 *     responses:
 *       201:
 *         description: Creates new note.
 * components:
 *   schemas:
 *     newnote:
 *       title: Create new note
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title for new note
 *         content:
 *           type: string
 *           description: Content for new note
 *         userId:
 *           type: string
 *           description: User ID of creator.
 *       required:
 *         - title
 *         - content
 *         - userId
 */
app.post("/", async (req: Request, res: Response) => {
  const newNote = await primsa.notes.create({
    data: req.body,
  });
  res.json(newNote);
});

/**
 * @openapi
 * /notes/:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the note to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/updateNote"
 *     responses:
 *       201:
 *         description: Update notes content.
 * components:
 *   schemas:
 *     updateNote:
 *       title: Update note
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: Content to be updated.
 *       required:
 *         - content
 */
app.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const newContent = req.body.content;
  const updatedNote = await primsa.notes.update({
    where: { id: id },
    data: { content: newContent },
  });
  res.json(updatedNote);
});

/**
 * @openapi
 * /notes/{id}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the note to delete.
 *     description: Delete the note from database.
 *     responses:
 *       200:
 *         description: Delete the note.
 */
app.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedNote = await primsa.notes.delete({
    where: { id: id },
  });
  res.json(deletedNote);
});

export { app as notesRoute };
