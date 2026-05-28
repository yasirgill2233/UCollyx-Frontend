// import React, { useState } from "react";
// import { Mail, Lock, Eye, EyeOff, User, UserRoundPlus } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // Fixed import
// import API from "../../api/axios";
// import toast from "react-hot-toast";
// import { triggerToast } from "../../utils/toastHelper";
// import { useRegisterMutation } from "../../hooks/useAuth";

// export default function Register() {
//   // const navigate = useNavigate();
  
//   // // State for form fields
//   // const [formData, setFormData] = useState({
//   //   full_name: "",
//   //   email: "",
//   //   password: "",
//   //   confirmPassword: ""
//   // });

//   // const [showPassword, setShowPassword] = useState(false);
//   // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   // const [loading, setLoading] = useState(false);

//   // // Input Change Handler
//   // const handleChange = (e) => {
//   //   setFormData({ ...formData, [e.target.name]: e.target.value });
//   // };

//   // // Signup Handler
//   // const handleSignup = async (e) => {
//   //   e.preventDefault();
    
//   //   // Basic Validation
//   //   if (formData.password !== formData.confirmPassword) {
//   //     return triggerToast("Passwords do not match","error");
//   //   }

//   //   setLoading(true);
//   //   try {

//   //     const res = await API.post('/auth/register', {
//   //       full_name: formData.full_name,
//   //       email: formData.email,
//   //       password: formData.password
//   //     });

//   //     triggerToast("OTP sent to your email!","success");
//   //     navigate('/verify', { state: { email: formData.email } });
//   //   } catch (err) {
//   //     const audio = new Audio("/sounds/short_bongo.mp3");
//   //     audio.volume = 0.5;
//   //     audio.play().catch((e) => console.log("Sound blocked"));
//   //     triggerToast(err.response?.data?.message || "Something went wrong","error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const navigate = useNavigate();
//   const registerMutation = useRegisterMutation();

//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const playErrorSound = () => {
//     const audio = new Audio("/sounds/short_bongo.mp3");
//     audio.volume = 0.5;
//     audio.play().catch(() => {});
//   };

//   const handleSignup = (e) => {
//     e.preventDefault();
    
//     if (formData.password !== formData.confirmPassword) {
//       return triggerToast("Passwords do not match", "error");
//     }

//     // Mutation call
//     registerMutation.mutate({
//       full_name: formData.full_name,
//       email: formData.email,
//       password: formData.password
//     }, {
//       onSuccess: () => {
//         triggerToast("OTP sent to your email!", "success");
//         navigate('/verify', { state: { email: formData.email } });
//       },
//       onError: (err) => {
//         playErrorSound();
//         const msg = err.response?.data?.message || "Something went wrong";
//         triggerToast(msg, "error");
//       }
//     });
//   };

//   // UI helpers
//   const isLoading = registerMutation.isPending;

//   return (

    
//     <div className="flex justify-center items-center h-screen bg-[#f0f2f5]">
//        <div className="w-60 absolute top-0 left-0">
//         <img src="/logo.png" alt="" className="" />
//       </div>
//       <div className="flex flex-col w-[30%] h-[73%] border border-b-default rounded-2xl shadow-2xl p-8 gap-5 items-center bg-white">
        
//         {/* Progress Stepper */}
//         {/* <div className="flex items-center w-full max-w-md mb-12 mt-4">
//           <div className="flex items-center w-full">
//             <div className="w-8 h-8 shrink-0 bg-indigo-600 border-2 border-indigo-600 rounded-full flex items-center justify-center text-white text-sm">1</div>
//             <div className="flex-auto border-t-2 border-indigo-200"></div>
//           </div>
//           <div className="flex items-center w-full">
//             <div className="w-8 h-8 shrink-0 bg-indigo-100 border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 text-sm">2</div>
//             <div className="flex-auto border-t-2 border-indigo-200"></div>
//           </div>
//           <div className="w-8 h-8 shrink-0 bg-indigo-100 border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">3</div>
//         </div> */}
        
//         <div className="w-full h-[120px] flex flex-col items-center justify-center gap-2">
//           {/* <div className=" bg-indigo-600 p-4 rounded-xl mb-2"><UserRoundPlus size={20} className="text-white" /></div> */}
//           <p className="text-2xl font-bold text-default-text">Create Your Account</p>
//           <p className="text-default-text">Join UCollyx to collaborate with your team</p>
//         </div>

//         {/* Full Name Field */}
//         <div className="w-full">
//           <label className="block text-default-text text-sm font-bold mb-2">Full Name</label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <User size={20} className="text-gray-400" />
//             </div>
//             <input 
//               name="full_name"
//               value={formData.full_name}
//               onChange={handleChange}
//               type="text" 
//               className="rounded-lg border border-b-default p-3 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
//               placeholder="Enter your full name"
//               required
//             />
//           </div>
//         </div>

//         {/* Email Field */}
//         <div className="w-full">
//           <label className="block text-default-text text-sm font-bold mb-2">Email Address</label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <Mail size={20} className="text-gray-400" />
//             </div>
//             <input 
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               type="email" 
//               className="rounded-lg border border-b-default p-3 pl-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
//               placeholder="Enter Email Address"
//               required
//             />
//           </div>
//         </div>
        
//         {/* Password Field */}
//         <div className="w-full">
//           <label className="block text-default-text text-sm font-bold mb-2">Password</label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <Lock size={20} className="text-gray-400" />
//             </div>
//             <input 
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               type={showPassword ? "text" : "password"} 
//               className="rounded-lg border border-b-default p-3 pl-12 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
//               placeholder="Create your strong password"
//               required
//             />
//             <button 
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 hover:cursor-pointer"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>
//         </div>
        
//         {/* Confirm Password Field */}
//         <div className="w-full">
//           <label className="block text-default-text text-sm font-bold mb-2">Confirm Password</label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <Lock size={20} className="text-gray-400" />
//             </div>
//             <input 
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               type={showConfirmPassword ? "text" : "password"} 
//               className="rounded-lg border border-b-default p-3 pl-12 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
//               placeholder="Re-enter your password"
//               required
//             />
//             <button 
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 hover:cursor-pointer"
//             >
//               {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>
//         </div>

//         <button 
//           onClick={handleSignup} 
//           disabled={isLoading}
//           className="rounded-lg bg-indigo-600 text-white p-3 w-full hover:bg-indigo-700 transition-colors hover:cursor-pointer disabled:bg-gray-400"
//         >
//           {isLoading ? "Creating Account..." : "Create Account"}
//         </button>
        
//         <hr className="border-b-default w-full mt-2"/>
        
//         <div className="mt-2 text-sm">
//           <span>Already have an account? </span>
//           <span onClick={() => navigate('/')} className="text-indigo-600 font-semibold hover:text-indigo-700 hover:cursor-pointer"> Sign In</span>
//         </div>
//       </div>
//     </div>
//   );
// }












































import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, UserRoundPlus, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { triggerToast } from "../../utils/toastHelper";
import { useRegisterMutation } from "../../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const playErrorSound = () => {
    const audio = new Audio("/sounds/short_bongo.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return triggerToast("Passwords do not match", "error");
    }

    // Mutation call
    registerMutation.mutate({
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password
    }, {
      onSuccess: () => {
        triggerToast("OTP sent to your email!", "success");
        navigate('/verify', { state: { email: formData.email } });
      },
      onError: (err) => {
        playErrorSound();
        const msg = err.response?.data?.message || "Something went wrong";
        triggerToast(msg, "error");
      }
    });
  };

  // UI helpers
  const isLoading = registerMutation.isPending;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f3f5fa] p-4 relative overflow-hidden font-sans">
      
      {/* Dynamic Aura Background Colors (Image pattern layout compatibility) */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-gradient-to-tr from-[#3b59ff]/20 to-[#00f2fe]/30 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-bl from-[#9d4edd]/20 to-[#00f2fe]/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute top-[35%] left-[40%] w-[350px] h-[350px] bg-[#9d4edd]/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Container: Light Mode Translucent Glassmorphism */}
      <div className="flex flex-row w-full max-w-[1050px] h-[720px] bg-white/70 backdrop-blur-2xl rounded-[32px] border border-white/60 shadow-[0_20px_50px_rgba(31,38,135,0.08)] overflow-hidden z-10">
        
        {/* Left Side: Register Form Panel */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative bg-white/40 overflow-y-auto custom-scrollbar">
          
          {/* Logo Brand Title */}
          <div className="absolute top-8 left-12 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3b59ff] to-[#00f2fe] flex items-center justify-center font-black text-white shadow-[0_4px_12px_rgba(59,89,255,0.3)] text-sm">
              U
            </div>
            <span className="text-xl font-black text-[#1e2238] tracking-wider">UCollyx</span>
          </div>

          <div className="mb-6 mt-10">
            <h1 className="text-3xl font-black text-[#1a1d2f] tracking-tight mb-1.5 flex items-center gap-2">
              Create Account <Sparkles size={22} className="text-[#3b59ff]" />
            </h1>
            <p className="text-gray-500 text-xs font-medium">Join UCollyx to collaborate with your team</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSignup}>
            {/* Full Name */}
            <div>
              <label className="text-[#565d7a] text-[11px] mb-1.5 block font-bold uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative group">
                <input
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc]/90 border border-gray-200/80 rounded-xl p-3 pl-11 text-sm text-[#1e2238] placeholder-gray-400 focus:bg-white focus:border-[#3b59ff] focus:ring-4 focus:ring-[#3b59ff]/10 outline-none transition-all duration-300 shadow-inner"
                  placeholder="John Doe"
                  required
                />
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3b59ff] transition-colors" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-[#565d7a] text-[11px] mb-1.5 block font-bold uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc]/90 border border-gray-200/80 rounded-xl p-3 pl-11 text-sm text-[#1e2238] placeholder-gray-400 focus:bg-white focus:border-[#3b59ff] focus:ring-4 focus:ring-[#3b59ff]/10 outline-none transition-all duration-300 shadow-inner"
                  placeholder="name@company.com"
                  required
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3b59ff] transition-colors" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[#565d7a] text-[11px] mb-1.5 block font-bold uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc]/90 border border-gray-200/80 rounded-xl p-3 pl-11 pr-11 text-sm text-[#1e2238] placeholder-gray-400 focus:bg-white focus:border-[#9d4edd] focus:ring-4 focus:ring-[#9d4edd]/10 outline-none transition-all duration-300 shadow-inner"
                  placeholder="••••••••••••"
                  required
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#9d4edd] transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[#565d7a] text-[11px] mb-1.5 block font-bold uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc]/90 border border-gray-200/80 rounded-xl p-3 pl-11 pr-11 text-sm text-[#1e2238] placeholder-gray-400 focus:bg-white focus:border-[#9d4edd] focus:ring-4 focus:ring-[#9d4edd]/10 outline-none transition-all duration-300 shadow-inner"
                  placeholder="••••••••••••"
                  required
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#9d4edd] transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-[#3b59ff] to-[#8a2be2] hover:opacity-95 text-white font-bold py-3.5 rounded-xl transition-all duration-300 mt-2 flex justify-center items-center gap-2 shadow-[0_6px_20px_rgba(59,89,255,0.25)] active:scale-[0.99]"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (
                <>
                  <UserRoundPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation Link */}
          <div className="mt-6 flex flex-col items-center">
            <p className="text-xs text-gray-500 font-medium">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-[#3b59ff] font-extrabold cursor-pointer hover:underline tracking-wide transition-all"
              >
                Sign In
              </span>
            </p>
          </div>
        </div>

        {/* Right Side: Showcase Side-Panel Matching Layout Consistency */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-b from-[#f8fafc]/90 to-[#edf2f7]/90 border-l border-gray-100 flex-col items-center justify-center p-12 text-center relative">
          
          {/* Light Grid Lines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:30px_30px] opacity-100 pointer-events-none" />
          
          <div className="relative mb-6 transform hover:scale-[1.02] transition-transform duration-700">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00f2fe]/30 to-[#3b59ff]/10 rounded-full blur-3xl opacity-70" />
            
            {/* Login screen aur register screen me symmetry barqarar rakhne ke liye common presentation asset image stack layout hook kiya hai */}
            <img
              src="/image.png"
              alt="UCollyx Ecosystem"
              className="w-[340px] relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
            />
          </div>

          <h2 className="text-2xl font-black text-[#1a1d2f] mb-3 z-10 leading-snug">
            Your Digital Second Brain <br /> For Software Engineering
          </h2>
          <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-[280px] z-10">
            Unifying multi-user IDE environments, automated tracking, context-switching optimization, and continuous delivery pipelines.
          </p>

          {/* Carousel Slider Active States Indicator */}
          <div className="flex gap-2.5 mt-8 z-10">
            <div className="w-2 h-1.5 bg-gray-300 rounded-full"></div>
            <div className="w-6 h-1.5 bg-[#3b59ff] rounded-full shadow-[0_2px_8px_rgba(59,89,255,0.4)]"></div>
            <div className="w-2 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
        </div>

      </div>
    </div>
  );
}