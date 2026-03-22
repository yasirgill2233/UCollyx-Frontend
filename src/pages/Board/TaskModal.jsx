import React, { useState } from 'react';
import { X, Plus, CheckCircle2, Send } from 'lucide-react';

const TaskModal = ({ task, onClose, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  // --- DYNAMIC STATES ---
  const [currentStatus, setCurrentStatus] = useState(task.status || 'To Do');
  const [subtasks, setSubtasks] = useState([
    { title: 'Define API requirements', done: true, code: 'TRK-231', color: 'bg-purple-500' },
    { title: 'Write API documentation', done: false, code: 'TRK-232', color: 'bg-pink-500' },
    { title: 'Review with backend team', done: false, code: 'TRK-233', color: 'bg-orange-500' },
    { title: 'Update Swagger spec', done: false, code: 'TRK-234', color: 'bg-green-500' },
  ]);

  const [comments, setComments] = useState([
    { user: 'Muneeb Q', msg: 'We need to finalize the API endpoints before proceeding.', time: '1 day ago', color: 'bg-orange-500' },
    { user: 'Ahsan K', msg: 'Agreed. I\'ll schedule a call today.', time: '22 hours ago', color: 'bg-blue-500' },
    { user: 'Fatima J', msg: 'I\'ve already drafted the endpoint spec.', time: '18 hours ago', color: 'bg-green-500' },
  ]);

  if (!task) return null;

  // Progress Calculation
  const doneCount = subtasks.filter(s => s.done).length;
  const progressPercent = (doneCount / subtasks.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-6 pb-2">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-bold text-lg">{task.id}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                task.priority === 'High' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-green-50 border-green-200 text-green-600'
              }`}>
                ● {task.priority}
              </span>
              <span className="text-blue-600 text-sm font-medium">{task.linkedEpic || 'No Epic'}</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{task.title}</h2>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
              <span>Subtasks Progress</span>
              <span>{doneCount}/{subtasks.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-8 border-b border-gray-100">
            {['Overview', 'Subtasks', 'Comments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition-all relative ${
                  activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-white">
          {activeTab === 'Overview' && (
            <OverviewContent 
              currentStatus={currentStatus} 
              setCurrentStatus={setCurrentStatus} 
            />
          )}
          {activeTab === 'Subtasks' && (
            <SubtasksContent subtasks={subtasks} setSubtasks={setSubtasks} />
          )}
          {activeTab === 'Comments' && (
            <CommentsContent comments={comments} setComments={setComments} />
          )}
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Section: Overview (Sirf Active Status Highlighted) --- */
const OverviewContent = ({ currentStatus }) => {
  // KanbaBoard se jo task.status aa raha hai, usko base maan kar active dikhayenge
  const activeStatus = currentStatus || 'todo'; 

  return (
    <div className="flex flex-col md:flex-row gap-10">
      <div className="flex-1">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Description</h4>
        <div className="p-4 border border-gray-100 rounded-xl min-h-[150px] text-gray-600 text-sm leading-relaxed">
          Hey there I am using whatsapp....
        </div>
        <div className="mt-8">
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Assignees</h4>
          <div className="flex gap-2">
            {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-pink-500'].map((c, i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-white shadow-sm ${c}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-64">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Update Status</h4>
        <div className="space-y-2">
          {['To Do', 'In Progress', 'Review', 'Done'].map((status) => {
            // Check kar rahe hain ke kya ye status task ke current status se match karta hai
            const isActive = status.toLowerCase().replace(" ", "") == activeStatus;
            
            return (
              <div 
                key={status}
                className={`p-3 border rounded-lg text-sm font-medium transition-colors flex justify-between items-center group ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50/30 text-blue-700' // Active Style
                    : 'border-gray-100 text-gray-600'               // Inactive Style
                }`}
              >
                {status}
                {isActive && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Section: Subtasks (Functional) --- */
const SubtasksContent = ({ subtasks, setSubtasks }) => {
  const toggleSubtask = (index) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index].done = !newSubtasks[index].done;
    setSubtasks(newSubtasks);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 font-medium">
          {subtasks.filter(s => s.done).length}/{subtasks.length} done
        </span>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95">
          <Plus size={14} /> Add Subtask
        </button>
      </div>
      {subtasks.map((item, i) => (
        <div 
          key={i} 
          onClick={() => toggleSubtask(i)}
          className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
            item.done ? 'bg-green-50/30 border-green-100' : 'bg-white border-gray-100 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
              item.done ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
            }`}>
              {item.done && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <span className={`text-sm font-medium ${item.done ? 'text-gray-400 line-through' : 'text-slate-700'}`}>
              {item.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-bold">{item.code}</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${item.color}`}>
              AK
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* --- Sub-Section: Comments (Functional) --- */
const CommentsContent = ({ comments, setComments }) => {
  const [newComment, setNewComment] = useState("");

  const handlePost = () => {
    if (!newComment.trim()) return;
    const comment = {
      user: 'You',
      msg: newComment,
      time: 'Just now',
      color: 'bg-blue-600'
    };
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {comments.map((c, i) => (
          <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold ${c.color}`}>
              {c.user.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-slate-800">{c.user}</span>
                <span className="text-[10px] text-gray-400 font-medium">{c.time}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl rounded-tl-none text-sm text-gray-600 border border-gray-100">
                {c.msg}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
         <div className="flex gap-4">
           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">YS</div>
           <div className="flex-1">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handlePost())}
                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none min-h-[80px] resize-none" 
                placeholder="Write a comment... (Enter to send)"
              />
              <button 
                onClick={handlePost}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Send size={12} /> Post Comment
              </button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default TaskModal;