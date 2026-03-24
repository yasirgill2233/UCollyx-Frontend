import React, { useState, useMemo } from 'react';
import { ScheduleMeetingModal, JoinMeetingModal, ViewNotesModal } from './ScheduleMeetingModal';

const MeetingsPage = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // --- FILTERS STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('All Projects');
  const [timeFilter, setTimeFilter] = useState('All Time');

  const upcomingMeetings = [
    { id: 1, title: 'Sprint Planning - QA Goals', project: 'E-commerce Platform', dateTime: '2 Jan 2026 at 10:00 AM', status: 'Live', inTime: 'in 8m' },
    { id: 2, title: 'Backend Review', project: 'Mobile App', dateTime: '3 Jan 2026 at 11:30 AM', status: 'Scheduled', inTime: 'in 30m' },
    { id: 3, title: 'Design Sync', project: 'E-commerce Platform', dateTime: '4 Jan 2026 at 09:00 AM', status: 'Scheduled', inTime: 'in 1h 30m' },
  ];

  const pastMeetings = [
    { id: 4, title: 'Client Demo', project: 'E-commerce Platform', dateTime: '28 Dec 2025 at 02:00 PM' },
    { id: 5, title: 'Weekly Standup', project: 'Internal Tool', dateTime: '29 Dec 2025 at 10:00 AM' },
    { id: 6, title: 'Security Audit', project: 'Mobile App', dateTime: '30 Dec 2025 at 04:00 PM' },
  ];

  // --- FILTER LOGIC ---
  const filterList = (list) => {
    return list.filter(meeting => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            meeting.project.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProject = projectFilter === 'All Projects' || meeting.project === projectFilter;

      // Note: Time filter implementation real data (Date objects) par depend karti hai, 
      // filhal humne UI logic connect kar di hai.
      return matchesSearch && matchesProject;
    });
  };

  const filteredUpcoming = useMemo(() => filterList(upcomingMeetings), [searchTerm, projectFilter]);
  const filteredPast = useMemo(() => filterList(pastMeetings), [searchTerm, projectFilter]);

  // Unique Projects for dropdown
  const projects = ['All Projects', ...new Set([...upcomingMeetings, ...pastMeetings].map(m => m.project))];

  return (
    <div className="p-6 md:p-10 lg:p-14 bg-[#FBFBFE] min-h-screen font-sans">
      <div className="mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Workspace</span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Meetings <span className="text-slate-400">Hub</span></h1>
          </div>
          <button 
            onClick={() => setActiveModal('schedule')}
            className="group bg-indigo-600 text-white px-8 py-3.5 rounded-lg text-sm font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <span className="text-lg group-hover:rotate-90 transition-transform duration-300">+</span>
            Schedule Meeting
          </button>
        </div>

        {/* --- ACTIVE FILTERS BAR --- */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          <div className="relative flex-1 min-w-[280px] max-w-md group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search meetings or projects..." 
              className="w-full bg-white border border-slate-200 rounded-lg px-12 py-3.5 text-sm shadow-sm outline-none focus:border-indigo-500 transition-all" 
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-6 py-3.5 text-xs font-bold text-slate-600 shadow-sm outline-none cursor-pointer"
            >
              {projects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-6 py-3.5 text-xs font-bold text-slate-600 shadow-sm outline-none cursor-pointer"
            >
              <option>All Time</option>
              <option>This Week</option>
              <option>Next Week</option>
            </select>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">Upcoming Sessions</h3>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full">
              {filteredUpcoming.length} TOTAL
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>
          
          <div className="grid gap-5">
            {filteredUpcoming.length > 0 ? filteredUpcoming.map((meeting) => (
               <MeetingCard 
                key={meeting.id} 
                meeting={meeting} 
                onJoin={() => meeting.status === 'Live' && setActiveModal('join')} 
               />
            )) : <div className="p-8 text-center text-slate-400 text-sm w-full h-[9vh] rounded-lg shadow-sm flex justify-center items-center">No upcoming meetings found</div>}
          </div>
        </section>

        {/* History Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">History</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>
          <div className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-sm">
            {filteredPast.length > 0 ? filteredPast.map((meeting, index) => (
              <PastMeetingItem 
                key={meeting.id} 
                meeting={meeting} 
                isLast={index === filteredPast.length - 1}
                onRecap={() => { setSelectedMeeting(meeting); setActiveModal('notes'); }}
              />
            )) : <div className="p-8 text-center text-slate-400 text-sm">No history matches your filters.</div>}
          </div>
        </section>
      </div>

      {/* Modals */}
      <ScheduleMeetingModal isOpen={activeModal === 'schedule'} onClose={() => setActiveModal(null)} />
      <JoinMeetingModal isOpen={activeModal === 'join'} onClose={() => setActiveModal(null)} meeting={selectedMeeting} />
      <ViewNotesModal isOpen={activeModal === 'notes'} onClose={() => setActiveModal(null)} meeting={selectedMeeting} />
    </div>
  );
};

// --- Sub-Components (Cleanliness ke liye) ---

const MeetingCard = ({ meeting, onJoin }) => (
  <div className={`p-6 md:p-8 bg-white border rounded-lg transition-all duration-300 hover:shadow-xl ${meeting.status === 'Live' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-100'}`}>
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
      <div className="space-y-3 flex-1">
        <h4 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600">{meeting.title}</h4>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
           <p className="text-xs text-slate-400 font-medium">Project <span className="text-slate-700 font-bold ml-1">{meeting.project}</span></p>
           <p className="text-xs text-slate-400 font-medium">Scheduled <span className="text-slate-700 font-bold ml-1">{meeting.dateTime}</span></p>
        </div>
      </div>
      <div className="flex items-center gap-8 w-full lg:w-auto">
        <div className="flex-1 lg:text-right">
          <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${meeting.status === 'Live' ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
            {meeting.status}
          </span>
          <p className="text-indigo-600 font-black text-sm mt-2">{meeting.inTime}</p>
        </div>
        <button onClick={onJoin} className={`min-w-[140px] py-4 rounded-lg text-xs font-black transition-all ${meeting.status === 'Live' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'}`}>
          {meeting.status === 'Live' ? 'JOIN NOW' : 'JOIN'}
        </button>
      </div>
    </div>
  </div>
);

const PastMeetingItem = ({ meeting, isLast, onRecap }) => (
  <div className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50/50 ${!isLast ? 'border-b border-slate-50' : ''}`}>
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500">📄</div>
      <div>
        <h4 className="text-[15px] font-bold text-slate-700 group-hover:text-indigo-600">{meeting.title}</h4>
        <p className="text-[11px] text-slate-400 font-bold uppercase">{meeting.project} • {meeting.dateTime}</p>
      </div>
    </div>
    <button onClick={onRecap} className="border border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black transition-all">
      RECAP
    </button>
  </div>
);

export default MeetingsPage;