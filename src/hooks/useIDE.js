import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Editor } from "@monaco-editor/react";

import { FileIcon, defaultStyles } from "react-file-icon";

import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { io } from "socket.io-client";
import TerminalComponent from "../pages/CloudeIDE/TerminalComponent";
import axios from "axios";
import toast from "react-hot-toast";

// 1. AI API Function (Keep only this one)
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

export const useIDE = () => {
  const location = useLocation();

  const [showExplorer, setShowExplorer] = useState(true);
  const [rightPanel, setRightPanel] = useState("AI");
  const [openTabs, setOpenTabs] = useState(["index.js"]);
  const [activeTab, setActiveTab] = useState("index.js");
  const [projectData, setProjectData] = useState({ id: "root", name: "UCollyx", children: [] });
  const [fileContents, setFileContents] = useState({});
  const [activeFilePath, setActiveFilePath] = useState("");
  const [chatHistory, setChatHistory] = useState([{ role: "ai", text: "How can I help?" }]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiInput, setAiInput] = useState("");

  const [saveTimeout, setSaveTimeout] = useState(null); // File path track karne ke liye

  const [menuPos, setMenuPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    targetId: null,
  });

//   const [activeFilePath, setActiveFilePath] = useState("");

//   const [chatHistory, setChatHistory] = useState([
//     {
//       role: "ai",
//       text: "I can help you refactor your components or explain complex logic. How can I help you today?",
//     },
//   ]);

  // 2. Monaco Editor Configuration
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

  // --- Project Data State ---
//   const [projectData, setProjectData] = useState(
//     location.state?.folderData || {
//       id: "root",
//       name: "UCollyx_Project",
//       type: "folder",
//       children: [
//         { id: "1", name: "index.js", type: "file" },
//         { id: "2", name: "styles.css", type: "file" },
//         { id: "3", name: "App.jsx", type: "file" },
//       ],
//     },
//   );

  useEffect(() => {
    const loadInitialTree = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/api/files/tree",
        );
        setProjectData(response.data);
      } catch (error) {
        console.error("Error loading file tree:", error);
      }
    };
    loadInitialTree();
  }, []);

  // Menu dikhane ka function
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

  // Menu band karne ke liye
  const closeMenu = () => setMenuPos({ ...menuPos, visible: false });

  // 1. Backend se tree load karo
  const refreshTree = async () => {
    const res = await axios.get("http://localhost:4001/api/files/tree");
    setProjectData(res.data);
  };

  useEffect(() => {
    refreshTree();
  }, []);

//   const [fileContents, setFileContents] = useState({
//     "index.js": `// Welcome to UCollyx IDE\nfunction helloWorld() {\n  console.log("Hello, Yasir!");\n}`,
//     "styles.css": `body {\n  background: #09090b;\n  color: white;\n}`,
//     "App.jsx": `export default function App() {\n  return <h1>UCollyx in action</h1>\n}`,
//   });

  // 2. Language Detector Logic
  
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
    setActiveTab(name);
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
          parentPath: parentPath,
          name: name,
          type: type,
        },
      );

      if (response.data.success) {
        refreshTree(); // List refresh karein taake naya item nazar aaye
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

return {
    showExplorer, setShowExplorer, rightPanel, setRightPanel,
    openTabs, setOpenTabs, activeTab, setActiveTab,
    projectData, fileContents, setFileContents,
    chatHistory, isTyping, aiInput, setAiInput,
    handleAISend, refreshTree, activeFilePath, setActiveFilePath,
    addItem: async (parentId, type) => { /* tumhara original addItem logic */ },
    deleteItem: async (path) => { /* tumhara original delete logic */ },
    openFile: async (path, name) => { setActiveTab(name); setActiveFilePath(path); }
  };
};



// export default useIDE;

