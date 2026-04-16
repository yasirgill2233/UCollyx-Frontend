import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, UserRoundPlus } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Fixed import
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Input Change Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      const audio = new Audio("/sounds/short_bongo.mp3");
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Sound blocked"));
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      // Backend route /auth/signup hai jo humne banaya tha
      const res = await API.post('/auth/register', {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });

      // alert("OTP sent to your email!");
      const audio = new Audio("/sounds/short_bongo.mp3");
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Sound blocked"));
      toast.success("OTP sent to your email!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      // Email verify-otp page par bhej rahe hain aur sath email bhi le ja rahe hain
      navigate('/verify', { state: { email: formData.email } });
    } catch (err) {
      const audio = new Audio("/sounds/short_bongo.mp3");
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Sound blocked"));
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#f0f2f5]">
      <div className="flex flex-col w-[30%] h-[83%] border border-b-default rounded-2xl shadow-2xl p-8 gap-3 items-center bg-white">
        
        {/* Progress Stepper */}
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
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              type="text" 
              className="rounded-lg border border-b-default p-3 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Enter your full name"
              required
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email" 
              className="rounded-lg border border-b-default p-3 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Enter Email Address"
              required
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"} 
              className="rounded-lg border border-b-default p-3 pl-12 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Create your strong password"
              required
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
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? "text" : "password"} 
              className="rounded-lg border border-b-default p-3 pl-12 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Re-enter your password"
              required
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

        <button 
          onClick={handleSignup} 
          disabled={loading}
          className="rounded-lg bg-indigo-600 text-white p-3 w-full hover:bg-indigo-700 transition-colors hover:cursor-pointer disabled:bg-gray-400"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        
        <hr className="border-b-default w-full mt-2"/>
        
        <div className="mt-2 text-sm">
          <span>Already have an account? </span>
          <span onClick={() => navigate('/')} className="text-indigo-600 font-semibold hover:text-indigo-700 hover:cursor-pointer"> Sign In</span>
        </div>
      </div>
    </div>
  );
}