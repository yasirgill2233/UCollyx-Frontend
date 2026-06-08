import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import socket from "../../context/SocketContext";
import { useMyProjects } from "../../hooks/useProjects";

const GlobalSocketWrapper = ({ children, currentUserId, activeChat }) => {
  const queryClient = useQueryClient();
  const { data: myProjects } = useMyProjects();
  const projects = myProjects?.data || [];

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
        const senderName = newIncomingMessage.Sender.full_name || "Team Member";
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

        const avatarUrl = newIncomingMessage.Sender.avatar_url
          ? `${import.meta.env.VITE_SERVER_URL}${newIncomingMessage.Sender.avatar_url}`
          : null;

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
                    toast.dismiss(t.id);
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

      queryClient.invalidateQueries(["conversations"]);
      queryClient.invalidateQueries(["channels"]);
    };

    socket.on("chat:receive_message", handleGlobalIncomingMessage);

    return () => {
      socket.off("chat:receive_message", handleGlobalIncomingMessage);
    };
  }, [currentUserId, activeChat, queryClient]);



// ==========================================
  // 🔔 PIPELINE 2: CENTRALIZED NOTIFICATIONS ENGINE (Mentions, Joins, DMs)
  // ==========================================
  useEffect(() => {
    if (!socket) return;

    // Tarteeb step 1: Login hotay hi identity online map karein backend par
    if (currentUserId) {
      socket.emit("user_online", currentUserId);
    }

    // Backend notifications ka unique global router pipeline handle event listener
    socket.on("notification:received", (notification) => {
      console.log("🔔 Real-Time Notification Received on Frontend Pipeline:", notification);

      // Agar user pehle se wahi message chat layout khol kar betha hai, toh notification pop up na karein
      const currentActiveNumericId = activeChat?.id?.toString().split("-").pop();
      const isCurrentChatOpen = activeChat?.id && activeChat.type === "dm"; 
      
      if (notification.type === 'dm' && isCurrentChatOpen) {
         queryClient.invalidateQueries(["notifications"]);
         return;
      }

      // 🎨 Dynamic UI Config Templates based on DB Model Notification Types
      let toastIcon = "🔔";
      let titleColor = "text-yellow-400";
      let typeLabel = "Notification";

      if (notification.type === "mention") {
        toastIcon = "🏷️";
        titleColor = "text-pink-400";
        typeLabel = "New Mention";
      } else if (notification.type === "join") {
        toastIcon = "🎉";
        titleColor = "text-emerald-400";
        typeLabel = "Channel Invite";
      } else if (notification.type === "dm") {
        toastIcon = "💬";
        titleColor = "text-blue-400";
        typeLabel = "Direct Message";
      }

      const senderName = "System Alert";
      const avatarUrl = null; // Agar future mein model payload extend karein toh use ho sakta hai

      toast(
        (t) => (
          <div className="flex items-start gap-3.5 w-full max-w-sm">
            <div className="text-xl shrink-0 mt-0.5">{toastIcon}</div>

            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
              <div className="flex justify-between items-center gap-2">
                <span className={`font-black ${titleColor} text-[10px] uppercase tracking-wider truncate`}>
                  {typeLabel}
                </span>
                <span className="text-[8px] text-slate-500 font-bold bg-slate-800 px-1.5 py-0.5 rounded shrink-0 border border-slate-700/50">
                  NEW
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-300 mt-1 line-clamp-2 italic pr-2 break-words">
                "{notification.content}"
              </p>

              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  // Programmatic route push context:
                  // window.location.href = notification.target_url;
                }}
                className="text-left text-[10px] text-blue-400 font-black mt-1.5 hover:underline tracking-tight transition-all"
              >
                Open view details →
              </button>
            </div>
          </div>
        ),
        { duration: 5000, position: "bottom-right" }
      );

      // Cache clear out data lists refresh updates instantly
      queryClient.invalidateQueries(["notifications"]);
    });

    return () => {
      socket.off("notification:received");
    };
  }, [socket, currentUserId, activeChat, queryClient]);


  return <>{children}</>;
};


export default GlobalSocketWrapper;
