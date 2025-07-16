import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function TaskManager({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
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
      await axios.post(
        `${API}/tasks`,
        { text: taskText, priority, deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTaskText("");
      setDeadline("");
      setPriority("Medium");
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

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .sort((a, b) => {
      const d1 = new Date(a.deadline);
      const d2 = new Date(b.deadline);
      if (d1 < d2) return -1;
      if (d1 > d2) return 1;

      const priorityMap = { High: 3, Medium: 2, Low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    });

  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = total - completedCount;
  const completedPercent = total ? (completedCount / total) * 100 : 0;
  const pendingPercent = total ? (pendingCount / total) * 100 : 0;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
     <div className="w-64 bg-white shadow-md p-5 flex flex-col">
  <button onClick={onLogout} className="mb-6 text-red-600 text-left hover:underline">
    🚪 Logout
  </button>
  <h2 className="text-2xl font-bold mb-4 text-blue-600">🧩 Task Manager</h2>

  {/* Summary Cards */}
  <div className="mb-8 space-y-3">
    <div className="bg-blue-100 text-blue-800 font-semibold p-3 rounded-xl shadow text-center">
      🔵 Total Tasks: {tasks.length}
    </div>
    <div className="bg-green-100 text-green-800 font-semibold p-3 rounded-xl shadow text-center">
      ✅ Completed: {completedCount}
    </div>
    <div className="bg-yellow-100 text-yellow-800 font-semibold p-3 rounded-xl shadow text-center">
      ⏳ Pending: {pendingCount}
    </div>
  </div>

  {/* Filter Buttons */}
  <button onClick={() => setFilter("all")} className="mb-3 p-2 hover:bg-blue-100 rounded text-left">
    📝 All Tasks
  </button>
  <button onClick={() => setFilter("completed")} className="mb-3 p-2 hover:bg-green-100 rounded text-left">
    ✅ Completed
  </button>
  <button onClick={() => setFilter("pending")} className="mb-3 p-2 hover:bg-yellow-100 rounded text-left">
    ⏳ Pending
  </button>
</div>


      {/* Main Card */}
      <div className="flex-1 flex justify-center items-start p-10 overflow-y-auto">
        <div className="bg-white shadow-xl rounded-xl w-full max-w-5xl p-6 min-h-[80vh]">
          {/* Progress Bars */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-gray-700">✅ Completed ({completedCount})</span>
              <span>{completedPercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-4 mb-4">
              <div
                className="bg-green-500 h-4 rounded"
                style={{ width: `${completedPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-gray-700">⏳ Pending ({pendingCount})</span>
              <span>{pendingPercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-4 mb-6">
              <div
                className="bg-yellow-400 h-4 rounded"
                style={{ width: `${pendingPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Task Input */}
          <div className="flex mb-6 gap-3 flex-wrap">
            <input
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="flex-1 p-3 border rounded"
              placeholder="Enter a new task"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="p-3 border rounded"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="p-3 border rounded"
            />
            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          {/* Task List */}
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
