// 拆分说明：本文件已从“采购列表加载 + 筛选 + 同步 + 表格展示”收薄为装配层；运行状态拆入 list/model，工具条/表格/同步结果分别拆入 list/components。

import { useNavigate } from "react-router-dom";

import PageTitle from "../../../components/ui/PageTitle";
import { PurchaseOrdersTable } from "./list/components/PurchaseOrdersTable";
import { PurchaseOrdersToolbar } from "./list/components/PurchaseOrdersToolbar";
import { WmsReceivingSyncResultPanel } from "./list/components/WmsReceivingSyncResultPanel";
import { usePurchaseOrdersPageController } from "./list/model/usePurchaseOrdersPageController";

export default function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const controller = usePurchaseOrdersPageController();

  return (
    <div className="page-stack">
      <PageTitle
        title="采购列表"
        description="采购系统 owner 数据列表。WMS 收货结果通过同步动作回传采购完成状态。"
      />

      {controller.syncState.error ? (
        <div className="alert alert-error">{controller.syncState.error}</div>
      ) : null}

      {controller.syncState.result ? (
        <WmsReceivingSyncResultPanel result={controller.syncState.result} />
      ) : null}

      <PurchaseOrdersToolbar
        filters={controller.filters}
        loading={controller.loadState.state === "loading"}
        syncing={controller.syncState.syncing}
        onChangeSearchText={controller.setSearchText}
        onChangeStatus={controller.setStatus}
        onSubmit={controller.applyFilters}
        onReset={controller.resetFilters}
        onRefresh={() => {
          void controller.reload();
        }}
        onOpenCreate={() => navigate("/procurement/purchase-orders/new")}
        onSyncWmsReceiving={() => {
          void controller.syncWmsReceiving();
        }}
      />

      <PurchaseOrdersTable rows={controller.rows} loadState={controller.loadState} />
    </div>
  );
}
