// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import InviteModal from "./InviteModal";
// import Modal from "../../../components/ui/Modal";
// import toast from "react-hot-toast";
// import PendingRequestsModal from "./PendingRequestsModal";
// import { useDashboardStats } from "../../../hooks/useWorkspace";
// import { useQueryClient } from "@tanstack/react-query";
// import useLocalStorage from "../../../hooks/custom/useLocalStorage";
// import {
//   Users,
//   Layers,
//   ShieldAlert,
//   History,
//   ArrowRight,
//   Sparkles,
//   Hexagon,
//   Terminal,
//   Compass,
// } from "lucide-react";
// import InstanceActivityMatrix from "../../../components/InstanceActivityMatrix";
// import API from "../../../api/axios";

// const OrganizationDashboard = () => {
 
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchLogs = async () => {
//     try {
//       const response = await API.get('/activity-matrix');
//       console.log("Fetched logs from backend:", response);
//       const data = await response.data;
//       setLogs(data);
//     } catch (err) {
//       console.error("Error loading logs from backend file:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLogs();
    
//     // Optional: Auto-refresh logs every 10 seconds for real-time tracking
//     const interval = setInterval(fetchLogs, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   console.log(logs)

//   const [user] = useLocalStorage("user", null);
//   const id = user?.workspace_id;

//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
//   const [showInviteModal, setShowInviteModal] = useState(false);

//   // React Query Hook
//   const { data: statsResp, isLoading, isError } = useDashboardStats(id);
//   const stats = statsResp?.data;

//   // Handle Request Action
//   const handleRequestAction = (message) => {
//     toast.success(message);
//     queryClient.invalidateQueries(["dashboard-stats", id]);

//     if (stats?.pendingList?.length <= 1) {
//       setIsPendingModalOpen(false);
//     }
//   };

//   const total = stats?.users?.total || 0;
//   const devPercentage = total
//     ? Math.round((stats?.users?.developers / total) * 100)
//     : 0;
//   const managerPercentage = total
//     ? Math.round((stats?.users?.managers / total) * 100)
//     : 0;
//   const qaPercentage = total ? Math.round((stats?.users?.qa / total) * 100) : 0;

//   if (isLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-10 h-10 border-4 border-[#3b59ff] border-t-transparent rounded-full animate-spin" />
//           <div className="text-[#3b59ff] font-black text-xs uppercase tracking-[0.2em]">
//             UCollyx Engine Syncing...
//           </div>
//         </div>
//       </div>
//     );

//   if (isError)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-sm font-bold text-red-500 bg-[#f8fafc]">
//         Data telemetry sync failed. Check cloud instance connection routing.
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-8 lg:p-12 font-sans text-left relative overflow-hidden selection:bg-[#3b59ff]/10">
//       {/* Structural Ambient Mesh Background Layers */}
//       <div className="absolute top-[-10%] right-[-5%] w-[650px] h-[650px] bg-gradient-to-bl from-[#3b59ff]/10 to-[#00f2fe]/15 rounded-full blur-[120px] pointer-events-none" />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#9d4edd]/10 to-[#3b59ff]/10 rounded-full blur-[100px] pointer-events-none" />

//       <Modal />

//       {/* DYNAMIC MASTER HEADER BANNER CONTAINER */}
//       <div className="bg-white/70 backdrop-blur-xl border rounded-md shadow-sm border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden z-10">
//         <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#3b59ff]/5 to-transparent pointer-events-none" />
//         <div className="flex items-center gap-4.5">
//           <div className="w-14 h-14 bg-gradient-to-tr from-[#3b59ff] to-[#8a2be2] p-3.5 rounded-md shadow-sm text-white shadow-blue-500/10 shrink-0 flex items-center justify-center">
//             <Hexagon size={28} strokeWidth={2.5} className="animate-pulse" />
//           </div>
//           <div>
//             <nav className="flex items-center gap-1.5 text-[10px] font-black text-[#3b59ff] uppercase tracking-widest mb-1">
//               <span>Ecosystem Hub</span>
//               <span className="text-gray-300">/</span>
//               <span className="text-gray-400">Control Panel</span>
//             </nav>
//             <h1 className="text-2xl md:text-3xl font-black text-[#1a1d2f] tracking-tight">
//               {stats?.workspace?.name || "Target Instance"}
//             </h1>
//             <p className="text-gray-400 text-xs font-medium mt-0.5">
//               Live routing status updates and key infrastructure metrics
//               dashboard.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setIsPendingModalOpen(true)}
//             className="relative px-4 py-2.5 bg-white border border-gray-100 hover:border-[#3b59ff]/30 text-gray-700 font-bold text-xs rounded-md shadow-sm flex items-center gap-2 transition-all active:scale-95"
//           >
//             <span>Pending Gates</span>
//             {stats?.users?.pending > 0 && (
//               <span className="bg-amber-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md shadow-sm animate-bounce">
//                 {stats.users.pending}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* DASHBOARD MODULAR GRID ENGINE */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
//         {/* PANEL 1: TEAM & ACCESS SYSTEM */}
//         <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-md shadow-sm  border-gray-100 p-8 border flex flex-col justify-between group">
//           <div>
//             <div className="flex justify-between items-start mb-10">
//               <div className="space-y-1">
//                 <h3 className="text-base font-black text-[#1a1d2f] flex items-center gap-2">
//                   <Users size={16} className="text-[#3b59ff]" /> Users & Access
//                   Index
//                 </h3>
//                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
//                   Active operators and telemetry pipelines
//                 </p>
//               </div>
//               <div className="w-10 h-10 bg-[#f8fafc] border border-gray-100 rounded-md shadow-sm flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-[#3b59ff]/5 group-hover:text-[#3b59ff] transition-all">
//                 IDX
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-100/60 pb-8 mb-8">
//               <div className="bg-[#f8fafc]/80 border border-gray-100 p-5 rounded-md shadow-sm flex items-center justify-between">
//                 <div>
//                   <span className="text-xs font-bold text-gray-400 block mb-0.5">
//                     Total Users Assigned
//                   </span>
//                   <span className="text-3xl font-black text-[#1a1d2f] tracking-tight">
//                     {stats?.users?.total || 0}
//                   </span>
//                 </div>
//                 <div className="p-2.5 bg-[#3b59ff]/5 rounded-md shadow-sm text-[#3b59ff] text-xs font-bold">
//                   Live Node
//                 </div>
//               </div>

//               <div className="bg-[#f8fafc]/80 border border-gray-100 p-5 rounded-md shadow-sm flex items-center justify-between">
//                 <div>
//                   <span className="text-xs font-bold text-gray-400 block mb-0.5">
//                     Pending Approvals
//                   </span>
//                   <span className="text-3xl font-black text-amber-500 tracking-tight">
//                     {stats?.users?.pending || 0}
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => setIsPendingModalOpen(true)}
//                   disabled={!stats?.users?.pending}
//                   className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 disabled:bg-gray-100 text-amber-600 disabled:text-gray-400 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
//                 >
//                   Inspect Gate
//                 </button>
//               </div>
//             </div>

//             {/* METRIC SECTOR LOADING PROGRESS STATS */}
//             <div className="space-y-5">
//               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
//                 Role Allocation Shares
//               </h4>

//               <div className="space-y-2">
//                 <div className="flex justify-between text-[11px] font-bold text-gray-600">
//                   <span className="flex items-center gap-2">
//                     <Terminal size={12} className="text-[#3b59ff]" /> Developers
//                   </span>
//                   <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#1a1d2f]">
//                     {stats?.users?.developers || 0}
//                   </span>
//                 </div>
//                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-[#3b59ff] to-[#00f2fe] rounded-full transition-all duration-1000 ease-out"
//                     style={{ width: `${devPercentage}%` }}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between text-[11px] font-bold text-gray-600">
//                   <span className="flex items-center gap-2">
//                     <Compass size={12} className="text-amber-500" /> System
//                     Managers
//                   </span>
//                   <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#1a1d2f]">
//                     {stats?.users?.managers || 0}
//                   </span>
//                 </div>
//                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
//                     style={{ width: `${managerPercentage}%` }}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between text-[11px] font-bold text-gray-600">
//                   <span className="flex items-center gap-2">
//                     <Layers size={12} className="text-emerald-500" /> Quality
//                     Engineers
//                   </span>
//                   <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#1a1d2f]">
//                     {stats?.users?.qa || 0}
//                   </span>
//                 </div>
//                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-out"
//                     style={{ width: `${qaPercentage}%` }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={() => navigate("/org-admin/users")}
//             className="mt-10 text-xs font-black text-[#3b59ff] hover:text-[#2a44d4] flex items-center gap-1.5 group/btn border-t border-gray-100/70 pt-4"
//           >
//             <span>Enter User Management Panel</span>
//             <ArrowRight
//               size={14}
//               className="group-hover:translate-x-1 transition-transform"
//             />
//           </button>
//         </div>

//         {/* PANEL 2: PROJECT TEAMS PIPELINE */}
//         <div className="bg-white/70 backdrop-blur-xl rounded-md shadow-sm  border-gray-100 p-8 border flex flex-col justify-between">
//           <div>
//             <div className="flex justify-between items-start mb-10">
//               <div className="space-y-1">
//                 <h3 className="text-base font-black text-[#1a1d2f] flex items-center gap-2">
//                   <Layers size={16} className="text-[#9d4edd]" /> Project
//                   Directories
//                 </h3>
//                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
//                   Repositories & Scope clusters
//                 </p>
//               </div>
//               <div className="w-10 h-10 bg-[#f8fafc] border border-gray-100 rounded-md shadow-sm flex items-center justify-center text-xs font-black text-gray-400">
//                 DIR
//               </div>
//             </div>

//             <div className="divide-y divide-gray-100/80">
//               {[
//                 {
//                   label: "Active Code Clusters",
//                   val: stats?.projects?.active,
//                   status: "Active",
//                 },
//                 {
//                   label: "Unassigned Scopes",
//                   val: stats?.projects?.withoutManager,
//                   tag: "Action Needed",
//                 },
//                 {
//                   label: "Archived Nodes",
//                   val: stats?.projects?.archived,
//                   status: "Cold Storage",
//                 },
//               ].map((row, i) => (
//                 <div
//                   key={i}
//                   className="py-4.5 flex justify-between items-center group/row cursor-default"
//                 >
//                   <div className="space-y-1">
//                     <span className="text-sm font-bold text-gray-600 group-hover/row:text-[#1a1d2f] transition-colors">
//                       {row.label}
//                     </span>
//                     {row.tag && (
//                       <span
//                         onClick={() => navigate("/org-admin/projects")}
//                         className="block w-max bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider cursor-pointer"
//                       >
//                         {row.tag}
//                       </span>
//                     )}
//                     {row.status && (
//                       <span className="block text-[10px] text-gray-400 font-medium">
//                         {row.status}
//                       </span>
//                     )}
//                   </div>
//                   <span className="text-2xl font-black text-[#1a1d2f] font-mono">
//                     {row.val || 0}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <button
//             onClick={() => navigate("/org-admin/projects")}
//             className="mt-10 text-xs font-black text-[#3b59ff] hover:text-[#2a44d4] flex items-center gap-1.5 border-t border-gray-100/70 pt-4"
//           >
//             <span>Review Active Directories</span> <ArrowRight size={14} />
//           </button>
//         </div>

//         {/* PANEL 3: SECURITY TELEMETRY ALERTS */}
//         <div className="bg-white/70 backdrop-blur-xl rounded-md shadow-sm  border-gray-100 p-8 border flex flex-col justify-between">
//           <div>
//             <div className="space-y-1 mb-8">
//               <h3 className="text-base font-black text-[#1a1d2f] flex items-center gap-2">
//                 <ShieldAlert size={16} className="text-amber-500" /> Conflict
//                 Guard
//               </h3>
//               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
//                 Permission alerts and loose role handling
//               </p>
//             </div>

//             {/* Warning Alert Box */}
//             <div className="bg-amber-50/70 border border-amber-200/50 p-4.5 rounded-md shadow-sm mb-8 flex gap-3.5 items-center">
//               <div className="w-1.5 h-10 bg-amber-500 rounded-full shrink-0" />
//               <div>
//                 <h4 className="text-[9px] font-black text-amber-800 uppercase tracking-widest">
//                   Telemetries Mismatch
//                 </h4>
//                 <p className="text-xs font-bold text-gray-700 mt-0.5">
//                   {stats?.alerts?.withoutRoles || 0} active instances running
//                   without permissions keys.
//                 </p>
//               </div>
//             </div>

//             <div className="divide-y divide-gray-100/80">
//               <div className="py-4.5 flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-bold text-gray-600">
//                     Unassigned Profiles
//                   </span>
//                   <span className="bg-red-50 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
//                     Urgent
//                   </span>
//                 </div>
//                 <span className="text-xl font-black text-[#1a1d2f] font-mono">
//                   {stats?.alerts?.withoutRoles || 0}
//                 </span>
//               </div>
//               <div className="py-4.5 flex justify-between items-center">
//                 <span className="text-sm font-bold text-gray-600">
//                   Access Overlaps
//                 </span>
//                 <span className="text-xl font-black text-[#1a1d2f] font-mono">
//                   {stats?.alerts?.conflicts || 0}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <button className="mt-10 text-xs font-black text-[#3b59ff] hover:text-[#2a44d4] flex items-center gap-1.5 border-t border-gray-100/70 pt-4">
//             <span>Enforce System Audit</span> <ArrowRight size={14} />
//           </button>
//         </div>

//         <InstanceActivityMatrix
//           logs={logs}
//           onQueryFullLogs={() => console.log("Navigate to full logs page")}
//         />
//       </div>

//       {/* MODAL MOUNT ROUTERS */}
//       {showInviteModal && (
//         <InviteModal
//           onClose={() => setShowInviteModal(false)}
//           onInvite={typeof onInvite !== "undefined" ? onInvite : () => {}}
//         />
//       )}

//       {isPendingModalOpen && (
//         <PendingRequestsModal
//           isOpen={isPendingModalOpen}
//           onClose={() => setIsPendingModalOpen(false)}
//           requests={stats?.pendingList}
//           onActionSuccess={handleRequestAction}
//         />
//       )}
//     </div>
//   );
// };

// export default OrganizationDashboard;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import InviteModal from "./InviteModal";
import Modal from "../../../components/ui/Modal";
import toast from "react-hot-toast";
import PendingRequestsModal from "./PendingRequestsModal";
import { useDashboardStats } from "../../../hooks/useWorkspace";
import { useQueryClient } from "@tanstack/react-query";
import useLocalStorage from "../../../hooks/custom/useLocalStorage";
import {
  Users,
  Layers,
  ShieldAlert,
  History,
  ArrowRight,
  Sparkles,
  Hexagon,
  Terminal,
  Compass,
  ChevronRight,
  Bell,
  Activity
} from "lucide-react";
import InstanceActivityMatrix from "../../../components/InstanceActivityMatrix";
import API from "../../../api/axios";

const OrganizationDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await API.get('/activity-matrix');
      const data = await response.data;
      setLogs(data);
    } catch (err) {
      console.error("Error loading logs from backend file:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const [user] = useLocalStorage("user", null);
  const id = user?.workspace_id;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // React Query Hook
  const { data: statsResp, isLoading, isError } = useDashboardStats(id);
  const stats = statsResp?.data;

  // Handle Request Action
  const handleRequestAction = (message) => {
    toast.success(message);
    queryClient.invalidateQueries(["dashboard-stats", id]);

    if (stats?.pendingList?.length <= 1) {
      setIsPendingModalOpen(false);
    }
  };

  const total = stats?.users?.total || 0;
  const devPercentage = total
    ? Math.round((stats?.users?.developers / total) * 100)
    : 0;
  const managerPercentage = total
    ? Math.round((stats?.users?.managers / total) * 100)
    : 0;
  const qaPercentage = total ? Math.round((stats?.users?.qa / total) * 100) : 0;

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#3b59ff] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#3b59ff] font-black text-[11px] uppercase tracking-[0.2em] text-center">
            UCollyx Engine Syncing...
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-xs sm:text-sm font-bold text-red-500 bg-[#f8fafc] p-6 text-center">
        Data telemetry sync failed. Check cloud instance connection routing.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-8 lg:p-12 font-sans text-left relative overflow-hidden selection:bg-[#3b59ff]/10">
      <div className="absolute top-[-5%] right-[-10%] w-[320px] sm:w-[650px] h-[320px] sm:h-[650px] bg-gradient-to-bl from-[#3b59ff]/10 to-[#00f2fe]/15 rounded-full blur-[70px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-tr from-[#9d4edd]/10 to-[#3b59ff]/10 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

      <Modal />

      {/* DYNAMIC MOBILE APP-LIKE HEADER BANNER */}
      <div className="bg-white/80 backdrop-blur-xl border rounded-2xl sm:rounded-md shadow-sm border-gray-100 p-4 sm:p-8 mb-5 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-full bg-gradient-to-l from-[#3b59ff]/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-3.5 sm:gap-4.5">
          <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#3b59ff] to-[#8a2be2] p-2.5 sm:p-3.5 rounded-xl sm:rounded-md shadow-md shadow-blue-500/10 text-white shrink-0 flex items-center justify-center">
            <Hexagon size={24} strokeWidth={2.5} className="animate-pulse sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <nav className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-[#3b59ff] uppercase tracking-widest mb-0.5">
              <span>Ecosystem Hub</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-400">Control Panel</span>
            </nav>
            <h1 className="text-1xl sm:text-2xl md:text-3xl font-black text-[#1a1d2f] tracking-tight truncate">
              {stats?.workspace?.name || "Target Instance"}
            </h1>
            <p className="text-gray-400 text-[11px] sm:text-xs font-medium mt-0.5 hidden sm:block">
              Live routing status updates and key infrastructure metrics dashboard.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <button
            onClick={() => setIsPendingModalOpen(true)}
            className="w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2.5 bg-white border border-gray-200 hover:border-[#3b59ff]/30 active:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl sm:rounded-md shadow-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95 touch-manipulation"
          >
            <Bell size={14} className="text-amber-500 sm:hidden" />
            <span>Pending Gates</span>
            {stats?.users?.pending > 0 && (
              <span className="bg-amber-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full sm:rounded-md shadow-sm animate-bounce">
                {stats.users.pending}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE QUICK STATS STRIP (App-like Horizontal Scroll / Mini Grid) */}
      <div className="grid grid-cols-2 sm:hidden gap-2.5 mb-5 relative z-10">
        <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Users</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-[#1a1d2f]">{stats?.users?.total || 0}</span>
            <span className="text-[9px] font-black text-[#3b59ff] bg-[#3b59ff]/10 px-1.5 py-0.5 rounded">ACTIVE</span>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Projects</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-[#1a1d2f]">{stats?.projects?.active || 0}</span>
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">RUNNING</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD MODULAR GRID ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 relative z-10">
        
        {/* PANEL 1: TEAM & ACCESS SYSTEM */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-md shadow-sm border-gray-100 p-5 sm:p-8 border flex flex-col justify-between group">
          <div>
            <div className="flex justify-between items-start mb-6 sm:mb-10">
              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="text-sm sm:text-base font-black text-[#1a1d2f] flex items-center gap-2">
                  <Users size={16} className="text-[#3b59ff]" /> Users & Access Index
                </h3>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  Active operators and telemetry pipelines
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#f8fafc] border border-gray-100 rounded-lg sm:rounded-md shadow-sm flex items-center justify-center text-[10px] sm:text-xs font-black text-gray-400 group-hover:bg-[#3b59ff]/5 group-hover:text-[#3b59ff] transition-all">
                IDX
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8 items-center border-b border-gray-100/60 pb-6 sm:pb-8 mb-6 sm:mb-8">
              <div className="bg-[#f8fafc]/80 border border-gray-100 p-4 sm:p-5 rounded-xl sm:rounded-md shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-400 block mb-0.5">
                    Total Users Assigned
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#1a1d2f] tracking-tight">
                    {stats?.users?.total || 0}
                  </span>
                </div>
                <div className="p-2 sm:p-2.5 bg-[#3b59ff]/5 rounded-lg sm:rounded-md shadow-sm text-[#3b59ff] text-[10px] sm:text-xs font-bold">
                  Live Node
                </div>
              </div>

              <div className="bg-[#f8fafc]/80 border border-gray-100 p-4 sm:p-5 rounded-xl sm:rounded-md shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-400 block mb-0.5">
                    Pending Approvals
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight">
                    {stats?.users?.pending || 0}
                  </span>
                </div>
                <button
                  onClick={() => setIsPendingModalOpen(true)}
                  disabled={!stats?.users?.pending}
                  className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 disabled:bg-gray-100 text-amber-600 disabled:text-gray-400 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer touch-manipulation"
                >
                  Inspect Gate
                </button>
              </div>
            </div>

            {/* METRIC SECTOR PROGRESS STATS */}
            <div className="space-y-4 sm:space-y-5">
              <h4 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Role Allocation Shares
              </h4>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-600">
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <Terminal size={12} className="text-[#3b59ff]" /> Developers
                  </span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#1a1d2f]">
                    {stats?.users?.developers || 0}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3b59ff] to-[#00f2fe] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${devPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-600">
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <Compass size={12} className="text-amber-500" /> System Managers
                  </span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#1a1d2f]">
                    {stats?.users?.managers || 0}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${managerPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-600">
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <Layers size={12} className="text-emerald-500" /> Quality Engineers
                  </span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#1a1d2f]">
                    {stats?.users?.qa || 0}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${qaPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/org-admin/users")}
            className="mt-6 sm:mt-10 text-xs font-black text-[#3b59ff] hover:text-[#2a44d4] flex items-center justify-between sm:justify-start gap-1.5 group/btn border-t border-gray-100/70 pt-4 cursor-pointer touch-manipulation"
          >
            <span>Enter User Management Panel</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* PANEL 2: PROJECT TEAMS PIPELINE */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-md shadow-sm border-gray-100 p-5 sm:p-8 border flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6 sm:mb-10">
              <div className="space-y-0.5 sm:space-y-1">
                <h3 className="text-sm sm:text-base font-black text-[#1a1d2f] flex items-center gap-2">
                  <Layers size={16} className="text-[#9d4edd]" /> Project Directories
                </h3>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  Repositories & Scope clusters
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#f8fafc] border border-gray-100 rounded-lg sm:rounded-md shadow-sm flex items-center justify-center text-[10px] sm:text-xs font-black text-gray-400">
                DIR
              </div>
            </div>

            <div className="divide-y divide-gray-100/80">
              {[
                {
                  label: "Active Code Clusters",
                  val: stats?.projects?.active,
                  status: "Active",
                },
                {
                  label: "Unassigned Scopes",
                  val: stats?.projects?.withoutManager,
                  tag: "Action Needed",
                },
                {
                  label: "Archived Nodes",
                  val: stats?.projects?.archived,
                  status: "Cold Storage",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="py-3.5 sm:py-4.5 flex justify-between items-center group/row cursor-default"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-bold text-gray-600 group-hover/row:text-[#1a1d2f] transition-colors">
                      {row.label}
                    </span>
                    {row.tag && (
                      <span
                        onClick={() => navigate("/org-admin/projects")}
                        className="block w-max bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider cursor-pointer active:scale-95 transition-transform"
                      >
                        {row.tag}
                      </span>
                    )}
                    {row.status && (
                      <span className="block text-[9px] sm:text-[10px] text-gray-400 font-medium">
                        {row.status}
                      </span>
                    )}
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-[#1a1d2f] font-mono">
                    {row.val || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/org-admin/projects")}
            className="mt-6 sm:mt-10 text-xs font-black text-[#3b59ff] hover:text-[#2a44d4] flex items-center justify-between sm:justify-start gap-1.5 border-t border-gray-100/70 pt-4 cursor-pointer touch-manipulation"
          >
            <span>Review Active Directories</span> <ArrowRight size={14} />
          </button>
        </div>

        {/* LOGS MATRIX FULL WIDTH COMPONENT */}
        <div className="lg:col-span-3">
          <InstanceActivityMatrix
            logs={logs}
            onQueryFullLogs={() => console.log("Navigate to full logs page")}
          />
        </div>
      </div>

      {/* MODAL MOUNT ROUTERS */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={typeof onInvite !== "undefined" ? onInvite : () => {}}
        />
      )}

      {isPendingModalOpen && (
        <PendingRequestsModal
          isOpen={isPendingModalOpen}
          onClose={() => setIsPendingModalOpen(false)}
          requests={stats?.pendingList}
          onActionSuccess={handleRequestAction}
        />
      )}
    </div>
  );
};

export default OrganizationDashboard;