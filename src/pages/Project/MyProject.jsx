import React, { useState, useMemo } from "react";
import {
  Layout,
  Code2,
  MoreVertical,
  ChevronDown,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyProject = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [rolesFilter, setRolesFilter] = useState("All Roles");

  // Stats data
  const stats = [
    {
      label: "Total Projects",
      count: "03",
      color: "from-blue-600 to-indigo-600",
    },
    {
      label: "Active Projects",
      count: "01",
      color: "from-emerald-500 to-teal-600",
    },
    { label: "On Hold", count: "01", color: "from-orange-400 to-rose-500" },
    {
      label: "Full Stack Roles",
      count: "01",
      color: "from-purple-500 to-violet-600",
    },
  ];

  // Project data
  const initialProjects = [
    {
      name: "E Commerce Platform",
      role: "Full Stack",
      status: "Active",
      activity: "2 hours ago",
      roleClass: "bg-blue-50 text-blue-600 border-blue-100",
      statusClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      name: "Portfolio Website",
      role: "Frontend",
      status: "On Hold",
      activity: "1 day ago",
      roleClass: "bg-cyan-50 text-cyan-600 border-cyan-100",
      statusClass: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      name: "Admin Dashboard",
      role: "Backend",
      status: "Archived",
      activity: "2 minutes ago",
      roleClass: "bg-purple-50 text-purple-600 border-purple-100",
      statusClass: "bg-slate-50 text-slate-500 border-slate-100",
    },
  ];

  // --- Search & Filter Logic ---
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All Status" || project.status === statusFilter;
      const matchesRoles =
        rolesFilter === "All Roles" || project.role === rolesFilter;
      return matchesSearch && matchesStatus && matchesRoles;
    });
  }, [searchTerm, statusFilter, rolesFilter]);

  return (
    <div className="flex-1 bg-[#F8FAFC] p-8 overflow-y-auto font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Project Hub
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium text-balance">
            Manage and monitor your ongoing developments.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Stats Section with Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group"
          >
            <div
              className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${stat.color}`}
            />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-black text-slate-800">
                {stat.count}
              </h2>
              <div className="p-2 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform">
                <Activity size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 ring-blue-500/10 focus:bg-white transition-all text-slate-700 font-medium"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Filter
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-slate-600 outline-none cursor-pointer hover:border-slate-300 transition-all w-full"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>On Hold</option>
                <option>Archived</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Filter
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <select
                value={rolesFilter}
                onChange={(e) => setRolesFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-slate-600 outline-none cursor-pointer hover:border-slate-300 transition-all w-full"
              >
                <option>All Roles</option>
                <option>Full Stack</option>
                <option>Backend</option>
                <option>Frontend</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Project Details
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Role
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Activity
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/40 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold shadow-inner">
                          {project.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors cursor-pointer">
                            {project.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                            <ExternalLink size={10} /> ucollyx.com/project-{idx}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${project.roleClass}`}
                      >
                        {project.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${project.status === "Active" ? "bg-emerald-500" : "bg-orange-400"}`}
                        />
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${project.statusClass}`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-slate-500 font-semibold">
                        {project.activity}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate("/kanban-board")}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                          title="Kanban Board"
                        >
                          <Layout size={16} />
                        </button>
                        <button
                          onClick={() => navigate("/ide")}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all shadow-sm"
                          title="Open IDE"
                        >
                          <Code2 size={16} />
                        </button>
                        <button className="p-2.5 text-slate-300 hover:text-slate-600 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Search size={40} className="mb-4" />
                      <p className="text-lg font-bold">No projects found</p>
                      <p className="text-sm font-medium">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyProject;
