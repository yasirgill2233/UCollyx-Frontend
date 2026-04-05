import React from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { 
  LayoutGrid, Folder, Bug, ClipboardList, Code2, 
  MessageSquare, Video, FolderCheck, ShieldAlert, 
  UserCog, BarChart3, Briefcase, Settings, Users,
  FolderClock, Building
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const { workspaceSlug } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  console.log("Console from Sidebar:",userRole, workspaceSlug)
  

  // 1. Define Groups for each Role
  const navGroups = {
    dev: [
      { icon: LayoutGrid, path: `/dev/dashboard`, label: 'Overview' },
      { icon: Folder, path: `/dev/my-projects`, label: 'Projects' },
      { icon: Bug, path: `/dev/issues`, label: 'Issues' },
      { icon: ClipboardList, path: `/dev/board`, label: 'Kanban' },
      { icon: Code2, path: `/dev/ide`, label: 'IDE' },
      { icon: MessageSquare, path: `/dev/chat`, label: 'Chat' },
      { icon: FolderClock, path: `/dev/projects-dir`, label: 'Directories' },
      { icon: Video, path: `/dev/meetings`, label: 'Meetings' },
    ],
    manager: [
      { icon: Briefcase, path: `/manager/portfolio`, label: 'Portfolio' },
      { icon: BarChart3, path: `/manager/activity`, label: 'Team Activity' },
      { icon: ClipboardList, path: `/manager/tasks`, label: 'Project Tasks' },
      // { icon: Folder, path: `/manager/details`, label: 'Project Details' },

      { icon: Code2, path: `/manager/ide`, label: 'IDE' },
      { icon: MessageSquare, path: `/manager/chat`, label: 'Chat' },
      { icon: FolderClock, path: `/manager/projects-dir`, label: 'Directories' },

      { icon: Video, path: `/manager/meetings`, label: 'Meetings' },
    ],
    qa: [
      { icon: LayoutGrid, path: `/qa/dashboard`, label: 'QA Dashboard' },
      { icon: ShieldAlert, path: `/qa/alerts`, label: 'Red Alerts' },
      { icon: Bug, path: `/qa/report-bug`, label: 'Report Bug' },
      { icon: FolderCheck, path: `/qa/verify-task`, label: 'Verification' },

      { icon: ClipboardList, path: `/qa/board`, label: 'Kanban' },
      { icon: MessageSquare, path: `/qa/chat`, label: 'Chat' },

      { icon: Video, path: `/qa/meetings`, label: 'Meetings' },
    ],
    orgadmin: [
      { icon: LayoutGrid, path: `/org-admin/dashboard`, label: 'Admin Panel' },
      { icon: Folder, path: `/org-admin/projects`, label: 'Projects' },
      { icon: Users, path: `/org-admin/users`, label: 'Users' },
      { icon: MessageSquare, path: `/org-admin/chat`, label: 'Chat' },
      { icon: Video, path: `/org-admin/meetings`, label: 'Meetings' },
    ],
    superadmin: [
      { icon: LayoutGrid, path: `/super-admin/dashboard`, label: 'Admin Panel' },
      { icon: Building, path: `/super-admin/orgs`, label: 'Organizations' },
      { icon: Users, path: `/super-admin/roles`, label: 'Members' },
    ]
  };

  // 2. Logic to detect current role from URL
  let currentNavItems = navGroups.dev; // Default

  // Behtar tareeqa: Direct userRole check karein
  if (userRole === 'manager') {
    currentNavItems = navGroups.manager;
  } else if (userRole === 'qa') {
    currentNavItems = navGroups.qa;
  } else if (userRole === 'org_admin') { // Make sure underscore is correct
    currentNavItems = navGroups.orgadmin;
  } else if (userRole === 'super_admin') {
    currentNavItems = navGroups.superadmin;
  } else if (userRole === 'dev'){
    currentNavItems = navGroups.dev;
  }

  if (!user) return null;

  return (
    <aside className="w-16 h-screen bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-2 sticky top-0">
      <div className="mb-6">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg transition-colors duration-500 ${
          path.startsWith('/manager') ? 'bg-amber-500 shadow-amber-100' :
          path.startsWith('/qa') ? 'bg-rose-500 shadow-rose-100' :
          path.startsWith('/super-admin') ? 'bg-slate-900 shadow-slate-100' : 'bg-blue-600 shadow-blue-100'
        }`}>
          {path.startsWith('/manager') ? 'M' : path.startsWith('/qa') ? 'Q' : path.startsWith('/super-admin') ? 'A' : 'D'}
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center w-full px-2">
        {currentNavItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              title={item.label}
              className={({ isActive }) => `
                p-3 rounded-xl transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={20} 
                    strokeWidth={isActive ? 2.2 : 2} 
                    className="group-hover:scale-110 transition-transform"
                  />
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;