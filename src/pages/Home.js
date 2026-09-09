
import React from "react";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/home")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <span className="text-white text-lg font-bold">₹</span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                IPO Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                Investment Management
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition"
            >
              <span>⌂</span>
              Home
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/", { replace: true });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium transition"
            >
              <span>↪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

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
    </div>
  );
}


// import React from "react";

// import { useNavigate } from "react-router-dom";

// export default function Home() {
  
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* ===== HEADER ===== */}
//       <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-sm">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <h1
//             className="text-xl font-bold text-blue-600 cursor-pointer hover:opacity-80"
//             onClick={() => navigate("/home")}
//           >
//             IPO Dashboard
//           </h1>
//           <div className="flex gap-3">
//             <button
//               onClick={() => navigate("/home")}
//               className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
//             >
//               Home
//             </button>
//             <button
//               onClick={() => {
//                 localStorage.removeItem("token");
//                 navigate("/", { replace: true });
//               }}
//               className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* ===== MAIN ===== */}
//       <main className="max-w-6xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-6">
//           Welcome 👋
//         </h2>

//         {/* ===== NAV CARDS ===== */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

//           <div
//             onClick={() => navigate("/users")}
//             className="cursor-pointer bg-blue-600 text-white p-6 rounded-xl shadow hover:scale-105 transition"
//           >
//             <h3 className="text-lg font-semibold mb-2">Users</h3>
//             <p className="text-sm opacity-90">
//               Manage your user data records
//             </p>
//           </div>

//           <div
//             onClick={() => navigate("/apply-ipo")}
//             className="cursor-pointer bg-green-600 text-white p-6 rounded-xl shadow hover:scale-105 transition"
//           >
//             <h3 className="text-lg font-semibold mb-2">Apply IPO</h3>
//             <p className="text-sm opacity-90">
//               Apply for IPO opportunities
//             </p>
//           </div>

//           <div
//             onClick={() => navigate("/check-status")}
//             className="cursor-pointer bg-purple-600 text-white p-6 rounded-xl shadow hover:scale-105 transition"
//           >
//             <h3 className="text-lg font-semibold mb-2">Check Status</h3>
//             <p className="text-sm opacity-90">
//               View IPO application status
//             </p>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// }
