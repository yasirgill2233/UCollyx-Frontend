import React, { useEffect, useRef, useState } from "react";
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4002"); 

const VideoCallModal = ({ isOpen, onClose, userName, roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCalling, setIsCalling] = useState(true);

  // --- 1. Audio Quality Booster Function ---
  const enhanceAudio = (sdp) => {
    // Ye line audio bitrate ko manually 128kbps tak le jati hai aur stereo enable karti hai
    return sdp.replace(
      'useinbandfec=1', 
      'useinbandfec=1; stereo=1; maxaveragebitrate=128000; sprop-stereo=1'
    );
  };

  useEffect(() => {
    if (isOpen) {
      const initCall = async () => {
        try {
          // Professional Audio Constraints
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                googHighpassFilter: true, // Noise filter
                channelCount: 2 // Stereo for better understanding
            } 
          });

          streamRef.current = stream;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;

          socket.emit("join-room", roomId);

          socket.on("user-joined", (userId) => {
            createOffer(userId, stream);
          });

          socket.on("signal", async (data) => {
            if (data.signal.type === "offer") {
              handleOffer(data.signal, data.from, stream);
            } else if (data.signal.type === "answer") {
              handleAnswer(data.signal);
            } else if (data.signal.candidate) {
              handleIceCandidate(data.signal.candidate);
            }
          });
        } catch (err) {
          console.error("Call Init Error:", err);
        }
      };
      initCall();
    }

    return () => {
      socket.off("user-joined");
      socket.off("signal");
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (peerRef.current) peerRef.current.close();
    };
  }, [isOpen, roomId]);

  const createPeer = (userId, stream) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.ontrack = (event) => {
      setIsCalling(false);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", { to: userId, signalData: { candidate: event.candidate } });
      }
    };

    peerRef.current = peer;
    return peer;
  };

  const createOffer = async (userId, stream) => {
    const peer = createPeer(userId, stream);
    const offer = await peer.createOffer();
    
    // --- Audio Boost Lagaya ---
    offer.sdp = enhanceAudio(offer.sdp); 
    
    await peer.setLocalDescription(offer);
    socket.emit("signal", { to: userId, signalData: offer });
  };

  const handleOffer = async (offer, fromId, stream) => {
    const peer = createPeer(fromId, stream);
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    
    // --- Audio Boost Lagaya ---
    answer.sdp = enhanceAudio(answer.sdp);

    await peer.setLocalDescription(answer);
    socket.emit("signal", { to: fromId, signalData: answer });
  };

  const handleAnswer = async (answer) => {
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleIceCandidate = async (candidate) => {
    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) { console.error("ICE Error", e); }
  };

  // --- UI Controls ---
  const toggleMic = () => {
    if (streamRef.current) {
      const track = streamRef.current.getAudioTracks()[0];
      track.enabled = !isMicOn;
      setIsMicOn(!isMicOn);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      track.enabled = !isVideoOn;
      setIsVideoOn(!isVideoOn);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-5xl aspect-video bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border border-white/5">
        
        {/* Remote Video */}
        <div className="absolute inset-0 bg-slate-800">
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline
              onLoadedMetadata={(e) => { e.target.volume = 1.0; }} 
              className="w-full h-full object-cover" 
            />
            {isCalling && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80">
                    <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse border border-blue-500/30">
                        <span className="text-3xl font-bold text-blue-400">{userName?.[0]?.toUpperCase()}</span>
                    </div>
                    <p className="mt-6 text-slate-400 tracking-widest animate-bounce">ESTABLISHING ENCRYPTED CONNECTION...</p>
                </div>
            )}
        </div>

        {/* Local Video */}
        <div className="absolute top-8 right-8 w-48 h-32 bg-black rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl z-20 transition-all">
            <video ref={localVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${isVideoOn ? 'opacity-100' : 'opacity-0'}`} />
            {!isVideoOn && <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-900"><VideoOff size={20}/></div>}
        </div>

        {/* Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 px-8 py-4 rounded-[30px] border border-white/10 backdrop-blur-xl shadow-2xl z-30">
          <button onClick={toggleMic} className={`p-4 rounded-2xl transition-all ${isMicOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/30'}`}>
            {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
          </button>
          <button onClick={toggleVideo} className={`p-4 rounded-2xl transition-all ${isVideoOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/30'}`}>
            {isVideoOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>
          <div className="w-[1px] h-8 bg-white/10 mx-2" />
          <button onClick={onClose} className="p-4 bg-red-600 hover:bg-red-700 rounded-2xl text-white shadow-xl shadow-red-600/40 active:scale-95 transition-all">
            <PhoneOff size={26} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;