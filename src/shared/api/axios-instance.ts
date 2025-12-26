import axios from 'axios';

const BASE_URL = 'https://voice-bot-helper-production.up.railway.app';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

