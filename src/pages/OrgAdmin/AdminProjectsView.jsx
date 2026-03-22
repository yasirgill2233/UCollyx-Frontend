import React, { useState, useMemo } from "react";

const AdminProjectsView = () => {
  // --- States ---
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null); // 'create', 'team', 'archive'
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [selectedProjectForSidebar, setSelectedProjectForSidebar] =
    useState(null);
  const [activeTab, setActiveTab] = useState("Overview"); // 'Overview', 'Team', 'Channel'

  // --- Data State ---
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Platform Redesign",
      code: "proj_234Kdd34",
      tag: "# platform-redesign",
      status: "ACTIVE",
      manager: "Sarah Khan",
      members: [1, 5],
      date: "Feb 03, 2026",
    },
    {
      id: 2,
      name: "E-Commerce Checkout",
      code: "proj_234Kdd34",
      tag: "# e-commerce-checkout",
      status: "PAUSED",
      manager: "Sarah Khan",
      members: [1, 3, 4, 5],
      date: "Feb 03, 2026",
    },
    {
      id: 3,
      name: "Backend Infrastructure",
      code: "proj_234Kdd34",
      tag: "# backend-infrastructure",
      status: "ACTIVE",
      manager: null,
      members: [1, 2, 3, 4, 5],
      date: "Feb 03, 2026",
    },
    {
      id: 4,
      name: "Platform Redesign",
      code: "proj_234Kdd34",
      tag: "# platform-redesign",
      status: "ARCHIVED",
      manager: "Sarah Khan",
      members: [1, 2, 3],
      date: "Feb 03, 2026",
    },
  ]);

  // --- Mock Data: All Users in Organization (Dropdown ke liye) ---
  const allUsers = [
    { id: 1, name: "Sarah Khan", email: "sarah@acme.com", avatar: "SK" },
    { id: 2, name: "Mike Chen", email: "mike@acme.com", avatar: "MC" },
    { id: 3, name: "Alex Rivera", email: "alex@acme.com", avatar: "AR" },
    { id: 4, name: "Zain Ahmed", email: "zain@acme.com", avatar: "ZA" },
    { id: 5, name: "Dania Javeed", email: "dania@acme.com", avatar: "DJ" },
  ];

  const [selectedUserId, setSelectedUserId] = useState("");

  // --- Team Management State ---
  const [memberSearch, setMemberSearch] = useState("");
  const [projectTeam, setProjectTeam] = useState([]);

  // --- Helper: Get Selected Project Object ---
  const currentProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [selectedProjectId, projects],
  );

  // --- Helper: Render Avatar Group ---
  const renderAvatarGroup = (memberIds = []) => {
    if (!Array.isArray(memberIds)) return null;
    const maxVisible = 4;
    const visibleIds = memberIds.slice(0, maxVisible);
    const remainingCount = memberIds.length - maxVisible;

    return (
      <div className="flex justify-center -space-x-3">
        {visibleIds.map((id) => {
          const user = allUsers.find((u) => u.id === id);
          return (
            <div
              key={id}
              className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm ${user?.color || "bg-slate-400"}`}
            >
              {user?.avatar || "?"}
            </div>
          );
        })}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
            +{remainingCount}
          </div>
        )}
      </div>
    );
  };

  // 1. Initial State ko ID base par rakhein
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
    managerId: "", // manager string ki jagah managerId
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    // 1. Pehle check karein ke manager select hua hai ya nahi
    // Agar dropdown mein ID save ho rahi hai, toh user object find karein
    const selectedManager = allUsers.find(
      (u) =>
        u.name === newProject.manager || u.id === parseInt(newProject.manager),
    );

    const newId = Date.now();
    const projectToAdd = {
      ...newProject,
      id: newId,
      // Manager ka naam string mein save karein taake table render kar sakay
      manager: selectedManager ? selectedManager.name : null,
      code: `proj_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      tag: `#${newProject.name.toLowerCase().replace(/\s+/g, "-")}`,
      // Manager ko automatically members list mein add kar dein
      members: selectedManager ? [selectedManager.id] : [],
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    setProjects([projectToAdd, ...projects]);
    setSelectedProjectId(newId);

    // Team modal ke liye manager ko initialize karein
    if (selectedManager) {
      setProjectTeam([{ ...selectedManager, role: "Project Manager" }]);
    } else {
      setProjectTeam([]);
    }

    setNewProject({ name: "", description: "", status: "ACTIVE", manager: "" });
    setActiveModal("team");
  };

  const handleAddMember = () => {
    if (!selectedUserId || !selectedProjectId) return;
    const userId = parseInt(selectedUserId);

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === selectedProjectId) {
          if (p.members.includes(userId)) return p;
          return { ...p, members: [...p.members, userId] };
        }
        return p;
      }),
    );

    // 1. Check if member already in the current modal list
    if (projectTeam.find((m) => m.id === userId)) {
      alert("This member is already added to the team.");
      return;
    }

    // 2. Find user from allUsers
    const user = allUsers.find((u) => u.id === userId);

    if (user) {
      const newMember = {
        ...user,
        role: "Developer", // Default role
      };
      // 3. Update local modal state
      setProjectTeam((prev) => [...prev, newMember]);
    }
    setSelectedUserId("");
  };

  const removeMember = (userId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProjectId
          ? { ...p, members: p.members.filter((id) => id !== userId) }
          : p,
      ),
    );
    setProjectTeam((prev) => prev.filter((m) => m.id !== userId));
  };

  const updateRole = (id, newRole) => {
    setProjectTeam(
      projectTeam.map((m) => (m.id === id ? { ...m, role: newRole } : m)),
    );
  };

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  // --- Filtering Logic ---
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeFilter === "Active")
        return matchesSearch && p.status === "ACTIVE";
      if (activeFilter === "Archived")
        return matchesSearch && p.status === "ARCHIVED";
      if (activeFilter === "No Manager") return matchesSearch && !p.manager;
      return matchesSearch;
    });
  }, [searchQuery, activeFilter, projects]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((p) => p.status === "ACTIVE").length,
      noManager: projects.filter((p) => p.manager === null).length,
      archived: projects.filter((p) => p.status === "ARCHIVED").length,
    }),
    [projects],
  );

  return (
    <div className="min-h-screen bg-white p-12 text-left font-sans relative selection:bg-indigo-100">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Organize work and define ownership
          </p>
        </div>
        <button
          onClick={() => setActiveModal("create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
        >
          <span className="text-lg">+</span> Create Project
        </button>
      </div>

      {/* --- FILTERS & SEARCH --- */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex gap-3">
          {["All Projects", "Active", "Archived", "No Manager"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-5 py-2 text-xs font-bold rounded-lg border transition-all ${
                activeFilter === tab
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "text-slate-500 border-slate-100 bg-white hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Projects..."
            className="w-80 bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-5 py-2.5 text-xs outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
          />
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-4 gap-0 border border-slate-100 rounded-[2rem] overflow-hidden mb-12 shadow-sm bg-white">
        {[
          { l: "Total", v: stats.total, c: "text-slate-800" },
          { l: "Active", v: stats.active, c: "text-emerald-500" },
          { l: "Need Manager", v: stats.noManager, c: "text-amber-500" },
          { l: "Archived", v: stats.archived, c: "text-slate-400" },
        ].map((s, i) => (
          <div
            key={i}
            className={`p-8 ${i !== 3 ? "border-r border-slate-100" : ""}`}
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              {s.l}
            </p>
            <p className={`text-3xl font-black tracking-tighter ${s.c}`}>
              {s.v < 10 ? `0${s.v}` : s.v}
            </p>
          </div>
        ))}
      </div>

      {/* --- PROJECTS TABLE --- */}
      <div className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm bg-white">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Project
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Status
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Manager
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Members
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Created
              </th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProjects.map((project) => (
              <tr
                onClick={() => {
                  setSelectedProjectForSidebar(project);
                  setActiveTab("Overview");
                }}
                key={project.id}
                className="hover:bg-slate-50/30 group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 italic">
                      P
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {project.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {project.code}
                        </span>
                        <span className="text-[9px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-bold">
                          {project.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <span
                    className={`text-[9px] font-black px-3 py-1 rounded-full border ${project.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : project.status === "PAUSED" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {project.manager ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full border border-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-600 italic">
                        SK
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {project.manager
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-lg border border-amber-200 uppercase tracking-tighter italic">
                      No Manager
                    </span>
                  )}
                </td>
                <td className="px-8 py-6 text-center">
                  {renderAvatarGroup(project.members)}
                </td>
                <td className="px-8 py-6 text-sm font-bold text-slate-500">
                  {project.date}
                </td>
                <td className="px-8 py-6 text-right relative">
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === project.id ? null : project.id,
                      )
                    }
                    className="text-slate-300 hover:text-slate-600 text-xl font-bold p-2 transition-colors"
                  >
                    ⋮
                  </button>
                  {openDropdownId === project.id && (
                    <div className="absolute right-12 top-10 bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-10 w-44 text-left animate-in fade-in slide-in-from-top-2">
                      <button
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          setActiveModal("team");
                        }}
                        className="w-full px-4 py-2 text-[11px] font-black text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        👥 Manage Team
                      </button>
                      <button
                        onClick={() => {
                          setActiveModal("archive");
                          setSelectedProject(project);
                          setOpenDropdownId(null);
                        }}
                        className="w-full px-4 py-2 text-[11px] font-black text-rose-500 hover:bg-rose-50 flex items-center gap-2"
                      >
                        📦 Archive Project
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODALS SECTION --- */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          {/* 1. Create Project Modal (Image 7) */}
          {activeModal === "create" && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl w-full max-w-xl p-10 shadow-2xl animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Create New Project
                  </h2>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-slate-300 hover:text-slate-900 text-xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Project Name
                    </label>
                    <input
                      name="name"
                      value={newProject.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Mobile App Redesign"
                      className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newProject.description}
                      onChange={handleInputChange}
                      placeholder="Describe the goals of this project..."
                      className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none transition-all h-24 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Status Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Initial Status
                      </label>
                      <select
                        name="status"
                        value={newProject.status}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none bg-slate-50 cursor-pointer font-bold text-slate-700"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="PAUSED">Paused</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>

                    {/* Manager Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Project Manager
                      </label>
                      <select
                        name="manager"
                        value={newProject.manager}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none bg-slate-50 cursor-pointer font-bold text-slate-700"
                      >
                        <option value="">Select Manager (Optional)</option>
                        <option value="Sarah Khan">Sarah Khan</option>
                        <option value="Mike Chen">Mike Chen</option>
                        <option value="Alex Rivera">Alex Rivera</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="channel"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label
                      htmlFor="channel"
                      className="text-xs font-bold text-slate-500 italic"
                    >
                      Auto-create Slack/Team channel for this project
                    </label>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-4 border border-slate-100 rounded-2xl font-black text-[10px] text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                      Create & Continue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* --- TEAM MODAL (IMAGE 8 LOGIC) --- */}
          {activeModal === "team" && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in duration-200">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Manage Team
                    </h2>
                    <p className="text-sm text-slate-400 font-medium mt-1 italic italic">
                      Select members for "{selectedProject?.name}"
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="text-slate-300 hover:text-slate-900 text-xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* SEARCHABLE DROPDOWN & ADD BUTTON */}
                <div className="flex gap-3 mb-10">
                  <div className="flex-1">
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full border border-slate-100 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all bg-slate-50/50 font-bold text-slate-600 appearance-none"
                    >
                      <option value="">Choose a member from list...</option>
                      {allUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAddMember}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    Add
                  </button>
                </div>

                {/* MEMBERS LIST */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 mb-10">
                  {projectTeam.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-5 border border-slate-50 rounded-2xl bg-white hover:border-indigo-100 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100 uppercase italic">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">
                            {member.name}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <select
                          name="manager" // Ye name "newProject" ki key se match hona chahiye
                          value={newProject.manager}
                          onChange={handleInputChange}
                          className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none bg-slate-50 font-bold text-slate-700"
                        >
                          <option value="">Select Manager (Optional)</option>
                          {allUsers.map((user) => (
                            <option key={user.id} value={user.name}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeMember(member.id)}
                          className="text-slate-200 hover:text-rose-500 font-bold text-2xl"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-8 py-3.5 rounded-2xl font-black text-[10px] text-slate-400 uppercase tracking-widest hover:bg-slate-50"
                  >
                    Discard
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Archive Modal (Image 9) */}
          {activeModal === "archive" && (
            <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 text-center shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 text-3xl">
                📦
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2 tracking-tight">
                Archive Project?
              </h2>
              <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 px-4 italic">
                Archive "{selectedProject?.name}"? It will no longer appear in
                Active view but all data is preserved.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setProjects(
                      projects.map((p) =>
                        p.id === selectedProject.id
                          ? { ...p, status: "ARCHIVED" }
                          : p,
                      ),
                    );
                    setActiveModal(null);
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                >
                  Archive Project
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-4 border border-slate-100 rounded-2xl font-black text-[10px] text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- PROJECT DETAIL SIDEBAR --- */}
      {selectedProjectForSidebar && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
            onClick={() => setSelectedProjectForSidebar(null)}
          />

          {/* Sidebar Content */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {selectedProjectForSidebar.name}
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                  {selectedProjectForSidebar.code}
                </p>
              </div>
              <button
                onClick={() => setSelectedProjectForSidebar(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-900 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex px-8 gap-8 border-b border-slate-50">
              {["Overview", "Team", "Channel"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab
                      ? "text-blue-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {/* 1. OVERVIEW TAB */}
              {activeTab === "Overview" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center py-4 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-lg border border-emerald-100 uppercase tracking-tighter italic">
                      {selectedProjectForSidebar.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Manager
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {selectedProjectForSidebar.manager || "Unassigned"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Created
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {selectedProjectForSidebar.date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Members
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {selectedProjectForSidebar.members?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Channel
                    </span>
                    <span className="text-sm font-bold text-indigo-600 italic">
                      #{" "}
                      {selectedProjectForSidebar.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}
                    </span>
                  </div>

                  <div className="flex gap-3 pt-10">
                    <button
                      onClick={() => {
                        setActiveModal("team");
                        setSelectedProjectId(selectedProjectForSidebar.id);
                      }}
                      className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                    >
                      Manage Team
                    </button>
                    <button className="flex-1 border border-slate-100 py-4 rounded-2xl font-black text-[10px] text-indigo-600 uppercase tracking-widest hover:bg-slate-50 transition-all">
                      Open Channel
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal("archive");
                        setSelectedProject(selectedProjectForSidebar);
                      }}
                      className="flex-1 border border-slate-100 py-4 rounded-2xl font-black text-[10px] text-slate-400 uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              )}

              {/* 2. TEAM TAB */}
              {activeTab === "Team" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {selectedProjectForSidebar.members?.length} Members
                    </span>
                    <button
                      onClick={() => {
                        setActiveModal("team");
                        setSelectedProjectId(selectedProjectForSidebar.id);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700"
                    >
                      + Add Member
                    </button>
                  </div>
                  {selectedProjectForSidebar.members.map((memberId) => {
                    const user = allUsers.find((u) => u.id === memberId);
                    return (
                      <div
                        key={memberId}
                        className="flex items-center gap-4 p-4 border border-slate-50 rounded-2xl bg-white hover:border-indigo-100 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[10px] border border-indigo-100 uppercase italic">
                          {user?.avatar || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">
                            {user?.name}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                            Developer
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. CHANNEL TAB */}
              {activeTab === "Channel" && (
                <div className="h-full flex flex-col items-center justify-start pt-10">
                  <div className="w-full p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 mb-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm italic">
                      💬
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 italic italic tracking-tighter">
                        #{" "}
                        {selectedProjectForSidebar.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        1 message . {selectedProjectForSidebar.members?.length}{" "}
                        members
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-4 border border-indigo-200 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all italic italic">
                    Open Full Channel →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectsView;
