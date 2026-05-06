import React from 'react';
import { X, AtSign, MessageSquare, Hash, UserPlus, CheckCheck } from 'lucide-react';
import API from '../../api/axios'; // Apna axios instance import karein

const NotificationPopover = ({ isOpen, onClose, notifications, setNotifications, onSelectChat }) => {
  if (!isOpen) return null;

  // Unread count calculate karein (is_read column use ho rha ha)
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Sab ko read mark karne ka function
  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await API.put('/notifications/mark-read'); // Backend logic call karein
      const updated = notifications.map(n => ({ ...n, is_read: true }));
      setNotifications(updated);
    } catch (err) {
      console.error("Failed to mark all read");
    }
  };

  const handleNotifClick = async (notif) => {
    try {
      // 1. DB mein read mark karein
      if (!notif.is_read) {
        await API.put('/notifications/mark-read', { id: notif.id });
        const updated = notifications.map(n => 
          n.id === notif.id ? { ...n, is_read: true } : n
        );
        setNotifications(updated);
      }

      // 2. Navigation logic
      // target_url format: "/chat/channel/12" ya "/chat/dm/5"
      if (notif.target_url) {
        const parts = notif.target_url.split('/');
        const type = parts[2]; // 'channel' ya 'dm'
        const id = parts[3];   // ID
        onSelectChat(id, type);
      }
      onClose();
    } catch (err) {
      console.error("Error handling notification click");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[290] bg-black/5" onClick={onClose} />
      
      <div className="absolute top-16 right-8 w-[380px] bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-[300] overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
        
        {/* Header */}
        <div className="p-5 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <h3 className="font-black text-slate-800 tracking-tight">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                {unreadCount} New
              </span>
            )}
          </div>
          <button 
            onClick={handleMarkAllRead}
            className="text-[11px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        </div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto bg-white">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => handleNotifClick(notif)}
                className={`p-4 flex gap-4 cursor-pointer transition-all border-b border-slate-50 group ${!notif.is_read ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}
              >
                {/* Icon mapping based on notif.type from DB */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  notif.type === 'mention' ? 'bg-indigo-100 text-indigo-600' : 
                  notif.type === 'dm' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {notif.type === 'mention' ? <AtSign size={16} /> : <MessageSquare size={16} />}
                </div>

                <div className="flex-1">
                  <p className={`text-[13px] leading-snug ${!notif.is_read ? 'font-bold text-slate-800' : 'text-slate-500 font-medium'}`}>
                    {notif.content} {/* DB Column */}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">
                    {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {!notif.is_read && (
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white self-center" />
                )}
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-300 font-bold text-sm">No notifications yet ☕</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPopover;
















































// import React from 'react';
// import { X, AtSign, MessageSquare, Hash, UserPlus, CheckCheck } from 'lucide-react';

// const NotificationPopover = ({ isOpen, onClose, notifications, setNotifications, onSelectChat }) => {
//   if (!isOpen) return null;

//   // Unread count calculate karein
//   const unreadCount = notifications.filter(n => n.unread).length;

//   const handleMarkAllRead = (e) => {
//     e.stopPropagation();
//     const updated = notifications.map(n => ({ ...n, unread: false }));
//     setNotifications(updated);
//   };

//   const handleNotifClick = (notif) => {
//     // 1. Mark this specific one as read
//     const updated = notifications.map(n => 
//       n.id === notif.id ? { ...n, unread: false } : n
//     );
//     setNotifications(updated);

//     // 2. Navigate to chat (if applicable)
//     if (notif.targetChat) {
//       onSelectChat(notif.targetChat, notif.chatType);
//     }
//     onClose();
//   };

//   return (
//     <>
//       <div className="fixed inset-0 z-[290] bg-black/5" onClick={onClose} />
      
//       <div className="absolute top-16 right-8 w-[380px] bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-[300] overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
        
//         {/* Header */}
//         <div className="p-5 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
//           <div className="flex items-center gap-2.5">
//             <h3 className="font-black text-slate-800 tracking-tight">Notifications</h3>
//             {unreadCount > 0 && (
//               <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-blue-200">
//                 {unreadCount} New
//               </span>
//             )}
//           </div>
//           <div className="flex items-center gap-2">
//             <button 
//               onClick={handleMarkAllRead}
//               className="text-[11px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 p-1.5 rounded-lg hover:bg-blue-50 transition-all"
//             >
//               <CheckCheck size={14} /> Mark all read
//             </button>
//             <button onClick={onClose} className="p-1.5 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400">
//               <X size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Notifications List */}
//         <div className="max-h-[420px] overflow-y-auto custom-scrollbar bg-white">
//           {notifications.length > 0 ? (
//             notifications.map((notif) => (
//               <div 
//                 key={notif.id} 
//                 onClick={() => handleNotifClick(notif)}
//                 className={`p-4 flex gap-4 cursor-pointer transition-all relative border-b border-slate-50 group ${notif.unread ? 'bg-blue-50/30 hover:bg-blue-50/60' : 'hover:bg-slate-50'}`}
//               >
//                 {/* Dynamic Icon based on type */}
//                 <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 ${
//                   notif.type === 'mention' ? 'bg-indigo-100 text-indigo-600' : 
//                   notif.type === 'dm' ? 'bg-emerald-100 text-emerald-600' :
//                   notif.type === 'channel' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'
//                 }`}>
//                   {notif.type === 'mention' && <AtSign size={16} />}
//                   {notif.type === 'dm' && <MessageSquare size={16} />}
//                   {notif.type === 'channel' && <Hash size={16} />}
//                   {notif.type === 'join' && <UserPlus size={16} />}
//                 </div>

//                 <div className="flex-1">
//                   <p className={`text-[13px] leading-snug ${notif.unread ? 'font-bold text-slate-800' : 'text-slate-500 font-medium'}`}>
//                     {notif.text}
//                   </p>
//                   <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">
//                     {notif.time}
//                   </p>
//                 </div>

//                 {notif.unread && (
//                   <div className="w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white absolute right-4 top-1/2 -translate-y-1/2 shadow-sm" />
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="py-20 text-center">
//               <p className="text-slate-300 font-bold text-sm italic">All caught up! ☕</p>
//             </div>
//           )}
//         </div>

//         <button className="w-full p-4 text-center text-[12px] font-black text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all border-t border-slate-50 uppercase tracking-widest">
//           See activity history
//         </button>
//       </div>
//     </>
//   );
// };

// export default NotificationPopover;