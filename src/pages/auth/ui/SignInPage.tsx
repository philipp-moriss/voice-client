import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginButton } from '@telegram-auth/react';
import { apiClient } from '@shared/api/axios-instance';
import { envConfig } from '@shared/config/env';
import { ROUTES } from '@shared/routes';
import { useAuth } from '@/shared/auth';

/** Данные из Telegram Login Widget, см. https://core.telegram.org/widgets/login */
interface TelegramAuthData {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export function SignInPage() {
  const botUsername = envConfig.TELEGRAM_BOT_USERNAME;
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = useCallback(
    async (data: TelegramAuthData) => {
      setError(null);
      setLoading(true);
      try {
        const { data: res } = await apiClient.post<{
          accessToken: string;
          user: {
            id: number;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            username: string | null;
          };
        }>('/auth/telegram', data);
        setAuth(res.accessToken, res.user);
        navigate(ROUTES.TASK_LIST, { replace: true });
      } catch (err: unknown) {
        const e = err as {
          response?: { data?: { message?: string | string[] }; status?: number };
          code?: string;
        };
        const msg = e.response?.data?.message
          ? Array.isArray(e.response.data.message)
            ? e.response.data.message.join(', ')
            : e.response.data.message
          : e.code === 'ERR_NETWORK'
            ? 'Бэкенд недоступен. Проверьте VITE_API_URL.'
            : e.response?.status === 401
              ? 'Неверные данные от Telegram.'
              : 'Ошибка входа. Попробуйте снова.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [setAuth, navigate],
  );

  // Telegram Mini App: ждём window.Telegram и initData (могут появиться с задержкой), затем автовход
  useEffect(() => {
    const win = window as Window & { Telegram?: { WebApp?: { initData?: string; ready?: () => void } } };
    let cancelled = false;

    function tryAuth(initData: string) {
      if (!initData?.trim() || cancelled) return;
      setLoading(true);
      win.Telegram?.WebApp?.ready?.();
      apiClient
        .post<{
          accessToken: string;
          user: {
            id: number;
            telegramId: string;
            firstName: string | null;
            lastName: string | null;
            username: string | null;
          };
        }>('/auth/telegram-webapp', { initData })
        .then(({ data: res }) => {
          if (!cancelled) {
            setAuth(res.accessToken, res.user);
            navigate(ROUTES.TASK_LIST, { replace: true });
          }
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            const e = err as {
              response?: { data?: { message?: string | string[] }; status?: number };
              code?: string;
            };
            const msg = e.response?.data?.message
              ? Array.isArray(e.response.data.message)
                ? (e.response.data.message as string[]).join(', ')
                : (e.response.data.message as string)
              : e.code === 'ERR_NETWORK'
                ? 'Бэкенд недоступен. Проверьте VITE_API_URL.'
                : e.response?.status === 401
                  ? 'Неверные данные от Telegram.'
                  : 'Ошибка входа. Попробуйте снова.';
            setError(msg);
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    const initialData = win.Telegram?.WebApp?.initData;
    if (initialData?.trim()) {
      tryAuth(initialData);
      return () => {
        cancelled = true;
      };
    }

    // В Mini App объект Telegram может внедряться с задержкой — опрашиваем до 3 с
    let attempts = 0;
    const maxAttempts = 30;
    const interval = setInterval(() => {
      if (cancelled || attempts >= maxAttempts) {
        clearInterval(interval);
        if (!cancelled && attempts >= maxAttempts) {
          setError(
            'Не удалось получить данные авторизации. Откройте приложение из меню бота (кнопка с приложением в Telegram), а не из обычной клавиатуры.',
          );
        }
        return;
      }
      attempts += 1;
      const data = (window as typeof win).Telegram?.WebApp?.initData;
      if (data?.trim()) {
        clearInterval(interval);
        tryAuth(data);
      }
    }, 100);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [setAuth, navigate]);

  // Telegram redirect flow: after auth Telegram redirects back with hash (#id=...&auth_date=...&hash=...)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const hasTelegramParams = hash.includes('id=') && hash.includes('auth_date=') && hash.includes('hash=');
    if (hasTelegramParams) {
      navigate(ROUTES.SIGN_IN_CALLBACK + hash, { replace: true });
    }
  }, [navigate]);

  const isMiniApp =
    typeof window !== 'undefined' &&
    !!(window as { Telegram?: { WebApp?: unknown } }).Telegram?.WebApp
    && (window as { Telegram?: { WebApp?: { initData?: string } } }).Telegram?.WebApp?.initData !== "";

  if (!botUsername && !isMiniApp) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem' }}>Вход</h1>
        <p style={{ color: '#c00' }}>
          Укажите VITE_TELEGRAM_BOT_USERNAME в .env для виджета входа.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem' }}>Вход</h1>
      {isMiniApp ? (
        <>
          {loading && <p style={{ marginBottom: '1rem', color: '#666' }}>Выполняется вход…</p>}
          {error && (
            <p style={{ marginBottom: '1rem', color: '#c00', fontSize: '0.9rem' }}>{error}</p>
          )}
          {!loading && !error && (
            <p style={{ color: '#666' }}>Проверка авторизации…</p>
          )}
        </>
      ) : (
        <>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Войдите через Telegram, чтобы видеть свои задачи.
          </p>
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#555' }}>
            После нажатия кнопки подтвердите доступ в Telegram — откроется список задач.
          </p>
          {loading && <p style={{ marginBottom: '1rem', color: '#666' }}>Выполняется вход…</p>}
          {error && (
            <p style={{ marginBottom: '1rem', color: '#c00', fontSize: '0.9rem' }}>{error}</p>
          )}
          <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
            <LoginButton
              botUsername={botUsername.replace(/^@/, '')}
              onAuthCallback={handleAuth}
              buttonSize="large"
              cornerRadius={8}
              showAvatar={true}
              lang="ru"
            />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#888' }}>
            Если виджет показывает «Bot domain invalid» — в BotFather отправьте /setdomain и укажите
            домен этой страницы (без https:// и порта).
          </p>
        </>
      )}
    </div>
  );
}
