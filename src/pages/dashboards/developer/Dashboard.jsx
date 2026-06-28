import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "../../../api/services/projectService";
import { taskService } from "../../../api/services/taskService";
import {
  ClipboardList,
  AlertTriangle,
  Layout,
  Video,
  Clock,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Activity,
  Layers,
  Compass,
} from "lucide-react";
import { useAssignedIssues } from "../../../hooks/useIssues";
import { useMeetingsHub } from "../../../hooks/useMeetingsHub";
import API from "../../../api/axios";

// Ultra Soft Rounded Badge
const SoftBadge = ({ text }) => {
  const styles = {
    todo: "bg-slate-200/40 text-slate-600 border-slate-300/30",
    inprogress: "bg-sky-100/50 text-sky-600 border-sky-200/40",
    "In Progress": "bg-amber-100/50 text-amber-600 border-amber-200/40",
    review: "bg-violet-100/50 text-violet-600 border-violet-200/40",
    done: "bg-emerald-100/50 text-emerald-600 border-emerald-200/40",
    HIGH: "bg-rose-100/60 text-rose-600 border-rose-200/40 animate-pulse",
    Success: "bg-emerald-100/50 text-emerald-600 border-emerald-200/40",
  };

  const displayTexts = {
    todo: "To Do",
    inprogress: "In Progress",
    review: "Review",
    done: "Done",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.01)] ${styles[text] || "bg-white/60 text-slate-500 border-slate-200/50"}`}
    >
      {displayTexts[text] || text}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: myProjectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["my-projects"],
    queryFn: () => projectService.getMyProjects(),
  });

  const { data: todaysTasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["todays-tasks"],
    queryFn: () => taskService.getTodayTasks(),
  });


  const { data: portfolioResponse } = useQuery({
      queryKey: ['developer-project-dashboard'],
      queryFn: async () => {
        const res = await API.get('/projects/developer-project-dashboard'); 
        return res.data;
      },
      refetchOnWindowFocus: false,
    });

  const user_name =
    JSON.parse(localStorage.getItem("user"))?.full_name || "Developer";

  const activeProjects = myProjectsData?.data || [];
  const todaysTasks = todaysTasksData?.data || [];
  const criticalAlerts = todaysTasks;

  const { meetings } = useMeetingsHub();

  const { data: issues = [] } = useAssignedIssues();

  console.log("==========Hello World========", portfolioResponse);

  const handleProjectNavigation = (id, name, taskId) => {
    const encodedName = encodeURIComponent(name);
    const highlightParam = taskId ? `&highlightTaskId=${taskId}` : "";
    navigate(
      `/dev/board?projectId=${id}&projectName=${encodedName}${highlightParam}`,
    );
  };

  if (projectsLoading || tasksLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f5f9]">
        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4">
          Calibrating Fluid Space...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 min-h-screen font-sans text-slate-800 selection:bg-indigo-100 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-sky-200/30 to-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-gradient-to-tr from-purple-200/20 to-pink-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-blue-200/10 rounded-full blur-[90px] pointer-events-none" />

      <header className="relative mx-auto mb-10 p-8 bg-white backdrop-blur-2xl border border-gray-100 rounded-md shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-indigo-500/80 uppercase tracking-[0.25em]">
              Workspace Stream Alpha
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent font-black">
                {user_name}
              </span>
            </h1>
            <p className="text-slate-500 text-xs font-medium">
              Your focus matrix reports{" "}
              <span className="font-bold text-rose-500/90 underline decoration-wavy decoration-rose-300">
                {criticalAlerts.length} urgent triggers
              </span>{" "}
              requiring immediate session binding.
            </p>
          </div>

          {/* Minimalist Live Digital Node */}
          <div className="flex items-center gap-3 bg-white backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.01)] self-start md:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-slate-700 tracking-widest tabular-nums">
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </div>
      </header>

      <div className=" mx-auto grid grid-cols-12 gap-8 relative z-10">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section className="bg-white backdrop-blur-2xl border border-gray-100 rounded-md shadow-sm p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-0.5">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2.5 tracking-tight">
                  <ClipboardList size={18} className="text-indigo-500" />{" "}
                  Current Session Stream
                </h2>
                <p className="text-slate-400 text-[11px] font-medium">
                  Click a node to instantly flash focus it inside the workspace
                  board view.
                </p>
              </div>
              <button
                onClick={() => navigate("/dev/board")}
                className="text-[9px] font-black text-slate-600 bg-white/80 hover:bg-indigo-600 hover:text-white border border-white px-4 py-2 rounded-xl transition-all tracking-widest uppercase shadow-sm flex items-center gap-2"
              >
                Board View <ArrowUpRight size={12} />
              </button>
            </div>

            <div className="space-y-3">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    onClick={() =>
                      handleProjectNavigation(
                        task.project_id || task.projectId,
                        task.Project?.name || task.projectName,
                        task.id,
                      )
                    }
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/20 border border-white/40 hover:border-indigo-400/40 hover:bg-white/80 hover:shadow-[0_20px_40px_rgba(99,102,241,0.04)] transition-all duration-500 cursor-pointer group/card gap-4"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-8 h-8 rounded-xl bg-white/80 border border-white/80 flex items-center justify-center font-black text-slate-400 group-hover/card:text-indigo-600 group-hover/card:scale-105 transition-all text-[11px] shadow-sm shrink-0">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-slate-800 text-sm group-hover/card:text-indigo-600 transition-colors tracking-tight">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <SoftBadge text={task.status} />
                          {task.priority && <SoftBadge text={task.priority} />}
                          <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block" />
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <Clock size={11} />{" "}
                            {new Date(task.due_time).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/20">
                      <span className="text-[9px] font-black text-indigo-500/70 bg-indigo-50/50 border border-indigo-100/30 px-2.5 py-0.5 rounded-md sm:hidden">
                        {task.Project?.name || "System"}
                      </span>
                      <div className="p-2 rounded-xl bg-white/60 border border-white group-hover/card:bg-indigo-600 group-hover/card:text-white transition-all shadow-sm shrink-0 ml-auto sm:ml-0">
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-[11px] font-black text-slate-400 border border-dashed border-slate-300/60 rounded-2xl bg-white/10">
                  Matrix cleared. Zero pending stream focus allocated.
                </div>
              )}
            </div>
          </section>

          <section className="bg-white backdrop-blur-xl border border-gray-100 rounded-md shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex w-full justify-between">
                <div className="flex gap-2">
                  <div className="p-2 bg-white rounded-sm text-rose-500 border border-rose-200/20">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="">
                    <h2 className="text-base font-black text-rose-950 tracking-tight">
                      Ecosystem Breakpoints
                    </h2>
                    <p className="text-[10px] font-medium text-rose-700/50">
                      Runtime exceptions halting staging or edge branches.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/dev/issues")}
                  className="text-[9px] font-black text-slate-600 bg-white/80 hover:bg-indigo-600 hover:text-white border border-white px-4 py-2 rounded-xl transition-all tracking-widest uppercase shadow-sm flex items-center gap-2"
                >
                  All Errors <ArrowUpRight size={12} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issues.length > 0 ? (
                issues.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-white backdrop-blur-md border border-white/60 p-5 rounded-2xl hover:bg-white/80 hover:shadow-lg hover:border-rose-300/40 transition-all duration-500 group/alert cursor-pointer flex flex-col justify-between gap-4"
                  >
                    <p className="font-extrabold text-slate-800 text-sm tracking-tight leading-snug group-hover/alert:text-rose-600 transition-colors">
                      {alert.title}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/20">
                      <span className="text-[9px] font-black tracking-widest text-rose-600 uppercase bg-rose-100/40 border border-rose-200/30 px-2 py-0.5 rounded">
                        {alert?.description || "Global Stack"}
                      </span>
                      <SoftBadge
                        className="flex justify-center items-center"
                        text={alert?.severity}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-[11px] font-bold text-emerald-600 bg-white border border-emerald-100/40 rounded-2xl shadow-inner">
                  ✓ Core arrays and clusters completely stable. No trace errors
                  found.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <section className="bg-white backdrop-blur-2xl border border-gray-100 rounded-md shadow-sm p-6 md:p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <Layers size={16} className="text-indigo-500" /> Active Repos
              </h2>
              <button
                onClick={() => navigate("/dev/my-projects")}
                className="text-[9px] font-black text-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-xl border border-indigo-100/40 transition-all tracking-widest uppercase shadow-sm"
              >
                All Matrix
              </button>
            </div>

            <div className="space-y-5">
              {portfolioResponse?.data.length > 0 ? (
                portfolioResponse?.data.map((project) => {
                  return (
                    <div
                      key={project.id}
                      onClick={() =>
                        handleProjectNavigation(project.id, project.name)
                      }
                      className="group cursor-pointer p-2.5 -mx-1 rounded-2xl hover:bg-white/60 border border-transparent hover:border-white transition-all duration-500"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            Cluster Sprint {project.current_sprint}
                          </p>
                          <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight">
                            {project.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-700 bg-white border border-white shadow-sm rounded-lg px-2 py-0.5 tabular-nums">
                          {project.progress}%
                        </span>
                      </div>

                      {/* Minimalist Neo Soft Progress Line */}
                      <div className="w-full h-1 bg-slate-200/60 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-[11px] font-bold text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  No active instances deployed.
                </div>
              )}
            </div>
          </section>

          <section className="bg-white backdrop-blur-2xl border border-gray-100 rounded-md shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-white/80 rounded-sm text-slate-600 border border-white">
                <Layout size={14} />
              </div>
              <h2 className="font-black text-slate-900 text-sm tracking-tight">
                Vercel Edge Gateways
              </h2>
            </div>

            <div className="space-y-2">
              {["Production", "Staging", "Sandbox-Dev"].map((env) => (
                <div
                  key={env}
                  className="flex items-center justify-between p-3.5 bg-white/20 border border-white/30 rounded-2xl hover:bg-white/60 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${env === "Staging" ? "bg-amber-400 animate-pulse" : "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]"}`}
                    />
                    <span className="text-[10px] font-black text-slate-600 tracking-wider uppercase">
                      {env}
                    </span>
                  </div>
                  <SoftBadge
                    text={env === "Staging" ? "In Progress" : "Success"}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="relative rounded-md shadow-sm p-5 bg-gradient-to-br from-slate-900/90 to-indigo-950/90 text-white overflow-hidden group">
            {/* <div className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" /> */}

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg text-indigo-300 border border-white/10">
                  <Activity size={14} className="animate-pulse" />
                </div>
                <span className="text-[9px] font-black tracking-[0.2em] text-indigo-300 uppercase">
                  Ecosystem Sync
                </span>
              </div>
              <button
                onClick={() => navigate("/dev/meetings")}
                className="text-[9px] font-black text-indigo-300/80 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/5 transition-all tracking-wider uppercase backdrop-blur-md"
              >
                All Meetings
              </button>
            </div>

            {meetings.map((meeting) => {
              // Date aur Time ko beautiful read-only local formats mein transform kiya
              const meetingDate = new Date(
                meeting?.start_time,
              ).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              });

              const startTime = new Date(
                meeting?.start_time,
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const endTime = new Date(meeting?.end_time).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              );

              return (
                <div
                  key={meeting?.id || meeting?._id}
                  className="bg-white/[0.03] backdrop-blur-xl border mb-4 border-white/[0.06] rounded-2xl p-4 relative z-10"
                >
                  <h3 className="text-sm font-black tracking-tight mb-0.5 text-white truncate">
                    {meeting?.title}
                  </h3>

                  {/* 🗓️ Displaying Date along with clear Start & End Time strings */}
                  <p className="text-[10px] text-slate-400 font-semibold mb-4 flex items-center gap-1.5">
                    <Clock size={11} className="text-indigo-400 shrink-0" />
                    <span className="text-slate-300">{meetingDate}</span>
                    <span className="text-slate-500">•</span>
                    <span>
                      {startTime} — {endTime}
                    </span>
                  </p>

                  {/* 🎯 Perfectly Anchored New-Tab Open Action Button */}
                  <a
                    href={meeting?.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white text-slate-950 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 shadow-md no-underline"
                  >
                    Join Stream Room <ExternalLink size={11} />
                  </a>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
