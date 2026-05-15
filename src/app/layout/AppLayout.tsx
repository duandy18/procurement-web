import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout() {
  return (
    <div className="wms-app-shell">
      <Sidebar />
      <div className="wms-app-main">
        <Topbar />
        <main className="wms-app-content">
          <Suspense fallback={<div className="route-loading">页面加载中…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
