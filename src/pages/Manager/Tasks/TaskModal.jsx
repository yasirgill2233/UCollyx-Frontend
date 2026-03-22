import React, { useState, useEffect } from "react";
import { X, Link2, Flag, ChevronDown, Check, Plus } from "lucide-react";

// Dummy Users Data as per image_a2fbd2
const availableUsers = [
  {
    id: 1,
    name: "Ahsan Khan",
    role: "Frontend Dev",
    color: "bg-indigo-500",
    initial: "AK",
  },
  {
    id: 2,
    name: "Sara Raza",
    role: "Backend Dev",
    color: "bg-pink-500",
    initial: "SR",
  },
  {
    id: 3,
    name: "Muneeb Qazi",
    role: "QA Engineer",
    color: "bg-orange-500",
    initial: "MQ",
  },
  {
    id: 4,
    name: "Fatima Jamil",
    role: "Designer",
    color: "bg-emerald-500",
    initial: "FJ",
  },
  {
    id: 5,
    name: "Bilal Ahmed",
    role: "DevOps",
    color: "bg-blue-500",
    initial: "BA",
  },
  {
    id: 6,
    name: "Nadia Mir",
    role: "Product",
    color: "bg-red-500",
    initial: "NM",
  },
];

const TaskModal = ({ task, onClose, onUpdateTask }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [editedTask, setEditedTask] = useState({
    ...task,
    subtasks: task.subtasks || [],
    comments: task.comments || [
      {
        id: 1,
        userId: 3,
        text: "We need to finalize the API endpoints before proceeding with implementation.",
        time: "1 day ago",
      },
      {
        id: 2,
        userId: 1,
        text: "Agreed. I'll schedule a call with the backend team today.",
        time: "22 hours ago",
      },
      {
        id: 3,
        userId: 4,
        text: "I've already drafted the endpoint spec — sharing it now.",
        time: "18 hours ago",
      },
    ],
  });
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [selectedSubtaskUser, setSelectedSubtaskUser] = useState(
    availableUsers[0],
  );

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  useEffect(() => {
  if (task) {
    setEditedTask(prev => ({
      ...task,
      subtasks: task.subtasks || prev.subtasks || [],
      comments: task.comments || prev.comments || []
    }));
  }
}, [task.id]);

  const [newComment, setNewComment] = useState("");

  // 2. handlePostComment ko behtar kiya
const handlePostComment = () => {
  if (!newComment.trim()) return;

  const commentObj = {
    id: Date.now(),
    userId: 1, // Ahsan Khan
    text: newComment,
    time: "Just now",
  };

  // Naya comment list ke end mein add hoga
  const updatedComments = [...(editedTask.comments || []), commentObj];
  
  // State update
  const updatedTask = { ...editedTask, comments: updatedComments };
  setEditedTask(updatedTask);
  
  // Input clear karna
  setNewComment("");

  // Parent component ko inform karna taake database/state save ho
  if (onUpdateTask) {
    onUpdateTask(updatedTask);
  }
};

  if (!task) return null;

  const handleChange = (field, value) => {
    const updated = { ...editedTask, [field]: value };
    setEditedTask(updated);
    if (onUpdateTask) onUpdateTask(updated);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub = {
      id: `TRK-${Math.floor(Math.random() * 1000)}`,
      title: newSubtaskTitle,
      completed: false,
      assignee: selectedSubtaskUser,
    };
    const updatedSubtasks = [...(editedTask.subtasks || []), newSub];
    handleChange("subtasks", updatedSubtasks);
    setNewSubtaskTitle("");
    setIsAddingSubtask(false);
  };

  const toggleSubtask = (subId) => {
    const updatedSubtasks = editedTask.subtasks.map((s) =>
      s.id === subId ? { ...s, completed: !s.completed } : s,
    );
    handleChange("subtasks", updatedSubtasks);
  };

  const completedCount =
    editedTask.subtasks?.filter((s) => s.completed).length || 0;
  const totalCount = editedTask.subtasks?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const toggleAssignee = (userId) => {
    const currentAssignees = editedTask.assignees || [];
    const newAssignees = currentAssignees.includes(userId)
      ? currentAssignees.filter((id) => id !== userId)
      : [...currentAssignees, userId];

    handleChange("assignees", newAssignees);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase">
              {task.id}
            </span>
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border ${editedTask.priority === "High" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
            >
              <Flag size={10} /> {editedTask.priority}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[85vh] overflow-y-auto">
          {/* Title Area */}
          <div className="mb-8">
            <input
              className="text-2xl font-black text-slate-800 w-full outline-none border-b border-transparent focus:border-blue-100 pb-1"
              value={editedTask.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <div className="mt-4 flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[11px] font-black text-slate-600 border border-slate-100 uppercase transition-all">
                <Link2 size={14} />{" "}
                {editedTask.linkedEpic ? editedTask.linkedEpic : "+ Link Epic"}
              </button>
              <span className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                Priority: {editedTask.priority}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-slate-100 mb-8">
            {["Overview", "Subtasks", "Comments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400 border-b-2 border-transparent hover:text-slate-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none appearance-none"
                      value={editedTask.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                    >
                      {["backlog", "todo", "inprogress", "review", "done"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ),
                      )}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-medium text-slate-600 outline-none min-h-[160px] resize-none"
                    placeholder="Add description..."
                    value={editedTask.description || ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </div>

                {/* Assignees Section */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Assignees
                  </label>
                  <div className="flex items-center gap-2 relative">
                    <div className="flex -space-x-3">
                      {(editedTask.assignees || []).map((userId) => {
                        const user = availableUsers.find(
                          (u) => u.id === userId,
                        );
                        return (
                          <div
                            key={userId}
                            className={`w-9 h-9 rounded-full border-2 border-white ${user?.color || "bg-slate-200"} flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-1 ring-slate-100`}
                          >
                            {user?.initial}
                          </div>
                        );
                      })}
                      <button
                        onClick={() =>
                          setShowAssigneeDropdown(!showAssigneeDropdown)
                        }
                        className="w-9 h-9 rounded-full border-2 border-dashed border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:bg-slate-50 hover:border-blue-300 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Assignee Dropdown */}
                    {showAssigneeDropdown && (
                      <div className="absolute bottom-12 left-0 w-64 bg-white border border-slate-100 rounded-[24px] shadow-2xl z-[110] py-2 animate-in fade-in slide-in-from-top-2">
                        {availableUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => toggleAssignee(user.id)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-[9px] font-black text-white`}
                              >
                                {user.initial}
                              </div>
                              <div className="text-left">
                                <p className="text-[11px] font-black text-slate-700 leading-none">
                                  {user.name}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 mt-1">
                                  {user.role}
                                </p>
                              </div>
                            </div>
                            {(editedTask.assignees || []).includes(user.id) && (
                              <Check size={14} className="text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none appearance-none"
                      value={editedTask.priority}
                      onChange={(e) => handleChange("priority", e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Project
                  </label>
                  <div className="relative">
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none appearance-none">
                      <option value="Low">Project 1</option>
                      <option value="Medium">Project 2</option>
                      <option value="High">Project 3</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Sprint
                  </label>
                  <div className="relative">
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 outline-none appearance-none">
                      <option value="Low">Sprint 1</option>
                      <option value="Medium">Sprint 2</option>
                      <option value="High">Sprint 3</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Subtasks
                    </label>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      1/4
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-500"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Subtasks" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Progress Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-tight">
                    Subtasks
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400">
                    {completedCount} of {totalCount} done
                  </span>
                </div>
                {!isAddingSubtask && (
                  <button
                    onClick={() => setIsAddingSubtask(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    <Plus size={14} /> Add Subtask
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-8">
                <div
                  className="bg-blue-600 h-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Subtask List */}
              <div className="space-y-3">
                {editedTask.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${sub.completed ? "bg-emerald-50/30 border-emerald-100" : "bg-white border-slate-100 hover:border-blue-200 shadow-sm"}`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleSubtask(sub.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${sub.completed ? "bg-blue-600 text-white" : "border-2 border-slate-200 bg-white hover:border-blue-400"}`}
                      >
                        {sub.completed && <Check size={14} strokeWidth={4} />}
                      </button>
                      <span
                        className={`text-sm font-bold ${sub.completed ? "text-slate-400 line-through" : "text-slate-700"}`}
                      >
                        {sub.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-slate-300 uppercase">
                        {sub.id}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full ${sub.assignee.color} flex items-center justify-center text-[9px] font-black text-white border-2 border-white shadow-sm ring-1 ring-slate-100`}
                      >
                        {sub.assignee.initial}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Subtask Input Panel */}
              {isAddingSubtask && (
                <div className="mt-4 p-5 rounded-[24px] border-2 border-dashed border-blue-200 bg-blue-50/30 animate-in zoom-in-95">
                  <input
                    autoFocus
                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                    placeholder="Subtask title... (Enter to add)"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                  />
                  <div className="flex justify-between items-center">
                    <div className="relative group">
                      <select
                        className="bg-white border border-slate-100 rounded-lg px-3 py-2 text-[10px] font-black uppercase text-slate-600 outline-none appearance-none pr-8 cursor-pointer"
                        onChange={(e) =>
                          setSelectedSubtaskUser(
                            availableUsers.find(
                              (u) => u.id === parseInt(e.target.value),
                            ),
                          )
                        }
                      >
                        {availableUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsAddingSubtask(false)}
                        className="px-4 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSubtask}
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-md"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Comments" && (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    {/* Comments List */}
    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {editedTask?.comments?.length > 0 ? (
        editedTask.comments.map((comment) => {
          const user = availableUsers.find((u) => u.id === comment.userId);
          return (
            <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-left-2">
              <div className={`w-9 h-9 rounded-full ${user?.color || "bg-slate-400"} flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white border-2 border-white shadow-sm`}>
                {user?.initial || "??"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-black text-slate-700">{user?.name || "Unknown User"}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{comment.time}</span>
                </div>
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No comments yet. Start the discussion!</p>
        </div>
      )}
    </div>

    {/* Input Area */}
    <div className="border-t border-slate-50 pt-8 mt-4">
      <div className="flex gap-4">
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white shadow-md">AK</div>
        <div className="flex-1 space-y-4">
          <textarea
            className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-200 transition-all resize-none min-h-[100px] shadow-inner"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePostComment();
              }
            }}
          />
          <button
            onClick={handlePostComment}
            disabled={!newComment.trim()}
            className="bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-lg transition-all tracking-widest active:scale-95"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  </div>
)}
        </div>

        <div className="p-6 border-t border-slate-50 flex justify-end bg-slate-50/30">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-blue-200 transition-all uppercase tracking-widest"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
