import express, { Request, Response } from "express";

import { notesRoute } from "./routes/notes";
import { usersRoute } from "./routes/users";

const app = express();
const port = process.env.port || 8000;

app.use(express.json());
app.use("/notes/", notesRoute);
app.use("/users", usersRoute);

app.listen(port, () => console.log(`Server running on port ${port}`));
