// ✅ Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config(); // <-- make sure this is first

// 👇 Then import other modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

// ✅ Basic app setup
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Debug log
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing!");
  process.exit(1);
} else {
  console.log("✅ JWT_SECRET loaded:", process.env.JWT_SECRET);
}

// ✅ Connect DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to DB");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("❌ DB connection error:", err));
