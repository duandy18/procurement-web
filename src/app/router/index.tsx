import { Suspense, type ReactElement, type ReactNode } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layout/AppLayout";
import { ForbiddenPage, RequireAuth, RequirePermission } from "./guards";
import {
  LoginPage,
  PurchaseOrderCreatePage,
  PurchaseOrderDetailPage,
  PurchaseOrdersPage,
  UsersPage,
} from "./lazyPages";

const PROCUREMENT_PURCHASE_READ = "page.procurement.purchase.read";
const PROCUREMENT_SYSTEM_READ = "page.procurement.system.read";

function withSuspense(element: ReactNode): ReactElement {
  return <Suspense fallback={<div className="route-loading">页面加载中…</div>}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: withSuspense(<LoginPage />),
  },
  {
    path: "/forbidden",
    element: <ForbiddenPage />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/procurement/purchase-orders" replace />,
      },
      {
        path: "procurement",
        element: <Navigate to="/procurement/purchase-orders" replace />,
      },
      {
        path: "procurement/purchase-orders",
        element: (
          <RequirePermission permission={PROCUREMENT_PURCHASE_READ}>
            {withSuspense(<PurchaseOrdersPage />)}
          </RequirePermission>
        ),
      },
      {
        path: "procurement/purchase-orders/new",
        element: (
          <RequirePermission permission={PROCUREMENT_PURCHASE_READ}>
            {withSuspense(<PurchaseOrderCreatePage />)}
          </RequirePermission>
        ),
      },
      {
        path: "procurement/purchase-orders/:poId",
        element: (
          <RequirePermission permission={PROCUREMENT_PURCHASE_READ}>
            {withSuspense(<PurchaseOrderDetailPage />)}
          </RequirePermission>
        ),
      },
      {
        path: "procurement/system/users",
        element: (
          <RequirePermission permission={PROCUREMENT_SYSTEM_READ}>
            {withSuspense(<UsersPage />)}
          </RequirePermission>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/procurement/purchase-orders" replace />,
  },
]);
