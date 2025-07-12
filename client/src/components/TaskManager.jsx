import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function TaskManager({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

 const fetchTasks = async () => {
  try {
    console.log("🔐 Sending token:", token);  // <== ADD THIS
    const res = await axios.get(`${API}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  } catch (err) {
    console.error("❌ Failed to fetch tasks:", err.response?.data || err.message);
  }
};


  const addTask = async () => {
  if (!taskText.trim()) return;
  try {
    console.log("🔐 Sending token:", token);  // <== ADD THIS
    const res = await axios.post(
      `${API}/tasks`,
      { text: taskText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTaskText("");
    fetchTasks();
  } catch (err) {
    console.error("❌ Error adding task:", err.response?.data || err.message);
  }
};


  const deleteTask = async (id) => {
    await axios.delete(`${API}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const toggleComplete = async (id) => {
    await axios.patch(`${API}/tasks/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const editTask = async (id, newText) => {
    await axios.put(`${API}/tasks/${id}`, { text: newText }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-5 flex flex-col">
        <button onClick={onLogout} className="mb-6 text-red-600 text-left hover:underline">🚪 Logout</button>
        <h2 className="text-2xl font-bold mb-8 text-blue-600">🧩 Task Manager</h2>
        <button onClick={() => setFilter("all")} className="mb-3 p-2 hover:bg-blue-100 rounded text-left">📝 All Tasks</button>
        <button onClick={() => setFilter("completed")} className="mb-3 p-2 hover:bg-green-100 rounded text-left">✅ Completed</button>
        <button onClick={() => setFilter("pending")} className="mb-3 p-2 hover:bg-yellow-100 rounded text-left">⏳ Pending</button>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex justify-center items-start p-10 overflow-y-auto">
        <div className="bg-white shadow-xl rounded-xl w-full max-w-5xl p-6 min-h-[80vh]">
          <div className="flex mb-6 gap-3">
            <input
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="flex-1 p-3 border rounded"
              placeholder="Enter a new task"
            />
            <button onClick={addTask} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">No tasks found</p>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onDelete={deleteTask}
                onToggle={toggleComplete}
                onEdit={editTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskManager;
