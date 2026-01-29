import styles from './layout.module.css';
import { Button } from '@/shared/ui/Button';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@features/auth';
import { ROUTES } from '@shared/routes';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const isSignIn = location.pathname === ROUTES.SIGN_IN || location.pathname === ROUTES.SIGN_IN_CALLBACK;

  const handleCreateTask = () => {
    navigate('/task/create');
  };

  const handleSignOut = () => {
    logout();
    navigate(ROUTES.SIGN_IN, { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isSignIn ? 'Вход' : 'Управление задачами'}
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isAuthenticated && !isSignIn && (
              <>
                <Button onClick={handleCreateTask}>+ Создать задачу</Button>
                <Button onClick={handleSignOut}>Выйти</Button>
              </>
            )}
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
