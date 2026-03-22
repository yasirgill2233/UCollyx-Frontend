import React, { useState, useMemo, Activity } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  MessageSquare,
  MoreVertical,
  Search,
  Filter,
  ChevronRight,
  Paperclip,
  Send,
  X,
  ShieldAlert,
  RefreshCw,
  Play,
  CircleDashed,
  Eye,
} from "lucide-react";

// --- 1. Update Status Modal (Restored & Styled) ---
const UpdateStatusModal = ({ isOpen, onClose, issue, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(
    issue?.status || "Resolved",
  );
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] w-[100%] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 border w-[30%] border-slate-100 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Update Status
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        <p className="text-[13px] text-slate-500 mb-6 font-medium">
          Updating resolution for{" "}
          <span className="text-blue-600 font-bold">#{issue?.id}044</span>
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              New Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500 transition-all appearance-none bg-white"
            >
              {[
                "New",
                "Acknowledged",
                "In Progress",
                "Resolved",
                "Ready for QA",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Internal Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm h-28 resize-none outline-none focus:ring-2 ring-blue-500/10 focus:border-blue-500 font-medium"
              placeholder="Describe the progress or fix details..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onUpdate(issue.id, selectedStatus);
              onClose();
            }}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. Issue Detail Modal (Full Restored Details) ---
const IssueDetailModal = ({ isOpen, onClose, issue, onUpdate }) => {
  const [showUpdate, setShowUpdate] = useState(false);
  if (!isOpen || !issue) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl relative max-h-[94vh] flex flex-col overflow-hidden border border-white">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 z-10 p-2 bg-slate-50 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
          {/* Header Tags */}
          <div className="flex gap-2 mb-6">
            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase">
              BUG-{issue.id}1312
            </span>
            <span className="bg-red-50 text-red-500 text-[10px] font-black px-3 py-1.5 rounded-lg border border-red-100 tracking-widest uppercase">
              RED-044
            </span>
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black text-slate-900 mb-3 leading-tight tracking-tight">
                {issue.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                <span>
                  Module: <span className="text-slate-700">Auth Module</span>
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>
                  By: <span className="text-slate-700">QA Yasir Saleem</span>
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span>
                  Assigned:{" "}
                  <span className="text-blue-600 underline">Zain Ahmed</span>
                </span>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => setShowUpdate(true)}
                className="px-5 py-2.5 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all"
              >
                Update Status
              </button>
              <button className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all">
                Ready for QA
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-10">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-8 space-y-10">
              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <ShieldAlert size={14} className="text-orange-500" /> Red Card
                  Reason
                </h3>
                <div className="bg-orange-50/50 border-l-4 border-orange-400 rounded-xl p-6 text-[14px] text-orange-900 leading-relaxed font-semibold italic">
                  "Under high traffic conditions, the database connection pool
                  becomes exhausted causing cascading failures across all
                  backend services."
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">
                  Steps to Reproduce
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="flex items-start gap-4 text-[14px] text-slate-700 font-bold"
                    >
                      <span className="w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 shadow-sm">
                        {num}
                      </span>
                      Simulate high load (500+ concurrent users via JMeter)
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Expected vs Actual
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6">
                    <h4 className="text-[10px] font-black text-emerald-600 uppercase mb-3 flex items-center gap-2">
                      <CheckCircle2 size={12} /> Expected
                    </h4>
                    <p className="text-[14px] text-slate-800 font-bold leading-snug">
                      Connection pool scales to handle peak load
                    </p>
                  </div>
                  <div className="bg-red-50/40 border border-red-100 rounded-2xl p-6">
                    <h4 className="text-[10px] font-black text-red-600 uppercase mb-3 flex items-center gap-2">
                      <AlertCircle size={12} /> Actual
                    </h4>
                    <p className="text-[14px] text-slate-800 font-bold leading-snug">
                      Pool exhausted after ~300 connections
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Evidence
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["load-test-results.json", "db-metrics.png"].map((file) => (
                    <div
                      key={file}
                      className="flex items-center gap-3 px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
                    >
                      <Paperclip
                        size={14}
                        className="text-slate-400 group-hover:text-blue-500"
                      />
                      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">
                        {file}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[24px] p-8 text-center shadow-2xl shadow-slate-200">
                <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Time Since Raised
                  </span>
                </div>
                <div className="text-4xl font-black text-white tracking-tighter mb-2">
                  23:59:18
                </div>
                <div className="inline-block px-3 py-1 bg-red-500 text-white text-[9px] font-black rounded uppercase">
                  SLA Breach in 2m
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Card Info
                </h3>
                <div className="space-y-4">
                  <InfoRow
                    label="Severity"
                    value="Critical"
                    valueClass="text-red-600"
                  />
                  <InfoRow label="Environment" value="Production" />
                  <InfoRow label="Raised" value="Feb 02, 11:00 AM" />
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-3xl p-6 space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Quick Status
                </h3>
                <StatusItem dot="bg-yellow-400" label="Acknowledged" />
                <StatusItem dot="bg-blue-500" label="In Progress" active />
                <StatusItem dot="bg-emerald-500" label="Fix Ready by QA" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showUpdate && (
        <UpdateStatusModal
          isOpen={showUpdate}
          onClose={() => setShowUpdate(false)}
          issue={issue}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

// --- 3. Comments Modal (Image 4 Logic) ---
const CommentsModal = ({ isOpen, onClose, issue }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      user: "Zain Ahmed",
      time: "5 min ago",
      text: "Increased connection pool size as a temporary fix.",
    },
  ]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        { user: "Zain Ahmed", time: "Just now", text: newComment },
      ]);
      setNewComment("");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <MessageSquare size={18} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
              Discussion
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 max-h-[400px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
          {comments.map((c, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[12px] font-black text-white shrink-0 shadow-lg shadow-blue-100">
                ZA
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-sm font-black text-slate-800">{c.user}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {c.time}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-[13px] text-slate-600 font-medium leading-relaxed">
                  {c.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm h-28 resize-none outline-none focus:border-blue-500 transition-all font-medium"
            placeholder="Add a comment or update for QA..."
          />
          <button
            onClick={handleSend}
            className="absolute bottom-4 right-4 bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-blue-700 shadow-xl shadow-blue-200 flex items-center gap-2"
          >
            <Send size={14} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard ---
const IssuesDashboard = () => {
  const [issues, setIssues] = useState([
    {
      id: 1,
      severity: "Critical",
      title: "Payment gateway timeout causing transaction failures",
      status: "New",
    },
    {
      id: 2,
      severity: "High",
      title: "User session data leaking between logged-in accounts",
      status: "Acknowledged",
    },
    {
      id: 3,
      severity: "Medium",
      title: "Sidebar navigation items missing on tablet viewport",
      status: "Resolved",
    },
    {
      id: 4,
      severity: "Low",
      title: "Icon misalignment in footer social links section",
      status: "In Progress",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [commentIssue, setCommentIssue] = useState(null);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch = issue.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSeverity =
        severityFilter === "All" || issue.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [searchTerm, severityFilter, issues]);

  const updateStatus = (id, newStatus) => {
    setIssues(
      issues.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
    );
    setOpenMenuId(null);
  };

  return (
    <div className="p-8 md:p-12 bg-[#F8FAFC] font-sans">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Project Health Console
            </h1>
            <p className="text-slate-500 font-bold text-sm mt-1">
              Real-time QA issue tracking & resolution hub.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Filter by issue title..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-4 ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 outline-none cursor-pointer hover:border-slate-300 shadow-sm"
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="All">All Severity</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Severity
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Issue Details
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="hover:bg-blue-50/30 transition-all group hover:bg-slate-100"
                    >
                      {/* Severity */}
                      <td className="px-8 py-6">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm inline-block ${
                            issue.severity === "Critical"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-white text-slate-500 border-slate-200"
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </td>

                      {/* Title & Info */}
                      <td className="px-8 py-6 max-w-md">
                        <p className="text-[14px] font-bold text-slate-800 leading-tight mb-1">
                          {issue.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-tight">
                          <span>{issue.id}044</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <span>2 hours ago</span>
                        </div>
                      </td>

                      {/* Status with minimal Blue influence */}
                      <td className="px-8 py-6">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold tracking-tight transition-all ${
                            issue.status === "In Progress"
                              ? "bg-blue-50 border-blue-100 text-blue-600"
                              : issue.status === "Resolved"
                                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                : "bg-slate-50 border-slate-100 text-slate-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              issue.status === "In Progress"
                                ? "bg-blue-500"
                                : issue.status === "Resolved"
                                  ? "bg-emerald-500"
                                  : "bg-slate-300"
                            }`}
                          />
                          {issue.status}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95"
                          >
                            View
                          </button>

                          <button
                            onClick={() => setCommentIssue(issue)}
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-transparent hover:border-blue-100 transition-all"
                            title="Add Comment"
                          >
                            <MessageSquare size={16} />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === issue.id ? null : issue.id,
                                )
                              }
                              className={`p-2.5 rounded-xl transition-all ${
                                openMenuId === issue.id
                                  ? "bg-slate-100 text-slate-900"
                                  : "text-slate-300 hover:text-slate-600"
                              }`}
                            >
                              <MoreVertical size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === issue.id && (
                              <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-[50] py-2 animate-in fade-in slide-in-from-top-2">
                                <p className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  Update Status
                                </p>
                                {[
                                  "New",
                                  "Acknowledged",
                                  "In Progress",
                                  "Resolved",
                                  "Ready for QA",
                                ].map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => updateStatus(issue.id, st)}
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <Search size={40} className="mb-4" />
                        <p className="text-lg font-bold">No Detail found</p>
                        <p className="text-sm font-medium">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <IssueDetailModal
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        issue={selectedIssue}
        onUpdate={updateStatus}
      />
      <CommentsModal
        isOpen={!!commentIssue}
        onClose={() => setCommentIssue(null)}
        issue={commentIssue}
      />
    </div>
  );
};

// Helper Components
const InfoRow = ({ label, value, valueClass = "text-slate-800" }) => (
  <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
    <span className="text-slate-400 font-bold tracking-tight uppercase text-[10px]">
      {label}
    </span>
    <span className={`font-black ${valueClass}`}>{value}</span>
  </div>
);

const StatusItem = ({ dot, label, active }) => (
  <div
    className={`flex items-center gap-4 px-5 py-3 border-2 rounded-2xl text-[12px] font-black cursor-pointer transition-all ${active ? "border-blue-500 bg-blue-50/50 text-blue-700 shadow-lg shadow-blue-50" : "border-transparent bg-white text-slate-500 hover:border-slate-200"}`}
  >
    <span className={`w-2.5 h-2.5 rounded-full ${dot} shadow-sm`}></span>
    {label}
  </div>
);

export default IssuesDashboard;
