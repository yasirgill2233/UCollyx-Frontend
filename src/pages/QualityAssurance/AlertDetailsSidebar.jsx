import React, { useState } from 'react';
import { X, Clock, User, MessageSquare, List, History, ShieldAlert, AlertCircle } from 'lucide-react';

const AlertDetailsSidebar = ({ alert, onClose }) => {
  const [activeTab, setActiveTab] = useState('Details');

  console.log(alert)

  if (!alert) return null;

  // Severity based colors for the sidebar accent
  const severityColor = alert.severity === 'CRITICAL' ? 'text-red-600' : 
                       alert.severity === 'HIGH' ? 'text-orange-500' : 'text-blue-500';
  
  const severityBg = alert.severity === 'CRITICAL' ? 'bg-red-50' : 
                    alert.severity === 'HIGH' ? 'bg-orange-50' : 'bg-blue-50';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={onClose} />
      
      {/* Sidebar Panel */}
      <div className="absolute inset-y-0 right-0 w-[30%] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${alert.statusStyle}`}>
                {alert.status}
              </span>
              <span className="text-[10px] text-slate-300 font-bold italic">#{alert.id}</span>
            </div>
            <h2 className="font-black text-slate-800 text-lg leading-tight uppercase tracking-tight">
              {alert.title}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors group">
            <X className="text-slate-400 group-hover:text-slate-600" size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-slate-100 bg-slate-50/30">
          {[
            { name: 'Details', icon: <List size={14}/> },
            { name: 'Timeline', icon: <History size={14}/> },
            { name: 'Comments', icon: <MessageSquare size={14}/> }
          ].map((tab) => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 py-4 px-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 relative ${
                activeTab === tab.name ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              {tab.icon}
              {tab.name}
              {tab.name === 'Comments' && <span className="ml-1 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md text-[8px]">1</span>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {activeTab === 'Details' && (
            <div className="space-y-8">
              {/* Project Info */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Project / Module</p>
                  <p className="text-xs font-bold text-slate-700">{alert.platform} • {alert.module}</p>
                </div>
                <div className={`p-2 rounded-xl ${severityBg} ${severityColor}`}>
                  {alert.severity === 'CRITICAL' ? <ShieldAlert size={18}/> : <AlertCircle size={18}/>}
                </div>
              </div>

              {/* Steps Section - Dynamic */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.15em] flex items-center gap-2">
                   <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                   Steps to Reproduce
                </h4>
                <div className="space-y-3">
                  {alert.steps && alert.steps.length > 0 ? alert.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition-colors">
                      <span className="text-[10px] font-black text-blue-400 bg-blue-50 w-5 h-5 flex items-center justify-center rounded-lg shrink-0 italic">
                        {index + 1}
                      </span>
                      <p className="text-[11px] font-bold text-slate-600 leading-relaxed">{step}</p>
                    </div>
                  )) : (
                    <p className="text-[11px] text-slate-400 italic">No specific steps provided.</p>
                  )}
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <h5 className="text-[9px] font-black text-emerald-700 uppercase mb-2 tracking-widest">Expected Result</h5>
                  <p className="text-[10px] font-bold text-slate-600 leading-snug">{alert.expected || "Result not defined."}</p>
                </div>
                <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100">
                  <h5 className="text-[9px] font-black text-red-700 uppercase mb-2 tracking-widest">Observed Bug</h5>
                  <p className="text-[10px] font-bold text-slate-600 leading-snug">{alert.actual || alert.title}</p>
                </div>
              </div>

              {/* Current Assignee */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Ownership</h4>
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center text-[11px] font-black italic shadow-lg shadow-slate-200">
                      {alert.user?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{alert.user}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{alert.module} Developer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Clock size={12} />
                    <span className="text-[9px] font-black">{alert.time}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline & Comments Tabs content remains similar but styled consistently */}
          {activeTab === 'Timeline' && (
            <div className="space-y-6 pt-2">
               <TimelineItem title="Alert Created" time={alert.time} user="System" status="RAISED" isLast={false} />
               <TimelineItem title="Assigned to Dev" time="1 hour ago" user={alert.user} status="ASSIGNED" isLast={true} />
            </div>
          )}

          {activeTab === 'Comments' && (
            <div className="space-y-5">
              <div className="bg-blue-50/30 border border-blue-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-[8px] font-black italic">SA</div>
                  <h4 className="text-[10px] font-black text-slate-700 uppercase">System Audit</h4>
                </div>
                <p className="text-[11px] font-bold text-slate-500 italic">No manual comments yet. Add one below to clarify details.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Quick Actions */}
        <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
          <textarea 
            placeholder="Write a message to the developer..."
            className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500/10 outline-none resize-none transition-all placeholder:text-slate-300"
          />
          <div className="flex gap-3 mt-4">
            <button className="flex-[2] bg-slate-900 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-[0.98]">
              Send Comment
            </button>
            <button className="flex-1 bg-white border-2 border-slate-100 text-slate-400 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-slate-50 transition-all">
              Attach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ title, time, user, status, isLast }) => (
  <div className="relative pl-10">
    {!isLast && <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1.5px] bg-slate-100" />}
    <div className={`absolute left-0 top-1 w-6 h-6 rounded-lg border-2 border-white shadow-md flex items-center justify-center z-10 ${status === 'RAISED' ? 'bg-red-500' : 'bg-blue-500'}`}>
       <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
    </div>
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm group hover:border-slate-300 transition-colors">
      <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${status === 'RAISED' ? 'text-red-500' : 'text-blue-500'}`}>{title}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        {time} <span className="mx-1 text-slate-200">•</span> BY <span className="text-slate-600 font-black italic">{user}</span>
      </p>
    </div>
  </div>
);

export default AlertDetailsSidebar;