import { TaskCreateProvider, useTaskCreate } from '../model';
import type { CreationModeType } from '../model';
import { createTaskAction } from '@entities/task';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@shared/ui';
import { TaskCreateVoiceTab } from './voice-tab/TaskCreateVoiceTab';
import styles from './TaskCreateTabs.module.css';
import { TaskCreateManualTab } from './manual-tab/TaskCreateManualTab';

interface TaskCreateTabsProps {
  onSuccess?: () => void;
}

const voiceRecordingSupported =
  typeof window !== 'undefined' &&
  typeof navigator?.mediaDevices?.getUserMedia === 'function' &&
  typeof MediaRecorder !== 'undefined';

export function TaskCreateTabs({ onSuccess }: TaskCreateTabsProps) {
  return (
    <TaskCreateProvider>
      <TaskCreateTabsInner onSuccess={onSuccess} />
    </TaskCreateProvider>
  );
}

function TaskCreateTabsInner({ onSuccess }: TaskCreateTabsProps) {
  const { draft, mode, setMode, resetDraft } =
    useTaskCreate();

  function handleSave(override?: { title: string; description?: string }) {
    const toSave = override ?? draft;

    if (!toSave?.title?.trim()) return;
    createTaskAction(toSave.title, toSave.description)
      .then(() => {
        resetDraft();
        onSuccess?.();
      });
  }

  return (
    <Tabs
      value={mode}
      onValueChange={(next) => setMode(next as CreationModeType)}
      className={styles.screen}
    >
      <TabsList className={styles.tabs}>
        <TabsTrigger
          value="manual"
          className={styles.tab}
          activeClassName={styles.tabActive}
        >
          Вручную
        </TabsTrigger>
        <TabsTrigger
          value="voice"
          className={styles.tab}
          activeClassName={styles.tabActive}
          disabled={!voiceRecordingSupported}
          title={
            !voiceRecordingSupported ? 'Запись голоса недоступна в этом браузере' : undefined
          }
        >
          Голос
          {!voiceRecordingSupported && ' (недоступно)'}
        </TabsTrigger>
      </TabsList>
      <div className={styles.panel}>
        <TabsContent value="manual">
          <TaskCreateManualTab onSave={handleSave} onSuccess={onSuccess} />
        </TabsContent>
        <TabsContent value="voice">
          <TaskCreateVoiceTab onSave={handleSave} onSuccess={onSuccess} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
