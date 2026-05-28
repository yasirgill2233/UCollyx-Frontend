// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom"; // Email receive karne ke liye
// import API from "../../api/axios";
// import toast from "react-hot-toast";
// import { triggerToast } from "../../utils/toastHelper";
// import { useResendOtpMutation, useVerifyOtpMutation } from "../../hooks/useAuth";

// export default function Verify() {
//   // const navigate = useNavigate();
//   // const location = useLocation();

//   // // Register screen se email uthayein (agar user direct is page par aaye to fallback)
//   // const email = location.state?.email || "user@example.com";

//   // const inputRefs = useRef([]);
//   // const [otp, setOtp] = useState(new Array(6).fill("")); // OTP digits store karne ke liye
//   // const [timeLeft, setTimeLeft] = useState(44);
//   // const [isTimerActive, setIsTimerActive] = useState(true);
//   // const [loading, setLoading] = useState(false);

//   // // Timer Logic
//   // useEffect(() => {
//   //   let timer;
//   //   if (isTimerActive && timeLeft > 0) {
//   //     timer = setInterval(() => {
//   //       setTimeLeft((prev) => prev - 1);
//   //     }, 1000);
//   //   } else if (timeLeft === 0) {
//   //     setIsTimerActive(false);
//   //     clearInterval(timer);
//   //   }
//   //   return () => clearInterval(timer);
//   // }, [timeLeft, isTimerActive]);

//   // const handleResend = async () => {
//   //   setLoading(true);
//   //   try {

//   //     await API.post("/auth/resend-otp", { email: email });

//   //     setOtp(new Array(6).fill(""));

//   //     setTimeLeft(44);
//   //     setIsTimerActive(true);

//   //     if (inputRefs.current[0]) {
//   //       inputRefs.current[0].focus();
//   //     }
//   //     triggerToast("A new 6-digit code has been sent to your inbox.", "success");

//   //   } catch (err) {
//   //     triggerToast("Failed to resend OTP. Please try again.","error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const handleChange = (e, index) => {
//   //   const value = e.target.value;
//   //   if (isNaN(value)) return; // Sirf numbers allow karein

//   //   const newOtp = [...otp];
//   //   newOtp[index] = value.substring(value.length - 1);
//   //   setOtp(newOtp);

//   //   // Auto-focus to next input
//   //   if (value && index < 5) {
//   //     inputRefs.current[index + 1].focus();
//   //   }
//   // };

//   // const handleKeyDown = (e, index) => {
//   //   if (e.key === "Backspace" && !otp[index] && index > 0) {
//   //     inputRefs.current[index - 1].focus();
//   //   }
//   // };

//   // // Main Verify Logic
//   // const handleVerify = async () => {
//   //   const fullOtp = otp.join("");
//   //   if (fullOtp.length < 6) {
//   //     return triggerToast("Please enter all 6 digits.", "error");
//   //   }

//   //   setLoading(true);
//   //   try {
//   //     const res = await API.post("/auth/verify-otp", {
//   //       email: email,
//   //       code: fullOtp,
//   //     });

//   //     triggerToast("Email verified successfully! Please login.", "success");
//   //     navigate("/"); // Login page par bhej dein
//   //   } catch (err) {
//   //     triggerToast(err.response?.data?.message || "Invalid OTP","error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email || "user@example.com";

//   // React Query Mutations
//   const verifyMutation = useVerifyOtpMutation();
//   const resendMutation = useResendOtpMutation();

//   // UI States
//   const inputRefs = useRef([]);
//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const [timeLeft, setTimeLeft] = useState(44);
//   const [isTimerActive, setIsTimerActive] = useState(true);

//   // Timer Logic (Same as before)
//   useEffect(() => {
//     let timer;
//     if (isTimerActive && timeLeft > 0) {
//       timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
//     } else if (timeLeft === 0) {
//       setIsTimerActive(false);
//       clearInterval(timer);
//     }
//     return () => clearInterval(timer);
//   }, [timeLeft, isTimerActive]);

//   // Resend OTP Handler
//   const handleResend = () => {
//     resendMutation.mutate(email, {
//       onSuccess: () => {
//         setOtp(new Array(6).fill(""));
//         setTimeLeft(44);
//         setIsTimerActive(true);
//         if (inputRefs.current[0]) inputRefs.current[0].focus();
//         triggerToast("A new 6-digit code has been sent to your inbox.", "success");
//       },
//       onError: () => {
//         triggerToast("Failed to resend OTP. Please try again.", "error");
//       }
//     });
//   };

//   // Verify OTP Handler
//   const handleVerify = () => {
//     const fullOtp = otp.join("");
//     if (fullOtp.length < 6) {
//       return triggerToast("Please enter all 6 digits.", "error");
//     }

//     verifyMutation.mutate({ email, code: fullOtp }, {
//       onSuccess: () => {
//         triggerToast("Email verified successfully! Please login.", "success");
//         navigate("/");
//       },
//       onError: (err) => {
//         triggerToast(err.response?.data?.message || "Invalid OTP", "error");
//       }
//     });
//   };

//   const handleChange = (e, index) => {
//     const value = e.target.value;
//     // Sirf digits allow karein (No alphabets)
//     if (!/^\d*$/.test(value)) return; 

//     const newOtp = [...otp];
//     // Sirf last entered digit uthayen
//     newOtp[index] = value.substring(value.length - 1);
//     setOtp(newOtp);

//     // Auto-focus to next input agar value enter ho gae ha
//     if (value && index < 5) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     // Backspace dabane par pichle input par wapis jane ki logic
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   // Input handlers (handleChange, handleKeyDown) same hi rahen ge...

//   // UI States for loading
//   const isLoading = verifyMutation.isPending || resendMutation.isPending;

//   return (
//     <div className="flex justify-center items-center h-screen bg-[#f0f2f5]">
//       <div className="flex flex-col w-[30%] h-[65%] border border-b-default rounded-2xl shadow-2xl p-8 gap-12 items-center bg-white">
//         {/* Stepper */}
//         <div className="flex items-center w-full max-w-md mb-12 mt-4">
//           <div className="flex items-center w-full">
//             <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">
//               ✓
//             </div>
//             <div className="flex-auto border-t-2 border-indigo-600"></div>
//           </div>
//           <div className="flex items-center w-full">
//             <div className="w-8 h-8 shrink-0 bg-indigo-600 border-2 border-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
//               2
//             </div>
//             <div className="flex-auto border-t-2 border-indigo-200"></div>
//           </div>
//           <div className="w-8 h-8 shrink-0 bg-indigo-100 border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
//             3
//           </div>
//         </div>

//         <div className="w-full h-[120px] flex flex-col items-center justify-center gap-2">
//           <div className="text-4xl font-bold text-default-text bg-indigo-600 p-4 rounded-xl text-white text-[22px] mb-2 flex items-center justify-center w-12 h-12">
//             W
//           </div>
//           <p className="text-2xl font-bold text-default-text">
//             Check Your Inbox
//           </p>
//           <p className="text-default-text">
//             We've sent a 6 digit verification code to
//           </p>
//           <p className="text-lg font-semibold text-indigo-600">{email}</p>
//         </div>

//         {/* OTP Inputs */}
//         <div className="flex gap-4">
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               type="text"
//               inputMode="numeric"
//               maxLength="1"
//               value={digit}
//               className="border border-gray-300 h-16 w-16 rounded-lg text-center text-2xl font-bold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
//               ref={(el) => (inputRefs.current[index] = el)}
//               onChange={(e) => handleChange(e, index)}
//               onKeyDown={(e) => handleKeyDown(e, index)}
//             />
//           ))}
//         </div>

//         {/* Action Button */}
//         <button
//           onClick={handleVerify}
//           disabled={isLoading || otp.join("").length < 6}
//           className={`rounded-lg text-white p-4 w-full transition-colors font-bold ${
//             isLoading || otp.join("").length < 6
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
//           }`}
//         >
//           {isLoading ? "Verifying..." : "Verify & Continue"}
//         </button>

//         <div className="text-sm">
//           <span>Didn't receive it? </span>
//           {timeLeft > 0 ? (
//             <span className="text-gray-500 italic">
//               Resend in <b className="text-indigo-600">{timeLeft}s</b>
//             </span>
//           ) : (
//             <span
//               className="text-indigo-600 font-bold hover:underline cursor-pointer"
//               onClick={handleResend}
//             >
//               Resend Code
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LockKeyhole, Loader2, RefreshCw } from "lucide-react"; // Match with modern lucide icons
import toast from "react-hot-toast";
import { triggerToast } from "../../utils/toastHelper";
import { useResendOtpMutation, useVerifyOtpMutation } from "../../hooks/useAuth";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "user@example.com";

  // React Query Mutations
  const verifyMutation = useVerifyOtpMutation();
  const resendMutation = useResendOtpMutation();

  // UI States
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(44);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Timer Logic
  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  // Resend OTP Handler
  const handleResend = () => {
    if (resendMutation.isPending) return;
    resendMutation.mutate(email, {
      onSuccess: () => {
        setOtp(new Array(6).fill(""));
        setTimeLeft(44);
        setIsTimerActive(true);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
        triggerToast("A new 6-digit code has been sent to your inbox.", "success");
      },
      onError: () => {
        triggerToast("Failed to resend OTP. Please try again.", "error");
      }
    });
  };

  // Verify OTP Handler
  const handleVerify = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      return triggerToast("Please enter all 6 digits.", "error");
    }

    verifyMutation.mutate({ email, code: fullOtp }, {
      onSuccess: () => {
        triggerToast("Email verified successfully! Please login.", "success");
        navigate("/");
      },
      onError: (err) => {
        triggerToast(err.response?.data?.message || "Invalid OTP", "error");
      }
    });
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const isLoading = verifyMutation.isPending || resendMutation.isPending;
  const error = verifyMutation.error?.response?.data?.message || resendMutation.error?.message;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f3f5fa] p-4 relative overflow-hidden font-sans">
      
      {/* 100% Same Dynamic Aura Background Colors as Login screen */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-gradient-to-tr from-[#3b59ff]/20 to-[#00f2fe]/30 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-bl from-[#9d4edd]/20 to-[#00f2fe]/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute top-[35%] left-[40%] w-[350px] h-[350px] bg-[#9d4edd]/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Glassmorphic Card Container */}
      <div className="flex flex-col w-full max-w-[480px] bg-white/70 backdrop-blur-2xl rounded-[32px] border border-white/60 shadow-[0_20px_50px_rgba(31,38,135,0.08)] p-10 gap-8 items-center z-10 relative">
        
        {/* Top Floating Logo Brand Indicator */}
        <div className="absolute top-8 left-10 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#3b59ff] to-[#00f2fe] flex items-center justify-center font-black text-white shadow-[0_2px_8px_rgba(59,89,255,0.3)] text-[10px]">
            U
          </div>
          <span className="text-sm font-black text-[#1e2238] tracking-wider">UCollyx</span>
        </div>

        {/* Header Section */}
        <div className="w-full flex flex-col items-center justify-center text-center gap-3 mt-6">
          {/* Neon Gradient Badge Wrapper for Lock Icon */}
          <div className="bg-gradient-to-tr from-[#3b59ff] to-[#8a2be2] p-4 rounded-2xl text-white shadow-[0_8px_24px_rgba(59,89,255,0.25)] mb-2 flex items-center justify-center w-14 h-14 transform hover:scale-105 transition-transform">
            <LockKeyhole size={26} strokeWidth={2.2} />
          </div>
          
          <h1 className="text-3xl font-black text-[#1a1d2f] tracking-tight">
            Check Your Inbox
          </h1>
          
          <div className="space-y-2 text-gray-500 text-sm font-medium max-w-[290px]">
            <p>We've sent a 6-digit verification code to your email</p>
            <p className="font-bold text-[#3b59ff] bg-[#3b59ff]/5 border border-[#3b59ff]/10 px-3 py-1 rounded-full inline-block text-xs">
              {email}
            </p>
          </div>
{/* 
          {error && (
            <p className="w-full mt-2 text-red-600 text-sm bg-red-50/80 px-4 py-2.5 rounded-xl border border-red-200 shadow-sm animate-shake">
              {error}
            </p>
          )} */}
        </div>

        {/* OTP Inputs with exact same shadow-inner and smooth focus rings */}
        <div className="flex gap-2 sm:gap-3 justify-center w-full my-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              className="w-12 h-14 sm:w-14 sm:h-16 bg-[#f8fafc]/90 border border-gray-200/80 rounded-xl text-center text-2xl font-black text-[#1e2238] focus:bg-white focus:border-[#3b59ff] focus:ring-4 focus:ring-[#3b59ff]/10 outline-none transition-all duration-300 shadow-inner"
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {/* Action Button matching UCollyx Primary Gradient CTA */}
        <button
          onClick={handleVerify}
          disabled={isLoading || otp.join("").length < 6}
          className="w-full relative overflow-hidden bg-gradient-to-r from-[#3b59ff] to-[#8a2be2] hover:opacity-95 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-[0_6px_20px_rgba(59,89,255,0.25)] disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin text-white" />
          ) : (
            <span>Verify & Continue</span>
          )}
        </button>

        {/* Footer Info & Resend Action */}
        <div className="text-xs text-gray-500 font-medium border-t border-gray-100/70 pt-6 w-full text-center flex flex-col items-center justify-center gap-2">
          <p>
            Didn't receive the authentication token?
          </p>
          {timeLeft > 0 ? (
            <span className="text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100 font-semibold inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"/>
              Resend in <b className="text-[#3b59ff] font-bold">{timeLeft}s</b>
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendMutation.isPending}
              className="text-[#3b59ff] font-extrabold hover:underline tracking-wide transition-all inline-flex items-center gap-1 cursor-pointer bg-none border-none outline-none"
            >
              {resendMutation.isPending ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : null}
              <span>Resend Code</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}