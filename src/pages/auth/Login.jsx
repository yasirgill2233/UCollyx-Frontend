import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../../api/axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Helper function for post-login navigation logic
  const handlePostLoginRedirect = async (userData) => {
    try {
      // Backend service/controller se workspaces mangwaein
      const res = await API.get("/workspaces/my-workspaces");
      const workspaces = res.data.data;

      if (workspaces.length === 0) {
        // Agar koi workspace nahi hai, to selection screen (Create/Join) par bhejein
        navigate("/workspace-selection");
      } else if (workspaces.length === 1) {
        // Agar ek hi hai, to direct uske dashboard par
        // navigate(`/${workspaces[0].slug}/dashboard`);
        navigate("/workspace-selection"); // temporary
      } else {
        // Agar multiple hain, to selection screen par list dikhane ke liye bhejein
        navigate("/workspace-selection");
      }
    } catch (err) {
      // Agar workspace fetch fail ho jaye (rare case), default route par bhejein
      navigate("/workspace-selection");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Ab role-based redirect ke bajaye workspace-based redirect karein
      await handlePostLoginRedirect(res.data.user);
      
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);

      if (msg.toLowerCase().includes("verify")) {
        navigate("/verify", { state: { email: email } });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setIsLoading(true);
    try {
      const res = await API.post("/auth/google", {
        idToken: response.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Google login ke baad bhi workspace check karein
      await handlePostLoginRedirect(res.data.user);
    } catch (err) {
      setError("Google Sign-In failed!");
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
          <p className="text-2xl font-bold text-default-text text-center">
            Welcome back to UCollyx
          </p>
          <p className="text-default-text text-gray-500">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 text-center">
            {error}
          </div>
        )}

        <form className="w-full flex flex-col gap-6" onSubmit={handleLogin}>
          <div className="w-full">
            <label className="block text-default-text text-sm font-bold mb-4">
              Email Address
            </label>
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
            
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-default-text text-sm font-bold mb-4">
              Password
            </label>
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
            className="rounded-lg bg-indigo-600 text-white p-4 w-full hover:bg-indigo-700 transition-colors hover:cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50 font-bold"
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

        <div className="text-sm w-full flex flex-col justify-center items-center gap-6">
          <div className="w-full flex flex-col items-center gap-4">
            <div className="flex items-center w-full gap-2">
              <hr className="flex-grow border-gray-300" />
              <span className="text-gray-400 text-xs">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                theme="outline"
                size="large"
                width="380px"
              />
            </div>
          </div>

          <div>
            <span>Don't have an account? </span>
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-600 hover:text-indigo-800 hover:cursor-pointer font-semibold"
            >
              Create One
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}