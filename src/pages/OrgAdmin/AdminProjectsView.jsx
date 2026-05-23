import { useState, useEffect, useMemo } from "react";
import ProjectSidebar from "./ProjectSidebar";
import CreateProjectModal from "./CreateProjectModal";
import TeamManagementModal from "./TeamManagementModal";
import ArchiveProjectModal from "./ArchiveProjectModal";
import API from "../../api/axios";
import toast from "react-hot-toast";
import ActiveProjectModal from "./ActiveProjectModal copy";
import { triggerToast } from "../../utils/toastHelper";
import { useProjectMutations, useProjectsData } from "../../hooks/useProjects";

const AdminProjectsView = () => {
  // --- Data States ---
  // const [projects, setProjects] = useState([]);
  // const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [stats, setStats] = useState({
  //   total: 0,
  //   active: 0,
  //   noManager: 0,
  //   archived: 0,
  // });

  // --- UI States ---
  // const [activeFilter, setActiveFilter] = useState("All Projects");
  // const [searchQuery, setSearchQuery] = useState("");
  // const [activeModal, setActiveModal] = useState(null);
  // const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedProjectForSidebar, setSelectedProjectForSidebar] =
    useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedUserId, setSelectedUserId] = useState("");
  // const [projectTeam, setProjectTeam] = useState([]);

  // const [newProject, setNewProject] = useState({
  //   name: "",
  //   description: "",
  //   status: "ACTIVE",
  //   managerId: "",
  // });

  // --- React Query Hooks ---
  const { data: serverData, isLoading } = useProjectsData();
  const {
    query,
    createMutation,
    teamMutation,
    archiveMutation,
    activeMutation,
  } = useProjectMutations();

  // --- UI States (Sirf UI ke liye) ---
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTeam, setProjectTeam] = useState([]); // Modal ke andar editing ke liye local state
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
    managerId: "",
  });
  // Agar aapne activeMutation hook mein nahi banaya, toh useProjectMutations mein add krain

  // fetchData ki jagah ab hum ye use karte hain (Manual refresh ke liye):
  const fetchData = () => query.refetch();

  // Serverside Data Extraction
  const projects = serverData?.projectsRes?.projects || [];
  const allUsers = serverData?.usersRes?.users || [];
  const baseStats = serverData?.projectsRes?.stats || {
    total: 0,
    active: 0,
    archived: 0,
  };

  // --- Computed Stats (noManager calculation frontend par krain) ---
  const stats = useMemo(() => {
    const noManagerCount = projects.filter(
      (p) =>
        !p.members?.some((m) => m.ProjectMember?.project_role === "Manager"),
    ).length;
    return { ...baseStats, noManager: noManagerCount };
  }, [projects, baseStats]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.project_code?.toLowerCase().includes(searchQuery.toLowerCase());

      const status = p.status?.toUpperCase();
      if (activeFilter === "Active")
        return matchesSearch && status === "ACTIVE";
      if (activeFilter === "Archived")
        return matchesSearch && status === "ARCHIVED";
      if (activeFilter === "No Manager") return matchesSearch && !p.manager_id;

      return matchesSearch;
    });
  }, [searchQuery, activeFilter, projects]);

  const handleCreateSubmit = (e, createChannel) => {
    e.preventDefault();
    createMutation.mutate(
      {
        ...newProject,
        manager_id: newProject.managerId || 1,
        createChannel,
      },
      {
        onSuccess: (res) => {
          setSelectedProject(res.data);
          setActiveModal("team");
          setNewProject({
            name: "",
            description: "",
            status: "ACTIVE",
            managerId: "",
          });
        },
        onError: (err) => {
          const errorMsg = err.response?.data?.errors
            ? err.response.data.errors
                .map((e) => `${e.field}: ${e.message}`)
                .join("\n")
            : err.response?.data?.message || "Creation failed";
          triggerToast(errorMsg, "error");
        },
      },
    );
  };

  useEffect(() => {
    if (activeModal === "team" && selectedProject) {
      const currentProj = projects.find((p) => p.id === selectedProject.id);
      if (currentProj) {
        const initialTeam = currentProj.members.map((id) => {
          const user = allUsers.find((u) => u.id === id);
          return {
            ...user,
            role:
              user?.full_name === currentProj.manager ? "Manager" : "Member",
          };
        });
        setProjectTeam(initialTeam);
      }
    }
  }, [activeModal, selectedProject, projects, allUsers]);

  // 1. Handle Input Change (For Create Modal)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };


//   const handleRoleChange = (memberId, newRole) => {
//   console.log("Triggered Role Change:", memberId, newRole);

//   setSelectedProject((prevProject) => {
//     if (!prevProject || !prevProject.members) return prevProject;

//     // Direct selectedProject ke members array ko map kar rahe hain
//     const updatedMembers = prevProject.members.map((m) => {
      
//       // Pivot object setup structure check taake structure undefined crash na kare
//       const currentPivot = m.ProjectMember || { project_role: "Member" };

//       if (newRole === "Manager") {
//         // Condition: Agar naya role Manager hai, toh sirf targeted member Manager banega baqi sab auto-Member
//         return m.id === memberId
//           ? { ...m, ProjectMember: { ...currentPivot, project_role: "Manager" } }
//           : { ...m, ProjectMember: { ...currentPivot, project_role: "Member" } };
//       } else {
//         // Condition: Agar kisi Manager ko switch karke Member kar rahe hain
//         return m.id === memberId
//           ? { ...m, ProjectMember: { ...currentPivot, project_role: "Member" } }
//           : m;
//       }
//     });

//     return {
//       ...prevProject,
//       members: updatedMembers
//     };
//   });
// };


// ==========================================
// 🎯 1. ADD MEMBER HANDLER (Direct State Sync)
// ==========================================
const handleAddMember = () => {
  if (!selectedUserId) return triggerToast("Select a user", "error");

  const userId = parseInt(selectedUserId);
  const currentMembers = selectedProject?.members || [];

  console.log("Adding Member Node Target:", userId, selectedProject);

  // Duplication check directly from selectedProject members array
  if (currentMembers.some((m) => m.id === userId)) {
    return triggerToast("Already added to this project team", "error");
  }

  const user = allUsers.find((u) => u.id === userId);
  
  if (user) {
    const newMemberWithPivot = {
      ...user,
      ProjectMember: {
        project_role: "Member"
      }
    };

    setSelectedProject((prevProject) => {
      if (!prevProject) return prevProject;
      return {
        ...prevProject,
        members: [...currentMembers, newMemberWithPivot]
      };
    });

    setSelectedUserId("");
    triggerToast(`${user.full_name || 'Member'} staging context bound!`, "success");
  } else {
    triggerToast("User context resource not found", "error");
  }
};


// ==========================================
// 🎚️ 2. ROLE CHANGE HANDLER (Manager Constraint Rule)
// ==========================================
const handleRoleChange = (memberId, newRole) => {
  console.log("Triggered Role Change Mapping:", memberId, newRole);

  setSelectedProject((prevProject) => {
    if (!prevProject || !prevProject.members) return prevProject;

    const updatedMembers = prevProject.members.map((m) => {
      const currentPivot = m.ProjectMember || { project_role: "Member" };

      if (newRole === "Manager") {
        // Enforce rule: Aik project ka aik hi manager ho sakta hai, baqi auto-Member switch honge
        return m.id === memberId
          ? { ...m, ProjectMember: { ...currentPivot, project_role: "Manager" } }
          : { ...m, ProjectMember: { ...currentPivot, project_role: "Member" } };
      } else {
        // Manager se normal member status change
        return m.id === memberId
          ? { ...m, ProjectMember: { ...currentPivot, project_role: "Member" } }
          : m;
      }
    });

    return {
      ...prevProject,
      members: updatedMembers
    };
  });
};


// ==========================================
// ✕ 3. REMOVE MEMBER HANDLER
// ==========================================
const removeMember = (userId) => {
  setSelectedProject((prevProject) => {
    if (!prevProject) return prevProject;
    return {
      ...prevProject,
      // Target state filtering pipeline execution
      members: prevProject.members ? prevProject.members.filter((m) => m.id !== userId) : []
    };
  });
};


// ==========================================
// 💾 4. SAVE TEAM TO DATABASE (Mutation)
// ==========================================
const handleSaveTeam = () => {
  const membersList = selectedProject?.members || [];

  // Map state formatting block to meet precise database schema endpoints
  const formattedMembers = membersList.map((m) => ({
    id: m.id,
    role: m.ProjectMember?.project_role || "Member", 
  }));

  console.log("Invoking Database Team Sync Lifecycle:", {
    projectId: selectedProject?.id,
    members: formattedMembers,
  });

  teamMutation.mutate(
    {
      projectId: selectedProject.id,
      members: formattedMembers,
    },
    {
      onSuccess: () => {
        triggerToast("Team metadata synchronized successfully!", "success");
        setActiveModal(null); // safely dismiss modal overlay view
      },
      onError: (error) => {
        console.error("Team Save Mutation Core Failure:", error);
        triggerToast(error?.response?.data?.message || "Failed to save team.", "error");
      }
    }
  );
};

  console.log("Check Active:", activeModal, selectedProject, selectedProjectId);

  console.log("All Users:==============",projectTeam)

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse text-xl">
        UCOLLYX ENGINE SYNCING...
      </div>
    );

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
          {activeModal === "create" && (
            <CreateProjectModal
              setActiveModal={setActiveModal}
              newProject={newProject}
              handleInputChange={handleInputChange}
              handleCreateSubmit={handleCreateSubmit} // Iske andar mutation logic hai
              allUsers={allUsers}
              isLoading={createMutation.isLoading} // Loading spinner dikhane ke liye add kiya
            />
          )}

          {/* TEAM MODAL */}
          {activeModal === "team" && (
            <TeamManagementModal
              setActiveModal={setActiveModal}
              selectedProject={selectedProject}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              allUsers={allUsers}
              projectTeam={projectTeam}
              handleAddMember={handleAddMember} // Defined
              handleRoleChange={handleRoleChange} // Defined
              removeMember={removeMember} // Defined
              handleSaveChanges={handleSaveTeam} // Mutation hook wala function
              isLoading={teamMutation.isLoading}
            />
          )}

          {activeModal === "archive" && (
  <ArchiveProjectModal
    setActiveModal={setActiveModal}
    selectedProject={selectedProject}
    isLoading={archiveMutation.isLoading}
    onConfirm={() => {
      archiveMutation.mutate(selectedProject.id, {
        onSuccess: () => {
          setActiveModal(null);
          setSelectedProjectForSidebar(null);
          triggerToast("Project Archived!", "success");
        }
      });
    }}
  />
)}

{/* Active Modal Call */}
{activeModal === "active" && (
  <ActiveProjectModal
    setActiveModal={setActiveModal}
    selectedProject={selectedProject}
    isLoading={activeMutation.isLoading}
    onConfirm={() => {
      activeMutation.mutate(selectedProject.id, {
        onSuccess: () => {
          setActiveModal(null);
          setSelectedProjectForSidebar(null);
          triggerToast("Project Restored!", "success");
        }
      });
    }}
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
            setSelectedProjectId={setSelectedProject.id}
            setSelectedProject={setSelectedProject}
            projects={projects} // Ye zaroori hai sync ke liye
          />
        )}
    </div>
  );
};

export default AdminProjectsView;
