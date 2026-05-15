import { lazy } from "react";

export const LoginPage = lazy(() => import("../../features/auth/LoginPage"));

export const PurchaseOrdersPage = lazy(
  () => import("../../features/procurement/purchase-orders/PurchaseOrdersPage"),
);

export const PurchaseOrderCreatePage = lazy(
  () => import("../../features/procurement/purchase-orders/PurchaseOrderCreatePage"),
);

export const UsersPage = lazy(
  () => import("../../features/procurement/system/users/UsersPage"),
);
