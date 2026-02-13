import { useState, useRef, useCallback } from 'react';

const MAX_DURATION_SEC = 60;

export interface UseMediaRecorderResult {
  start: () => Promise<void>;
  stop: () => Promise<Blob | null>;
  isRecording: boolean;
  durationSec: number;
  error: string | null;
  isSupported: boolean;
}

export function useMediaRecorder(): UseMediaRecorderResult {
  const [isRecording, setIsRecording] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const isSupported =
    typeof window !== 'undefined' &&
    typeof navigator?.mediaDevices?.getUserMedia === 'function' &&
    typeof MediaRecorder !== 'undefined';

  const start = useCallback(async () => {
    if (!isSupported) {
      setError('Запись голоса не поддерживается в этом браузере');
      return;
    }
    setError(null);
    setDurationSec(0);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(100);
      setIsRecording(true);
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const capped = Math.min(elapsed, MAX_DURATION_SEC);
        setDurationSec(capped);
        if (capped >= MAX_DURATION_SEC && mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 200);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось получить доступ к микрофону';
      setError(message);
      setIsRecording(false);
    }
  }, [isSupported]);

  const stop = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        resolve(null);
        return;
      }
      recorder.onstop = () => {
        setIsRecording(false);
        const finalDuration = Math.min(
          Math.floor((Date.now() - startTimeRef.current) / 1000),
          MAX_DURATION_SEC
        );
        setDurationSec(finalDuration);
        if (chunksRef.current.length === 0) {
          resolve(null);
          return;
        }
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        resolve(blob);
      };
      recorder.stop();
    });
  }, []);

  return {
    start,
    stop,
    isRecording,
    durationSec,
    error,
    isSupported,
  };
}
