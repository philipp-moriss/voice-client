import type { Task, TaskStatusType } from '@entities/task';
import { TaskStatus } from '@entities/task';
import { Button } from '@shared/ui';
import styles from './TaskList.module.css';

const STATUS_OPTIONS = [
  { value: TaskStatus.PENDING, label: 'Ожидает' },
  { value: TaskStatus.PROCESSING, label: 'В процессе' },
  { value: TaskStatus.COMPLETED, label: 'Завершена' },
  { value: TaskStatus.FAILED, label: 'Ошибка' },
];

interface StatusModalProps {
  task: Task;
  currentStatus: TaskStatusType;
  onStatusChange: (status: TaskStatusType) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export function StatusModal({
  task,
  currentStatus,
  onStatusChange,
  onClose,
  onSave,
  isSaving,
}: StatusModalProps) {
  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
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
          {task.title}
        </h3>
        <p className={styles.modalSubtitle}>Изменить статус задачи</p>
        <div className={styles.statusPicker}>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.statusOption} ${styles[`statusOption_${opt.value}`]} ${currentStatus === opt.value ? styles.statusOptionSelected : ''}`}
              onClick={() => onStatusChange(opt.value as TaskStatusType)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving || currentStatus === task.status}
          >
            {isSaving ? 'Сохранение…' : 'Сохранить'}
          </Button>
        </div>
      </div>
    </div>
  );
}
