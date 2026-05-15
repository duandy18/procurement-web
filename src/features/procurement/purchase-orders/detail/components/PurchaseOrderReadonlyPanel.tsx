// 拆分说明：从 PurchaseOrderDetailPage.tsx 抽出采购单头只读信息区，页面层不再直接承载展示细节。

import type { PurchaseOrderOut } from "../../../../../domains/procurement/read/purchaseOrdersClient";
import {
  completionClass,
  completionLabel,
  formatAmount,
  formatDateTime,
  statusLabel,
} from "../utils";

export function PurchaseOrderReadonlyPanel({ order }: { order: PurchaseOrderOut }) {
  return (
    <div className="page-card">
      <h2>采购单头</h2>
      <dl className="description-list">
        <div>
          <dt>采购单号</dt>
          <dd>{order.po_no}</dd>
        </div>
        <div>
          <dt>供应商</dt>
          <dd>
            {order.supplier_name_snapshot}（{order.supplier_code_snapshot}）
          </dd>
        </div>
        <div>
          <dt>目标仓库</dt>
          <dd>
            {order.target_warehouse_name_snapshot || "-"}（
            {order.target_warehouse_code_snapshot || `#${order.target_warehouse_id}`}）
          </dd>
        </div>
        <div>
          <dt>采购人</dt>
          <dd>{order.purchaser}</dd>
        </div>
        <div>
          <dt>采购时间</dt>
          <dd>{formatDateTime(order.purchase_time)}</dd>
        </div>
        <div>
          <dt>订单状态</dt>
          <dd>
            <span className="status-pill status-muted">{statusLabel(order.status)}</span>
          </dd>
        </div>
        <div>
          <dt>完成状态</dt>
          <dd>
            <span className={completionClass(order.completion_status)}>
              {completionLabel(order.completion_status)}
            </span>
          </dd>
        </div>
        <div>
          <dt>计划 / 已收 / 剩余</dt>
          <dd>
            {order.total_ordered_base} / {order.total_received_base} /{" "}
            {order.total_remaining_base}
          </dd>
        </div>
        <div>
          <dt>最后收货时间</dt>
          <dd>{formatDateTime(order.last_received_at)}</dd>
        </div>
        <div>
          <dt>总金额</dt>
          <dd>{formatAmount(order.total_amount)}</dd>
        </div>
        <div>
          <dt>备注</dt>
          <dd>{order.remark || "-"}</dd>
        </div>
      </dl>
    </div>
  );
}
