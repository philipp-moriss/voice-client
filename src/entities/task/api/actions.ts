import { taskApi } from "./api";
import type { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from "../model/types";

export const createTaskAction = async (
  title: string,
  description: string
): Promise<Task> => {
  const data: CreateTaskDto = {
    title: title.trim(),
    description: description.trim() || undefined,
  };
  return taskApi.createTask(data);
};

export const getAllTasksAction = async (): Promise<Task[]> => {
  return taskApi.getAllTasks();
};

export const getTaskByIdAction = async (id: string): Promise<Task> => {
  return taskApi.getTaskById(id);
};

export const deleteTaskAction = async (id: string): Promise<void> => {
  return taskApi.deleteTask(id);
};

export const updateTaskAction = async (id: string, title: string, description: string, status: TaskStatus): Promise<Task> => {
  const data: UpdateTaskDto = {
    title: title.trim(),
    description: description.trim() || undefined,
    status,
  };
  return taskApi.updateTask(id, data);
};