
export type EnvConfig = {
    API_URL: string;
};

export const envConfig: EnvConfig = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
} as const;