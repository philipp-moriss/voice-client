import styles from './layout.module.css'
import { Button } from '@/shared/ui/Button'
import { Outlet, useNavigate } from 'react-router-dom'

export const Layout = () => {
  const navigate = useNavigate();
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

      <Outlet />
    </div>
  </div>
  )
}
