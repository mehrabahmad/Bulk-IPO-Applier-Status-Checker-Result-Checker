import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("savedToken");

    setIsLoggedIn(false);

    navigate("/", {
      replace: true,
    });
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* LOGO */}
        <button
          onClick={() => navigate(isLoggedIn ? "/home" : "/")}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-lg font-black text-white shadow-lg shadow-indigo-200">
            ₹
          </div>

          <div className="text-left">
            <p className="text-base font-black leading-tight text-slate-900 sm:text-lg">
              IPO Dashboard
            </p>

            <p className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
              Smart Investment Platform
            </p>
          </div>
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-1 lg:flex">
          {!isLoggedIn && (
            <>
              <button
                onClick={() => scrollToSection("features")}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
              >
                How It Works
              </button>

              <button
                onClick={() => scrollToSection("security")}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
              >
                Security
              </button>
            </>
          )}
        </nav>

        {/* DESKTOP BUTTONS */}
        <div className="hidden items-center gap-2 sm:flex">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-700 sm:hidden"
        >
          {mobileMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg sm:hidden">
          <div className="space-y-2">
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => scrollToSection("features")}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Features
                </button>

                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  How It Works
                </button>

                <button
                  onClick={() => scrollToSection("security")}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Security
                </button>
              </>
            )}

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="block rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-bold text-slate-800"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="block rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;