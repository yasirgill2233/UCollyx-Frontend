// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { X, Maximize2, Minimize2 } from "lucide-react";
// import { useMediaRecorder } from "../../../../hooks/useMediaRecorder";
// import { finalizeMeetingApi } from "../../../../api/services/meetingService";

// const JitsiVideoCall = ({ isOpen, onClose, roomName, userName, activeChat, userEmail, currentMeetingId }) => {
//   const jitsiContainerRef = useRef(null);
//   const [apiInstance, setApiInstance] = useState(null);
//   const [isMinimized, setIsMinimized] = useState(false);

//   const { startRecording, stopRecording } = useMediaRecorder(async (blob) => {
//     await finalizeMeetingApi(blob, currentMeetingId);
// });

//     const handleClose = () => {
//     if (apiInstance) apiInstance.dispose();
//     setApiInstance(null);
//     onClose();
//   };

//   const secureRoomName = useMemo(() => {
//   const baseName = `UCollyx-${activeChat}-${roomName}`;
//   const hashedName = btoa(baseName).replace(/[=+/]/g, ''); 
  
//   return `UCollyx-${hashedName}`;
// }, [roomName, activeChat]);

//   useEffect(() => {
//     if (isOpen && window.JitsiMeetExternalAPI && !apiInstance) {
//       const domain = "meet.jit.si";
//       const options = {
//         roomName: secureRoomName,        
//         parentNode: jitsiContainerRef.current,
//         userInfo: { displayName: userName, email: userEmail },
//         configOverwrite: {
//           prejoinPageEnabled: false,
//           disableDeepLinking: true,
//           defaultBackgroundColor: "#0f172a",
//         },
//         interfaceConfigOverwrite: {
//           TOOLBAR_BUTTONS: [
//             "microphone", "camera", "chat", "raisehand", 
//             "videoquality", "tileview", "settings"
//           ],
//           SETTINGS_SECTIONS: ['devices', 'language', 'profile'],
//         },
//       };

//       const api = new window.JitsiMeetExternalAPI(domain, options);
//       setApiInstance(api);

//       api.on("readyToClose", () => {
//         handleClose();
//       });

//        if (apiInstance) {
//     apiInstance.on('videoConferenceJoined', () => {
//       startRecording();
//     });

//     apiInstance.on('videoConferenceLeft', () => {
//       stopRecording();
//       handleClose();
//     });
//   }

//       return () => {
//         if (api) api.dispose();
//       };
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className={`fixed z-[100] transition-all duration-500 ease-in-out ${
//       isMinimized 
//       ? "bottom-4 right-4 w-80 h-48 shadow-2xl overflow-hidden rounded-2xl border-2 border-indigo-500" 
//       : "inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
//     }`}>
//       <div className={`relative bg-slate-900 overflow-hidden shadow-2xl transition-all duration-500 ${
//         isMinimized ? "w-full h-full" : "w-full max-w-6xl h-[85vh] rounded-[32px] border border-slate-700/50"
//       }`}>
//         <div className="absolute top-4 right-6 z-[110] flex items-center gap-3">
//           <button 
//             onClick={() => setIsMinimized(!isMinimized)}
//             className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full backdrop-blur-md transition-colors"
//           >
//             {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
//           </button>
//           <button 
//             onClick={handleClose}
//             className="p-2 bg-rose-500/80 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-colors"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <div ref={jitsiContainerRef} className="w-full h-full" />
//       </div>
//     </div>
//   );
// };

// export default JitsiVideoCall;



import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { useMediaRecorder } from "../../../../hooks/useMediaRecorder";
import { finalizeMeetingApi } from "../../../../api/services/meetingService";

const JitsiVideoCall = ({ isOpen, onClose, roomName, userName, activeChat, userEmail, currentMeetingId }) => {
  const jitsiContainerRef = useRef(null);
  const [apiInstance, setApiInstance] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Ref to hold transcript lines across renders
  const transcriptRef = useRef([]);
  const recognitionRef = useRef(null);
  const isUnloadingRef = useRef(false);

  const { startRecording, stopRecording } = useMediaRecorder(async (blob) => {
    // Collect full transcript
    const fullTranscript = transcriptRef.current.join("\n");

    if (finalizeMeetingApi && currentMeetingId) {
      await finalizeMeetingApi(blob, currentMeetingId, fullTranscript);
    }
  });

  // Start Speech Recognition in background
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("⚠️ Web Speech API is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false; // Sirf final sentences pick karein
      recognition.lang = "en-US"; // English (ya 'ur-PK' for Urdu)

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const text = event.results[i][0].transcript.trim();
            const time = new Date().toLocaleTimeString();
            const logEntry = `[${time}] ${userName}: ${text}`;
            
            transcriptRef.current.push(logEntry);
            console.log("🎤 Live Transcript Line:", logEntry);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech Recognition Error:", event.error);
      };

      // Restart automatically if interrupted during active meeting
      recognition.onend = () => {
        if (apiInstance && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            /* ignore if already active */
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      console.log("🎙️ Speech Recognition Started Successfully!");
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  };

  // Stop Speech Recognition
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
      recognitionRef.current = null;
    }
  };

  // Helper function: Alert user with the captured transcript
  const triggerEndAlert = () => {
    stopSpeechRecognition();

    const capturedText = transcriptRef.current.length > 0 
      ? transcriptRef.current.join("\n")
      : "No speech detected or mic was muted during the meeting.";

    console.log("📝 [FINAL CAPTURED MEETING TRANSCRIPT]:\n", capturedText);
    alert(`✅ Meeting Ended!\n\n[Captured Meeting Transcript]:\n\n${capturedText}`);
  };

  // User click on X Button or explicit Close
  const handleManualClose = () => {
    triggerEndAlert();

    if (apiInstance) {
      try {
        apiInstance.dispose();
      } catch (err) {
        console.warn("Jitsi dispose warning:", err);
      }
    }
    setApiInstance(null);
    onClose();
  };

  const handleClose = () => {
    stopSpeechRecognition();
    if (apiInstance) {
      try {
        apiInstance.dispose();
      } catch (err) {
        console.warn("Jitsi dispose warning:", err);
      }
    }
    setApiInstance(null);
    onClose();
  };

  const secureRoomName = useMemo(() => {
    const baseName = `UCollyx-${activeChat}-${roomName}`;
    const hashedName = btoa(baseName).replace(/[=+/]/g, ''); 
    return `UCollyx-${hashedName}`;
  }, [roomName, activeChat]);

  // Window Unload Guard
  useEffect(() => {
    const handleBeforeUnload = () => {
      isUnloadingRef.current = true;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    let api = null;

    if (isOpen && window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
      // Reset transcript array on new call opening
      transcriptRef.current = [];

      const domain = "meet.jit.si";
      const options = {
        roomName: secureRoomName,        
        parentNode: jitsiContainerRef.current,
        userInfo: { displayName: userName, email: userEmail },
        configOverwrite: {
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          defaultBackgroundColor: "#0f172a",
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "chat", "raisehand", 
            "videoquality", "tileview", "settings"
          ],
          SETTINGS_SECTIONS: ['devices', 'language', 'profile'],
        },
      };

      api = new window.JitsiMeetExternalAPI(domain, options);
      setApiInstance(api);

      // 1. Join Event -> Recording & Live Speech-To-Text Starts
      api.addEventListener('videoConferenceJoined', () => {
        console.log("🟢 Jitsi Conference Joined! Starting media recorder & speech transcription...");
        if (typeof startRecording === 'function') startRecording();
        startSpeechRecognition();
      });

      // 2. Leave Event
      api.addEventListener('videoConferenceLeft', () => {
        console.log("🔴 Jitsi Conference Left!");
        
        if (typeof stopRecording === 'function') stopRecording();

        if (!isUnloadingRef.current) {
          triggerEndAlert();
        }
        
        handleClose();
      });

      // 3. Ready to Close Event
      api.addEventListener("readyToClose", () => {
        handleClose();
      });
    }

    return () => {
      stopSpeechRecognition();
      if (api) {
        api.dispose();
      }
    };
  }, [isOpen, secureRoomName]);

  if (!isOpen) return null;

  return (
    <div className={`fixed z-[100] transition-all duration-500 ease-in-out ${
      isMinimized 
      ? "bottom-4 right-4 w-80 h-48 shadow-2xl overflow-hidden rounded-2xl border-2 border-indigo-500" 
      : "inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    }`}>
      <div className={`relative bg-slate-900 overflow-hidden shadow-2xl transition-all duration-500 ${
        isMinimized ? "w-full h-full" : "w-full max-w-6xl h-[85vh] rounded-[32px] border border-slate-700/50"
      }`}>
        <div className="absolute top-4 right-6 z-[110] flex items-center gap-3">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full backdrop-blur-md transition-colors"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>

          {/* MANUAL CLOSE BUTTON */}
          <button 
            onClick={handleManualClose}
            className="p-2 bg-rose-500/80 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-colors"
            title="End / Close Call"
          >
            <X size={18} />
          </button>
        </div>

        <div ref={jitsiContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default JitsiVideoCall;