import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import socket from "../../context/SocketContext";
import { useMyProjects } from "../../hooks/useProjects";
import { useNavigate } from "react-router";

const GlobalSocketWrapper = ({ children, currentUserId, activeChat }) => {
  const queryClient = useQueryClient();
  const { data: myProjects } = useMyProjects();
  const projects = myProjects?.data || [];
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!socket || projects.length === 0) return;

    projects.forEach((project) => {
      socket.emit("project:join_room", { project_id: project.id });
    });
    console.log(
      `📡 Globally connected to ${projects.length} project rooms in background.`,
    );

    socket.on("board:task_moved_received", (data) => {
      const targetProject = projects.find(
        (p) => p.id === Number(data.project_id),
      );
      const projectName = targetProject
        ? targetProject.name
        : `Project #${data.project_id}`;

      const actionBy = data.updated_by || "A Team Member";

      toast.success(
        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between items-center gap-4">
            <span className="font-black text-blue-400 text-[10px] uppercase tracking-wider">
              {projectName}
            </span>
            <span className="text-[9px] text-slate-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded">
              By: {actionBy}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-200 mt-1">
            Task #{data.task_id} shifted to{" "}
            <span className="text-blue-400 font-bold">
              {data.status.toUpperCase()}
            </span>
          </p>
        </div>,
        { duration: 5000, icon: "🔄" },
      );

      queryClient.invalidateQueries({
        queryKey: ["board", Number(data.project_id)],
      });
    });

    socket.on("board:task_created_received", (data) => {
      const targetProject = projects.find(
        (p) => p.id === Number(data.project_id),
      );
      const projectName = targetProject ? targetProject.name : "Workspace";

      toast.success(
        <div className="flex flex-col gap-0.5">
          <span className="font-black text-green-400 text-[10px] uppercase tracking-wider">
            {projectName}
          </span>
          <p className="text-xs font-semibold text-slate-200">
            🆕 New task created: "{data.task?.title || "Task"}"
          </p>
        </div>,
        { duration: 4000 },
      );

      queryClient.invalidateQueries({
        queryKey: ["board", Number(data.project_id)],
      });
    });

    socket.on("board:task_updated_received", (data) => {
      queryClient.invalidateQueries({
        queryKey: ["board", Number(data.project_id)],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectEpics", Number(data.project_id)],
      });
    });

    return () => {
      socket.off("board:task_moved_received");
      socket.off("board:task_created_received");
      socket.off("board:task_updated_received");
    };
  }, [socket, projects, queryClient]);

  // ==========================================
  // 2. CHAT GLOBAL REAL-TIME ENGINE (DMs & Channels)
  // ==========================================
  useEffect(() => {
    if (!socket) return;

    if (currentUserId) {
      socket.emit("user_online", currentUserId);
    }

    const handleGlobalIncomingMessage = (newIncomingMessage) => {
      const currentActiveNumericId = activeChat?.id
        ?.toString()
        .split("-")
        .pop();
      const isSenderMe =
        Number(newIncomingMessage.sender_id) === Number(currentUserId);

      console.log(
        "Global Wrapper intercepted a message:",
        newIncomingMessage,
        isSenderMe,
        activeChat,
      );

      const isCurrentChatOpen =
        activeChat?.id &&
        ((activeChat.type === "channel" &&
          Number(newIncomingMessage.channel_id) ===
            Number(currentActiveNumericId)) ||
          (activeChat.type === "dm" &&
            ((Number(newIncomingMessage.sender_id) ===
              Number(currentActiveNumericId) &&
              Number(newIncomingMessage.receiver_id) ===
                Number(currentUserId)) ||
              (Number(newIncomingMessage.sender_id) === Number(currentUserId) &&
                Number(newIncomingMessage.receiver_id) ===
                  Number(currentActiveNumericId)))));

      if (!isSenderMe && !isCurrentChatOpen) {
        const senderName =
          newIncomingMessage.Sender?.full_name || "Team Member";
        let messagePreview = "";

        const hasContent = Boolean(newIncomingMessage.content?.trim());
        const hasAttachments =
          Array.isArray(newIncomingMessage.attachments) &&
          newIncomingMessage.attachments.length > 0;

        if (hasContent && hasAttachments) {
          const count = newIncomingMessage.attachments.length;
          messagePreview = `${newIncomingMessage.content} 📎 (${count} attachment${count > 1 ? "s" : ""})`;
        } else if (hasContent) {
          messagePreview = newIncomingMessage.content;
        } else if (hasAttachments) {
          const count = newIncomingMessage.attachments.length;
          messagePreview = `📎 Sent ${count} attachment${count > 1 ? "s" : ""}`;
        } else {
          messagePreview = "Sent a message...";
        }
        const chatContext = newIncomingMessage.channel_id
          ? "Group Channel"
          : "Direct Message";

        const avatarUrl = newIncomingMessage.Sender?.avatar_url
          ? `${import.meta.env.VITE_SERVER_URL}${newIncomingMessage.Sender?.avatar_url}`
          : null;

        const isMobile = window.innerWidth < 768;

        // Toast sirf tabhi dikhao agar mobile view NAHO
        if (!isMobile) {
          toast(
            (t) => (
              <div className="flex items-start gap-3.5 w-full max-w-sm">
                <div className="shrink-0 mt-0.5">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={senderName}
                      crossOrigin="anonymous"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-purple-600 border border-purple-500 shadow-md flex items-center justify-center text-white font-black text-sm uppercase">
                      {senderName[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-black text-purple-400 text-[10px] uppercase tracking-wider truncate">
                      {chatContext}
                    </span>
                    <span className="text-[9px] text-slate-300 font-extrabold bg-slate-800 px-2 py-0.5 rounded shrink-0 border border-slate-700/50">
                      {senderName}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-300 mt-1 line-clamp-2 italic pr-2 break-words">
                    "{messagePreview}"
                  </p>

                  <button
                    onClick={() => {
                      (toast.dismiss(t.id),
                        navigate(`/${role?.split("_")?.join("-")}/chat`));
                    }}
                    className="text-left text-[10px] text-blue-400 font-black mt-1.5 hover:underline tracking-tight transition-all"
                  >
                    Reply to chat →
                  </button>
                </div>
              </div>
            ),
            { duration: 5000, position: "bottom-right" },
          );
        }
      }

      queryClient.invalidateQueries(["conversations"]);
      queryClient.invalidateQueries(["channels"]);

      const audio = new Audio("/sounds/short_bongo.mp3");
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Sound blocked by browser policy"));
    };

    socket.on("chat:receive_message", handleGlobalIncomingMessage);

    return () => {
      socket.off("chat:receive_message", handleGlobalIncomingMessage);
    };
  }, [currentUserId, activeChat, queryClient]);

  // =========================================================
  // ⚡ 1. BULLETPROOF PRESENCE PIPELINE (ROOM REGISTRATION)
  // =========================================================
  useEffect(() => {
    if (!socket) return;

    const registerPresence = () => {
      let rawUser = localStorage.getItem("user");
      let devId = null;

      if (rawUser) {
        try {
          // Agar nested object string hai (e.g. {"id":5})
          if (rawUser.startsWith("{")) {
            devId = JSON.parse(rawUser)?.id;
          } else {
            devId = rawUser; // Agar direct variable identity ID string hai
          }
        } catch (e) {
          devId = rawUser;
        }
      }

      if (devId && devId !== "undefined" && devId !== "null") {
        console.log(
          `🟢 [Presence Verification] Emitting 'user_online' for Developer ID: ${devId}`,
        );
        socket.emit("user_online", devId);
      } else {
        console.log(
          "⚠️ [Presence Verification] Failed to extract Developer ID from localStorage.",
        );
      }
    };

    // Trigger on mount
    registerPresence();

    // Trigger again if socket reconnects automatically
    socket.on("connect", registerPresence);

    return () => {
      socket.off("connect", registerPresence);
    };
  }, [socket]);

  // =========================================================
  // 🪲 2. QA BUG DETECTION REAL-TIME LISTENER
  // =========================================================
  useEffect(() => {
    if (!socket) return;

    console.log(
      "🔒 [QA Alert Matrix] QA Bug Notifier listener linked successfully.",
    );

    const handleQABugDetected = (data) => {
      console.log("📥 [LIVE ENGINE] EXACT BUG EVENT CAPTURED! Data:", data);

      toast.error(
        <div className="flex flex-col gap-1 w-full max-w-xs text-left">
          <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-1">
            <span className="font-black text-red-400 text-[10px] uppercase tracking-wider animate-pulse">
              🚨 QA Bug Detected
            </span>
            <span className="text-[8px] text-red-200 font-bold bg-red-950/80 px-1.5 py-0.5 rounded uppercase border border-red-800">
              {data.severity || "High"}
            </span>
          </div>
          
          <div className="mt-1">
            <span className="text-[10px] text-slate-400 block font-medium">
              Project: <span className="text-slate-200 font-bold">{data.projectName}</span>
            </span>
            <p className="text-xs font-bold text-slate-100 mt-0.5 line-clamp-1">
              "{data.title}"
            </p>
          </div>

          <div className="flex justify-between items-center mt-2 pt-1 border-t border-white/5">
            <span className="text-[9px] text-slate-500 italic">Fix it as soon as possible</span>
            <button 
              onClick={() => navigate(`/${role?.split("_")?.join("-")}/issues`)}
              className="text-[9px] bg-slate-800 hover:bg-slate-700 text-blue-400 font-black px-2 py-0.5 rounded transition-all"
            >
              View Issue →
            </button>
          </div>
        </div>,
        { 
          duration: 8000, 
          position: "bottom-right",
          style: { background: "#0f172a", border: "1px solid rgba(239, 68, 68, 0.2)" }
        }
      );

      // =========================================================
      // 🔥 TARGETED LIVE CACHE INVALIDATION TREE (FOR YOUR HOOKS)
      // =========================================================
      console.log("🔄 [Cache Pipeline] Invalidating dynamic hooks layout queries...");
      
      // 1. Developer ki individual assigned issues list ko reload karo
      queryClient.invalidateQueries({ queryKey: ["assignedIssues"] });

      // 2. Main issues filter arrays ko completely refresh karo
      queryClient.invalidateQueries({ queryKey: ["issues"] });

      // 3. Agar developer kanban board context open karke betha hai
      queryClient.invalidateQueries({ queryKey: ["board"] });
    };

    socket.on("qa:bug_detected", handleQABugDetected);

    return () => {
      socket.off("qa:bug_detected", handleQABugDetected);
    };
  }, [socket, queryClient, navigate]);

  const handleNavigate = (status) => {
  if (!status) return;

  switch (status) {
    case "Ready for QA":
      // QA verification routes par redirect karein
      navigate("/qa/verify-task");
      break;
      
    case "In Progress":
      // Developer issues list / alerts workspace par redirect karein
      navigate("/qa/dashboard");
      break;
  }
};


  // =========================================================
  // 🎯 REAL-TIME DEVELOPER ACTION DETECTION (NOTIFY QA)
  // =========================================================
  useEffect(() => {
    if (!socket) return;

    const handleDevStatusUpdated = (data) => {
      console.log("📥 [QA ENGINE MATRIX] Received status update from developer:", data);

      // Custom Amber/Blue Dynamic Toast for QA Verification Alerts
      toast.success(
        <div className="flex flex-col gap-1 w-full max-w-xs text-left">
          <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-1">
            <span className="font-black text-amber-400 text-[10px] uppercase tracking-wider animate-pulse">
              🔄 VERIFICATION REQUIRED
            </span>
            <span className="text-[8px] text-emerald-300 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded uppercase border border-emerald-800">
              {data.newStatus}
            </span>
          </div>
          
          <div className="mt-1">
            <span className="text-[10px] text-slate-400 block font-medium">
              Project: <span className="text-slate-200 font-bold">{data.projectName}</span>
            </span>
            <p className="text-xs font-bold text-slate-100 mt-0.5 line-clamp-1">
              "{data.title}"
            </p>
          </div>

          <div className="flex justify-between items-center mt-2 pt-1 border-t border-white/5">
            <span className="text-[9px] text-slate-500 italic">By Dev: {data.devName}</span>
            <button 
              onClick={()=>handleNavigate(data.newStatus)} // Jahan QA test karta hai link adjust kar lena
              className="text-[9px] bg-slate-800 hover:bg-slate-700 text-amber-400 font-black px-2 py-0.5 rounded transition-all"
            >
              Test Now →
            </button>
          </div>
        </div>,
        { 
          duration: 7000, 
          position: "bottom-right",
          style: { background: "#0f172a", border: "1px solid rgba(245, 158, 11, 0.2)" }
        }
      );

      // 🔥 RE-FETCH QA SPECIFIC QUERIES INSTANTLY
      console.log("🔄 [QA Cache Reset] Invalidating readyForQA and issue queues...");
      queryClient.invalidateQueries({ queryKey: ["issues", "readyForQA"] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["board"] });
    };

    socket.on("developer:status_updated", handleDevStatusUpdated);

    return () => {
      socket.off("developer:status_updated", handleDevStatusUpdated);
    };
  }, [socket, queryClient, navigate]);


// =========================================================
  // 💬 REAL-TIME COMMENTS NOTIFIER & PIPELINE SYNC
  // =========================================================
  useEffect(() => {
    if (!socket) return;

    const handleCommentReceived = (data) => {
      console.log("📥 [COMMENT ENGINE] Fresh comment message intercept:", data);

      toast((t) => (
        <div className="flex flex-col gap-1 w-full max-w-xs text-left">
          <div className="flex justify-between items-center border-b border-white/5 pb-1">
            <span className="font-black text-blue-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
              💬 New Comment
            </span>
            <span className="text-[8px] text-slate-400 font-semibold bg-slate-800 px-1 py-0.5 rounded">
              Issue #{data.issueId}
            </span>
          </div>

          <div className="mt-1">
            <span className="text-[10px] text-slate-300 font-black block">
              {data.senderName}:
            </span>
            <p className="text-xs font-medium text-slate-100 italic line-clamp-2 mt-0.5">
              "{data.commentText}"
            </p>
          </div>

          <div className="flex justify-end mt-2 pt-1 border-t border-white/5">
            <button 
              onClick={() => {
                toast.dismiss(t.id);
                navigate(window.location.pathname.startsWith("/qa") 
                  ? `/qa/alerts` 
                  : `/dev/issues`
                );
              }}
              className="text-[9px] bg-slate-800 hover:bg-slate-700 text-blue-400 font-black px-2 py-0.5 rounded transition-all"
            >
              Reply →
            </button>
          </div>
        </div>
      ), {
        position: "bottom-right",
        style: { background: "#0f172a", border: "1px solid rgba(59, 130, 246, 0.2)" },
        duration: 5000
      });

      // =========================================================
      // 🔥 FIXED: FORCE ACTIVE RE-FETCH ON CURRENT SCREEN
      // =========================================================
      console.log("🔄 [Comments Sync Triggered] Brute-forcing refetch on all active screen queries...");
      
      // TanStack Query ka sab se high-priority brute force tool jo open screen ko instantly database se sync karta hai
      queryClient.refetchQueries({ 
        type: 'active' 
      });
    };

    socket.on("issue:comment_received", handleCommentReceived);

    return () => {
      socket.off("issue:comment_received", handleCommentReceived);
    };
  }, [socket, queryClient, navigate]);



  // =========================================================
  // 🚀 REAL-TIME TEAM ALLOCATION MONITOR (PROJECT ASSIGNMENT)
  // =========================================================
  useEffect(() => {
    if (!socket) return;

    const handleProjectTeamUpdated = (data) => {
      console.log("📥 [PROJECT ENGINE] Received team allocation pulse:", data);

      // Creative Amber/Emerald Toast for Project Allocation
      toast.success(
        <div className="flex flex-col gap-1 w-full max-w-xs text-left">
          <div className="flex justify-between items-center border-b border-white/5 pb-1">
            <span className="font-black text-emerald-400 text-[10px] uppercase tracking-wider animate-pulse">
              💼 Team Allocated
            </span>
            <span className="text-[8px] text-slate-400 font-semibold bg-slate-800 px-1 py-0.5 rounded">
              Live Core
            </span>
          </div>

          <div className="mt-1">
            <p className="text-xs font-bold text-slate-100 mt-0.5">
              {data.message}
            </p>
          </div>

          <div className="flex justify-end mt-2 pt-1 border-t border-white/5">
            <button 
              onClick={() => navigate(`/developer/issues?project=${data.projectId}`)}
              className="text-[9px] bg-slate-800 hover:bg-slate-700 text-emerald-400 font-black px-2 py-0.5 rounded transition-all"
            >
              Open Workspace →
            </button>
          </div>
        </div>,
        {
          position: "bottom-right",
          style: { background: "#0f172a", border: "1px solid rgba(16, 185, 129, 0.2)" },
          duration: 6000
        }
      );

      // =========================================================
      // 🔥 TARGETED LIVE CACHE INVALIDATION FOR YOUR HOOKS
      // =========================================================
      console.log("🔄 [Team Matrix Reset] Invalidating projects query client caches...");
      
      // 1. Invalidate parallel fetch data context for manager/admin dashboard
      queryClient.invalidateQueries({ queryKey: ['projects-data'] });
      
      // 2. Invalidate individual developer's own projects panel list
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      
      // 3. Force refetch active queries to double check everything syncs seamlessly
      queryClient.refetchQueries({ type: 'active' });
    };

    socket.on("project:team_updated", handleProjectTeamUpdated);

    return () => {
      socket.off("project:team_updated", handleProjectTeamUpdated);
    };
  }, [socket, queryClient, navigate]);

  // ==========================================
  // 🔔 PIPELINE 2: CENTRALIZED NOTIFICATIONS ENGINE (Mentions, Joins, DMs)
  // ==========================================
  // useEffect(() => {
  //   if (!socket) return;

  //   // Tarteeb step 1: Login hotay hi identity online map karein backend par
  //   if (currentUserId) {
  //     socket.emit("user_online", currentUserId);
  //   }

  //   // Backend notifications ka unique global router pipeline handle event listener
  //   socket.on("notification:received", (notification) => {
  //     console.log("🔔 Real-Time Notification Received on Frontend Pipeline:", notification);

  //     // Agar user pehle se wahi message chat layout khol kar betha hai, toh notification pop up na karein
  //     const currentActiveNumericId = activeChat?.id?.toString().split("-").pop();
  //     const isCurrentChatOpen = activeChat?.id && activeChat.type === "dm";

  //     if (notification.type === 'dm' && isCurrentChatOpen) {
  //        queryClient.invalidateQueries(["notifications"]);
  //        return;
  //     }

  //     // 🎨 Dynamic UI Config Templates based on DB Model Notification Types
  //     let toastIcon = "🔔";
  //     let titleColor = "text-yellow-400";
  //     let typeLabel = "Notification";

  //     if (notification.type === "mention") {
  //       toastIcon = "🏷️";
  //       titleColor = "text-pink-400";
  //       typeLabel = "New Mention";
  //     } else if (notification.type === "join") {
  //       toastIcon = "🎉";
  //       titleColor = "text-emerald-400";
  //       typeLabel = "Channel Invite";
  //     } else if (notification.type === "dm") {
  //       toastIcon = "💬";
  //       titleColor = "text-blue-400";
  //       typeLabel = "Direct Message";
  //     }

  //     const senderName = "System Alert";
  //     const avatarUrl = null; // Agar future mein model payload extend karein toh use ho sakta hai

  //     toast(
  //       (t) => (
  //         <div className="flex items-start gap-3.5 w-full max-w-sm">
  //           <div className="text-xl shrink-0 mt-0.5">{toastIcon}</div>

  //           <div className="flex-1 flex flex-col gap-0.5 min-w-0">
  //             <div className="flex justify-between items-center gap-2">
  //               <span className={`font-black ${titleColor} text-[10px] uppercase tracking-wider truncate`}>
  //                 {typeLabel}
  //               </span>
  //               <span className="text-[8px] text-slate-500 font-bold bg-slate-800 px-1.5 py-0.5 rounded shrink-0 border border-slate-700/50">
  //                 NEW
  //               </span>
  //             </div>

  //             <p className="text-xs font-semibold text-slate-300 mt-1 line-clamp-2 italic pr-2 break-words">
  //               "{notification.content}"
  //             </p>

  //             <button
  //               onClick={() => {
  //                 toast.dismiss(t.id);
  //                 // Programmatic route push context:
  //                 // window.location.href = notification.target_url;
  //               }}
  //               className="text-left text-[10px] text-blue-400 font-black mt-1.5 hover:underline tracking-tight transition-all"
  //             >
  //               Open view details →
  //             </button>
  //           </div>
  //         </div>
  //       ),
  //       { duration: 5000, position: "bottom-right" }
  //     );

  //     // Cache clear out data lists refresh updates instantly
  //     queryClient.invalidateQueries(["notifications"]);
  //   });

  //   return () => {
  //     socket.off("notification:received");
  //   };
  // }, [socket, currentUserId, activeChat, queryClient]);

  return <>{children}</>;
};

export default GlobalSocketWrapper;
