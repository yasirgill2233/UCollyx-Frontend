import React from 'react';

const ProjectSidebar = ({ 
  selectedProjectForSidebar, 
  setSelectedProjectForSidebar, 
  activeTab, 
  setActiveTab, 
  allUsers, 
  setActiveModal, 
  setSelectedProjectId, 
  setSelectedProject,
  projects 
}) => {
  
  const currentProject = projects.find(p => p.id === selectedProjectForSidebar?.id);

  if (!selectedProjectForSidebar || !currentProject) return null;

  const channelName = `# ${currentProject.name?.toLowerCase().replace(/\s+/g, "-") || "project"}`;

  console.log("sdfsdfsdfd",selectedProjectForSidebar)

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
        onClick={() => setSelectedProjectForSidebar(null)}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="p-8 border-b border-slate-50 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {currentProject.name}
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">
              {currentProject.project_code || currentProject.code}
            </p>
          </div>
          <button
            onClick={() => setSelectedProjectForSidebar(null)}
            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-900 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex px-8 gap-8 border-b border-slate-50">
          {["Overview", "Team", "Channel"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "Overview" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-tighter italic ${
                  currentProject.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                }`}>
                  {currentProject.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manager</span>
                <span className="text-sm font-bold text-slate-800">
                  {currentProject.manager?.full_name || "Unassigned"}
                </span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Created On</span>
                <span className="text-sm font-bold text-slate-800">
                  {new Date(currentProject.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Size</span>
                <span className="text-sm font-bold text-slate-800">{currentProject.members?.length || 0} Members</span>
              </div>

              <div className="flex gap-3 pt-10">
                <button
                  onClick={() => {
                    setSelectedProject(currentProject);
                    setActiveModal("team");
                  }}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                >
                  Manage Team
                </button>
                <button
                  onClick={() => {
                    setSelectedProject(currentProject);
                    setActiveModal("archive");
                  }}
                  className="flex-1 border border-slate-100 py-4 rounded-2xl font-black text-[10px] text-slate-400 uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all"
                >
                  Archive
                </button>
              </div>
            </div>
          )}

          {activeTab === "Team" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {currentProject.members?.length || 0} Members
                </span>
                <button
                  onClick={() => {
                    setSelectedProject(currentProject);
                    setActiveModal("team");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all"
                >
                  + Edit Team
                </button>
              </div>

              <div className="space-y-3">
                {currentProject.members?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl bg-white hover:border-indigo-100 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[10px] border border-indigo-100 uppercase italic">
                        {member.full_name?.split(" ").map(n => n[0]).join("") || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{member.full_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 lowercase">{member.email}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-tighter ${
                      member.ProjectMember?.project_role === "Manager" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    }`}>
                      {member.ProjectMember?.project_role || "Member"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Channel" && (
            <div className="h-full flex flex-col items-center justify-start pt-10">
              <div className="w-full p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm italic">💬</div>
                <div>
                  <p className="text-sm font-black text-slate-800 italic tracking-tighter">{channelName}</p>
                  <p className="text-[10px] font-bold text-slate-400">
                    Active Channel . {currentProject.members?.length} members
                  </p>
                </div>
              </div>
              <button className="w-full py-4 border border-indigo-200 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all italic">
                Open Full Channel →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;