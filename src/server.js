// init express and write endpoints
import express from "express";
import cors from "cors";
import apiRoutes from "./api/index.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import {
  authenticate,
  authorize,
  loginRedirect,
  webRedirect,
  handleInvalidRoutes,
} from "./middleware/authentication.js";

const ROLE_ADMIN = "admin";
const ROLE_EMPLOYEE = "employee";
const ROLE_PARENTS = "parents";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "public");

const app = express();
const port = 80;

app.use(cookieParser());

app.get("/web/login", loginRedirect);

app.get("/web", webRedirect);

app.use("/web/dashboard", authenticate);
app.use("/web/dashboard/create-employee", authorize([ROLE_ADMIN]));
app.use("/web/dashboard/create-family", authorize([ROLE_ADMIN]));
app.use(
  "/web/dashboard/student-overview",
  authorize([ROLE_ADMIN, ROLE_EMPLOYEE])
);
app.use("/web/dashboard/my-children", authorize([ROLE_PARENTS]));

app.use(express.static(publicPath));
app.use(express.json());
app.use(cors());

app.use("/api", apiRoutes);

app.use(handleInvalidRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
