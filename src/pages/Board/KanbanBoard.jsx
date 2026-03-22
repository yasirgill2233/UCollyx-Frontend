import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChevronDown, MessageSquare, Video, Bookmark, MoreVertical, Bug, BookText, ClipboardList } from 'lucide-react';
import TaskModal from './TaskModal';
import ChatModal from './ChatModal';
import MeetingModal from './MeetingModal';

// Initial Data logic same rahegi...
const initialData = {
  columns: {
    'todo': { id: 'todo', title: 'To Do', taskIds: ['task-1', 'task-2', 'task-3'] },
    'inprogress': { id: 'inprogress', title: 'In Progress', taskIds: ['task-4'] },
    'review': { id: 'review', title: 'Review', taskIds: ['task-5'] },
    'done': { id: 'done', title: 'Done', taskIds: ['task-6'] },
  },
  tasks: {
    // Status column ki ID ke mutabiq set kar dein
    'task-1': { id: 'task-1', title: 'Users are complaining...', type: 'bug', priority: 'High', status: 'todo' },
    'task-2': { id: 'task-2', title: 'Story: Reset password', type: 'story', priority: 'Medium', status: 'todo', linkedEpic: 'PASSWORD RESET FEATURE' },
    'task-3': { id: 'task-3', title: 'Update API Documentation', type: 'task', priority: 'High', status: 'todo' },
    'task-4': { id: 'task-4', title: 'Internal Server Error', type: 'task', priority: 'High', status: 'inprogress' },
    'task-5': { id: 'task-5', title: 'Review System Logs', type: 'task', priority: 'Medium', status: 'review' },
    'task-6': { id: 'task-6', title: 'Final Deployment', type: 'task', priority: 'High', status: 'done' },
  }
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeChatTask, setActiveChatTask] = useState(null);
  const [activeMeetingTask, setActiveMeetingTask] = useState(null);

  // Modal Open Handler
  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

const onDragEnd = (result) => {
  const { destination, source, draggableId } = result;
  if (!destination) return;
  if (destination.droppableId === source.droppableId && destination.index === source.index) return;

  const start = data.columns[source.droppableId];
  const finish = data.columns[destination.droppableId];

  // Task ka status column ID ke mutabiq update karo
  const task = data.tasks[draggableId];
  const updatedTask = {
    ...task,
    status: destination.droppableId // e.g., 'inprogress'
  };

  const newTasks = {
    ...data.tasks,
    [draggableId]: updatedTask,
  };

  if (start === finish) {
    const newTaskIds = Array.from(start.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    setData({
      ...data,
      tasks: newTasks,
      columns: { ...data.columns, [start.id]: { ...start, taskIds: newTaskIds } }
    });
  } else {
    const startIds = Array.from(start.taskIds);
    startIds.splice(source.index, 1);
    const finishIds = Array.from(finish.taskIds);
    finishIds.splice(destination.index, 0, draggableId);

    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [start.id]: { ...start, taskIds: startIds },
        [finish.id]: { ...finish, taskIds: finishIds }
      }
    });
  }
};

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <button className="px-4 py-1.5 border border-gray-200 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all">
          Kanban Board
        </button>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">Project: <span className="font-medium border border-gray-100 rounded-lg px-3 py-1 flex items-center gap-2 bg-gray-50/50">Project 1 <ChevronDown size={14} className="text-gray-400"/></span></div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">Sprint: <span className="font-medium border border-gray-100 rounded-lg px-3 py-1 flex items-center gap-2 bg-gray-50/50">Sprint 1 <ChevronDown size={14} className="text-gray-400"/></span></div>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.values(data.columns).map((column) => (
            <div key={column.id} className="bg-gray-50/50 rounded-2xl p-4 flex flex-col min-h-[75vh] border border-gray-100/50">
              <div className="flex justify-between items-center mb-5 px-1">
                <h3 className="font-bold text-slate-800 text-sm tracking-tight">{column.title}</h3>
                <span className="bg-white border border-gray-200 text-gray-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  {column.taskIds.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    className={`space-y-4 flex-1 transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-gray-100/50' : ''}`}
                  >
                    {column.taskIds.map((taskId, index) => (
                      <DraggableCard 
                        key={taskId} 
                        task={data.tasks[taskId]} 
                        index={index} 
                        onOpen={() => openTaskDetail(data.tasks[taskId])}
                        onChatClick={() => setActiveChatTask(data.tasks[taskId])}
                        onMeetingClick={() => setActiveMeetingTask(data.tasks[taskId])}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {isModalOpen && <TaskModal task={selectedTask} onClose={() => setIsModalOpen(false)} />}

        {activeChatTask && (
        <ChatModal task={activeChatTask} onClose={() => setActiveChatTask(null)} />
      )}
      
      {activeMeetingTask && (
        <MeetingModal task={activeMeetingTask} onClose={() => setActiveMeetingTask(null)} />
      )}
    </div>
  );
};

const DraggableCard = ({ task, index, onOpen, onChatClick, onMeetingClick }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onOpen}
          className={`bg-white p-4 rounded-xl border transition-all select-none group cursor-pointer ${
            snapshot.isDragging 
              ? 'border-blue-500 shadow-2xl rotate-2 z-50' 
              : 'border-gray-100 shadow-sm hover:border-blue-400 hover:shadow-md'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-gray-300 group-hover:text-blue-400 transition-colors uppercase tracking-widest">{task.id}</span>
            <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
              {task.type === 'bug' ? (
                <Bug size={14} className="text-red-500" />
              ) : task.type === 'story' ? (
                <BookText size={14} className="text-green-600" />
              ) : (
                <ClipboardList size={14} className="text-blue-500" />
              )}
            </div>
          </div>

          <p className="text-[13px] font-bold text-slate-700 leading-snug mb-3 group-hover:text-slate-900 transition-colors">
            {task.title}
          </p>

           {/* --- NEW SECTION: Epic Link Badge --- */}
          {task.type === 'story' && task.linkedEpic && (
            <div className="mb-4">
              <span className="bg-pink-100 text-pink-700 text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-wide">
                EPIC : {task.linkedEpic}
              </span>
            </div>
          )}
          
          {task.priority && (
            <div className="flex items-center gap-1.5 mb-4">
               <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`} />
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Priority: {task.priority}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-gray-50">
            <div className="flex -space-x-1.5">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className={`w-5 h-5 rounded-full border-2 border-white shadow-sm bg-slate-200 overflow-hidden`}>
                  <img src={`https://i.pravatar.cc/100?u=${task.id}${i}`} alt="user" />
                </div>
              ))}
            </div>

             <div className="flex items-center gap-2 text-gray-400">
              <span className="text-[10px]">0/4</span>
              <div className="flex gap-1 border-l pl-2">
                <button onClick={(e) => { e.stopPropagation(); onChatClick(); }}>
                <MessageSquare size={12} />

                </button>

                <button onClick={(e) => { e.stopPropagation(); onMeetingClick(); }}>
                <Video size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanBoard;