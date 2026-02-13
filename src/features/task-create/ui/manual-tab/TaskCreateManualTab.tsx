import { useState } from 'react';
import { Button, Input, Textarea } from '@shared/ui';
import { useTaskCreate } from '../model';
import styles from './TaskCreateManualTab.module.css';

interface TaskCreateManualTabProps {
  onSave: (override?: { title: string; description?: string }) => void;
  onSuccess?: () => void;
}

export function TaskCreateManualTab({ onSave }: TaskCreateManualTabProps) {
  const { draft, setDraftFromManual } = useTaskCreate();
  const [localTitle, setLocalTitle] = useState(draft.title);
  const [localDescription, setLocalDescription] = useState(draft.description ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const title = localTitle.trim();
    if (!title) {
      setError('Название задачи обязательно');
      return;
    }
    setError(null);
    setDraftFromManual({ title, description: localDescription.trim() || undefined });
    onSave({ title, description: localDescription.trim() || undefined });
  };

  return (
    <div className={styles.wrapper}>
      <Input
        label="Название задачи"
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
        placeholder="Введите название задачи"
        error={error && !localTitle.trim() ? error : undefined}
      />
      <Textarea
        label="Описание (необязательно)"
        value={localDescription}
        onChange={(e) => setLocalDescription(e.target.value)}
        placeholder="Введите описание задачи"
      />
      {error && localTitle.trim() && <div className={styles.error}>{error}</div>}
      <Button type="button" onClick={handleSave} fullWidth>
        Создать задачу
      </Button>
    </div>
  );
}
