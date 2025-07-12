import React, { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import TaskManager from "./components/TaskManager";

function App() {
  const [page, setPage] = useState("register");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    setPage("task");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl ">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Task Manager</h1>
        {!token && page === "register" && <Register onRegistered={() => setPage("login")} onSwitch={() => setPage("login")} />}
        {!token && page === "login" && <Login onLogin={handleLogin} onSwitch={() => setPage("register")} />}
        {token && <TaskManager token={token} onLogout={handleLogout} />}
      </div>
    </div>
  );
}

export default App;