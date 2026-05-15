// 拆分说明：本文件已从“详情加载 + 头部 + 信息区 + 明细表”收薄为装配层；运行状态拆入 detail/model，展示区拆入 detail/components。

import { PurchaseOrderDetailHeader } from "./detail/components/PurchaseOrderDetailHeader";
import { PurchaseOrderLinesTable } from "./detail/components/PurchaseOrderLinesTable";
import { PurchaseOrderReadonlyPanel } from "./detail/components/PurchaseOrderReadonlyPanel";
import { usePurchaseOrderDetailController } from "./detail/model/usePurchaseOrderDetailController";

export default function PurchaseOrderDetailPage() {
  const { loadState } = usePurchaseOrderDetailController();

  if (loadState.state === "loading") {
    return (
      <div className="page-stack">
        <PurchaseOrderDetailHeader order={null} />
        <div className="page-card">加载中…</div>
      </div>
    );
  }

  if (loadState.state === "error") {
    return (
      <div className="page-stack">
        <PurchaseOrderDetailHeader order={null} />
        <div className="alert alert-error">{loadState.message}</div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PurchaseOrderDetailHeader order={loadState.data} />
      <PurchaseOrderReadonlyPanel order={loadState.data} />
      <PurchaseOrderLinesTable order={loadState.data} />
    </div>
  );
}
