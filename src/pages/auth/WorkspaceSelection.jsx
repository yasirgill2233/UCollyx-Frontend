// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { LayoutGrid, Users, Loader2 } from "lucide-react"; // Icons add kiye
// import API from "../../api/axios";
// import { useAvailableWorkspaces } from "../../hooks/useWorkspace";

// export default function WorkspaceSelection() {

// const navigate = useNavigate();

//   // React Query Hook: useEffect aur useState ki ab zaroorat nahi
//   const { data: workspaceRes, isLoading } = useAvailableWorkspaces();
  
//   // Data extraction with optional chaining
//   const workspaces = workspaceRes?.data || [];

//   // Initial Loading Screen
//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <Loader2 className="animate-spin text-indigo-600" size={40} />
//       </div>
//     );
//   }

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
//             {/* Stepper */}
//             <div className="flex items-center w-full max-w-md mb-12">
//                 <div className="flex items-center w-full">
//                     <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
//                     <div className="flex-auto border-t-2 border-indigo-600"></div>
//                 </div>
//                 <div className="flex items-center w-full">
//                     <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
//                     <div className="flex-auto border-t-2 border-indigo-600"></div>
//                 </div>
//                 <div className="w-8 h-8 shrink-0 bg-indigo-600 border-2 border-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
//             </div>

//             <div className="text-center mb-10">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-3">How would you like to start?</h1>
//                 <p className="text-gray-500">Choose an option to begin setting up your collaboration environment</p>
//             </div>

//             {/* Cards Container */}
//             <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
                
//                 {/* Create Workspace Card */}
//                 <div onClick={() => navigate("/workspace-setup")} className="flex-1 border-2 border-gray-100 rounded-3xl p-8 flex flex-col items-center text-center hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer group bg-white">
//                     <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-100">
//                         <LayoutGrid className="text-indigo-600" size={32} />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-800 mb-4">Create a workspace</h3>
//                     <p className="text-gray-400 leading-relaxed text-sm">
//                         Set up a new dedicated space for your team or organisation from scratch.
//                     </p>
//                 </div>

//                 {/* Join/Select Workspace Card */}
//                 <div onClick={() => navigate("/join-workspace")} className="flex-1 border-2 border-gray-100 rounded-3xl p-8 flex flex-col items-center text-center hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer group bg-white">
//                     <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-100">
//                         <Users className="text-cyan-600" size={32} />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-800 mb-4">
//                         {workspaces.length > 1 ? "Select a workspace" : "Join a workspace"}
//                     </h3>
//                     <p className="text-gray-400 leading-relaxed text-sm">
//                         {workspaces.length > 1 
//                             ? `You are a member of ${workspaces.length} workspaces. Click to choose one.` 
//                             : "Connect with your team by entering a workspace invite code."}
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }























import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Users, Loader2, Sparkles, Check } from "lucide-react"; 
import { useAvailableWorkspaces } from "../../hooks/useWorkspace";

export default function WorkspaceSelection() {
  const navigate = useNavigate();

  // React Query Hook
  const { data: workspaceRes, isLoading } = useAvailableWorkspaces();
  
  // Data extraction
  const workspaces = workspaceRes?.data || [];

  // Initial Loading Screen (Matching UCollyx branding colors)
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f3f5fa]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#3b59ff]" size={44} />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f5fa] p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Brand Aura Background Overlays */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-gradient-to-tr from-[#3b59ff]/20 to-[#00f2fe]/30 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-bl from-[#9d4edd]/20 to-[#00f2fe]/20 rounded-full blur-[20px] pointer-events-none animate-pulse duration-[8s]" />
       <div className="absolute top-[-47%] right-[-20%] w-[600px] h-[600px] bg-gradient-to-bl from-[#FFB733]/20 to-[#FF7B00]/20 rounded-full blur-[50px] pointer-events-none animate-pulse duration-[8s]" />

      {/* Floating Logo Top Brand Indicator */}
      <div className="absolute top-8 left-10 flex items-center gap-2.5 z-20">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3b59ff] to-[#00f2fe] flex items-center justify-center font-black text-white shadow-[0_4px_12px_rgba(59,89,255,0.3)] text-sm">
          U
        </div>
        <span className="text-xl font-black text-[#1e2238] tracking-wider">UCollyx</span>
      </div>

      {/* Main Glassmorphic Panel Structure */}
      <div className="flex flex-col w-full max-w-[950px] bg-white/70 backdrop-blur-2xl rounded-[32px] border border-white/60 shadow-[0_20px_50px_rgba(31,38,135,0.08)] p-10 md:p-14 items-center z-10 relative">
        
        {/* Modern Stepper Layout */}
        <div className="flex items-center w-full max-w-md mb-14 px-4">
          <div className="flex items-center w-full">
            <div className="w-8 h-8 shrink-0 bg-gradient-to-tr from-[#3b59ff] to-[#00f2fe] rounded-xl flex items-center justify-center text-white text-xs shadow-md shadow-blue-100 font-bold">
              <Check size={14} strokeWidth={3} />
            </div>
            <div className="flex-auto border-t-2 border-dashed border-[#3b59ff]/40 mx-2"></div>
          </div>
          <div className="flex items-center w-full">
            <div className="w-8 h-8 shrink-0 bg-gradient-to-tr from-[#3b59ff] to-[#00f2fe] rounded-xl flex items-center justify-center text-white text-xs shadow-md shadow-blue-100 font-bold">
              <Check size={14} strokeWidth={3} />
            </div>
            <div className="flex-auto border-t-2 border-dashed border-gray-200 mx-2"></div>
          </div>
          <div className="w-8 h-8 shrink-0 bg-white border-2 border-[#3b59ff] text-[#3b59ff] rounded-xl flex items-center justify-center font-black text-xs shadow-sm">
            3
          </div>
        </div>

        {/* Header Main Texts */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1a1d2f] tracking-tight mb-3 flex items-center justify-center gap-2">
            How would you like to start? <Sparkles size={24} className="text-[#3b59ff]" />
          </h1>
          <p className="text-gray-500 text-sm font-medium">Choose an option to begin setting up your collaboration environment</p>
        </div>

        {/* Workspace Operations Action Cards Container */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
            
          {/* Card Option 1: Create Workspace */}
          <div 
            onClick={() => navigate("/workspace-setup")} 
            className="flex-1 border border-gray-200/60 rounded-[24px] p-8 flex flex-col items-center text-center transition-all duration-300 cursor-pointer bg-white/50 hover:bg-white hover:border-[#3b59ff] hover:shadow-[0_15px_35px_rgba(59,89,255,0.08)] hover:-translate-y-1 group relative overflow-hidden"
          >
            {/* Soft inner glow accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#3b59ff] to-[#00f2fe] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="w-16 h-16 bg-[#3b59ff]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#3b59ff]/10 group-hover:scale-105 transition-all duration-300 text-[#3b59ff] shadow-inner">
              <LayoutGrid size={30} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-black text-[#1a1d2f] mb-3">Create a workspace</h3>
            <p className="text-gray-500 font-medium leading-relaxed text-xs max-w-[240px]">
              Set up a new dedicated space for your team or organization from scratch.
            </p>
          </div>

          {/* Card Option 2: Join or Select Workspace */}
          <div 
            onClick={() => navigate("/join-workspace")} 
            className="flex-1 border border-gray-200/60 rounded-[24px] p-8 flex flex-col items-center text-center transition-all duration-300 cursor-pointer bg-white/50 hover:bg-white hover:border-[#9d4edd] hover:shadow-[0_15px_35px_rgba(157,78,221,0.08)] hover:-translate-y-1 group relative overflow-hidden"
          >
            {/* Soft inner glow accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9d4edd] to-[#00f2fe] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-16 h-16 bg-[#9d4edd]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#9d4edd]/10 group-hover:scale-105 transition-all duration-300 text-[#9d4edd] shadow-inner">
              <Users size={30} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-black text-[#1a1d2f] mb-3">
              {workspaces.length > 1 ? "Select a workspace" : "Join a workspace"}
            </h3>
            <p className="text-gray-500 font-medium leading-relaxed text-xs max-w-[240px]">
              {workspaces.length > 1 
                ? `You are a member of ${workspaces.length} workspaces. Click to choose one.` 
                : "Connect with your team by entering a workspace invite code."}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}