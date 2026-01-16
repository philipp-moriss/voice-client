import axios from 'axios';
import { envConfig } from '../config/env';

const BASE_URL = envConfig.API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

