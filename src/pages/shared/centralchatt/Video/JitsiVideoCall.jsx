import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { useMediaRecorder } from "../../../../hooks/useMediaRecorder";
import { finalizeMeetingApi } from "../../../../api/services/meetingService";

const JitsiVideoCall = ({ isOpen, onClose, roomName, userName, activeChat, userEmail, currentMeetingId }) => {
  const jitsiContainerRef = useRef(null);
  const [apiInstance, setApiInstance] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const { startRecording, stopRecording } = useMediaRecorder(async (blob) => {
    await finalizeMeetingApi(blob, currentMeetingId);
});

    const handleClose = () => {
    if (apiInstance) apiInstance.dispose();
    setApiInstance(null);
    onClose();
  };

  const secureRoomName = useMemo(() => {
  const baseName = `UCollyx-${activeChat}-${roomName}`;
  const hashedName = btoa(baseName).replace(/[=+/]/g, ''); 
  
  return `UCollyx-${hashedName}`;
}, [roomName, activeChat]);

  useEffect(() => {
    if (isOpen && window.JitsiMeetExternalAPI && !apiInstance) {
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

      const api = new window.JitsiMeetExternalAPI(domain, options);
      setApiInstance(api);

      api.on("readyToClose", () => {
        handleClose();
      });

       if (apiInstance) {
    apiInstance.on('videoConferenceJoined', () => {
      startRecording();
    });

    apiInstance.on('videoConferenceLeft', () => {
      stopRecording();
      handleClose();
    });
  }

      return () => {
        if (api) api.dispose();
      };
    }
  }, [isOpen]);

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
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button 
            onClick={handleClose}
            className="p-2 bg-rose-500/80 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-colors"
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