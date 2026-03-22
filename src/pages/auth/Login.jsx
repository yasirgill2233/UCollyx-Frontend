import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {

    // login logic (API call etc)

    navigate("/dashboard"); // redirect after login
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white shadow-2xl">
      <div className="flex flex-col w-[30%] h-[75%] border border-b-default rounded-2xl p-8 gap-8 items-center bg-white">
        
        <div className="w-full h-[120px] flex flex-col items-center justify-center gap-2 mt-12">
          <div className=" bg-indigo-600 p-4 rounded-xl mb-2"><LogIn size={20} className="text-white" /></div>
          <p className="text-2xl font-bold text-default-text">Welcome back to UCollyx</p>
          <p className="text-default-text">Sign in to your account</p>
        </div>

        {/* Email Field */}
        <div className="w-full">
          <label className="block text-default-text text-sm font-bold mb-4">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={20} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="rounded-lg border border-b-default p-4 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Enter Email Address"
            />
          </div>
        </div>
        
        {/* Password Field */}
        <div className="w-full">
          <label className="block text-default-text text-sm font-bold mb-4">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={20} className="text-gray-400" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              className="rounded-lg border border-b-default p-4 pl-12 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Enter Password"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 hover:cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <button className="rounded-lg bg-primary-500 text-white p-4 w-full hover:bg-primary-700 transition-colors hover:cursor-pointer" onClick={handleLogin}>Sign In</button>
        
        <hr className="border-b-default w-full"/>
        
        <div>
          <span>Dont have an account? </span>
          <span onClick={()=>navigate('/register')} className="text-primary-500 hover:text-primary-700 hover:cursor-pointer">Create One</span>
        </div>
      </div>
    </div>
  );
}

