import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, Search as SearchIcon, Loader2 } from "lucide-react";
import TeamMemberModal from "./TeamMemberModal";
import API from "../../../../api/axios";
import { useMyProjects } from "../../../../hooks/useProjects";

const TeamActivity = () => {
  // --- 1. STATES FOR REAL DATA & FILTERS ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [selectedMember, setSelectedMember] = useState(null);
  
  const [projectData, setProjectData] = useState(null);
  useEffect(() => {
    const fetchTeamActivity = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/team/activity/${projectFilter}`);
        // Axios response se nested data extract karna (response.data.data)
        if (response.data && response.data.success) {
          setProjectData(response.data.data);
        } else {
          setError("Failed to fetch accurate data structure");
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError(err.message || "Something went wrong while fetching logs");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamActivity();
  }, [projectFilter]);

  const members = useMemo(() => {
    if (!projectData || !projectData.Tasks) return [];

    const memberMap = new Map();
    const projectName = projectData.name || "Mobile App";

    projectData.Tasks.forEach((task) => {
      if (task.assignees && Array.isArray(task.assignees)) {
        task.assignees.forEach((assignee) => {
          if (!memberMap.has(assignee.id)) {
            // Dynamic Workload Logic based on task counts
            const totalAssignedTasks = projectData.Tasks.filter((t) =>
              t.assignees.some((a) => a.id === assignee.id),
            ).length;

            const doneTasks = projectData.Tasks.filter(
              (t) =>
                t.status === "done" &&
                t.assignees.some((a) => a.id === assignee.id),
            ).length;

            // Simple conditional metrics computation
            let status = "Balanced";
            let color = "bg-green-500";
            let percentage = 85;
            let hours = "34h / 40h";

            if (totalAssignedTasks > 4) {
              status = "Overloaded";
              color = "bg-red-500";
              percentage = 120;
              hours = "48h / 40h";
            } else if (totalAssignedTasks < 2) {
              status = "Underutilized";
              color = "bg-yellow-500";
              percentage = 45;
              hours = "18h / 40h";
            }

            memberMap.set(assignee.id, {
              id: assignee.id,
              name: assignee.full_name || "Unknown Developer",
              email: assignee.email,
              avatar: assignee?.avatar_url,
              role: assignee.email.includes("admin") ? "Admin" : "Full Stack", // Dummy role dynamic match
              projects: [projectName],
              tasks: `${doneTasks}/${totalAssignedTasks}`,
              hours: hours,
              status: status,
              color: color,
              percentage: percentage,
            });
          }
        });
      }
    });

    return Array.from(memberMap.values());
  }, [projectData]);

  const { data: myProjects } = useMyProjects();
  const projects = myProjects?.data || [];

  console.log(
    "########################################################",
    projects,
    members,
    projectFilter,
  );

  // --- 4. DYNAMIC FILTER LOGIC ---
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject =
        projectFilter === "All Projects" || m.projects.includes(projectFilter);
      const matchesRole = roleFilter === "All Roles" || m.role === roleFilter;
      return matchesSearch && matchesProject && matchesRole;
    });
  }, [members, searchTerm, projectFilter, roleFilter]);

  // --- 5. DYNAMIC STATS ---
  const teamStats = useMemo(() => {
    return [
      {
        label: "Active Members",
        val: filteredMembers.length,
        sub: `Showing ${filteredMembers.length} results`,
        icon: "👤",
      },
      {
        label: "Balanced",
        val: filteredMembers.filter((m) => m.status === "Balanced").length,
        sub: "Optimal capacity",
        icon: "✓",
        color: "text-green-500",
      },
      {
        label: "Overloaded",
        val: filteredMembers.filter((m) => m.status === "Overloaded").length,
        sub: "Needs attention",
        icon: "⚠️",
        color: "text-red-500",
      },
      {
        label: "Underutilized",
        val: filteredMembers.filter((m) => m.status === "Underutilized").length,
        sub: "Available capacity",
        icon: "↓",
        color: "text-yellow-500",
      },
    ];
  }, [filteredMembers]);

  // Dropdown list sets
  const allProjects = useMemo(
    () => ["All Projects", ...new Set(members.flatMap((m) => m.projects))],
    [members],
  );
  const allRoles = useMemo(
    () => ["All Roles", ...new Set(members.map((m) => m.role))],
    [members],
  );

  // Loading Screen State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfcfc]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
        <p className="text-xs font-bold text-slate-400">
          Loading live workspace activity...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Team Activity
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-1">
            Monitor workload distribution and Team Capacity
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative group">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500"
              size={14}
            />
            <input
              type="text"
              placeholder="Search member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold outline-none focus:border-blue-500 transition-all w-48"
            />
          </div>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs font-bold text-slate-500 outline-none cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs font-bold text-slate-500 outline-none cursor-pointer"
          >
            {allRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border border-slate-100 rounded-md p-6 shadow-sm mb-8">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">
          Team Load Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamStats.map((s, i) => (
            <div
              key={i}
              className="bg-slate-50/50 border border-slate-100 p-5 rounded-md group hover:bg-white hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-black uppercase text-slate-400">
                  {s.label}
                </p>
                <span className="text-sm">{s.icon}</span>
              </div>
              <h3
                className={`text-2xl font-black ${s.color || "text-slate-800"}`}
              >
                {s.val}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1">
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Dynamic Capacity Utilization Bar Graph */}
        <div className="mt-10">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-6">
            Filtered Results Capacity
          </p>
          <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
            {filteredMembers.map((m, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-600 w-24 truncate">
                  {m.name}
                </span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${m.color} h-full transition-all duration-700`}
                    style={{ width: `${Math.min(m.percentage, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-slate-400 w-8 text-right">
                  {m.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-md overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-sm font-black text-slate-800">
            Team Member Activity
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            {filteredMembers.length} of {members.length} members
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="px-6 py-4">Developer</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Current Projects</th>
                <th className="px-6 py-4 text-center">
                  Active Tasks (Done/Total)
                </th>
                <th className="px-6 py-4 text-center">Hours / Week</th>
                <th className="px-6 py-4">Workload Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-xs font-bold text-slate-400"
                  >
                    No active assignees found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedMember(m)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full border border-blue-100 bg-blue-600 w-10 h-10 flex items-center justify-center text-white font-black text-xs shadow-sm uppercase overflow-hidden">
                          {m?.avatar ? (
                            <img
                              src={m?.avatar}
                              alt="Avatar"
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover"
                            />
                          ) : m?.name ? (
                            m?.name[0]
                          ) : (
                            "U"
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">
                            {m.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold">
                            {m.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-slate-500 border border-slate-200 px-2 py-1 rounded-md bg-white">
                        {m.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                        {m.projects.map((p, pi) => (
                          <span
                            key={pi}
                            className="text-[9px] font-bold text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md bg-blue-50/30"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-black text-slate-700">
                      {m.tasks}
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-black text-slate-700">
                      {m.hours}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full w-20 overflow-hidden">
                          <div
                            className={`${m.color} h-full`}
                            style={{ width: `${Math.min(m.percentage, 100)}%` }}
                          />
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase ${m.status === "Overloaded" ? "text-red-500" : m.status === "Underutilized" ? "text-yellow-500" : "text-green-500"}`}
                        >
                          {m.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMember && (
        <TeamMemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          projectData={projectData}
        />
      )}
    </div>
  );
};

export default TeamActivity;
