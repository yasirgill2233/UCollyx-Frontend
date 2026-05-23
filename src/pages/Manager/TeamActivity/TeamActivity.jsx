import React, { useState, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TeamMemberModal from "./TeamMemberModal";
import API from "../../../api/axios";

const TeamActivity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  // 1. Fetching Data from our new MVC Backend
  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ['team-activity'],
    queryFn: async () => {
      const res = await API.get('/team/activity');
      return res.data.data;
    }
  });

  // 2. Filter & Stats Logic
  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, members]);

  const stats = useMemo(() => [
    { label: "Active", val: members.length },
    { label: "Overloaded", val: members.filter(m => m.percentage > 110).length, color: "text-red-500" },
    { label: "Balanced", val: members.filter(m => m.percentage >= 80 && m.percentage <= 110).length, color: "text-emerald-500" },
    { label: "Available", val: members.filter(m => m.percentage < 80).length, color: "text-yellow-500" },
  ], [members]);

  console.log("Hello World How are You::::::::::::::::",members)

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="bg-[#fcfcfc] min-h-screen p-8">
      {/* Header & Stats */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Team Activity</h1>
          <p className="text-xs font-bold text-slate-400">Workload & Capacity Matrix</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2 text-slate-400" size={16} />
          <input 
            className="pl-9 pr-4 py-2 border rounded-xl text-xs font-bold w-64"
            placeholder="Search member..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm">
            <p className="text-[10px] uppercase font-black text-slate-400">{s.label}</p>
            <h3 className={`text-2xl font-black ${s.color || 'text-slate-800'}`}>{s.val}</h3>
          </div>
        ))}
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black">
            <tr>
              <th className="px-6 py-4">Developer</th>
              <th className="px-6 py-4 text-center">Workload</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredMembers.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedMember(m)}>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black">
                    {m.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-black">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mb-1">
                    <div className={`${m.color} h-full`} style={{ width: `${Math.min(m.percentage, 100)}%` }} />
                  </div>
                  <span className="text-[9px] font-black">{m.percentage}%</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[9px] font-black uppercase px-2 py-1 rounded-md bg-slate-100">
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMember && (
        <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
};

export default TeamActivity