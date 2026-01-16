import { TaskList } from '@features/tasks/task-list';
import { useState } from 'react';
import styles from './list.module.css';

export function TasksListPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskDeleted = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={styles.listSection}>
      <h2 className={styles.sectionTitle}>Список задач</h2>
      <TaskList key={refreshKey} onTaskDeleted={handleTaskDeleted} />
    </div>
  );
}

