import { apiClient } from './axios-instance';
import type { TaskDraft } from '@entities/task';

/**
 * API client for audio-to-task draft (POST /speech/task-from-audio).
 * Sends recorded audio; backend returns TaskDraft with title/description from transcription.
 */
export const speechApi = {
  createTaskDraftFromAudio: async (audioBlob: Blob): Promise<TaskDraft> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    const response = await apiClient.post<TaskDraft>('/speech/task-from-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
