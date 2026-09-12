import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const scrollToSection = (id) => {
    if (window.location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-lg font-black text-white">
                ₹
              </div>

              <div>
                <p className="font-black text-white">BULK IPO</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Investment Platform
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              A simple platform designed to make IPO application management,
              status tracking and allotment checking faster and easier.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h3 className="font-bold text-white">Product</h3>

            <div className="mt-4 space-y-3 text-sm">
              <button
                onClick={() => scrollToSection("features")}
                className="block transition hover:text-white"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block transition hover:text-white"
              >
                How It Works
              </button>

              <button
                onClick={() => scrollToSection("security")}
                className="block transition hover:text-white"
              >
                Security
              </button>
            </div>
          </div>

          {/* PLATFORM */}
          <div>
            <h3 className="font-bold text-white">Platform</h3>

            <div className="mt-4 space-y-3 text-sm">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/home"
                    className="block transition hover:text-white"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/users"
                    className="block transition hover:text-white"
                  >
                    Investors
                  </Link>

                  <Link
                    to="/apply-ipo"
                    className="block transition hover:text-white"
                  >
                    Apply IPO
                  </Link>

                  <Link
                    to="/check-status"
                    className="block transition hover:text-white"
                  >
                    Check Status
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block transition hover:text-white"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="block transition hover:text-white"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* SECURITY */}
          <div>
            <h3 className="font-bold text-white">Security</h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>Secure authentication</p>
              <p>Protected API access</p>
              <p>Secure communication</p>
              <p>Investor privacy focused</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6">
          <div className="flex flex-col gap-4 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              © {new Date().getFullYear()} BULK IPO. All rights reserved.
            </p>

            <p>
              Built to make IPO management simple, fast and convenient.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;