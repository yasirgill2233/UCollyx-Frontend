import React, { useState, useMemo } from "react";
import { ChevronDown, Search as SearchIcon } from "lucide-react";
import TeamMemberModal from "./TeamMemberModal";

const TeamActivity = () => {
  // --- 1. STATES FOR FILTERS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [selectedMember, setSelectedMember] = useState(null);

  const members = [
    { name: "David Kim", email: "d.kim@company.com", role: "Full Stack", projects: ["Mobile App", "Admin Dashboard"], tasks: "9/14", hours: "48h / 40h", status: "Overloaded", color: "bg-red-500", percentage: 120 },
    { name: "Emily Chen", email: "e.chen@company.com", role: "Designer", projects: ["Analytics", "Admin Dashboard"], tasks: "3/19", hours: "22h / 40h", status: "Underutilized", color: "bg-yellow-500", percentage: 55 },
    { name: "James Brown", email: "j.brown@company.com", role: "DevOps", projects: ["Payment Service"], tasks: "5/14", hours: "34h / 40h", status: "Balanced", color: "bg-green-500", percentage: 85 },
    { name: "Michael Johnson", email: "m.johnson@company.com", role: "Backend", projects: ["Payment Service"], tasks: "6/20", hours: "38h / 40h", status: "Balanced", color: "bg-green-500", percentage: 95 },
    { name: "Priya Patel", email: "p.patel@company.com", role: "QA", projects: ["Customer Portal", "Payment Service"], tasks: "4/22", hours: "37h / 40h", status: "Balanced", color: "bg-green-500", percentage: 92 },
    { name: "Sarah Anderson", email: "s.anderson@company.com", role: "Frontend", projects: ["Customer Portal", "Analytics"], tasks: "12/20", hours: "52h / 40h", status: "Overloaded", color: "bg-red-500", percentage: 130 },
    { name: "Sophia Rodriguez", email: "s.rodriguez@company.com", role: "Frontend", projects: ["Customer Portal"], tasks: "6/17", hours: "36h / 40h", status: "Balanced", color: "bg-green-500", percentage: 90 },
  ];

  // --- 2. DYNAMIC FILTER LOGIC ---
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject = projectFilter === "All Projects" || m.projects.includes(projectFilter);
      const matchesRole = roleFilter === "All Roles" || m.role === roleFilter;
      return matchesSearch && matchesProject && matchesRole;
    });
  }, [searchTerm, projectFilter, roleFilter]);

  // --- 3. DYNAMIC STATS BASED ON FILTERED DATA ---
  const teamStats = useMemo(() => {
    return [
      { label: "Active Members", val: filteredMembers.length, sub: `Showing ${filteredMembers.length} results`, icon: "👤" },
      { label: "Balanced", val: filteredMembers.filter(m => m.status === "Balanced").length, sub: "Optimal capacity", icon: "✓", color: "text-green-500" },
      { label: "Overloaded", val: filteredMembers.filter(m => m.status === "Overloaded").length, sub: "Needs attention", icon: "⚠️", color: "text-red-500" },
      { label: "Underutilized", val: filteredMembers.filter(m => m.status === "Underutilized").length, sub: "Available capacity", icon: "↓", color: "text-yellow-500" },
    ];
  }, [filteredMembers]);

  // Unique Projects & Roles for Dropdowns
  const allProjects = ["All Projects", ...new Set(members.flatMap(m => m.projects))];
  const allRoles = ["All Roles", ...new Set(members.map(m => m.role))];

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Team Activity</h1>
          <p className="text-xs font-bold text-slate-400 mt-1">Monitor workload distribution and Team Capacity</p>
        </div>
        
        {/* Search & Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={14} />
            <input 
              type="text"
              placeholder="Search member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-blue-500 transition-all w-48"
            />
          </div>
          <select 
            value={projectFilter} 
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 outline-none cursor-pointer"
          >
            {allProjects.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 outline-none cursor-pointer"
          >
            {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm mb-8">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Team Load Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamStats.map((s, i) => (
            <div key={i} className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl group hover:bg-white hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-black uppercase text-slate-400">{s.label}</p>
                <span className="text-sm">{s.icon}</span>
              </div>
              <h3 className={`text-2xl font-black ${s.color || "text-slate-800"}`}>{s.val}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Dynamic Capacity Utilization Bar Graph */}
        <div className="mt-10">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-6">Filtered Results Capacity</p>
          <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
            {filteredMembers.map((m, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-600 w-24 truncate">{m.name}</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${m.color} h-full transition-all duration-700`} style={{ width: `${Math.min(m.percentage, 100)}%` }} />
                </div>
                <span className="text-[10px] font-black text-slate-400 w-8 text-right">{m.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-sm font-black text-slate-800">Team Member Activity</h2>
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
                <th className="px-6 py-4 text-center">Active Tasks</th>
                <th className="px-6 py-4 text-center">Hours / Week</th>
                <th className="px-6 py-4">Workload Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMembers.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50/30 transition-colors cursor-pointer" onClick={() => setSelectedMember(m)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${m.color} text-white flex items-center justify-center text-[10px] font-black`}>
                        {m.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{m.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-slate-500 border border-slate-200 px-2 py-1 rounded-lg bg-white">{m.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                      {m.projects.map((p, pi) => (
                        <span key={pi} className="text-[9px] font-bold text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md bg-blue-50/30">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-black text-slate-700">{m.tasks}</td>
                  <td className="px-6 py-4 text-center text-xs font-black text-slate-700">{m.hours}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full w-20 overflow-hidden">
                        <div className={`${m.color} h-full`} style={{ width: `${Math.min(m.percentage, 100)}%` }} />
                      </div>
                      <span className={`text-[9px] font-black uppercase ${m.status === "Overloaded" ? "text-red-500" : m.status === "Underutilized" ? "text-yellow-500" : "text-green-500"}`}>
                        {m.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedMember && (
        <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
};

export default TeamActivity;