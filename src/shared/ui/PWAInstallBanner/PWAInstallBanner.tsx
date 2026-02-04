import { useCallback, useEffect, useState } from 'react';
import { isPWAStandalone, isTelegramWebApp } from '@shared/lib';
import styles from './PWAInstallBanner.module.css';

const BANNER_DISMISSED_KEY = 'pwa-install-banner-dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isTelegramWebApp() || isPWAStandalone()) return;
    try {
      const wasDismissed = localStorage.getItem(BANNER_DISMISSED_KEY) === '1';
      if (wasDismissed) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDismissed(true);
        return;
      }
    } catch {
      // ignore
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    try {
      localStorage.setItem(BANNER_DISMISSED_KEY, '1');
    } catch {
      // ignore
    }
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className={styles.banner} role="banner">
      <p className={styles.text}>
        Установите приложение на устройство для быстрого доступа и работы офлайн.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.installBtn} onClick={handleInstall}>
          Установить
        </button>
        <button type="button" className={styles.dismissBtn} onClick={handleDismiss} aria-label="Закрыть">
          Позже
        </button>
      </div>
    </div>
  );
}
