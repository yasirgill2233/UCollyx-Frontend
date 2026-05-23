import React, { useState } from "react";
import {
  Layout,
  Code2,
  ChevronDown,
  Search,
  Filter,
  ExternalLink,
  Activity,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyProjects, useProjectsData } from "../../hooks/useProjects";

const MyProject = () => {
  const navigate = useNavigate();
  
  // 1. Direct Working Fetch Hook API Data 
  const { data: myProjects, isLoading: projectLoading, isError: projectError } = useMyProjects();
  console.log("Hey There I am using whatsapp:", myProjects?.data);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [rolesFilter, setRolesFilter] = useState("All Roles");

  const queryParams = {
    search: searchTerm || undefined,
    status: statusFilter === "All Status" ? undefined : statusFilter,
    role: rolesFilter === "All Roles" ? undefined : rolesFilter,
  };

  // Background queries filtering hook tracker
  const { data: apiResponse } = useProjectsData(queryParams);

  // 2. Fallback Data Pipeline mapping (Console key array injection match ki hai)
  const projectsList = myProjects?.data || [];
  
  // Dynamic metrics sync rules base tracker
  const apiStats = apiResponse?.stats || {
    total: projectsList.length,
    active: projectsList.filter(p => p.status === "Active").length,
    onHold: projectsList.filter(p => p.status === "On Hold").length,
    fullStack: projectsList.filter(p => p.role === "Full Stack" || !p.role).length
  };

  // Badges theme mapping configurations handler
  const getBadgeClasses = (type, value) => {
    // Handling fallback checks for undefined items safely
    const safeValue = value || (type === 'role' ? 'Full Stack' : 'Active');

    if (type === 'role') {
      if (safeValue === 'Full Stack') return "bg-blue-50 text-blue-600 border-blue-100";
      if (safeValue === 'Frontend') return "bg-cyan-50 text-cyan-600 border-cyan-100";
      return "bg-purple-50 text-purple-600 border-purple-100";
    }
    if (safeValue === 'Active') return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (safeValue === 'On Hold') return "bg-orange-50 text-orange-600 border-orange-100";
    return "bg-slate-50 text-slate-500 border-slate-100";
  };

  const formatCount = (num) => String(num).padStart(2, '0');

  const statsDashboard = [
    { label: "Total Projects", count: formatCount(apiStats.total), color: "from-blue-600 to-indigo-600" },
    { label: "Active Projects", count: formatCount(apiStats.active), color: "from-emerald-500 to-teal-600" },
    { label: "On Hold", count: formatCount(apiStats.onHold), color: "from-orange-400 to-rose-500" },
    { label: "Full Stack Roles", count: formatCount(apiStats.fullStack), color: "from-purple-500 to-violet-600" },
  ];

  // 3. Local Search & Selection Filters Logic Over Array
  const localFilteredProjects = projectsList.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || project.status === statusFilter;
    const projectRole = project.role || "Full Stack"; // Fallback to protect UI from blank fields
    const matchesRoles = rolesFilter === "All Roles" || projectRole === rolesFilter;
    
    return matchesSearch && matchesStatus && matchesRoles;
  });

  const handleProjectClick = (slug) => {
    localStorage.setItem("slug", slug);
    navigate(`/dev/ide/${slug}`);
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] p-8 overflow-y-auto font-sans">
      
      {/* Top Main Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Project Hub
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium text-balance">
            Manage and monitor your ongoing ecosystem developments.
          </p>
        </div>
      </div>

      {/* Dynamic Counter Grid System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsDashboard.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group animate-in fade-in duration-200"
          >
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${stat.color}`} />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {projectLoading ? "..." : stat.count}
              </h2>
              <div className="p-2 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform">
                <Activity size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Form Blocks */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:ring-2 ring-blue-500/10 focus:bg-white transition-all text-slate-700 font-medium"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {/* Status Dropdown */}
          <div className="relative flex-1 md:flex-none md:w-44">
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Role Dropdown */}
          <div className="relative flex-1 md:flex-none md:w-44">
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table Content Container */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Synced Activity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              
              {/* LOADING STATE LOGIC OVERLAYS */}
              {projectLoading && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={24} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Streaming database registry logs...</p>
                  </td>
                </tr>
              )}

              {/* ERROR BLOCK SAFE GUARD */}
              {!projectLoading && projectError && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-red-500 bg-red-50/20">
                    <p className="text-sm font-black uppercase tracking-wider">Ecosystem Pipeline Interrupted</p>
                    <p className="text-xs font-semibold mt-1 text-slate-400">Could not resolve operational queries against master backend channels.</p>
                  </td>
                </tr>
              )}

              {/* LIVE DATA ROWS GENERATOR */}
              {!projectLoading && !projectError && localFilteredProjects.map((project, idx) => {
                // Formatting time cleanly using fallback
                const activityTime = project.updatedAt 
                  ? new Date(project.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
                  : "Active now";

                return (
                  <tr key={project.id || idx} className="hover:bg-slate-50/40 transition-colors group animate-in fade-in duration-100">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black shadow-inner uppercase select-none">
                          {(project.name || "P").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => navigate(`/dev/board?projectId=${project.id}`)}>
                            {project.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                            <ExternalLink size={10} /> ucollyx.com/${project.slug || `project-${project.id}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getBadgeClasses('role', project.role)}`}>
                        {project.role || "Full Stack"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${project.status === "Active" ? "bg-emerald-500" : "bg-orange-400"}`} />
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getBadgeClasses('status', project.status)}`}>
                          {project.status || "Active"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-slate-500 font-semibold">
                        {activityTime}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                        
                          onClick={() => navigate(`/dev/board?projectId=${project.id}&projectName=${project.name}`)}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                          title="Kanban Board Workspace"
                        >
                          <Layout size={16} />
                        </button>
                        <button
                          onClick={()=>handleProjectClick(project.slug)}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all shadow-sm active:scale-95"
                          title="Open Cloud IDE"
                        >
                          <Code2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY STATE BLOCK INTERFACE */}
              {!projectLoading && !projectError && localFilteredProjects.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Search size={40} className="mb-4 text-slate-400" />
                      <p className="text-lg font-bold text-slate-700">No projects found</p>
                      <p className="text-sm font-medium text-slate-400">Try adjusting your search query parameters or selection filter tags.</p>
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