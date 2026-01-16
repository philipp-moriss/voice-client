import { createTaskAction } from '@/entities/task/api/actions';
import { Button, Input, Textarea } from '@shared/ui';
import type { FormEvent } from 'react';
import { useState } from 'react';
import styles from './CreateTaskForm.module.css';

interface CreateTaskFormProps {
  onSuccess?: () => void;
}

export function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Название задачи обязательно');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createTaskAction(title, description);
      setTitle('');
      setDescription('');
      onSuccess?.();
    } catch (err) {
      setError('Не удалось создать задачу');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Название задачи"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Введите название задачи"
        disabled={isLoading}
        error={error && !title.trim() ? error : undefined}
      />
      <Textarea
        label="Описание (необязательно)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Введите описание задачи"
        disabled={isLoading}
      />
      {error && title.trim() && <div className={styles.error}>{error}</div>}
      <Button type="submit" disabled={isLoading} fullWidth>
        {isLoading ? 'Создание...' : 'Создать задачу'}
      </Button>
    </form>
  );
}

