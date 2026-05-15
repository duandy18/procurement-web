import { Suspense, type ReactElement, type ReactNode } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layout/AppLayout";
import {
  LoginPage,
  PurchaseOrderCreatePage,
  PurchaseOrdersPage,
  UsersPage,
} from "./lazyPages";

function withSuspense(element: ReactNode): ReactElement {
  return <Suspense fallback={<div className="route-loading">页面加载中…</div>}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/procurement/purchase-orders" replace />,
      },
      {
        path: "login",
        element: withSuspense(<LoginPage />),
      },
      {
        path: "procurement",
        element: <Navigate to="/procurement/purchase-orders" replace />,
      },
      {
        path: "procurement/purchase-orders",
        element: withSuspense(<PurchaseOrdersPage />),
      },
      {
        path: "procurement/purchase-orders/new",
        element: withSuspense(<PurchaseOrderCreatePage />),
      },
      {
        path: "procurement/system/users",
        element: withSuspense(<UsersPage />),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/procurement/purchase-orders" replace />,
  },
]);
