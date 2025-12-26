import { useNavigate } from 'react-router-dom';
import { CreateTaskForm } from '@features/tasks/create-task';
import { Button, Card } from '@shared/ui';
import styles from './TaskCreatePage.module.css';

export function TaskCreatePage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTaskCreated = () => {
    navigate('/');
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
          <h2 className={styles.title}>Создать новую задачу</h2>
          <CreateTaskForm onSuccess={handleTaskCreated} />
        </Card>
      </div>
    </div>
  );
}

