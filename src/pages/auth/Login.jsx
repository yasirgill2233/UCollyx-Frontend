import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  Sparkles,
} from "lucide-react";
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

  const playWorkspaceSound = () => {
    const audio = new Audio("/sounds/enter.mp3");
    audio.volume = 0.9; // Isay 0.4 se zyada na rakhen taake user shock na ho
    audio.play().catch((err) => console.log("Playback blocked:", err));
  };

  // Helper function for post-login navigation logic
  // const handlePostLoginRedirect = async (user) => {
  //   try {
  //     const res = await API.get("/workspace/my-workspaces");
  //     const workspaces = res.data.workspaces || [];
  //     const count = res.data.count || 0;
  //     console.log("There", workspaces[0].role, res.data.count);

  //     const updatedUser = { ...user, role: workspaces[0].role };
  //     localStorage.setItem("user", JSON.stringify(updatedUser));

  //     console.log(updatedUser);

  //     playWorkspaceSound();

  //     if (count === 0) {
  //       navigate("/workspace-selection");
  //     } else if (count === 1) {
  //       // const ws = workspaces[0];
  //       // if (user.role == "dev") {
  //       //   navigate(`/dev/dashboard`);
  //       // } else if (user.role == "qa") {
  //       //   navigate(`/qa/dashboard`);
  //       // } else if (user.role == "manager") {
  //       //   navigate(`/manager/portfolio`);
  //       // } else if (user.role == "org_admin") {
  //       //   navigate(`/org-admin/dashboard`);
  //       if (workspaces[0].role == "dev") {
  //         navigate(`/dev/dashboard`);
  //       } else if (workspaces[0].role == "qa") {
  //         navigate(`/qa/dashboard`);
  //       } else if (workspaces[0].role == "manager") {
  //         navigate(`/manager/portfolio`);
  //       } else if (workspaces[0].role == "org_admin") {
  //         navigate(`/org-admin/dashboard`);
  //       } else {
  //         navigate(`/super-admin/dashboard`);
  //       }
  //     } else {
  //       navigate("/select-workspace", { state: { workspaces } });
  //     }
  //   } catch (err) {
  //     console.error("Redirect Error:", err);
  //     navigate("/login");
  //   }
  // };

  const handlePostLoginRedirect = async (user) => {
    if (user.role === "super_admin") {
      console.log("Super Admin identified, skipping workspace fetch.");
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/super-admin/dashboard");
      return;
    }
    try {
      const res = await API.get("/workspace/my-workspaces");
      const workspaces = res.data.workspaces || [];
      const count = res.data.count || 0;

      if (user.requestStatus === "pending") {
          navigate("/request-pending");
        } else if (user.requestStatus === "rejected") {
          navigate("/request-rejected");
        } else {
           if (count > 0 && workspaces.length > 0) {
        const userRole = workspaces[0].role;
        const updatedUser = { ...user, role: userRole };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        console.log("Found Role:", userRole);
        playWorkspaceSound();

        if (count === 1) {
          if (userRole === "dev") {
            navigate(`/dev/dashboard`);
          } else if (userRole === "qa") {
            navigate(`/qa/dashboard`);
          } else if (userRole === "manager") {
            navigate(`/manager/portfolio`);
          } else if (userRole === "org_admin") {
            navigate(`/org-admin/dashboard`);
          } else if (userRole === "member") {
            navigate(`/awaiting-role`);
          } else {
            navigate(`/super-admin/dashboard`);
          }
        } else {
          navigate("/select-workspace", { state: { workspaces } });
        }
      } else {
        console.log("No workspaces found");
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/workspace-selection");
      }
        }
     
    } catch (err) {
      console.error("Redirect Error:", err);
      navigate("/login");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });

      console.log("Check role:", res.data.user);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      handlePostLoginRedirect(res.data.user);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
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

      if (res.data.isNewUser) {
        navigate("/set-password");
      } else {
        await handlePostLoginRedirect(res.data.user);
      }
    } catch (err) {
      setError("Google Sign-In failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5] p-4">
      {/* Main Container: 2 Columns */}
      <div className="flex flex-row w-full max-w-[1000px] h-[650px] bg-white rounded-[40px] shadow-2xl overflow-hidden">
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Login</h1>
            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg border border-red-100">
                {error}
              </p>
            )}
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div>
              <label className="text-gray-400 text-xs mb-2 block font-medium">
                Username or email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f4f7fa] border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 text-xs font-medium">
                  Password
                </label>
                {/* <button type="button" className="text-blue-600 text-[10px] font-bold hover:underline">Forgot password?</button> */}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f4f7fa] border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="remember" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <label htmlFor="remember" className="text-gray-400 text-xs cursor-pointer">Remember me</label>
            </div> */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#3b59ff] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all mt-4 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Social / Footer */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {/* <div className="w-full flex justify-center scale-90">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                theme="outline"
                shape="pill"
              />
            </div> */}
            <p className="text-xs text-gray-400">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-600 font-bold cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>

        {/* Right Side: Illustration & Feature Text */}
        <div className="hidden md:flex w-1/2 bg-[#f4f7fa] flex-col items-center justify-center p-12 text-center">
          <div className="relative mb-8 transform hover:scale-105 transition-transform duration-500">
            {/* 3D Illustration Placeholder - Aap yahan apni SVG ya Image laga sakte hain */}
            <img
              //  src="https://cdni.iconscout.com/illustration/premium/thumb/business-project-progress-illustration-download-in-svg-png-gif-file-formats--task-analytics-chart-graph-growth-pack-charts-illustrations-4712061.png"
              src="../../../public/image.png"
              alt="Project Progress"
              className="w-[320px] "
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Unified Software <br /> Development Ecosystem
          </h2>
          {/* <p className="text-gray-400 text-sm leading-relaxed max-w-[300px]">
            Stop context switching. Manage your tasks, code, and team communication 
    within a single, powerful workspace designed for peak productivity.
          </p> */}

          {/* Slider Dots */}
          <div className="flex gap-2 mt-8">
            <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
            <div className="w-8 h-1.5 bg-blue-200 rounded-full"></div>
            <div className="w-8 h-1.5 bg-blue-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
