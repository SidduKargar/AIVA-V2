import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { svgsDir } from "./config/storage.js";
import { initializeChroma } from "./config/clients.js";
import routes from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads/svgs", express.static(svgsDir));
app.use("/", routes);

const PORT = process.env.PORT || 3000;

initializeChroma().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
