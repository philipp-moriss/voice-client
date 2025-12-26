import { apiClient } from './axios-instance';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@entities/task';

export const taskApi = {
  createTask: async (data: CreateTaskDto): Promise<Task> => {
    const response = await apiClient.post<Task>('/task', data);
    return response.data;
  },

  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/task');
    return response.data;
  },

  getTaskById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/task/${id}`);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/task/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/task/${id}`);
  },
};

