import React, { useState } from "react";
import { Link2, Search, Key, ArrowLeft, ArrowRight, CheckCircle2, Timer, Check } from "lucide-react";
import { useNavigate } from "react-router";
import RequestSuccessful from "./RequestSuccessful";

export default function JoinWorkspaceFlow() {// selection, join-form, request-sent
  const [tab, setTab] = useState("invite"); // invite, browse
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const navigate = useNavigate(); // Hook initialize karein

  const workspaces = [
    { id: 1, name: "Acme Corporation", members: 24, type: "Pro", color: "bg-red-500", letter: "A" },
    { id: 2, name: "TechVentures Ltd", members: 8, type: "Starter", color: "bg-yellow-500", letter: "T" },
    { id: 3, name: "StartupHub", members: 15, type: "Pro", color: "bg-green-500", letter: "S" },
    { id: 4, name: "Design Studio X", members: 6, type: "Starter", color: "bg-cyan-500", letter: "D" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="bg-white rounded-md shadow-xl w-full max-w-[480px] p-8 border border-gray-100 min-h-[550px] flex flex-col justify-between">
        
      
        {/* --- SCREEN 2: JOIN FORM (INVITE & BROWSE TABS) --- */}
      
          <div className="animate-in slide-in-from-right duration-300 h-full flex flex-col">
            <div className="flex flex-col items-center text-center">
              <Link2 size={48} className="text-blue-400 mb-6 rotate-45" />
              <h2 className="text-2xl font-bold">Join a Workspace</h2>
              <p className="text-gray-400 text-sm mt-1">Use an invite code or browse available workspaces</p>

              {/* TABS */}
              <div className="flex bg-gray-100 p-1 rounded-md w-full mt-8 mb-8">
                <button 
                  onClick={() => setTab("invite")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all ${tab === "invite" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400"}`}
                >
                  🔑 Invite Code
                </button>
                <button 
                  onClick={() => setTab("browse")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all ${tab === "browse" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400"}`}
                >
                  🔍 Browse Workspaces
                </button>
              </div>

              {/* TAB CONTENT: INVITE CODE */}
              {tab === "invite" ? (
                <div className="w-full text-left space-y-4">
                  <label className="font-bold text-gray-700 text-sm">Invite Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ACME-X7K2" 
                    className="w-full border border-gray-200 rounded-md p-4 text-center text-lg font-mono uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 text-center">Ask your workspace admin for the invite code</p>
                </div>
              ) : (
                /* TAB CONTENT: BROWSE WORKSPACES */
                <div className="w-full space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {workspaces.map((ws) => (
                    <div 
                      key={ws.id}
                      onClick={() => setSelectedWorkspace(ws)}
                      className={`flex items-center gap-4 p-4 border-2 rounded-md cursor-pointer transition-all ${selectedWorkspace?.id === ws.id ? "border-indigo-400 bg-indigo-50/30" : "border-gray-50 hover:border-gray-200"}`}
                    >
                      <div className={`${ws.color} w-10 h-10 rounded-md flex items-center justify-center text-white font-bold`}>{ws.letter}</div>
                      <div className="flex-1 text-left">
                        <h4 className="font-bold text-sm">{ws.name}</h4>
                        <p className="text-xs text-gray-400">{ws.members} members · {ws.type}</p>
                      </div>
                      {selectedWorkspace?.id === ws.id && <Check size={18} className="text-indigo-600" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-10">
              <button onClick={() => navigate(-1)} className="flex-1 py-3.5 border border-gray-100 rounded-md text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                <ArrowLeft size={18} /> Back
              </button>
              <button 
                onClick={() => navigate('/request-successful')}
                className="flex-[2] py-3.5 bg-blue-600 text-white rounded-md font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Send Join Request <ArrowRight size={18} />
              </button>
            </div>
          </div>

      </div>
    </div>
  );
}