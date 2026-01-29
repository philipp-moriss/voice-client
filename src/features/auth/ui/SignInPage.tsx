import { useEffect, useRef } from 'react';
import { envConfig } from '@shared/config/env';
import { ROUTES } from '@shared/routes';

const TELEGRAM_SCRIPT_URL = 'https://telegram.org/js/telegram-widget.js?22';

export function SignInPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const botUsername = envConfig.TELEGRAM_BOT_USERNAME;

  useEffect(() => {
    if (!botUsername || !containerRef.current) return;

    const script = document.createElement('script');
    script.src = TELEGRAM_SCRIPT_URL;
    script.async = true;
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute(
      'data-auth-url',
      `${window.location.origin}${ROUTES.SIGN_IN_CALLBACK}`,
    );
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
      {botUsername ? (
        <>
          <div ref={containerRef} data-testid="telegram-login-widget" />
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
            Если виджет показывает «Bot domain invalid» — в BotFather отправьте /setdomain и укажите домен этой страницы (без https:// и порта). Локально: используйте 127.0.0.1 или туннель (ngrok).
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
