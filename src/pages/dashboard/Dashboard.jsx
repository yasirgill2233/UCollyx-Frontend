// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { projectService } from "../../api/services/projectService";
// import { taskService } from "../../api/services/taskService";
// import {
//   ClipboardList,
//   AlertTriangle,
//   Layout,
//   Video,
//   Clock,
//   ExternalLink,
//   ChevronRight,
//   ArrowUpRight,
//   Sparkles,
// } from "lucide-react";

// const StatusBadge = ({ text }) => {
//   const styles = {
//     "todo": "bg-gray-50 text-gray-700 border-gray-100",
//     "inprogress": "bg-blue-50 text-blue-700 border-blue-100",
//     "In Progress": "bg-amber-50 text-amber-700 border-amber-100",
//     "review": "bg-purple-50 text-purple-700 border-purple-100",
//     "done": "bg-emerald-50 text-emerald-700 border-emerald-100",
//     "HIGH": "bg-rose-50 text-rose-700 border-rose-100",
//     "Success": "bg-emerald-50 text-emerald-700 border-emerald-100",
//   };

//   const dots = {
//     "todo": "bg-gray-400",
//     "inprogress": "bg-blue-400",
//     "In Progress": "bg-amber-400",
//     "review": "bg-purple-400",
//     "done": "bg-emerald-500",
//     "HIGH": "bg-rose-500",
//     "Success": "bg-emerald-500",
//   };

//   const displayTexts = {
//     todo: "To Do",
//     inprogress: "In Progress",
//     review: "Review",
//     done: "Done",
//   };

//   const finalUpdatedText = displayTexts[text] || text;

//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[text] || "bg-gray-50 text-gray-600 border-gray-200"}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full ${dots[text] || "bg-gray-400"}`}></span>
//       {finalUpdatedText}
//     </span>
//   );
// };

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const [currentTime, setCurrentTime] = useState(new Date());

//   // Real-time ticker for ultra-premium dashboard feel
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const { data: myProjectsData, isLoading: projectsLoading } = useQuery({
//     queryKey: ["my-projects"],
//     queryFn: () => projectService.getMyProjects(),
//   });

//   const { data: todaysTasksData, isLoading: tasksLoading } = useQuery({
//     queryKey: ["todays-tasks"],
//     queryFn: () => taskService.getTodayTasks(),
//   });

//   const user_name = JSON.parse(localStorage.getItem('user')).full_name

//   const activeProjects = myProjectsData?.data || [];
//   const todaysTasks = todaysTasksData?.data || [];

//   const criticalAlerts = todaysTasks.filter(task => task.priority === "High" && task.status !== "done");

//   const handleProjectNavigation = (id, name, taskId) => {
//     const encodedName = encodeURIComponent(name);
//     navigate(`/dev/board?projectId=${id}&projectName=${encodedName}&highlightTaskId=${taskId}`);
//   };

//   if (projectsLoading || tasksLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-[#f1f3f67c]">
//         <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
//           Syncing Database Records...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 md:p-12 bg-[#f1f3f67c] min-h-screen font-sans text-slate-900 selection:bg-blue-100">

//      <header className="relative mx-auto mb-10 p-6 md:p-8 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
//         {/* Ambient background mesh fluid circles */}
//         <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>
//         <div className="absolute -bottom-20 left-10 w-60 h-60 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-[60px] -z-10"></div>

//         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//           <div className="flex items-center gap-5">
//             <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-500/20">
//               {user_name[0]}
//             </div>
//             <div className="space-y-1">
//               <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
//                 Welcome back,{" "}
//                 <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 bg-clip-text text-transparent">
//                   {user_name}
//                 </span>
//                 <Sparkles size={18} className="text-amber-400 inline animate-bounce" />
//               </h1>
//               <p className="text-slate-500 text-xs font-medium flex flex-wrap items-center gap-2">
//                 Ecosystem active with
//                 <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-50 text-rose-600 rounded-full font-bold border border-rose-100 text-[10px]">
//                   {criticalAlerts.length} Critical Bottlenecks
//                 </span>
//                 assigned to your current sprint.
//               </p>
//             </div>
//           </div>

//           {/* Dynamic Meta Info */}
//           <div className="flex items-center gap-3 self-end md:self-center bg-slate-100/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/40 shadow-inner">
//             <Clock size={14} className="text-indigo-500" />
//             <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">
//               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             </span>
//             <span className="text-slate-300">|</span>
//             <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
//               {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
//             </span>
//           </div>
//         </div>
//       </header>

//       <div className="mx-auto grid grid-cols-12 gap-8">
//         <div className="col-span-12 lg:col-span-8 space-y-8">
//           <section className="bg-white rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 group">
//             <div className="flex justify-between items-end mb-8">
//               <div>
//                 <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
//                   <ClipboardList className="text-blue-600" size={24} /> Today's Focus
//                 </h2>
//                 <p className="text-slate-400 text-sm mt-1 font-medium">
//                   Prioritized tasks for your current session
//                 </p>
//               </div>
//               <button
//                 onClick={() => navigate("/dev/board")}
//                 className="text-[11px] font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-all tracking-wide uppercase flex gap-2 items-center group/btn"
//               >
//                 Board View{" "}
//                 <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
//               </button>
//             </div>

//             <div className="grid gap-4">
//               {todaysTasks.length > 0 ? (
//                 todaysTasks.map((task, idx) => (
//                   <div
//                     key={task.id}
//                     // onClick={() => handleProjectNavigation(task.project_id || task.projectId, task.Project?.name || task.projectName, task.id)}
//                     className="flex items-center justify-between p-6 rounded-lg bg-[#fcfcfc] border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group/item"
//                   >
//                     <div className="flex items-center gap-6">
//                       <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-black text-slate-300 group-hover/item:text-blue-500 group-hover/item:border-blue-200 transition-all">
//                         0{idx + 1}
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-slate-800 text-lg group-hover/item:text-blue-600 transition-colors">
//                           {task.title}
//                         </h3>
//                         <div className="flex flex-wrap items-center gap-4 mt-2">
//                           <StatusBadge text={task.status} />
//                           {task.priority && <StatusBadge text={task.priority} />}
//                           <span className="h-1 w-1 rounded-full bg-slate-300 hidden sm:inline-block"></span>
//                           <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
//                             <Clock size={14} />{" "}
//                             <span className="text-slate-500 uppercase">
//                               {new Date(task.due_time).toDateString() || "5:00 PM"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleProjectNavigation(task.project_id || task.projectId, task.Project?.name || task.projectName, task.id);
//                       }}
//                       className="p-3 rounded-full hover:bg-blue-50 text-slate-300 hover:text-blue-600 transition-all"
//                     >
//                       <ChevronRight size={24} />
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-12 text-sm font-semibold text-slate-400 border border-dashed border-slate-200 rounded-xl">
//                   No focus tasks assigned for today.
//                 </div>
//               )}
//             </div>
//           </section>

//           <section className="bg-[#FFF5F5] rounded-lg p-8 border border-rose-100 shadow-sm overflow-hidden relative">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
//             <div className="flex justify-between items-center mb-8 relative z-10">
//               <div className="flex items-center gap-4">
//                 <AlertTriangle className="text-rose-500" size={24} />
//                 <h2 className="text-xl font-black text-rose-950 tracking-tight">System Alerts</h2>
//               </div>
//               <button
//                 onClick={() => navigate("/dev/board")}
//                 className="text-xs font-black text-rose-600 hover:underline tracking-widest uppercase"
//               >
//                 Emergency Log
//               </button>
//             </div>

//             <div className="grid md:grid-cols-2 gap-4 relative z-10">
//               {criticalAlerts.length > 0 ? (
//                 criticalAlerts.map((alert) => (
//                   <div
//                     key={alert.id}
//                     onClick={() => handleProjectNavigation(alert.project_id || alert.projectId, alert.Project?.name || alert.projectName)}
//                     className="bg-white/80 backdrop-blur-md border border-rose-200 p-6 rounded-lg hover:shadow-lg transition-all group/alert cursor-pointer"
//                   >
//                     <p className="font-black text-slate-800 text-base leading-tight mb-4 group-hover/alert:text-rose-600 transition-colors">
//                       {alert.title}
//                     </p>
//                     <div className="flex items-center justify-between">
//                       <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
//                         {alert.Project?.name || "System"}
//                       </span>
//                       <StatusBadge text="HIGH" />
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-span-2 text-center py-6 text-sm font-bold text-emerald-600 bg-emerald-50/50 rounded-xl border border-emerald-100">
//                   ✓ All systems structural logs tracking stable.
//                 </div>
//               )}
//             </div>
//           </section>
//         </div>

//         <div className="col-span-12 lg:col-span-4 space-y-8">

//           <section className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
//             <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
//             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>

//             <div className="flex justify-between items-center mb-8 relative z-10">
//               <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Active Projects</h2>
//               <button
//                 onClick={() => navigate("/dev/my-projects")}
//                 className="text-[11px] font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-all tracking-wide uppercase"
//               >
//                 Browse All
//               </button>
//             </div>

//             <div className="space-y-10 relative z-10">
//               {activeProjects.length > 0 ? (
//                 activeProjects.map((project, pIdx) => {
//                   const progressValue = project.progress || 0;
//                   return (
//                     <div
//                       key={project.id}
//                       onClick={() => handleProjectNavigation(project.id, project.name)}
//                       className="group cursor-pointer hover:bg-slate-50/50 p-2 rounded-xl transition-all"
//                     >
//                       <div className="flex justify-between items-start mb-3">
//                         <div>
//                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">
//                             Project 0{pIdx + 1} <span className="mx-2 text-slate-200">|</span> Workspace
//                           </p>
//                           <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
//                             {project.name}
//                           </h3>
//                         </div>
//                         <div className="text-right">
//                           <span className="text-2xl font-black text-slate-900 tabular-nums">
//                             {progressValue}<span className="text-sm text-slate-400 font-medium ml-0.5">%</span>
//                           </span>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-4 mb-3">
//                         <div className="flex-1 h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
//                           <div
//                             className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.3)]"
//                             style={{ width: `${progressValue}%` }}
//                           ></div>
//                         </div>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
//                           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
//                           {project.current_sprint || "Active Development Sprint"}
//                         </p>
//                       </div>

//                       {pIdx < activeProjects.length - 1 && (
//                         <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full"></div>
//                       )}
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="text-center py-6 text-xs text-slate-400 font-bold">
//                   No active projects initialized in DB.
//                 </div>
//               )}
//             </div>
//           </section>

//           <section className="bg-white rounded-lg p-8 border border-slate-100 shadow-sm">
//             <div className="flex items-center gap-3 mb-8">
//               <div className="p-2.5 bg-slate-100 rounded-xl">
//                 <Layout size={20} className="text-slate-600" />
//               </div>
//               <h2 className="font-black text-slate-800">Deployments</h2>
//             </div>
//             <div className="space-y-3">
//               {["Production", "Staging", "Dev"].map((env) => (
//                 <div
//                   key={env}
//                   className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className={`w-2 h-2 rounded-full ${env === "Staging" ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}></div>
//                     <span className="text-sm font-bold text-slate-700">{env}</span>
//                   </div>
//                   <StatusBadge text={env === "Staging" ? "In Progress" : "Success"} />
//                 </div>
//               ))}
//             </div>
//           </section>

//           <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-8 text-white shadow-xl shadow-blue-200">
//             <div className="flex items-center gap-3 mb-6">
//               <Video size={24} className="text-blue-200" />
//               <h2 className="font-black">Up Next</h2>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
//               <h3 className="text-xl font-bold mb-1">Sprint Planning</h3>
//               <div className="flex items-center gap-2 text-blue-100 text-xs font-medium mb-6">
//                 <Clock size={14} /> 11:00 AM — 60 MIN
//               </div>
//               <button className="w-full bg-white text-blue-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
//                 Join Call <ExternalLink size={14} />
//               </button>
//             </div>
//           </section>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "../../api/services/projectService";
import { taskService } from "../../api/services/taskService";
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
import { useAssignedIssues } from "../../hooks/useIssues";
import { useMeetingsHub } from "../../hooks/useMeetingsHub";

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

  const user_name =
    JSON.parse(localStorage.getItem("user"))?.full_name || "Developer";

  const activeProjects = myProjectsData?.data || [];
  const todaysTasks = todaysTasksData?.data || [];
  const criticalAlerts = todaysTasks;

  const { meetings } = useMeetingsHub();

  const { data: issues = [], isLoading, isError } = useAssignedIssues();
  console.log("==========Hello World========", meetings);

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
    <div className="p-4 md:p-12 bg-gradient-to-tr from-[#f4f7fc] via-[#eef2f9] to-[#f6f9fc] min-h-screen font-sans text-slate-800 selection:bg-indigo-100 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-sky-200/30 to-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-gradient-to-tr from-purple-200/20 to-pink-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-blue-200/10 rounded-full blur-[90px] pointer-events-none" />

      <header className="relative mx-auto mb-10 p-8 bg-white/30 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.015)]">
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
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.01)] self-start md:self-center">
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
          <section className="bg-white/40 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.02)]">
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

          <section className="bg-rose-50/20 backdrop-blur-xl border border-rose-100/40 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex w-full justify-between">
                <div className="flex gap-2">
                  <div className="p-2 bg-rose-100/50 rounded-xl text-rose-500 border border-rose-200/20">
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
                    className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-2xl hover:bg-white/80 hover:shadow-lg hover:border-rose-300/40 transition-all duration-500 group/alert cursor-pointer flex flex-col justify-between gap-4"
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
                <div className="col-span-2 text-center py-8 text-[11px] font-bold text-emerald-600 bg-white/30 border border-emerald-100/40 rounded-2xl shadow-inner">
                  ✓ Core arrays and clusters completely stable. No trace errors
                  found.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <section className="bg-white/40 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.02)] relative overflow-hidden">
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
              {activeProjects.length > 0 ? (
                activeProjects.map((project, pIdx) => {
                  const progress = project.progress || 0;
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
                            Cluster Node 0{pIdx + 1}
                          </p>
                          <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight">
                            {project.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-700 bg-white border border-white shadow-sm rounded-lg px-2 py-0.5 tabular-nums">
                          {progress}%
                        </span>
                      </div>

                      {/* Minimalist Neo Soft Progress Line */}
                      <div className="w-full h-1 bg-slate-200/60 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                        {project.current_sprint || "Sprint Lifecycle Running"}
                      </span>
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

          <section className="bg-white/40 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-white/80 rounded-xl text-slate-600 border border-white shadow-sm">
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

          <section className="relative rounded-3xl p-5 bg-gradient-to-br from-slate-900/90 to-indigo-950/90 text-white shadow-xl overflow-hidden group">
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
