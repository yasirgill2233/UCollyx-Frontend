import React, { useEffect, useState } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import API from '../../api/axios';

const AddMemberModal = ({ isOpen, onClose, onAdd, existingMembers = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Ye wo saare log hain jo system mein hain (Total Directory)
  const allTeamMembers = [
    { id: 101, email:"zainahmed@gmail.com", status:"Active", name: 'Zain Ahmed', role: 'UI Designer', color: 'bg-orange-500' },
    { id: 102, email:"hassanraza@gmail.com", status:"Active", name: 'Hassan Raza', role: 'Backend Dev', color: 'bg-indigo-600' },
    { id: 103, email:"sanakhan@gmail.com", status:"InActive", name: 'Sana Khan', role: 'Product Manager', color: 'bg-pink-500' },
    { id: 104, email:"alimurtaza@gmail.com", status:"Active", name: 'Ali Murtaza', role: 'Full Stack', color: 'bg-emerald-500' },
  ];


  const [allUsers, setAllUsers] = useState([]);
  
    const fetchWorkspaceMembers = async () => {
      try {
        const res = await API.get('/workspace/members'); // Apna exact route use karein
        console.log("Add Member:",res.data.data)
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
  

  // Filter: Sirf wo dikhao jo pehle se channel mein nahi hain aur search se match karein
  const availableToAdd = allUsers.filter(member => 
    !existingMembers.some(em => em.full_name === member.User.full_name) &&
    member.User.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[250] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[380px] rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 pb-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Add to Channel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 pt-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400"
            />
          </div>

          <div className="space-y-1 max-h-[250px] overflow-y-auto custom-scrollbar">
            {availableToAdd.length > 0 ? (
              availableToAdd.map((member) => (
                <div 
                  key={member.User.id}
                  onClick={() => { onAdd(member); onClose(); }}
                  className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 p-2 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${'bg-red-500'} flex items-center justify-center text-white font-bold text-xs`}>
                      {member.User.full_name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{member.User.full_name}</h4>
                      <p className="text-[10px] text-gray-400">{member.User.role}</p>
                    </div>
                  </div>
                  <UserPlus size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-xs py-10">No new members to add</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;