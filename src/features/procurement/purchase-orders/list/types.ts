// 拆分说明：从 PurchaseOrdersPage.tsx 抽出采购列表页面状态类型，页面层只负责装配。

import type { WmsReceivingInboxSyncAndApplyOut } from "../../../../domains/procurement/ops/wmsReceivingInboxOpsClient";
import type { PurchaseOrderOut } from "../../../../domains/procurement/read/purchaseOrdersClient";

export interface PurchaseOrdersFilters {
  q: string;
  status: string;
}

export type PurchaseOrdersLoadState =
  | { state: "idle" | "loading" }
  | { state: "success"; rows: PurchaseOrderOut[] }
  | { state: "error"; message: string };

export interface PurchaseOrdersSyncState {
  syncing: boolean;
  error: string;
  result: WmsReceivingInboxSyncAndApplyOut | null;
}
