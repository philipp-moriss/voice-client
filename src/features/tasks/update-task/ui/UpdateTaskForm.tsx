import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Textarea, Select } from '@shared/ui';
import { TaskStatus } from '@entities/task';
import type { Task, UpdateTaskDto, TaskStatusType } from '@entities/task';
import { taskApi } from '@shared/api/task-api';
import styles from './UpdateTaskForm.module.css';

export function UpdateTaskForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatusType>(TaskStatus.PENDING);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const loadTask = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await taskApi.getTaskById(id);
        setTask(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setStatus(data.status);
      } catch (err) {
        setError('Не удалось загрузить задачу');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [id, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Название задачи обязательно');
      return;
    }

    if (!id) return;

    setIsSaving(true);
    setError(null);

    try {
      const data: UpdateTaskDto = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      };

      await taskApi.updateTask(id, data);
      navigate('/');
    } catch (err) {
      setError('Не удалось обновить задачу');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    { value: TaskStatus.PENDING, label: 'Ожидает' },
    { value: TaskStatus.PROCESSING, label: 'В процессе' },
    { value: TaskStatus.COMPLETED, label: 'Завершена' },
    { value: TaskStatus.FAILED, label: 'Ошибка' },
  ];

  if (isLoading) {
    return <div className={styles.loading}>Загрузка задачи...</div>;
  }

  if (error && !task) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <Button onClick={() => navigate('/')}>Вернуться к списку</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Редактирование задачи</h2>
      
      <Input
        label="Название задачи"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Введите название задачи"
        disabled={isSaving}
        error={error && !title.trim() ? error : undefined}
      />
      
      <Textarea
        label="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Введите описание задачи"
        disabled={isSaving}
      />
      
      <Select
        label="Статус"
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatusType)}
        options={statusOptions}
        disabled={isSaving}
      />
      
      {error && title.trim() && <div className={styles.errorMessage}>{error}</div>}
      
      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/')}
          disabled={isSaving}
        >
          Отмена
        </Button>
        <Button type="submit" disabled={isSaving} fullWidth>
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>
    </form>
  );
}

