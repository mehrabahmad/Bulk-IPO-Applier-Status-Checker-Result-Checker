import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function AuthApp() {
  const API=process.env.REACT_APP_BACKEND_BASE_LINK;
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post(`${API}/auth/login`, {
          email: form.email,
          password: form.password
        });

        localStorage.setItem("token", res.data.token);
        navigate("/home");
      } else {
        // REGISTER
        await axios.post(`${API}/auth/register`, {
          name: form.name,
          email: form.email,
          password: form.password
        });

        alert("Registration successful. Please login.");
        setIsLogin(true);
        setForm({ name: "", email: "", password: "" });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          {isLogin ? "No account?" : "Already have an account?"}
          <button
            type="button"
            className="text-blue-600 ml-1"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
