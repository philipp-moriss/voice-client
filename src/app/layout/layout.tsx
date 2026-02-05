import styles from './layout.module.css';
import { Button } from '@/shared/ui/Button';
import { PWAInstallBanner } from '@/shared/ui/PWAInstallBanner';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@features/auth';
import { ROUTES } from '@shared/routes';
import { ProfileIcon } from '@shared/ui/icons';

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isSignIn = location.pathname === ROUTES.SIGN_IN || location.pathname === ROUTES.SIGN_IN_CALLBACK;

  const handleCreateTask = () => {
    navigate('/task/create');
  };

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isSignIn ? 'Вход' : 'Управление задачами'}
          </h1>
          <div className={styles.actions}>
            {isAuthenticated && !isSignIn && (
              <>
                <Button onClick={handleCreateTask}>+ Создать задачу</Button>
                <button
                  type="button"
                  className={styles.profileButton}
                  onClick={handleProfileClick}
                  aria-label="Профиль"
                >
                  <ProfileIcon size={28} />
                </button>
              </>
            )}
          </div>
        </div>

        <Outlet />
      </div>
      <PWAInstallBanner />
    </div>
  );
};
