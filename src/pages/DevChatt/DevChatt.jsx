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
  X,
  FileText,
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

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const handleScheduleMeeting = () => {
    const callMessage = {
      id: Date.now(),
      user: "Yasir",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: "Started a video call",
      type: "call",
      isMe: true,
    };

    setChatData((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), callMessage],
    }));

    setIsVideoModalOpen(true);
  };

  const [channels, setChannels] = useState([]);

  const fetchMyChannels = async () => {
    try {
      const res = await API.get("/channels/my-channels");
      console.log("Channels:", res.data.data);
      if (res.data.success) {
        setChannels(res.data.data);

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

  useEffect(() => {
    fetchMyChannels();
  }, []);

  const [dmUsers, setDmUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [notifications, setNotifications] = useState([]);

  const fetchConversations = async () => {
    try {
      const res = await API.get("/messages/conversations");
      console.log("Conversations:", res.data.data);
      if (res.data.success) {
        setDmUsers(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

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
          created_at: savedMember.User?.created_at,
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

  // const handleSendMessage = async () => {
  //   if (!inputText.trim() || !activeChat) return;

  //   console.log("Active chat:", activeChat.id);

  //   const currentInput = inputText.trim();
  //   setInputText("");

  //   try {
  //     const payload = {
  //       text: currentInput,
  //       type: activeChat.type, // 'channel' ya 'dm'
  //       name: activeChat.name, // 'channel' ya 'dm'
  //       channelId: activeChat.type === "channel" ? activeChat.id : null,
  //       receiverId: activeChat.type === "dm" ? activeChat.id : null,
  //     };

  //     const res = await API.post("/messages/send", payload);

  //     if (res.data.success) {
  //       const savedMsg = res.data.data;

  //       const newMessage = {
  //         id: savedMsg.id,
  //         user: savedMsg.Sender?.full_name || "Yasir",
  //         time: new Date(savedMsg.createdAt).toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         }),
  //         text: savedMsg.content,
  //         isMe: savedMsg.sender_id === currentUserId,
  //         email: savedMsg.Sender?.email || "yasir@dev.com",
  //         status: savedMsg.Sender?.status || "active",
  //         created_at: savedMsg.Sender?.created_at,
  //         role: "Developer",
  //         color: "bg-blue-500",
  //         avatar_url: savedMsg.Sender?.avatar_url || null,
  //       };

  //       setChatData((prev) => ({
  //         ...prev,
  //         [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
  //       }));
  //     }

  //     triggerToast("Message sent!", "success");
  //   } catch (err) {
  //     console.error("Error sending message:", err);
  //     setInputText(currentInput);
  //     alert(err.response?.data?.message || "Failed to send message");
  //   }
  // };


  const handleSendMessage = async () => {
  // Check karein ke text hai YA files hain
  if ((!inputText.trim() && selectedFiles.length === 0) || !activeChat) return;

  const currentInput = inputText.trim();
  const currentFiles = [...selectedFiles]; // Files ka backup lein error handling ke liye

  // IDs se prefix khatam karke asli numeric ID nikalen
  const numericId = activeChat.id.toString().includes("-") 
    ? activeChat.id.split("-")[1] 
    : activeChat.id;

  setInputText("");
  setSelectedFiles([]); // Files foran clear karein UI se

  try {
    // 1. FormData object banayein (Kyuki attachments bhejni hain)
    const formData = new FormData();
    formData.append("text", currentInput);
    formData.append("type", activeChat.type);
    
    if (activeChat.type === "channel") {
      formData.append("channelId", numericId);
    } else {
      formData.append("receiverId", numericId);
    }

    // 2. Files ko loop mein add karein
    currentFiles.forEach((file) => {
      formData.append("attachments", file); // Backend field name 'attachments'
    });

    // Axios khud boundary set kar lega jab wo FormData dekhega
    const res = await API.post("/messages/send", formData);

    if (res.data.success) {
      const savedMsg = res.data.data;

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
        status: savedMsg.Sender?.status || "active",
        created_at: savedMsg.Sender?.created_at,
        role: "Developer",
        color: "bg-blue-500",
        avatar_url: savedMsg.Sender?.avatar_url || null,
        // Attachment data agar backend se wapis aa raha hai
        attachments: savedMsg.attachments || [], 
      };

      setChatData((prev) => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
      }));

      // --- CHANNEL LIST UPDATE (TOP PAR LANAY KA LOGIC) ---
      if (activeChat.type === "channel") {
        setChannels((prev) => {
          const current = prev.find((c) => c.id === activeChat.id);
          const others = prev.filter((c) => c.id !== activeChat.id);
          if (!current) return prev;
          // UpdatedAt ko force update karein taake UI top par le aaye
          return [{ ...current, updatedAt: new Date().toISOString() }, ...others];
        });
      }
    }

    triggerToast("Message sent!", "success");
  } catch (err) {
    console.error("Error sending message:", err);
    // Error ki surat mein data wapis set karein
    setInputText(currentInput);
    setSelectedFiles(currentFiles);
    alert(err.response?.data?.message || "Failed to send message");
  }
};

  const [isChatLoading, setIsChatLoading] = useState(false);

  const switchChat = async (name, type, id = null) => {
    console.log("Check OnSelector Data:", name, type, id);

    setActiveChat({ name, type, id });
    setChatMembers([]);
    if (!id) {
      if (!chatData[id]) {
        setChatData((prev) => ({ ...prev, [id]: [] }));
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
        const formattedMessages = (res.data.data.messages || res.data.data).map(
          (msg) => ({
            id: msg.id,
            user: msg.Sender?.full_name || "Unknown",
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            text: msg.content,
            isMe: msg.sender_id === currentUserId,
            status: msg.Sender?.status || "Active",
            email: msg.Sender?.email || "",
            created_at: msg.Sender?.created_at,
            role: "Developer",
            color: "bg-blue-500",
            avatar_url: msg.Sender?.avatar_url || null,
            attachments: msg.attachments || [], 
          }),
        );

        setChatData((prev) => ({
          ...prev,
          [id]: formattedMessages,
        }));

        if (type === "channel" && res.data.data.members) {
          setChannelMembers(res.data.data.members);
        }
      }
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    } finally {
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

  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  const loadNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      console.log("Notifications:", res.data.data);
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const getLatestChat = (channels, dms) => {
    const allChats = [
      ...channels.map((c) => ({ ...c, type: "channel" })),
      ...dms.map((d) => ({ ...d, type: "dm", name: d.full_name })),
    ];

    console.log("All Chats for Latest Check:", allChats);

    if (allChats.length === 0) return null;

    // Sort by updatedAt ya latestMessage time
    return allChats.sort((a, b) => {
      const timeA = new Date(
        a.updatedAt || a.createdAt || a.updated_at || a.created_at,
      ).getTime();
      const timeB = new Date(
        b.updatedAt || b.createdAt || b.updated_at || b.created_at,
      ).getTime();
      return timeB - timeA; // Descending order (latest first)
    })[0];
  };

  useEffect(() => {
    // Page load par agar channels aur dms aa gaye hain aur activeChat khali hai
    if ((channels.length > 0 || dmUsers.length > 0) && !activeChat?.id) {
      const latest = getLatestChat(channels, dmUsers);

      if (latest) {
        console.log("Auto-switching to latest chat:", latest.name);
        // switchChat use karein taake messages fetch hon
        switchChat(
          latest.name || latest.full_name,
          latest.type || (latest.full_name ? "dm" : "channel"),
          latest.id,
        );
      }
    }
  }, [channels, dmUsers]); // Jab data load ho, tab chale

  const [selectedFiles, setSelectedFiles] = useState([]);
const fileInputRef = useRef(null);

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  setSelectedFiles((prev) => [...prev, ...files]);
};

const removeFile = (index) => {
  setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
};

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
              {activeChat?.type === "channel" && (
                <div
                  className="flex -space-x-2 hover:cursor-pointer"
                  onClick={() => setIsMembersOpen(true)}
                >
                  {channelMembers
                    ?.filter((member) => member.status === "active")
                    .slice(0, 4)
                    .map((i) => (
                      <div
                        key={i.id || i}
                        className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden uppercase text-slate-600"
                      >
                        {i.avatar_url ? (
                          <img
                            src={import.meta.env.VITE_API_URL + i.avatar_url}
                            alt={i.full_name}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{i.full_name?.charAt(0) || "U"}</span>
                        )}
                      </div>
                    ))}

                  {channelMembers?.filter((m) => m.status === "active").length >
                    4 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      +
                      {channelMembers.filter((m) => m.status === "active")
                        .length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <BellIcon
                size={20}
                className="text-slate-400 cursor-pointer hover:text-blue-600 transition-colors "
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              />
              {notifications.some((n) => !n.is_read) && (
                <div className="absolute -top-1 -right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-[#f5f5f593]">
          {isChatLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] animate-pulse"></div>
          ) : (chatData[activeChat.id] || []).length > 0 ? (
            <>
              {(chatData[activeChat.id] || []).map((msg) => (
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
                        // <div>
                        //   <p className="whitespace-pre-wrap break-words">
                        //     {renderMessageWithMentions(msg.text)}
                        //   </p>
                        // </div>

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
            const fileUrl = `${import.meta.env.VITE_API_URL}/${file.path.replace(/\\/g, '/')}`;
            const isImage = file.mimetype.startsWith('image/');

            return (
              <div key={idx} className="max-w-[250px]">
                {isImage ? (
                  // Image Preview
                  <a href={fileUrl} target="_blank" rel="noreferrer">
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
      <div key={index} className="relative group bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2 pr-8 shadow-sm">
        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">
          <Paperclip size={14} />
        </div>
        <span className="text-xs font-medium text-slate-600 truncate max-w-[120px]">{file.name}</span>
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
                  <Plus
                    className="cursor-pointer hover:text-blue-600 transition-colors"
                    size={19}
                    onClick={() => fileInputRef.current.click()}
                  />
                  {/* <Paperclip
                    className="cursor-pointer hover:text-blue-600 transition-colors"
                    size={19}
                  /> */}
                </div>
                {/* <AtSign
                  className="cursor-pointer hover:text-blue-600 transition-colors"
                  size={18}
                /> */}
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
