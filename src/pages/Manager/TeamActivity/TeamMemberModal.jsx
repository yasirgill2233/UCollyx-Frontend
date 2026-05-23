import React from 'react';
import { X, ListTodo } from 'lucide-react';

const TeamMemberModal = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-black">{member.name}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase">{member.role}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full"><X size={16} /></button>
        </div>

        {/* Dynamic Task List */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
            <ListTodo size={14} /> Active Tasks
          </h4>
          {member.Tasks?.map((task) => (
            <div key={task.id} className="p-4 border rounded-xl flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">{task.title}</span>
              <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal