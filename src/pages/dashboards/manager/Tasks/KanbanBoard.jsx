import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  ChevronDown,
  MessageSquare,
  Video,
  MoreVertical,
  Bug,
  BookText,
  ClipboardList,
  Link2,
  Unlink,
  Plus,
  X,
  Zap,
  CheckSquare,
  Calendar,
  Send,
  CheckCircle2,
  FolderKanban,
} from "lucide-react";
import TaskModal from "./TaskModal";
import LinkEpicModal from "./LinkEpicModal";
import ChatModal from "../../../dashboards/developer/board/ChatModal";
import MeetingModal from "../../../dashboards/developer/board/MeetingModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../../../../api/services/taskService";
import { useProjectsData } from "../../../../hooks/useProjects";

import socket from "../../../../context/SocketContext";
import toast from "react-hot-toast";
import { triggerToast } from "../../../../utils/toastHelper";

const KanbanBoard = ({showProjectDropdown, projects ,projectId}) => {

  const [selectedTask, setSelectedTask] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [linkingTaskId, setLinkingTaskId] = useState(null);

  const [activeChatTask, setActiveChatTask] = useState(null);
  const [activeMeetingTask, setActiveMeetingTask] = useState(null);

  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedType, setSelectedType] = useState("task");

  const { data, isLoading } = useQuery({
    queryKey: ["board", projectId],
    queryFn: () => taskService.getBoard(projectId),
    enabled: !!projectId,
  });

  console.log("HELLO HELLO HELLO #####################################################3",data)
  const dragMutation = useMutation({
    mutationFn: (vars) => console.log(vars) || taskService.updateTaskPosition(vars.id, vars.data),
    onMutate: async (newVars) => {
      await queryClient.cancelQueries(["board", projectId]);
      const previousData = queryClient.getQueryData(["board", projectId]);

      queryClient.setQueryData(["board", projectId], (old) => {
        const updatedTasks = { ...old.tasks };
        const updatedColumns = { ...old.columns };
        
        const task = updatedTasks[newVars.id];
        const sourceColId = Object.keys(updatedColumns).find(id => updatedColumns[id].taskIds.includes(newVars.id));
        
        updatedColumns[sourceColId].taskIds = updatedColumns[sourceColId].taskIds.filter(id => id !== newVars.id);
        updatedColumns[newVars.data.status].taskIds.splice(newVars.data.position, 0, newVars.id);
        task.status = newVars.data.status;

        return { ...old, tasks: updatedTasks, columns: updatedColumns };
      });

      return { previousData };
    },
    onError: (err, newVars, context) => {
      queryClient.setQueryData(["board", projectId], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["board", projectId]);
    },
    onSuccess: () => queryClient.invalidateQueries(["board", projectId]),
  });

  const createMutation = useMutation({
    mutationFn: (newTask) => taskService.createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["board", projectId]);
      setIsCreating(false);
      setNewTaskTitle("");
    },
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    dragMutation.mutate({
      id: draggableId,
      data: {
        status: destination.droppableId,
        position: destination.index,
        project_id: Number(projectId),
      },
    });
  };

  const handleQuickCreate = () => {
    if (!newTaskTitle.trim()) return;
    
    createMutation.mutate({
      project_id: projectId,
      title: selectedType === "story" ? `Story: ${newTaskTitle}` : newTaskTitle,
      type: selectedType,
      status: "backlog",
      priority: "Low"
    });
  };

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const mutation = useMutation({
    mutationFn: (vars) => taskService.updateTaskPosition(vars.id, vars.data),
    onSuccess: () => queryClient.invalidateQueries(["board", projectId]),
  });

const updateTaskMutation = useMutation({
  mutationFn: ({ taskId, updatedFields }) => 
    taskService.updateTask(taskId, updatedFields),
  
  onMutate: async ({ taskId, updatedFields }) => {
    await queryClient.cancelQueries({ queryKey: ["board", projectId] });
    const previousBoardData = queryClient.getQueryData(["board", projectId]);
    if (previousBoardData) {
      queryClient.setQueryData(["board", projectId], {
        ...previousBoardData,
        tasks: {
          ...previousBoardData.tasks,
          [taskId]: {
            ...previousBoardData.tasks[taskId],
            ...updatedFields,
          }
        }
      });
    }
    return { previousBoardData };
  },
  onError: (err, variables, context) => {
    if (context?.previousBoardData) {
      queryClient.setQueryData(["board", projectId], context.previousBoardData);
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["board", projectId] });
  }
});

const handleUpdateTask = (updatedTask) => {
  updateTaskMutation.mutate({
    taskId: updatedTask.id,
    updatedFields: {
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      due_time: updatedTask.due_time,
      project_id: updatedTask.project_id,
    }
  });
};


const { data: projectEpics = [] } = useQuery({
  queryKey: ["projectEpics", projectId],
  queryFn: () => taskService.getProjectEpics(projectId),
  enabled: !!projectId,
});

const updateEpicMutation = useMutation({
  mutationFn: ({ taskId, epicId }) => taskService.updateTaskEpic(taskId, epicId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["board", projectId] });
    setLinkingTaskId(null);
  }
});

const handleLinkEpic = (taskId, epicId) => {
  updateEpicMutation.mutate({ taskId, epicId });
};

const handleRemoveEpic = (taskId) => {
  updateEpicMutation.mutate({ taskId, epicId: null });
};
  if (isLoading) return <div>Loading Board...</div>;

  return (
    <div className=" bg-[#F8FAFC] min-h-screen font-sans">
     

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto px-2 pb-10 h-[calc(100vh-64px)]">
          {data?.columns &&
            Object.values(data.columns).map((column) => (
              <div
                key={column.id}
                className="bg-slate-100/50 rounded-lg p-4 flex flex-col w-[20%] h-full border border-slate-200/50"
              >
                <div className="flex justify-between items-center mb-5 px-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${column.id === "backlog" ? "bg-slate-400" : "bg-blue-400"}`}
                    />
                    <h3 className="font-black text-slate-700 text-sm uppercase tracking-tight">
                      {column.title}
                    </h3>
                  </div>
                  <span className="bg-white border border-slate-200 text-slate-500 text-[11px] font-black px-3 py-1 rounded-full shadow-sm">
                    {column.taskIds.length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4 flex-1 overflow-y-auto pr-1 min-h-[50px]"
                    >
                      {column.taskIds.map((taskId, index) => (
                        <DraggableCard
                          key={taskId}
                          task={data.tasks[taskId]}
                          index={index}
                          isMenuOpen={openMenuId === taskId}
                          setOpenMenuId={setOpenMenuId}
                          onOpenEpicLink={(id) => setLinkingTaskId(id)}
                          // onRemoveEpic={(id) =>
                          //   setData((prev) => ({
                          //     ...prev,
                          //     tasks: {
                          //       ...prev.tasks,
                          //       [id]: { ...prev.tasks[id], ParentTask: null },
                          //     },
                          //   }))
                          // }
                          onRemoveEpic={(id) => handleRemoveEpic(id)}
                          onClick={() => setSelectedTask(data.tasks[taskId])}
                          // ICON HANDLERS
                          onChat={() => setActiveChatTask(data.tasks[taskId])}
                          onMeeting={() =>
                            setActiveMeetingTask(data.tasks[taskId])
                          }
                        />
                      ))}
                      {provided.placeholder}
                      {column.id === "backlog" &&
                        (isCreating ? (
                          <div className="bg-white p-4 rounded-2xl border-2 border-blue-400 shadow-lg animate-in fade-in zoom-in-95">
                            <textarea
                              autoFocus
                              className="w-full text-sm font-bold text-slate-700 outline-none resize-none placeholder-slate-300 mb-2"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                (e.preventDefault(), handleQuickCreate())
                              }
                            />
                            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setShowTypeDropdown(!showTypeDropdown)
                                  }
                                  className="flex items-center gap-1.5 p-1.5 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors"
                                >
                                  <TypeIcon type={selectedType} size={14} />{" "}
                                  <ChevronDown
                                    size={12}
                                    className="text-slate-400"
                                  />
                                </button>
                                {showTypeDropdown && (
                                  <div className="absolute left-12 -bottom-4 mb-2 w-28 bg-white border border-slate-100 rounded-lg shadow-xl z-[110]">
                                    {["task", "bug", "story", "epic"].map(
                                      (t) => (
                                        <button
                                          key={t}
                                          onClick={() => {
                                            setSelectedType(t);
                                            setShowTypeDropdown(false);
                                          }}
                                          className="w-full px-2 py-1.5 text-left text-[10px] font-black uppercase hover:bg-slate-50 flex items-center gap-2 text-slate-600"
                                        >
                                          <TypeIcon type={t} size={14} /> {t}
                                        </button>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setIsCreating(false)}>
                                  <X size={16} className="text-slate-400" />
                                </button>
                                <button
                                  onClick={handleQuickCreate}
                                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsCreating(true)}
                            className="w-full flex items-center gap-2 px-3 py-3 text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors"
                          >
                            <Plus size={18} /> Create
                          </button>
                        ))}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
        </div>
      </DragDropContext>

      {/* RENDER MODALS */}
      {linkingTaskId && (
        <LinkEpicModal
          epics={projectEpics}
          onSelect={(epicId) => {handleLinkEpic(linkingTaskId, epicId), setSelectedTask(null);}}
          onClose={() => setLinkingTaskId(null)}
          isPending={updateEpicMutation.isPending}
        />
      )}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
          projectId = {projectId}
          onOpenLinkEpic={() => setLinkingTaskId(selectedTask.id)}
        />
      )}
      {activeChatTask && (
        <ChatModal
          task={activeChatTask}
          onClose={() => setActiveChatTask(null)}
        />
      )}
      {activeMeetingTask && (
        <MeetingModal
          task={activeMeetingTask}
          onClose={() => setActiveMeetingTask(null)}
        />
      )}
    </div>
  );
};

const TypeIcon = ({ type, size }) => {
  if (type === "bug") return <Bug size={size} className="text-red-500" />;
  if (type === "story")
    return <BookText size={size} className="text-green-600" />;
  if (type === "epic") return <Zap size={size} className="text-purple-600" />;
  return <CheckSquare size={size} className="text-blue-500" />;
};

const DraggableCard = ({
  task,
  index,
  onClick,
  isMenuOpen,
  setOpenMenuId,
  onOpenEpicLink,
  onRemoveEpic,
  onChat,
  onMeeting,
}) => {
  const isBacklog =
    task.status === "backlog" &&
    (!task.assignees || task.assignees.length === 0);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer relative group ${snapshot.isDragging ? "border-blue-500 shadow-2xl z-50" : "border-slate-100 shadow-sm hover:border-blue-300"}`}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-400 uppercase tracking-widest">
              {task.id}
            </span>
            <div
              className="flex items-center gap-2 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <TypeIcon type={task.type} size={14} />
              {task.type === "story" && (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(isMenuOpen ? null : task.id)}
                    className="p-1 hover:bg-slate-50 rounded-md text-slate-300"
                  >
                    <MoreVertical size={14} />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-[150] py-2">
                      <button
                        onClick={() => {
                          onOpenEpicLink(task.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-[10px] font-black text-slate-600 hover:bg-blue-50 flex items-center gap-2 uppercase"
                      >
                        <Link2 size={12} /> Link Epic
                      </button>
                      {task.ParentTask && (
                        <button
                          onClick={() => {
                            onRemoveEpic(task.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-[10px] font-black text-red-500 hover:bg-red-50 flex items-center gap-2 uppercase"
                        >
                          <Unlink size={12} /> Remove Epic
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm font-bold text-slate-800 leading-snug mb-2">
            {task.title}
          </p>
          {!isBacklog && (
            <div className="mt-3">
              {task?.ParentTask && (
                <div className="mb-3">
                  <span className="bg-pink-50 text-pink-600 text-[9px] font-black px-2 py-1 rounded-md border border-pink-100 uppercase tracking-tighter">
                    EPIC: {task.ParentTask?.title}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${task.priority === "High" ? "bg-orange-500" : "bg-blue-500"}`}
                />
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  Priority: {task.priority}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                <div className="flex -space-x-2 justify-center items-center">
                  {(task.assignees || []).map((user) => (
                    <div className="w-7 h-7 rounded-full border border-blue-100 bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm uppercase overflow-hidden">
                {user?.avatar_url ? (
                  <img
                    src={import.meta.env.VITE_SERVER_URL + user?.avatar_url}
                    alt="Avatar"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                ) : user.full_name ? (
                  user.full_name[0]
                ) : (
                  "U"
                )}
              </div>
                  ))}
                </div>

                {/* ICON BUTTONS WITH EVENT PROTECTION */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onChat();
                    }}
                    className="text-slate-300 hover:text-blue-500 transition-colors p-1"
                  >
                    <MessageSquare size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMeeting();
                    }}
                    className="text-slate-300 hover:text-indigo-500 transition-colors p-1"
                  >
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
