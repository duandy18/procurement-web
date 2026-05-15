import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useSessionRuntime } from "../../shared/runtime";

export function RouteLoading() {
  return <div className="route-loading">页面加载中…</div>;
}

export function ForbiddenPage() {
  return (
    <div className="page-card">
      <h1>无权访问</h1>
      <p>当前账号没有访问该页面的权限。</p>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useSessionRuntime();

  if (loading) return <RouteLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export function RequirePermission({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { loading, isAuthenticated, hasPermission } = useSessionRuntime();

  if (loading) return <RouteLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasPermission(permission)) return <Navigate to="/forbidden" replace />;

  return <>{children}</>;
}
