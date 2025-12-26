import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskList } from '@features/tasks/task-list';
import { Button } from '@shared/ui';
import styles from './TasksListPage.module.css';

export function TasksListPage() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskDeleted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleCreateTask = () => {
    navigate('/task/create');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Управление задачами</h1>
          <Button onClick={handleCreateTask}>
            + Создать задачу
          </Button>
        </div>

        <div className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Список задач</h2>
          <TaskList key={refreshKey} onTaskDeleted={handleTaskDeleted} />
        </div>
      </div>
    </div>
  );
}

