import { useState, useEffect, useMemo } from "react";
import ProjectSidebar from "./ProjectSidebar";
import CreateProjectModal from "./CreateProjectModal";
import TeamManagementModal from "./TeamManagementModal";
import ArchiveProjectModal from "./ArchiveProjectModal";

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

  const currentProject = projects.find(
    (p) => p.id === selectedProjectForSidebar?.id,
  );
  const [selectedUserId, setSelectedUserId] = useState("");

  // --- Team Management State ---
  const [memberSearch, setMemberSearch] = useState("");
  const [projectTeam, setProjectTeam] = useState([]);

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

  const handleRoleChange = (memberId, newRole) => {
    setProjectTeam((prev) =>
      prev.map((m) => {
        if (newRole === "Manager") {
          // Agar naya role Manager hai, toh baaqi sab ko Member kar do
          return m.id === memberId
            ? { ...m, role: "Manager" }
            : { ...m, role: "Member" };
        } else {
          // Agar normal Member select kiya hai toh sirf ussi ko update karo
          return m.id === memberId ? { ...m, role: "Member" } : m;
        }
      }),
    );
  };

  const handleSaveChanges = () => {
    // 1. Team list mein se Manager ka naam dhoondein
    const managerObj = projectTeam.find((m) => m.role === "Manager");

    setProjects((prevProjects) =>
      prevProjects.map((proj) => {
        if (proj.id === selectedProjectId) {
          return {
            ...proj,
            manager: managerObj ? managerObj.name : null, // Table mein naam update hoga
            members: projectTeam.map((m) => m.id), // Members ki IDs list update hogi
          };
        }
        return proj;
      }),
    );

    // 2. Modal aur Dropdown close karein
    setActiveModal(null);
    setOpenDropdownId(null);
  };

  useEffect(() => {
    if (activeModal === "team" && selectedProjectId) {
      const currentProj = projects.find((p) => p.id === selectedProjectId);
      if (currentProj) {
        const initialTeam = currentProj.members.map((id) => {
          const user = allUsers.find((u) => u.id === id);
          return {
            ...user,
            role: user.name === currentProj.manager ? "Manager" : "Member",
          };
        });
        setProjectTeam(initialTeam);
      }
    }
  }, [activeModal, selectedProjectId]);

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
              <tr className="hover:bg-slate-50/30 group">
                <td
                  onClick={() => {
                    setSelectedProjectForSidebar(project);
                    setActiveTab("Overview");
                  }}
                  key={project.id}
                  className="px-8 py-6 hover:cursor-pointer"
                >
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
                        {project.manager
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {project.manager}
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
                          setOpenDropdownId(null); // Ye line add karein
                        }}
                        className="..."
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
            <CreateProjectModal
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              newProject={newProject}
              handleInputChange={handleInputChange}
              handleCreateSubmit={handleCreateSubmit}
              allUsers={allUsers}
            />
          )}

          {/* --- TEAM MODAL (IMAGE 8 LOGIC) --- */}
          {activeModal === "team" && (
            <TeamManagementModal
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              selectedProject={currentProject} // find kiya hua project
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              allUsers={allUsers}
              projectTeam={projectTeam}
              handleAddMember={handleAddMember}
              handleRoleChange={handleRoleChange}
              removeMember={removeMember}
              handleSaveChanges={handleSaveChanges}
            />
          )}

          {/* 3. Archive Modal (Image 9) */}
          {activeModal === "archive" && (
            <ArchiveProjectModal
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              selectedProject={selectedProject}
              projects={projects}
              setProjects={setProjects}
              setSelectedProjectForSidebar={setSelectedProjectForSidebar}
            />
          )}
        </div>
      )}

      {/* --- PROJECT DETAIL SIDEBAR --- */}
      {activeModal !== "archive" &&
        activeModal !== "team" &&
        selectedProjectForSidebar && (
          <ProjectSidebar
            selectedProjectForSidebar={selectedProjectForSidebar}
            setSelectedProjectForSidebar={setSelectedProjectForSidebar}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            allUsers={allUsers}
            setActiveModal={setActiveModal}
            setSelectedProjectId={setSelectedProjectId}
            setSelectedProject={setSelectedProject}
            projects={projects} // Ye zaroori hai sync ke liye
          />
        )}
    </div>
  );
};

export default AdminProjectsView;
