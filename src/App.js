import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/dashboard";
import ApplyIPO from "./pages/applyIpo";
import CheckStatus from "./pages/checkStatus";
import Users from "./pages/Users";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}

        {/* Landing page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* ================= PROTECTED ================= */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Apply IPO */}
        <Route
          path="/apply-ipo"
          element={
            <ProtectedRoute>
              <ApplyIPO />
            </ProtectedRoute>
          }
        />

        {/* Check Status / Result */}
        <Route
          path="/check-status"
          element={
            <ProtectedRoute>
              <CheckStatus />
            </ProtectedRoute>
          }
        />

        {/* Users */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />


        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

