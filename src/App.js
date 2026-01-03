import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthApp from "./pages/AuthApp";
import Home from "./pages/Home";
import ApplyIPO from "./pages/applyIpo";
import CheckStatus from "./pages/checkStatus";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/Users";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={token ? <Navigate to="/home" replace /> : <AuthApp />}
        />

        {/* Protected Pages */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply-ipo"
          element={
            <ProtectedRoute>
              <ApplyIPO />
            </ProtectedRoute>
          }
        />

        <Route
          path="/check-status"
          element={
            <ProtectedRoute>
              <CheckStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


// import React, { useState } from "react";
// import axios from "axios";

// export default function AuthApp() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     if (isLogin) {
//       // LOGIN
//       const res = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         {
//           email: form.email,
//           password: form.password
//         }
//       );
//       alert("Login successful");
//       console.log(res.data);
//     } else {
//       // REGISTER
//       const res = await axios.post(
//         "http://localhost:5000/api/auth/register",
//         {
//           username: form.username,
//           email: form.email,
//           password: form.password
//         }
//       );

//       alert(res.data.message);

//       // ✅ REDIRECT TO LOGIN
//       setIsLogin(true);

//       // ✅ OPTIONAL: clear password
//       setForm({ username: "", email: "", password: "" });
//     }
//   } catch (error) {
//     alert(error.response?.data?.message || "Server error");
//   }
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-2xl shadow-md w-80">
//         <h2 className="text-2xl font-bold text-center mb-4">
//           {isLogin ? "Login" : "Register"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {!isLogin && (
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               className="w-full border p-2 rounded"
//               onChange={handleChange}
//               required
//             />
//           )}

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             className="w-full border p-2 rounded"
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full border p-2 rounded"
//             onChange={handleChange}
//             required
//           />

//           <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
//             {isLogin ? "Login" : "Register"}
//           </button>
//         </form>

//         <p className="text-sm text-center mt-4">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}
//           <button
//             className="text-blue-600 ml-1"
//             onClick={() => setIsLogin(!isLogin)}
//           >
//             {isLogin ? "Register" : "Login"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }
