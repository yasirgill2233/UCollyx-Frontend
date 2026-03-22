import React, { useState,useEffect, useRef } from 'react';
import { 
  ChevronDown, MessageSquare, Video, MoreVertical, 
  Bug, BookText, ClipboardList, Link2, Unlink, Plus, X, Zap, CheckSquare,
  Calendar,
  Send,
  CheckCircle2
} from 'lucide-react';



// --- CHAT MODAL COMPONENT ---
const ChatModal = ({ task, onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "Muneeb Qazi", initial: "MQ", text: "We need to finalize the API endpoints before proceeding.", time: "1 day ago", isMe: false }
  ]);
  
  const scrollRef = useRef(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: "Ahsan Khan", // Assuming current user is Ahsan
      initial: "AK",
      text: input,
      time: "Just now",
      isMe: true
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[550px]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100"><MessageSquare size={20} /></div>
            <div>
              <h3 className="font-black text-slate-800 text-sm tracking-widest uppercase">Card Chatt</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-white font-black shadow-sm ${msg.isMe ? 'bg-indigo-600' : 'bg-orange-500'}`}>
                {msg.initial}
              </div>
              <div className={`max-w-[80%] ${msg.isMe ? 'text-right' : ''}`}>
                <div className={`p-4 rounded-2xl shadow-sm border border-slate-100 ${msg.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-600 rounded-tl-none'}`}>
                  <p className="text-xs font-bold leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase mt-1 block">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-slate-50 bg-white shrink-0">
          <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-blue-400 transition-all">
            <input 
              className="flex-1 bg-transparent px-3 py-2 text-xs font-bold text-slate-700 outline-none" 
              placeholder="Write a message... (Enter to send)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all shadow-md shadow-indigo-100 active:scale-95"
            >
              Send <Send size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal