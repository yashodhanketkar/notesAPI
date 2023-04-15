import express from "express";
import swaggerUi from "swagger-ui-express";
import { notesRoute } from "./routes/notes";
import { usersRoute } from "./routes/users";
import { specs } from "./docs/swagger";
import cors from "cors";

const app = express();
const port = process.env.port || 8000;

app.use(express.json());
app.use(cors());
app.use("/api/v1/notes/", notesRoute);
app.use("/api/v1/users", usersRoute);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => console.log(`Server running on port ${port}`));
