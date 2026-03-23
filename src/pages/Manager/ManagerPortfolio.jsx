import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Activity, AlertCircle, CheckCircle2, LayoutGrid, ListFilter, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

const ManagerPortfolio = () => {
  const navigate = useNavigate();

  // 1. DYNAMIC DATA STATE
  const [projects] = useState([
    { 
      id: 'e-comm',
      name: "E-Commerce Platform", 
      status: "Critical", 
      progress: 68, 
      color: "bg-red-500",
      tasks: "20/30",
      health: "Critical",
      redCards: "02",
      lastDeploy: "Failed",
      sprintDate: "Jan 23, 2026 - Feb 12, 2026",
      todo: 12,
      inprogress: 3,
      blocked: 4,
      done: 5
    },
    { 
      id: 'crm',
      name: "CRM Revamp", 
      status: "Healthy", 
      progress: 45, 
      color: "bg-blue-600",
      tasks: "10/30",
      health: "Healthy",
      redCards: "00",
      lastDeploy: "Success",
      sprintDate: "Feb 01, 2026 - Feb 28, 2026",
      todo: 5,
      inprogress: 5,
      blocked: 0,
      done: 10
    },
    { 
      id: 'mba',
      name: "Mobile App", 
      status: "Healthy", 
      progress: 85, 
      color: "bg-emerald-500",
      tasks: "15/30",
      health: "Healthy",
      redCards: "01",
      lastDeploy: "Success",
      sprintDate: "Feb 01, 2026 - Feb 28, 2026",
      todo: 2,
      inprogress: 4,
      blocked: 2,
      done: 18
    }
  ]);

  // 2. DYNAMIC STATS CALCULATION
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const criticalOnes = projects.filter(p => p.status === 'Critical').length;
    const totalRedCards = projects.reduce((acc, p) => acc + parseInt(p.redCards), 0);
    const healthyOnes = projects.filter(p => p.status === 'Healthy').length;

    return [
      { label: "Projects", val: totalProjects, sub: "Active", icon: <LayoutGrid size={12}/> },
      { label: "Issues", val: criticalOnes, sub: "Critical", color: "text-red-500", icon: <AlertCircle size={12}/> },
      { label: "Red Cards", val: totalRedCards, sub: "Global", icon: <Activity size={12}/> },
      { label: "Healthy", val: healthyOnes, sub: "On Track", color: "text-emerald-600", icon: <CheckCircle2 size={12}/> },
    ];
  }, [projects]);

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans selection:bg-blue-100">
      
      {/* Header - More Sophisticated */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Portfolio <span className="text-slate-400 font-bold">Overview</span>
          </h1>
          {/* <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Real-time status of all active tracks</p> */}
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[11px] font-black text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
               <ListFilter size={14}/> FILTER <ChevronDown size={12}/>
            </button>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[11px] font-black shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">
               THIS SPRINT <ChevronDown size={12}/>
            </button>
        </div>
      </div>

      {/* Stats - Modern Glassmorphism feel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{s.label}</p>
               <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => (
          <div key={p.id} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-md hover:-translate-y transition-all duration-300 relative overflow-hidden group">
             
             {/* Decorative Background Glow */}
             <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.03] blur-3xl ${p.color}`}></div>

             {/* Card Top */}
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-[15px] font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                   <div className="flex items-center gap-2">
                      <Clock size={10} className="text-slate-300"/>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Last update: 2h ago</p>
                   </div>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border ${
                  p.status === 'Critical' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                }`}>
                  ● {p.status}
                </span>
             </div>

             {/* Progress Bar - Thicker & Modern */}
             <div className="mb-6">
                <div className="flex justify-between text-[11px] font-black mb-2">
                   <span className="text-slate-400 uppercase tracking-widest">Sprint Progress</span>
                   <span className="text-slate-900">{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-[1px]">
                   <div className={`${p.color} h-full rounded-full transition-all duration-1000 ease-out shadow-sm shadow-blue-200`} style={{ width: `${p.progress}%` }}></div>
                </div>
             </div>

             {/* Metric Badges - Styled */}
             <div className="grid grid-cols-3 gap-3 mb-6">
                <Badge label="Health" val={p.health} color={p.health === 'Critical' ? 'text-red-500' : 'text-emerald-500'} />
                <Badge label="Red Cards" val={p.redCards} color={p.redCards !== '00' ? 'text-red-500' : 'text-slate-400'} />
                <Badge label="Deploy" val={p.lastDeploy} color={p.lastDeploy === 'Failed' ? 'text-red-500' : 'text-blue-500'} />
             </div>

             {/* Small Stats Row */}
             <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                <div className="flex gap-4">
                    <MiniStat label="To Do" val={p.todo} color="text-slate-400" />
                    <MiniStat label="Done" val={p.done} color="text-emerald-500" />
                </div>
                <button 
                  onClick={() => navigate(`/manager/details`, { state: { project: p } })}
                  className="bg-slate-50 text-[10px] font-black text-slate-600 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 group/btn"
                >
                    DETAILS 
                    <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform"/>
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS (Clean UI) ---

const Badge = ({ label, val, color }) => (
  <div className="bg-slate-50/70 rounded-xl py-3 px-2 border border-slate-100 text-center transition-all hover:bg-white hover:border-blue-100">
    <p className="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">{label}</p>
    <p className={`text-[10px] font-black ${color}`}>{val}</p>
  </div>
);

const MiniStat = ({ label, val, color }) => (
  <div className="flex flex-col">
    <span className={`text-sm font-black leading-none ${color || 'text-slate-800'}`}>{val}</span>
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">{label}</span>
  </div>
);

export default ManagerPortfolio;