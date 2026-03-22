import React from "react";
import { useNavigate } from "react-router"; // Navigation ke liye
import { } from "lucide-react"; // Icons ke liye

export default function WorkspaceSelection() {
    const navigate = useNavigate();

    function joinWorkspaceHandler() {
        navigate("/join-workspace");
    }

    function createWorkspaceHandler() {
        navigate("/workspace-setup");
    }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      
      {/* 1. Stepper / Progress Bar */}
      <div className="flex items-center w-full max-w-md mb-12">
        <div className="flex items-center w-full">
          <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
          <div className="flex-auto border-t-2 border-indigo-600"></div>
        </div>
        <div className="flex items-center w-full">
          <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
          <div className="flex-auto border-t-2 border-indigo-600"></div>
        </div>
        <div className="w-8 h-8 shrink-0 bg-indigo-600 border-2 border-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
      </div>

      {/* 2. Header Text */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">How would you like to start?</h1>
        <p className="text-gray-500">Choose an option to begin setting up your collaboration environment</p>
      </div>

      {/* 3. Cards Container */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        
        {/* Create Workspace Card */}
        <div onClick={createWorkspaceHandler} className="flex-1 border-2 border-gray-100 rounded-3xl p-8 flex flex-col items-center text-center hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer group">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
             <span className="text-2xl">🏗️</span> {/* Aap yahan icon ya image use kar sakte hain */}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Create a workspace</h3>
          <p className="text-gray-400 leading-relaxed">
            Set up a new dedicated space for your team or organisation from scratch.
          </p>
        </div>

        {/* Join Workspace Card */}
        <div onClick={joinWorkspaceHandler} className="flex-1 border-2 border-gray-100 rounded-3xl p-8 flex flex-col items-center text-center hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer group">
          <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6">
             <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Join an existing workspace</h3>
          <p className="text-gray-400 leading-relaxed">
            Connect with your team by entering a workspace invite code or selecting from available workspaces.
          </p>
        </div>

      </div>
    </div>
  );
};