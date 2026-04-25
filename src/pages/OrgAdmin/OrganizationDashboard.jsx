import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import InviteModal from "./InviteModal";

import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";
import API from "../../api/axios";
import PendingRequestsModal from "./PendingRequestsModal";

const OrganizationDashboard = () => {
  // Dynamic Data based on your uploaded screen

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

  // const stats = {
  //   users: { total: 47, pending: 3, developers: 32, managers: 15 },
  //   projects: { active: 23, withoutManager: 2, archived: 8 },
  //   alerts: { withoutRoles: 4, conflicts: 0 }
  // };

  const handleRequestAction = (message) => {
    toast.success(message);
    fetchDashboardData(); // Refresh counts and list
    // Agar list khali ho jaye to modal band kar dein
    if (stats.pendingList.length <= 1) setIsPendingModalOpen(false);
  };

  // API se data mangwanay ka function
  const fetchDashboardData = async () => {
    try {
      // Workspace ID filhal 1 hai, aap ise context ya URL se le sakte hain
      const workspaceId = 1;
      const res = await API.get(`/workspace/${workspaceId}/dashboard-stats`);

      console.log(res.data.data);

      if (res.data.success) {
        setStats(res.data.data);
        // Success Sound
        new Audio("/sounds/success.mp3").play().catch(() => {});
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      // Error Toast
      toast.error("Database se data sync nahi ho saka");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const navigate = useNavigate();

  const [showInviteModal, setShowInviteModal] = useState(false);

  const recentActions = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "added as Developer",
      time: "2 hours ago",
      icon: "👤",
    },
    {
      id: 2,
      user: "Mike Chen's",
      action: "role changed to Manager",
      time: "5 hours ago",
      icon: "⚙️",
    },
    {
      id: 3,
      user: "New project",
      action: '"Mobile App Redesign" created',
      time: "Yesterday",
      icon: "📁",
    },
    {
      id: 4,
      user: "3 team invitations",
      action: "sent",
      time: "2 days ago",
      icon: "📩",
    },
    {
      id: 5,
      user: "Billing plan",
      action: "upgraded to Business",
      time: "3 days ago",
      icon: "💳",
    },
  ];

  const onInvite = (newUser) => {
    console.log(newUser);
    alert(newUser.role);
    setShowInviteModal(false);
  };

  const total = stats?.users?.total || 1; // 1 taake division by zero error na aaye

  const devPercentage = Math.round((stats?.users?.developers / total) * 100);
  const managerPercentage = Math.round((stats?.users?.managers / total) * 100);
  const qaPercentage = Math.round((stats?.users?.qa / total) * 100);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="text-indigo-600 font-black text-xl animate-pulse">
          UCOLLYX ENGINE SYNCING...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-12 font-sans text-left selection:bg-indigo-100">
      <Modal />
      <div className="mx-auto mb-12 flex justify-between items-end">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">
            <span>Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">Settings</span>
          </nav>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {stats?.workspace?.name}
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Overview of organization and key metrics
          </p>
        </div>
      </div>

      <div className="mx-auto grid grid-cols-2 gap-10">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-lg font-black text-slate-800">
                Users Overview
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Team members and invitations
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors italic">
              US
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-500">
                Total Users
              </span>
              <span className="text-3xl font-black text-slate-900 leading-none">
                {stats.users.total}
              </span>
            </div>

            <div className="flex justify-between items-center py-4 border-y border-slate-50">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-500">
                  Pending invitations
                </span>
                <button
                  onClick={() => setIsPendingModalOpen(true)}
                  className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter cursor-pointer"
                >
                  {stats.users.pending} pending
                </button>
              </div>
              <span className="text-xl font-black text-slate-800">
                {stats.users.pending}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-4">
          
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Developers</span>
                  <span className="text-slate-800">
                    {stats.users.developers}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${devPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Managers</span>
                  <span className="text-slate-800">{stats.users.managers}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${managerPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>QA Engineers</span>
                  <span className="text-slate-800">{stats.users.qa}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${qaPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/org-admin/users")}
            className="mt-12 text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-2 group/btn"
          >
            Manage Users{" "}
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>

        {/* Card 2: Projects Overview */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-lg font-black text-slate-800">
                Projects Overview
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Active projects and status
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center italic text-slate-400">
              PR
            </div>
          </div>

          <div className="space-y-10">
            {[
              { label: "Active Projects", val: stats.projects.active },
              {
                label: "Without Manager",
                val: stats.projects.withoutManager,
                tag: "Action Needed",
              },
              { label: "Archived Project", val: stats.projects.archived },
            ].map((row, i) => (
              <div
                key={i}
                className="flex justify-between items-center group/row cursor-default"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-500 group-hover/row:text-slate-800 transition-colors">
                    {row.label}
                  </span>
                  {row.tag && (
                    <span onClick={()=>navigate('/org-admin/projects')} className="bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                      {row.tag}
                    </span>
                  )}
                </div>
                <span className="text-2xl font-black text-slate-800">
                  {row.val}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/org-admin/projects")}
            className="mt-12 text-xs font-black text-indigo-600 flex items-center gap-2"
          >
            View Projects <span>→</span>
          </button>
        </div>

        {/* Card 3: Permissions Alerts */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h3 className="text-lg font-black text-slate-800">Users Overview</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 mb-8">
            Permission alerts and conflicts
          </p>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl mb-10 flex gap-4 items-center">
            <div className="w-2 h-10 bg-amber-400 rounded-full" />
            <div>
              <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                Attention Required
              </h4>
              <p className="text-sm font-bold text-slate-700">
                4 users are without roles
              </p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-500">
                  Users Without Roles
                </span>
                <span className="bg-red-50 text-red-500 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                  Urgent
                </span>
              </div>
              <span className="text-2xl font-black text-slate-800">
                {stats?.alerts?.withoutRoles}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">
                Access Conflicts
              </span>
              <span className="text-2xl font-black text-slate-800">
                {stats?.alerts?.conflicts}
              </span>
            </div>
          </div>
          <button className="mt-12 text-xs font-black text-indigo-600 flex items-center gap-2">
            Review Access <span>→</span>
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h3 className="text-lg font-black text-slate-800">Recent Actions</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 mb-10">
            Latest organization changes
          </p>

          <div className="space-y-8 relative before:absolute before:left-[18px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
            {recentActions.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 items-start relative z-10"
              >
                <div className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-sm shadow-sm">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-slate-700 leading-tight">
                    <span className="text-indigo-600">{item.user}</span>{" "}
                    {item.action}
                  </p>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 block uppercase tracking-tighter">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-10 text-xs font-black text-indigo-600 flex items-center gap-2">
            Manage Users <span>→</span>
          </button>
        </div>
      </div>
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={onInvite}
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
