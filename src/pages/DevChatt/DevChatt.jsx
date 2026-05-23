import React, { useState, useEffect, useRef, useMemo } from "react";
import VideoCallModal from "./Video/VideoCallModadl";
import JitsiVideoCall from "./Video/JitsiVideoCall";
import {
  Hash,
  MessageSquare,
  AtSign,
  Paperclip,
  Send,
  Video,
  Mic,
  Settings,
  Search,
  Plus,
  BellIcon,
  MoreHorizontal,
  Smile,
  Calendar,
  X,
  FileText,
  Clock,
} from "lucide-react";

import EmojiPicker from "emoji-picker-react";

import { useQueryClient } from "@tanstack/react-query";

import {
  useMessages,
  useSendMessage,
  useConversations,
} from "../../hooks/useChat";
import { useNotifications } from "../../hooks/useNotifications";
import {
  useChannelMembers,
  useChannels,
  useCreateChannel,
  useAddMember,
} from "../../hooks/useChannels";

import CreateChannelModal from "./CreateChannelModal";
import NewDMModal from "./NewDMModal";
import MembersSidebar from "./MembersSidebar";
import GlobalSearchModal from "./GlobalSearchModal";
import NotificationPopover from "./NotificationPopOver";
import UserProfileSidebar from "./UserProfileSidebar";
import AddMemberModal from "./AddMemberModal";
import ScheduleMeetingModal from "./Video/ScheduleMeetingModal";
import MyVideoCall from "./Video/MyVideoCall";
import { triggerToast } from "../../utils/toastHelper";
import { useMeeting } from "../../hooks/useMeeting";

const DevChat = () => {
  const [activeChat, setActiveChat] = useState({});
  const [inputText, setInputText] = useState("");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chatMembers, setChatMembers] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isDMModalOpen, setIsDMModalOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [chatData, setChatData] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();

  const user = JSON.parse(localStorage.getItem("user"));

  const currentUserId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).id
    : null;

  // Component ke andar
  const { startCall, endCall, scheduleCall, updateStatus } = useMeeting(
    activeChat.id,
  );
  const [currentMeetingId, setCurrentMeetingId] = useState(null);

  // 1. Jab Instant Video Icon par click ho (Start Call)
  const handleStartMeeting = () => {
    const payload = {
      // Logic: Agar channel hai to channel_id, warna DM hai to receiver_id
      channel_id: activeChat.type === "channel" ? activeChat.id : null,
      receiver_id: activeChat.type === "dm" ? activeChat.id : null,
      content: `Video Meeting in ${activeChat.name}`,
      type: "call",
    };

    startCall.mutate(payload, {
      onSuccess: (res) => {
        // res.data.id backend se aane wali message primary key hai
        setCurrentMeetingId(res.data.id);
        setIsVideoModalOpen(true);
      },
    });
  };

  // 2. Jab Schedule Modal submit ho
  const handleScheduleSubmit = (formData) => {
    const payload = {
      channel_id: activeChat.type === "channel" ? activeChat.id : null,
      receiver_id: activeChat.type === "dm" ? activeChat.id : null,
      content: formData.title,
      scheduled_at: `${formData.date} ${formData.time}:00`,
      type: "call",
      call_status: "scheduled",
    };

    scheduleCall.mutate(payload, {
      onSuccess: () => setIsScheduleModalOpen(false),
    });
  };

  const handleOnMeetingClose = () => {
    if (currentMeetingId) {
      endCall.mutate(currentMeetingId);
      setCurrentMeetingId(null);
    }
    setIsVideoModalOpen(false);
  };

  const { data: channelsData } = useChannels((firstChannel) => {
    if (!activeChat.id) {
      setActiveChat({
        name: firstChannel.name,
        type: "channel",
        id: `${firstChannel.id}`,
      });
    }
  });
  const { data: chatResp } = useMessages(activeChat.type, activeChat.id);
  const { data: notifResp } = useNotifications();
  const { data: membersResp } = useChannelMembers(
    activeChat?.id,
    activeChat?.type === "channel",
  );
  const { data: convData } = useConversations();

  // --- Mutations ---
  const { mutate: sendMsg } = useSendMessage();
  const { mutate: makeChannel } = useCreateChannel();
  const { mutate: addMemberMutate } = useAddMember();

  const notifications = notifResp?.data || [];
  const channelMembers = membersResp?.data || [];
  const channels = channelsData?.data || [];
  const dmUsers = convData?.data || [];

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const addNewChannel = (channelData) => {
    const payload = {
      name: channelData.name,
      description: channelData.description,
      is_private: channelData.is_private,
      type: channelData.is_private ? "private" : "public",
    };

    makeChannel(payload, {
      onSuccess: (data) => {
        triggerToast(`Channel '${data.data.name}' created!`, "success");
        switchChat(data.data.name, "channel", data.data.id);
      },
      onError: (err) =>
        triggerToast(err.response?.data?.message || "Error", "error"),
    });
  };

  const startNewDM = (user) => {
    console.log("Starting New DM with:", user);

    const isAlreadyAdded = dmUsers.some((existing) => existing.id === user.id);

    if (!isAlreadyAdded) {
      queryClient.setQueryData(["conversations"], (oldData) => {
        return {
          ...oldData,
          data: [user, ...(oldData?.data || [])],
        };
      });
    }

    switchChat(user.full_name, "dm", `${user.id}`);
  };

  const onEmojiClick = (emojiData) => {
    setInputText((prev) => prev + emojiData.emoji);
  };

  const handleAddMember = (memberObj) => {
    if (!memberObj || !activeChat?.id) return;

    const numericId = activeChat.id.toString().split("-").pop();

    const payload = {
      channelId: numericId,
      userId: memberObj.User.id,
      role: "member",
    };

    addMemberMutate(payload, {
      onSuccess: () => {
        triggerToast("Member added successfully", "success");
      },
      onError: (err) =>
        triggerToast(err.response?.data?.message || "Failed", "error"),
    });
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && selectedFiles.length === 0) || !activeChat)
      return;

    const formData = new FormData();
    const numericId = activeChat.id.toString().split("-").pop();

    formData.append("text", inputText.trim());
    formData.append("type", activeChat.type);

    formData.append("name", activeChat?.name || "User");

    if (activeChat.type === "channel") {
      formData.append("channelId", numericId);
    } else {
      formData.append("receiverId", numericId);
    }

    selectedFiles.forEach((file) => {
      formData.append("attachments", file);
    });

    sendMsg(formData, {
      onSuccess: (res) => {
        setInputText("");
        setSelectedFiles([]);
        triggerToast("Message Sent!", "success");
      },
      onError: (err) => {
        triggerToast(err.response?.data?.message || "Failed to send", "error");
      },
    });
  };

  const switchChat = (name, type, id) => {
    setActiveChat({ name, type, id });
    setChatMembers([]);
    if (!id) {
      if (!chatData[id]) {
        setChatData((prev) => ({ ...prev, [id]: [] }));
      }
      return;
    }
  };

  const handleUserClick = (userData) => {
    setSelectedUser(userData);
    setIsProfileOpen(true);
  };

  const allUsers1 = [
    { id: 1, name: "Yasir", avatar: "" },
    { id: 2, name: "Ali", avatar: "" },
    { id: 3, name: "Zain", avatar: "" },
    { id: 4, name: "Osama", avatar: "" },
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);

    const lastAtPos = textBeforeCursor.lastIndexOf("@");

    if (lastAtPos !== -1) {
      const query = textBeforeCursor.substring(lastAtPos + 1);

      if (query.includes(" ")) {
        setShowMentions(false);
        return;
      }

      console.log("Mention Query:", query);

      setMentionSearch(query);
      const filtered = allUsers1.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase()),
      );

      setFilteredUsers(filtered);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const selectMention = (userName) => {
    const cursorPosition = inputText.lastIndexOf("@");
    const textBeforeAt = inputText.substring(0, cursorPosition);
    const textAfterAt = inputText
      .substring(cursorPosition)
      .split(" ")
      .slice(1)
      .join(" ");

    const newText = `${textBeforeAt}@${userName} ${textAfterAt}`;

    setInputText(newText);
    setShowMentions(false);
  };

  const renderMessageWithMentions = (text) => {
    if (!text) return "";

    const parts = text.split(/(@\w+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span
            key={index}
            className="text-blue-600 bg-blue-100 font-bold px-1 rounded-md cursor-pointer hover:bg-blue-300/50"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const getLatestChat = (channels, dms) => {
    const allChats = [
      ...channels.map((c) => ({ ...c, type: "channel" })),
      ...dms.map((d) => ({ ...d, type: "dm", name: d.full_name })),
    ];

    console.log("All Chats for Latest Check:", allChats);

    if (allChats.length === 0) return null;

    return allChats.sort((a, b) => {
      const timeA = new Date(
        a.updatedAt || a.createdAt || a.updated_at || a.created_at,
      ).getTime();
      const timeB = new Date(
        b.updatedAt || b.createdAt || b.updated_at || b.created_at,
      ).getTime();
      return timeB - timeA;
    })[0];
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Current time aur scheduled time ka comparison
  const isMeetingLive = (scheduledAt) => {
    const now = new Date();
    const meetingTime = new Date(scheduledAt);
    // Agar waqt ho chuka hai, lekin abhi shuru hue 1 ghante se kam hua hai
    return now >= meetingTime && now - meetingTime < 3600000;
  };

  const messages = useMemo(() => {
    if (!chatResp) return [];

    const rawMessages = chatResp.data?.messages || chatResp.data || [];

    return rawMessages.map((msg) => ({
      id: msg.id,
      user: msg.Sender?.full_name || "Unknown",
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: msg.content,
      type: msg.type,
      call_status: msg.call_status,
      scheduled_at: new Date(msg.scheduled_at).toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      call_duration: msg.call_duration,
      isMe: msg.sender_id === currentUserId,
      status: msg.Sender?.status || "Active",
      email: msg.Sender?.email || "",
      created_at: msg.Sender?.created_at,
      avatar_url: msg.Sender?.avatar_url || null,
      attachments: msg.attachments || [],
    }));
  }, [chatResp, currentUserId]);

  const upcomingMeeting = useMemo(() => {
    const now = new Date();
    return messages.find(
      (msg) =>
        (msg.type === "call" && msg.call_status === "active") ||
        (msg.call_status === "scheduled" &&
          new Date(msg.scheduled_at) <= now &&
          now - new Date(msg.scheduled_at) < 360000),
      // now >= meetingTime && now - meetingTime < 3600000,
    );
  }, [messages]);

  const scheduledMeetingsList = useMemo(() => {
    const now = new Date();
    return messages
      .filter(
        (msg) =>
          msg.type === "call" &&
          msg.call_status === "scheduled" &&
          new Date(msg.scheduled_at) <= now,
      )
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  }, [messages]);

  const handleJoinScheduledMeeting = (meeting) => {
    if (meeting.call_status === "scheduled") {
      updateStatus.mutate({ id: meeting.id, status: "active" });
    }

    setCurrentMeetingId(meeting.id);
    setIsVideoModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData, activeChat]);

  useEffect(() => {
    if ((channels.length > 0 || dmUsers.length > 0) && !activeChat?.id) {
      const latest = getLatestChat(channels, dmUsers);

      if (latest) {
        console.log("Auto-switching to latest chat:", latest.name);
        switchChat(
          latest.name || latest.full_name,
          latest.type || (latest.full_name ? "dm" : "channel"),
          latest.id,
        );
      }
    }
  }, [channels, dmUsers]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F8FAFC] font-sans overflow-hidden text-slate-900">
      {/* 1. Project/Chat Sidebar */}
      <div className="w-72 border-r border-slate-200/60 flex flex-col bg-white">
        <div className="h-[68px] px-6 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <MessageSquare size={16} className="text-white" />
            </div>
            <h2 className="font-black text-slate-800 tracking-tight text-lg">
              Chatt
            </h2>
          </div>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <Settings size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          <div className="relative group" onClick={() => setIsSearchOpen(true)}>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={15}
            />
            <input
              className="w-full bg-slate-100/50 border-transparent border focus:border-blue-500/20 focus:bg-white rounded-xl py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all font-medium"
              placeholder="Jump to..."
            />
          </div>

          {/* Project Channels */}
          <div>
            <div className="flex justify-between items-center px-2 mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Project Channels
              </span>
              <Plus
                size={16}
                className="text-slate-400 cursor-pointer hover:text-blue-600 transition-all"
                onClick={() => setIsCreateChannelOpen(true)}
              />
            </div>
            <div className="space-y-1">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => switchChat(ch.name, "channel", ch.id)}
                  className={`flex items-center justify-between group px-3 py-2 rounded-xl text-[13px] cursor-pointer transition-all ${activeChat.id === ch.id ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Hash
                      size={16}
                      className={
                        activeChat.id === ch.id
                          ? "text-blue-500"
                          : "text-slate-400"
                      }
                    />{" "}
                    {ch?.name
                      ?.substring(1)
                      .split("-")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(" ")}
                  </div>
                  {activeChat.id === ch.id && (
                    <div className={`w-1.5 h-1.5 ${upcomingMeeting ? 'w-2 h-2 animate-ping bg-green-600':'bg-blue-600'}  rounded-full`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <div className="flex justify-between items-center px-2 mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                Direct Messages
              </span>
              <Plus
                size={16}
                className="text-slate-400 cursor-pointer hover:text-blue-600 transition-all"
                onClick={() => setIsDMModalOpen(true)}
              />
            </div>
            <div className="space-y-1">
              {dmUsers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => switchChat(member.full_name, "dm", member.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all cursor-pointer ${activeChat.name === member.full_name ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-slate-200 backdrop-blur-md border border-white/20 flex items-center justify-center text-[11px] font-bold text-slate-600">
                      {/* {member?.full_name?.charAt(0)} */}

                      {member.avatar_url ? (
                        <img
                          src={import.meta.env.VITE_API_URL + member.avatar_url}
                          alt="Avatar"
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        member.full_name[0].toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <span className="font-semibold">{member.full_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="h-[68px] border-b border-slate-100 flex items-center justify-between px-8 bg-white/70 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex gap-4 justify-center items-center">
              <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                {activeChat.type === "channel" ? (
                  <Hash size={18} className="text-slate-400" />
                ) : (
                  <MessageSquare size={18} className="text-slate-400" />
                )}
                {activeChat.type === "channel"
                  ? activeChat.name?.substring(1)
                  : activeChat.name}
              </h3>
              <button
                onClick={() => setIsMembersOpen(true)}
                className="text-[11px] text-emerald-600 font-bold hover:cursor-pointer hover:text-emerald-700 transition-all flex items-center gap-1.5"
              >
                {isChatLoading
                  ? ""
                  : activeChat?.type === "channel"
                    ? `${channelMembers.filter((u) => u.User.status === "active").length} / ${channelMembers.length} Online`
                    : ""}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 mr-2">
              {activeChat?.type === "channel" && (
                <div
                  className="flex -space-x-2 hover:cursor-pointer"
                  onClick={() => setIsMembersOpen(true)}
                >
                  {channelMembers
                    ?.filter((member) => member.User.status === "active")
                    .slice(0, 4)
                    .map((i) => (
                      <div
                        key={i.User.id || i}
                        className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden uppercase text-slate-600"
                      >
                        {i.User.avatar_url ? (
                          <img
                            src={
                              import.meta.env.VITE_API_URL + i.User.avatar_url
                            }
                            alt={i.User.full_name}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{i.full_name?.charAt(0) || "U"}</span>
                        )}
                      </div>
                    ))}

                  {channelMembers?.filter((m) => m.User.status === "active")
                    .length > 4 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      +
                      {channelMembers.filter((m) => m.User.status === "active")
                        .length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative flex gap-2 justify-center items-center">
              {notifications.some((n) => !n.is_read) && (
                <div className="absolute -top-1 -right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              )}
              <Video
                className="cursor-pointer hover:text-blue-600 text-slate-400 transition-colors"
                onClick={handleStartMeeting} // Humara naya function
                size={20}
              />
              {/* Chota Arrow for Scheduling */}
              <div
                className="cursor-pointer hover:text-blue-600 text-slate-400 transition-all p-0.5 rounded"
                onClick={() => setIsScheduleModalOpen(true)} // Modal open krain
                title="Schedule a meeting"
              >
                <Plus size={20} strokeWidth={3} />
              </div>
              <BellIcon
                size={20}
                className="text-slate-400 cursor-pointer hover:text-blue-600 transition-colors "
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              />
            </div>
          </div>
        </div>

        {upcomingMeeting && (
          <div className="mb-4 bg-gradient-to-r from-indigo-400 to-blue-500 px-4 p-1 flex items-center justify-between shadow-xl shadow-indigo-100 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg animate-pulse text-white">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                  Upcoming Sync
                </span>
                <h4 className="text-white text-sm font-bold">
                  {upcomingMeeting.text}
                </h4>
              </div>
            </div>
            <button
              onClick={() => handleJoinScheduledMeeting(upcomingMeeting)}
              className="bg-white text-indigo-600 px-6 py-2 rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-transform"
            >
              Join Now
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-[#f5f5f593]">
          {isChatLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] animate-pulse"></div>
          ) : messages.length > 0 ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 group ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* User Avatar */}
                  <div
                    onClick={() => handleUserClick(msg)}
                    className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xs shadow-sm cursor-pointer hover:scale-105 transition-transform ${
                      msg.isMe
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-white"
                    }`}
                  >
                    {msg.avatar_url ? (
                      <img
                        src={import.meta.env.VITE_API_URL + msg.avatar_url}
                        alt="Avatar"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      msg.user[0].toUpperCase()
                    )}
                  </div>

                  {/* Message Content Container */}
                  <div
                    className={`flex flex-col max-w-lg ${msg.isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      {!msg.isMe && (
                        <span className="text-xs font-bold text-slate-700">
                          {msg.user || "Unknown User"}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {msg.time}
                      </span>
                      {msg.isMe && (
                        <span className="text-xs font-bold text-blue-600">
                          You
                        </span>
                      )}
                    </div>

                    {/* Chat Message Bubble */}
                    <div
                      className={`px-5 py-3 text-[14px] leading-relaxed shadow-sm rounded-2xl ${
                        msg.isMe
                          ? "bg-blue-50 text-slate-700 rounded-tr-none border border-blue-100/50"
                          : "bg-white text-slate-600 rounded-tl-none border border-slate-100"
                      }`}
                    >
                      {msg.type === "call" ? (
                        <div
                          className={`p-4 rounded-[26px] min-w-[280px] shadow-sm border ${
                            msg.call_status === "active"
                              ? "bg-indigo-600 text-white border-indigo-400"
                              : "bg-white text-slate-800 border-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Icon Section */}
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                msg.call_status === "active"
                                  ? "bg-white/20 animate-pulse"
                                  : "bg-slate-100"
                              }`}
                            >
                              {msg.call_status === "scheduled" ? (
                                <Calendar
                                  size={20}
                                  className={
                                    msg.call_status === "active"
                                      ? "text-white"
                                      : "text-blue-600"
                                  }
                                />
                              ) : (
                                <Video
                                  size={20}
                                  className={
                                    msg.call_status === "active"
                                      ? "text-white"
                                      : "text-indigo-600"
                                  }
                                />
                              )}
                            </div>

                            {/* Info Section */}
                            <div className="flex-1">
                              <h4 className="text-[14px] font-black">
                                {msg.call_status === "active"
                                  ? "Live Meeting"
                                  : msg.call_status === "scheduled"
                                    ? "Scheduled Meeting"
                                    : "Call Ended"}
                              </h4>
                              <p
                                className={`text-[10px] ${msg.call_status === "active" ? "text-indigo-100" : "text-slate-500"}`}
                              >
                                {msg.call_status === "scheduled"
                                  ? `Starts: ${new Date(msg.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                                  : msg.call_status === "ended"
                                    ? `Duration: ${Math.floor(msg.call_duration / 60)}m ${msg.call_duration % 60}s`
                                    : `Started by ${msg.sender_id === user.id ? "You" : "Team Member"}`}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4">
                            {/* Join Button: Active meeting ke liye ya Schedule time hone par */}
                            {msg.call_status === "active" ||
                            (msg.call_status === "scheduled" &&
                              isMeetingLive(msg.scheduled_at)) ? (
                              <button
                                onClick={() =>
                                  msg.call_status === "scheduled"
                                    ? handleJoinScheduledMeeting(msg)
                                    : setIsVideoModalOpen(true)
                                }
                                className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                                  msg.call_status === "active"
                                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                              >
                                Join Now <Plus size={14} strokeWidth={3} />
                              </button>
                            ) : msg.call_status === "scheduled" ? (
                              <div className="text-center py-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  Waiting for Time
                                </span>
                              </div>
                            ) : null}
                          </div>
                          {msg.call_status === 'ended' && msg.transcript && (
  <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
    <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase">Meeting Transcript</p>
    <p className="text-xs text-slate-600 line-clamp-3 italic">
      "{msg.transcript}"
    </p>
    
    {/* Audio Player */}
    {msg.audio_url && (
      <audio controls className="w-full h-8 mt-2 scale-90 origin-left">
        <source src={msg.audio_url} type="audio/mpeg" />
      </audio>
    )}
    
    <button className="mt-2 text-blue-600 text-[10px] font-black hover:underline">
      READ FULL SUMMARY
    </button>
  </div>
)}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Text Message */}
                          {msg.text && (
                            <p className="whitespace-pre-wrap break-words">
                              {renderMessageWithMentions(msg.text)}
                            </p>
                          )}

                          {/* Attachments Section */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {msg.attachments.map((file, idx) => {
                                const fileUrl = `${import.meta.env.VITE_API_URL}/${file.path.replace(/\\/g, "/")}`;
                                const isImage =
                                  file.mimetype.startsWith("image/");

                                return (
                                  <div key={idx} className="max-w-[250px]">
                                    {isImage ? (
                                      // Image Preview
                                      <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img
                                          src={fileUrl}
                                          alt={file.filename}
                                          crossOrigin="anonymous"
                                          className="rounded-lg max-h-48 w-full object-cover border border-slate-200 hover:opacity-90 transition-opacity cursor-zoom-in"
                                        />
                                      </a>
                                    ) : (
                                      // Document/File Icon View
                                      <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 p-3 bg-white/50 border border-slate-200 rounded-xl hover:bg-white transition-all group"
                                      >
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                          <FileText size={20} />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                          <span className="text-[12px] font-bold text-slate-700 truncate w-32">
                                            {file.filename}
                                          </span>
                                          <span className="text-[10px] text-slate-400 uppercase font-black">
                                            {(file.size / 1024).toFixed(1)} KB
                                          </span>
                                        </div>
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            /* SCENARIO 3: NO MESSAGES AT ALL (Empty State) */
            <>
              {activeChat.id ? (
                <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 min-h-[350px]">
                  <div className="w-24 h-24 bg-blue-50/50 rounded-[32px] flex items-center justify-center mb-8 border border-blue-100/50">
                    <span className="text-5xl animate-bounce-subtle">👋</span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
                    Start a conversation with {activeChat.name}
                  </h2>

                  <p className="text-slate-400 font-medium text-[15px]">
                    Send a message to get started
                  </p>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => setInputText("Hey there! 👋")}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                    >
                      Say Hi!
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="flex flex-col items-center max-w-[320px]">
                    <h2 className="text-[22px] font-bold text-slate-800 mb-3">
                      Start a Conversation
                    </h2>
                    <p className="text-center text-slate-400 text-sm leading-relaxed mb-8">
                      Choose a communication thread or start a new direct
                      message to sync with your team.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Message Input Area */}
        <div className="px-8 pb-8 pt-2 bg-[#f5f5f593]">
          <div className="relative bg-white border border-slate-200 rounded-[24px] shadow-xl shadow-slate-200/40 focus-within:border-blue-500/40 focus-within:ring-4 ring-blue-500/5 transition-all">
            {/* Mentions Dropdown */}
            {showMentions && filteredUsers.length > 0 && (
              <div
                className="absolute bottom-full left-0 mb-4 w-64 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-[9999]"
                style={{ pointerEvents: "auto" }} // Ensure click kaam kare
              >
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    People
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => selectMention(user.name)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all border-b border-slate-50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {user.name[0]}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {user.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50/30">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative group bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2 pr-8 shadow-sm"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                      <Paperclip size={14} />
                    </div>
                    <span className="text-xs font-medium text-slate-600 truncate max-w-[120px]">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.zip"
            />

            <textarea
              value={inputText}
              onChange={handleInputChange}
              // onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full px-6 pt-5 text-[14px] text-slate-700 outline-none resize-none min-h-[60px] font-medium"
              placeholder={`Message ${activeChat.type === "channel" ? "" : ""}${activeChat.name}...`}
            />

            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-5 text-slate-400">
                <div className="flex items-center gap-3 border-r border-slate-200 pr-4">
                  <Paperclip
                    className="cursor-pointer hover:text-blue-600 transition-colors"
                    size={19}
                    onClick={() => fileInputRef.current.click()}
                  />
                </div>
                <div
                  className="relative flex items-center"
                  ref={emojiPickerRef}
                >
                  <Smile
                    className={`cursor-pointer transition-colors ${showEmojiPicker ? "text-blue-600 scale-110" : "hover:text-blue-600"}`}
                    size={20}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  />

                  {showEmojiPicker && (
                    <div className="absolute bottom-14 left-0 shadow-2xl border border-slate-100 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
                        theme="light"
                        searchPlaceholder="Search emoji..."
                        width={320}
                        height={400}
                        previewConfig={{ showPreview: false }}
                        skinTonesDisabled
                      />
                    </div>
                  )}
                </div>
                <Mic
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  size={19}
                />
                {/* <Video
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={handleStartMeeting} // Humara naya function
                  size={19}
                /> */}
                {/* Chota Arrow for Scheduling */}
                {/* <div
                  className="cursor-pointer hover:text-blue-600 text-slate-400 transition-all p-0.5 rounded hover:bg-slate-200"
                  onClick={() => setIsScheduleModalOpen(true)} // Modal open krain
                  title="Schedule a meeting"
                >
                  <Plus size={12} strokeWidth={3} />
                </div> */}
              </div>
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white pl-6 pr-5 py-2.5 rounded-2xl text-[13px] font-black flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                Send <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals & Sidebars */}
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        onCreateChannel={addNewChannel}
      />
      <NewDMModal
        isOpen={isDMModalOpen}
        onClose={() => setIsDMModalOpen(false)}
        onSelectUser={startNewDM}
      />
      <MembersSidebar
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
        channelName={activeChat.name}
        members={channelMembers}
        onAddMember={() => setIsAddMemberModalOpen(true)}
      />
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        channels={channels}
        users={dmUsers}
        chatData={chatData}
        onSelect={(name, type, id) => switchChat(name, type, id)}
      />
      <NotificationPopover
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onSelectChat={(name, id, type) => switchChat(name, type, id)}
      />
      <UserProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userData={selectedUser}
      />
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAdd={handleAddMember}
        existingMembers={chatData[activeChat.id] || []}
      />
      {/* <VideoCallModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        userName={activeChat.name}
        roomId="test-room-123"
      /> */}
      {/* Replace old modal with this */}
      <JitsiVideoCall
        isOpen={isVideoModalOpen}
        onClose={() => {
          handleOnMeetingClose();
        }}
        roomName={activeChat.name}
        userName={user.full_name}
        activeChat={activeChat.id}
        userEmail={user.email}
        currentMeetingId = {currentMeetingId}
      />

      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleSubmit}
        roomName={activeChat.name}
        userName="Yasir"
      />
    </div>
  );
};

export default DevChat;
