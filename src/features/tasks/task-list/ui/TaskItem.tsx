import { useNavigate } from 'react-router-dom';
import type { Task, TaskStatusType } from '@entities/task';
import { TaskStatus } from '@entities/task';
import { Card, Button } from '@shared/ui';
import { PencilIcon } from '@shared/ui/icons';
import styles from './TaskList.module.css';

const SECTION_TITLES: Record<TaskStatusType, string> = {
  [TaskStatus.PENDING]: 'Ожидают',
  [TaskStatus.PROCESSING]: 'В процессе',
  [TaskStatus.COMPLETED]: 'Завершённые',
  [TaskStatus.FAILED]: 'С ошибкой',
};

function getStatusClass(status: string): string {
  const statusClassMap: Record<string, string> = {
    [TaskStatus.PENDING]: styles.statusPending,
    [TaskStatus.PROCESSING]: styles.statusProcessing,
    [TaskStatus.COMPLETED]: styles.statusCompleted,
    [TaskStatus.FAILED]: styles.statusFailed,
  };
  return statusClassMap[status] || '';
}

interface TaskItemProps {
  task: Task;
  onOpenStatusModal: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onOpenStatusModal, onDelete }: TaskItemProps) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.taskCardWrapper}
      onClick={() => onOpenStatusModal(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenStatusModal(task);
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
              onDelete(task.id);
            }}
          >
            Удалить
          </Button>
        </div>
      </Card>
    </div>
  );
}
