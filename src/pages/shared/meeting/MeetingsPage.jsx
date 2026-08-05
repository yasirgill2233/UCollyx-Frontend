// import React, { useState, useMemo } from 'react';
// import { useMeeting } from '../../../hooks/useMeeting'; // Aapka updated hook
// import { ScheduleMeetingModal, JoinMeetingModal, ViewNotesModal } from './ScheduleMeetingModal';
// import { useMeetingsHub } from '../../../hooks/useMeetingsHub';

// const MeetingsPage = () => {
//   const { meetings, isLoading } = useMeetingsHub();
//   const [activeModal, setActiveModal] = useState(null);
//   const [selectedMeeting, setSelectedMeeting] = useState(null);

//   // --- API DATA FETCHING ---
//   // Hook se meetings aur loading state li
//   // const { meetings, isLoadingMeetings } = useMeeting();

//   // --- FILTERS STATE ---
//   const [searchTerm, setSearchTerm] = useState('');
//   const [projectFilter, setProjectFilter] = useState('All Projects');
//   const [timeFilter, setTimeFilter] = useState('All Time');

//   // --- FILTER LOGIC (Dynamic Data Par) ---
//   const filteredMeetings = useMemo(() => {
//     if (!meetings) return [];
//     return meetings.filter(meeting => {
//       const matchesSearch = 
//         meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         meeting.Project?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesProject = projectFilter === 'All Projects' || meeting.Project?.name === projectFilter;

//       return matchesSearch && matchesProject;
//     });
//   }, [meetings, searchTerm, projectFilter]);

//   // Separate Upcoming and Past from API data
//   const upcoming = useMemo(() => filteredMeetings.filter(m => m.status !== 'completed'), [filteredMeetings]);
//   const past = useMemo(() => filteredMeetings.filter(m => m.status === 'completed'), [filteredMeetings]);

//   // Unique Projects for dropdown from API data
//   const projects = useMemo(() => [
//     'All Projects', 
//     ...new Set(meetings.map(m => m.Project?.name).filter(Boolean))
//   ], [meetings]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#FBFBFE]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-slate-500 font-bold animate-pulse">Syncing Meetings Hub...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 md:p-10 lg:p-14 bg-[#FBFBFE] min-h-screen font-sans text-left">
//       <div className="mx-auto">
        
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
//           <div>
//             <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Workspace</span>
//             <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Meetings <span className="text-slate-400">Hub</span></h1>
//           </div>
//           <button 
//             onClick={() => setActiveModal('schedule')}
//             className="group bg-indigo-600 text-white px-8 py-3.5 rounded-md text-sm font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
//           >
//             <span className="text-lg group-hover:rotate-90 transition-transform duration-300">+</span>
//             Schedule Meeting
//           </button>
//         </div>

//         {/* --- ACTIVE FILTERS BAR --- */}
//         <div className="flex flex-wrap items-center gap-3 mb-12">
//           <div className="relative flex-1 min-w-[280px] max-w-md group">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
//             <input 
//               type="text" 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search meetings or projects..." 
//               className="w-full bg-white border border-slate-200 rounded-md px-12 py-3.5 text-sm shadow-sm outline-none focus:border-indigo-500 transition-all" 
//             />
//           </div>
//           <div className="flex gap-2">
//             <select 
//               value={projectFilter}
//               onChange={(e) => setProjectFilter(e.target.value)}
//               className="bg-white border border-slate-200 rounded-md px-6 py-3.5 text-xs font-bold text-slate-600 shadow-sm outline-none cursor-pointer"
//             >
//               {projects.map(p => <option key={p} value={p}>{p}</option>)}
//             </select>
//           </div>
//         </div>

//         {/* Upcoming Meetings */}
//         <section className="mb-20">
//           <div className="flex items-center gap-4 mb-8">
//             <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">Upcoming Sessions</h3>
//             <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full">
//               {upcoming.length} TOTAL
//             </span>
//             <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
//           </div>
          
//           <div className="grid gap-5">
//             {upcoming.length > 0 ? upcoming.map((meeting) => (
//                <MeetingCard 
//                 key={meeting.id} 
//                 meeting={meeting} 
//                 onJoin={() => {
//                     setSelectedMeeting(meeting);
//                     setActiveModal('join');
//                 }} 
//                />
//             )) : <div className="p-12 text-center text-slate-400 text-sm w-full border-2 border-dashed border-slate-100 rounded-md">No upcoming meetings scheduled.</div>}
//           </div>
//         </section>

//         {/* History Section */}
//         <section>
//           <div className="flex items-center gap-4 mb-8">
//             <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">History</h3>
//             <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
//           </div>
//           <div className="bg-white border border-slate-100 rounded-md overflow-hidden shadow-sm">
//             {past.length > 0 ? past.map((meeting, index) => (
//               <PastMeetingItem 
//                 key={meeting.id} 
//                 meeting={meeting} 
//                 isLast={index === past.length - 1}
//                 onRecap={() => { setSelectedMeeting(meeting); setActiveModal('notes'); }}
//               />
//             )) : <div className="p-8 text-center text-slate-400 text-sm">No meeting history found.</div>}
//           </div>
//         </section>
//       </div>

//       {/* Modals */}
//       <ScheduleMeetingModal isOpen={activeModal === 'schedule'} onClose={() => setActiveModal(null)} />
//       <JoinMeetingModal isOpen={activeModal === 'join'} onClose={() => setActiveModal(null)} meeting={selectedMeeting} />
//       <ViewNotesModal isOpen={activeModal === 'notes'} onClose={() => setActiveModal(null)} meeting={selectedMeeting} />
//     </div>
//   );
// };

// // --- Sub-Components (Backend Data Structure ke mutabiq) ---

// const MeetingCard = ({ meeting, onJoin }) => {
//   const isLive = meeting.status === 'live' || meeting.status === 'Live';
  
//   return (
//     <div className={`p-6 md:p-8 bg-white border rounded-md transition-all duration-300 ${isLive ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-100'}`}>
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
//         <div className="space-y-3 flex-1">
//           <h4 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600">{meeting.title}</h4>
//           <div className="flex flex-wrap gap-x-8 gap-y-2">
//              <p className="text-xs text-slate-400 font-medium text-left">Project <span className="text-slate-700 font-bold ml-1">{meeting.Project?.name || 'General'}</span></p>
//              <p className="text-xs text-slate-400 font-medium text-left">Time <span className="text-slate-700 font-bold ml-1">{new Date(meeting.start_time).toLocaleString()}</span></p>
//           </div>
//         </div>
//         <div className="flex items-center gap-8 w-full lg:w-auto">
//           <div className="flex-1 lg:text-right text-left">
//             <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase ${isLive ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
//               {meeting.status}
//             </span>
//           </div>
//           <button 
//             onClick={onJoin} 
//             className={`min-w-[140px] py-4 hover:cursor-pointer rounded-md text-xs font-black transition-all ${isLive ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
//           >
//             {isLive ? 'JOIN NOW' : 'VIEW DETAILS'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PastMeetingItem = ({ meeting, isLast, onRecap }) => (
//   <div className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50/50 ${!isLast ? 'border-b border-slate-50' : ''}`}>
//     <div className="flex items-center gap-5">
//       <div className="w-12 h-12 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500">📄</div>
//       <div className="text-left">
//         <h4 className="text-[15px] font-bold text-slate-700 group-hover:text-indigo-600">{meeting.title}</h4>
//         <p className="text-[11px] text-slate-400 font-bold uppercase">
//           {meeting.Project?.name} • {new Date(meeting.start_time).toLocaleDateString()}
//         </p>
//       </div>
//     </div>
//     <button onClick={onRecap} className="border border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 px-6 py-2.5 rounded-md text-xs font-black transition-all">
//       RECAP
//     </button>
//   </div>
// );

// export default MeetingsPage;




import React, { useState, useMemo } from 'react';
import { ScheduleMeetingModal, ViewNotesModal } from './ScheduleMeetingModal';
import { useMeetingsHub } from '../../../hooks/useMeetingsHub';
import JitsiVideoCall from '../centralchatt/Video/JitsiVideoCall'; // Aapka Jitsi SDK Video Call Component

const MeetingsPage = () => {
  const { meetings, isLoading } = useMeetingsHub();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // --- JITSI SDK CALL STATE ---
  const [isJitsiOpen, setIsJitsiOpen] = useState(false);
  const [activeCallData, setActiveCallData] = useState(null);

  // --- FILTERS STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('All Projects');

  // --- FILTER LOGIC ---
  const filteredMeetings = useMemo(() => {
    if (!meetings) return [];
    return meetings.filter(meeting => {
      const matchesSearch = 
        meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        meeting.Project?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProject = projectFilter === 'All Projects' || meeting.Project?.name === projectFilter;

      return matchesSearch && matchesProject;
    });
  }, [meetings, searchTerm, projectFilter]);

  // Separate Upcoming and Past
  const upcoming = useMemo(() => filteredMeetings.filter(m => m.status !== 'completed'), [filteredMeetings]);
  const past = useMemo(() => filteredMeetings.filter(m => m.status === 'completed'), [filteredMeetings]);

  // Unique Projects for dropdown
  const projects = useMemo(() => [
    'All Projects', 
    ...new Set(meetings ? meetings.map(m => m.Project?.name).filter(Boolean) : [])
  ], [meetings]);

  // --- HANDLE JOIN MEETING (SDK TRIGGER) ---
  const handleJoinMeeting = (meeting) => {
    setActiveCallData({
      roomName: meeting.room_name || meeting.title || `Room-${meeting.id}`,
      activeChat: meeting.Project?.name || 'General',
      currentMeetingId: meeting.id,
      // Current User Info (Agar aapke paas auth/user context ho toh wahan se bhi pass kar sakte hain)
      userName: meeting.hostName || "User",
      userEmail: meeting.hostEmail || ""
    });
    setIsJitsiOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FBFBFE]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold animate-pulse">Syncing Meetings Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 lg:p-14 bg-[#FBFBFE] min-h-screen font-sans text-left">
      <div className="mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Workspace</span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Meetings <span className="text-slate-400">Hub</span></h1>
          </div>
          <button 
            onClick={() => setActiveModal('schedule')}
            className="group bg-indigo-600 text-white px-8 py-3.5 rounded-md text-sm font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
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
              className="w-full bg-white border border-slate-200 rounded-md px-12 py-3.5 text-sm shadow-sm outline-none focus:border-indigo-500 transition-all" 
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-6 py-3.5 text-xs font-bold text-slate-600 shadow-sm outline-none cursor-pointer"
            >
              {projects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">Upcoming Sessions</h3>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full">
              {upcoming.length} TOTAL
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>
          
          <div className="grid gap-5">
            {upcoming.length > 0 ? upcoming.map((meeting) => (
               <MeetingCard 
                key={meeting.id} 
                meeting={meeting} 
                onJoin={() => handleJoinMeeting(meeting)} 
               />
            )) : <div className="p-12 text-center text-slate-400 text-sm w-full border-2 border-dashed border-slate-100 rounded-md">No upcoming meetings scheduled.</div>}
          </div>
        </section>

        {/* History Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">History</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>
          <div className="bg-white border border-slate-100 rounded-md overflow-hidden shadow-sm">
            {past.length > 0 ? past.map((meeting, index) => (
              <PastMeetingItem 
                key={meeting.id} 
                meeting={meeting} 
                isLast={index === past.length - 1}
                onRecap={() => { setSelectedMeeting(meeting); setActiveModal('notes'); }}
              />
            )) : <div className="p-8 text-center text-slate-400 text-sm">No meeting history found.</div>}
          </div>
        </section>
      </div>

      {/* --- JITSI SDK IN-APP CALL COMPONENT --- */}
      {isJitsiOpen && activeCallData && (
        <JitsiVideoCall
          isOpen={isJitsiOpen}
          onClose={() => {
            setIsJitsiOpen(false);
            setActiveCallData(null);
          }}
          roomName={activeCallData.roomName}
          activeChat={activeCallData.activeChat}
          currentMeetingId={activeCallData.currentMeetingId}
          userName={activeCallData.userName}
          userEmail={activeCallData.userEmail}
        />
      )}

      {/* Other Modals */}
      <ScheduleMeetingModal isOpen={activeModal === 'schedule'} onClose={() => setActiveModal(null)} />
      <ViewNotesModal isOpen={activeModal === 'notes'} onClose={() => setActiveModal(null)} meeting={selectedMeeting} />
    </div>
  );
};

// --- Sub-Components ---

const MeetingCard = ({ meeting, onJoin }) => {
  const isLive = meeting.status === 'live' || meeting.status === 'Live' || meeting.status === 'scheduled';
  
  return (
    <div className={`p-6 md:p-8 bg-white border rounded-md transition-all duration-300 ${isLive ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-100'}`}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-3 flex-1">
          <h4 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600">{meeting.title}</h4>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
             <p className="text-xs text-slate-400 font-medium text-left">Project <span className="text-slate-700 font-bold ml-1">{meeting.Project?.name || 'General'}</span></p>
             <p className="text-xs text-slate-400 font-medium text-left">Time <span className="text-slate-700 font-bold ml-1">{new Date(meeting.start_time).toLocaleString()}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-8 w-full lg:w-auto">
          <div className="flex-1 lg:text-right text-left">
            <span className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase ${isLive ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
              {meeting.status}
            </span>
          </div>
          <button 
            onClick={onJoin} 
            className="min-w-[140px] py-4 hover:cursor-pointer rounded-md text-xs font-black transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
          >
            JOIN MEETING
          </button>
        </div>
      </div>
    </div>
  );
};

const PastMeetingItem = ({ meeting, isLast, onRecap }) => (
  <div className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50/50 ${!isLast ? 'border-b border-slate-50' : ''}`}>
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500">📄</div>
      <div className="text-left">
        <h4 className="text-[15px] font-bold text-slate-700 group-hover:text-indigo-600">{meeting.title}</h4>
        <p className="text-[11px] text-slate-400 font-bold uppercase">
          {meeting.Project?.name || 'General'} • {new Date(meeting.start_time).toLocaleDateString()}
        </p>
      </div>
    </div>
    <button onClick={onRecap} className="border border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 px-6 py-2.5 rounded-md text-xs font-black transition-all">
      RECAP
    </button>
  </div>
);

export default MeetingsPage;