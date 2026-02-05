import { AuthContext, clearStoredAuth, getStoredToken, getStoredUser, setStoredAuth } from "@shared/auth";
import type { AuthContextValue, AuthUser } from "@shared/auth";
import type { ReactNode } from "react";

import { useCallback, useMemo, useState } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => getStoredToken());
    const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  
    const setAuth = useCallback((newToken: string, newUser: AuthUser) => {
      setStoredAuth(newToken, newUser);
      setToken(newToken);
      setUser(newUser);
    }, []);
  
    const logout = useCallback(() => {
      clearStoredAuth();
      setToken(null);
      setUser(null);
    }, []);
  
    const value = useMemo<AuthContextValue>(
      () => ({
        user,
        token,
        isAuthenticated: !!token,
        setAuth,
        logout,
      }),
      [user, token, setAuth, logout],
    );
  
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }