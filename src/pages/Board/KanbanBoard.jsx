import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../../api/services/taskService";
import {
  MessageSquare,
  Video,
  Bug,
  BookText,
  ClipboardList,
  FolderKanban,
  ChevronDown,
} from "lucide-react";
import TaskModal from "./TaskModal";
import ChatModal from "./ChatModal";
import MeetingModal from "./MeetingModal";
import { useMyProjects } from "../../hooks/useProjects";
import { useSearchParams } from "react-router-dom";

const KanbanBoard = () => {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChatTask, setActiveChatTask] = useState(null);
  const [activeMeetingTask, setActiveMeetingTask] = useState(null);

  const [searchParams] = useSearchParams();
  const queryProjectId = searchParams.get('projectId');
  const queryProjectName = searchParams.get('projectName');
  const queryTaskId = searchParams.get('taskId');

  const [projectId, setProjectId] = useState(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const { data: myProjects } = useMyProjects();
  const projects = myProjects?.data || [];

  useEffect(() => {
    if (queryProjectId) {
      setProjectId(Number(queryProjectId));
    } else if (projects.length > 0 && !projectId) {
      setProjectId(projects[0].id);
    }
  }, [projects, queryProjectId]);

  const { data: boardData, isLoading } = useQuery({
    queryKey: ["board", projectId],
    queryFn: () => taskService.getAssignedBoard(projectId),
    enabled: !!projectId,
  });

  // Drag optimization hook pipeline matrix
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }) =>
      taskService.updateTaskStatus(taskId, status),
    onMutate: async ({
      taskId,
      status,
      sourceCol,
      destCol,
      sourceIndex,
      destIndex,
    }) => {
      await queryClient.cancelQueries({ queryKey: ["board", projectId] });
      const previousBoard = queryClient.getQueryData(["board", projectId]);

      if (previousBoard) {
        const updatedTasks = { ...previousBoard.tasks };
        if (updatedTasks[taskId]) {
          updatedTasks[taskId] = { ...updatedTasks[taskId], status: destCol };
        }

        const updatedColumns = { ...previousBoard.columns };
        const sourceIds = Array.from(updatedColumns[sourceCol]?.taskIds || []);
        
        // 🚨 FIXED: Splice index calculation corrected from 'projectId' down to static index parameter count '1'
        sourceIds.splice(sourceIndex, 1);

        if (sourceCol === destCol) {
          sourceIds.splice(destIndex, 0, taskId);
          updatedColumns[sourceCol] = {
            ...updatedColumns[sourceCol],
            taskIds: sourceIds,
          };
        } else {
          const destIds = Array.from(updatedColumns[destCol]?.taskIds || []);
          destIds.splice(destIndex, 0, taskId);

          updatedColumns[sourceCol] = {
            ...updatedColumns[sourceCol],
            taskIds: sourceIds,
          };
          updatedColumns[destCol] = {
            ...updatedColumns[destCol],
            taskIds: destIds,
          };
        }

        queryClient.setQueryData(["board", projectId], {
          ...previousBoard,
          tasks: updatedTasks,
          columns: updatedColumns,
        });
      }
      return { previousBoard };
    },
    onError: (err, variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(["board", projectId], context.previousBoard);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["board", projectId] });
    },
  });

  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    updateStatusMutation.mutate({
      taskId: draggableId,
      status: destination.droppableId,
      sourceCol: source.droppableId,
      destCol: destination.droppableId,
      sourceIndex: source.index,
      destIndex: destination.index,
    });
  };

  const columnsOrder = ["todo", "inprogress", "review", "done"];
  const tasks = boardData?.tasks || {};
  const columns = boardData?.columns || {};

  // Find currently loaded workspace details cleanly
  const activeProjectObject = projects?.find((p) => p.id === projectId);
  const currentDisplayedName = activeProjectObject?.name || queryProjectName || "Select Project";

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Loading Developer Board...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      {/* Header Context Bar */}
      <div className="flex justify-between items-center mb-6">
        <button className="px-4 py-1.5 border border-indigo-100 rounded-full text-xs font-black text-indigo-600 bg-indigo-50/50 transition-all uppercase tracking-wider">
          Developer Workspace
        </button>
      </div>

      {/* Dynamic Dropdown Toolbar Section */}
      <div className="px-6 mb-6 flex justify-between items-center">
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm text-slate-700 hover:bg-slate-50 transition-colors z-50 relative cursor-pointer"
          >
            <FolderKanban size={18} className="text-blue-600" />
            <span className="font-bold text-sm">
              {currentDisplayedName}
            </span>
            <ChevronDown size={14} className="text-slate-400 ml-1" />
          </button>

          {/* Fully Unlocked Interactive Dropdown Layout */}
          {showProjectDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-100 rounded-xl shadow-xl z-[200] py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Switch Workspace
              </div>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setProjectId(project.id); // Allows dynamic context adjustments anytime
                      setShowProjectDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors ${project.id === projectId ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {project.name}
                    {project.id === projectId && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </button>
                ))
              ) : (
                <div className="text-[12px] font-black text-slate-400 flex justify-center items-center py-2">
                  No Project Assigned
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Active Project ID:{" "}
          <span className="font-bold text-slate-600">#{projectId}</span>
        </div>
      </div>

      {/* Kanban Board Board Grids */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columnsOrder.map((columnId) => {
            const currentColumn = columns[columnId] || {
              id: columnId,
              taskIds: [],
            };

            const columnTasks = currentColumn.taskIds
              .map((id) => tasks[id])
              .filter((task) => task && task.type !== "epic");

            const columnTitle =
              columnId === "todo"
                ? "To Do"
                : columnId === "inprogress"
                  ? "In Progress"
                  : columnId === "review"
                    ? "Review"
                    : "Done";

            return (
              <div
                key={columnId}
                className="bg-slate-50/70 rounded-2xl p-4 flex flex-col min-h-[75vh] border border-slate-100"
              >
                <div className="flex justify-between items-center mb-5 px-1">
                  <h3 className="font-black text-slate-700 text-xs tracking-wider uppercase">
                    {columnTitle}
                  </h3>
                  <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    {columnTasks.length}
                  </span>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-4 flex-1 transition-colors rounded-xl min-h-[150px] ${snapshot.isDraggingOver ? "bg-indigo-50/30" : ""}`}
                    >
                      {columnTasks.map((task, index) => (
                        <DraggableCard
                          key={task.id}
                          task={task}
                          index={index}
                          onOpen={() => openTaskDetail(task)}
                          onChatClick={() => setActiveChatTask(task)}
                          onMeetingClick={() => setActiveMeetingTask(task)}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Operations Trigger Modals */}
      {isModalOpen && (
        <TaskModal task={selectedTask} onClose={() => setIsModalOpen(false)} />
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

const DraggableCard = ({
  task,
  index,
  onOpen,
  onChatClick,
  onMeetingClick,
}) => {
  const [searchParams] = useSearchParams();
  const [isHighlighted, setIsHighlighted] = useState(false);
  const cardRef = useRef(null); // 🎯 Card ko track karne keliye ref lagayi

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((sub) => sub.is_done).length || 0;

  // 🎯 URL Parameter checking + Smooth Auto Scroll + Premium Glow Timer
  useEffect(() => {
    const highlightId = searchParams.get("highlightTaskId");
    
    if (highlightId && String(task.id) === String(highlightId)) {
      setIsHighlighted(true);

      // 🔥 Premium Feature: Agar card screen se baahir neeche chhupa hai, to scroll karke samne le aaye
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center", // Card screen ke bilkul center mein aakar rukega
        });
      }, 300); // Halkay se delay ke sath taake board layout pehle render ho jaye

      // 3 seconds baad glow smoothly khatam ho jaye
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, task.id]);

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          // 🎯 provided.innerRef aur cardRef ko aapas mein merge kiya HTML element attach karne keliye
          ref={(node) => {
            provided.innerRef(node);
            cardRef.current = node;
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onOpen}
          // 🎯 Dynamic Active Style Trigger Logic:
          className={`p-5 rounded-2xl border transition-all duration-500 select-none group cursor-pointer ${
            snapshot.isDragging
              ? "border-indigo-500 shadow-2xl rotate-2 z-50 bg-white"
              : isHighlighted
              ? "border-blue-500 ring-4 ring-blue-500/20 shadow-2xl scale-[1.03] bg-gradient-to-br from-white to-blue-50/40 z-40" // 🔥 UCollyx Special Premium Active Glow
              : "bg-white border-slate-100 shadow-sm hover:border-indigo-400 hover:shadow-md"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <span className={`text-[10px] font-black transition-colors uppercase tracking-widest ${
              isHighlighted ? "text-blue-500" : "text-slate-300 group-hover:text-indigo-400"
            }`}>
              #{task.id}
            </span>
            <div className={`p-1.5 rounded-xl transition-colors ${
              isHighlighted ? "bg-blue-50" : "bg-slate-50 group-hover:bg-indigo-50"
            }`}>
              {task.type === "bug" ? (
                <Bug size={14} className="text-red-500" />
              ) : task.type === "story" ? (
                <BookText size={14} className="text-green-600" />
              ) : (
                <ClipboardList size={14} className="text-blue-500" />
              )}
            </div>
          </div>

          <p className="text-[14px] font-bold text-slate-700 leading-snug mb-3 group-hover:text-slate-900 transition-colors">
            {task.title}
          </p>

          {task.ParentTask && (
            <div className="mb-4">
              <span className="bg-pink-50 text-pink-600 text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tight border border-pink-100/50">
                EPIC : {task.ParentTask.title}
              </span>
            </div>
          )}

          {task.priority && (
            <div className="flex items-center gap-1.5 mb-4">
              <div
                className={`w-1.5 h-1.5 rounded-full ${task.priority === "High" ? "bg-orange-500" : "bg-blue-500"}`}
              />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Priority: {task.priority}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-slate-50">
            <div className="flex -space-x-1.5">
              {(task.assignees || []).map((user, i) => (
                <div
                  key={user.id || i}
                  title={user.full_name}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm bg-indigo-600 text-white flex items-center justify-center text-[9px] font-black uppercase overflow-hidden shrink-0"
                >
                  {user.avatar_url ? (
                    <img
                      src={import.meta.env.VITE_API_URL + user.avatar_url}
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

            <div className="flex items-center gap-3 text-slate-400 font-bold">
              <span className="text-[10px] font-black text-slate-400">
                {completedSubtasks}/{totalSubtasks}
              </span>
              <div className="flex gap-1.5 pl-2 border-l border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChatClick();
                  }}
                  className="hover:text-indigo-600 text-slate-300 transition-colors p-1"
                >
                  <MessageSquare size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMeetingClick();
                  }}
                  className="hover:text-red-500 text-slate-300 transition-colors p-1"
                >
                  <Video size={13} />
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