import { useEffect, useState } from 'react';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';
import { speechApi } from '@shared/api';
import { Button, Input, Textarea } from '@shared/ui';
import { useTaskCreate } from '../../model';
import styles from './TaskCreateVoiceTab.module.css';

const MAX_DURATION_MS = 60_000;

const voiceSupported =
  typeof window !== 'undefined' &&
  typeof navigator?.mediaDevices?.getUserMedia === 'function' &&
  typeof MediaRecorder !== 'undefined';

interface TaskCreateVoiceTabProps {
  onSave: (override?: { title: string; description?: string }) => void;
  onSuccess?: () => void;
}

export function TaskCreateVoiceTab({ onSave }: TaskCreateVoiceTabProps) {
  const { draft, setDraftFromVoice, setDraft, resetDraft = () => {} } = useTaskCreate();
  const [processing, setProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const recorderControls = useVoiceVisualizer();
  const {
    stopRecording,
    isRecordingInProgress,
    recordedBlob,
    isAvailableRecordedAudio,
    error: recorderError,
    recordingTime,
    clearCanvas,
  } = recorderControls;

  // Авто-остановка на 60 с
  useEffect(() => {
    if (!isRecordingInProgress || recordingTime < MAX_DURATION_MS) return;
    stopRecording();
  }, [isRecordingInProgress, recordingTime, stopRecording]);

  const canCreateFromRecording =
    Boolean(recordedBlob) &&
    isAvailableRecordedAudio &&
    !processing &&
    !isRecordingInProgress &&
    !draft.title;

  function handleCreateTaskFromRecording() {
    if (!recordedBlob || !isAvailableRecordedAudio) return;
    setApiError(null);
    setProcessing(true);
    speechApi
      .createTaskDraftFromAudio(recordedBlob)
      .then((result) => {
        setDraftFromVoice({
          title: result.title ?? '',
          description: result.description ?? '',
          transcription: result.transcription,
          audioDurationSec: result.audioDurationSec ?? Math.ceil(recordedBlob.size / 1000),
        });
      })
      .catch(() => {
        setApiError('Не удалось распознать голос. Попробуйте ещё раз или введите задачу вручную.');
      })
      .finally(() => {
        setProcessing(false);
      });
  }

  const canSave = draft.title.trim().length > 0 && !processing && !isRecordingInProgress;
  const showDraftForm = Boolean(draft.title || draft.description);

  function handleRecordAgain() {
    resetDraft();
    clearCanvas();
    setApiError(null);
  }

  if (!voiceSupported) {
    return (
      <div className={styles.unsupported}>
        <p>Запись голоса недоступна в этом браузере. Используйте вкладку «Вручную».</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {!showDraftForm && (
        <>
          <VoiceVisualizer
            controls={recorderControls}
            height={120}
            mainBarColor="#00ff88"
            secondaryBarColor="#3a3a3a"
            mainContainerClassName={styles.visualizer}
            defaultMicrophoneIconColor="#00ff88"
            defaultAudioWaveIconColor="#00ff88"
            controlButtonsClassName={styles.visualizerControlBtns}
          />

          {canCreateFromRecording && (
            <Button
              type="button"
              onClick={handleCreateTaskFromRecording}
              fullWidth
              className={styles.createFromRecording}
            >
              Создать таску на основе записи
            </Button>
          )}
        </>
      )}

      {showDraftForm && (
        <Button type="button" variant="secondary" onClick={handleRecordAgain} className={styles.recordAgain}>
          Записать заново
        </Button>
      )}

      {(recorderError || apiError) && (
        <div className={styles.error} role="alert">
          {recorderError?.message ?? apiError}
          <p className={styles.errorHint}>Можно повторить запись или перейти во вкладку «Вручную».</p>
        </div>
      )}
      {processing && <p className={styles.processing}>Обработка…</p>}

      {showDraftForm && (
        <div className={styles.form}>
          <Input
            label="Название задачи"
            value={draft.title}
            onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Название задачи"
            disabled={processing}
          />
          <Textarea
            label="Описание (необязательно)"
            value={draft.description ?? ''}
            onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Описание"
            disabled={processing}
          />
          <Button type="button" onClick={() => onSave({ title: draft.title, description: draft.description })} disabled={!canSave} fullWidth>
            Сохранить задачу
          </Button>
        </div>
      )}
    </div>
  );
}
