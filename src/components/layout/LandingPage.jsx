import React from "react";
import {
  ArrowRight,
  Box,
  Check,
  ChevronRight,
  Code2,
  Folder,
  GitBranch,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Users,
  Video,
  Zap,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router";

const features = [
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Bring developers, managers, and startup teams together in one unified workspace.",
  },
  {
    icon: Code2,
    title: "Development Workspace",
    description:
      "Manage projects, tasks, repositories, environments, and development workflows.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Communication",
    description:
      "Communicate with your team through channels, direct messages, meetings, and discussions.",
  },
  {
    icon: GitBranch,
    title: "Project Management",
    description:
      "Organize software projects, track progress, assign tasks, and keep everyone aligned.",
  },
  {
    icon: Rocket,
    title: "Easy Deployment",
    description:
      "Move from development to deployment with an integrated and streamlined workflow.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Workspace",
    description:
      "Keep your projects and team data organized with workspace-based access and security.",
  },
];

const heroFeatures = [
  {
    icon: Users,
    title: "Collaboration",
    text: "Work together, better.",
  },
  {
    icon: LayoutDashboard,
    title: "Project Management",
    text: "Stay on track.",
  },
  {
    icon: MessageSquare,
    title: "Team Communication",
    text: "No more missed updates.",
  },
  {
    icon: Box,
    title: "Build Products",
    text: "Turn ideas into reality.",
  },
];

const stats = [
  { value: "1", label: "Unified Workspace" },
  { value: "∞", label: "Possibilities" },
  { value: "24/7", label: "Team Collaboration" },
  { value: "100%", label: "Focused on Teams" },
];

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden">
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight">
              <img src="/ucollyx.png" alt="" className="w-40" />
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:cursor-pointer"
            >
              Log in
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Mobile button */}
          <button className="rounded-lg p-2 text-slate-700 md:hidden">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:cursor-pointer"
            >
              Log in
            </button>
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main>
        <section className="relative isolate">
          <div className="mx-auto px-6 lg:px-8">
            <div className="mx-auto text-center">
              <section className="relative isolate overflow-hidden pt-20">
                <div className="pointer-events-none absolute inset-0 -z-10">
                  <div className="absolute left-[28%] top-16 h-[550px] w-[750px] rounded-full bg-blue-100/50 blur-3xl" />
                  <div className="absolute right-[-150px] top-20 h-[600px] w-[600px] rounded-full bg-sky-100/70 blur-3xl" />
                  <div className="absolute -right-[260px] top-[210px] h-[620px] w-[850px] rounded-[50%] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 opacity-95" />
                  <div className="absolute -left-[300px] bottom-[-280px] h-[450px] w-[720px] rounded-[50%] bg-gradient-to-r from-blue-600 to-sky-300 opacity-90" />
                  <div className="absolute right-16 top-28 hidden grid-cols-3 gap-4 opacity-60 lg:grid">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-2 w-2 rounded-full bg-blue-500"
                      />
                    ))}
                  </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="grid min-h-[680px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    {/* ================================================= LEFT SIDE ================================================= */}
                    <div className="relative z-10 pb-12 pt-12 lg:pb-24">
                      {/* Main Heading */}
                      <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[68px]">
                        One workspace.
                        <br />
                        <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-400 bg-clip-text text-transparent">
                          Your entire team.
                        </span>
                      </h1>

                      {/* Description */}
                      <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                        UCollyx is a unified workspace for software teams and
                        tech startups to collaborate, manage projects,
                        communicate, and build products together.
                      </p>

                      {/* CTA Buttons */}
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={() => navigate("/register")}
                          className="group inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/25 transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
                        >
                          Get Started Free
                          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                        </button>

                        <button
                          onClick={() => scrollTo("features")}
                          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-blue-200 bg-white/90 px-8 py-4 text-base font-bold text-blue-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                        >
                          Explore Workspace
                        </button>
                      </div>

                      {/* Trust Points */}
                      <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-blue-600" />
                          No complicated setup
                        </span>

                        <span className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-blue-600" />
                          Built for teams
                        </span>

                        <span className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-blue-600" />
                          Everything connected
                        </span>
                      </div>
                    </div>

                    {/* ================================================= RIGHT SIDE / LAPTOP ================================================= */}
                    <div className="relative z-10 flex items-center justify-center lg:justify-end">
                      <div className="absolute bottom-[-25px] right-[3%] h-20 w-[88%] rounded-full bg-blue-900/20 blur-3xl" />
                      <div className="relative w-full max-w-[730px] rotate-[1deg]">
                        <div className="relative overflow-hidden rounded-[26px] border-[8px] border-slate-900 bg-slate-900 shadow-2xl shadow-blue-900/30">
                          <div className="bg-white">
                            <div className="flex h-10 items-center gap-2 border-b border-slate-100 px-4">
                              <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                              <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                              <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />

                              <div className="mx-auto h-5 w-48 rounded-md bg-slate-50" />
                            </div>

                            <div className="min-h-[360px] bg-gradient-to-br from-white via-blue-50/60 to-sky-50 px-5 py-6 sm:min-h-[430px] sm:px-10">

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">

                                  <div className="mb-8">
                                    <img
                                      src="/ucollyx.png"
                                      alt="UCollyx"
                                      className="w-24 object-contain"
                                    />
                                  </div>
                                </div>

                                <div className="hidden items-center gap-5 text-[9px] font-medium text-slate-500 sm:flex">
                                  <span>Features</span>
                                  <span>How It Works</span>
                                  <span>About</span>
                                  <span>Log in</span>

                                  <span className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white">
                                    Get Started
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-center">
                                <div className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-3 py-1 text-[8px] font-semibold text-blue-600 shadow-sm">
                                  <Zap className="h-3 w-3" />
                                  Built for modern software teams
                                  <ChevronRight className="h-3 w-3" />
                                </div>
                              </div>

                              <div className="mx-auto mt-5 max-w-lg text-center">
                                <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
                                  One workspace.
                                  <br />
                                  <span className="text-blue-600">
                                    Your entire team.
                                  </span>
                                </h2>

                                <p className="mx-auto mt-3 max-w-md text-[10px] leading-4 text-slate-500 sm:text-xs">
                                  A unified workspace for software teams and
                                  tech startups to collaborate, manage projects,
                                  communicate, and build products together.
                                </p>

                                <div className="mt-5 flex justify-center gap-2">
                                  <div className="rounded-lg bg-blue-600 px-4 py-2 text-[9px] font-bold text-white shadow-md">
                                    Get Started Free →
                                  </div>

                                  <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[9px] font-bold text-slate-700">
                                    Explore Workspace
                                  </div>
                                </div>

                                <div className="mt-4 flex justify-center gap-4 text-[7px] text-slate-400">
                                  <span>✓ No complicated setup</span>
                                  <span>✓ Built for teams</span>
                                  <span>✓ Everything connected</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mx-auto h-4 w-[92%] rounded-b-2xl bg-gradient-to-b from-slate-500 to-slate-300 shadow-xl" />

                        <div className="mx-auto h-2 w-[45%] rounded-b-xl bg-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* ================================================= FEATURE STRIP ================================================= */}
                  <div className="w-full relative z-20 -mt-2 mb-12 overflow-hidden rounded-[30px] border border-slate-100 bg-white/95 shadow-xl shadow-blue-900/5 backdrop-blur-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                      {heroFeatures.map((item, index) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className={`flex items-center gap-4 px-6 py-7 ${
                              index !== heroFeatures.length - 1
                                ? "border-b border-slate-100 lg:border-b-0 lg:border-r"
                                : ""
                            }`}
                          >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
                              <Icon className="h-6 w-6 text-blue-600" />
                            </div>

                            <div>
                              <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                                {item.title}
                              </h3>

                              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                {item.text}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  No complicated setup
                </span>

                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  Built for teams
                </span>

                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600" />
                  Everything connected
                </span>
              </div>
            </div>

            {/* ================= DASHBOARD PREVIEW ================= */}
            <div className="relative mx-auto mt-20 max-w-6xl">
              {/* Glow */}
              <div className="absolute inset-x-20 -bottom-10 h-32 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-blue-900/10">

                <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-slate-50 px-5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                    <div className="h-3 w-3 rounded-full bg-slate-300" />
                  </div>

                  <div className="hidden h-7 w-80 rounded-md border border-slate-200 bg-white shadow-sm sm:block" />

                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-900 px-3 py-1 text-white shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Org Admin
                    </span>
                    <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                      A
                    </div>
                  </div>
                </div>

                {/* Dashboard Body */}
                <div className="flex min-h-[500px] bg-slate-50">
                  {/* Sidebar */}
                  <aside className="hidden w-16 flex-col items-center border-r border-slate-200 bg-white py-4 sm:flex gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
                      A
                    </div>
                    <div className="w-8 border-t border-slate-100 my-1" />
                    {/* Navigation icon representations */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <LayoutDashboard className="h-4 w-4" />
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50">
                      <Folder className="h-4 w-4" />
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50">
                      <Video className="h-4 w-4" />
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50">
                      <Lock className="h-4 w-4" />
                    </div>
                  </aside>

                  {/* Main Content Area */}
                  <div className="flex-1 p-5 sm:p-6 space-y-5">
                    {/* Top Hero Banner Card */}
                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center shadow-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Ecosystem Hub
                          </span>
                          <span className="text-slate-300">/</span>
                          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Control Panel
                          </span>
                        </div>
                        <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                          Devsloop
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Live routing status updates and key infrastructure
                          metrics dashboard.
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0">
                        <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                          Pending Gates
                        </button>
                      </div>
                    </div>

                    {/* Two Column Grid */}
                    <div className="grid gap-5 lg:grid-cols-3">
                      {/* Left Column: Users & Access Index */}
                      <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2 shadow-sm space-y-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-600" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                Users & Access Index
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Active operators and telemetry pipelines
                            </p>
                          </div>
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                            IDX
                          </span>
                        </div>

                        {/* Inner Metrics Cards */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                            <p className="text-xs text-slate-500">
                              Total Users Assigned
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-slate-900">
                              7
                            </p>
                            <div className="absolute right-4 top-4 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 shadow-sm">
                              Live Node
                            </div>
                          </div>

                          <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                            <p className="text-xs text-slate-500">
                              Pending Approvals
                            </p>
                            <p className="mt-1 text-3xl font-extrabold text-amber-500">
                              0
                            </p>
                            <div className="absolute right-4 top-4 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm">
                              INSPECT GATE
                            </div>
                          </div>
                        </div>

                        {/* Role Allocation Shares */}
                        <div className="space-y-3 pt-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Role Allocation Shares
                          </p>

                          {/* Role 1 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                                <span className="text-blue-500 font-mono">
                                  ›_
                                </span>{" "}
                                Developers
                              </span>
                              <span className="font-bold text-slate-900">
                                3
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                            </div>
                          </div>

                          {/* Role 2 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                                <span className="text-amber-500">⚡</span>{" "}
                                System Managers
                              </span>
                              <span className="font-bold text-slate-900">
                                2
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full w-[40%] rounded-full bg-amber-400" />
                            </div>
                          </div>

                          {/* Role 3 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                                <span className="text-emerald-500">🛡️</span>{" "}
                                Quality Engineers
                              </span>
                              <span className="font-bold text-slate-900">
                                1
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full w-[25%] rounded-full bg-emerald-500" />
                            </div>
                          </div>
                        </div>

                        {/* Footer link */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                            Enter User Management Panel{" "}
                            <span className="text-sm">→</span>
                          </span>
                        </div>
                      </div>

                      {/* Right Column: Project Directories */}
                      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-blue-600" />
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                  Project Directories
                                </h4>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Repositories & scope clusters
                              </p>
                            </div>
                            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                              DIR
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100">
                            <div className="py-3 flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold text-slate-800">
                                  Active Code Clusters
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  Active
                                </p>
                              </div>
                              <span className="text-lg font-bold text-slate-900">
                                5
                              </span>
                            </div>

                            <div className="py-3 flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold text-slate-800">
                                  Unassigned Scopes
                                </p>
                                <span className="inline-block mt-0.5 rounded bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-600 uppercase tracking-wider">
                                  Action Needed
                                </span>
                              </div>
                              <span className="text-lg font-bold text-slate-900">
                                1
                              </span>
                            </div>

                            <div className="py-3 flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold text-slate-800">
                                  Archived Nodes
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  Cold Storage
                                </p>
                              </div>
                              <span className="text-lg font-bold text-slate-900">
                                1
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                          <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center justify-between">
                            Review Active Directories{" "}
                            <span className="text-sm">→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="border-y border-slate-100 bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-black text-blue-600 sm:text-4xl">
                    {stat.value}
                  </div>

                  <div className="mt-2 text-sm text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Everything connected
              </span>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Everything your team needs
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Replace scattered tools and disconnected workflows with one
                centralized workspace designed for modern software teams.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 transition group-hover:bg-blue-600">
                      <Icon className="h-6 w-6 text-blue-600 transition group-hover:text-white" />
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>

                    <button className="mt-5 flex items-center gap-1 text-sm font-semibold text-blue-600">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section
          id="how-it-works"
          className="overflow-hidden bg-slate-50 py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                  Simple workflow
                </span>

                <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                  From idea to deployment in one place.
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  UCollyx connects your team's complete development lifecycle,
                  helping everyone stay focused, informed, and productive.
                </p>

                <div className="mt-10 space-y-7">
                  {[
                    {
                      number: "01",
                      title: "Create your workspace",
                      description:
                        "Set up a workspace for your company, startup, or software team.",
                    },
                    {
                      number: "02",
                      title: "Build your project",
                      description:
                        "Create projects, invite your team, assign tasks, and organize your workflow.",
                    },
                    {
                      number: "03",
                      title: "Collaborate & deploy",
                      description:
                        "Communicate, develop, review, and deploy without leaving your workspace.",
                    },
                  ].map((step) => (
                    <div key={step.number} className="flex gap-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
                        {step.number}
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {step.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="absolute -inset-10 rounded-full bg-blue-100/60 blur-3xl" />

                <div className="relative rounded-3xl border border-blue-100 bg-white p-6 shadow-2xl shadow-blue-900/10">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Project</p>
                        <h3 className="font-bold">UCollyx Platform</h3>
                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        Active
                      </span>
                    </div>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-[76%] rounded-full bg-blue-600" />
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-slate-400">
                      <span>Project progress</span>
                      <span>76%</span>
                    </div>

                    <div className="mt-7 space-y-3">
                      {[
                        ["Frontend", "Completed"],
                        ["Backend API", "In Progress"],
                        ["Deployment", "In Progress"],
                        ["Testing", "Pending"],
                      ].map(([name, status]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between rounded-xl bg-white p-4"
                        >
                          <span className="text-sm font-medium">{name}</span>

                          <span
                            className={`text-xs font-semibold ${
                              status === "Completed"
                                ? "text-blue-600"
                                : status === "In Progress"
                                  ? "text-slate-700"
                                  : "text-slate-400"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section id="about" className="py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white shadow-xl shadow-blue-600/20">
              U
            </div>

            <h2 className="mt-7 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Built to bring teams together.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              UCollyx provides a single digital workspace where software
              developers, project managers, and tech startups can collaborate
              seamlessly from planning to production.
            </p>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-6 pb-24 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-8 py-16 text-center shadow-2xl shadow-blue-600/20 sm:px-16">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-blue-400/30 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-black text-white sm:text-5xl">
                Ready to build better together?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
                Bring your projects, people, and development workflow into one
                powerful workspace.
              </p>

              <button
                onClick={() => navigate("/register")}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-blue-600 shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Start Building with UCollyx
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div>
              <img src="/ucollyx.png" alt="" className="w-30" />
            </div>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} UCollyx. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
