import React, { useState } from 'react';
import { 
  Search, Bell, LayoutDashboard, Building2, 
  Users, Activity, ChevronRight, MoreHorizontal 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// Chart ka dummy data
const chartData = [
  { name: 'Jan', active: 150, suspended: 10 },
  { name: 'Feb', active: 180, suspended: 15 },
  { name: 'Mar', active: 210, suspended: 12 },
  { name: 'Apr', active: 190, suspended: 20 },
  { name: 'May', active: 235, suspended: 12 },
  { name: 'Jun', active: 250, suspended: 18 },
];

const AdminDashboard = () => {
  const [stats] = useState({
    activeOrgs: 42,
    suspendedOrgs: 2,
    totalUsers: 1247,
    roleDistribution: { members: 848, managers: 299, admins: 100 }
  });

  const [events, setEvents] = useState([
    { id: 1, type: "Failed Login Attempts Exceed", user: "admin@acme.corp", org: "Acme Corp", time: "14:18 UTC" },
    { id: 2, type: "Failed Login Attempts Exceed", user: "admin@acme.corp", org: "Acme Corp", time: "14:18 UTC" },
    { id: 3, type: "Failed Login Attempts Exceed", user: "admin@acme.corp", org: "Acme Corp", time: "14:18 UTC" },
    { id: 4, type: "Failed Login Attempts Exceed", user: "admin@acme.corp", org: "Acme Corp", time: "14:18 UTC" },
  ]);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans text-slate-900">
     

      <main className="flex-1">
        {/* Dashboard Content */}
        <div className="p-8 max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#111827]">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Platform governance and security overview</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Active Organizations Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Active Organizations</h3>
                <MoreHorizontal className="w-5 h-5 text-gray-300" />
              </div>
              <div className="text-5xl font-bold mb-2">{stats.activeOrgs}</div>
              <p className="text-gray-400 text-sm mb-10">Organizations in production</p>
              <div className="flex justify-between items-center">
                <span className="bg-gray-50 text-[10px] font-bold px-2 py-1 rounded border border-gray-200 text-gray-600">
                  {stats.suspendedOrgs} Suspended
                </span>
                <button className="text-blue-600 text-[11px] font-bold flex items-center gap-1 hover:underline">
                  View Organizations <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Users by Role Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Users by Role</h3>
                <MoreHorizontal className="w-5 h-5 text-gray-300" />
              </div>
              <div className="text-5xl font-bold mb-2">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-gray-400 text-sm mb-6">Total active users</p>
              
              <div className="flex h-2 w-full rounded-full overflow-hidden mb-8">
                <div className="bg-blue-500 w-[68%] transition-all duration-500"></div>
                <div className="bg-yellow-400 w-[24%] transition-all duration-500"></div>
                <div className="bg-red-500 w-[8%] transition-all duration-500"></div>
              </div>

              <div className="flex justify-between">
                <div>
                  <div className="text-lg font-bold">{stats.roleDistribution.members}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-500 rounded-sm"></span> Members
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold">{stats.roleDistribution.managers}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-yellow-400 rounded-sm"></span> Managers
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold">{stats.roleDistribution.admins}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-red-500 rounded-sm"></span> Admins
                  </div>
                </div>
                <div className="flex items-end">
                   <button className="text-blue-600 text-[10px] font-bold flex items-center gap-1 hover:underline">
                    Manage Users <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Functional Recharts Area Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Organizations Growth</h3>
              <span className="text-xs text-gray-400 font-medium">Trend Analysis: Last 90 days</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#9CA3AF'}} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorActive)" 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="plainline" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Events Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recent Critical Events</h3>
              <MoreHorizontal className="w-5 h-5 text-gray-300" />
            </div>
            <div className="divide-y divide-gray-100">
              {events.map((event) => (
                <div key={event.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <div>
                    <h4 className="text-[14px] font-bold text-gray-700">{event.type}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Users: <span className="text-gray-500">{event.user}</span> Org: <span className="text-gray-500">{event.org}</span>
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">{event.time}</span>
                </div>
              ))}
            </div>
            <div className="p-4 text-center border-t border-gray-100">
              <button className="text-blue-600 text-[11px] font-bold hover:underline">View All Events →</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;