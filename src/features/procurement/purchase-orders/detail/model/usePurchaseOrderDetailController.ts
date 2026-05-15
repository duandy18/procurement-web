// 拆分说明：从 PurchaseOrderDetailPage.tsx 抽出详情页运行模型，统一承接详情加载与错误状态。

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  type PurchaseOrderOut,
  fetchPurchaseOrder,
} from "../../../../../domains/procurement/read/purchaseOrdersClient";

type LoadState =
  | { state: "loading" }
  | { state: "success"; data: PurchaseOrderOut }
  | { state: "error"; message: string };

export function usePurchaseOrderDetailController() {
  const params = useParams<{ poId: string }>();
  const poId = Number(params.poId);
  const [loadState, setLoadState] = useState<LoadState>({ state: "loading" });

  useEffect(() => {
    let alive = true;

    if (!Number.isInteger(poId) || poId <= 0) {
      setLoadState({ state: "error", message: "采购单 ID 无效" });
      return () => {
        alive = false;
      };
    }

    setLoadState({ state: "loading" });

    fetchPurchaseOrder(poId)
      .then((data) => {
        if (alive) {
          setLoadState({ state: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (alive) {
          setLoadState({
            state: "error",
            message: error instanceof Error ? error.message : "加载采购单详情失败",
          });
        }
      });

    return () => {
      alive = false;
    };
  }, [poId]);

  return { poId, loadState };
}
