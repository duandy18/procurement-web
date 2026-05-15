// 拆分说明：新建采购单页先对齐 WMS 采购单 UI 骨架；当前不接创建接口、不接 PMS 查询，后续按 procurement-api 合同逐步接入。

import { Link } from "react-router-dom";

import PageTitle from "../../../components/ui/PageTitle";
import { PurchaseOrderCreateHeaderForm } from "./create/components/PurchaseOrderCreateHeaderForm";
import { PurchaseOrderCreateLinesEditor } from "./create/components/PurchaseOrderCreateLinesEditor";

export default function PurchaseOrderCreatePage() {
  return (
    <div className="page-stack">
      <PageTitle
        title="新建采购单"
        description="录入采购计划并创建采购单。当前先完成 UI 骨架，后续接入供应商、PMS 商品、单位和创建合同。"
        actions={
          <Link className="button button-secondary" to="/procurement/purchase-orders">
            返回采购列表
          </Link>
        }
      />

      <div className="alert">
        当前页面只做 UI 骨架：不提交数据、不直连 PMS、不调用 WMS 旧采购接口。采购单 owner
        后续只提交到 procurement-api。
      </div>

      <form className="page-stack">
        <PurchaseOrderCreateHeaderForm />
        <PurchaseOrderCreateLinesEditor />

        <div className="page-card">
          <div className="table-header">
            <div>
              <h2>提交区</h2>
              <p className="cell-muted">
                后续补齐 procurement-api 创建合同和 PMS HTTP 查询后启用。
              </p>
            </div>

            <button type="button" className="button button-primary" disabled>
              创建采购单
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
