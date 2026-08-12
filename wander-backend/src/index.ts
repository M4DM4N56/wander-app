import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import placesRouter from "./routes/places";
import distanceRouter from "./routes/distance";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use("/api/places", placesRouter);
app.use("/api/distance", distanceRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Wander backend running on port ${PORT}`);
});
