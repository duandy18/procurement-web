// 拆分说明：新建采购单页已接入 procurement-api 创建合同；供应商、商品、单位通过 procurement-api PMS BFF 读取，仓库通过 procurement-api WMS BFF 读取；前端不直连 PMS / WMS，不调用 WMS 旧采购接口。

import { Link } from "react-router-dom";

import PageTitle from "../../../components/ui/PageTitle";
import { PurchaseOrderCreateHeaderForm } from "./create/components/PurchaseOrderCreateHeaderForm";
import { PurchaseOrderCreateLinesEditor } from "./create/components/PurchaseOrderCreateLinesEditor";
import { usePurchaseOrderCreateController } from "./create/model/usePurchaseOrderCreateController";

export default function PurchaseOrderCreatePage() {
  const controller = usePurchaseOrderCreateController();

  return (
    <div className="page-stack">
      <PageTitle
        title="新建采购单"
        description="录入采购计划并创建采购单。供应商、商品、单位、仓库均通过 procurement-api BFF 读取。"
        actions={
          <Link className="button button-secondary" to="/procurement/purchase-orders">
            返回采购列表
          </Link>
        }
      />

      {controller.error ? <div className="alert alert-error">{controller.error}</div> : null}
      {controller.message ? <div className="alert">{controller.message}</div> : null}

      <form
        className="page-stack"
        onSubmit={(event) => {
          event.preventDefault();
          void controller.submit();
        }}
      >
        <PurchaseOrderCreateHeaderForm
          header={controller.header}
          suppliers={controller.suppliers}
          warehouses={controller.warehouses}
          loadingSuppliers={controller.loadingSuppliers}
          loadingWarehouses={controller.loadingWarehouses}
          onChangeSupplier={controller.changeSupplier}
          onChangeHeader={controller.updateHeader}
          onReloadSuppliers={() => {
            void controller.loadSuppliers();
          }}
          onReloadWarehouses={() => {
            void controller.loadWarehouses();
          }}
        />

        <PurchaseOrderCreateLinesEditor
          supplierSelected={Boolean(controller.header.supplierId)}
          itemKeyword={controller.itemKeyword}
          items={controller.items}
          lines={controller.lines}
          uomsByLineId={controller.uomsByLineId}
          loadingItems={controller.loadingItems}
          onChangeItemKeyword={controller.setItemKeyword}
          onSearchItems={() => {
            void controller.loadItems();
          }}
          onAddLine={controller.addLine}
          onRemoveLine={controller.removeLine}
          onChangeLine={controller.updateLine}
          onChangeLineItem={(clientId, itemId) => {
            void controller.changeLineItem(clientId, itemId);
          }}
        />

        <div className="page-card">
          <div className="table-header">
            <div>
              <h2>提交区</h2>
              <p className="cell-muted">
                创建后写入 procurement owner 表，并初始化采购完成状态；WMS 只负责后续收货回传。
              </p>
            </div>

            <button type="submit" className="button button-primary" disabled={controller.submitting}>
              {controller.submitting ? "创建中…" : "创建采购单"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
