import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 7001, () => {
      console.log(`Server running on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));

//Routes
app.get("/", (req, res) => {
  res.send("Purvodaya API running.");
});
app.use("/api/auth", authRoutes);
