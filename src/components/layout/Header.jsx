import React, { useState } from "react";
import { Search, Bell, ChevronDown, LogOut, Key, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import ProfileModal from "./ProfileModal"; // Naya Profile Modal
import ChangePasswordModal from "./ChangePasswordModal"; // Naya Change Password Modal
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. User state initialized directly from localStorage fallback
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  console.log("Current User in Header:", currentUser.avatar_url);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await API.get("users/signed-out");
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      queryClient.clear();
      localStorage.clear();
      navigate("/sign-out");
    }
  };

  const updateUserInfo = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  if (!currentUser) return null;

  return (
    <>
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white relative">
        {/* Search Bar */}
        <div className="relative w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative cursor-pointer mr-2">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          {/* Profile Section with Dropdown Logic */}
          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all"
            >
              {/* Circular Avatar using first letters of Full Name */}
              <div className="rounded-full border border-blue-100 bg-blue-600 w-10 h-10 flex items-center justify-center text-white font-black text-xs shadow-sm uppercase overflow-hidden">
                {currentUser.avatar_url ? (
                  <img
                    src={import.meta.env.VITE_SERVER_URL + currentUser.avatar_url}
                    alt="Avatar"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                ) : currentUser.full_name ? (
                  currentUser.full_name[0]
                ) : (
                  "U"
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>

                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in duration-150">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium truncate">
                      {currentUser.email}
                    </p>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    >
                      <User size={16} className="text-slate-500" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsPasswordOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    >
                      <Key size={16} className="text-slate-500" />
                      <span>Change Password</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-50 mt-1 p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-bold"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onUpdate={updateUserInfo}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />
    </>
  );
};

export default Header;
