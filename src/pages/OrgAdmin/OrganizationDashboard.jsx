// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import InviteModal from "./InviteModal";

// import Modal from "../../components/ui/Modal";
// import toast from "react-hot-toast";
// import API from "../../api/axios";
// import PendingRequestsModal from "./PendingRequestsModal";
// import { useDashboardStats } from "../../hooks/useWorkspace";
// import { useQueryClient } from "@tanstack/react-query";
// import useLocalStorage from "../../hooks/custom/useLocalStorage";

// const OrganizationDashboard = () => {
  
  
//   const [user] = useLocalStorage('user', null)
  
//   const id = user.workspace_id

//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
//   const [showInviteModal, setShowInviteModal] = useState(false);

//   // React Query Hook
//   const { data: statsResp, isLoading, isError } = useDashboardStats(id);
//   const stats = statsResp?.data;


//   console.log("Workspace ID:",id)

//   // Handle Request Action (Refresh logic simplified)
//   const handleRequestAction = (message) => {
//     toast.success(message);
//     // Manual fetch ki bajaye cache invalidate krain
//     queryClient.invalidateQueries(['dashboard-stats', id]);
    
//     if (stats?.pendingList?.length <= 1) {
//       setIsPendingModalOpen(false);
//     }
//   };

//   console.log("Check kro zara",statsResp)

//     const recentActions = [
//     {
//       id: 1,
//       user: "Sarah Johnson",
//       action: "added as Developer",
//       time: "2 hours ago",
//       icon: "👤",
//     },
//     {
//       id: 2,
//       user: "Mike Chen's",
//       action: "role changed to Manager",
//       time: "5 hours ago",
//       icon: "⚙️",
//     },
//     {
//       id: 3,
//       user: "New project",
//       action: '"Mobile App Redesign" created',
//       time: "Yesterday",
//       icon: "📁",
//     },
//     {
//       id: 4,
//       user: "3 team invitations",
//       action: "sent",
//       time: "2 days ago",
//       icon: "📩",
//     },
//     {
//       id: 5,
//       user: "Billing plan",
//       action: "upgraded to Business",
//       time: "3 days ago",
//       icon: "💳",
//     },
//   ];

//   // Stats Calculations (Safety checks ke sath)
//   const total = stats?.users?.total || 0;
//   const devPercentage = total ? Math.round((stats?.users?.developers / total) * 100) : 0;
//   const managerPercentage = total ? Math.round((stats?.users?.managers / total) * 100) : 0;
//   const qaPercentage = total ? Math.round((stats?.users?.qa / total) * 100) : 0;

//   if (isLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
//         <div className="text-indigo-600 font-black text-xl animate-pulse">
//           UCOLLYX ENGINE SYNCING...
//         </div>
//       </div>
//     );

//   if (isError) return <div>Data sync failed. Please check your connection.</div>;
//   return (
//     <div className="min-h-screen bg-[#FDFDFD] p-12 font-sans text-left selection:bg-indigo-100">
//       <Modal />
//       <div className="mx-auto mb-12 flex justify-between items-end">
//         <div>
//           <nav className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">
//             <span>Workspace</span>
//             <span className="text-slate-300">/</span>
//             <span className="text-slate-400">Settings</span>
//           </nav>
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight">
//             {stats?.workspace?.name}
//           </h1>
//           <p className="text-sm text-slate-400 font-medium mt-1">
//             Overview of organization and key metrics
//           </p>
//         </div>
//       </div>

//       <div className="mx-auto grid grid-cols-2 gap-10">
//         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group">
//           <div className="flex justify-between items-start mb-12">
//             <div>
//               <h3 className="text-lg font-black text-slate-800">
//                 Users Overview
//               </h3>
//               <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
//                 Team members and invitations
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors italic">
//               US
//             </div>
//           </div>

//           <div className="space-y-8">
//             <div className="flex justify-between items-end">
//               <span className="text-sm font-bold text-slate-500">
//                 Total Users
//               </span>
//               <span className="text-3xl font-black text-slate-900 leading-none">
//                 {stats.users.total}
//               </span>
//             </div>

//             <div className="flex justify-between items-center py-4 border-y border-slate-50">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm font-bold text-slate-500">
//                   Pending invitations
//                 </span>
//                 <button
//                   onClick={() => setIsPendingModalOpen(true)}
//                   className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter cursor-pointer"
//                 >
//                   {stats.users.pending} pending
//                 </button>
//               </div>
//               <span className="text-xl font-black text-slate-800">
//                 {stats.users.pending}
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-12 pt-4">
          
//               <div className="space-y-3">
//                 <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                   <span>Developers</span>
//                   <span className="text-slate-800">
//                     {stats.users.developers}
//                   </span>
//                 </div>
//                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
//                     style={{ width: `${devPercentage}%` }}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                   <span>Managers</span>
//                   <span className="text-slate-800">{stats.users.managers}</span>
//                 </div>
//                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
//                     style={{ width: `${managerPercentage}%` }}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                   <span>QA Engineers</span>
//                   <span className="text-slate-800">{stats.users.qa}</span>
//                 </div>
//                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-teal-400 rounded-full transition-all duration-1000 ease-out"
//                     style={{ width: `${qaPercentage}%` }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={() => navigate("/org-admin/users")}
//             className="mt-12 text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-2 group/btn"
//           >
//             Manage Users{" "}
//             <span className="group-hover:translate-x-1 transition-transform">
//               →
//             </span>
//           </button>
//         </div>

//         {/* Card 2: Projects Overview */}
//         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
//           <div className="flex justify-between items-start mb-12">
//             <div>
//               <h3 className="text-lg font-black text-slate-800">
//                 Projects Overview
//               </h3>
//               <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
//                 Active projects and status
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center italic text-slate-400">
//               PR
//             </div>
//           </div>

//           <div className="space-y-10">
//             {[
//               { label: "Active Projects", val: stats.projects.active },
//               {
//                 label: "Without Manager",
//                 val: stats.projects.withoutManager,
//                 tag: "Action Needed",
//               },
//               { label: "Archived Project", val: stats.projects.archived },
//             ].map((row, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between items-center group/row cursor-default"
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="text-sm font-bold text-slate-500 group-hover/row:text-slate-800 transition-colors">
//                     {row.label}
//                   </span>
//                   {row.tag && (
//                     <span onClick={()=>navigate('/org-admin/projects')} className="bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
//                       {row.tag}
//                     </span>
//                   )}
//                 </div>
//                 <span className="text-2xl font-black text-slate-800">
//                   {row.val}
//                 </span>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={() => navigate("/org-admin/projects")}
//             className="mt-12 text-xs font-black text-indigo-600 flex items-center gap-2"
//           >
//             View Projects <span>→</span>
//           </button>
//         </div>

//         {/* Card 3: Permissions Alerts */}
//         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
//           <h3 className="text-lg font-black text-slate-800">Users Overview</h3>
//           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 mb-8">
//             Permission alerts and conflicts
//           </p>

//           <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl mb-10 flex gap-4 items-center">
//             <div className="w-2 h-10 bg-amber-400 rounded-full" />
//             <div>
//               <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
//                 Attention Required
//               </h4>
//               <p className="text-sm font-bold text-slate-700">
//                 4 users are without roles
//               </p>
//             </div>
//           </div>

//           <div className="space-y-10">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm font-bold text-slate-500">
//                   Users Without Roles
//                 </span>
//                 <span className="bg-red-50 text-red-500 text-[9px] font-black px-2 py-0.5 rounded uppercase">
//                   Urgent
//                 </span>
//               </div>
//               <span className="text-2xl font-black text-slate-800">
//                 {stats?.alerts?.withoutRoles}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-bold text-slate-500">
//                 Access Conflicts
//               </span>
//               <span className="text-2xl font-black text-slate-800">
//                 {stats?.alerts?.conflicts}
//               </span>
//             </div>
//           </div>
//           <button className="mt-12 text-xs font-black text-indigo-600 flex items-center gap-2">
//             Review Access <span>→</span>
//           </button>
//         </div>

//         <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
//           <h3 className="text-lg font-black text-slate-800">Recent Actions</h3>
//           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 mb-10">
//             Latest organization changes
//           </p>

//           <div className="space-y-8 relative before:absolute before:left-[18px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
//             {recentActions.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex gap-6 items-start relative z-10"
//               >
//                 <div className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-sm shadow-sm">
//                   {item.icon}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-[13px] font-bold text-slate-700 leading-tight">
//                     <span className="text-indigo-600">{item.user}</span>{" "}
//                     {item.action}
//                   </p>
//                   <span className="text-[10px] font-bold text-slate-400 mt-1 block uppercase tracking-tighter">
//                     {item.time}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button className="mt-10 text-xs font-black text-indigo-600 flex items-center gap-2">
//             Manage Users <span>→</span>
//           </button>
//         </div>
//       </div>
//       {showInviteModal && (
//         <InviteModal
//           onClose={() => setShowInviteModal(false)}
//           onInvite={onInvite}
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






































import React, { useState } from "react";
import { useNavigate } from "react-router";
import InviteModal from "./InviteModal";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";
import PendingRequestsModal from "./PendingRequestsModal";
import { useDashboardStats } from "../../hooks/useWorkspace";
import { useQueryClient } from "@tanstack/react-query";
import useLocalStorage from "../../hooks/custom/useLocalStorage";
import { 
  Users, 
  Layers, 
  ShieldAlert, 
  History, 
  ArrowRight, 
  Sparkles, 
  Hexagon, 
  Terminal,
  Compass
} from "lucide-react";

const OrganizationDashboard = () => {
  const [user] = useLocalStorage('user', null);
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
    queryClient.invalidateQueries(['dashboard-stats', id]);
    
    if (stats?.pendingList?.length <= 1) {
      setIsPendingModalOpen(false);
    }
  };

  const recentActions = [
    { id: 1, user: "Sarah Johnson", action: "added as Developer", time: "2 hours ago", icon: "👤" },
    { id: 2, user: "Mike Chen's", action: "role changed to Manager", time: "5 hours ago", icon: "⚙️" },
    { id: 3, user: "New project", action: '"Mobile App Redesign" created', time: "Yesterday", icon: "📁" },
    { id: 4, user: "3 team invitations", action: "sent", time: "2 days ago", icon: "📩" },
    { id: 5, user: "Billing plan", action: "upgraded to Business", time: "3 days ago", icon: "💳" },
  ];

  const total = stats?.users?.total || 0;
  const devPercentage = total ? Math.round((stats?.users?.developers / total) * 100) : 0;
  const managerPercentage = total ? Math.round((stats?.users?.managers / total) * 100) : 0;
  const qaPercentage = total ? Math.round((stats?.users?.qa / total) * 100) : 0;

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#3b59ff] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#3b59ff] font-black text-xs uppercase tracking-[0.2em]">
            UCollyx Engine Syncing...
          </div>
        </div>
      </div>
    );

  if (isError) 
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-bold text-red-500 bg-[#f8fafc]">
        Data telemetry sync failed. Check cloud instance connection routing.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 lg:p-14 font-sans text-left relative overflow-hidden selection:bg-[#3b59ff]/10">
      
      {/* Structural Ambient Mesh Background Layers */}
      <div className="absolute top-[-10%] right-[-5%] w-[650px] h-[650px] bg-gradient-to-bl from-[#3b59ff]/10 to-[#00f2fe]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#9d4edd]/10 to-[#3b59ff]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Modal />

      {/* DYNAMIC MASTER HEADER BANNER CONTAINER */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(31,38,135,0.04)] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#3b59ff]/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4.5">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#3b59ff] to-[#8a2be2] p-3.5 rounded-2xl text-white shadow-md shadow-blue-500/10 shrink-0 flex items-center justify-center">
            <Hexagon size={28} strokeWidth={2.5} className="animate-pulse" />
          </div>
          <div>
            <nav className="flex items-center gap-1.5 text-[10px] font-black text-[#3b59ff] uppercase tracking-widest mb-1">
              <span>Ecosystem Hub</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-400">Control Panel</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-black text-[#1a1d2f] tracking-tight">
              {stats?.workspace?.name || "Target Instance"}
            </h1>
            <p className="text-gray-400 text-xs font-medium mt-0.5">
              Live routing status updates and key infrastructure metrics dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPendingModalOpen(true)}
            className="relative px-4 py-2.5 bg-white border border-gray-200 hover:border-[#3b59ff]/30 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <span>Pending Gates</span>
            {stats?.users?.pending > 0 && (
              <span className="bg-amber-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md animate-bounce">
                {stats.users.pending}
              </span>
            )}
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#3b59ff] to-[#8a2be2] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/10 hover:opacity-95 transition-opacity active:scale-95"
          >
            <Sparkles size={13} />
            <span>Deploy Invite Link</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD MODULAR GRID ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* PANEL 1: TEAM & ACCESS SYSTEM */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-[32px] p-8 border border-white/60 shadow-[0_16px_36px_rgba(0,0,0,0.02)] flex flex-col justify-between group">
          <div>
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#1a1d2f] flex items-center gap-2">
                  <Users size={16} className="text-[#3b59ff]" /> Users & Access Index
                </h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  Active operators and telemetry pipelines
                </p>
              </div>
              <div className="w-10 h-10 bg-[#f8fafc] border border-gray-100 rounded-xl flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-[#3b59ff]/5 group-hover:text-[#3b59ff] transition-all">
                IDX
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-gray-100/60 pb-8 mb-8">
              <div className="bg-[#f8fafc]/80 border border-gray-100 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-0.5">Total Users Assigned</span>
                  <span className="text-3xl font-black text-[#1a1d2f] tracking-tight">{stats?.users?.total || 0}</span>
                </div>
                <div className="p-2.5 bg-[#3b59ff]/5 rounded-xl text-[#3b59ff] text-xs font-bold">Live Node</div>
              </div>

              <div className="bg-[#f8fafc]/80 border border-gray-100 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 block mb-0.5">Pending Approvals</span>
                  <span className="text-3xl font-black text-amber-500 tracking-tight">{stats?.users?.pending || 0}</span>
                </div>
                <button
                  onClick={() => setIsPendingModalOpen(true)}
                  disabled={!stats?.users?.pending}
                  className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 disabled:bg-gray-100 text-amber-600 disabled:text-gray-400 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Inspect Gate
                </button>
              </div>
            </div>

            {/* METRIC SECTOR LOADING PROGRESS STATS */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Role Allocation Shares</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-600">
                  <span className="flex items-center gap-2"><Terminal size={12} className="text-[#3b59ff]" /> Developers</span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#1a1d2f]">{stats?.users?.developers || 0}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#3b59ff] to-[#00f2fe] rounded-full transition-all duration-1000 ease-out" style={{ width: `${devPercentage}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-600">
                  <span className="flex items-center gap-2"><Compass size={12} className="text-amber-500" /> System Managers</span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#1a1d2f]">{stats?.users?.managers || 0}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${managerPercentage}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-600">
                  <span className="flex items-center gap-2"><Layers size={12} className="text-emerald-500" /> Quality Engineers</span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#1a1d2f]">{stats?.users?.qa || 0}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${qaPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/org-admin/users")}
            className="mt-10 text-xs font-black text-[#3b59ff] hover:text-[#2a44d4] flex items-center gap-1.5 group/btn border-t border-gray-100/70 pt-4"
          >
            <span>Enter User Management Panel</span> 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* PANEL 2: PROJECT TEAMS PIPELINE */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 border border-white/60 shadow-[0_16px_36px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#1a1d2f] flex items-center gap-2">
                  <Layers size={16} className="text-[#9d4edd]" /> Project Directories
                </h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  Repositories & Scope clusters
                </p>
              </div>
              <div className="w-10 h-10 bg-[#f8fafc] border border-gray-100 rounded-xl flex items-center justify-center text-xs font-black text-gray-400">
                DIR
              </div>
            </div>

            <div className="divide-y divide-gray-100/80">
              {[
                { label: "Active Code Clusters", val: stats?.projects?.active, status: "Active" },
                { label: "Unassigned Scopes", val: stats?.projects?.withoutManager, tag: "Action Needed" },
                { label: "Archived Nodes", val: stats?.projects?.archived, status: "Cold Storage" },
              ].map((row, i) => (
                <div key={i} className="py-4.5 flex justify-between items-center group/row cursor-default">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-gray-600 group-hover/row:text-[#1a1d2f] transition-colors">
                      {row.label}
                    </span>
                    {row.tag && (
                      <span onClick={() => navigate('/org-admin/projects')} className="block w-max bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider cursor-pointer">
                        {row.tag}
                      </span>
                    )}
                    {row.status && <span className="block text-[10px] text-gray-400 font-medium">{row.status}</span>}
                  </div>
                  <span className="text-2xl font-black text-[#1a1d2f] font-mono">{row.val || 0}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/org-admin/projects")}
            className="mt-10 text-xs font-black text-[#3b59ff] hover:text-[#2a44d4] flex items-center gap-1.5 border-t border-gray-100/70 pt-4"
          >
            <span>Review Active Directories</span> <ArrowRight size={14} />
          </button>
        </div>

        {/* PANEL 3: SECURITY TELEMETRY ALERTS */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 border border-white/60 shadow-[0_16px_36px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="space-y-1 mb-8">
              <h3 className="text-base font-black text-[#1a1d2f] flex items-center gap-2">
                <ShieldAlert size={16} className="text-amber-500" /> Conflict Guard
              </h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                Permission alerts and loose role handling
              </p>
            </div>

            {/* Warning Alert Box */}
            <div className="bg-amber-50/70 border border-amber-200/50 p-4.5 rounded-2xl mb-8 flex gap-3.5 items-center">
              <div className="w-1.5 h-10 bg-amber-500 rounded-full shrink-0" />
              <div>
                <h4 className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Telemetries Mismatch</h4>
                <p className="text-xs font-bold text-gray-700 mt-0.5">
                  {stats?.alerts?.withoutRoles || 0} active instances running without permissions keys.
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100/80">
              <div className="py-4.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-600">Unassigned Profiles</span>
                  <span className="bg-red-50 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Urgent</span>
                </div>
                <span className="text-xl font-black text-[#1a1d2f] font-mono">{stats?.alerts?.withoutRoles || 0}</span>
              </div>
              <div className="py-4.5 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Access Overlaps</span>
                <span className="text-xl font-black text-[#1a1d2f] font-mono">{stats?.alerts?.conflicts || 0}</span>
              </div>
            </div>
          </div>

          <button className="mt-10 text-xs font-black text-[#3b59ff] hover:text-[#2a44d4] flex items-center gap-1.5 border-t border-gray-100/70 pt-4">
            <span>Enforce System Audit</span> <ArrowRight size={14} />
          </button>
        </div>

        {/* PANEL 4: STREAM REALTIME ACTIONS */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 border border-white/60 shadow-[0_16px_36px_rgba(0,0,0,0.02)] lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="space-y-1 mb-8">
              <h3 className="text-base font-black text-[#1a1d2f] flex items-center gap-2">
                <History size={16} className="text-gray-700" /> Instance Activity Matrix
              </h3>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                Real-time tracking of infrastructure mutations
              </p>
            </div>

            <div className="space-y-5 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
              {recentActions.map((item) => (
                <div key={item.id} className="flex gap-4.5 items-start relative z-10 animate-in fade-in duration-200">
                  <div className="w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-xs shadow-sm shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700 leading-tight">
                      <span className="text-[#3b59ff] font-black">{item.user}</span> {item.action}
                    </p>
                    <span className="text-[9px] font-bold text-gray-400 mt-0.5 block uppercase tracking-wider font-mono">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-10 text-xs font-black text-[#3b59ff] hover:text-[#2a44d4] flex items-center gap-1.5 border-t border-gray-100/70 pt-4">
            <span>Query Full Activity Logs</span> <ArrowRight size={14} />
          </button>
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