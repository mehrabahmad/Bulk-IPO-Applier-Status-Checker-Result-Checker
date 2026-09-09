import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      {/* ===== MAIN ===== */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Dashboard Active
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Welcome back 👋
          </h2>

          <p className="text-gray-500 text-base md:text-lg">
            Manage your users, apply for IPOs, and track application status
            from one place.
          </p>
        </div>

        {/* ===== DASHBOARD CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Users Card */}
          <div
            onClick={() => navigate("/users")}
            className="group relative overflow-hidden cursor-pointer rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Gradient Top */}
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

            <div className="p-7">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                👥
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Users
              </h3>

              <p className="text-gray-500 text-sm leading-6 mb-6">
                Manage your user data records and account information.
              </p>

              <div className="flex items-center text-blue-600 font-semibold text-sm">
                Manage Users
                <span className="ml-2 group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </div>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-blue-50 opacity-70 group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          {/* Apply IPO Card */}
          <div
            onClick={() => navigate("/apply-ipo")}
            className="group relative overflow-hidden cursor-pointer rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Gradient Top */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-400"></div>

            <div className="p-7">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-2xl mb-5 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                📈
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Apply IPO
              </h3>

              <p className="text-gray-500 text-sm leading-6 mb-6">
                Apply for available IPO opportunities quickly and easily.
              </p>

              <div className="flex items-center text-green-600 font-semibold text-sm">
                Apply Now
                <span className="ml-2 group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </div>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-green-50 opacity-70 group-hover:scale-150 transition-transform duration-500"></div>
          </div>

          {/* Check Status Card */}
          <div
            onClick={() => navigate("/check-status")}
            className="group relative overflow-hidden cursor-pointer rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Gradient Top */}
            <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-500"></div>

            <div className="p-7">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-5 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                🔍
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Check Status
              </h3>

              <p className="text-gray-500 text-sm leading-6 mb-6">
                Check IPO application results and track application status.
              </p>

              <div className="flex items-center text-purple-600 font-semibold text-sm">
                Check Status
                <span className="ml-2 group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </div>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-purple-50 opacity-70 group-hover:scale-150 transition-transform duration-500"></div>
          </div>
        </div>

        {/* ===== QUICK INFO ===== */}
        <div className="mt-10 rounded-2xl bg-white/70 backdrop-blur-xl border border-white shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h3 className="font-semibold text-gray-800">
                IPO Management Dashboard
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Select an option above to get started.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              System Ready
            </div>

          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
