import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Plus,
  ChevronDown,
  Folder,
  FileCode,
  Sidebar as SidebarIcon,
  Copy,
  X,
  Brain,
  Paperclip,
  Send,
  ChevronRight,
  FileJson,
  FileText,
  Image as ImageIcon,
  FolderPlus,
  FilePlus,
  Terminal as TerminalIcon,
  Settings,
  Activity,
  Save,
  SaveAll,
} from "lucide-react";
import { Editor } from "@monaco-editor/react";

import { FileIcon, defaultStyles } from "react-file-icon";

import AIPanel from "./IDE/AIPanel";

import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

import socket from "../../context/SocketContext";
import TerminalComponent from "./TerminalComponent";
import axios from "axios";
import toast from "react-hot-toast";
import { FileTreeItem } from "./IDE/FileTreeItem";

const getAISuggestion = async (codeSnippet) => {
  try {
    const res = await axios.post("http://localhost:11434/api/generate", {
      model: "deepseek-coder:1.3b",
      // model: "codellama:7b",
      prompt: `Instruction: Provide ONLY the code completion. No explanations, no markdown, no greetings. only code suggestion
      Context: \n ${codeSnippet}`,
      stream: false,
    });
    return res.data.response;
  } catch (error) {
    console.error("Ollama connection error:", error);
    return "";
  }
};

const IDEBody = () => {
  const location = useLocation();
  const param = useParams();
  console.log("Route Params:", param);
  const [showExplorer, setShowExplorer] = useState(true);
  const [rightPanel, setRightPanel] = useState("AI");
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "ai",
      text: "I can help you refactor your components or explain complex logic. How can I help you today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleEditorDidMount = (editor, monaco) => {
    console.log("✅ Monaco Editor Load Ho Gaya!");

    monaco.languages.registerInlineCompletionsProvider("javascript", {
      provideInlineCompletions: async (model, position) => {
        console.log("⌨️ Typing detected, checking for suggestions...");

        const codeBefore = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // Local console check
        console.log("📄 Context captured:", codeBefore.slice(-20));

        try {
          const suggestion = await getAISuggestion(codeBefore);
          console.log("🤖 AI Response Received:", suggestion);

          return {
            items: [
              {
                insertText: suggestion,
                range: new monaco.Range(
                  position.lineNumber,
                  position.column,
                  position.lineNumber,
                  position.column,
                ),
              },
            ],
          };
        } catch (err) {
          console.error("❌ API Call Failed:", err);
          return { items: [] };
        }
      },
    });
  };

  const loadProject = async (id) => {
    setActiveProjectId(id); // Pehle ID set karo
    await refreshTree(id); // Phir us ID ke liye tree load karo
  };

  // Inside IDEBody.jsx
  useEffect(() => {
    // Jab project active ho, tabhi socket init karo
    if (activeProjectId) {
      socket.emit("terminal:init", activeProjectId);
    }

    // Cleanup: Jab bhi activeProjectId change hoga,
    // ye cleanup run hoga aur purana terminal band kar dega.
    return () => {
      socket.emit("terminal:close");
    };
  }, [activeProjectId]);

  const [suggestion, setSuggestion] = useState("");

  const [saveTimeout, setSaveTimeout] = useState(null);

  const [menuPos, setMenuPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    targetId: null,
  });

  const [activeFilePath, setActiveFilePath] = useState("");

  const [projectData, setProjectData] = useState(
    location.state?.folderData || {
      id: "root",
      name: "UCollyx_Project",
      type: "folder",
      children: [],
    },
  );

  // IDEBody.jsx
useEffect(() => {
  socket.on("file-tree-update", (data) => {
    console.log("📢 File system changed, refreshing tree...",data);
    console.log("File system changed, refreshing...");
    // Yahan dobara API call karo jo File Tree fetch karti hai
    refreshTree(data.path); 
  });

  return () => socket.off("file-tree-update");
}, []);

  // useEffect(() => {
  //   const loadInitialTree = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:4001/api/files/tree",
  //       );
  //       setProjectData(response.data);
  //     } catch (error) {
  //       console.error("Error loading file tree:", error);
  //     }
  //   };
  //   loadInitialTree();
  // }, []);

  const handleContextMenu = (e, itemId) => {
    e.preventDefault();
    setMenuPos({ x: e.pageX, y: e.pageY, visible: true, targetId: itemId });
  };

  const handleAISend = async () => {
    if (!aiInput.trim()) return;

    const userMessage = { role: "user", text: aiInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setAiInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:11434/api/generate", {
        // model: "codellama:7b", // ya "deepseek-coder"
        model: "deepseek-coder:1.3b",
        prompt: aiInput,
        stream: false,
      });

      const aiMessage = { role: "ai", text: res.data.response };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: "Error: Ollama se connect nahi ho pa raha." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const closeMenu = () => setMenuPos({ ...menuPos, visible: false });

  // const refreshTree = async () => {
  //   const res = await axios.get("http://localhost:4001/api/files/tree");
  //   setProjectData(res.data);
  // };

  // 1. Refresh Tree ko update karo taake woh specific project ka data laye
  const refreshTree = async (projectId) => {
    try {
      // API call mein projectID bhejo taake backend wahi folder search kare
      const res = await axios.get(
        `http://localhost:4001/api/files/tree?projectId=${projectId}`,
      );

      console.log("Tree refreshed with data:", res.data);
      setProjectData(res.data);
    } catch (e) {
      console.error("Tree load error:", e);
    }
  };

  useEffect(() => {
    loadProject(param.projectId);
  }, []);

  const [fileContents, setFileContents] = useState({});

  const getLanguage = (fileName) => {
    const ext = fileName.split(".").pop();
    if (ext === "js" || ext === "jsx") return "javascript";
    if (ext === "css") return "css";
    if (ext === "html") return "html";
    if (ext === "json") return "json";
    return "plaintext";
  };

  const handleEditorChange = (value) => {
    // 1. Foran local state update karein taake typing lag na kare
    setFileContents((prev) => ({
      ...prev,
      [activeTab]: value,
    }));

    // 2. Agar pehle se koi timer chal raha hai, to usay khatam karein
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // 3. Naya timer shuru karein (1 second baad save hoga)
    const newTimeout = setTimeout(async () => {
      if (activeFilePath) {
        try {
          await axios.post("http://localhost:4001/api/files/save", {
            path: activeFilePath,
            content: value,
          });
          console.log("💾 Auto-saved successfully!");
        } catch (err) {
          console.error("❌ Auto-save failed:", err);
        }
      }
    }, 1000);

    setSaveTimeout(newTimeout);
  };

  const deleteItem = async (path) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      await axios.post("http://localhost:4001/api/files/delete", { path });
      refreshTree();
    }
  };

  const openFile = async (path, name) => {
    console.log("File Name", name);
    setActiveTab(name);
    if (!openTabs.includes(name)) {
      setOpenTabs([...openTabs, name]);
    }
    setActiveFilePath(path); // Ye line zaroori hai!

    // Aapka purana file loading logic...
    try {
      const res = await axios.post("http://localhost:4001/api/files/content", {
        path,
      });
      setFileContents((prev) => ({ ...prev, [name]: res.data.content }));
    } catch (err) {
      console.error("Error loading file content");
    }
  };

  const closeTab = (e, fileName) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((tab) => tab !== fileName);
    setOpenTabs(newTabs);
    if (activeTab === fileName && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1]);
    } else if (newTabs.length === 0) {
      setActiveTab("");
    }
  };

  // 2. Naya File ya Folder create karne ki API
  const addItem = async (parentId, type) => {
    const name = prompt(`Enter ${type} name (e.g., test.js or myFolder):`);
    if (!name) return;

    try {
      const parentPath = parentId || projectData.id;

      const response = await axios.post(
        "http://localhost:4001/api/files/create",
        {
          projectId: activeProjectId,
          parentPath: parentPath,
          name: name,
          type: type,
        },
      );

      if (response.data.success) {
        refreshTree(param.projectId); // List refresh karein taake naya item nazar aaye
      }
    } catch (err) {
      console.error("Error creating item:", err);
      // alert("Failed to create " + type);
      const audio = new Audio("/sounds/short_bongo.mp3");
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Sound blocked"));
      toast.error("Failed to create " + type);
    }
  };

  

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)] bg-[#09090b] text-zinc-300 text-sm font-sans">
      {showExplorer && (
        <aside className="w-64 border-r border-zinc-800/60 flex flex-col bg-[#09090b] animate-in slide-in-from-left duration-300">
          <div className="h-9 flex items-center justify-between px-4">
            <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
              Explorer
            </span>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <div className="flex items-center justify-between">
              <div className="px-4 py-1.5 text-[12px] font-semibold text-zinc-300 flex items-center gap-1.5 cursor-pointer hover:text-white">
                <ChevronDown size={14} />
                {projectData?.name.toUpperCase().split('-').join(' ').replace(/[0-9]/g, '')}
              </div>

              <div className="flex px-4 gap-3 text-zinc-500">
                <FilePlus
                  size={14}
                  className="cursor-pointer hover:text-zinc-200"
                  onClick={() => addItem("root", "file")}
                />
                <FolderPlus
                  size={14}
                  className="cursor-pointer hover:text-zinc-200"
                  onClick={() => addItem("root", "folder")}
                />
              </div>
            </div>

            <div className="mt-1">
              {projectData.children?.map((child) => (
                <FileTreeItem
                  key={child.id}
                  item={child}
                  depth={1}
                  isActive={activeTab === child.name}
                  onFileClick={openFile}
                />
              ))}
            </div>
          </div>
        </aside>
      )}

      <section className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {/* Toolbar */}
        <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-[#0c0c0e]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowExplorer(!showExplorer)}
              className={`p-1.5 rounded-md hover:bg-zinc-800 transition-all ${!showExplorer ? "text-blue-400 bg-blue-500/10" : "text-zinc-500"}`}
            >
              <SidebarIcon size={18} />
            </button>

            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800/40 border border-zinc-700/30 rounded-full">
              <div className="flex -space-x-1.5">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    className="w-5 h-5 rounded-full border border-zinc-900 shadow-sm"
                    src={`https://i.pravatar.cc/150?u=${i + 25}`}
                    alt="u"
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">
                3 Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all bg-zinc-800 text-zinc-400 hover:text-white`}
            >
              <Save size={14} /> Save
            </button>

            <button
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all bg-zinc-800 text-zinc-400 hover:text-white`}
            >
              <SaveAll size={14} /> Save All
            </button>

            <button
              onClick={() => setRightPanel(rightPanel === "AI" ? null : "AI")}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${rightPanel === "AI" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${rightPanel === "AI" ? "bg-white animate-pulse" : "bg-zinc-500"}`}
              />{" "}
              AI Assistant
            </button>
            {/* <button
              onClick={() =>
                setRightPanel(rightPanel === "Context" ? null : "Context")
              }
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${rightPanel === "Context" ? "bg-zinc-100 text-zinc-900 shadow-lg shadow-white/10" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}
            >
              Context
            </button> */}
          </div>
        </div>

        {/* Dynamic Tab Bar */}
        <div className="flex bg-[#0c0c0e] border-b border-zinc-800 overflow-x-auto no-scrollbar">
          {openTabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`group flex items-center gap-2 px-4 py-2.5 border-r border-zinc-800 text-[11px] min-w-[140px] cursor-pointer transition-all ${activeTab === tab ? "bg-[#09090b] text-blue-400 border-t-2 border-t-blue-500" : "text-zinc-500 hover:bg-zinc-800/40"}`}
            >
              <FileCode
                size={14}
                className={
                  activeTab === tab ? "text-blue-400" : "text-zinc-600"
                }
              />
              <span className="truncate flex-1">{tab}</span>
              <X
                size={12}
                className="opacity-0 group-hover:opacity-100 hover:bg-zinc-700 p-0.5 rounded transition-all"
                onClick={(e) => closeTab(e, tab)}
              />
            </div>
          ))}
        </div>

        {/* Code Editor Body */}
        <div className="flex-1 overflow-auto font-mono text-[13px] leading-relaxed bg-[#09090b]">
          {activeTab && openTabs.length > 0 ? (
            <Editor
              height="100%"
              theme="vs-dark"
              language={getLanguage(activeTab)}
              value={fileContents[activeTab]}
              onChange={handleEditorChange}
              // onMount={handleEditorDidMount} // Ye zaroori hai!
              options={{
                fontSize: 14,
                num_predict: 50,
                fontFamily: "JetBrains Mono, Fira Code, monospace",
                minimap: { enabled: true },
                inlineSuggest: {
                  enabled: true,
                  mode: "prefix",
                  showToolbar: "always",
                },
                // suggestOnTriggerCharacters: true,
                // quickSuggestions: {
                //   other: true,
                //   comments: true,
                //   strings: true,
                // },
                padding: { top: 20 },
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                automaticLayout: true, // Window resize par auto-adjust hoga
              }}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
              <SidebarIcon size={40} className="opacity-10" />
              <p className="text-xs uppercase tracking-widest font-bold opacity-30">
                No Active File
              </p>
            </div>
          )}
        </div>

        {/* Bottom Terminal Section */}
        <div className="h-60 border-t border-zinc-800 flex flex-col bg-[#0c0c0e]">
          <div className="px-4 py-2 border-b border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon size={12} className="text-zinc-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Terminal
              </span>
            </div>
          </div>

          {/* Yahan humara real terminal aayega */}
          <div className="flex-1 overflow-hidden p-2">
            <TerminalComponent socket={socket} />
          </div>
        </div>
      </section>

      {rightPanel === "AI" && (
        <AIPanel
          onClose={() => setRightPanel(null)}
          chatHistory={chatHistory}
          aiInput={aiInput}
          setAiInput={setAiInput}
          handleAISend={handleAISend}
          isTyping={isTyping}
        />
      )}

      {menuPos.visible && (
        <div
          className="fixed z-50 bg-[#121214]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg py-1 w-44 animate-in fade-in zoom-in duration-150"
          style={{ top: menuPos.y, left: menuPos.x }}
          onMouseLeave={closeMenu}
        >
          <button
            onClick={() => {
              addItem(menuPos.targetId, "file");
              closeMenu();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-zinc-300 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <FilePlus size={14} /> New File
          </button>

          {/* ... baqi buttons ... */}

          <button
            onClick={() => {
              deleteItem(menuPos.targetId);
              closeMenu();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:bg-red-600 hover:text-white transition-colors"
          >
            <X size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

// --- Context Panel ---
// const ContextPanel = ({ onClose }) => (
//   <aside className="w-80 border-l border-zinc-800 bg-[#0c0c0e] flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
//     <div className="p-4 bg-zinc-900/40 border-b border-zinc-800 flex justify-between items-center">
//       <div className="flex items-center gap-2">
//         <Activity size={16} className="text-zinc-500" />
//         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
//           Context
//         </span>
//       </div>
//       <X
//         size={18}
//         className="cursor-pointer text-zinc-500 hover:text-white"
//         onClick={onClose}
//       />
//     </div>
//     <div className="p-4 space-y-6">
//       <div>
//         <h4 className="text-[10px] font-black uppercase text-zinc-600 mb-3 tracking-widest">
//           Project Health
//         </h4>
//         <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
//           <div className="h-full w-3/4 bg-emerald-500" />
//         </div>
//         <p className="text-[10px] mt-2 text-zinc-500">
//           All systems operational
//         </p>
//       </div>
//       <div className="space-y-2">
//         {["Environment", "Git History", "Deployment"].map((item) => (
//           <div
//             key={item}
//             className="flex justify-between items-center p-3 bg-zinc-800/20 border border-zinc-800/40 rounded-lg hover:border-zinc-700 cursor-pointer"
//           >
//             <span className="text-xs">{item}</span>
//             <ChevronRight size={14} className="text-zinc-700" />
//           </div>
//         ))}
//       </div>
//     </div>
//   </aside>
// );

export default IDEBody;
