import React from 'react';

const LinkEpicModal = ({ epics, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95">
        <h2 className="text-xl font-black text-slate-800 mb-2">Link Epic</h2>
        <p className="text-sm font-bold text-slate-400 mb-6">Select an epic to link this card to:</p>
        
        <div className="space-y-3">
          {epics.map((epic) => (
            <button
              key={epic.id}
              onClick={() => onSelect(epic)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-left group"
            >
              <div className={`w-3 h-3 rounded-full ${epic.color} group-hover:scale-125 transition-transform`} />
              <div>
                <div className="font-black text-slate-700 text-sm uppercase leading-none mb-1">{epic.title}</div>
                <div className="text-[10px] font-black text-slate-300 tracking-widest">{epic.id}</div>
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 py-3 text-sm font-black text-slate-500 hover:text-slate-700 uppercase tracking-widest"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LinkEpicModal;