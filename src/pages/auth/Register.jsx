import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, UserRoundPlus } from "lucide-react";
import { useNavigate } from "react-router";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen bg-white shadow-2xl">
      <div className="flex flex-col w-[30%] h-[83%] border border-b-default rounded-2xl p-8 gap-3 items-center bg-white">

        <div className="flex items-center w-full max-w-md mb-12 mt-4">
        
        <div className="flex items-center w-full">
          <div className="w-8 h-8 shrink-0 bg-indigo-600 border-2 border-indigo-600 rounded-full flex items-center justify-center text-white text-sm">1</div>
          <div className="flex-auto border-t-2 border-indigo-200"></div>
        </div>
       
        <div className="flex items-center w-full">
          <div className="w-8 h-8 shrink-0 bg-indigo-100 border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 text-sm">2</div>
          <div className="flex-auto border-t-2 border-indigo-200"></div>
        </div>
        
        <div className="w-8 h-8 shrink-0 bg-indigo-100 border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">3</div>
      </div>
        
        <div className="w-full h-[120px] flex flex-col items-center justify-center gap-2">
          <div className=" bg-indigo-600 p-4 rounded-xl mb-2"><UserRoundPlus size={20} className="text-white" /></div>
          <p className="text-2xl font-bold text-default-text">Create Your Account</p>
          <p className="text-default-text">Join UCollyx to collaborate with your team</p>
        </div>

        {/* Full Name Field */}
        <div className="w-full">
          <label className="block text-default-text text-sm font-bold mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={20} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="rounded-lg border border-b-default p-3 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Enter your full name"
            />
          </div>
        </div>

          {/* Email Field */}
        <div className="w-full">
          <label className="block text-default-text text-sm font-bold mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={20} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              className="rounded-lg border border-b-default p-3 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Enter Email Address"
            />
          </div>
        </div>
        
        {/* Password Field */}
        <div className="w-full">
          <label className="block text-default-text text-sm font-bold mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={20} className="text-gray-400" />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              className="rounded-lg border border-b-default p-3 pl-12 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Create your strong password"
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
        
         {/* Confirm Password Field */}
        <div className="w-full">
          <label className="block text-default-text text-sm font-bold mb-2">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={20} className="text-gray-400" />
            </div>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              className="rounded-lg border border-b-default p-3 pl-12 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Re-enter you password"
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 hover:cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        

        <button className="rounded-lg bg-primary-500 text-white p-3 w-full hover:bg-primary-700 transition-colors hover:cursor-pointer">Create Account</button>
        
        <hr className="border-b-default w-full"/>
        
        <div>
          <span>Already have an account? </span>
          <span onClick={()=>navigate('/')} className="text-primary-600 hover:text-primary-700 hover:cursor-pointer"> Sign In</span>
        </div>
      </div>
    </div>
  );
}

