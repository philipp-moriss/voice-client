import { UpdateTaskForm } from '@features/tasks/update-task';
import { Card } from '@shared/ui';
import styles from './TaskEditPage.module.css';

export function TaskEditPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Card>
          <UpdateTaskForm />
        </Card>
      </div>
    </div>
  );
}

