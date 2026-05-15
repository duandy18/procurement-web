import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { apiGet, apiPost, getAccessToken, setAccessToken } from "../../lib/api";
import { SessionRuntimeContext } from "./context";
import type { LoginInput, MyNavigation, SessionRuntimeValue, UserMe } from "./types";

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in?: number | null;
}

export function SessionRuntimeProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMe | null>(null);
  const [navigation, setNavigation] = useState<MyNavigation | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(getAccessToken()));

  const refresh = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setNavigation(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [nextUser, nextNavigation] = await Promise.all([
        apiGet<UserMe>("/users/me"),
        apiGet<MyNavigation>("/users/me/navigation"),
      ]);

      setUser(nextUser);
      setNavigation(nextNavigation);
    } catch {
      setAccessToken(null);
      setUser(null);
      setNavigation(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setAccessToken(null);
      setUser(null);
      setNavigation(null);
      setLoading(false);
      return;
    }

    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (input: LoginInput) => {
      const response = await apiPost<LoginResponse>("/users/login", input);
      setAccessToken(response.access_token);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setNavigation(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => Boolean(user?.permissions.includes(permission)),
    [user],
  );

  const value = useMemo<SessionRuntimeValue>(
    () => ({
      user,
      navigation,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refresh,
      hasPermission,
    }),
    [hasPermission, loading, login, logout, navigation, refresh, user],
  );

  return <SessionRuntimeContext.Provider value={value}>{children}</SessionRuntimeContext.Provider>;
}
