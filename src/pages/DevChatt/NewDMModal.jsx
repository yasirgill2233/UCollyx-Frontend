import React, { useEffect, useState } from 'react';
import { X, Search } from 'lucide-react';
import API from '../../api/axios';

const NewDMModal = ({ isOpen, onClose, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data (Asli app mein ye props se bhi aa sakta hai)
  const members = [
    { id: 1, name: 'Ahmed Khan', role: 'QA Engineer', status: 'Online', color: 'bg-purple-500' },
    { id: 2, name: 'Zeeshan Ali', role: 'Product', status: 'Offline', color: 'bg-red-500' },
    { id: 3, name: 'Hamza Malik', role: 'DevOps', status: 'Online', color: 'bg-cyan-400' },
    { id: 4, name: 'Sara Ahmed', role: 'Designer', status: 'Online', color: 'bg-pink-500' },
  ];

   const [allUsers, setAllUsers] = useState([]);

  const fetchWorkspaceMembers = async () => {
    try {
      const res = await API.get('/workspace/members'); // Apna exact route use karein
      console.log("Users:",res.data.data)
      if (res.data.success) {
        setAllUsers(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
  
  useEffect(() => {
    fetchWorkspaceMembers();
  }, []);

  // Search filter logic
  const filteredMembers = allUsers.filter(member => 
    member.User.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[150] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[400px] rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 pb-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">New Direct Message</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 pt-2 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search team members..."
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div 
                  key={member.User.id} 
                  onClick={() => {
                    onSelectUser(member.User);
                    onClose();
                  }}
                  className="flex items-center justify-between group cursor-pointer hover:bg-blue-50/50 p-2.5 rounded-xl transition-all border border-transparent hover:border-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-105`}>
                        {member.User.full_name}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${member.User.status === 'Online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                    
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-800">{member.User.full_name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {member.role} • <span className={member.status === 'Online' ? 'text-green-500' : 'text-gray-400'}>{member.status}</span>
                      </p>
                    </div>
                  </div>

                  <button className="text-blue-600 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 pr-2">
                    Message <span className="text-sm">→</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-xs py-4">No members found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDMModal;