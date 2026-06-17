import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; // Ya aapka custom API handler client instance
import { 
  ChevronDown, 
  ChevronRight, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  LayoutGrid, 
  ListFilter, 
  Clock 
} from 'lucide-react';
import API from '../../../api/axios';

const ManagerPortfolio = () => {
  const navigate = useNavigate();

  // 📡 1. BACKEND DYNAMIC CORE STREAM SYNC (Using React Query)
  const { data: portfolioResponse, isLoading, error } = useQuery({
    queryKey: ['manager-portfolio-dashboard'],
    queryFn: async () => {
      // Protect routing requirements ke mutabiq headers aapka axios interceptor auto-inject karega
      const res = await API.get('/projects/manager-portfolio'); 
      return res.data;
    },
    refetchOnWindowFocus: false, // Baar-baar tab switch par un-necessary API calls block karne ke liye
  });

  // Extract raw list safely from backend structure response
  const projects = useMemo(() => portfolioResponse?.data || [], [portfolioResponse]);

  // 📊 2. METRICS ACCUMULATION ENGINE
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    
    // Critical tab banta hai jab status "Critical" ho ya kisi project me redCards > 0 hon
    const criticalOnes = projects.filter(p => p.status === 'Critical' || parseInt(p.redCards || 0) > 0).length;
    const totalRedCards = projects.reduce((acc, p) => acc + parseInt(p.redCards || 0), 0);
    const healthyOnes = totalProjects - criticalOnes;

    return [
      { label: "Projects", val: totalProjects, sub: "Active Track", icon: <LayoutGrid size={12}/> },
      { label: "Issues", val: criticalOnes, sub: "Critical Core", color: "text-red-500", icon: <AlertCircle size={12}/> },
      { label: "Red Cards", val: totalRedCards, sub: "Global Count", icon: <Activity size={12}/> },
      { label: "Healthy", val: healthyOnes >= 0 ? healthyOnes : 0, sub: "On Track", color: "text-emerald-600", icon: <CheckCircle2 size={12}/> },
    ];
  }, [projects]);

  console.log("Hello world:==========================",portfolioResponse)

  // --- LOADING STATE TRIGGER ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 animate-pulse">
          Syncing Portfolio Metrics...
        </p>
      </div>
    );
  }

  // --- ERROR HANDLING PORTAL ---
  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] text-center p-6">
  //       <div className="bg-white border border-red-100 p-8 rounded-3xl shadow-sm max-w-md">
  //         <AlertCircle className="text-red-500 mx-auto mb-4" size={32} />
  //         <h3 className="font-black text-slate-800 text-lg mb-1">Ecosystem Interrupted</h3>
  //         <p className="text-xs text-slate-400 font-medium mb-4">
  //           {error?.response?.data?.message || "Failed to establish secure gateway context."}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans selection:bg-blue-100 text-left">
      
      {/* 🚀 Top Dynamic Header Matrix */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Portfolio <span className="text-slate-400 font-bold">Overview</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-md text-[11px] font-black text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
             <ListFilter size={14}/> FILTER <ChevronDown size={12}/>
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-[11px] font-black shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">
             THIS SPRINT <ChevronDown size={12}/>
          </button>
        </div>
      </div>

      {/* 📊 Top Metrics Glassmorphism Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 p-5 rounded-md shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{s.label}</p>
               <div className="p-1.5 bg-slate-50 rounded-md group-hover:bg-indigo-50 transition-colors">
                  {s.icon}
               </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-2xl font-black ${s.color || 'text-slate-900'}`}>{s.val}</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🗂️ Dynamic Project Stream Cards Grid Layout */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => {
            // Business Rule: Agar backend query se status 'Critical' aaye ya redCards hon, to dynamic theme mapping change hogi
            const isProjectCritical = p.status === 'Critical' || parseInt(p.redCards || 0) > 0;
            const contextColorTheme = isProjectCritical ? 'bg-red-500' : 'bg-blue-600';

            // Dates conversion safely from service timestamps
            const formattedStartDate = p.start_date ? new Date(p.start_date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "TBD";
            const formattedEndDate = p.end_date ? new Date(p.end_date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "TBD";

            return (
              <div key={p.id} className="bg-white border border-slate-100 rounded-md p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                 
                 {/* Ambient Blur Dynamic Layer Background Glow */}
                 <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.03] blur-3xl ${contextColorTheme}`}></div>

                 {/* Card Header Structure */}
                 <div className="flex justify-between items-start mb-6">
                    <div className="max-w-[160px] sm:max-w-[200px]">
                       <h3 className="text-[15px] font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                         {p.name}
                       </h3>
                       <div className="flex items-center gap-2">
                          <Clock size={10} className="text-slate-300 shrink-0"/>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate">
                            {formattedStartDate} — {formattedEndDate}
                          </p>
                       </div>
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border shrink-0 ${
                      isProjectCritical ? 'bg-red-50 border-red-100 text-red-500 animate-pulse' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                    }`}>
                      ● {isProjectCritical ? "Critical" : "Healthy"}
                    </span>
                 </div>

                 {/* Progress Bar Layer */}
                 <div className="mb-6">
                    <div className="flex justify-between text-[11px] font-black mb-2">
                       <span className="text-slate-400 uppercase tracking-widest">Sprint Progress</span>
                       <span className="text-slate-900">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-[1px]">
                       <div 
                         className={`${contextColorTheme} h-full rounded-full transition-all duration-1000 ease-out`} 
                         style={{ width: `${p.progress}%` }}
                       />
                    </div>
                 </div>

                 {/* Metric Badges Segment Node Mapping */}
                 <div className="grid grid-cols-3 gap-3 mb-6">
                    <Badge label="Tasks Done" val={p.tasksCount || "0/0"} color="text-slate-700" />
                    <Badge label="Red Cards" val={p.redCards > 0 && p.redCards < 10 ? `0${p.redCards}` : p.redCards || "00"} color={parseInt(p.redCards) > 0 ? 'text-red-500 font-black' : 'text-slate-400'} />
                    <Badge label="Blocked" val={p.blockedCount || 0} color={p.blockedCount > 0 ? 'text-amber-500 font-black' : 'text-slate-400'} />
                 </div>

                 {/* Bottom Board Row Metrics Info */}
                 <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                    <div className="flex gap-4">
                        <MiniStat label="To Do" val={p.todoCount || 0} color="text-slate-400" />
                        <MiniStat label="In Progress" val={p.inprogressCount || 0} color="text-blue-500" />
                        <MiniStat label="Done" val={p.doneCount || 0} color="text-emerald-500" />
                    </div>
                    
                    {/* Navigate safely with exact ID routing payload */}
                    <button 
                      onClick={() => navigate(`/manager/details`, { state: { project: p } })}
                      className="bg-slate-50 text-[10px] font-black text-slate-600 px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 group/btn shadow-inner"
                    >
                        DETAILS 
                        <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform"/>
                    </button>
                 </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Empty State View Layer Context
        <div className="text-center py-20 bg-white border border-slate-100 rounded-md shadow-sm">
          <LayoutGrid className="text-slate-200 mx-auto mb-3" size={40} />
          <h3 className="font-black text-slate-700 text-base">No Managed Tracks Existing</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Create or initialize track workflows inside workspace grid to monitor real-time aggregates.</p>
        </div>
      )}
    </div>
  );
};

// --- SUBSIDIARY MEMBRANE PRESENTATIONAL COMPONENTS ---

const Badge = ({ label, val, color }) => (
  <div className="bg-slate-50/70 rounded-md py-3 px-2 border border-slate-100 text-center transition-all hover:bg-white hover:border-indigo-100">
    <p className="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest truncate">{label}</p>
    <p className={`text-[10px] font-black tracking-tight ${color}`}>{val}</p>
  </div>
);

const MiniStat = ({ label, val, color }) => (
  <div className="flex flex-col">
    <span className={`text-xs font-black leading-none ${color || 'text-slate-800'}`}>{val}</span>
    <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">{label}</span>
  </div>
);

export default ManagerPortfolio;