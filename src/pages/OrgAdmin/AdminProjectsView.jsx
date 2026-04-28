import { useState, useEffect, useMemo } from "react";
import ProjectSidebar from "./ProjectSidebar";
import CreateProjectModal from "./CreateProjectModal";
import TeamManagementModal from "./TeamManagementModal";
import ArchiveProjectModal from "./ArchiveProjectModal";
import API from "../../api/axios";
import toast from "react-hot-toast";
import ActiveProjectModal from "./ActiveProjectModal copy";
import { triggerToast } from "../../utils/toastHelper";

const AdminProjectsView = () => {
  // --- Data States ---
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    noManager: 0,
    archived: 0,
  });

  // --- UI States ---
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedProjectForSidebar, setSelectedProjectForSidebar] =
    useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [projectTeam, setProjectTeam] = useState([]);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
    managerId: "",
  });

  // --- 1. Fetch Projects & Users (Parallel) ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, userRes] = await Promise.all([
        API.get("/projects/get"),
        API.get("/users/proj"),
      ]);

      console.log(projectRes, userRes);

      if (projectRes.data.success) {
        setProjects(projectRes.data.projects);
        setStats(projectRes.data.stats); // Backend se aane wale stats
      }

      console.log("Stats:", stats);

      if (userRes.data.success) {
        setAllUsers(userRes.data.users);
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projects && projects.length > 0) {
      const noManagerCount = projects.filter(
        (project) =>
          !project.members?.some(
            (m) => m.ProjectMember?.project_role === "Manager",
          ),
      ).length;

      setStats((prev) => ({
        ...prev,
        noManager: noManagerCount,
      }));
    }
  }, [projects]);

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. Create Project Logic ---
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProject.name,
        description: newProject.description,
        status: newProject.status,
        manager_id: newProject.managerId || 1,
      };

      const res = await API.post("/projects/create", payload);

      if (res.data.success) {
        await fetchData(); // Refresh list
        setSelectedProjectId(res.data.data.id);
        setNewProject({
          name: "",
          description: "",
          status: "ACTIVE",
          managerId: "",
        });
        setActiveModal("team"); // Team modal par move karein
      }
    } catch (err) {
      triggerToast("Error creating project: " + err.response?.data?.message,"error");
    }
  };

  const handleSaveChanges = async () => {
    console.log("Check role in team:", projectTeam);
    try {
      // selectedProject wo hai jis par click kar ke modal khula tha
      const projectId = selectedProject.id;

      console.log("Selected Project:", projectId);

      const res = await API.post(`/projects/${projectId}/team`, {
        members: projectTeam.map((m) => ({
          id: m.id,
          role: m.role,
        })), // projectTeam mein {id, full_name, role} objects hain
      });

      if (res.data.success) {
        triggerToast("Team saved successfully!",'success')
        setActiveModal(null);
        fetchData(); // Table refresh karein taake members count update ho jaye
      }
    } catch (err) {
      console.error("Error saving team:", err);
      triggerToast("Failed to save team changes.",'error')
    }
  };

  // --- 4. Archive Project ---
  const handleArchiveProject = async (projectId) => {
    try {
      await API.patch(`/projects/${projectId}/archive`);
      await fetchData();
      setActiveModal(null);
    } catch (err) {
      console.error("Archive error:", err);
    }
  };

  console.log("All Users Are Here:", allUsers);

  // --- Helpers for Display ---
  const currentProject = projects.find((p) => p.id === selectedProjectId);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // 1. Search Logic (Name ya Project Code)
      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.project_code &&
          p.project_code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Status normalization (Backend se hamesha "ACTIVE" ya "ARCHIVED" aata hai)
      const status = p.status?.toUpperCase();

      if (activeFilter === "Active") {
        return matchesSearch && status === "ACTIVE";
      }
      if (activeFilter === "Archived") {
        return matchesSearch && status === "ARCHIVED";
      }
      if (activeFilter === "No Manager") {
        // Check karein manager object empty hai ya manager_id null hai
        return matchesSearch && !p.manager && !p.manager_id;
      }

      return matchesSearch;
    });
  }, [searchQuery, activeFilter, projects]);

  // --- Team Management State ---
  const [memberSearch, setMemberSearch] = useState("");

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

  const handleAddMember = () => {
    // 1. Basic Validation
    if (!selectedUserId) {
      triggerToast("Please select a user first","error");
      return;
    }

    const userId = parseInt(selectedUserId);

    // 2. Check karein ke member pehle se list (projectTeam) mein hai ya nahi
    const isAlreadyAdded = projectTeam.find((m) => m.id === userId);
    if (isAlreadyAdded) {
      triggerToast("This member is already added to the team.","error");
      setSelectedUserId(""); // Dropdown reset karein
      return;
    }

    // 3. allUsers mein se wo user object dhoondein
    const user = allUsers.find((u) => u.id === userId);

    if (user) {
      // 4. Naya member object banayein (backend keys ke mutabiq)
      const newMember = {
        id: user.id,
        full_name: user.full_name, // 'name' ki bajaye 'full_name' use karein
        email: user.email,
        role: "Member", // Default role
      };

      // 5. Sirf modal ki local state update karein
      setProjectTeam((prev) => [...prev, newMember]);

      // 6. Dropdown reset karein
      setSelectedUserId("");
    } else {
      console.error("User not found in allUsers list");
    }
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
          return m.id === memberId
            ? { ...m, role: "Manager" }
            : { ...m, role: "Member" };
        } else {
          return m.id === memberId ? { ...m, role: "Member" } : m;
        }
      }),
    );
  };

  useEffect(() => {
    if (activeModal === "team" && selectedProjectId) {
      const currentProj = projects?.find((p) => p.id === selectedProjectId);
      if (currentProj) {
        const initialTeam = currentProj.members.map((id) => {
          const user = allUsers?.find((u) => u.id === id);
          return {
            ...user,
            role:
              user?.full_name === currentProj?.manager ? "Manager" : "Member",
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
          {["All Projects", "Active", "Archived"].map((tab) => (
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
              <tr key={project?.id} className="hover:bg-slate-50/30 group">
                {/* 1. Project Name & Code */}
                <td
                  onClick={() => {
                    setSelectedProjectForSidebar(project);
                    setActiveTab("Overview");
                  }}
                  className="px-8 py-6 hover:cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 italic">
                      {project?.name
                        ? project.name.charAt(0).toUpperCase()
                        : "P"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {project?.name || "Untitled Project"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {project?.project_code || project?.code || "N/A"}
                        </span>
                        <span className="text-[9px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-bold">
                          #
                          {project?.name?.toLowerCase().replace(/\s+/g, "-") ||
                            "proj"}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Status */}
                <td className="px-8 py-6 text-center">
                  <span
                    className={`text-[9px] font-black px-3 py-1 rounded-full border ${
                      project.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : project.status === "ARCHIVED"
                          ? "bg-rose-50 text-rose-600 border-rose-100"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {project.status || "UNKNOWN"}
                  </span>
                </td>

                <td className="px-8 py-6">
                  {(() => {
                    const manager = project.members?.find(
                      (m) => m.ProjectMember?.project_role === "Manager",
                    );
                    return (
                      <div>
                        {manager ? (
                          <div
                            key={manager.id}
                            className="flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-indigo-100 rounded-full border border-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-600 italic">
                              {manager.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-700">
                              {manager.full_name}
                              <p className="text-[10px] font-medium">
                                {manager.email}
                              </p>
                            </span>
                          </div>
                        ) : (
                          <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1.5 rounded-lg border border-amber-200 uppercase tracking-tighter italic">
                            No Manager
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </td>

                {/* 4. Members */}
                <td className="px-8 py-6 text-center">
                  {/* Render only if members exist */}
                  {project.members && project.members.length > 0 ? (
                    renderAvatarGroup(project.members.map((m) => m.id || m))
                  ) : (
                    <span className="text-[10px] text-slate-300 font-bold italic">
                      No Team
                    </span>
                  )}
                </td>

                {/* 5. Date */}
                <td className="px-8 py-6 text-sm font-bold text-slate-500">
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
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
                    <div className="absolute right-12 top-1 bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-50 w-44 text-left">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          const initialTeam = project.members.map((member) => ({
                            ...member,
                            role: member.ProjectMember?.project_role,
                          }));

                          setProjectTeam(initialTeam);
                          setActiveModal("team");
                          setOpenDropdownId(null);
                        }}
                        className="w-full px-4 py-2 text-[11px] font-black text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        Manage Team
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setActiveModal("active");
                          setOpenDropdownId(null);
                        }}
                        className="w-full px-4 py-2 text-[11px] font-black text-slate-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        Active Project
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setActiveModal("archive");
                          setOpenDropdownId(null);
                        }}
                        className="w-full px-4 py-2 text-[11px] font-black text-rose-500 hover:bg-rose-50 flex items-center gap-2"
                      >
                        Archive Project
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

          {/* Archive Modal Call */}
          {activeModal === "archive" && (
            <ArchiveProjectModal
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              selectedProject={selectedProject}
              fetchData={fetchData} // Ye function API se projects dobara load karega
              setSelectedProjectForSidebar={setSelectedProjectForSidebar}
            />
          )}

          {activeModal === "active" && (
            <ActiveProjectModal
              activeModal={activeModal}
              setActiveModal={setActiveModal}
              selectedProject={selectedProject}
              fetchData={fetchData} // Ye function API se projects dobara load karega
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
