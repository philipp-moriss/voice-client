import { useNavigate } from 'react-router-dom';
import { UpdateTaskForm } from '@features/tasks/update-task';
import { Button, Card } from '@shared/ui';
import styles from './edit.module.css';

export function TaskEditPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Button variant="secondary" onClick={handleGoBack}>
            ← Назад
          </Button>
        </div>
        <Card>
          <UpdateTaskForm />
        </Card>
      </div>
    </div>
  );
}

