import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@shared/api/axios-instance';
import { useAuth } from '../context/auth-context';
import { ROUTES } from '@shared/routes';

interface TelegramPayload {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  auth_date: number;
  hash: string;
}

function parseHashParams(hash: string): Record<string, string> {
  const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
  const params: Record<string, string> = {};
  trimmed.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key && value) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });
  return params;
}

function hashParamsToPayload(params: Record<string, string>): TelegramPayload {
  const id = Number(params.id);
  const auth_date = Number(params.auth_date);
  const hash = params.hash ?? '';
  if (!id || !auth_date || !hash) {
    throw new Error('Missing required Telegram auth fields');
  }
  return {
    id,
    first_name: params.first_name,
    last_name: params.last_name,
    username: params.username,
    auth_date,
    hash,
  };
}

export function SignInCallbackPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const from = ROUTES.TASK_LIST;

    if (!hash) {
      setError('Нет данных от Telegram. Попробуйте войти снова.');
      return;
    }

    const params = parseHashParams(hash);
    let payload: TelegramPayload;
    try {
      payload = hashParamsToPayload(params);
    } catch (e) {
      setError('Неверные данные авторизации.');
      return;
    }

    apiClient
      .post<{ accessToken: string; user: { id: number; telegramId: string; firstName: string | null; lastName: string | null; username: string | null } }>(
        '/auth/telegram',
        payload,
      )
      .then((res) => {
        setAuth(res.data.accessToken, res.data.user);
        navigate(from, { replace: true });
      })
      .catch(() => {
        setError('Ошибка входа. Проверьте данные и попробуйте снова.');
      });
  }, [navigate, setAuth]);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#c00', marginBottom: '1rem' }}>{error}</p>
        <a href={ROUTES.SIGN_IN}>Вернуться к входу</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Выполняется вход…</p>
    </div>
  );
}
