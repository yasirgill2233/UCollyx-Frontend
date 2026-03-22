import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react'; // Using lucide-react for icons

const Header = () => {
  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8">
              <div className="relative w-1/2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search..." className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none" />
              </div>
              <div className="flex items-center gap-4">
                 <div className="relative cursor-pointer">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">3</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1d4ed8] text-white px-3 py-1.5 rounded-md cursor-pointer">
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-[10px] font-bold">YS</div>
                  <span className="text-[11px] font-semibold">Yasir Saleem</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </header>
  );
};

export default Header;