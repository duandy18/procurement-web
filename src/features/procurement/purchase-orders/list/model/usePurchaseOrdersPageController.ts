// 拆分说明：从 PurchaseOrdersPage.tsx 抽出采购列表运行模型，统一承接筛选、加载、WMS 收货同步刷新。

import { useCallback, useEffect, useState, type FormEvent } from "react";

import { syncAndApplyWmsReceivingInbox } from "../../../../../domains/procurement/ops/wmsReceivingInboxOpsClient";
import { fetchPurchaseOrders } from "../../../../../domains/procurement/read/purchaseOrdersClient";
import type {
  PurchaseOrdersFilters,
  PurchaseOrdersLoadState,
  PurchaseOrdersSyncState,
} from "../types";

const emptyFilters: PurchaseOrdersFilters = { q: "", status: "" };

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message.trim() ? error.message : fallback;
}

export function usePurchaseOrdersPageController() {
  const [filters, setFilters] = useState<PurchaseOrdersFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<PurchaseOrdersFilters>(emptyFilters);
  const [loadState, setLoadState] = useState<PurchaseOrdersLoadState>({ state: "idle" });
  const [syncState, setSyncState] = useState<PurchaseOrdersSyncState>({
    syncing: false,
    error: "",
    result: null,
  });

  const loadOrders = useCallback(async () => {
    setLoadState({ state: "loading" });

    try {
      const rows = await fetchPurchaseOrders({
        limit: 100,
        q: appliedFilters.q || undefined,
        status: appliedFilters.status || undefined,
      });
      setLoadState({ state: "success", rows });
    } catch (error) {
      setLoadState({
        state: "error",
        message: getErrorMessage(error, "加载采购列表失败"),
      });
    }
  }, [appliedFilters]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  function setSearchText(value: string) {
    setFilters((prev) => ({ ...prev, q: value }));
  }

  function setStatus(value: string) {
    setFilters((prev) => ({ ...prev, status: value }));
  }

  function applyFilters(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setAppliedFilters(filters);
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  }

  async function syncWmsReceiving() {
    setSyncState({ syncing: true, error: "", result: null });

    try {
      const result = await syncAndApplyWmsReceivingInbox({
        after_event_id: 0,
        limit: 200,
        apply_limit: 500,
      });

      setSyncState({ syncing: false, error: "", result });
      await loadOrders();
    } catch (error) {
      setSyncState({
        syncing: false,
        error: getErrorMessage(error, "同步 WMS 收货结果失败"),
        result: null,
      });
    }
  }

  const rows = loadState.state === "success" ? loadState.rows : [];

  return {
    filters,
    loadState,
    rows,
    syncState,

    setSearchText,
    setStatus,
    applyFilters,
    resetFilters,
    reload: loadOrders,
    syncWmsReceiving,
  };
}
