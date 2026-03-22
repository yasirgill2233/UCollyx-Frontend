import React from 'react';

// 1. Schedule Meeting Modal (Form jahan meeting create hogi)
export const ScheduleMeetingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[500px] rounded-lg shadow-2xl p-8 relative animate-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 bg-gray-50 rounded-lg p-1.5 hover:bg-gray-100">✕</button>
        
        <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          <span className="text-2xl">📅</span> Schedule New Meeting
        </h2>

        <div className="space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Title</label>
            <input type="text" className="w-full border border-gray-100 rounded-lg px-5 py-3 text-sm bg-gray-50/50 outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="e.g. Sprint Planning - QA Goals" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project</label>
            <select className="w-full border border-gray-100 rounded-lg px-5 py-3 text-sm bg-gray-50/50 outline-none">
              <option>E-Commerce Platform</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
              <input type="date" className="w-full border border-gray-100 rounded-lg px-5 py-3 text-sm bg-gray-50/50 outline-none" defaultValue="2026-03-03" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
              <input type="time" className="w-full border border-gray-100 rounded-lg px-5 py-3 text-sm bg-gray-50/50 outline-none" defaultValue="10:00" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meeting Link</label>
            <input type="text" className="w-full border border-gray-100 rounded-lg px-5 py-3 text-sm bg-gray-50/50 outline-none" placeholder="https://meet.google.com/..." />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agenda / Description</label>
            <textarea className="w-full border border-gray-100 rounded-lg px-5 py-3 text-sm bg-gray-50/50 h-28 resize-none outline-none" placeholder="What will be discussed?"></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button onClick={onClose} className="px-8 py-3 rounded-lg text-sm font-bold text-gray-500 border border-gray-100 hover:bg-gray-50">Cancel</button>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700">Schedule Meeting</button>
        </div>
      </div>
    </div>
  );
};

// 2. Join Meeting Modal (Live meeting popup)
export const JoinMeetingModal = ({ isOpen, onClose, meeting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[460px] rounded-lg shadow-2xl p-8 relative animate-in slide-in-from-bottom-5 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">✕</button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3.5 h-3.5 bg-green-500 rounded-lg animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{meeting?.title}</h2>
        </div>

        <div className="bg-green-50/60 border border-green-100 rounded-lg p-5 mb-8 text-left">
          <p className="text-green-600 font-black text-[11px] uppercase tracking-widest mb-1">Meeting Is Live Now</p>
          <p className="text-slate-500 text-[13px] font-medium">{meeting?.project} • Mar 3, 2026 at 4:33 PM</p>
        </div>

        <div className="space-y-8 text-left">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Meeting Link</label>
            <div className="flex items-center justify-between border border-blue-100 bg-blue-50/30 rounded-lg px-5 py-3.5">
              <span className="text-blue-500 text-xs font-bold truncate pr-4">https://meet.google.com/spr-plan-qa01</span>
              <button className="text-slate-300 hover:text-blue-500">📋</button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Attendees</label>
            <div className="flex flex-wrap gap-2.5">
              {['Yasir Saleem', 'Zain Ahmed', 'Sara Khan'].map((name, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-4 py-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-[9px] flex items-center justify-center font-black text-blue-600">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-[12px] font-bold text-slate-600">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-10">
          <button onClick={onClose} className="px-8 py-3 rounded-lg text-sm font-bold text-slate-400 border border-slate-100">Close</button>
          <button className="px-8 py-3 bg-[#10b981] text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-xl shadow-green-100 hover:bg-[#059669]">
            🚀 Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. View Notes Modal (Past meeting details)
export const ViewNotesModal = ({ isOpen, onClose, meeting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[600px] rounded-lg shadow-2xl p-10 relative max-h-[90vh] overflow-y-auto custom-scrollbar text-left">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">✕</button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <span className="text-2xl">📋</span> {meeting?.title}
        </h2>
        <p className="text-[13px] text-slate-400 font-medium mb-8">Monday, March 2, 2026 • {meeting?.project} • 4 attendees</p>

        <div className="space-y-8">
          <div className="bg-green-50/50 border border-green-100 rounded-lg p-6">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
               <span className="text-xs">✓</span> Outcome
            </p>
            <p className="text-[14px] text-green-800 font-bold leading-snug">3 blockers identified, assigned to respective owners</p>
          </div>

          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Meeting Summary</h3>
            <div className="text-[14px] text-slate-600 leading-[1.6] bg-slate-50/50 border border-slate-100 rounded-lg p-6">
              Team reviewed 14 backlog items. Three critical blockers were identified in the checkout module. Each blocker was assigned to the respective module owner with 48h resolution target.
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Action Items</h3>
            <div className="space-y-3">
              {[
                { id: 1, text: "Fix database connection pool issue", owner: "Zain Ahmed" },
                { id: 2, text: "Update payment gateway timeout config", owner: "Ali Raza" },
                { id: 3, text: "Review auth vulnerability patch", owner: "Sara Khan" }
              ].map((item) => (
                <div key={item.id} className="flex gap-4 text-[14px] text-slate-700 font-bold items-center p-4 border border-slate-50 rounded-lg bg-white shadow-sm shadow-slate-100/50">
                  <span className="w-6 h-6 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center text-[10px] font-black">{item.id}</span>
                  <p>{item.text} <span className="text-slate-400 font-medium">— {item.owner}</span></p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Attendees</h3>
            <div className="flex -space-x-3">
               {['YS', 'ZA', 'SK', 'AR'].map((init, i) => (
                 <div key={i} className="w-10 h-10 rounded-lg border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">{init}</div>
               ))}
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-3 mt-12 pt-8 border-t border-slate-50">
           <button onClick={onClose} className="px-8 py-3 rounded-lg text-sm font-bold text-slate-400 border border-slate-100">Close</button>
           <button className="px-8 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-xl shadow-blue-100 flex items-center gap-2">
              ⬇ Export PDF
           </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;