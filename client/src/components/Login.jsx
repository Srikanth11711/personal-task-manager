import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin, onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      username,
      password,
    });
    console.log("Login Success:", res.data);
    onLogin(res.data.token);
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    alert("Login failed: " + (err.response?.data?.message || err.message));
  }
};


  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        <input className="w-full p-3 border rounded" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full p-3 border rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
      <p className="text-center mt-4 text-sm">Don't have an account? <button onClick={onSwitch} className="text-green-600 hover:underline">Register</button></p>
    </>
  );
}

export default Login;