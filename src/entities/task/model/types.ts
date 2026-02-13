export const TaskStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

/** Draft task before persistence (voice/assistant/manual). */
export type TaskDraftSource = 'voice' | 'assistant' | 'manual';

export interface TaskDraft {
  title: string;
  description?: string;
  source: TaskDraftSource;
  audioDurationSec?: number;
  transcription?: string;
}

/** Selected mode on the Create Task screen. */
export type CreationMode = 'voice' | 'assistant' | 'manual';

