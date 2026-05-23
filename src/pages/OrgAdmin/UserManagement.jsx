import React, { useState, useEffect } from "react";
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
  ArrowLeft,
  Loader2,
} from "lucide-react";
import InviteModal from "./InviteModal";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { triggerToast } from "../../utils/toastHelper";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useUserMutations, useUsersData } from "../../hooks/useUsers";

export default function UsersManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // React Query
  const { data: users = [], isLoading: isUsersLoading } = useUsersData();
  const { statusMutation, roleMutation, inviteMutation } = useUserMutations();

  const isStatusUpdating = statusMutation.isPending; // Purane version mein .isLoading
const isRoleUpdating = roleMutation.isPending;
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

    statusMutation.mutate({ userId, status: newStatus }, {
      onSuccess: () => {
        setSelectedUser(null);
        triggerToast(`User access ${newStatus === "Disabled" ? "disabled" : "active"} successfully.`);
      }
    });
  };

  // Role Update Handler
  const handleUpdateRole = (userId, newRole) => {
    roleMutation.mutate({ userId, role: newRole }, {
      onSuccess: () => setOpenMenuId(null)
    });
  };

  // Invite Handler
  const handleSendInvites = () => {
    const validEmails = emails.filter((email) => email.trim() !== "");
    if (validEmails.length === 0) return triggerToast("Please add at least one email", "error");

    const userData = JSON.parse(localStorage.getItem("user"));
    
    inviteMutation.mutate({
      workspaceSlug: userData.workspace_id,
      emails: validEmails,
      inviterName: userData.full_name,
    }, {
      onSuccess: () => {
        setEmails(["", ""]);
        setShowInviteModal(false);
      }
    });
  };

  // Filtered Users (Logic remains same but data comes from query)
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // 1. Menu Toggle Logic (User action menu)
const toggleMenu = (e, userId) => {
  e.stopPropagation();
  setOpenMenuId(openMenuId === userId ? null : userId);
};

// 2. Add Email Field (Invite Modal ke liye)
const addEmailField = () => setEmails([...emails, ""]);

// 3. Remove Email Field
const removeEmailField = (index) => {
  if (emails.length > 1) { // Kam az kam ek field honi chahiye
    setEmails(emails.filter((_, i) => i !== index));
  }
};

  if (isUsersLoading) return <div className="p-10 text-center animate-pulse">Loading Users Engine...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans relative">
      {toast.show && (
        <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 border border-slate-700">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      <div className="mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Users and Teams
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm font-medium">
              Manage organization members and access levels.
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2.5 transition-all shadow-lg active:scale-95 font-semibold text-sm"
          >
            <UserPlus size={18} /> Invite User
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-md group">
            <Search
              className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500"
              size={19}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border border-slate-200 rounded-2xl px-5 py-3 bg-white text-sm font-semibold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="dev">Developer</option>
            <option value="manager">Manager</option>
            <option value="qa">Quality Assurance</option>
          </select>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  User Details
                </th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Role
                </th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Team
                </th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">
                  Last Seen
                </th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-blue-50/30 cursor-pointer transition-all"
                >
                  <td
                    onClick={() => setSelectedUser(user)}
                    className="px-8 py-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-blue-700">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                    {user.role === "org_admin"
                      ? "Admin"
                      : user.role === "dev"
                        ? "Developer"
                        : user.role === "qa"
                          ? "Quality Assurance"
                          : user.role === "manager"
                            ? "Project Manager"
                            : "No Role"}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                    {user.team}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ring-1 ring-inset ${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                          : user.status === "Disabled"
                            ? "bg-red-50 text-red-700 ring-red-600/20"
                            : user.status === "pending"
                              ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                              : "bg-amber-50 text-amber-700 ring-amber-600/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : user.status === "Disabled" ? "bg-red-500" : user.status === "pending" ? "bg-blue-500" : "bg-amber-500"}`}
                      />
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right flex justify-end items-center gap-5">
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">
                      {user.lastActive
                        ? new Date(user?.lastActive).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "N/A"}
                    </span>
                  </td>

                  <td className="px-6 py-5 relative">
                    <button
                      onClick={(e) => toggleMenu(e, user.id)}
                      className="text-slate-300 group-hover:text-slate-600 absolute right-6"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === user.id && (
                      <div className="absolute right-10 -top-10 z-500 w-40 bg-white rounded-lg shadow-xl border border-slate-100 py-1">
                        {["dev", "qa", "manager"].map((role) => (
                          <button
                            key={role}
                            onClick={() => handleUpdateRole(user.id, role)} // Backend call function
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 capitalize"
                          >
                            {role.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="flex w-[25%] flex-col items-center animate-in slide-in-from-right duration-500 bg-white p-8 rounded-2xl">
            <span className="text-4xl mb-6">👋</span>
            <h2 className="text-2xl font-bold text-gray-800">
              Invite your team
            </h2>
            <p className="text-gray-500 text-sm mt-1 mb-8">
              Add members to{" "}
              <span className="text-indigo-600 font-bold">
                {name || "Workspace"}
              </span>
            </p>

            <div className="w-full space-y-3 mb-6">
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...emails];
                      newEmails[index] = e.target.value;
                      setEmails(newEmails);
                    }}
                    placeholder={`teammate${index + 1}@company.com`}
                    className="flex-1 border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  {emails.length > 1 && (
                    <button
                      onClick={() => removeEmailField(index)}
                      className="p-3 border border-red-100 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-all"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addEmailField}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-md text-gray-500 font-medium flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-500 transition-all"
              >
                <Plus size={18} /> Add another email
              </button>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-md font-semibold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                 Cancel
              </button>
              <button
                onClick={handleSendInvites} // Ab ye final create trigger karega
                disabled={isInviting}
                className="flex-[1.5] py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                {isInviting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Send Invitation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onTogglePermissions={onTogglePermissions}
        />
      )}
    </div>
  );
}
function UserDetailsModal({ user, onClose, onTogglePermissions }) {
  const projects = user.projects || [];
  const joinedDate = user.joined
    ? new Date(user.joined).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const getOnlineStatus = (lastActive) => {
    if (!lastActive) return "Offline";

    const now = new Date();
    const lastActiveDate = new Date(lastActive);

    const diffInSeconds = (now - lastActiveDate) / 1000;

    return diffInSeconds < 20 ? "Online" : "Offline";
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex justify-end z-[150]">
      <div className="bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col border-l border-slate-100">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-50 rounded-2xl border border-slate-100 text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Profile Card */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[32px] flex items-center justify-center text-white text-3xl font-black shadow-xl">
              {user.name?.charAt(0)}
            </div>
            <h3 className="mt-5 text-2xl font-extrabold text-slate-900">
              {user.name}
            </h3>
            <p className="text-slate-500 font-medium flex items-center gap-1.5 mt-1">
              <Mail size={14} /> {user.email}
            </p>
          </div>

          {/* Role & Team Grid */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Role & Access
            </h4>
            <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
              <DetailRow
                label="Role"
                value={
                  user.role === "org_admin"
                    ? "Admin"
                    : user.role === "dev"
                      ? "Developer"
                      : user.role === "qa"
                        ? "Quality Assurance"
                        : user.role === "manager"
                          ? "Project Manager"
                          : "No Role"
                }
              />
              <DetailRow label="Team" value={user.team || "N/A"} isTeam />
              <DetailRow label="Status" value={user.status} isStatus />
              <DetailRow
                label="Presence"
                value={getOnlineStatus(user.lastActive)}
                isTime
              />
            </div>
          </div>

          {/* Dynamic Project Memberships */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Project Memberships
            </h4>
            <div className="grid gap-3">
              {projects.length > 0 ? (
                projects.map((p, i) => (
                  <div
                    key={p.projectId}
                    className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl"
                  >
                    <span className="text-sm font-bold text-slate-700">
                      {p.projectName}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 italic font-mono">
                      ID: {p.projectId}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No active project memberships.
                </p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-slate-100 flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
            <div className="flex items-center gap-1">
              <Hash size={12} /> ID: {user.id}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} /> Joined: {joinedDate}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-8 bg-white border-t border-slate-100">
          <button
            onClick={() => onTogglePermissions(user.id)}
            // disabled={user.status === 'Disabled'}
            className={`w-full py-4 font-bold rounded-2xl transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2 shadow-lg ${
              user.status === "Disabled"
              // ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              // : 'bg-white border-2 border-red-50 text-red-600 hover:bg-red-50 shadow-red-100/50'
            }`}
          >
            <Shield size={16} />
            {user.status === "Disabled"
              ? "Enable User Access"
              : "Disable User Access"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, isStatus, isTeam, isTime }) {
  const getStatusColor = (val) => {
    if (val === "active") return "text-emerald-600";
    if (val === "Disabled") return "text-red-600";
    return "text-amber-600";
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px] font-bold text-slate-400">{label}</span>
      <span
        className={`text-sm font-bold ${
          isStatus
            ? getStatusColor(value)
            : isTeam
              ? "text-blue-600"
              : isTime
                ? "text-slate-400 italic"
                : "text-slate-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
