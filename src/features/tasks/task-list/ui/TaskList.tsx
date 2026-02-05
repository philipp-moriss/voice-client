import { useCallback, useEffect, useState } from 'react';
import type { Task, TaskStatusType } from '@entities/task';
import { TaskStatus } from '@entities/task';
import {
  deleteTaskAction,
  getAllTasksAction,
  updateTaskStatusAction,
} from '@/entities/task/api/actions';
import { Button } from '@shared/ui';
import styles from './TaskList.module.css';
import { ChevronIcon } from '@shared/ui/icons';
import { StatusModal } from './StatusModal';
import { TaskItem } from './TaskItem';

const STATUS_ORDER: TaskStatusType[] = [
  TaskStatus.PENDING,
  TaskStatus.PROCESSING,
  TaskStatus.COMPLETED,
  TaskStatus.FAILED,
];

const SECTION_TITLES: Record<TaskStatusType, string> = {
  [TaskStatus.PENDING]: 'Ожидают',
  [TaskStatus.PROCESSING]: 'В процессе',
  [TaskStatus.COMPLETED]: 'Завершённые',
  [TaskStatus.FAILED]: 'С ошибкой',
};

interface TaskListProps {
  onTaskDeleted?: () => void;
}

export function TaskList({ onTaskDeleted }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalTask, setModalTask] = useState<Task | null>(null);
  const [modalStatus, setModalStatus] = useState<TaskStatusType>(TaskStatus.PENDING);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<TaskStatusType>>(
    () => new Set([TaskStatus.PENDING])
  );
  const toggleSection = (status: TaskStatusType) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllTasksAction();
      setTasks(data);
    } catch (err) {
      setError('Не удалось загрузить задачи');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
      return;
    }

    try {
      await deleteTaskAction(id);
      await loadTasks();
      onTaskDeleted?.();
    } catch (err) {
      alert('Не удалось удалить задачу');
      console.error(err);
    }
  };

  const openStatusModal = (task: Task) => {
    setModalTask(task);
    setModalStatus(task.status);
  };

  const closeStatusModal = () => {
    setModalTask(null);
    setIsSavingStatus(false);
  };

  const handleSaveStatus = async () => {
    if (!modalTask || modalStatus === modalTask.status) {
      closeStatusModal();
      return;
    }
    setIsSavingStatus(true);
    try {
      await updateTaskStatusAction(modalTask.id, modalStatus);
      await loadTasks();
      closeStatusModal();
    } catch (err) {
      alert('Не удалось обновить статус');
      console.error(err);
    } finally {
      setIsSavingStatus(false);
    }
  };

  const tasksByStatus = STATUS_ORDER.map((status) => ({
    status,
    title: SECTION_TITLES[status],
    tasks: tasks.filter((t) => t.status === status),
  }));

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
      {tasksByStatus.map(({ status, title, tasks: sectionTasks }) =>
        sectionTasks.length === 0 ? null : (
          <section key={status} className={styles.section}>
            <button
              type="button"
              className={styles.sectionHeader}
              onClick={() => toggleSection(status)}
              aria-expanded={expandedSections.has(status)}
              aria-controls={`section-${status}`}
              id={`section-heading-${status}`}
            >
              <span className={styles.sectionTitleText}>{title}</span>
              <span className={styles.sectionCount}>{sectionTasks.length}</span>
              <ChevronIcon className={expandedSections.has(status) ? styles.chevronOpen : ''} />
            </button>
            <div
              id={`section-${status}`}
              role="region"
              aria-labelledby={`section-heading-${status}`}
              className={`${styles.sectionContent} ${expandedSections.has(status) ? styles.sectionContentOpen : ''}`}
            >
              <div className={styles.sectionList}>
                {sectionTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onOpenStatusModal={openStatusModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      )}

      {modalTask && (
        <StatusModal
          task={modalTask}
          currentStatus={modalStatus}
          onStatusChange={setModalStatus}
          onClose={closeStatusModal}
          onSave={handleSaveStatus}
          isSaving={isSavingStatus}
        />
      )}
    </div>
  );
}
