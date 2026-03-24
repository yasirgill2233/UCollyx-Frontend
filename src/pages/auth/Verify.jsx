import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Email receive karne ke liye
import API from "../../api/axios";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Register screen se email uthayein (agar user direct is page par aaye to fallback)
  const email = location.state?.email || "user@example.com";

  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill("")); // OTP digits store karne ke liye
  const [timeLeft, setTimeLeft] = useState(44);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Timer Logic
  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  const handleResend = async () => {
    try {
      // Yahan aap resend-otp wali API hit kar sakte hain agar banayi ho
      // Filhal sirf timer reset kar rahe hain
      setTimeLeft(44);
      setIsTimerActive(true);
      alert("A new OTP has been sent to your email.");
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Sirf numbers allow karein

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Main Verify Logic
  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      return alert("Please enter all 6 digits.");
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/verify-otp', {
        email: email,
        code: fullOtp
      });

      alert("Email verified successfully! Please login.");
      navigate('/'); // Login page par bhej dein
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white shadow-2xl">
      <div className="flex flex-col w-[30%] h-[65%] border border-b-default rounded-2xl p-8 gap-12 items-center bg-white">

        {/* Stepper */}
        <div className="flex items-center w-full max-w-md mb-12 mt-4">
          <div className="flex items-center w-full">
            <div className="w-8 h-8 shrink-0 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
            <div className="flex-auto border-t-2 border-indigo-600"></div>
          </div>
          <div className="flex items-center w-full">
            <div className="w-8 h-8 shrink-0 bg-indigo-600 border-2 border-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            <div className="flex-auto border-t-2 border-indigo-200"></div>
          </div>
          <div className="w-8 h-8 shrink-0 bg-indigo-100 border-2 border-indigo-600 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">3</div>
        </div>
        
        <div className="w-full h-[120px] flex flex-col items-center justify-center gap-2">
          <div className="text-4xl font-bold text-default-text bg-indigo-600 p-4 rounded-xl text-white text-[22px] mb-2 flex items-center justify-center w-12 h-12">W</div>
          <p className="text-2xl font-bold text-default-text">Check Your Inbox</p>
          <p className="text-default-text">We've sent a 6 digit verification code to</p>
          <p className="text-lg font-semibold text-indigo-600">{email}</p>
        </div>

        {/* OTP Inputs */}
        <div className="flex gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                className="border border-gray-300 h-16 w-16 rounded-lg text-center text-2xl font-bold focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleVerify}
          disabled={loading || otp.join("").length < 6}
          className={`rounded-lg text-white p-4 w-full transition-colors font-bold ${
            loading || otp.join("").length < 6 ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
          }`}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
    
        <div className="text-sm">
          <span>Didn't receive it? </span>
          {timeLeft > 0 ? (
            <span className="text-gray-500 italic">Resend in <b className="text-indigo-600">{timeLeft}s</b></span>
          ) : (
            <span 
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
              onClick={handleResend}
            >
              Resend Code
            </span>
          )}
        </div>
      </div>
    </div>
  );
}