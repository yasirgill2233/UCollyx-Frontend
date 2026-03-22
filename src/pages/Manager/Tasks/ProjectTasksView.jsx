import React, { useState } from 'react';
import { 
  Plus, ChevronDown, ChevronRight, Paperclip, Send, 
  X, MessageSquare, Layout, Table as TableIcon, Clock, CheckCircle2
} from 'lucide-react';
import KanbanBoard from './KanbanBoard';

const ProjectTasksView = () => {
  const [activeView, setActiveView] = useState('Table View');
  const [showActive, setShowActive] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const activeTasks = [
    { id: 1, title: "Design frontend for landing page", priority: "High", date: "Jan 22, 2026", status: "In Progress", assignee: "Yasir Saleem", color: "bg-orange-500" },
    { id: 2, title: "API Integration for Auth Flow", priority: "Medium", date: "Jan 25, 2026", status: "In Progress", assignee: "Shobal Gill", color: "bg-blue-500" },
    { id: 3, title: "Database Schema Optimization", priority: "High", date: "Jan 28, 2026", status: "In Progress", assignee: "David Kim", color: "bg-purple-500" },
  ];

  const completedTasks = [
    { id: 101, title: "Setup Project Boilerplate & Folders", priority: "Low", date: "Jan 15, 2026", status: "Done", assignee: "Yasir Saleem", color: "bg-orange-500" },
    { id: 102, title: "Initial Research & Documentation", priority: "Medium", date: "Jan 10, 2026", status: "Done", assignee: "Emily Chen", color: "bg-pink-500" },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "You", text: inputText, time: "9:45 PM", isMe: true }]);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-800">
      
      {/* HEADER SECTION */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95">
            <Plus size={20} /> Add New Task
          </button>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setActiveView('Table View')}
              className={`px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${activeView === 'Table View' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <TableIcon size={16} /> Table View
            </button>
            <button 
              onClick={() => setActiveView('Kanban')}
              className={`px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${activeView === 'Kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Layout size={16} /> Kanban Board
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          
          {activeView === 'Table View' ? (
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 font-black text-slate-400 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Task</th>
                    <th className="px-6 py-5">Priority</th>
                    <th className="px-6 py-5">Due Date</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-8 py-5">Assignee</th>
                  </tr>
                </thead>
                
                <tbody>
                  {/* --- ACTIVE TASKS --- */}
                  <tr className="cursor-pointer hover:bg-blue-50/30 transition-colors" onClick={() => setShowActive(!showActive)}>
                    <td colSpan="5" className="px-8 py-5 bg-slate-50/50 border-y border-slate-100 font-black text-sm uppercase text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="p-1 rounded-lg bg-white border border-slate-200 shadow-sm">
                          {showActive ? <ChevronDown size={18} className="text-blue-600" /> : <ChevronRight size={18} />}
                        </div>
                        Active Tasks ({activeTasks.length})
                      </div>
                    </td>
                  </tr>

                  {showActive && activeTasks.map((task) => (
                    <tr 
                      key={task.id} 
                      onClick={() => setSelectedTask(task)} 
                      className={`border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer group transition-all ${selectedTask?.id === task.id ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-8 py-6 text-[15px] font-bold text-slate-700 group-hover:text-blue-600">{task.title}</td>
                      <td className="px-6 py-6"><PriorityBadge level={task.priority} /></td>
                      <td className="px-6 py-6 text-sm font-bold text-slate-400">{task.date}</td>
                      <td className="px-6 py-6 text-xs font-black text-blue-500 uppercase">{task.status}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${task.color} text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm`}>
                            {task.assignee.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-600">{task.assignee}</span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* --- COMPLETED TASKS --- */}
                  <tr className="cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setShowCompleted(!showCompleted)}>
                    <td colSpan="5" className="px-8 py-5 bg-slate-50/50 border-y border-slate-100 font-black text-sm uppercase text-slate-400">
                      <div className="flex items-center gap-3">
                        <div className="p-1 rounded-lg bg-white border border-slate-200 shadow-sm">
                          {showCompleted ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                        Completed Tasks ({completedTasks.length})
                      </div>
                    </td>
                  </tr>

                  {showCompleted && completedTasks.map((task) => (
                    <tr key={task.id} className="border-b border-slate-50 opacity-60 italic bg-slate-50/20">
                      <td className="px-8 py-6 text-[15px] font-bold text-slate-400 line-through">
                         <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> {task.title}</div>
                      </td>
                      <td className="px-6 py-6 text-[10px] font-black uppercase text-slate-300">Low</td>
                      <td className="px-6 py-6 text-sm font-bold text-slate-300">{task.date}</td>
                      <td className="px-6 py-6 text-xs font-black text-green-500 uppercase">Done</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 grayscale">
                          <div className={`w-8 h-8 rounded-full ${task.color} text-white flex items-center justify-center text-[10px] font-black`}>
                            {task.assignee.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-300">{task.assignee}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* --- KANBAN BOARD PLACEHOLDER --- */
            <KanbanBoard/>
            // <div className="h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[32px] animate-in zoom-in-95 duration-300">
            //   <div className="p-6 bg-blue-50 rounded-full text-blue-600 mb-4">
            //     <Layout size={48} />
            //   </div>
            //   <h2 className="text-2xl font-black text-slate-800 italic">Kanban Board Mode</h2>
            //   <p className="text-slate-400 font-bold mt-2 text-center max-w-sm">
            //     Kanban layout is ready to be active. Please provide the design image to populate the columns (To-Do, In-Progress, Done).
            //   </p>
            // </div>
          )}
        </div>

        {/* CHAT PANEL */}
        {selectedTask && (
          <aside className="w-[450px] flex flex-col bg-white border-l border-slate-200 shadow-2xl animate-in slide-in-from-right duration-300 z-40">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><MessageSquare size={20} /></div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Discussion</h3>
                  <p className="text-[11px] font-bold text-slate-400 truncate w-48">{selectedTask.title}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm max-w-[90%]">
                 <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{selectedTask.assignee}</p>
                 <p className="text-sm font-bold text-slate-700">Checking the latest updates on this task...</p>
              </div>
              {messages.map(m => (
                <div key={m.id} className="flex justify-end"><div className="bg-blue-600 text-white p-4 rounded-2xl text-sm font-bold shadow-md">{m.text}</div></div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-100 flex gap-2">
               <input value={inputText} onChange={(e)=>setInputText(e.target.value)} className="flex-1 bg-slate-100 px-4 py-3 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-blue-200" placeholder="Type a message..." />
               <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all"><Send size={20} /></button>
            </form>
          </aside>
        )}
      </div>
    </div>
  );
};

const PriorityBadge = ({ level }) => {
  const color = level === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100';
  return <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border ${color}`}>{level}</span>;
};

export default ProjectTasksView;