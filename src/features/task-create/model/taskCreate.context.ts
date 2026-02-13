import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { TaskDraft, CreationMode } from '@entities/task';

const emptyDraft: TaskDraft = {
  title: '',
  description: '',
  source: 'manual',
};

export type CreationModeType = CreationMode;

interface TaskCreateContextValue {
  draft: TaskDraft;
  mode: CreationModeType;
  setMode: (mode: CreationModeType) => void;
  setDraftFromVoice: (partial: Partial<TaskDraft>) => void;
  setDraftFromManual: (partial: Partial<TaskDraft>) => void;
  resetDraft: () => void;
  setDraft: (updater: (prev: TaskDraft) => TaskDraft) => void;
}

const TaskCreateContext = createContext<TaskCreateContextValue | null>(null);

export function TaskCreateProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft);
  const [mode, setMode] = useState<CreationModeType>('voice');

  const setDraftFromVoice = useCallback((partial: Partial<TaskDraft>) => {
    setDraft((prev) => ({
      ...prev,
      ...partial,
      source: 'voice',
    }));
  }, []);

  const setDraftFromManual = useCallback((partial: Partial<TaskDraft>) => {
    setDraft((prev) => ({
      ...prev,
      ...partial,
      source: 'manual',
    }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(emptyDraft);
  }, []);

  const setModeAndPreserveDraft = useCallback((newMode: CreationModeType) => {
    setMode(newMode);
  }, []);

  const value = useMemo<TaskCreateContextValue>(
    () => ({
      draft,
      mode,
      setMode: setModeAndPreserveDraft,
      setDraftFromVoice,
      setDraftFromManual,
      resetDraft,
      setDraft: (updater) => setDraft((prev) => updater(prev)),
    }),
    [draft, mode, setModeAndPreserveDraft, setDraftFromVoice, setDraftFromManual, resetDraft],
  );

  return React.createElement(TaskCreateContext.Provider, { value }, children);
}

export function useTaskCreate() {
  const ctx = useContext(TaskCreateContext);
  if (!ctx) {
    throw new Error('useTaskCreate must be used within TaskCreateProvider');
  }
  return ctx;
}
