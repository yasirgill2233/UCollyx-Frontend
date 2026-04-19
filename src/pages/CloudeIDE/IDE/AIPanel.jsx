import { Brain, Send, X } from "lucide-react";
import React from "react";

const AIPanel = ({
  onClose,
  chatHistory,
  aiInput,
  setAiInput,
  handleAISend,
  isTyping,
}) => {
  // Auto-scroll logic
  const chatEndRef = React.useRef(null);
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <aside className="flex-shrink-0 border-l border-zinc-800 bg-[#0c0c0e] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
            Assistant
          </span>
        </div>
        <X
          size={18}
          className="cursor-pointer text-zinc-600 hover:text-white"
          onClick={onClose}
        />
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[600px] p-3 rounded-xl text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-zinc-800/60 text-zinc-300 border border-zinc-700/30 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-800/60 p-3 rounded-xl rounded-bl-none border border-zinc-700/30">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/20">
        <div className="relative">
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAISend();
              }
            }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pr-10 text-xs text-zinc-300 outline-none focus:border-blue-500/50 resize-none h-20"
            placeholder="Ask anything..."
          />
          <button
            onClick={handleAISend}
            className="absolute right-2 bottom-2 bg-blue-600 p-1.5 rounded-lg hover:bg-blue-500 transition-colors text-white"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AIPanel;