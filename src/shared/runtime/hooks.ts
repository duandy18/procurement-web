import { useContext, useMemo } from "react";

import { SessionRuntimeContext } from "./context";

export function useSessionRuntime() {
  const ctx = useContext(SessionRuntimeContext);
  if (!ctx) {
    throw new Error("useSessionRuntime must be used inside SessionRuntimeProvider");
  }
  return ctx;
}

export function usePermissionRuntime() {
  const { user, hasPermission } = useSessionRuntime();
  const permissions = useMemo(() => user?.permissions ?? [], [user?.permissions]);

  return useMemo(
    () => ({
      permissions,
      can: hasPermission,
      canAny: (items: string[]) => items.some((item) => hasPermission(item)),
      canAll: (items: string[]) => items.every((item) => hasPermission(item)),
    }),
    [hasPermission, permissions],
  );
}
