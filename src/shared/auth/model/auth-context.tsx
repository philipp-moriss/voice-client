import {
  createContext,
} from 'react';
import type { AuthContextValue } from './context.types';


export const AuthContext = createContext<AuthContextValue | null>(null);


