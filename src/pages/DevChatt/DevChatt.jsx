import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import EmojiPicker from "emoji-picker-react"; // Library Import
// Components Imports
import CreateChannelModal from "./CreateChannelModal";
import NewDMModal from "./NewDMModal";
import MembersSidebar from "./MembersSidebar";
import GlobalSearchModal from "./GlobalSearchModal";
import NotificationPopover from "./NotificationPopOver";
import UserProfileSidebar from "./UserProfileSidebar";
import AddMemberModal from "./AddMemberModal";
import ScheduleMeetingModal from "./Video/ScheduleMeetingModal";
import MyVideoCall from "./Video/MyVideoCall";
import API from "../../api/axios";
import { triggerToast } from "../../utils/toastHelper";

const DevChat = () => {
  // 1. States for Data Handling
  const [activeChat, setActiveChat] = useState({});
  const [inputText, setInputText] = useState("");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [chatMembers, setChatMembers] = useState([]);

  const messagesEndRef = useRef(null);

  console.log("Active Chat:", activeChat);

  // 1. State for Schedule Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // 2. Schedule Handler
  // const handleScheduleMeeting = (meeting) => {
  //   const meetingMessage = {
  //     id: Date.now(),
  //     user: "System",
  //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     isMe: false,
  //     type: "meeting_card", // Naya message type
  //     meetingDetails: meeting,
  //     text: `Scheduled a meeting: ${meeting.title}`
  //   };

  //   setChatData((prev) => ({
  //     ...prev,
  //     [activeChat.name]: [...(prev[activeChat.name] || []), meetingMessage],
  //   }));
  // };

  const handleScheduleMeeting = () => {
    const callMessage = {
      id: Date.now(),
      user: "Yasir", // Current Logged in User
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: "Started a video call",
      type: "call", // Unique type for styling
      isMe: true,
    };

    // 1. Chat list mein add karein
    setChatData((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), callMessage],
    }));

    // 2. Local modal open karein
    setIsVideoModalOpen(true);
  };

  const [channels, setChannels] = useState([]);

  // 2. Channels fetch karne ka function
  const fetchMyChannels = async () => {
    try {
      const res = await API.get("/channels/my-channels");
      console.log("Channels:", res.data.data);
      if (res.data.success) {
        setChannels(res.data.data); // Pure objects ki array save hogi

        // Agar koi channel pehle se active nahi hai toh pehle channel ko select kar lein
        if (!activeChat && res.data.data.length > 0) {
          setActiveChat({
            name: res.data.data.name,
            type: "channel",
            id: res.data.data.id,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching channels:", err);
    }
  };

  // 3. Page load par API call karein
  useEffect(() => {
    fetchMyChannels();
  }, []);

  const [dmUsers, setDmUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "mention",
      text: 'Ahmed Khan mentioned you in #AI Project: "Check the new API docs"',
      time: "2 min ago",
      unread: true,
      targetChat: "AI Project",
      chatType: "channel",
    },
    {
      id: 2,
      type: "dm",
      text: "Faisal Raza sent you a direct message",
      time: "10 min ago",
      unread: true,
      targetChat: "Faisal",
      chatType: "dm",
    },
    {
      id: 3,
      type: "file",
      text: 'Zeeshan Ali uploaded "Project_Final_v2.pdf" in #Alpha Project',
      time: "45 min ago",
      unread: true,
      targetChat: "Alpha Project",
      chatType: "channel",
    },
    {
      id: 4,
      type: "channel",
      text: "5 new messages in #General channel",
      time: "1 hour ago",
      unread: false,
      targetChat: "General",
      chatType: "channel",
    },
    {
      id: 5,
      type: "thread",
      text: "Hamza replied to your thread in #Random",
      time: "3 hours ago",
      unread: true,
      targetChat: "Random",
      chatType: "channel",
    },
    {
      id: 6,
      type: "join",
      text: "Sara Mir joined #Alpha Project",
      time: "5 hours ago",
      unread: false,
      targetChat: "Alpha Project",
      chatType: "channel",
    },
    {
      id: 7,
      type: "reaction",
      text: "Bilal reacted with to your message in #AI Project",
      time: "Yesterday",
      unread: false,
      targetChat: "AI Project",
      chatType: "channel",
    },
  ]);

  // 2. Backend se conversation users fetch karne ka function
  const fetchConversations = async () => {
    try {
      const res = await API.get("/messages/conversations");
      console.log("Conversations:", res.data.data);
      if (res.data.success) {
        setDmUsers(res.data.data); // Database se aaye hue active DM users update ho gaye
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  // 3. Component mount hone par call karein
  useEffect(() => {
    fetchConversations();
  }, []);

  // 2. Naya channel add karne ka function
  const addNewChannel = async (channelData) => {
    try {
      const payload = {
        name: channelData.name,
        description: channelData.description,
        is_private: channelData.is_private,
        type: channelData.is_private ? "private" : "public",
      };

      const res = await API.post("/channels/create", payload);

      console.log("Channel Ceated Now:", res);

      if (res.data.success) {
        setChannels((prev) => [...prev, res.data.data.name]);
        fetchMyChannels();
        switchChat(res.data.data.name, "channel");
      }
      triggerToast(
        "Channel '" + res.data.data.name + "' created successfully!",
        "success",
      );
    } catch (err) {
      triggerToast(
        "Error creating channel: " +
          (err.response?.data?.message || err.message),
        "error",
      );
    }
  };

  const startNewDM = (user) => {
    console.log("Check User DM List", user, dmUsers);
    const isAlreadyAdded = dmUsers.some(
      (existingUser) => existingUser.id === user.id,
    );

    if (!isAlreadyAdded) {
      setDmUsers((prev) => [...prev, user]);
    }
    switchChat(user.full_name, "dm", user.id);
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const onEmojiClick = (emojiData) => {
    setInputText((prev) => prev + emojiData.emoji);
    // setShowEmojiPicker(false);
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

  const [chatData, setChatData] = useState({});

  const handleAddMember = async (memberObj) => {
    console.log("memberObj:", memberObj, activeChat.id);

    if (!memberObj || !activeChat?.id) return;

    try {
      const payload = {
        channelId: activeChat.id,
        userId: memberObj.User.id,
        role: "member",
      };

      const res = await API.post("/channels/add-member", payload);

      console.log("Add Member Response", res);

      if (res.data.success) {
        const savedMember = res.data.data;

        const newMember = {
          id: savedMember.User.id,
          user: savedMember.User.full_name,
          role: savedMember.role_in_channel,
          status: savedMember.User.status,
          email: savedMember.User.email,
          avatar_url: savedMember.User.avatar_url,
          text: "I am added",
          startdate: savedMember.createdAt,
          isMe: false,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setChatData((prev) => ({
          ...prev,
          [activeChat.id]: [...(prev[activeChat.id] || []), newMember],
        }));

        setChannelMembers((prev) => {
          const isAlreadyAdded = prev.some((m) => m.id === newMember.id);
          if (isAlreadyAdded) return prev;
          return [
            ...prev,
            {
              id: savedMember.User.id,
              full_name: savedMember.User.full_name,
              email: savedMember.User.email,
              avatar_url: savedMember.User.avatar_url,
              status: savedMember.User.status,
              role: savedMember.role_in_channel,
              isMe: true,
            },
          ];
        });
      }

      triggerToast("Add Successfully", "success");
    } catch (err) {
      console.error("Error adding member:", err);
      triggerToast(
        err.response?.data?.message || "Failed to add member to channel",
        "error",
      );
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Logged in user:", user.id);

  // 2. States for UI/Modals
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isDMModalOpen, setIsDMModalOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [channelMembers, setChannelMembers] = useState([]);

  const currentUserId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).id
    : null;

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChat) return;

    console.log("Active chat:", activeChat.id);

    const currentInput = inputText.trim();
    setInputText(""); // Local input ko foran empty kar dein taake UI fast lage

    try {
      const payload = {
        text: currentInput,
        type: activeChat.type, // 'channel' ya 'dm'
        channelId: activeChat.type === "channel" ? activeChat.id : null,
        receiverId: activeChat.type === "dm" ? activeChat.id : null,
      };

      // 1. API Call karein
      const res = await API.post("/messages/send", payload);
      console.log("Saved Message:", res.data.data.Sender);

      if (res.data.success) {
        const savedMsg = res.data.data;

        // 2. Backend se aane wale data ke mutabiq frontend object banayein
        const newMessage = {
          id: savedMsg.id,
          user: savedMsg.Sender?.full_name || "Yasir",
          time: new Date(savedMsg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: savedMsg.content,
          isMe: savedMsg.sender_id === currentUserId,
          email: savedMsg.Sender?.email || "yasir@dev.com",
          status: savedMsg.Sender?.status || "Active",
          role: "Developer",
          color: "bg-blue-500",
          avatar_url: savedMsg.Sender?.avatar_url || null,
        };

        // 3. State update karein
        setChatData((prev) => ({
          ...prev,
          [activeChat.name]: [...(prev[activeChat.name] || []), newMessage],
        }));
      }

      triggerToast("Message sent!", "success");
    } catch (err) {
      console.error("Error sending message:", err);
      // Agar api fail ho jaye toh input text ko wapas restore kar sakte hain user ke liye
      setInputText(currentInput);
      alert(err.response?.data?.message || "Failed to send message");
    }
  };

  const [isChatLoading, setIsChatLoading] = useState(false);

  const switchChat = async (name, type, id = null) => {
    console.log("Check OnSelector Data:", name, type, id);

    setActiveChat({ name, type, id });
    setChatMembers([]);
    // 2. Agar ID nahi hai, toh API call skip karein aur empty load karein
    if (!id) {
      if (!chatData[name]) {
        setChatData((prev) => ({ ...prev, [name]: [] }));
      }
      return;
    }

    try {
      setIsChatLoading(true);
      let endpoint =
        type === "channel" ? `/messages/channel/${id}` : `/messages/dm/${id}`;

      const res = await API.get(endpoint);

      console.log("Messages:", res.data.data);

      if (res.data.success) {
        // Backend se aye hue messages ko aapke existing format mein convert karein
        const formattedMessages = (res.data.data.messages || res.data.data).map(
          (msg) => ({
            id: msg.id,
            user: msg.Sender?.full_name || "Unknown",
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            text: msg.content,
            isMe: msg.sender_id === currentUserId, // Logged in check
            status: msg.Sender?.status || "Active",
            email: msg.Sender?.email || "",
            role: "Developer",
            color: "bg-blue-500", // Koi default color
            avatar_url: msg.Sender?.avatar_url || null,
          }),
        );

        // State update karein for this specific chat name
        setChatData((prev) => ({
          ...prev,
          [name]: formattedMessages,
        }));

        // Agar channel hai toh members ko separate state mein save karein
        if (type === "channel" && res.data.data.members) {
          setChannelMembers(res.data.data.members);
        }
      }
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    } finally {
      // Request complete hone par loading false kar dein
      setIsChatLoading(false);
    }
  };

  const handleUserClick = (userData) => {
    setSelectedUser(userData);
    setIsProfileOpen(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData, activeChat]);

  console.log("Chat Data:", chatData);

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
              // onClick={() => setIsSearchOpen(true)}
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
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
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
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600">
                      {member?.full_name?.charAt(0)}
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
                {activeChat.name}
              </h3>
              <button
                onClick={() => setIsMembersOpen(true)}
                className="text-[11px] text-emerald-600 font-bold hover:cursor-pointer hover:text-emerald-700 transition-all flex items-center gap-1.5"
              >
                {isChatLoading
                  ? ""
                  : activeChat?.type === "channel"
                    ? `${channelMembers.filter((u) => u.status === "active" || u.status === "Online").length} / ${channelMembers.length} Online`
                    : ""}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 mr-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold"
                >
                  U{i}
                </div>
              ))}
            </div>

            <div className="relative">
              <BellIcon
                size={20}
                className="text-slate-400 cursor-pointer hover:text-blue-600 transition-colors "
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              />
              {notifications.some((n) => n.unread) && (
                <div className="absolute -top-1 -right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-[#f5f5f593]">
          {isChatLoading ? (
            /* SCENARIO 1: LOADING SKELETON (Flicker se bachata hai) */
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] animate-pulse">
              {/* <div className="flex space-x-2">
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xs text-slate-400 font-bold mt-4 tracking-wider uppercase">Loading Chat...</span> */}
            </div>
          ) : (chatData[activeChat.name] || []).length > 0 ? (
            /* SCENARIO 2: MESSAGES LIST (Data load ho gya) */
            <>
              <div className="text-center relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <span className="relative bg-[#f5f5f593] px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Today
                </span>
              </div>

              {(chatData[activeChat.name] || []).map((msg) => (
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
                        src={`http://localhost:4002${msg.avatar_url}`}
                        alt="Avatar"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      msg.user[0].toUpperCase()
                    ) }
                    {/* {msg.user ? msg.user[0].toUpperCase() : "U"} */}
                  </div>

                  {/* Message Content Container */}
                  <div
                    className={`flex flex-col max-w-lg ${msg.isMe ? "items-end" : "items-start"}`}
                  >
                    {/* User Name & Time (Meta info above bubble) */}
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
                        <div className="flex flex-col gap-3 min-w-[240px]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-indigo-200">
                              <Video size={18} className="text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">
                                Video Meeting
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Started by {msg.user}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setIsVideoModalOpen(true)}
                            className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                          >
                            Join Meeting <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="whitespace-pre-wrap break-words">
                            {msg.text}
                          </p>
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
          )}
        </div>

        {/* Message Input Area */}
        <div className="px-8 pb-8 pt-2 bg-[#f5f5f593]">
          <div className="bg-white border border-slate-200 rounded-[24px] shadow-xl shadow-slate-200/40 focus-within:border-blue-500/40 focus-within:ring-4 ring-blue-500/5 transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full px-6 pt-5 text-[14px] text-slate-700 outline-none resize-none min-h-[60px] font-medium"
              placeholder={`Message ${activeChat.type === "channel" ? "#" : ""}${activeChat.name}...`}
            />

            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-5 text-slate-400">
                <div className="flex items-center gap-3 border-r border-slate-200 pr-4">
                  <Plus
                    className="cursor-pointer hover:text-blue-600 transition-colors"
                    size={19}
                  />
                  <Paperclip
                    className="cursor-pointer hover:text-blue-600 transition-colors"
                    size={19}
                  />
                </div>
                <AtSign
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  size={18}
                />
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
                        previewConfig={{ showPreview: false }} // Clean look ke liye preview hide kiya
                        skinTonesDisabled
                      />
                    </div>
                  )}
                </div>
                <Mic
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  size={19}
                />
                <Video
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setIsVideoModalOpen(true)}
                  size={19}
                />
                {/* Chota Arrow for Scheduling */}
                <div
                  className="cursor-pointer hover:text-blue-600 text-slate-400 transition-all p-0.5 rounded hover:bg-slate-200"
                  onClick={() => setIsScheduleModalOpen(true)}
                  title="Schedule a meeting"
                >
                  <Plus size={12} strokeWidth={3} />
                </div>
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
        {/* <MyVideoCall /> */}
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
        chatData={chatData} // Poora data pass kar diya
        onSelect={(name, type, id) => switchChat(name, type, id)}
      />
      <NotificationPopover
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
        onSelectChat={(name, type) => switchChat(name, type)}
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
        existingMembers={chatData[activeChat.name] || []}
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
        onClose={() => setIsVideoModalOpen(false)}
        roomName={activeChat.name} // Channel name as room ID
        userName="Yasir" // Current user
      />

      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleMeeting}
        roomName={activeChat.name} // Channel name as room ID
        userName="Yasir" // Current user
      />
    </div>
  );
};

// handleScheduleMeeting
export default DevChat;
