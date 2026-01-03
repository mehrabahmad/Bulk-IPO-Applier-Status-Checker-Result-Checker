import React from "react";

import { useNavigate } from "react-router-dom";

export default function Home() {
  
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            className="text-xl font-bold text-blue-600 cursor-pointer hover:opacity-80"
            onClick={() => navigate("/home")}
          >
            IPO Dashboard
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/home")}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/", { replace: true });
              }}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Welcome 👋
        </h2>

        {/* ===== NAV CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <div
            onClick={() => navigate("/users")}
            className="cursor-pointer bg-blue-600 text-white p-6 rounded-xl shadow hover:scale-105 transition"
          >
            <h3 className="text-lg font-semibold mb-2">Users</h3>
            <p className="text-sm opacity-90">
              Manage your user data records
            </p>
          </div>

          <div
            onClick={() => navigate("/apply-ipo")}
            className="cursor-pointer bg-green-600 text-white p-6 rounded-xl shadow hover:scale-105 transition"
          >
            <h3 className="text-lg font-semibold mb-2">Apply IPO</h3>
            <p className="text-sm opacity-90">
              Apply for IPO opportunities
            </p>
          </div>

          <div
            onClick={() => navigate("/check-status")}
            className="cursor-pointer bg-purple-600 text-white p-6 rounded-xl shadow hover:scale-105 transition"
          >
            <h3 className="text-lg font-semibold mb-2">Check Status</h3>
            <p className="text-sm opacity-90">
              View IPO application status
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
