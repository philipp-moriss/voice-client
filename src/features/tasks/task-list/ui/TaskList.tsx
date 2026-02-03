import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task, TaskStatusType } from '@entities/task';
import { TaskStatus } from '@entities/task';
import {
  deleteTaskAction,
  getAllTasksAction,
  updateTaskStatusAction,
} from '@/entities/task/api/actions';
import { Card, Button } from '@shared/ui';
import styles from './TaskList.module.css';

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

const STATUS_OPTIONS = [
  { value: TaskStatus.PENDING, label: 'Ожидает' },
  { value: TaskStatus.PROCESSING, label: 'В процессе' },
  { value: TaskStatus.COMPLETED, label: 'Завершена' },
  { value: TaskStatus.FAILED, label: 'Ошибка' },
];

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
  const navigate = useNavigate();

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

  const getStatusClass = (status: string) => {
    const statusClassMap: Record<string, string> = {
      [TaskStatus.PENDING]: styles.statusPending,
      [TaskStatus.PROCESSING]: styles.statusProcessing,
      [TaskStatus.COMPLETED]: styles.statusCompleted,
      [TaskStatus.FAILED]: styles.statusFailed,
    };
    return statusClassMap[status] || '';
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
                <div
                  key={task.id}
                  className={styles.taskCardWrapper}
                  onClick={() => openStatusModal(task)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openStatusModal(task);
                    }
                  }}
                >
                <Card className={styles.taskCard}>
                  <div className={styles.taskHeader}>
                    <h3 className={styles.taskTitle}>{task.title}</h3>
                    <div className={styles.taskHeaderRight}>
                      <span
                        className={`${styles.status} ${getStatusClass(task.status)}`}
                      >
                        {SECTION_TITLES[task.status]}
                      </span>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/task/${task.id}/edit`);
                        }}
                        aria-label="Редактировать задачу"
                      >
                        <PencilIcon />
                      </button>
                    </div>
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
                        Обновлено:{' '}
                        {new Date(task.updatedAt).toLocaleString('ru-RU')}
                      </span>
                    )}
                  </div>
                  <div className={styles.taskActions}>
                    <Button
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                      }}
                    >
                      Удалить
                    </Button>
                  </div>
                </Card>
                </div>
              ))}
              </div>
            </div>
          </section>
        )
      )}

      {modalTask && (
        <div
          className={styles.modalOverlay}
          onClick={closeStatusModal}
          role="presentation"
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-modal-title"
          >
            <h3 id="status-modal-title" className={styles.modalTitle}>
              {modalTask.title}
            </h3>
            <p className={styles.modalSubtitle}>Изменить статус задачи</p>
            <div className={styles.statusPicker}>
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.statusOption} ${styles[`statusOption_${opt.value}`]} ${modalStatus === opt.value ? styles.statusOptionSelected : ''}`}
                  onClick={() => setModalStatus(opt.value as TaskStatusType)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={closeStatusModal}>
                Отмена
              </Button>
              <Button
                onClick={handleSaveStatus}
                disabled={isSavingStatus || modalStatus === modalTask.status}
              >
                {isSavingStatus ? 'Сохранение…' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PencilIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
