import { Suspense, type ReactElement, type ReactNode } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layout/AppLayout";
import {
  LoginPage,
  PmsProjectionStatusPage,
  ProcurementDashboardPage,
  PurchaseOrdersPage,
  PurchaseReportsPage,
} from "./lazyPages";

function withSuspense(element: ReactNode): ReactElement {
  return <Suspense fallback={<div className="page-card">页面加载中...</div>}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/procurement" replace />,
      },
      {
        path: "login",
        element: withSuspense(<LoginPage />),
      },
      {
        path: "procurement",
        element: withSuspense(<ProcurementDashboardPage />),
      },
      {
        path: "procurement/purchase-orders",
        element: withSuspense(<PurchaseOrdersPage />),
      },
      {
        path: "procurement/purchase-reports",
        element: withSuspense(<PurchaseReportsPage />),
      },
      {
        path: "procurement/pms-projection-status",
        element: withSuspense(<PmsProjectionStatusPage />),
      },
    ],
  },
]);
