import React, { useState } from "react";

const TaskItem = ({ task, onDelete, onToggle, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const handleEdit = () => {
    if (text.trim()) onEdit(task._id, text);
    setEditing(false);
  };

  return (
    <div className="flex justify-between items-center border p-4 rounded mb-3 bg-gray-50">
      <div className="flex-1">
        {editing ? (
          <input value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 border rounded" />
        ) : (
          <span className={task.completed ? "line-through text-gray-400" : ""}>{task.text}</span>
        )}
      </div>
      <div className="ml-4 flex gap-3">
        <button onClick={() => onToggle(task._id)} className="text-green-600 hover:scale-105 transition">
          {task.completed ? "↩️" : "✅"}
        </button>
        {editing ? (
          <button onClick={handleEdit} className="text-blue-600 hover:scale-105 transition">💾</button>
        ) : (
          <button onClick={() => setEditing(true)} className="text-yellow-600 hover:scale-105 transition">✏️</button>
        )}
        <button onClick={() => onDelete(task._id)} className="text-red-600 hover:scale-105 transition">🗑️</button>
      </div>
    </div>
  );
};

export default TaskItem;