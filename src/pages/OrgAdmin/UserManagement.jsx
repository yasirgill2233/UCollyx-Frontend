import React, { useState, useEffect } from 'react';
import { MoreVertical, UserPlus, Search, X, Mail, Shield, CheckCircle2, Calendar, Hash } from 'lucide-react';

const initialUsers = [
  { id: 1, name: 'Sarah Gill', email: 'sarah.gill@gmail.com', role: 'Developer', team: 'Backend Team', status: 'Active', lastActive: '2 hours ago' },
  { id: 2, name: 'Sarah Gill', email: 'sarah.gill@gmail.com', role: 'Manager', team: 'Frontend Team', status: 'Invited', lastActive: '2 hours ago' },
  { id: 3, name: 'Yasir Saleem', email: 'yasir.s@gmail.com', role: 'Developer', team: 'Backend Team', status: 'Active', lastActive: '2 hours ago' },
  { id: 4, name: 'Ahsan Saleem', email: 'ahsan.s@gmail.com', role: 'Developer', team: 'Full Stack', status: 'Active', lastActive: '2 hours ago' },
  { id: 5, name: 'Shobal Gill', email: 'shobal.g@gmail.com', role: 'Developer', team: 'Full Stack', status: 'Active', lastActive: '2 hours ago' },
];

export default function UsersManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [toast, setToast] = useState({ show: false, message: '' });

  // Notifications logic
  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Actions
  const onDisable = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Disabled' } : u));
    setSelectedUser(null);
    triggerToast("User access has been successfully disabled.");
  };

  const onInvite = (newUser) => {
    const userToAdd = {
      ...newUser,
      id: Date.now(),
      status: 'Invited',
      lastActive: 'Just now'
    };
    setUsers([userToAdd, ...users]);
    setShowInviteModal(false);
    triggerToast(`Invitation sent to ${newUser.email}`);
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans relative">
      
      {/* --- Toast Notification --- */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 border border-slate-700">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Users and Teams</h1>
            <p className="text-slate-500 mt-1.5 text-sm font-medium">Manage organization members and access levels.</p>
          </div>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2.5 transition-all shadow-lg active:scale-95 font-semibold text-sm"
          >
            <UserPlus size={18} /> Invite User
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500" size={19} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="border border-slate-200 rounded-2xl px-5 py-3 bg-white text-sm font-semibold text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Developer">Developer</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">User Details</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Role</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Team</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  onClick={() => setSelectedUser(user)}
                  className="group hover:bg-blue-50/30 cursor-pointer transition-all"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-blue-700">{user.name}</div>
                        <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-600">{user.role}</td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium">{user.team}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ring-1 ring-inset ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 
                      user.status === 'Disabled' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                      'bg-amber-50 text-amber-700 ring-amber-600/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Disabled' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right flex justify-end items-center gap-5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{user.lastActive}</span>
                      <button className="text-slate-300 group-hover:text-slate-600"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modals --- */}
      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} onInvite={onInvite} />}
      
      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onDisable={onDisable}
        />
      )}
    </div>
  );
}

// Sub-Component: Invite Modal
function InviteModal({ onClose, onInvite }) {
  const [formData, setFormData] = useState({ email: '', role: 'Developer', team: 'Frontend Team' });

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
      <div className="bg-white rounded-[28px] w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in-95">
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Invite User</h2>
            <p className="text-slate-500 text-sm">Add member to workspace.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>
        <div className="p-8 pt-2 space-y-4">
          <input 
            placeholder="Email Address" 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <select 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="Developer">Developer</option>
            <option value="Manager">Manager</option>
          </select>
          <input 
            placeholder="Team Name" 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, team: e.target.value})}
          />
        </div>
        <div className="p-6 bg-slate-50/50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm">Cancel</button>
          <button 
            onClick={() => onInvite({ name: formData.email.split('@')[0], ...formData })}
            className="flex-[1.5] py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg"
          >
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-Component: User Details Modal (Drawer)
function UserDetailsModal({ user, onClose, onDisable }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex justify-end z-[150]">
      <div className="bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col border-l border-slate-100">
        
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">User Details</h2>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-50 rounded-2xl border border-slate-100 text-slate-400"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Profile Card */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[32px] flex items-center justify-center text-white text-3xl font-black shadow-xl">
              {user.name.charAt(0)}
            </div>
            <h3 className="mt-5 text-2xl font-extrabold text-slate-900">{user.name}</h3>
            <p className="text-slate-500 font-medium flex items-center gap-1.5 mt-1"><Mail size={14} /> {user.email}</p>
          </div>

          {/* Role & Team Grid */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Role & Access</h4>
            <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4">
              <DetailRow label="Role" value={user.role} />
              <DetailRow label="Team" value={user.team} isTeam />
              <DetailRow label="Status" value={user.status} isStatus />
              <DetailRow label="Last Seen" value={user.lastActive} isTime />
            </div>
          </div>

          {/* Project Memberships (Re-added) */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Project Memberships</h4>
            <div className="grid gap-3">
              {['Platform Redesign', 'API Integration'].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                  <span className="text-sm font-bold text-slate-700">{p}</span>
                  <span className="text-[10px] font-bold text-slate-400 italic font-mono">ID: 00{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata (Re-added) */}
          <div className="pt-4 border-t border-slate-100 flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
            <div className="flex items-center gap-1"><Hash size={12} /> ID: {user.id}</div>
            <div className="flex items-center gap-1"><Calendar size={12} /> Joined: 2026</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-8 bg-white border-t border-slate-100">
          <button 
            onClick={() => onDisable(user.id)}
            disabled={user.status === 'Disabled'}
            className={`w-full py-4 font-bold rounded-2xl transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2 shadow-lg ${
              user.status === 'Disabled' 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-white border-2 border-red-50 text-red-600 hover:bg-red-50 shadow-red-100/50'
            }`}
          >
            <Shield size={16} />
            {user.status === 'Disabled' ? 'Access Already Disabled' : 'Disable User Access'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, isStatus, isTeam, isTime }) {
  const getStatusColor = (val) => {
    if (val === 'Active') return 'text-emerald-600';
    if (val === 'Disabled') return 'text-red-600';
    return 'text-amber-600';
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px] font-bold text-slate-400">{label}</span>
      <span className={`text-sm font-bold ${
        isStatus ? getStatusColor(value) : 
        isTeam ? 'text-blue-600' : 
        isTime ? 'text-slate-400 italic' : 'text-slate-800'
      }`}>
        {value}
      </span>
    </div>
  );
}