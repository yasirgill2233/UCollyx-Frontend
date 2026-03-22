import React, { useState, useMemo } from "react";
import { useLocation } from "react-router";
import { AlertCircle, Clock, ChevronDown, Search, ShieldAlert, Zap } from "lucide-react";
import AlertDetailsSidebar from "./AlertDetailsSidebar";

const RedCardsAlerts = () => {
  const location = useLocation();
  const incomingData = location.state?.bugs;
  const pageTitle = location.state?.title || "Red Cards Alerts";

  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const rawAlerts = useMemo(() => {
    return incomingData ? incomingData.map(bug => ({
      id: bug.id,
      title: bug.title,
      platform: bug.project,
      module: bug.module,
      user: bug.assigned,
      time: bug.time,
      status: bug.status,
      severity: bug.severity, // Priority Level
      steps:bug.steps,
      expected:bug.expected,
      actual:bug.actual,
      // Dynamic Styling for Status & Priority
      statusStyle: bug.status === "OPEN" ? "text-red-500 border-red-100 bg-red-50" : "text-blue-500 border-blue-100 bg-blue-50",
      priorityStyle: 
        bug.severity === "CRITICAL" ? "bg-red-600 text-white" : 
        bug.severity === "HIGH" ? "bg-orange-500 text-white" : 
        bug.severity === "MEDIUM" ? "bg-yellow-400 text-slate-900" : "bg-slate-400 text-white",
      accentColor: bug.severity === "CRITICAL" ? "border-l-red-600" : bug.severity === "HIGH" ? "border-l-orange-500" : "border-l-blue-400",
    })) : [];
  }, [incomingData]);

  const filteredAlerts = useMemo(() => {
    return rawAlerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            alert.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject = projectFilter === "All Projects" || alert.platform === projectFilter;
      return matchesSearch && matchesProject;
    });
  }, [searchTerm, projectFilter, rawAlerts]);

  return (
    <div className="flex-1 bg-[#FBFDFF] p-6 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
            {pageTitle}
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[9px] font-black">
              {filteredAlerts.length}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input 
              type="text"
              placeholder="Search by ID or Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 outline-none w-56 transition-all"
            />
          </div>

          <select 
            className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-500 outline-none cursor-pointer"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="All Projects">All Projects</option>
            <option value="E-Commerce">E-Commerce</option>
            <option value="CRM">CRM</option>
            <option value="Mobile App">Mobile App</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => setSelectedAlert(alert)}
            className={`group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm border-l-[5px] ${alert.accentColor} hover:shadow-md transition-all duration-200 cursor-pointer`}
          >
            <div className="flex items-center gap-4">
              {/* Severity Icon */}
              <div className={`p-2 rounded-lg ${alert.severity === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                {alert.severity === 'CRITICAL' ? <ShieldAlert size={20} /> : <AlertCircle size={20} />}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                   {/* PRIORITY TAG */}
                   <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${alert.priorityStyle}`}>
                    {alert.severity}
                   </span>
                   <span className="text-[10px] font-black text-slate-300">#{alert.id}</span>
                </div>
                
                <h3 className="text-[14px] font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {alert.title}
                </h3>
                
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    {alert.platform} <span className="opacity-30 mx-1">/</span> {alert.module}
                  </p>
                  <div className="flex items-center gap-3 border-l border-slate-100 pl-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-black text-slate-400 border border-slate-200">
                        {alert.user.charAt(0)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{alert.user}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock size={12} />
                      <span className="text-[9px] font-bold">{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black border tracking-tighter uppercase ${alert.statusStyle}`}>
                {alert.status}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && <EmptyState />}
      </div>

      {selectedAlert && (
        <AlertDetailsSidebar
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-slate-200 rounded-[32px]">
     <Zap size={32} className="text-slate-100 mb-4" />
     <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No active priority items found</p>
  </div>
);

export default RedCardsAlerts;