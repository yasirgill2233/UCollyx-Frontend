import React, { useRef, useState, useEffect } from "react";

export default function Verify() {

  // 1. Initialize useRef with an empty array properly
  const inputRefs = useRef([]);

  // 1. Timer state (seconds mein)
  const [timeLeft, setTimeLeft] = useState(44);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // 2. Timer Logic
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
    return () => clearInterval(timer); // Cleanup on unmount
  }, [timeLeft, isTimerActive]);

  const handleResend = () => {
    // Resend code logic yahan ayegi
    setTimeLeft(44); // Timer reset karein
    setIsTimerActive(true);
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    // Agar number enter hua hai aur agla box maujood hai
    if (value.length === 1 && index < 5) {
      // Check if the next ref exists before focusing
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace logic: move to previous box
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white shadow-2xl">
      <div className="flex flex-col w-[30%] h-[65%] border border-b-default rounded-2xl p-8 gap-12 items-center bg-white">

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
          <div className="text-4xl font-bold text-default-text bg-indigo-600 p-4 rounded-xl text-white text-[22px] mb-2">W</div>
          <p className="text-2xl font-bold text-default-text">Check Your Inbox</p>
          <p className="text-default-text">We've sent a 6 digit verification code to</p>
          <p className="text-lg font-semibold text-default-text">user@example.com</p>
        </div>

        <div className="flex gap-4">
            {[0, 1, 2, 3, 4, 5].map((_, index) => (
              <input
                key={index}
                type="tel"
                pattern="[0-9]*"
                maxLength="1"
                className="border border-b-default h-16 w-16 rounded-lg text-center text-2xl font-bold focus:border-indigo-600 outline-none"
                // 2. Ref ko function ke zariye assign karein taake render error na aaye
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onInput={(e) => (e.target.value = e.target.value.slice(0, 1))}
              />
            ))}
        </div>

        {timeLeft > 0 ? (
          <button className="rounded-lg bg-primary-500 text-white p-4 w-full hover:bg-primary-700 transition-colors hover:cursor-pointer">Verify & Continue</button>
        ) : (
          <button className="rounded-lg bg-emerald-500 text-white p-4 w-full hover:bg-emerald-700 transition-colors hover:cursor-pointer"
          onClick={handleResend}>
            Resend Code
          </button>
        )}
    
        <div>
          <span>Didn't recieve it?  Resend in </span>
          {timeLeft > 0 ? (
            <span className="text-primary-700 font-bold hover:text-primary-700 hover:cursor-pointer">{timeLeft}s</span>
          ) : (
            <span 
              className="text-primary-700 font-bold hover:text-primary-700 hover:cursor-pointer"
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

