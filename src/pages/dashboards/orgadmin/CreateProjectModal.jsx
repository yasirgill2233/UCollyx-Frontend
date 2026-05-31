import React, { useState } from "react";

const CreateProjectModal = ({
  activeModal,
  setActiveModal,
  newProject,
  handleInputChange,
  handleCreateSubmit,
  allUsers,
}) => {

  const [createChannel, setCreateChannel] = useState(true);
  
  if (activeModal == "create") return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
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

        <form onSubmit={(e) => handleCreateSubmit(e, createChannel)} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Project Name
            </label>
            <input
              name="name"
              value={newProject.name}
              onChange={handleInputChange}
              placeholder="e.g. Mobile App Redesign"
              className="w-full border border-slate-200 rounded-xl p-3.5 text-sm font-bold text-slate-700 focus:border-blue-500 outline-none transition-all"
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
              className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none transition-all h-24 resize-none font-medium text-slate-600"
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

            {/* Manager Selection (Dynamic) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Assign Manager
              </label>
              <select
                name="manager_id" // Backend foreign key ke mutabiq name rakhein
                value={newProject.manager_id || ""} // ID use karein string name ki bajaye
                onChange={handleInputChange}
                className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none bg-slate-50 cursor-pointer font-bold text-slate-700"
              >
                <option value="">Select Manager...</option>
                {allUsers && allUsers.length > 0 ? (
                  allUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} {/* Yahan 'full_name' use karein */}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading users...</option>
                )}
              </select>
            </div>
          </div>

          {/* Auto-create channel Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="channel"
              checked={createChannel}
              onChange={(e) => setCreateChannel(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="channel"
              className="text-xs font-bold text-slate-500 italic cursor-pointer select-none"
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
  );
};

export default CreateProjectModal;
