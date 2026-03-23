import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, ChevronDown, Folder, FileCode, Sidebar as SidebarIcon, 
  Copy, X, Brain, Paperclip, Send, ChevronRight, FileJson, FileText, 
  Image as ImageIcon, FolderPlus, FilePlus, Terminal as TerminalIcon,
  Settings, Activity
} from 'lucide-react';

const IDEBody = () => {
  const location = useLocation();
  const [showExplorer, setShowExplorer] = useState(true);
  const [rightPanel, setRightPanel] = useState('AI');
  const [openTabs, setOpenTabs] = useState(['index.js']);
  const [activeTab, setActiveTab] = useState('index.js');
  
  // --- Project Data State ---
  const [projectData, setProjectData] = useState(location.state?.folderData || { 
    id: 'root',
    name: "UCollyx_Project", 
    type: 'folder', 
    children: [
        { id: '1', name: 'index.js', type: 'file' },
        { id: '2', name: 'styles.css', type: 'file' },
        { id: '3', name: 'App.jsx', type: 'file' }
    ] 
  });

  // --- Tab Logic ---
  const openFile = (fileName) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName]);
    }
    setActiveTab(fileName);
  };

  const closeTab = (e, fileName) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(tab => tab !== fileName);
    setOpenTabs(newTabs);
    if (activeTab === fileName && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1]);
    } else if (newTabs.length === 0) {
      setActiveTab('');
    }
  };

  // --- Item Creation Logic ---
  const addItem = (parentId, type) => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      type: type,
      children: type === 'folder' ? [] : undefined
    };

    const updateTree = (nodes) => {
      return nodes.map(node => {
        if (node.id === parentId) return { ...node, children: [...(node.children || []), newItem] };
        if (node.children) return { ...node, children: updateTree(node.children) };
        return node;
      });
    };

    if (parentId === 'root') {
      setProjectData({ ...projectData, children: [...projectData.children, newItem] });
    } else {
      setProjectData({ ...projectData, children: updateTree(projectData.children) });
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)] bg-[#09090b] text-zinc-300 text-sm font-sans">
      
      {/* --- Sidebar: File Explorer --- */}
      {showExplorer && (
        <aside className="w-64 border-r border-zinc-800/60 flex flex-col bg-[#0c0c0e] animate-in slide-in-from-left duration-300">
          <div className="p-4 flex justify-between items-center border-b border-zinc-800/50">
            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-500">Explorer</span>
            <div className="flex gap-2 text-zinc-500">
              <FilePlus size={14} className="cursor-pointer hover:text-blue-400" onClick={() => addItem('root', 'file')} />
              <FolderPlus size={14} className="cursor-pointer hover:text-blue-400" onClick={() => addItem('root', 'folder')} />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
             <div className="flex items-center gap-2 px-4 py-2 text-zinc-100 font-bold bg-zinc-800/20 mb-2">
                <Folder size={16} className="text-blue-500" />
                <span className="truncate">{projectData.name}</span>
             </div>
             <div className="px-2">
                {projectData.children?.map((child) => (
                    <FileTreeItem 
                        key={child.id} 
                        item={child} 
                        depth={1} 
                        onAdd={addItem} 
                        isActive={activeTab === child.name}
                        onFileClick={openFile}
                    />
                ))}
             </div>
          </div>
        </aside>
      )}

      {/* --- Main Editor Section --- */}
      <section className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {/* Toolbar */}
        <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-[#0c0c0e]">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowExplorer(!showExplorer)} className={`p-1.5 rounded-md hover:bg-zinc-800 transition-all ${!showExplorer ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-500'}`}>
              <SidebarIcon size={18} />
            </button>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800/40 border border-zinc-700/30 rounded-full">
              <div className="flex -space-x-1.5">
                {[1, 2, 3].map(i => (
                  <img key={i} className="w-5 h-5 rounded-full border border-zinc-900 shadow-sm" src={`https://i.pravatar.cc/150?u=${i+25}`} alt="u" />
                ))}
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">3 Online</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setRightPanel(rightPanel === 'AI' ? null : 'AI')}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${rightPanel === 'AI' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${rightPanel === 'AI' ? 'bg-white animate-pulse' : 'bg-zinc-500'}`} /> AI Assistant
            </button>
            <button 
              onClick={() => setRightPanel(rightPanel === 'Context' ? null : 'Context')}
              className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${rightPanel === 'Context' ? 'bg-zinc-100 text-zinc-900 shadow-lg shadow-white/10' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >
               Context
            </button>
          </div>
        </div>

        {/* Dynamic Tab Bar */}
        <div className="flex bg-[#0c0c0e] border-b border-zinc-800 overflow-x-auto no-scrollbar">
          {openTabs.map((tab) => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`group flex items-center gap-2 px-4 py-2.5 border-r border-zinc-800 text-[11px] min-w-[140px] cursor-pointer transition-all ${activeTab === tab ? 'bg-[#09090b] text-blue-400 border-t-2 border-t-blue-500' : 'text-zinc-500 hover:bg-zinc-800/40'}`}
            >
              <FileCode size={14} className={activeTab === tab ? "text-blue-400" : "text-zinc-600"} /> 
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
        <div className="flex-1 overflow-auto p-6 font-mono text-[13px] leading-relaxed bg-[#09090b]">
          {activeTab ? (
            <div className="flex">
              <div className="w-10 text-zinc-700 text-right pr-4 border-r border-zinc-800/30 mr-4 select-none">
                {Array.from({length: 15}).map((_, i) => <div key={i}>{i+1}</div>)}
              </div>
              <pre className="text-zinc-300">
                <code>
                  <span className="text-purple-400 italic">import</span> {'{ useState }'} <span className="text-purple-400">from</span> <span className="text-emerald-400">"react"</span>;<br/>
                  <span className="text-zinc-600">// Currently editing: {activeTab}</span><br/>
                  <span className="text-blue-400 italic">const</span> <span className="text-yellow-200">MainComponent</span> = () ={'>'} {'{'}<br/>
                  &nbsp;&nbsp;<span className="text-blue-400 italic">return</span> <span className="text-emerald-400">"Building with UCollyx"</span>;<br/>
                  {'}'}
                </code>
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
              <SidebarIcon size={40} className="opacity-10" />
              <p className="text-xs uppercase tracking-widest font-bold opacity-30">No Active File</p>
            </div>
          )}
        </div>

        {/* Bottom Terminal Section */}
        <div className="h-40 border-t border-zinc-800 flex flex-col bg-[#0c0c0e]">
          <div className="px-4 py-2 border-b border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon size={12} className="text-zinc-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Terminal</span>
            </div>
            <div className="flex gap-4 text-[10px] font-bold text-zinc-600">
              <span className="text-blue-500 cursor-pointer">Output</span>
              <span className="cursor-pointer">Debug Console</span>
            </div>
          </div>
          <div className="p-4 font-mono text-xs text-zinc-400">
            <div className="flex gap-2">
              <span className="text-emerald-500 font-bold">➜</span> 
              <span className="text-blue-400 font-bold">~/ucollyx-dev</span>
              <span className="text-zinc-200">npm start</span>
            </div>
            <div className="mt-2 text-zinc-500 leading-tight">
              [v-1.0.4] Compiled successfully in 842ms<br/>
              Local: <span className="text-blue-400 underline cursor-pointer">http://localhost:3000</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Right Panels --- */}
      {rightPanel === 'AI' && <AIPanel onClose={() => setRightPanel(null)} />}
      {rightPanel === 'Context' && <ContextPanel onClose={() => setRightPanel(null)} />}
      
    </div>
  );
};

// --- Recursive Tree Component ---
const FileTreeItem = ({ item, depth, onAdd, isActive, onFileClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = item.type === 'folder';

  return (
    <div className="select-none">
      <div 
        onClick={() => isFolder ? setIsOpen(!isOpen) : onFileClick(item.name)}
        style={{ paddingLeft: `${depth * 12}px` }}
        className={`flex items-center justify-between py-1.5 px-2 cursor-pointer rounded-md transition-all group mb-0.5 ${isActive ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500' : 'hover:bg-zinc-800/40 text-zinc-400'}`}
      >
        <div className="flex items-center gap-2 truncate">
          {isFolder ? (isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : <div className="w-3" />}
          {isFolder ? <Folder size={14} className={isOpen ? 'text-blue-500 fill-blue-500/10' : 'text-zinc-600'} /> : <FileCode size={14} className="text-zinc-500" />}
          <span className="text-[12px] truncate">{item.name}</span>
        </div>
        {isFolder && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <FilePlus size={12} className="hover:text-white" onClick={(e) => { e.stopPropagation(); onAdd(item.id, 'file') }} />
            <FolderPlus size={12} className="hover:text-white" onClick={(e) => { e.stopPropagation(); onAdd(item.id, 'folder') }} />
          </div>
        )}
      </div>

      {isFolder && isOpen && item.children && (
        <div className="border-l border-zinc-800/40 ml-4">
          {item.children.map((child) => (
            <FileTreeItem key={child.id} item={child} depth={depth + 1} onAdd={onAdd} isActive={isActive} onFileClick={onFileClick} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- AI Assistant Panel ---
const AIPanel = ({ onClose }) => (
  <aside className="w-80 border-l border-zinc-800 bg-[#0c0c0e] flex flex-col animate-in slide-in-from-right duration-300">
    <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
      <div className="flex items-center gap-2">
        <Brain size={18} className="text-blue-500" />
        <span className="text-[10px] font-black uppercase tracking-widest">Assistant</span>
      </div>
      <X size={18} className="cursor-pointer text-zinc-600 hover:text-white" onClick={onClose} />
    </div>
    <div className="flex-1 p-6 flex flex-col justify-end">
       <div className="space-y-4 mb-4">
          <div className="bg-zinc-800/40 p-3 rounded-lg border border-zinc-700/30 text-xs leading-relaxed">
            I can help you refactor your components or explain complex logic.
          </div>
       </div>
       <div className="relative">
          <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs outline-none focus:border-blue-500/50 resize-none h-24" placeholder="Ask anything..." />
          <button className="absolute right-3 bottom-3 bg-blue-600 p-1.5 rounded-lg hover:bg-blue-500"><Send size={14}/></button>
       </div>
    </div>
  </aside>
);

// --- Context Panel ---
const ContextPanel = ({ onClose }) => (
  <aside className="w-80 border-l border-zinc-800 bg-[#0c0c0e] flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
    <div className="p-4 bg-zinc-900/40 border-b border-zinc-800 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Activity size={16} className="text-zinc-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Context</span>
      </div>
      <X size={18} className="cursor-pointer text-zinc-500 hover:text-white" onClick={onClose} />
    </div>
    <div className="p-4 space-y-6">
      <div>
        <h4 className="text-[10px] font-black uppercase text-zinc-600 mb-3 tracking-widest">Project Health</h4>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-emerald-500" />
        </div>
        <p className="text-[10px] mt-2 text-zinc-500">All systems operational</p>
      </div>
      <div className="space-y-2">
        {['Environment', 'Git History', 'Deployment'].map(item => (
          <div key={item} className="flex justify-between items-center p-3 bg-zinc-800/20 border border-zinc-800/40 rounded-lg hover:border-zinc-700 cursor-pointer">
            <span className="text-xs">{item}</span>
            <ChevronRight size={14} className="text-zinc-700" />
          </div>
        ))}
      </div>
    </div>
  </aside>
);

export default IDEBody;