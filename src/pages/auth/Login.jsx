import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Fixed import
import API from "../../api/axios"; // Axios instance import karein

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error message state
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) return;

    setIsLoading(true);
    setError(""); // Purana error clear karein

    try {
      // 1. API Call to Backend
      const res = await API.post('/auth/login', {
        email: email,
        password: password
      });

      // 2. Token Save Karein
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const user = res.data.user;

      // 3. Dynamic Redirect Logic (Based on Backend Role)
      // Note: Backend se 'role' field aana chahiye
      if (user.role === "manager") {
        navigate("/manager/portfolio");
      } else if (user.role === "qa") {
        navigate("/qa/dashboard");
      } else if (user.role === "org_admin") {
        navigate("/org-admin/dashboard");
      } else if (user.role === "super_admin") {
        navigate("/super-admin/dashboard");
      } else {
        // Default: Agar verified hai to check karein workspace hai ya nahi
        // Filhal direct dashboard par bhej rahe hain
        navigate("/dev/dashboard");
      }

    } catch (err) {
      // Error handling (e.g., Invalid credentials, Not verified)
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      
      // Agar user verified nahi hai, to verify page par bhej dein
      if (msg.toLowerCase().includes("verify")) {
        navigate('/verify', { state: { email: email } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white shadow-2xl">
      <div className="flex flex-col w-[30%] h-fit border border-b-default rounded-2xl p-8 gap-8 items-center bg-white shadow-sm">
        
        <div className="w-full h-[120px] flex flex-col items-center justify-center gap-2 mt-4">
          <div className="bg-indigo-600 p-4 rounded-xl mb-2">
            <LogIn size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-default-text text-center">Welcome back to UCollyx</p>
          <p className="text-default-text text-gray-500">Sign in to your account</p>
        </div>

        {/* Error Message Alert */}
        {error && (
          <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        <form className="w-full flex flex-col gap-6" onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="w-full">
            <label className="block text-default-text text-sm font-bold mb-4">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-b-default p-4 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Enter Email Address"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-b-default p-4 pl-12 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Enter Password"
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
          
          <button 
            type="submit"
            className="rounded-lg bg-indigo-600 text-white p-4 w-full hover:bg-indigo-700 transition-colors hover:cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <hr className="border-b-default w-full"/>
        
        <div className="text-sm">
          <span>Don't have an account? </span>
          <span 
            onClick={() => navigate('/register')} 
            className="text-indigo-600 hover:text-indigo-800 hover:cursor-pointer font-semibold"
          >
            Create One
          </span>
        </div>
      </div>
    </div>
  );
}