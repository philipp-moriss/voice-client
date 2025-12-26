import { useState } from 'react';
import { CreateTaskForm } from '@features/tasks/create-task';
import { TaskList } from '@features/tasks/task-list';
import { Card } from '@shared/ui';
import styles from './TasksListPage.module.css';

export function TasksListPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleTaskDeleted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Управление задачами</h1>
        
        <Card className={styles.createCard}>
          <h2 className={styles.sectionTitle}>Создать новую задачу</h2>
          <CreateTaskForm onSuccess={handleTaskCreated} />
        </Card>

        <div className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Список задач</h2>
          <TaskList key={refreshKey} onTaskDeleted={handleTaskDeleted} />
        </div>
      </div>
    </div>
  );
}

