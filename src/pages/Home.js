import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const features = [
    {
      icon: "⚡",
      title: "Bulk IPO Application",
      description:
        "Manage multiple investor accounts and process IPO applications from one powerful dashboard instead of handling each account separately.",
    },
    {
      icon: "✓",
      title: "Instant Status Tracking",
      description:
        "Quickly monitor whether applications are verified, unverified, rejected or still pending without manually checking every account.",
    },
    {
      icon: "★",
      title: "Fast Allotment Results",
      description:
        "Check IPO allotment results for multiple investors and instantly identify successful allotments.",
    },
    {
      icon: "⏱",
      title: "Save Valuable Time",
      description:
        "Reduce repetitive work and spend less time switching between accounts, entering details and checking results manually.",
    },
    {
      icon: "👥",
      title: "Investor Management",
      description:
        "Maintain and manage multiple investor profiles from one organized dashboard built for efficient IPO management.",
    },
    {
      icon: "📊",
      title: "Clear Investment Overview",
      description:
        "View total investors, verified applications, rejected applications, allotted investors and other important information clearly.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Register securely and access your personal IPO management dashboard.",
    },
    {
      number: "02",
      title: "Add Investors",
      description:
        "Add and organize the investor accounts you want to manage from your dashboard.",
    },
    {
      number: "03",
      title: "Select an IPO",
      description:
        "Choose an available IPO and manage applications for your selected investors.",
    },
    {
      number: "04",
      title: "Track Everything",
      description:
        "Check application status and allotment results without manually checking every investor.",
    },
  ];

  const securityFeatures = [
    "Secure user authentication",
    "Protected dashboard access",
    "Authenticated backend API requests",
    "Secure HTTPS communication when deployed correctly",
    "Controlled access to investor information",
    "Privacy-focused account management",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]" />

        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-xs font-bold text-indigo-200 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Smarter IPO Management
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Invest Smarter.
              <span className="block bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Apply Faster.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Manage multiple IPO investors, apply efficiently, track
              application status and check allotment results from one simple
              investment dashboard.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={handleGetStarted}
                className="rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-indigo-900/40 transition hover:-translate-y-0.5 hover:bg-indigo-500"
              >
                {isLoggedIn ? "Open Dashboard" : "Get Started Free"}
              </button>

              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="rounded-2xl border border-slate-700 bg-slate-900 px-8 py-4 text-sm font-bold text-white transition hover:border-slate-500 hover:bg-slate-800"
                >
                  Login to Account
                </Link>
              )}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-400 sm:text-sm">
              <span>✓ Bulk Processing</span>
              <span>✓ Fast Status Checking</span>
              <span>✓ Investor Management</span>
              <span>✓ Secure Access</span>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="mx-auto mt-14 max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-2 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl sm:p-3">
            <div className="rounded-[1.5rem] bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Portfolio Overview
                  </p>

                  <p className="mt-1 text-lg font-black text-slate-900">
                    IPO Investment Dashboard
                  </p>
                </div>

                <div className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 sm:block">
                  ● Active
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">
                    Investors
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-900">
                    250
                  </p>
                </div>

                <div className="rounded-2xl bg-indigo-50 p-4">
                  <p className="text-xs font-semibold text-indigo-500">
                    Verified
                  </p>

                  <p className="mt-2 text-2xl font-black text-indigo-700">
                    238
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold text-emerald-600">
                    Allotted
                  </p>

                  <p className="mt-2 text-2xl font-black text-emerald-700">
                    32
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-xs font-semibold text-blue-600">
                    Processed
                  </p>

                  <p className="mt-2 text-2xl font-black text-blue-700">
                    100%
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">
                      IPO Processing
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Monitor multiple investors from one place
                    </p>
                  </div>

                  <span className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white">
                    Fast & Simple
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="text-center">
            <p className="text-2xl font-black text-slate-900">Bulk</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              IPO Applications
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-black text-indigo-600">Fast</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Status Checking
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-black text-emerald-600">Simple</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Result Tracking
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-black text-blue-600">Secure</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Account Access
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="scroll-mt-24 bg-[#f7f9fc] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Powerful Features
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to manage IPO applications
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Designed to remove repetitive work and make managing multiple
              investor IPO accounts faster and easier.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl transition group-hover:bg-indigo-600 group-hover:text-white">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAVE TIME */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Save Your Time
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Stop checking every investor account one by one.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500">
              Managing multiple IPO accounts manually can involve repetitive
              login, application and result-checking processes. IPO Dashboard
              brings those workflows into one organized interface.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Manage many investor profiles from one dashboard",
                "Quickly process IPO application workflows",
                "Check application status across investors",
                "Identify allotted investors quickly",
                "Download allotted investor information",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-600">
                    ✓
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-700 p-6 shadow-2xl shadow-indigo-200 sm:p-8">
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm font-bold text-indigo-100">
                Traditional Process
              </p>

              <p className="mt-3 text-2xl font-black text-white">
                Multiple repetitive steps
              </p>
            </div>

            <div className="my-4 flex justify-center text-2xl text-white">
              ↓
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <p className="text-sm font-bold text-indigo-600">
                With IPO Dashboard
              </p>

              <p className="mt-3 text-2xl font-black text-slate-900">
                One organized workflow
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Manage applications, status and allotment results from one
                central dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-24 bg-slate-950 py-20 text-white sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
              Simple Workflow
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              From registration to IPO results in four steps
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              You don't need a complicated workflow. Everything is organized
              around the tasks investors actually need.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur"
              >
                <div className="text-3xl font-black text-indigo-400">
                  {step.number}
                </div>

                <h3 className="mt-5 text-lg font-black text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section
        id="security"
        className="scroll-mt-24 bg-white py-20 sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-[#f7f9fc] p-6 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-200">
              🔐
            </div>

            <h3 className="mt-6 text-2xl font-black text-slate-900">
              Security-focused by design
            </h3>

            <div className="mt-6 grid gap-3">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-600">
                    ✓
                  </span>

                  <p className="text-sm font-semibold text-slate-700">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Trust & Security
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Your investment data deserves proper protection.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500">
              IPO Dashboard uses authenticated access and protected backend
              requests to help prevent unauthorized access to your dashboard.
            </p>

            
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f7f9fc] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 px-6 py-12 text-center shadow-2xl shadow-indigo-200 sm:px-12 sm:py-16">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">
                Start Investing Smarter
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                Spend less time managing IPO applications and more time
                focusing on your investments.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
                Bring your investor management, IPO applications and allotment
                tracking together in one convenient platform.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={handleGetStarted}
                  className="rounded-2xl bg-white px-8 py-4 text-sm font-black text-indigo-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-indigo-50"
                >
                  {isLoggedIn
                    ? "Go to Dashboard"
                    : "Create Your Account"}
                </button>

                {!isLoggedIn && (
                  <Link
                    to="/login"
                    className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Already Have an Account?
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
