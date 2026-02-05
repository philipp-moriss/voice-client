import { useContext } from "react";
import { AuthContext } from "../model/auth-context";
import type { AuthContextValue } from "../model/context.types";

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
}