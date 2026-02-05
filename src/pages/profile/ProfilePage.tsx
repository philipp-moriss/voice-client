import { useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth';
import { Button } from '@shared/ui';
import { ROUTES } from '@shared/routes';
import { ProfileIcon } from '@shared/ui/icons';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGN_IN, { replace: true });
  };

  const handleBack = () => {
    navigate(ROUTES.TASK_LIST);
  };

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Пользователь';

  return (
    <div className={styles.profile}>
      <div className={styles.card}>
        <Button variant="primary" onClick={handleBack} className={styles.backLink}>
          ← К задачам
        </Button>
        <div className={styles.avatar}>
          <ProfileIcon size={64} />
        </div>
        <h2 className={styles.title}>Профиль</h2>
        <dl className={styles.info}>
          <div className={styles.row}>
            <dt className={styles.term}>Имя</dt>
            <dd className={styles.desc}>{displayName}</dd>
          </div>
          {user?.username && (
            <div className={styles.row}>
              <dt className={styles.term}>Username</dt>
              <dd className={styles.desc}>@{user.username}</dd>
            </div>
          )}
          {user?.telegramId && (
            <div className={styles.row}>
              <dt className={styles.term}>Telegram ID</dt>
              <dd className={styles.desc}>{user.telegramId}</dd>
            </div>
          )}
        </dl>

        <Button variant="danger" onClick={handleLogout} className={styles.logoutBtn}>
          Выйти
        </Button>
      </div>
    </div>
  );
}
