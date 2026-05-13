import { lazy } from "react";

export const LoginPage = lazy(() => import("../../features/auth/LoginPage"));

export const ProcurementDashboardPage = lazy(
  () => import("../../features/procurement/dashboard/ProcurementDashboardPage"),
);

export const PurchaseOrdersPage = lazy(
  () => import("../../features/procurement/purchase-orders/PurchaseOrdersPage"),
);

export const PurchaseReportsPage = lazy(
  () => import("../../features/procurement/purchase-reports/PurchaseReportsPage"),
);

export const PmsProjectionStatusPage = lazy(
  () => import("../../features/procurement/pms-projection-status/PmsProjectionStatusPage"),
);
