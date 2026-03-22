import React from 'react';
import { NavLink } from 'react-router-dom'; // Navigation ke liye zaroori hai
import { 
  LayoutGrid, 
  Folder, 
  Bug, 
  ClipboardList, 
  Code2, 
  MessageSquare, 
  Video 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutGrid, path: '/dashboard', label: 'Overview' },
    { icon: Folder, path: '/my-projects', label: 'Projects' },
    { icon: Bug, path: '/issues', label: 'Issues' },
    { icon: ClipboardList, path: '/kanban-board', label: 'Kanban' },
    { icon: Code2, path: '/ide', label: 'IDE' },
    { icon: MessageSquare, path: '/dev-chat', label: 'Chat' },
    { icon: Video, path: '/meetings', label: 'Meetings' },
  ];

  return (
    <aside className="w-16 h-screen bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-2">
      {/* Logo or Home Icon at Top (Optional) */}
      <div className="mb-6 text-blue-600">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
          G
        </div>
      </div>

      {navItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={index}
            to={item.path}
            title={item.label} // Hover par naam dikhane ke liye
            className={({ isActive }) => `
              p-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-blue-50 text-blue-600' // Active state style
                : 'text-slate-400 hover:text-slate-600 hover:bg-gray-50' // Inactive state
              }
            `}
          >
            {({ isActive }) => (
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 2} 
                className="group-hover:scale-110 transition-transform"
              />
            )}
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;