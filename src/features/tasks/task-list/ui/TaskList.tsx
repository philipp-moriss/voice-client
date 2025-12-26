import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '@entities/task';
import { taskApi } from '@shared/api/task-api';
import { Card, Button } from '@shared/ui';
import styles from './TaskList.module.css';

interface TaskListProps {
  onTaskDeleted?: () => void;
}

export function TaskList({ onTaskDeleted }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskApi.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError('Не удалось загрузить задачи');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
      return;
    }

    try {
      await taskApi.deleteTask(id);
      await loadTasks();
      onTaskDeleted?.();
    } catch (err) {
      alert('Не удалось удалить задачу');
      console.error(err);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Ожидает',
      processing: 'В процессе',
      completed: 'Завершена',
      failed: 'Ошибка',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const statusClassMap: Record<string, string> = {
      pending: styles.statusPending,
      processing: styles.statusProcessing,
      completed: styles.statusCompleted,
      failed: styles.statusFailed,
    };
    return statusClassMap[status] || '';
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка задач...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <Button onClick={loadTasks}>Попробовать снова</Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return <div className={styles.empty}>Нет задач. Создайте первую задачу!</div>;
  }

  return (
    <div className={styles.taskList}>
      {tasks.map((task) => (
        <Card key={task.id} className={styles.taskCard}>
          <div className={styles.taskHeader}>
            <h3 className={styles.taskTitle}>{task.title}</h3>
            <span className={`${styles.status} ${getStatusClass(task.status)}`}>
              {getStatusLabel(task.status)}
            </span>
          </div>
          {task.description && (
            <p className={styles.taskDescription}>{task.description}</p>
          )}
          <div className={styles.taskMeta}>
            <span className={styles.taskDate}>
              Создано: {new Date(task.createdAt).toLocaleString('ru-RU')}
            </span>
            {task.updatedAt !== task.createdAt && (
              <span className={styles.taskDate}>
                Обновлено: {new Date(task.updatedAt).toLocaleString('ru-RU')}
              </span>
            )}
          </div>
          <div className={styles.taskActions}>
            <Button
              variant="secondary"
              onClick={() => navigate(`/task/${task.id}/edit`)}
            >
              Редактировать
            </Button>
            <Button variant="danger" onClick={() => handleDelete(task.id)}>
              Удалить
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

