import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@shared/api/axios-instance';
import { envConfig } from '@shared/config/env';
import { ROUTES } from '@shared/routes';
import { useAuth } from '../context/auth-context';

const TELEGRAM_SCRIPT_URL = 'https://telegram.org/js/telegram-widget.js?22';

/** Формат объекта из Telegram Widget (data-onauth), см. https://core.telegram.org/widgets/login */
interface TelegramWidgetUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const GLOBAL_CALLBACK_NAME = 'onTelegramAuthCallback';

export function SignInPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const botUsername = envConfig.TELEGRAM_BOT_USERNAME;
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTelegramAuth = useCallback(
    async (user: TelegramWidgetUser) => {
      setError(null);
      setLoading(true);
      try {
        const { data } = await apiClient.post<{
          accessToken: string;
          user: { id: number; telegramId: string; firstName: string | null; lastName: string | null; username: string | null };
        }>('/auth/telegram', user);
        setAuth(data.accessToken, data.user);
        navigate(ROUTES.TASK_LIST, { replace: true });
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string | string[] }; status?: number }; code?: string };
        const msg = e.response?.data?.message
          ? Array.isArray(e.response.data.message) ? e.response.data.message.join(', ') : e.response.data.message
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

  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;
    win[GLOBAL_CALLBACK_NAME] = (user: TelegramWidgetUser) => {
      handleTelegramAuth(user);
    };
    return () => {
      delete win[GLOBAL_CALLBACK_NAME];
    };
  }, [handleTelegramAuth]);

  useEffect(() => {
    if (!botUsername || !containerRef.current) return;

    const script = document.createElement('script');
    script.src = TELEGRAM_SCRIPT_URL;
    script.async = true;
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', GLOBAL_CALLBACK_NAME);
    script.setAttribute('data-request-access', 'write');

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);
  }, [botUsername]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem' }}>Вход</h1>
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        Войдите через Telegram, чтобы видеть свои задачи.
      </p>
      {loading && <p style={{ marginTop: '1rem', color: '#666' }}>Выполняется вход…</p>}
      {error && (
        <p style={{ marginTop: '1rem', color: '#c00', fontSize: '0.9rem' }}>{error}</p>
      )}
      {botUsername ? (
        <>
          <div ref={containerRef} data-testid="telegram-login-widget" />
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
            Если виджет показывает «Bot domain invalid» — в BotFather отправьте /setdomain и укажите домен этой страницы (без https:// и порта).
          </p>
        </>
      ) : (
        <p style={{ color: '#c00' }}>
          Укажите VITE_TELEGRAM_BOT_USERNAME в .env для виджета входа.
        </p>
      )}
    </div>
  );
}
