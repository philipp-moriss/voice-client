/**
 * Проверяет, открыто ли приложение внутри Telegram Mini App (WebApp).
 * Если false — фронт открыт в обычном браузере (можно предлагать установку PWA).
 */
export function isTelegramWebApp(): boolean {
  if (typeof window === 'undefined') return false;
  const tg = (window as Window & { Telegram?: { WebApp?: { initData?: string } } }).Telegram;
  return Boolean(tg?.WebApp?.initData?.trim());
}

/**
 * Приложение уже запущено как установленное PWA (standalone).
 */
export function isPWAStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}
