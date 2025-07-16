// models/Task.js
import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  deadline: { type: Date, default: null },
}, { timestamps: true });

const Task = mongoose.model("Task", TaskSchema);
export default Task;
