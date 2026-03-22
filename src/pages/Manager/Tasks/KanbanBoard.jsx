import React, { useState,useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  ChevronDown, MessageSquare, Video, MoreVertical, 
  Bug, BookText, ClipboardList, Link2, Unlink, Plus, X, Zap, CheckSquare,
  Calendar,
  Send,
  CheckCircle2
} from 'lucide-react';
import TaskModal from './TaskModal';
import LinkEpicModal from './LinkEpicModal';
import ChatModal from '../../Board/ChatModal';
import MeetingModal from '../../Board/MeetingModal';


const initialData = {
  columns: {
    'backlog': { id: 'backlog', title: 'Backlog', taskIds: [] },
    'todo': { id: 'todo', title: 'To Do', taskIds: ['task-1'] },
    'inprogress': { id: 'inprogress', title: 'In Progress', taskIds: [] },
    'review': { id: 'review', title: 'Review', taskIds: [] },
    'done': { id: 'done', title: 'Done', taskIds: [] },
  },
  tasks: {
    'task-1': { id: 'task-1', title: 'Setup project architecture', type: 'task', priority: 'High', assignees: [1], status: 'todo' },
  },
  epics: [
    { id: 'EP-1', title: 'Password Reset Feature', color: 'bg-indigo-600' },
    { id: 'EP-2', title: 'User Authentication', color: 'bg-pink-500' },
  ]
};
const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [linkingTaskId, setLinkingTaskId] = useState(null);
  
  // MODAL STATES
  const [activeChatTask, setActiveChatTask] = useState(null);
  const [activeMeetingTask, setActiveMeetingTask] = useState(null);

  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedType, setSelectedType] = useState('task');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleUpdateTask = (updatedTask) => {
    setData((prev) => {
      const taskId = updatedTask.id;
      const newStatus = updatedTask.status;
      let oldColId = Object.keys(prev.columns).find(id => prev.columns[id].taskIds.includes(taskId));
      if (!oldColId) return prev;
      if (oldColId === newStatus) return { ...prev, tasks: { ...prev.tasks, [taskId]: updatedTask } };
      const oldIds = prev.columns[oldColId].taskIds.filter(id => id !== taskId);
      const newIds = [...prev.columns[newStatus].taskIds, taskId];
      return {
        ...prev,
        tasks: { ...prev.tasks, [taskId]: updatedTask },
        columns: { ...prev.columns, [oldColId]: { ...prev.columns[oldColId], taskIds: oldIds }, [newStatus]: { ...prev.columns[newStatus], taskIds: newIds } }
      };
    });
    setSelectedTask(null);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      setData({ ...data, columns: { ...data.columns, [start.id]: { ...start, taskIds: newTaskIds } } });
    } else {
      const startIds = Array.from(start.taskIds);
      startIds.splice(source.index, 1);
      const finishIds = Array.from(finish.taskIds);
      finishIds.splice(destination.index, 0, draggableId);
      const updatedTask = { ...data.tasks[draggableId], status: destination.droppableId };
      setData({
        ...data,
        tasks: { ...data.tasks, [draggableId]: updatedTask },
        columns: { ...data.columns, [start.id]: { ...start, taskIds: startIds }, [finish.id]: { ...finish, taskIds: finishIds } }
      });
    }
  };

  const handleQuickCreate = () => {
    if (!newTaskTitle.trim()) { setIsCreating(false); return; }
    if (selectedType === 'epic') {
      const newEpic = { id: `EP-${Date.now()}`, title: newTaskTitle, color: 'bg-purple-600' };
      setData(prev => ({ ...prev, epics: [...prev.epics, newEpic] }));
    } else {
      const newId = `task-${Date.now()}`;
      const finalTitle = selectedType === 'story' ? `Story: ${newTaskTitle}` : newTaskTitle;
      const newTask = { id: newId, title: finalTitle, type: selectedType, priority: 'Low', assignees: [], status: 'backlog', linkedEpic: null };
      setData(prev => ({
        ...prev,
        tasks: { ...prev.tasks, [newId]: newTask },
        columns: { ...prev.columns, 'backlog': { ...prev.columns['backlog'], taskIds: [...prev.columns['backlog'].taskIds, newId] } }
      }));
    }
    setNewTaskTitle(""); setIsCreating(false); setSelectedType('task');
  };

  const handleLinkEpic = (taskId, epic) => {
    setData(prev => ({ ...prev, tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], linkedEpic: epic.title } } }));
    setLinkingTaskId(null);
  };

  return (
    <div className="pt-6 bg-[#F8FAFC] min-h-screen font-sans">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto px-6 pb-10 h-[calc(100vh-100px)]">
          {data?.columns && Object.values(data.columns).map((column) => (
            <div key={column.id} className="bg-slate-100/50 rounded-[32px] p-4 flex flex-col min-w-[320px] max-w-[320px] h-full border border-slate-200/50">
              <div className="flex justify-between items-center mb-5 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.id === 'backlog' ? 'bg-slate-400' : 'bg-blue-400'}`} />
                  <h3 className="font-black text-slate-700 text-sm uppercase tracking-tight">{column.title}</h3>
                </div>
                <span className="bg-white border border-slate-200 text-slate-500 text-[11px] font-black px-3 py-1 rounded-full shadow-sm">{column.taskIds.length}</span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 flex-1 overflow-y-auto pr-1 min-h-[50px]">
                    {column.taskIds.map((taskId, index) => (
                      <DraggableCard 
                        key={taskId}
                        task={data.tasks[taskId]} 
                        index={index} 
                        isMenuOpen={openMenuId === taskId}
                        setOpenMenuId={setOpenMenuId}
                        onOpenEpicLink={(id) => setLinkingTaskId(id)}
                        onRemoveEpic={(id) => setData(prev => ({...prev, tasks: {...prev.tasks, [id]: {...prev.tasks[id], linkedEpic: null}}}))}
                        onClick={() => setSelectedTask(data.tasks[taskId])}
                        // ICON HANDLERS
                        onChat={() => setActiveChatTask(data.tasks[taskId])}
                        onMeeting={() => setActiveMeetingTask(data.tasks[taskId])}
                      />
                    ))}
                    {provided.placeholder}
                    {column.id === 'backlog' && (
                      isCreating ? (
                        <div className="bg-white p-4 rounded-2xl border-2 border-blue-400 shadow-lg animate-in fade-in zoom-in-95">
                          <textarea autoFocus className="w-full text-sm font-bold text-slate-700 outline-none resize-none placeholder-slate-300 mb-2" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleQuickCreate())} />
                          <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                            <div className="relative">
                              <button onClick={() => setShowTypeDropdown(!showTypeDropdown)} className="flex items-center gap-1.5 p-1.5 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                                <TypeIcon type={selectedType} size={14} /> <ChevronDown size={12} className="text-slate-400" />
                              </button>
                              {showTypeDropdown && (
                                <div className="absolute left-0 bottom-full mb-2 w-32 bg-white border border-slate-100 rounded-xl shadow-xl z-[110] py-1">
                                  {['task', 'bug', 'story', 'epic'].map(t => (
                                    <button key={t} onClick={() => { setSelectedType(t); setShowTypeDropdown(false); }} className="w-full px-3 py-2 text-left text-[10px] font-black uppercase hover:bg-slate-50 flex items-center gap-2 text-slate-600">
                                      <TypeIcon type={t} size={14} /> {t}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setIsCreating(false)}><X size={16} className="text-slate-400" /></button>
                              <button onClick={handleQuickCreate} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">Add</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setIsCreating(true)} className="w-full flex items-center gap-2 px-3 py-3 text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors"><Plus size={18} /> Create</button>
                      )
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* RENDER MODALS */}
      {linkingTaskId && <LinkEpicModal epics={data.epics} onSelect={(epic) => handleLinkEpic(linkingTaskId, epic)} onClose={() => setLinkingTaskId(null)} />}
      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onUpdateTask={handleUpdateTask} />}
      {activeChatTask && <ChatModal task={activeChatTask} onClose={() => setActiveChatTask(null)} />}
      {activeMeetingTask && <MeetingModal task={activeMeetingTask} onClose={() => setActiveMeetingTask(null)} />}
    </div>
  );
};

const TypeIcon = ({ type, size }) => {
  if (type === 'bug') return <Bug size={size} className="text-red-500" />;
  if (type === 'story') return <BookText size={size} className="text-green-600" />;
  if (type === 'epic') return <Zap size={size} className="text-purple-600" />;
  return <CheckSquare size={size} className="text-blue-500" />;
};

const DraggableCard = ({ task, index, onClick, isMenuOpen, setOpenMenuId, onOpenEpicLink, onRemoveEpic, onChat, onMeeting }) => {
  const isBacklog = task.status === 'backlog' && (!task.assignees || task.assignees.length === 0);
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={onClick} className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer relative group ${snapshot.isDragging ? 'border-blue-500 shadow-2xl z-50' : 'border-slate-100 shadow-sm hover:border-blue-300'}`}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-400 uppercase tracking-widest">{task.id}</span>
            <div className="flex items-center gap-2 relative" onClick={(e) => e.stopPropagation()}>
              <TypeIcon type={task.type} size={14} />
              {task.type === 'story' && (
                <div className="relative">
                  <button onClick={() => setOpenMenuId(isMenuOpen ? null : task.id)} className="p-1 hover:bg-slate-50 rounded-md text-slate-300"><MoreVertical size={14} /></button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-[150] py-2">
                      <button onClick={() => { onOpenEpicLink(task.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-[10px] font-black text-slate-600 hover:bg-blue-50 flex items-center gap-2 uppercase"><Link2 size={12} /> Link Epic</button>
                      {task.linkedEpic && <button onClick={() => { onRemoveEpic(task.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-[10px] font-black text-red-500 hover:bg-red-50 flex items-center gap-2 uppercase"><Unlink size={12} /> Remove Epic</button>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm font-bold text-slate-800 leading-snug mb-2">{task.title}</p>
          {!isBacklog && (
            <div className="mt-3">
              {task.linkedEpic && <div className="mb-3"><span className="bg-pink-50 text-pink-600 text-[9px] font-black px-2 py-1 rounded-md border border-pink-100 uppercase tracking-tighter">EPIC: {task.linkedEpic}</span></div>}
              <div className="flex items-center gap-2 mb-4">
                 <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                 <span className="text-[10px] font-black text-slate-400 uppercase">Priority: {task.priority}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                <div className="flex -space-x-2">{(task.assignees || []).map((id) => (<div key={id} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm"><img src={`https://i.pravatar.cc/100?u=${id}`} alt="u" /></div>))}</div>
                
                {/* ICON BUTTONS WITH EVENT PROTECTION */}
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); onChat(); }} className="text-slate-300 hover:text-blue-500 transition-colors p-1">
                    <MessageSquare size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onMeeting(); }} className="text-slate-300 hover:text-indigo-500 transition-colors p-1">
                    <Video size={14} />
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default KanbanBoard;