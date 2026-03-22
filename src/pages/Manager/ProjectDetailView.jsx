import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Bell, ChevronDown, AlertCircle, 
  Info, Users, Layout, Clock, CheckCircle2, 
  X
} from 'lucide-react';

const ProjectDetailView = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedLog, setSelectedLog] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const project = location.state?.project;

  if (!project) {
    return <div className="p-10 text-center font-bold">Project data not found!</div>;
  }

  // --- Overview Tab Content ---
  const renderOverview = () => (
    <div className="animate-in fade-in duration-500">
      {/* Dynamic Stats Row */}
      <div className="grid grid-cols-4 gap-6 mb-8 mt-8">
        <DetailStatCard 
          label="Overall Health" 
          value={project.health} 
          sub="Requires immediate attention" 
          color={project.health === 'Critical' ? 'text-red-600' : 'text-green-600'} 
        />
        <DetailStatCard 
          label="Sprint Status" 
          value={project.status === 'Critical' ? 'Delayed' : 'On Track'} 
          sub={project.sprintDate} 
          color="text-slate-800" 
        />
        <DetailStatCard 
          label="Open Red Cards" 
          value={project.redCards} 
          sub="Active Critical Issues" 
          color="text-slate-800" 
        />
        <DetailStatCard 
          label="Last Deployment" 
          value={project.lastDeploy} 
          sub="Production - 2 hours ago" 
          color={project.lastDeploy === 'Failed' ? 'text-red-600' : 'text-green-600'} 
        />
      </div>

      {/* Dynamic Progress Bar */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
           <h2 className="font-black text-slate-800 tracking-tight">Sprint Progress & Task Distribution</h2>
           <span className="text-sm font-black text-slate-800">{project.progress}%</span>
        </div>
        <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden mb-8">
           <div className={`${project.color} h-full transition-all duration-700`} style={{ width: `${project.progress}%` }} />
        </div>
        <div className="grid grid-cols-4 gap-6">
           {[
             { label: "To Do", val: project.todo }, { label: "In Progress", val: project.inprogress },
             { label: "Blocked", val: project.blocked }, { label: "Done", val: project.done }
           ].map((item, i) => (
             <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl text-center shadow-sm">
                <h3 className="text-2xl font-black text-slate-800 mb-1">{item.val}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Risks */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h2 className="font-black text-slate-800 tracking-tight">Open Risks & Red Cards</h2>
             <button className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase shadow-lg shadow-red-100 tracking-wider">
                View All Red Cards
             </button>
          </div>
          <div className="space-y-4">
             <RiskItem id="RED-892" title="Production API gateway timeout - payment failures" priority="Critical" status="In Progress" color="red" />
             <RiskItem id="RED-885" title="Database connection pool exhaustion under load" priority="High" status="Investigating" color="orange" />
          </div>
        </div>

        {/* Team Load */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h2 className="font-black text-slate-800 tracking-tight">Team Load Snapshot</h2>
             <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-[10px] font-bold text-yellow-700">Load Imbalance Detected</span>
             </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
             <TeamMemberCard name="Sarah Chen" tasks="8" status="Overloaded" color="bg-red-50 text-red-600" />
             <TeamMemberCard name="Ahmed Khan" tasks="7" status="Overloaded" color="bg-red-50 text-red-600" />
             <TeamMemberCard name="Maria Garcia" tasks="5" status="Normal" color="bg-green-50 text-green-600" />
             <TeamMemberCard name="David Park" tasks="4" status="Normal" color="bg-green-50 text-green-600" />
             <TeamMemberCard name="John Smith" tasks="4" status="Normal" color="bg-green-50 text-green-600" />
             <TeamMemberCard name="Lisa Wong" tasks="2" status="Available" color="bg-slate-50 text-slate-400" />
          </div>
          <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
             <p className="text-[11px] text-yellow-800 font-medium">
                <span className="font-black italic mr-1">Note:</span> 2 developers are overloaded while 1 is underutilized. Consider workload rebalancing.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
  

  // ProjectDetailView.jsx ke andar ye function add ya update karein:

const renderRisksAndCards = () => {
  const riskCards = [
    {
      id: 1,
      title: "Payment Gateway timeout causing order failures",
      module: "E-Commerce Platform - Checkout Module",
      assignee: "Yasir Saleem",
      time: "23h 12m",
      status: "OPEN",
      borderColor: "border-l-red-500",
      statusClass: "text-red-500 bg-red-50 border-red-100"
    },
    {
      id: 2,
      title: "Security vulnerability in user authentication flow",
      module: "E-Commerce Platform - Checkout Module",
      assignee: "Yasir Saleem",
      time: "23h 12m",
      status: "ACKNOWLEDGED",
      borderColor: "border-l-yellow-500",
      statusClass: "text-yellow-600 bg-yellow-50 border-yellow-100"
    },
    {
      id: 3,
      title: "Database connection pool exhausted under load",
      module: "E-Commerce Platform - Checkout Module",
      assignee: "Yasir Saleem",
      time: "23h 12m",
      status: "IN PROGRESS",
      borderColor: "border-l-blue-500",
      statusClass: "text-blue-500 bg-blue-50 border-blue-100"
    }
  ];

  return (
    <div className="space-y-4 mt-8 animate-in slide-in-from-bottom-4 duration-500">
      {riskCards.map((card) => (
        <div 
          key={card.id} 
          className={`bg-white border border-slate-100 border-l-4 ${card.borderColor} rounded-xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all`}
        >
          <div className="flex items-start gap-6">
            <div className="mt-1">
              {card.status === 'IN PROGRESS' ? (
                <AlertCircle size={24} className="text-slate-400" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-xs italic">!</div>
              )}
            </div>
            
            <div>
              <h3 className="text-base font-black text-slate-800 leading-tight mb-1">{card.title}</h3>
              <p className="text-[11px] text-slate-400 font-bold mb-4">{card.module}</p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200" /> {/* Avatar Placeholder */}
                  <span className="text-xs font-bold text-slate-700">{card.assignee}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock size={14} />
                  <span className="text-xs font-bold">{card.time}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${card.statusClass}`}>
              {card.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ProjectDetailView.jsx ke andar ye state aur functions add karein:

 // Modal control ke liye

const renderDeployments = () => {
  const deployments = [
    {
      version: "v2.4.1",
      status: "Failed",
      type: "Auto",
      timestamp: "Yesterday 4:12 PM",
      log: "$ Build failed: API gateway timeout during integration tests. Exit code 1.",
      statusClass: "bg-red-50 text-red-500 border-red-100",
      icon: "text-red-500 bg-red-50"
    },
    {
      version: "v2.4.0",
      status: "Success",
      type: "Manual",
      timestamp: "Jan 30 2:00 PM",
      log: "$ Deployment successful. All health checks passed.",
      statusClass: "bg-green-50 text-green-600 border-green-100",
      icon: "text-green-600 bg-green-50"
    }
  ];

  return (
    <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-sm font-black text-slate-800 mb-4">Deployment History</h2>
      
      <div className="space-y-3">
        {deployments.map((dep, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between group hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${dep.icon}`}>
                {dep.status === 'Success' ? '✓' : '✕'}
              </div>
              <span className="text-sm font-black text-slate-800">{dep.version}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${dep.statusClass}`}>
                {dep.status}
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase">
                {dep.type}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-[11px] font-bold text-slate-400">{dep.timestamp}</span>
              <button 
                onClick={() => setSelectedLog(dep)}
                className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1"
              >
                Logs →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Deployment Log Modal --- */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-slate-800">{selectedLog.version}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{selectedLog.timestamp}</p>
                <div className="flex gap-2 mt-2">
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded ${selectedLog.statusClass}`}>{selectedLog.status}</span>
                   <span className="text-[9px] font-black px-2 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100">Trigger: {selectedLog.type}</span>
                </div>
              </div>
              <button onClick={() => setSelectedLog(null)} className="bg-slate-50 p-1.5 rounded-full text-slate-400 hover:text-slate-600">
                <X size={16} /> {/* Replace with Lucide X icon */}
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Deployment Log</p>
              <div className="bg-[#1e293b] rounded-xl p-4 font-mono text-[11px] text-blue-100 leading-relaxed shadow-inner border border-slate-700">
                {selectedLog.log}
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="w-full bg-blue-600 text-white font-black py-3 rounded-xl mt-6 text-xs shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans pb-10">
      <main className="p-8 mx-auto">
        {/* Project Header & Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
             <button onClick={()=>navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-slate-600" />
             </button>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight">{project.name}</h1>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex bg-white border border-slate-100 rounded-xl p-1">
                {['Overview', 'Risks & Cards', 'Deployments'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>
             <button className="flex items-center gap-2 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-white">
                This Sprint <ChevronDown size={14}/>
             </button>
          </div>
        </div>

        {/* --- Tab Content Switching Logic --- */}
        {activeTab === 'Overview' && renderOverview()}

        {activeTab === 'Risks & Cards' && renderRisksAndCards()}

        {activeTab === 'Deployments' && renderDeployments()}
      </main>
    </div>
  );
};

// ... (Sub-components like DetailStatCard, RiskItem, TeamMemberCard stay exactly as you had them)
// Sub-components for Detail View
const DetailStatCard = ({ label, value, sub, color }) => (
  <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">{label}</p>
    <h3 className={`text-xl font-black mb-1 ${color}`}>{value}</h3>
    <p className="text-[10px] font-medium text-slate-400">{sub}</p>
  </div>
);

const RiskItem = ({ id, title, priority, status, color }) => (
  <div className={`border rounded-2xl p-4 border-${color}-100 bg-${color}-50/10`}>
    <div className="flex gap-2 mb-2">
      <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{id}</span>
      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${priority === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>{priority}</span>
      <span className="text-[9px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded">{status}</span>
    </div>
    <h4 className="text-[13px] font-black text-slate-800 mb-2 leading-tight">{title}</h4>
    <div className="flex gap-4 text-[10px] font-bold text-slate-400">
       <span>Module: <span className="text-slate-600">Payment Processing</span></span>
       <span>Open For: <span className="text-slate-600">2 hours</span></span>
    </div>
  </div>
);

const TeamMemberCard = ({ name, tasks, status, color }) => (
  <div className={`p-4 rounded-2xl border border-slate-100 bg-white relative group hover:border-blue-400 transition-all cursor-pointer`}>
    <div className="flex justify-between items-start">
       <div>
          <p className="text-xs font-black text-slate-800">{name}</p>
          <p className="text-[10px] text-slate-400 font-bold">{tasks} tasks assigned</p>
       </div>
       <div className={`w-2 h-2 rounded-full mt-1 ${status === 'Overloaded' ? 'bg-red-500' : status === 'Normal' ? 'bg-green-500' : 'bg-slate-300'}`} />
    </div>
    <div className="mt-4 flex justify-end">
       <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${color.split(' dot')[0]}`}>{status}</span>
    </div>
  </div>
);

export default ProjectDetailView;