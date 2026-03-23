import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Layout,
  Video,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Activity
} from "lucide-react";

// Modern Status Badge with Dot Indicator
const StatusBadge = ({ text, type = "default" }) => {
  const styles = {
    "In-progress": "bg-blue-50 text-blue-700 border-blue-100",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-100",
    HIGH: "bg-rose-50 text-rose-700 border-rose-100",
    Success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  
  const dots = {
    "In-progress": "bg-blue-400",
    "In Progress": "bg-amber-400",
    HIGH: "bg-rose-500",
    Success: "bg-emerald-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${styles[text] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[text] || "bg-gray-400"}`}></span>
      {text}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-12 bg-[#f1f3f67c] min-h-screen font-sans text-slate-900 selection:bg-blue-100">
      {/* --- TOP BAR / HEADER --- */}
      <header className="mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
         
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Welcome, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Yasir Saleem</span>
          </h1>
          <p className="text-slate-500 font-medium">You have <span className="text-slate-900 font-bold underline decoration-rose-400">2 critical alerts</span> requiring immediate action.</p>
        </div>

        <div className="flex gap-4">
          {/* <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="relative">
              <MessageSquare size={22} className="text-slate-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></span>
            </div>
          </div> */}
          {/* <button className="h-14 px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-slate-200">
            Create Project +
          </button> */}
        </div>
      </header>

      <div className="mx-auto grid grid-cols-12 gap-8">
        
        {/* --- LEFT: MAIN FEED --- */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* 1. Tasks Card */}
          <section className="bg-white rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 group">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <ClipboardList className="text-blue-600" size={28} /> Today's Focus
                </h2>
                <p className="text-slate-400 text-sm mt-1 font-medium">Prioritized tasks for your current session</p>
              </div>
              <button
                onClick={() => navigate("/board")}
                className="group/btn flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
              >
                Board View <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-lg bg-[#fcfcfc] border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group/item">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-300 group-hover/item:text-blue-500 group-hover/item:border-blue-200 transition-all">
                      0{i}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover/item:text-blue-600 transition-colors">Fix Authentication bug</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <StatusBadge text="In-progress" />
                        <StatusBadge text="HIGH" />
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <Clock size={14} /> <span className="text-slate-500 uppercase">5:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/board`)} className="p-3 rounded-full hover:bg-blue-50 text-slate-300 hover:text-blue-600 transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Critical Alerts Card */}
          <section className="bg-[#FFF5F5] rounded-lg p-8 border border-rose-100 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             
             <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-200">
                      <AlertTriangle className="text-white" size={24} />
                   </div>
                   <h2 className="text-2xl font-black text-rose-950 tracking-tight">System Alerts</h2>
                </div>
                <button onClick={() => navigate("/issues")} className="text-xs font-black text-rose-600 hover:underline tracking-widest uppercase">Emergency Log</button>
             </div>

             <div className="grid md:grid-cols-2 gap-4 relative z-10">
                {["Database connection timeout", "Payment gateway failing"].map((alert, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-md border border-rose-200 p-6 rounded-lg hover:shadow-lg transition-all group/alert">
                    <p className="font-black text-slate-800 text-base leading-tight mb-4 group-hover/alert:text-rose-600 transition-colors">{alert}</p>
                    <div className="flex items-center justify-between">
                       <StatusBadge text="HIGH" />
                       <button onClick={() => navigate("/issues")} className="p-2 text-rose-400 hover:text-rose-600 transition-colors">
                          <ExternalLink size={18} />
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* --- RIGHT: SIDEBAR --- */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* 3. Projects Card */}
          <section className="bg-slate-900 rounded-lg p-8 text-white shadow-2xl shadow-slate-300 relative overflow-hidden">
             {/* Decorative Gradient Overlay */}
             <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>

             <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-xl font-black tracking-tight">Active Projects</h2>
                <button onClick={() => navigate("/my-projects")} className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase">Browse</button>
             </div>

             <div className="space-y-8 relative z-10">
                {[1, 2].map(p => (
                  <div key={p} className="space-y-4">
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">0{p} — Enterprise</p>
                        <h3 className="text-lg font-bold">E-Commerce Platform</h3>
                     </div>
                     <div className="flex justify-between items-end">
                        <div className="space-y-1">
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Current Sprint</p>
                           <p className="text-sm font-medium text-blue-400">Sprint 12: API Dev</p>
                        </div>
                        <div className="text-right">
                           <span className="text-2xl font-black italic">68%</span>
                        </div>
                     </div>
                     <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{width: '68%'}}></div>
                     </div>
                     {p === 1 && <div className="h-px bg-slate-800 w-full"></div>}
                  </div>
                ))}
             </div>
          </section>

          {/* 4. Infrastructure/Deployments */}
          <section className="bg-white rounded-lg p-8 border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-slate-100 rounded-xl"><Layout size={20} className="text-slate-600" /></div>
                <h2 className="font-black text-slate-800">Deployments</h2>
             </div>
             <div className="space-y-3">
                {["Production", "Staging", "Dev"].map((env) => (
                  <div key={env} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${env === 'Staging' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                        <span className="text-sm font-bold text-slate-700">{env}</span>
                     </div>
                     <StatusBadge text={env === "Staging" ? "In Progress" : "Success"} />
                  </div>
                ))}
             </div>
          </section>

          {/* 5. Next Session / Meeting */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-8 text-white shadow-xl shadow-blue-200">
             <div className="flex items-center gap-3 mb-6">
                <Video size={24} className="text-blue-200" />
                <h2 className="font-black">Up Next</h2>
             </div>
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-1">Sprint Planning</h3>
                <div className="flex items-center gap-2 text-blue-100 text-xs font-medium mb-6">
                   <Clock size={14} /> 11:00 AM — 60 MIN
                </div>
                <button className="w-full bg-white text-blue-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                   Join Call <ExternalLink size={14} />
                </button>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;