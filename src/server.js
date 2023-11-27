// init express and write endpoints
import express from "express";
import cors from "cors";
import apiRoutes from "./api/index.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "public");

const app = express();
const port = 6969;
app.use(express.static(publicPath));
app.use(express.json());
app.use(cors());

app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});