// import React, { useState, useEffect } from "react";
// import {
//   MoreVertical,
//   UserPlus,
//   Search,
//   X,
//   Mail,
//   Shield,
//   CheckCircle2,
//   Calendar,
//   Hash,
//   Plus,
//   ArrowLeft,
//   Loader2,
// } from "lucide-react";
// import InviteModal from "./InviteModal";
// import API from "../../api/axios";
// import toast from "react-hot-toast";
// import { triggerToast } from "../../utils/toastHelper";
// import { useNavigate } from "react-router";
// import { useQueryClient } from "@tanstack/react-query";
// import { useUserMutations, useUsersData } from "../../hooks/useUsers";

// export default function UsersManagement() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // React Query
//   const { data: users = [], isLoading: isUsersLoading } = useUsersData();
//   const { statusMutation, roleMutation, inviteMutation } = useUserMutations();

//   const isStatusUpdating = statusMutation.isPending; // Purane version mein .isLoading
// const isRoleUpdating = roleMutation.isPending;
// const isInviting = inviteMutation.isPending;

//   // Local UI States
//   const [showInviteModal, setShowInviteModal] = useState(false);
//   const [roleFilter, setRoleFilter] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [emails, setEmails] = useState(["", ""]);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Status Toggle Handler
//   const onTogglePermissions = (userId) => {
//     const user = users.find((u) => u.id === userId);
//     const newStatus = user.status === "Disabled" ? "active" : "Disabled";

//     statusMutation.mutate({ userId, status: newStatus }, {
//       onSuccess: () => {
//         setSelectedUser(null);
//         triggerToast(`User access ${newStatus === "Disabled" ? "disabled" : "active"} successfully.`);
//       }
//     });
//   };

//   // Role Update Handler
//   const handleUpdateRole = (userId, newRole) => {
//     roleMutation.mutate({ userId, role: newRole }, {
//       onSuccess: () => setOpenMenuId(null)
//     });
//   };

//   // Invite Handler
//   const handleSendInvites = () => {
//     const validEmails = emails.filter((email) => email.trim() !== "");
//     if (validEmails.length === 0) return triggerToast("Please add at least one email", "error");

//     const userData = JSON.parse(localStorage.getItem("user"));

//     inviteMutation.mutate({
//       workspaceSlug: userData.workspace_id,
//       emails: validEmails,
//       inviterName: userData.full_name,
//     }, {
//       onSuccess: () => {
//         setEmails(["", ""]);
//         setShowInviteModal(false);
//       }
//     });
//   };

//   // Filtered Users (Logic remains same but data comes from query)
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = roleFilter === "All" || user.role === roleFilter;
//     return matchesSearch && matchesRole;
//   });

//   // 1. Menu Toggle Logic (User action menu)
// const toggleMenu = (e, userId) => {
//   e.stopPropagation();
//   setOpenMenuId(openMenuId === userId ? null : userId);
// };

// // 2. Add Email Field (Invite Modal ke liye)
// const addEmailField = () => setEmails([...emails, ""]);

// // 3. Remove Email Field
// const removeEmailField = (index) => {
//   if (emails.length > 1) { // Kam az kam ek field honi chahiye
//     setEmails(emails.filter((_, i) => i !== index));
//   }
// };

//   if (isUsersLoading) return <div className="p-10 text-center animate-pulse">Loading Users Engine...</div>;

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen font-sans relative">
//       {toast.show && (
//         <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 border border-slate-700">
//           <CheckCircle2 size={18} className="text-emerald-400" />
//           <p className="text-sm font-bold">{toast.message}</p>
//         </div>
//       )}

//       <div className="mx-auto">
//         <div className="flex justify-between items-end mb-10">
//           <div>
//             <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
//               Users and Teams
//             </h1>
//             <p className="text-slate-500 mt-1.5 text-sm font-medium">
//               Manage organization members and access levels.
//             </p>
//           </div>
//           <button
//             onClick={() => setShowInviteModal(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2.5 transition-all shadow-lg active:scale-95 font-semibold text-sm"
//           >
//             <UserPlus size={18} /> Invite User
//           </button>
//         </div>

//         <div className="flex gap-4 mb-8">
//           <div className="relative flex-1 max-w-md group">
//             <Search
//               className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500"
//               size={19}
//             />
//             <input
//               type="text"
//               placeholder="Search by name or email..."
//               className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <select
//             className="border border-slate-200 rounded-2xl px-5 py-3 bg-white text-sm font-semibold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-sm"
//             value={roleFilter}
//             onChange={(e) => setRoleFilter(e.target.value)}
//           >
//             <option value="All">All Roles</option>
//             <option value="dev">Developer</option>
//             <option value="manager">Manager</option>
//             <option value="qa">Quality Assurance</option>
//           </select>
//         </div>

//         <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-100">
//                 <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
//                   User Details
//                 </th>
//                 <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
//                   Role
//                 </th>
//                 <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
//                   Team
//                 </th>
//                 <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
//                   Status
//                 </th>
//                 <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">
//                   Last Seen
//                 </th>
//                 <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredUsers.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="group hover:bg-blue-50/30 cursor-pointer transition-all"
//                 >
//                   <td
//                     onClick={() => setSelectedUser(user)}
//                     className="px-8 py-5"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
//                         {user.name.charAt(0)}
//                       </div>
//                       <div>
//                         <div className="font-bold text-slate-800 group-hover:text-blue-700">
//                           {user.name}
//                         </div>
//                         <div className="text-xs text-slate-400 font-medium">
//                           {user.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5 text-sm font-semibold text-slate-600">
//                     {user.role === "org_admin"
//                       ? "Admin"
//                       : user.role === "dev"
//                         ? "Developer"
//                         : user.role === "qa"
//                           ? "Quality Assurance"
//                           : user.role === "manager"
//                             ? "Project Manager"
//                             : "No Role"}
//                   </td>
//                   <td className="px-6 py-5 text-sm text-slate-500 font-medium">
//                     {user.team}
//                   </td>
//                   <td className="px-6 py-5">
//                     <span
//                       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ring-1 ring-inset ${
//                         user.status === "active"
//                           ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
//                           : user.status === "Disabled"
//                             ? "bg-red-50 text-red-700 ring-red-600/20"
//                             : user.status === "pending"
//                               ? "bg-blue-50 text-blue-700 ring-blue-600/20"
//                               : "bg-amber-50 text-amber-700 ring-amber-600/20"
//                       }`}
//                     >
//                       <span
//                         className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : user.status === "Disabled" ? "bg-red-500" : user.status === "pending" ? "bg-blue-500" : "bg-amber-500"}`}
//                       />
//                       {user.status.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="px-8 py-5 text-right flex justify-end items-center gap-5">
//                     <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">
//                       {user.lastActive
//                         ? new Date(user?.lastActive).toLocaleDateString(
//                             "en-US",
//                             {
//                               month: "short",
//                               day: "2-digit",
//                               year: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             },
//                           )
//                         : "N/A"}
//                     </span>
//                   </td>

//                   <td className="px-6 py-5 relative">
//                     <button
//                       onClick={(e) => toggleMenu(e, user.id)}
//                       className="text-slate-300 group-hover:text-slate-600 absolute right-6"
//                     >
//                       <MoreVertical size={18} />
//                     </button>
//                     {openMenuId === user.id && (
//                       <div className="absolute right-10 -top-10 z-500 w-40 bg-white rounded-lg shadow-xl border border-slate-100 py-1">
//                         {["dev", "qa", "manager"].map((role) => (
//                           <button
//                             key={role}
//                             onClick={() => handleUpdateRole(user.id, role)} // Backend call function
//                             className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 capitalize"
//                           >
//                             {role.replace("_", " ")}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showInviteModal && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
//           <div className="flex w-[25%] flex-col items-center animate-in slide-in-from-right duration-500 bg-white p-8 rounded-2xl">
//             <span className="text-4xl mb-6">👋</span>
//             <h2 className="text-2xl font-bold text-gray-800">
//               Invite your team
//             </h2>
//             <p className="text-gray-500 text-sm mt-1 mb-8">
//               Add members to{" "}
//               <span className="text-indigo-600 font-bold">
//                 {name || "Workspace"}
//               </span>
//             </p>

//             <div className="w-full space-y-3 mb-6">
//               {emails.map((email, index) => (
//                 <div key={index} className="flex gap-2">
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => {
//                       const newEmails = [...emails];
//                       newEmails[index] = e.target.value;
//                       setEmails(newEmails);
//                     }}
//                     placeholder={`teammate${index + 1}@company.com`}
//                     className="flex-1 border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
//                   />
//                   {emails.length > 1 && (
//                     <button
//                       onClick={() => removeEmailField(index)}
//                       className="p-3 border border-red-100 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-all"
//                     >
//                       <X size={20} />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 onClick={addEmailField}
//                 className="w-full py-3 border-2 border-dashed border-gray-200 rounded-md text-gray-500 font-medium flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-500 transition-all"
//               >
//                 <Plus size={18} /> Add another email
//               </button>
//             </div>

//             <div className="flex gap-4 w-full">
//               <button
//                 onClick={() => setShowInviteModal(false)}
//                 className="flex-1 py-3 border border-gray-200 rounded-md font-semibold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50"
//               >
//                  Cancel
//               </button>
//               <button
//                 onClick={handleSendInvites} // Ab ye final create trigger karega
//                 disabled={isInviting}
//                 className="flex-[1.5] py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
//               >
//                 {isInviting ? (
//                   <Loader2 size={18} className="animate-spin" />
//                 ) : (
//                   "Send Invitation"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedUser && (
//         <UserDetailsModal
//           user={selectedUser}
//           onClose={() => setSelectedUser(null)}
//           onTogglePermissions={onTogglePermissions}
//         />
//       )}
//     </div>
//   );
// }
// function UserDetailsModal({ user, onClose, onTogglePermissions }) {
//   const projects = user.projects || [];
//   const joinedDate = user.joined
//     ? new Date(user.joined).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })
//     : "N/A";

//   const getOnlineStatus = (lastActive) => {
//     if (!lastActive) return "Offline";

//     const now = new Date();
//     const lastActiveDate = new Date(lastActive);

//     const diffInSeconds = (now - lastActiveDate) / 1000;

//     return diffInSeconds < 20 ? "Online" : "Offline";
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex justify-end z-[150]">
//       <div className="bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col border-l border-slate-100">
//         <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
//           <h2 className="text-2xl font-black text-slate-900 tracking-tight">
//             User Details
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2.5 hover:bg-slate-50 rounded-2xl border border-slate-100 text-slate-400"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-8 space-y-10">
//           {/* Profile Card */}
//           <div className="flex flex-col items-center text-center">
//             <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[32px] flex items-center justify-center text-white text-3xl font-black shadow-xl">
//               {user.name?.charAt(0)}
//             </div>
//             <h3 className="mt-5 text-2xl font-extrabold text-slate-900">
//               {user.name}
//             </h3>
//             <p className="text-slate-500 font-medium flex items-center gap-1.5 mt-1">
//               <Mail size={14} /> {user.email}
//             </p>
//           </div>

//           {/* Role & Team Grid */}
//           <div className="space-y-6">
//             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//               Role & Access
//             </h4>
//             <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
//               <DetailRow
//                 label="Role"
//                 value={
//                   user.role === "org_admin"
//                     ? "Admin"
//                     : user.role === "dev"
//                       ? "Developer"
//                       : user.role === "qa"
//                         ? "Quality Assurance"
//                         : user.role === "manager"
//                           ? "Project Manager"
//                           : "No Role"
//                 }
//               />
//               <DetailRow label="Team" value={user.team || "N/A"} isTeam />
//               <DetailRow label="Status" value={user.status} isStatus />
//               <DetailRow
//                 label="Presence"
//                 value={getOnlineStatus(user.lastActive)}
//                 isTime
//               />
//             </div>
//           </div>

//           {/* Dynamic Project Memberships */}
//           <div className="space-y-4">
//             <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
//               Project Memberships
//             </h4>
//             <div className="grid gap-3">
//               {projects.length > 0 ? (
//                 projects.map((p, i) => (
//                   <div
//                     key={p.projectId}
//                     className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl"
//                   >
//                     <span className="text-sm font-bold text-slate-700">
//                       {p.projectName}
//                     </span>
//                     <span className="text-[10px] font-bold text-slate-400 italic font-mono">
//                       ID: {p.projectId}
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-xs text-slate-400 italic">
//                   No active project memberships.
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Metadata */}
//           <div className="pt-4 border-t border-slate-100 flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
//             <div className="flex items-center gap-1">
//               <Hash size={12} /> ID: {user.id}
//             </div>
//             <div className="flex items-center gap-1">
//               <Calendar size={12} /> Joined: {joinedDate}
//             </div>
//           </div>
//         </div>

//         {/* Action Button */}
//         <div className="p-8 bg-white border-t border-slate-100">
//           <button
//             onClick={() => onTogglePermissions(user.id)}
//             // disabled={user.status === 'Disabled'}
//             className={`w-full py-4 font-bold rounded-2xl transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2 shadow-lg ${
//               user.status === "Disabled"
//               // ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
//               // : 'bg-white border-2 border-red-50 text-red-600 hover:bg-red-50 shadow-red-100/50'
//             }`}
//           >
//             <Shield size={16} />
//             {user.status === "Disabled"
//               ? "Enable User Access"
//               : "Disable User Access"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function DetailRow({ label, value, isStatus, isTeam, isTime }) {
//   const getStatusColor = (val) => {
//     if (val === "active") return "text-emerald-600";
//     if (val === "Disabled") return "text-red-600";
//     return "text-amber-600";
//   };

//   return (
//     <div className="flex justify-between items-center">
//       <span className="text-[13px] font-bold text-slate-400">{label}</span>
//       <span
//         className={`text-sm font-bold ${
//           isStatus
//             ? getStatusColor(value)
//             : isTeam
//               ? "text-blue-600"
//               : isTime
//                 ? "text-slate-400 italic"
//                 : "text-slate-800"
//         }`}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }

import React, { useState } from "react";
import {
  MoreVertical,
  UserPlus,
  Search,
  X,
  Mail,
  Shield,
  CheckCircle2,
  Calendar,
  Hash,
  Plus,
  Loader2,
  Terminal,
  Cpu,
  Layers,
  CircleDot,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { triggerToast } from "../../../utils/toastHelper";
import { useUserMutations, useUsersData } from "../../../hooks/useUsers";
import useLocalStorage from "../../../hooks/custom/useLocalStorage";

export default function UsersManagement() {
  const [userLocal] = useLocalStorage("user", null);

  // React Query Hooks
  const { data: users = [], isLoading: isUsersLoading } = useUsersData();
  const { statusMutation, roleMutation, inviteMutation } = useUserMutations();

  const [user, setUser] = useLocalStorage("user", null);

  const isInviting = inviteMutation.isPending;

  // Local UI States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [emails, setEmails] = useState(["", ""]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Status Toggle Handler
  const onTogglePermissions = (userId) => {
    const user = users.find((u) => u.id === userId);
    const newStatus = user.status === "Disabled" ? "active" : "Disabled";

    statusMutation.mutate(
      { userId, status: newStatus },
      {
        onSuccess: () => {
          if (selectedUser?.id === userId) {
            setSelectedUser((prev) => ({ ...prev, status: newStatus }));
          }
          triggerToast(
            `User access ${newStatus === "Disabled" ? "disabled" : "active"} successfully.`,
            "success",
          );
        },
      },
    );
  };

  // Role Update Handler
  const handleUpdateRole = (workspaceId, userId, newRole) => {
    console.log(
      "Updating role for user:",
      userId,
      "to new role:",
      newRole,
      "Workspace:::",
      workspaceId,
    );
    roleMutation.mutate(
      { workspaceId, userId, role: newRole },
      {
        onSuccess: () => {
          setOpenMenuId(null);
          triggerToast(
            "User operational role modified successfully.",
            "success",
          );
        },
      },
    );
  };

  // Invite Handler
  const handleSendInvites = () => {
    const validEmails = emails.filter((email) => email.trim() !== "");
    if (validEmails.length === 0)
      return triggerToast("Please add at least one email", "error");

    inviteMutation.mutate(
      {
        workspaceSlug: userLocal?.workspace_id,
        emails: validEmails,
        inviterName: userLocal?.full_name,
      },
      {
        onSuccess: () => {
          setEmails(["", ""]);
          setShowInviteModal(false);
          triggerToast(
            "Organizational access credentials dispatched.",
            "success",
          );
        },
      },
    );
  };

  // Filtered Users Matrix
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleMenu = (e, userId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  const addEmailField = () => setEmails([...emails, ""]);
  const removeEmailField = (index) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const getOnlineStatus = (lastActive) => {
    if (!lastActive) return "OFFLINE_CLUSTER";
    const diffInSeconds = (new Date() - new Date(lastActive)) / 1000;
    return diffInSeconds < 20 ? "LIVE_ON_NODE" : "OFFLINE_CLUSTER";
  };

  if (isUsersLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-[#3b59ff]" />
          <span className="text-xs font-black text-[#3b59ff] tracking-[0.2em] uppercase">
            Syncing Operators Index...
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#fff7f5] via-[#faf9ff] to-[#f4f7ff] p-4 sm:p-8 lg:p-12 font-sans text-left relative overflow-x-hidden selection:bg-indigo-100">
      <div className="absolute top-0 left-0 w-[45vw] h-[45vw] max-w-[450px] bg-gradient-to-br from-cyan-200/20 to-blue-300/15 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[35vw] h-[35vw] max-w-[400px] bg-gradient-to-bl from-purple-200/25 to-fuchsia-200/15 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] max-w-[450px] bg-gradient-to-tr from-amber-100/15 to-pink-200/20 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="mx-auto relative z-10 max-w-[1600px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-white/70 shadow-sm">
          <div>
            <nav className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <span>Workspace Indices</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400">Operators Directory</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Users & Team Clusters
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1">
              Manage active developer profiles, global workspace access tokens,
              and assignment roles.
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 transition-all active:scale-[0.98] font-semibold text-xs tracking-wide shrink-0"
          >
            <UserPlus size={14} /> <span>Provision New Key</span>
          </button>
        </div>

        {/* --- CONTROLS: SEARCH & FILTERS RAILS --- */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
              size={14}
            />
            <input
              type="text"
              placeholder="Search operators by profile identity or user email..."
              className="w-full pl-9 pr-4 py-2 bg-white/70 backdrop-blur-md border border-white/60 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/50 shadow-sm transition-all placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border border-white/60 rounded-xl px-4 py-2 bg-white/70 backdrop-blur-md text-xs font-semibold text-slate-500 tracking-wide outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600/50 cursor-pointer shadow-sm transition-all"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Functional Contexts</option>
            <option value="dev">Developers</option>
            <option value="manager">Project Managers</option>
            <option value="qa">Quality Engineers</option>
          </select>
        </div>

        {/* --- HYBRID DATAGRID SYSTEM DISPATCHER --- */}
        {filteredUsers.length > 0 ? (
          <div>
            {/* ========================================================== */}
            {/* 💻 DESKTOP VIEW: HIGH-DENSITY COMPACT GLASS TABLE          */}
            {/* ========================================================== */}
            <div className="hidden md:block bg-white/50 backdrop-blur-xl border border-white/70 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 backdrop-blur-md border-b border-slate-100/80">
                    <tr>
                      <th className="pl-6 pr-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-[25%]">
                        User Specifications
                      </th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-[20%]">
                        Operational Role
                      </th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-[15%]">
                        Assigned Cluster
                      </th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center w-[15%]">
                        Status
                      </th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 w-[20%]">
                        Last Connection Stream
                      </th>
                      <th className="pr-6 pl-4 py-4 w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        onClick={() => setSelectedUser(u)}
                        className="group hover:bg-white/60 cursor-pointer transition-all duration-150"
                      >
                        <td className="pl-6 pr-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 shrink-0 bg-gradient-to-br from-white to-slate-50 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200/60 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm rounded-xl">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                                {u.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-slate-700">
                          {u.role === "org_admin"
                            ? "Master Admin"
                            : u.role === "dev"
                              ? "System Developer"
                              : u.role === "qa"
                                ? "Quality Engineer"
                                : u.role === "manager"
                                  ? "Project Manager"
                                  : "Unconfigured System Key"}
                        </td>
                        <td className="px-4 py-4 text-[11px] text-indigo-500 bg-indigo-50/30 font-semibold px-2 py-0.5 rounded border border-indigo-100/30 w-fit">
                          {u.team || "GLOBAL_CLUSTER"}
                        </td>
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border tracking-wide uppercase ${
                              u.status === "active"
                                ? "bg-emerald-50/70 text-emerald-600 border-emerald-100"
                                : u.status === "Disabled"
                                  ? "bg-rose-50/70 text-rose-600 border-rose-100"
                                  : "bg-blue-50/70 text-blue-600 border-blue-100"
                            }`}
                          >
                            <CircleDot
                              size={9}
                              className={
                                u.status === "active" ? "animate-pulse" : ""
                              }
                            />
                            {u.status || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-slate-400">
                          {u.lastActive
                            ? new Date(u.lastActive).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                },
                              )
                            : "NEVER_INDEXED"}
                        </td>
                        <td
                          className="pr-6 pl-4 py-4 text-right relative whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => toggleMenu(e, u.id)}
                            className="text-slate-400 hover:text-slate-700 text-sm font-black p-1.5 rounded-lg hover:bg-white/80"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {/* Replace the old openMenuId === u.id wrapper inside mobile card header */}
                          {openMenuId === u.id && (
                            <div className="absolute right-0 top-9 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl rounded-xl py-2 z-50 w-44 text-left animate-in fade-in zoom-in-95 duration-100">
                              <div className="px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                                Reallocate Context
                              </div>
                              <div className="grid grid-cols-1 gap-0.5">
                                {[
                                  { id: "dev", label: "Developer" },
                                  { id: "qa", label: "QA Engineer" },
                                  { id: "manager", label: "Project Manager" },
                                ].map((role) => (
                                  <button
                                    key={role.id}
                                    onClick={() =>
                                      handleUpdateRole(
                                        user.workspace_id,
                                        u.id,
                                        role.id,
                                      )
                                    }
                                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors whitespace-nowrap"
                                  >
                                    {role.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ========================================================== */}
            {/* 📱 MOBILE VIEW: PREMIUM ADAPTIVE GLASS CARDS LAYOUT        */}
            {/* ========================================================== */}
            <div className="block md:hidden grid grid-cols-1 gap-4">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className="bg-white/60 backdrop-blur-xl border border-white/80 p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between group"
                >
                  {/* Mobile Card Header Frame */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-white to-slate-50 text-indigo-600 font-bold flex items-center justify-center text-sm border border-slate-200/60 rounded-xl shadow-xs relative">
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full ${getOnlineStatus(u.lastActive) === "LIVE_ON_NODE" ? "bg-emerald-500" : "bg-slate-300"}`}
                        />
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                          {u.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                          {u.email}
                        </p>
                      </div>
                    </div>

                    {/* Actions Dispatcher Menu */}
                    <div
                      className="relative shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => toggleMenu(e, u.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 font-black rounded-lg bg-white/40 border border-slate-200/40 text-xs"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {openMenuId === u.id && (
                        <div className="absolute right-0 top-7 bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-xl rounded-xl py-1.5 z-50 w-44 text-left">
                          <div className="px-4 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                            Reallocate Context
                          </div>
                          {[
                            { id: "dev", label: "Developer" },
                            { id: "qa", label: "QA Engineer" },
                            { id: "manager", label: "Project Manager" },
                          ].map((role) => (
                            <button
                              key={role.id}
                              onClick={() =>
                                handleUpdateRole(
                                  user.workspace_id,
                                  u.id,
                                  role.id,
                                )
                              }
                              className="w-full text-left px-4 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              {role.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Parameters Metrics Block */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-3 border-t border-slate-100/60 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-medium block">
                        Functional Role
                      </span>
                      <span className="text-slate-700 font-bold mt-0.5 block">
                        {u.role === "org_admin"
                          ? "Master Admin"
                          : u.role === "dev"
                            ? "Developer"
                            : u.role === "qa"
                              ? "QA Engineer"
                              : u.role === "manager"
                                ? "Project Manager"
                                : "Unconfigured"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">
                        Cluster Bind
                      </span>
                      <span className="text-slate-600 font-semibold mt-0.5 block truncate">
                        {u.team || "GLOBAL_CLUSTER"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">
                        Node Presence
                      </span>
                      <span className="text-slate-500 font-medium mt-0.5 block truncate">
                        {getOnlineStatus(u.lastActive) === "LIVE_ON_NODE"
                          ? "LIVE ON NODE"
                          : "OFFLINE CLUSTER"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">
                        Last Stream Active
                      </span>
                      <span className="text-slate-500 font-semibold mt-0.5 block truncate">
                        {u.lastActive
                          ? new Date(u.lastActive).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "NEVER INDEXED"}
                      </span>
                    </div>
                  </div>

                  {/* Handshakes / Connected Project Modules Stack */}
                  {u.projects && u.projects.length > 0 && (
                    <div className="pt-3 border-t border-slate-100/40 mt-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Active Handshakes
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {u.projects.slice(0, 2).map((p) => (
                          <div
                            key={p.projectId}
                            className="inline-flex items-center gap-1 bg-white/80 border border-slate-200/40 px-2 py-0.5 rounded-lg max-w-full shadow-2xs"
                          >
                            <Briefcase
                              size={9}
                              className="text-indigo-500 shrink-0"
                            />
                            <span className="text-[10px] font-bold text-slate-600 truncate max-w-[100px]">
                              {p.projectName}
                            </span>
                          </div>
                        ))}
                        {u.projects.length > 2 && (
                          <span className="text-[9px] font-bold text-indigo-600 self-center bg-indigo-50 px-1.5 py-0.5 rounded">
                            +{u.projects.length - 2} More
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Action Footer Base */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100/60 mt-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold border tracking-wide uppercase ${
                        u.status === "active"
                          ? "bg-emerald-50/70 text-emerald-600 border-emerald-100"
                          : "bg-rose-50/70 text-rose-600 border-rose-100"
                      }`}
                    >
                      <CircleDot size={8} /> {u.status || "ACTIVE"}
                    </span>

                    <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 cursor-pointer">
                      Inspect Matrix <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-md rounded-2xl p-12 text-center border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-400">
              No active operators discovered within target execution parameters.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* 🔑 ACCESS CREDENTIALS PROVISIONING MODAL                    */}
      {/* ========================================================== */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/15 backdrop-blur-xs flex items-center justify-center z-[2000] p-4 animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setShowInviteModal(false)}
          />

          <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/80 p-6 sm:p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col relative overflow-hidden">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all"
            >
              <X size={14} />
            </button>

            <div className="text-center mb-6">
              <div className="w-11 h-11 bg-white border border-slate-200/40 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-2xs text-indigo-600">
                <UserPlus size={18} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Provision Access Keys
              </h2>
              <p className="text-slate-400 text-xs font-medium mt-1">
                Dispatch invite channels directly into target scopes.
              </p>
            </div>

            <div className="w-full space-y-3 max-h-[220px] overflow-y-auto pr-1 mb-5 scrollbar-none">
              {emails.map((email, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 animate-in slide-in-from-bottom-2 duration-100"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...emails];
                      newEmails[idx] = e.target.value;
                      setEmails(newEmails);
                    }}
                    placeholder={`operator.node_${idx + 1}@corporate.com`}
                    className="flex-1 bg-white/60 border border-slate-200/70 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-500/60 shadow-2xs transition-all"
                  />
                  {emails.length > 1 && (
                    <button
                      onClick={() => removeEmailField(idx)}
                      className="p-3 border border-rose-200 bg-rose-50/50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors shrink-0"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addEmailField}
                className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 hover:border-indigo-500/40 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all"
              >
                <Plus size={12} /> Append Email Field
              </button>
            </div>

            {/* Action Row */}
            <div className="flex gap-3 w-full border-t border-slate-100/60 pt-4">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl text-xs font-bold transition-all active:scale-98"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvites}
                disabled={isInviting}
                className="flex-[1.5] py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isInviting ? (
                  <Loader2 size={14} className="animate-spin text-white" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Transmit Channels</span>
                    <span className="sm:hidden">Transmit</span>
                    <CheckCircle2 size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flyout Module Drawer */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onTogglePermissions={onTogglePermissions}
          statusMutation={statusMutation}
        />
      )}
    </div>
  );
}

function UserDetailsModal({
  user,
  onClose,
  onTogglePermissions,
  statusMutation,
}) {
  const projects = user.projects || [];
  const isStatusUpdating = statusMutation.isPending;

  const joinedDate = user.joined
    ? new Date(user.joined).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "NOT_SYNCED";

  const getOnlineStatus = (lastActive) => {
    if (!lastActive) return "OFFLINE_CLUSTER";
    const diffInSeconds = (new Date() - new Date(lastActive)) / 1000;
    return diffInSeconds < 20 ? "LIVE_ON_NODE" : "OFFLINE_CLUSTER";
  };

  return (
    <div
      className="fixed inset-0 bg-[#121424]/40 backdrop-blur-[2px] flex justify-end z-[150]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-black text-[#1a1d2f] tracking-tight">
              Operator Context
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Parameters profile
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-xl border border-gray-100 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col items-center text-center bg-[#f8fafc]/50 p-5 rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#3b59ff] to-[#8a2be2] rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg relative">
              <span
                className={`absolute bottom-0.5 right-0.5 w-3 h-3 border-2 border-white rounded-full ${getOnlineStatus(user.lastActive) === "LIVE_ON_NODE" ? "bg-emerald-500" : "bg-gray-300"}`}
              />
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="mt-3 text-lg font-black text-[#1a1d2f] tracking-tight">
              {user.name}
            </h3>
            <p className="text-gray-400 text-xs font-mono mt-0.5 truncate max-w-full">
              <Mail size={11} className="inline mr-1" /> {user.email}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-0.5">
              Credentials Matrix
            </h4>
            <div className="bg-[#f8fafc]/80 rounded-xl p-4 space-y-3.5">
              <DetailRow
                label="Role Context"
                value={
                  user.role === "org_admin"
                    ? "Master Admin"
                    : user.role === "dev"
                      ? "System Developer"
                      : user.role === "qa"
                        ? "Quality Engineer"
                        : user.role === "manager"
                          ? "Project Manager"
                          : "Unconfigured"
                }
              />
              <DetailRow
                label="Assigned Cluster"
                value={user.team || "GLOBAL_CLUSTER"}
                isTeam
              />
              <DetailRow
                label="Status Telemetry"
                value={user.status}
                isStatus
              />
              <DetailRow
                label="Node Presence"
                value={getOnlineStatus(user.lastActive)}
                isTime
              />
            </div>
          </div>

          {/* PROJECT HANDSHAKES BLOCK INSIDE OVERLAY PANEL */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-0.5">
              Active Project Handshakes
            </h4>
            <div className="grid gap-2">
              {projects.length > 0 ? (
                projects.map((p) => (
                  <div
                    key={p.projectId}
                    className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3b59ff] shrink-0" />
                      <span className="text-xs font-black text-gray-700 truncate">
                        {p.projectName}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 font-mono shrink-0 ml-2">
                      ID: {p.projectId}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs font-medium text-gray-400 italic py-4 bg-[#f8fafc]/50 border border-dashed border-gray-200 rounded-xl text-center">
                  No localized system instances assigned.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
            <div className="flex items-center gap-1">
              <Hash size={11} /> ID: {user.id}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={11} /> Sync: {joinedDate}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-50 sticky bottom-0">
          <button
            onClick={() => onTogglePermissions(user.id)}
            disabled={isStatusUpdating}
            className={`w-full py-3.5 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md ${
              user.status === "Disabled"
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white"
            }`}
          >
            {isStatusUpdating ? (
              <Loader2 size={14} className="animate-spin text-white" />
            ) : (
              <>
                <Shield size={14} />
                <span>
                  {user.status === "Disabled"
                    ? "Authorize Instance Key"
                    : "Revoke Cluster Authorization"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, isStatus, isTeam, isTime }) {
  const getStatusColor = (val) => {
    if (val === "active")
      return "text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded";
    if (val === "Disabled")
      return "text-red-600 bg-red-500/10 px-2 py-0.5 rounded";
    return "text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded";
  };

  return (
    <div className="flex justify-between items-center text-xs">
      <span className="font-bold text-gray-400">{label}</span>
      <span
        className={`font-black ${isStatus ? getStatusColor(value) : isTeam ? "text-[#3b59ff]" : isTime ? "text-gray-400 font-mono text-[11px]" : "text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
}
