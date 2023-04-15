import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app: Express = express();
const prisma = new PrismaClient();

/**
 * @openapi
 * /users/:
 *   get:
 *     description: Return list of users.
 *     responses:
 *       200:
 *         description: Returns list of all users.
 */
app.get("/", async (req: Request, res: Response) => {
  let allUsers = await prisma.users.findMany();
  let ret = allUsers.map((user) => user.username);
  res.json(ret);
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         value: 3cd73049-71eb-48e1-91dc-bb5386ae15c7
 *         description: ID of the user to get.
 *     description: Return list of users.
 *     responses:
 *       200:
 *         description: Returns the users.
 */
app.get("/:id", async (req: Request, res: Response) => {
  const user = await prisma.users.findUnique({
    where: { id: req.params.id },
  });
  res.json({
    id: user?.id,
    username: user?.username,
  });
});

/**
 * @openapi
 * /users/:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/newuser"
 *     responses:
 *       201:
 *         description: Creates new users.
 * components:
 *   schemas:
 *     newuser:
 *       title: Create new user
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           default: testUser
 *           description: Username for new user
 *         password:
 *           type: string
 *           default: testPassword
 *           description: Password for new user
 *       required:
 *         - username
 *         - password
 */
app.post("/", async (req: Request, res: Response) => {
  const newUser = await prisma.users.create({
    data: req.body,
  });
  res.status(201).json(newUser);
});

/**
 * @openapi
 * /users/:
 *   put:
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/updatePassword"
 *     responses:
 *       201:
 *         description: Update users password.
 * components:
 *   schemas:
 *     updatePassword:
 *       title: Update password
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *           default: testPassword
 *           description: Password for new user
 *       required:
 *         - password
 */
app.put("/:id", async (req: Request, res: Response) => {
  const newPassword = req.body.password;
  const updatedUser = await prisma.users.update({
    where: { id: req.params.id },
    data: { password: newPassword },
  });
  res.json(updatedUser);
});

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the user to delete.
 *     description: Delete the user from database.
 *     responses:
 *       200:
 *         description: Delete the user.
 */
app.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedNote = await prisma.users.delete({
    where: { id: id },
  });
  res.json(deletedNote);
});

export { app as usersRoute };
