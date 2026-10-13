import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const TranscriptWrapper = ({ transcript }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!transcript) return null;

  return (
    <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:border-slate-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Meeting Dialogue & Notes
        </span>
        
        <span className="text-[9px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-md">
          Formatted Transcript
        </span>
      </div>

      {/* Markdown Content Box */}
      <div
        className={`text-xs text-slate-700 leading-relaxed transition-all duration-300 ${
          isExpanded 
            ? "max-h-none overflow-visible" 
            : "max-h-24 overflow-hidden relative"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Bold text customization
            strong: ({ node, ...props }) => (
              <strong className="font-bold text-slate-900" {...props} />
            ),
            // Paragraph formatting
            p: ({ node, ...props }) => (
              <p className="mb-2 last:mb-0" {...props} />
            ),
            // Lists formatting
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside space-y-1 mb-2 text-slate-700" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="ml-2" {...props} />
            ),
            // Speaker highlights (Dialogue lines like [Speaker 1]:)
            code: ({ node, ...props }) => (
              <code className="bg-slate-200/70 text-indigo-700 font-semibold px-1.5 py-0.5 rounded text-[11px]" {...props} />
            )
          }}
        >
          {transcript}
        </ReactMarkdown>

        {/* Blur effect when collapsed */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 flex items-center gap-1.5 text-[#3b59ff] text-[11px] font-extrabold hover:text-indigo-700 transition-colors uppercase tracking-wide cursor-pointer focus:outline-none"
      >
        <span>{isExpanded ? "Show Less" : "Read Full Dialogue & Summary"}</span>
        <span className="text-[9px]">{isExpanded ? "▲" : "▼"}</span>
      </button>
    </div>
  );
};