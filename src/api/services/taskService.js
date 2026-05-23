import API from "../axios";

export const taskService = {
  getBoard: async (projectId) => {
    const res = await API.get(`/tasks/board/${projectId}`);
    return res.data;
  },

  getAssignedBoard: async (projectId) => {
    const res = await API.get(`/tasks/board/assigned/${projectId}`);
    return res.data;
  },

  getTodayTasks: async () => {
    const res = await API.get(`/tasks/board/today-tasks`);
    // Backend se { success: true, data: [...] } aa raha hai, to hum direct res.data return karenge
    console.log(res,"==================================")
    return res.data; 
  },

  updateTaskPosition: async (taskId, data) => {
    return await API.patch(`/tasks/${taskId}/position`, data);
  },

  createTask: async (taskData) => {
    return await API.post(`/tasks/create`, taskData);
  },

  updateTask: async (taskId, updatedFields) => {
    const res = await API.put(`/tasks/${taskId}`, updatedFields);
    return res.data;
  },

  getComments: async (taskId) => {
    const res = await API.get(`/tasks/${taskId}/comments`);
    return res.data;
  },

  postComment: async (taskId, commentText) => {
    const res = await API.post(`/tasks/${taskId}/comments`, {
      comment_text: commentText,
    });
    return res.data;
  },

  getSubtasks: async (taskId) => {
    const res = await API.get(`/tasks/${taskId}/subtasks`);
    return res.data;
  },

  createSubtask: async (taskId, subtaskData) => {
    const res = await API.post(`/tasks/${taskId}/subtasks`, subtaskData);
    return res.data;
  },

  toggleSubtask: async (subtaskId) => {
    const res = await API.put(`/tasks/subtasks/${subtaskId}/toggle`);
    return res.data;
  },

  getTaskAssignees: async (taskId) => {
    const res = await API.get(`/tasks/${taskId}/assignees`);
    return res.data;
  },

  toggleAssignee: async (taskId, userId) => {
    const res = await API.post(`/tasks/${taskId}/assignees/toggle`, {
      user_id: userId,
    });
    return res.data;
  },

  getProjectEpics: async (projectId) => {
    const res = await API.get(`/tasks/projects/${projectId}/epics`);
    return res.data;
  },

  updateTaskEpic: async (taskId, epicId) => {
    const res = await API.put(`/tasks/${taskId}/epic`, { epic_id: epicId });
    return res.data;
  },

  getTaskMessages: async (taskId) => {
    const response = await API.get(`/tasks/${taskId}/messages`);
    return response.data; 
  },

  sendTaskMessage: async (taskId, text) => {
    const response = await API.post(`/tasks/${taskId}/messages`, { text });
    return response.data;
  },
};
