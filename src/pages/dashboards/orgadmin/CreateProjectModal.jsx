// import React, { useState } from "react";

// const CreateProjectModal = ({
//   activeModal,
//   setActiveModal,
//   newProject,
//   handleInputChange,
//   handleCreateSubmit,
//   allUsers,
// }) => {

//   const [createChannel, setCreateChannel] = useState(true);
  
//   if (activeModal == "create") return null;

//   return (
//     <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
//       <div className="bg-white rounded-3xl w-full max-w-xl p-10 shadow-2xl animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-black text-slate-900 tracking-tight">
//             Create New Project
//           </h2>
//           <button
//             onClick={() => setActiveModal(null)}
//             className="text-slate-300 hover:text-slate-900 text-xl font-bold"
//           >
//             ✕
//           </button>
//         </div>

//         <form onSubmit={(e) => handleCreateSubmit(e, createChannel)} className="space-y-6">
//           {/* Project Name */}
//           <div className="space-y-2">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//               Project Name
//             </label>
//             <input
//               name="name"
//               value={newProject.name}
//               onChange={handleInputChange}
//               placeholder="e.g. Mobile App Redesign"
//               className="w-full border border-slate-200 rounded-xl p-3.5 text-sm font-bold text-slate-700 focus:border-blue-500 outline-none transition-all"
//             />
//           </div>

//           {/* Description */}
//           <div className="space-y-2">
//             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={newProject.description}
//               onChange={handleInputChange}
//               placeholder="Describe the goals of this project..."
//               className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none transition-all h-24 resize-none font-medium text-slate-600"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             {/* Status Selection */}
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                 Initial Status
//               </label>
//               <select
//                 name="status"
//                 value={newProject.status}
//                 onChange={handleInputChange}
//                 className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none bg-slate-50 cursor-pointer font-bold text-slate-700"
//               >
//                 <option value="ACTIVE">Active</option>
//                 <option value="PAUSED">Paused</option>
//                 <option value="ARCHIVED">Archived</option>
//               </select>
//             </div>

//             {/* Manager Selection (Dynamic) */}
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                 Assign Manager
//               </label>
//               <select
//                 name="manager_id" // Backend foreign key ke mutabiq name rakhein
//                 value={newProject.manager_id || ""} // ID use karein string name ki bajaye
//                 onChange={handleInputChange}
//                 className="w-full border border-slate-200 rounded-xl p-3.5 text-sm focus:border-blue-500 outline-none bg-slate-50 cursor-pointer font-bold text-slate-700"
//               >
//                 <option value="">Select Manager...</option>
//                 {allUsers && allUsers.length > 0 ? (
//                   allUsers.map((user) => (
//                     <option key={user.id} value={user.id}>
//                       {user.full_name} {/* Yahan 'full_name' use karein */}
//                     </option>
//                   ))
//                 ) : (
//                   <option disabled>Loading users...</option>
//                 )}
//               </select>
//             </div>
//           </div>

//           {/* Auto-create channel Checkbox */}
//           <div className="flex items-center gap-3 pt-2">
//             <input
//               type="checkbox"
//               id="channel"
//               checked={createChannel}
//               onChange={(e) => setCreateChannel(e.target.checked)}
//               className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//             />
//             <label
//               htmlFor="channel"
//               className="text-xs font-bold text-slate-500 italic cursor-pointer select-none"
//             >
//               Auto-create Slack/Team channel for this project
//             </label>
//           </div>

//           <div className="flex gap-4 pt-6 border-t border-slate-50">
//             <button
//               type="button"
//               onClick={() => setActiveModal(null)}
//               className="flex-1 py-4 border border-slate-100 rounded-2xl font-black text-[10px] text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
//             >
//               Create & Continue
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateProjectModal;























import React, { useState } from "react";

const CreateProjectModal = ({
  setActiveModal,
  newProject,
  handleInputChange,
  handleCreateSubmit,
  isLoading, // Added loading handling state for the action transition
}) => {
  const [createChannel, setCreateChannel] = useState(true);

  return (
    <div className="fixed inset-0 bg-slate-900/15 backdrop-blur-xs z-[2000] flex items-center justify-center p-4 animate-fade-in">
      {/* Dynamic Click-Outside Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={() => setActiveModal(null)} 
      />

      {/* --- REFACTORED GLASSMORPHIC MODAL CORE --- */}
      <div className="relative bg-white/90 backdrop-blur-2xl border border-white/80 rounded-3xl w-full max-w-lg p-6 sm:p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] scrollbar-none">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Create New Project
            </h2>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Initialize a clean workspace pipeline context asset.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={(e) => handleCreateSubmit(e, createChannel)} className="space-y-5">
          
          {/* 1. Project Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
              Project Name
            </label>
            <input
              required
              name="name"
              value={newProject.name || ""}
              onChange={handleInputChange}
              placeholder="e.g. Next-Gen Fullstack Platform"
              className="w-full bg-white/60 border border-slate-200/70 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-500/60 shadow-2xs transition-all"
            />
          </div>

          {/* 2. Project Description Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-0.5">
              Description / Scope
            </label>
            <textarea
              name="description"
              value={newProject.description || ""}
              onChange={handleInputChange}
              placeholder="Define high-level architecture goals or repository scope variables..."
              className="w-full bg-white/60 border border-slate-200/70 rounded-xl px-4 py-3 text-xs font-medium text-slate-600 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-500/60 shadow-2xs transition-all h-28 resize-none"
            />
          </div>

          {/* 3. Slack/Team Channel Connector Flag */}
          <div className="flex items-center gap-3 py-1.5 pl-0.5">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="channel"
                checked={createChannel}
                onChange={(e) => setCreateChannel(e.target.checked)}
                className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer accent-blue-600 transition-all"
              />
            </div>
            <label
              htmlFor="channel"
              className="text-[11px] font-semibold text-slate-400 cursor-pointer select-none"
            >
              Auto-create a corresponding workspace communication channel
            </label>
          </div>

          {/* Action Row Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-slate-100/60">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full sm:flex-1 py-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl text-xs font-bold transition-all active:scale-98"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <span>Create & Continue</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;