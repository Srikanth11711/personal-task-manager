import React, { useState } from "react";
import axios from "axios";

function Register({ onRegistered, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", { username, password });
      alert("Registration successful. Please log in.");
      onRegistered();
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <>
      <form onSubmit={handleRegister} className="space-y-4">
        <input className="w-full p-3 border rounded" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full p-3 border rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-green-500 text-white py-2 rounded">Register</button>
      </form>
      <p className="text-center mt-4 text-sm">Already have an account? <button onClick={onSwitch} className="text-blue-600 hover:underline">Login</button></p>
    </>
  );
}

export default Register;