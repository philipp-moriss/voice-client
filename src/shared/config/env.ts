export type EnvConfig = {
  API_URL: string;
  TELEGRAM_BOT_USERNAME: string;
};

export const envConfig: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TELEGRAM_BOT_USERNAME: import.meta.env.VITE_TELEGRAM_BOT_USERNAME || '',
} as const;

